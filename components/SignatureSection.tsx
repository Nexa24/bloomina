'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import ScrollReveal from './ScrollReveal';
import ProductCard from './ProductCard';

const SignatureSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<string, { rating: number; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignatureProducts = async () => {
      try {
        const [productsRes, reviewsRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('reviews')
            .select('product_id, rating')
            .eq('status', 'approved')
        ]);

        if (productsRes.error) throw productsRes.error;

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

        if (productsRes.data) {
          // Filter products tagged with "signature"
          const signature = productsRes.data.filter((p: any) => {
            if (p.status && p.status !== 'Active') return false;
            
            const productCats: string[] = Array.isArray(p.categories)
              ? p.categories
              : typeof p.categories === 'string'
                ? JSON.parse(p.categories)
                : [];
            
            return productCats.some(c => {
              if (typeof c !== 'string') return false;
              const low = c.trim().toLowerCase();
              return low === 'signature' || low === 'signature collection';
            });
          });

          // Limit to 4 products for the homepage
          setProducts(signature.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch signature products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignatureProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="max-w-screen-xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16 space-y-4">
          <div className="h-3 bg-stone-50 rounded w-16 mx-auto animate-pulse" />
          <div className="h-8 bg-stone-50 rounded w-64 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-[3/4] bg-stone-50 rounded-[2.5rem]" />
              <div className="h-4 bg-stone-50 rounded w-2/3" />
              <div className="h-3 bg-stone-50 rounded w-1/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-4 md:py-6 border-t border-stone-100">
      <div className="text-center mb-4 md:mb-6 space-y-2">
        <ScrollReveal variant="slide-up" delay={150} duration={800}>
          <h2 className="text-3xl md:text-5xl font-display font-light text-surface-on tracking-tight leading-tight">
            Customer <span className="italic text-primary">Favorites</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal variant="slide-up" delay={250} duration={800}>
          <p className="text-stone-400 font-light max-w-md mx-auto text-xs md:text-sm leading-relaxed mt-1">
            Experience our most celebrated selections. Hand-crafted from ultra-soft fabrics to embrace your natural shape with seamless grace.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-8 md:gap-y-12">
        {products.map((product, idx) => {
          const genuine = reviewStats[String(product.id)];
          return (
            <ScrollReveal 
              key={product.id} 
              delay={idx * 100} 
              variant="slide-up"
              duration={800}
            >
              <ProductCard
                id={product.id}
                title={product.name}
                price={parseFloat(product.price) || 0}
                comparePrice={product.comparePrice || product.original_price || product.mrp}
                image={(Array.isArray(product.images) ? product.images[0] : product.images?.[0]?.url) || 'https://placehold.co/600x800?text=No+Image'}
                category="Signature"
                colorConfigs={product.colorConfigs || []}
                variants={product.variants || []}
                rating={genuine?.rating}
                reviewCount={genuine?.count || 0}
              />
            </ScrollReveal>
          );
        })}
      </div>

      <div className="text-center mt-6 md:mt-8">
        <ScrollReveal variant="fade" delay={300} duration={800}>
          <Link 
            href="/category/signature"
            className="inline-block px-12 py-5 bg-surface-on text-white rounded-full text-[9px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            Explore Complete Collection
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SignatureSection;
