'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import ScrollReveal3D from './ScrollReveal3D';

const OtherCategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOtherCategories = async () => {
      try {
        // Fetch categories marked for home page display
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('display_on_home', true)
          .order('sort_order', { ascending: true });

        if (error) {
            // Fallback if column doesn't exist: show everything after the first 3
            const { data: fallbackData } = await supabase.from('categories').select('*').order('name', { ascending: true });
            setCategories((fallbackData || []).slice(3));
        } else {
            // Show everything marked for home that ISN'T in the top 3 (which are in CategorySection)
            setCategories((data || []).slice(3));
        }

      } catch (err) {
        console.error('Error fetching other categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOtherCategories();
  }, []);

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="relative z-20 bg-background rounded-t-[2.5rem] md:rounded-t-[4.5rem] shadow-[-1px_-25px_50px_rgba(0,0,0,0.05)] -mt-12 md:-mt-20 pt-16 pb-24 md:pt-24 md:pb-36 border-t border-stone-100/30">
      <div className="max-w-screen-xl mx-auto px-6">
        <ScrollReveal3D duration={800} tiltStrength={5}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60">More To Explore</h2>
              <h3 className="text-3xl md:text-4xl font-display font-light text-surface-on">Discover More Collections</h3>
            </div>
          </div>
        </ScrollReveal3D>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <ScrollReveal3D 
              key={idx} 
              delay={(idx % 4) * 80} 
              duration={800}
              tiltStrength={10}
            >
              <Link 
                href={`/category/${cat.slug || cat.name.toLowerCase()}`}
                className="group block space-y-4"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-50 transition-all duration-500 group-hover:shadow-xl">
                  <Image
                    src={cat.image || 'https://placehold.co/600x600?text=Collection'}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex items-center justify-between">
                    <h4 className="font-medium text-surface-on group-hover:text-primary transition-colors">{cat.name}</h4>
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                </div>
              </Link>
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherCategoriesSection;
