'use server';

import { createClient } from '@/utils/supabase/server';
import { createOrder as createRazorpayOrder } from '@/lib/razorpay';
import crypto from 'crypto';

export async function createOrder(data: {
  items: any[];
  shippingAddress: any;
}) {
  try {
    const supabase = await createClient();

    // 1. Validate prices server-side via Supabase (no Payload)
    let total = 0;
    const validatedItems: any[] = [];

    for (const item of data.items) {
      if (!item.productId) {
        throw new Error(`Cart item "${item.name}" is missing a product ID. Please remove it and re-add it.`);
      }

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('id', item.productId)
        .single();

      if (productError || !product) {
        throw new Error(`Product not found. Please refresh your cart and try again.`);
      }

      const price = Number(product.price);
      total += price * item.quantity;

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

    // 2. Create Razorpay order
    const rzpOrder = await createRazorpayOrder(total);

    // 3. Insert order using ONLY the columns that exist in the DB:
    //    id, status, customer_name, items, created_at
    //    All other info is stored inside the 'items' JSON as extended metadata
    //    until the SQL migration is applied.
    const orderRow: Record<string, any> = {
      status: 'Payment Pending',
      customer_name: data.shippingAddress.fullName,
      items: {
        // Store validated cart items AND customer/payment info here
        // so nothing is lost even without the extra columns
        products: validatedItems,
        total,
        email: data.shippingAddress.email,
        phone: data.shippingAddress.phone,
        shipping_address: {
          street: data.shippingAddress.address,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          zip: data.shippingAddress.postalCode,
          country: 'India',
        },
        payment_method: 'Razorpay',
        razorpay_order_id: rzpOrder.id,
      },
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderRow)
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      throw new Error(orderError.message);
    }

    return {
      success: true,
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
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

    // 1. Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error('Razorpay secret not configured');

    const body = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== data.razorpay_signature) {
      return { error: 'Invalid payment signature' };
    }

    // 2. Update order — merge payment info into the items JSON
    const { data: existing } = await supabase
      .from('orders')
      .select('items')
      .eq('id', data.orderId)
      .single();

    const updatedItems = {
      ...(existing?.items || {}),
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_signature: data.razorpay_signature,
      paid_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'Payment Done',
        items: updatedItems,
      })
      .eq('id', data.orderId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return { error: 'Payment verification failed' };
  }
}
