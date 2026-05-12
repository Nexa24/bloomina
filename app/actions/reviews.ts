'use server';

import { createClient } from "@/utils/supabase/server";

export async function submitReview(data: {
  productId?: string;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail?: string;
}) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('reviews')
      .insert([{
        product_id: data.productId || null,
        rating: data.rating,
        comment: data.comment,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        status: 'pending' // Always start as pending for moderation
      }]);

    if (error) throw error;

    return { success: true, message: 'Review submitted for moderation. Thank you!' };
  } catch (error: any) {
    console.error('Review submission error:', error);
    return { success: false, error: error.message };
  }
}

export async function getApprovedReviews(productId?: string) {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    } else {
      query = query.is('product_id', null);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    return { success: false, error: error.message };
  }
}
