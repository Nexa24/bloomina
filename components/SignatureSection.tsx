'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import ScrollReveal from './ScrollReveal';

const SignatureSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignatureProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Filter products tagged with "signature"
          const signature = data.filter((p: any) => {
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
    <section className="max-w-screen-xl mx-auto px-6 py-8 md:py-12 border-t border-stone-100">
      <div className="text-center mb-16 md:mb-20 space-y-4">
        <ScrollReveal variant="fade" duration={600}>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            Intimate Masterpieces
          </span>
        </ScrollReveal>
        <ScrollReveal variant="slide-up" delay={150} duration={800}>
          <h2 className="text-4xl md:text-5xl font-display font-light text-surface-on tracking-tight leading-tight">
            The <span className="italic text-primary">Signature</span> Collection
          </h2>
        </ScrollReveal>
        <ScrollReveal variant="slide-up" delay={250} duration={800}>
          <p className="text-stone-400 font-light max-w-md mx-auto text-xs md:text-sm leading-relaxed mt-2">
            Experience our most celebrated selections. Hand-crafted from ultra-soft fabrics to embrace your natural shape with seamless grace.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
        {products.map((product, idx) => (
          <ScrollReveal 
            key={product.id} 
            delay={idx * 100} 
            variant="slide-up"
            duration={800}
          >
            <Link
              href={`/product/${product.slug || product.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-stone-50 mb-4 md:mb-6 petal-shadow transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(241,145,161,0.22)]">
                <img
                  src={(Array.isArray(product.images) ? product.images[0] : product.images?.[0]?.url) || 'https://via.placeholder.com/600x800'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-full py-4 bg-white/90 backdrop-blur-md rounded-2xl text-[9px] font-bold uppercase tracking-widest text-primary shadow-xl hover:bg-primary hover:text-white transition-colors text-center">
                    Quick View
                  </div>
                </div>
              </div>

              <div className="space-y-1 px-2">
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.25em] text-primary/50">
                  Signature
                </p>
                <h3 className="text-sm md:text-base font-display text-surface-on group-hover:text-primary transition-colors tracking-tight line-clamp-1">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-xs md:text-sm font-price font-bold text-surface-on-variant">
                    ₹{product.price ? parseFloat(product.price).toLocaleString('en-IN') : '0'}
                  </p>
                  {(product.comparePrice || product.original_price || product.mrp) &&
                    parseFloat(product.comparePrice || product.original_price || product.mrp) > parseFloat(product.price) && (
                    <span className="text-[10px] md:text-xs font-price text-stone-400 line-through">
                      ₹{parseFloat(product.comparePrice || product.original_price || product.mrp).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      <div className="text-center mt-16 md:mt-20">
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
