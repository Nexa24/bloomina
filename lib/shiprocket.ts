import { createAdminClient } from '@/utils/supabase/admin';

const supabase = createAdminClient();

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

/**
 * Authenticates with Shiprocket using env credentials
 * Returns the JWT token
 */
async function authenticateShiprocket(): Promise<string> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials missing. Please set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in your environment variables.');
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.message || 'Login failed');
    }

    return data.token;
  } catch (error: any) {
    console.error('Shiprocket Authentication Error:', error);
    throw new Error(`Shiprocket Auth Failure: ${error.message}`);
  }
}

/**
 * Creates a shipping order on Shiprocket for a confirmed storefront order
 */
export async function createShiprocketOrder(orderId: string): Promise<any> {
  try {
    // 1. Fetch order details from database
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      throw new Error(`Failed to find order: ${error?.message || 'Not found'}`);
    }

    // 2. Authenticate
    const token = await authenticateShiprocket();

    // 3. Map order items to Shiprocket parameters and merge duplicate SKUs
    const itemsMap = new Map<string, any>();
    for (const item of (order.items || [])) {
      const baseId = item.product_id || item.productId || 'PROD';
      const sizeStr = item.size ? `-${item.size.toString().replace(/\s+/g, '')}` : '';
      const colorStr = item.color ? `-${item.color.toString().replace(/\s+/g, '')}` : '';
      const sku = item.sku || `SKU-${baseId}${sizeStr}${colorStr}`;

      const name = item.title || item.name || 'Product Item';
      const quantity = item.quantity || 1;
      const price = item.price || 0;

      if (itemsMap.has(sku)) {
        const existing = itemsMap.get(sku);
        existing.units += quantity;
      } else {
        itemsMap.set(sku, {
          name: `${name}${item.size ? ` (${item.size})` : ''}${item.color ? ` - ${item.color}` : ''}`,
          sku,
          units: quantity,
          selling_price: price,
          discount: 0,
          tax: 0,
        });
      }
    }
    const orderItems = Array.from(itemsMap.values());
    if (orderItems.length === 0) {
      orderItems.push({
        name: `Order #${order.id.slice(0, 8)} Items`,
        sku: `SKU-${order.id.slice(0, 8)}`,
        units: 1,
        selling_price: order.subtotal || order.total || 0,
        discount: 0,
        tax: 0,
      });
    }

    // Clean phone number (Shiprocket strictly expects 10 digits)
    const cleanPhone = (order.phone || '').replace(/\D/g, '').slice(-10) || '9567797776';
    const cleanPincode = (order.shipping_address?.postalCode || order.shipping_address?.zip || order.shipping_address?.pincode || '').replace(/\D/g, '').slice(0, 6);

    const customerParts = (order.customer_name || 'Customer').trim().split(/\s+/);
    const firstName = customerParts[0] || 'Customer';
    const lastName = customerParts.slice(1).join(' ') || 'Name';

    let pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION_NAME || 'warehouse';

    // 4. Construct Shiprocket adhoc order payload
    const payload = {
      order_id: order.id,
      order_date: new Date(order.created_at || Date.now()).toISOString().split('T')[0],
      pickup_location: pickupLocation,
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.shipping_address?.address || order.shipping_address?.street || 'Pushpagiri',
      billing_city: order.shipping_address?.city || 'Calicut',
      billing_pincode: cleanPincode || '673604',
      billing_state: order.shipping_address?.state || 'Kerala',
      billing_country: 'India',
      billing_email: order.email || 'support@bloomina.in',
      billing_phone: cleanPhone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.payment_method === 'COD' ? 'COD' : 'Prepaid',
      sub_total: order.subtotal || order.total,
      length: 15, // Default dimensions in cm
      breadth: 15,
      height: 10,
      weight: 0.3, // Default weight in kg
    };

    // 5. Send order request to Shiprocket
    let res = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let data = await res.json();
    console.log('Shiprocket raw response payload:', JSON.stringify(data, null, 2));

    // Auto-retry if Shiprocket rejects pickup location and supplies the valid location list
    if ((!data.order_id && data.message?.toLowerCase().includes('pickup location')) || !res.ok) {
      const suggestedLocation = data.data?.data?.[0]?.pickup_location;
      if (suggestedLocation && suggestedLocation !== payload.pickup_location) {
        console.warn(`[Shiprocket] Retrying with suggested pickup location: "${suggestedLocation}"`);
        payload.pickup_location = suggestedLocation;
        res = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        data = await res.json();
        console.log('[Shiprocket] Retry response payload:', JSON.stringify(data, null, 2));
      }
    }

    if (!res.ok || !data.order_id) {
      let errMsg = data.message || `Shiprocket error (${res.status})`;
      if (data.errors) {
        const details = typeof data.errors === 'string'
          ? data.errors
          : Object.entries(data.errors)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join('; ');
        errMsg += ` - ${details}`;
      }
      throw new Error(errMsg || 'Shiprocket order creation failed. No order ID returned.');
    }

    // 6. Update local order in Supabase with Shiprocket details
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        shiprocket_order_id: String(data.order_id),
        shiprocket_shipment_id: data.shipment_id ? String(data.shipment_id) : null,
        shipping_status: 'Ready to Ship'
      })
      .eq('id', orderId);

    if (updateError) {
      throw new Error(`Failed to update order database record: ${updateError.message}`);
    }

    return {
      success: true,
      shiprocket_order_id: String(data.order_id),
      shiprocket_shipment_id: data.shipment_id ? String(data.shipment_id) : null,
      raw_response: data
    };
  } catch (error: any) {
    console.error('Failed to create Shiprocket order:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Fetches live tracking data from Shiprocket using either shipment ID or AWB code
 */
export async function getLiveTracking(shipmentId?: string, awbCode?: string): Promise<any> {
  try {
    if (!shipmentId && !awbCode) {
      throw new Error('No tracking identifiers provided');
    }

    const token = await authenticateShiprocket();
    
    // Determine endpoint based on what's available (prefer shipmentId)
    const url = shipmentId 
      ? `${SHIPROCKET_API_BASE}/courier/track/shipment/${shipmentId}`
      : `${SHIPROCKET_API_BASE}/courier/track/awb/${awbCode}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error (${res.status})`);
    }

    // Extract tracking details depending on endpoint used
    let trackingDetails = null;
    if (shipmentId) {
      trackingDetails = data[shipmentId]?.tracking_data;
    } else if (awbCode) {
      trackingDetails = data.tracking_data;
    }

    if (!trackingDetails) {
      throw new Error('No live tracking records found');
    }

    return {
      success: true,
      status: trackingDetails.shipment_status,
      status_code: trackingDetails.shipment_status_code,
      courier_name: trackingDetails.courier_name,
      awb: trackingDetails.awb_code,
      events: trackingDetails.shipment_track_activities || [],
      edd: trackingDetails.edd || null,
    };
  } catch (error: any) {
    console.error('Live Tracking Failure:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
