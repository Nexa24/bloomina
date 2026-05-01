import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { createOrder as createRazorpayOrder } from '@/lib/razorpay';

/**
 * SECURE CHECKOUT HANDLER (Backend-Only)
 * This route ensures that sensitive operations like price calculation 
 * and order creation are shielded from client-side tampering.
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });
    
    // 1. Authenticate the user (Backend session check)
    const { user } = await payload.auth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, shippingAddress } = await req.json();

    // 2. Server-side validation and price calculation
    // IMPORTANT: Fetch prices from the DB, do NOT trust client-provided prices.
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.productId,
      });

      if (!product) throw new Error(`Product ${item.productId} not found`);

      const price = (product.price as number);
      total += price * item.quantity;
      
      orderItems.push({
        product: product.id,
        quantity: item.quantity,
        priceAtPurchase: price,
      });
    }

    // 3. Create Razorpay order (Backend secret used)
    const razorpayOrder = await createRazorpayOrder(total);

    // 4. Store pending order in Payload
    const dbOrder = await payload.create({
      collection: 'orders',
      data: {
        user: user.id,
        items: orderItems,
        total,
        status: 'pending',
        razorpayOrderId: razorpayOrder.id,
        shippingAddress,
      },
    });

    // 5. Return only necessary info to client
    return NextResponse.json({
      orderId: dbOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // Public key is fine to share
    });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
