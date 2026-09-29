'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const ProductGrid = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<string, { rating: number; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsRes, reviewsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('status', 'Active')
            .order('created_at', { ascending: false })
            .limit(12),
          supabase
            .from('reviews')
            .select('product_id, rating')
            .eq('status', 'approved')
        ]);

        if (productsRes.error) throw productsRes.error;
        setProducts(productsRes.data || []);

        const stats: Record<string, { rating: number; count: number }> = {};
        if (Array.isArray(reviewsRes.data)) {
          reviewsRes.data.forEach((r: any) => {
            if (!r.product_id) return;
            const pid = String(r.product_id);
            if (!stats[pid]) stats[pid] = { rating: 0, count: 0 };
            stats[pid].rating += Number(r.rating) || 0;
            stats[pid].count += 1;
          });

          Object.keys(stats).forEach(pid => {
            stats[pid].rating = stats[pid].count > 0 ? Number((stats[pid].rating / stats[pid].count).toFixed(1)) : 0;
          });
        }
        setReviewStats(stats);
      } catch (err: any) {
        console.error('Product fetch error details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="aspect-[3/4] bg-stone-50 rounded-[2rem]" />
            <div className="h-4 bg-stone-50 rounded w-2/3" />
            <div className="h-3 bg-stone-50 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-surface-on/40 italic">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-12 md:gap-y-20">
      {products.slice(0, 4).map((product) => {
        const genuine = reviewStats[String(product.id)];
        return (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            comparePrice={product.comparePrice}
            image={product.images?.[0] || 'https://placehold.co/600x800?text=No+Image'}
            category={Array.isArray(product.categories) ? product.categories[0] : (product.categories || 'Uncategorized')}
            colorConfigs={product.colorConfigs || []}
            variants={product.variants || []}
            rating={genuine?.rating}
            reviewCount={genuine?.count || 0}
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
