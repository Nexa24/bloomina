'use server';

import { createClient } from '@/utils/supabase/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Fetches the dynamic payment configuration from the database.
 */
async function getPaymentConfig() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'payment_gateway_config')
    .single();
  return data?.value || {};
}

/**
 * Initializes a Razorpay instance using the dynamic config.
 */
async function getRazorpayInstance() {
  const config = await getPaymentConfig();
  if (!config.razorpay_key_id || !config.razorpay_key_secret) {
    throw new Error('Payment gateway is not fully configured. Please contact support.');
  }
  return {
    instance: new Razorpay({
      key_id: config.razorpay_key_id,
      key_secret: config.razorpay_key_secret,
    }),
    keyId: config.razorpay_key_id
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

export async function validateCoupon(code: string, cartTotal: number) {
  try {
    const supabase = await createClient();
    
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !coupon) {
      return { error: 'Invalid coupon code.' };
    }

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
    const supabase = await createClient();
    const config = await getPaymentConfig();

    // 1. Validate prices server-side
    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of data.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('id', item.productId)
        .single();

      if (productError || !product) {
        throw new Error(`Product "${item.name}" not found.`);
      }

      const price = Number(product.price);
      subtotal += price * item.quantity;

      validatedItems.push({
        id: item.productId,
        title: product.name,
        price,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        color: item.color,
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
      const { instance, keyId } = await getRazorpayInstance();
      const rzpOrder = await instance.orders.create({
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });
      razorpayOrderId = rzpOrder.id;
      rzpKey = keyId;
    } else if (data.paymentMethod === 'COD') {
      if (!config.cod_enabled || total < (config.cod_min_order || 0)) {
        throw new Error('Cash on Delivery is not available for this order.');
      }
      orderStatus = 'Processing';
    }

    // 4. Insert order
    const orderRow = {
      status: orderStatus,
      customer_name: data.shippingAddress.fullName,
      email: data.shippingAddress.email,
      phone: data.shippingAddress.phone,
      subtotal,
      discount_amount: discountAmount,
      total,
      applied_coupon_id: appliedCouponId,
      items: validatedItems,
      shipping_address: {
        street: data.shippingAddress.address,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        zip: data.shippingAddress.postalCode,
        country: 'India',
      },
      payment_method: data.paymentMethod,
      razorpay_order_id: razorpayOrderId,
      user_id: (await supabase.auth.getUser()).data.user?.id || null,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderRow)
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    // 5. Update coupon usage count if applied
    if (appliedCouponId) {
      await supabase.rpc('increment_coupon_usage', { coupon_id: appliedCouponId });
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
    const supabase = await createClient();
    const config = await getPaymentConfig();
    
    const secret = config.razorpay_key_secret;
    if (!secret) throw new Error('Razorpay secret not configured');

    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== data.razorpay_signature) {
      return { error: 'Invalid payment signature' };
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'Payment Done',
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      })
      .eq('id', data.orderId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return { error: 'Payment verification failed' };
  }
}
