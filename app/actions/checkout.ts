'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createShiprocketOrder, getLiveTracking } from '@/lib/shiprocket';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const MAX_ITEMS_PER_ORDER = 20;
const MAX_QUANTITY_PER_ITEM = 10;

function cleanText(value: unknown, name: string, maxLength: number) {
  if (typeof value !== 'string') throw new Error(`${name} is required.`);
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) throw new Error(`${name} is invalid.`);
  return cleaned;
}

async function requireUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('You must be signed in to continue.');
  return user;
}

/**
 * Fetches the dynamic payment configuration from the database.
 */
async function getPaymentConfig() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'payment_gateway_config')
    .single();
  return data?.value || {};
}

/**
 * Initializes a Razorpay instance using environment variables.
 */
async function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId) {
    console.log(`[Razorpay] Using Key ID from Environment: ${keyId.substring(0, 8)}...`);
  }

  if (!keyId || !keySecret) {
    throw new Error('Payment gateway is not fully configured. Please contact support.');
  }

  return {
    instance: new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    }),
    keyId: keyId,
    source: 'Env'
  };
}

export async function getCheckoutConfig() {
  const config = await getPaymentConfig();
  return {
    cod_enabled: config.cod_enabled ?? true,
    cod_min_order: config.cod_min_order ?? 0,
    whatsapp_enabled: config.whatsapp_payments_enabled ?? true,
    upi_id: config.upi_id || ''
  };
}

export async function validateCoupon(code: string, cartTotal: number, items?: any[]) {
  try {
    const supabase = createAdminClient();
    const normalizedCode = cleanText(code, 'Coupon code', 64).toUpperCase();
    if (!Number.isFinite(cartTotal) || cartTotal < 0) return { error: 'Invalid cart total.' };
    
    const { data: rawCoupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (error || !rawCoupon) {
      // Check hardcoded promo code aliases if not found in database
      if (normalizedCode === 'BOGO' || normalizedCode === 'BUY1GET1') {
        const expandedCart: number[] = [];
        if (Array.isArray(items)) {
          items.forEach(item => {
            const qty = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            for (let i = 0; i < qty; i++) expandedCart.push(price);
          });
        }
        if (expandedCart.length < 2) {
          return { error: 'BOGO offer requires at least 2 items in your cart.' };
        }
        expandedCart.sort((a, b) => b - a);
        let bogoDiscount = 0;
        for (let i = 1; i < expandedCart.length; i += 2) {
          bogoDiscount += expandedCart[i];
        }
        return {
          success: true,
          coupon: {
            id: 'bogo-promo',
            code: normalizedCode,
            type: 'bogo',
            value: 100,
            discountAmount: Math.min(bogoDiscount, cartTotal)
          }
        };
      }
      return { error: 'Invalid coupon code.' };
    }

    // Normalize coupon schema dynamically to support both structures
    let is_active = true;
    if (rawCoupon.status === 'Inactive' || rawCoupon.is_active === false) {
      is_active = false;
    } else if (rawCoupon.status === 'Active' || rawCoupon.is_active === true) {
      is_active = true;
    } else {
      is_active = (rawCoupon.is_active !== null && rawCoupon.is_active !== undefined) ? !!rawCoupon.is_active : true;
    }

    const coupon = {
      id: rawCoupon.id,
      code: rawCoupon.code,
      is_active: is_active,
      expires_at: rawCoupon.expires_at || rawCoupon.expiry,
      max_uses: rawCoupon.max_uses,
      uses: rawCoupon.uses || 0,
      min_order_value: (rawCoupon.min_order_value !== null && rawCoupon.min_order_value !== undefined)
        ? Number(rawCoupon.min_order_value)
        : Number(rawCoupon.min_cart_value || 0),
      discount_type: (rawCoupon.discount_type === 'flat' || rawCoupon.type === 'flat' || rawCoupon.discount_type === 'fixed' || rawCoupon.type === 'fixed')
        ? 'fixed'
        : (rawCoupon.discount_type === 'percent' || rawCoupon.type === 'percent' || rawCoupon.discount_type === 'percentage' || rawCoupon.type === 'percentage')
          ? 'percentage'
          : (rawCoupon.discount_type || rawCoupon.type || '').toLowerCase(),
      discount_value: (rawCoupon.discount_value !== null && rawCoupon.discount_value !== undefined)
        ? Number(rawCoupon.discount_value)
        : Number(rawCoupon.value || 0),
      max_discount: rawCoupon.max_discount
    };

    if (!coupon.is_active) {
      return { error: 'This coupon is no longer active.' };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { error: 'This coupon has expired.' };
    }

    if (coupon.max_uses && coupon.uses >= coupon.max_uses) {
      return { error: 'This coupon has reached its maximum usage limit.' };
    }

    if (cartTotal < (coupon.min_order_value || 0)) {
      return { error: `This coupon requires a minimum purchase of ₹${coupon.min_order_value}.` };
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'fixed') {
      discountAmount = Number(coupon.discount_value);
    } else if (coupon.discount_type === 'percentage') {
      discountAmount = (cartTotal * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, Number(coupon.max_discount));
      }
    } else if (coupon.discount_type === 'bogo' || coupon.code === 'BOGO' || coupon.code === 'BUY1GET1') {
      const expandedCart: number[] = [];
      if (Array.isArray(items)) {
        items.forEach(item => {
          const qty = Number(item.quantity) || 1;
          const price = Number(item.price) || 0;
          for (let i = 0; i < qty; i++) expandedCart.push(price);
        });
      }
      if (expandedCart.length < 2) {
        return { error: 'BOGO offer requires at least 2 items in your cart.' };
      }
      expandedCart.sort((a, b) => b - a);
      for (let i = 1; i < expandedCart.length; i += 2) {
        discountAmount += expandedCart[i];
      }
    } else if (coupon.discount_type === 'buy2get1' || coupon.code === 'BUY2GET1') {
      const expandedCart: number[] = [];
      if (Array.isArray(items)) {
        items.forEach(item => {
          const qty = Number(item.quantity) || 1;
          const price = Number(item.price) || 0;
          for (let i = 0; i < qty; i++) expandedCart.push(price);
        });
      }
      if (expandedCart.length < 3) {
        return { error: 'Buy 2 Get 1 Free offer requires at least 3 items in your cart.' };
      }
      expandedCart.sort((a, b) => b - a);
      for (let i = 2; i < expandedCart.length; i += 3) {
        discountAmount += expandedCart[i];
      }
    } else if (coupon.discount_type === 'combo') {
      const minCount = rawCoupon.min_items_count || 2;
      const comboPrice = Number(rawCoupon.value) || 0;
      const expandedCart: number[] = [];
      if (Array.isArray(items)) {
        items.forEach(item => {
          const qty = Number(item.quantity) || 1;
          const price = Number(item.price) || 0;
          for (let i = 0; i < qty; i++) expandedCart.push(price);
        });
      }
      if (expandedCart.length < minCount) {
        return { error: `Combo offer requires at least ${minCount} items in your cart.` };
      }
      expandedCart.sort((a, b) => b - a);
      const topItemsSum = expandedCart.slice(0, minCount).reduce((a, b) => a + b, 0);
      if (topItemsSum > comboPrice) {
        discountAmount = topItemsSum - comboPrice;
      }
    } else if (coupon.discount_type === 'quantity_discount') {
      const minCount = rawCoupon.min_items_count || 2;
      const totalItemsCount = Array.isArray(items) 
        ? items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) 
        : 0;
      if (totalItemsCount < minCount) {
        return { error: `Quantity offer requires at least ${minCount} items in your cart.` };
      }
      discountAmount = Number(coupon.discount_value);
    } else if (coupon.discount_type === 'freeship') {
      discountAmount = 0;
    }

    return {
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.discount_type,
        value: coupon.discount_value,
        discountAmount: Math.min(discountAmount, cartTotal)
      }
    };
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return { error: 'Failed to validate coupon.' };
  }
}

export async function createOrder(data: {
  items: any[];
  shippingAddress: any;
  paymentMethod: 'Razorpay' | 'COD' | 'WhatsApp';
  couponCode?: string;
}) {
  try {
    const user = await requireUser();
    const supabase = createAdminClient();
    const config = await getPaymentConfig();

    // 1. Validate prices server-side
    if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > MAX_ITEMS_PER_ORDER) {
      throw new Error('Your cart is empty or contains too many items.');
    }
    if (!['Razorpay', 'COD'].includes(data.paymentMethod)) {
      throw new Error('Invalid payment method.');
    }

    const shippingAddress = {
      fullName: cleanText(data.shippingAddress?.fullName, 'Full name', 100),
      email: cleanText(data.shippingAddress?.email, 'Email', 254).toLowerCase(),
      phone: cleanText(data.shippingAddress?.phone, 'Phone', 24),
      address: cleanText(data.shippingAddress?.address, 'Address', 300),
      city: cleanText(data.shippingAddress?.city, 'City', 100),
      state: cleanText(data.shippingAddress?.state, 'State', 100),
      postalCode: cleanText(data.shippingAddress?.postalCode, 'Postal code', 20),
    };
    if (shippingAddress.email !== user.email?.toLowerCase()) {
      throw new Error('Checkout email must match your signed-in account.');
    }

    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of data.items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
        throw new Error('Invalid item quantity.');
      }
      const productId = cleanText(item.productId || item.id, 'Product ID', 100);
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        throw new Error(`Product "${item.name || item.title}" not found.`);
      }

      const price = Number(product.price);
      if (!Number.isFinite(price) || price < 0) throw new Error('Product price is invalid.');
      subtotal += price * quantity;

      const itemSize = typeof item.size === 'string' && item.size.trim() ? item.size.trim() : (typeof item.selectedSize === 'string' ? item.selectedSize.trim() : '');
      const itemColor = typeof item.color === 'string' && item.color.trim() ? item.color.trim() : (typeof item.selectedColor === 'string' ? item.selectedColor.trim() : '');

      validatedItems.push({
        id: productId,
        productId: productId,
        title: product.name,
        name: product.name,
        price,
        quantity,
        image: typeof item.image === 'string' ? item.image.slice(0, 500) : '',
        size: itemSize,
        color: itemColor,
        selectedSize: itemSize,
        selectedColor: itemColor,
      });
    }

    // 2. Validate Coupon if provided
    let total = subtotal;
    let discountAmount = 0;
    let appliedCouponId = null;

    if (data.couponCode) {
      const couponResult = await validateCoupon(data.couponCode, subtotal);
      if (couponResult.success && couponResult.coupon) {
        discountAmount = couponResult.coupon.discountAmount;
        total = subtotal - discountAmount;
        appliedCouponId = couponResult.coupon.id;
      }
    }

    // 3. Handle Payment Method Specifics
    let razorpayOrderId = null;
    let orderStatus = 'Payment Pending';
    let rzpKey = null;

    if (data.paymentMethod === 'Razorpay') {
      let keySource = 'Unknown';
      let partialKey = 'None';
      try {
        const { instance, keyId, source } = await getRazorpayInstance();
        rzpKey = keyId;
        keySource = source;
        partialKey = keyId ? keyId.substring(0, 6) + '...' : 'None';
        
        const headersList = await (await import('next/headers')).headers();
        const host = headersList.get('host');
        console.log(`[Checkout] Creating Razorpay order on domain: ${host}`);

        const rzpOrder = await instance.orders.create({
          amount: Math.round(total * 100),
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr: any) {
        console.error('Razorpay Order Error:', rzpErr);
        throw new Error(`Payment Gateway Error: ${rzpErr.error?.description || rzpErr.message || 'Authentication failed'} (Source: ${keySource}, Key: ${partialKey})`);
      }
    } else if (data.paymentMethod === 'COD') {
      if (!config.cod_enabled || total < (config.cod_min_order || 0)) {
        throw new Error('Cash on Delivery is not available for this order.');
      }
      orderStatus = 'Processing';
    }

    // 4. Insert order
    const orderRow = {
      status: orderStatus,
      customer_name: shippingAddress.fullName,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      subtotal,
      discount_amount: discountAmount,
      total,
      applied_coupon_id: appliedCouponId,
      items: validatedItems,
      shipping_address: {
        street: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.postalCode,
        country: 'India',
      },
      payment_method: data.paymentMethod,
      razorpay_order_id: razorpayOrderId,
      user_id: user.id,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderRow)
      .select()
      .single();

    if (orderError) {
      console.error('Database Insert Error:', orderError);
      throw new Error(`Database Error: ${orderError.message}`);
    }

    // 5. Update coupon usage count if applied
    if (appliedCouponId) {
      const { error: rpcError } = await supabase.rpc('increment_coupon_usage', { coupon_id: appliedCouponId });
      if (rpcError) console.error('Coupon Usage Update Error:', rpcError);
    }

    // Push COD orders to Shiprocket automatically
    if (data.paymentMethod === 'COD') {
      createShiprocketOrder(order.id).catch(err => {
        console.error('Async Shiprocket Creation Error:', err);
      });
    }

    return {
      success: true,
      orderId: order.id,
      razorpayOrderId,
      amount: Math.round(total * 100),
      currency: 'INR',
      key: rzpKey,
      isCOD: data.paymentMethod === 'COD'
    };
  } catch (error: any) {
    console.error('Checkout error:', error);
    return { error: error.message || 'Failed to process checkout' };
  }
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) {
  try {
    const user = await requireUser();
    const supabase = createAdminClient();
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) throw new Error('Razorpay secret not configured');

    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const providedSignature = Buffer.from(data.razorpay_signature, 'utf8');
    const calculatedSignature = Buffer.from(expectedSignature, 'utf8');
    if (
      providedSignature.length !== calculatedSignature.length ||
      !crypto.timingSafeEqual(providedSignature, calculatedSignature)
    ) {
      return { error: 'Invalid payment signature' };
    }

    // Fetch the order to verify binding with Razorpay order ID
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('razorpay_order_id, status, user_id')
      .eq('id', data.orderId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !order) {
      return { error: 'Order not found for payment verification' };
    }

    if (order.razorpay_order_id !== data.razorpay_order_id) {
      return { error: 'Payment verification binding mismatch' };
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'Payment Done',
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq('id', data.orderId)
      .eq('user_id', user.id)
      .eq('razorpay_order_id', data.razorpay_order_id)
      .eq('status', 'Payment Pending');

    if (updateError) throw updateError;

    // Push Prepaid orders to Shiprocket once payment is verified
    createShiprocketOrder(data.orderId).catch(err => {
      console.error('Async Shiprocket Creation Error:', err);
    });

    return { success: true };
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return { error: 'Payment verification failed' };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const user = await requireUser();
    const supabase = createAdminClient();
    
    // Only delete if it's still in 'Payment Pending' status to be safe
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)
      .eq('user_id', user.id)
      .eq('status', 'Payment Pending');

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Order deletion error:', error);
    return { error: 'Failed to cleanup order' };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const user = await requireUser();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', cleanText(orderId, 'Order ID', 100))
      .eq('user_id', user.id)
      .in('status', ['Payment Pending', 'Processing']);

    if (error) throw error;
    return { success: true };
  } catch {
    return { error: 'Failed to cancel order.' };
  }
}

export async function getOrderConfirmation(orderId: string) {
  try {
    const user = await requireUser();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('orders')
      .select('payment_method, email, status')
      .eq('id', cleanText(orderId, 'Order ID', 100))
      .eq('user_id', user.id)
      .single();

    if (error || !data) return { error: 'Order not found.' };
    return { success: true, data };
  } catch {
    return { error: 'Unable to load order confirmation.' };
  }
}

export async function trackOrder(orderId: string, email: string) {
  try {
    const supabase = createAdminClient();
    const normalizedOrderId = cleanText(orderId, 'Order ID', 100);
    const normalizedEmail = cleanText(email, 'Email', 254).toLowerCase();
    const { data, error } = await supabase
      .from('orders')
      .select('id, status, shipping_address, delivery_method, tracking_number, shiprocket_order_id, shiprocket_shipment_id, shipping_status')
      .eq('id', normalizedOrderId)
      .ilike('email', normalizedEmail)
      .single();

    if (error || !data) return { error: 'No order found for those details.' };

    let liveTracking = null;
    
    // If the order has been synchronized with Shiprocket
    if (data.shiprocket_shipment_id || data.tracking_number) {
      const trackingRes = await getLiveTracking(
        data.shiprocket_shipment_id ? String(data.shiprocket_shipment_id) : undefined,
        data.tracking_number || undefined
      );
      
      if (trackingRes.success) {
        liveTracking = trackingRes;
        
        // Automatically sync order status according to Shiprocket live status
        let newStatus = data.status;
        const srStatus = String(trackingRes.status).toLowerCase();
        
        if (srStatus === 'delivered' || trackingRes.status_code === 7) {
          newStatus = 'Delivered';
        } else if (['shipped', 'in transit', 'out for delivery', 'dispatched'].includes(srStatus) || [6, 17, 18].includes(trackingRes.status_code)) {
          newStatus = 'Shipped';
        } else if (srStatus === 'cancelled' || trackingRes.status_code === 8) {
          newStatus = 'Cancelled';
        }
        
        if (newStatus !== data.status) {
          await supabase
            .from('orders')
            .update({ 
              status: newStatus,
              shipping_status: trackingRes.status,
              tracking_number: trackingRes.awb || data.tracking_number,
              delivery_method: trackingRes.courier_name || data.delivery_method
            })
            .eq('id', data.id);
          
          data.status = newStatus;
          data.shipping_status = trackingRes.status;
          if (trackingRes.awb) data.tracking_number = trackingRes.awb;
          if (trackingRes.courier_name) data.delivery_method = trackingRes.courier_name;
        }
      }
    }

    return { 
      success: true, 
      data: {
        ...data,
        live_tracking: liveTracking
      } 
    };
  } catch (err: any) {
    console.error('Error tracking order:', err);
    return { error: 'Unable to track this order.' };
  }
}
