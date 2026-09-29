'use server';

import { createAdminClient } from "@/utils/supabase/admin";

export async function submitReview(data: {
  productId?: string;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail?: string;
}) {
  try {
    const supabase = createAdminClient();
    const rating = Number(data.rating);
    const comment = data.comment?.trim();
    const customerName = data.customerName?.trim();
    const customerEmail = data.customerEmail?.trim().toLowerCase();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5.' };
    }
    if (!comment || comment.length > 2000 || !customerName || customerName.length > 100) {
      return { success: false, error: 'Review details are invalid.' };
    }
    
    const { error } = await supabase
      .from('reviews')
      .insert([{
        product_id: data.productId || null,
        rating,
        comment,
        customer_name: customerName,
        customer_email: customerEmail || null,
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
    const supabase = createAdminClient();
    
    let query = supabase
      .from('reviews')
      .select('id, product_id, rating, comment, customer_name, created_at')
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

export async function getAllProductsReviewStats() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('product_id, rating')
      .eq('status', 'approved');

    if (error) throw error;

    const statsMap: Record<string, { rating: number; count: number }> = {};

    if (Array.isArray(data)) {
      data.forEach((r: any) => {
        if (!r.product_id) return;
        const pid = String(r.product_id);
        if (!statsMap[pid]) {
          statsMap[pid] = { rating: 0, count: 0 };
        }
        statsMap[pid].rating += Number(r.rating) || 0;
        statsMap[pid].count += 1;
      });

      Object.keys(statsMap).forEach(pid => {
        const item = statsMap[pid];
        item.rating = item.count > 0 ? Number((item.rating / item.count).toFixed(1)) : 0;
      });
    }

    return { success: true, stats: statsMap };
  } catch (error: any) {
    console.error('Fetch review stats error:', error);
    return { success: false, stats: {} };
  }
}
