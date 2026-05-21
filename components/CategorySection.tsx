'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import ScrollReveal3D from './ScrollReveal3D';

const CategorySection = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories from:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('display_on_home', true)
          .order('sort_order', { ascending: true })
          .limit(3);

        if (error) {
            // Fallback if column doesn't exist
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('categories')
              .select('*')
              .limit(3);
            
            if (fallbackError) throw fallbackError;
            setCategories(fallbackData || []);
        } else {
            setCategories(data || []);
        }
        
      } catch (err: any) {
        console.error('Category fetch error details:', {
          message: err.message,
          stack: err.stack,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="relative z-10 bg-background rounded-t-[2.5rem] md:rounded-t-[4.5rem] shadow-[-1px_-25px_50px_rgba(92,30,47,0.05),0_-10px_20px_rgba(0,0,0,0.02)] -mt-12 md:-mt-20 pt-16 pb-20 md:pt-24 md:pb-28 w-full border-t border-stone-100/10">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-3 md:gap-8">
          {categories.slice(0, 3).map((cat, idx) => (
            <ScrollReveal3D 
              key={idx} 
              delay={idx * 120} 
              duration={800}
              tiltStrength={10}
            >
              <Link 
                href={`/category/${cat.slug || cat.name.toLowerCase()}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl md:rounded-[2rem] bg-stone-100 transition-all duration-700 hover:shadow-2xl"
              >
                <Image
                  src={cat.image || 'https://placehold.co/800x1000?text=Category'}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
                
                <div className="absolute inset-0 p-3 md:p-8 flex flex-col justify-end">
                  <h4 className="text-white font-display text-sm md:text-3xl tracking-tight mb-1 md:mb-2 leading-tight">{cat.name}</h4>
                  <div className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Collection</span>
                    <span className="material-symbols-outlined text-xs">north_east</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

