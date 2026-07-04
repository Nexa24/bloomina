import { supabase } from './supabase';

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

    // 3. Map order items to Shiprocket parameters
    const orderItems = (order.items || []).map((item: any) => ({
      name: item.title || item.name || 'Product Item',
      sku: item.sku || `SKU-${item.product_id || 'PROD'}`,
      units: item.quantity || 1,
      selling_price: item.price || 0,
      discount: 0,
      tax: 0,
    }));

    // 4. Construct Shiprocket adhoc order payload
    const payload = {
      order_id: order.id,
      order_date: new Date(order.created_at).toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION_NAME || 'Primary Warehouse',
      billing_customer_name: order.customer_name.split(' ')[0] || 'Customer',
      billing_last_name: order.customer_name.split(' ').slice(1).join(' ') || 'Name',
      billing_address: order.shipping_address.street || '',
      billing_city: order.shipping_address.city || '',
      billing_pincode: order.shipping_address.zip || '',
      billing_state: order.shipping_address.state || '',
      billing_country: 'India',
      billing_email: order.email || 'support@bloomina.in',
      billing_phone: order.phone || '',
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: order.payment_method === 'COD' ? 'COD' : 'Prepaid',
      sub_total: order.subtotal || order.total,
      length: 15, // Default dimensions in cm (adjustable)
      breadth: 15,
      height: 10,
      weight: 0.3, // Default weight in kg (300 grams)
    };

    // 5. Send order request to Shiprocket
    const res = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      let errMsg = data.message || `API error (${res.status})`;
      if (data.errors) {
        const details = Object.entries(data.errors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('; ');
        errMsg += ` - ${details}`;
      }
      throw new Error(errMsg);
    }

    // 6. Update local order in Supabase with Shiprocket details
    await supabase
      .from('orders')
      .update({
        shiprocket_order_id: data.order_id,
        shiprocket_shipment_id: data.shipment_id,
        shipping_status: 'Ready to Ship'
      })
      .eq('id', orderId);

    return {
      success: true,
      shiprocket_order_id: data.order_id,
      shiprocket_shipment_id: data.shipment_id,
    };
  } catch (error: any) {
    console.error('Failed to create Shiprocket order:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
