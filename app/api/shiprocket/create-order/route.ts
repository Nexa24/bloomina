import { NextRequest, NextResponse } from 'next/server';
import { createShiprocketOrder } from '@/lib/shiprocket';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Call the server-side Shiprocket client utility
    const result = await createShiprocketOrder(orderId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Shiprocket API route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
