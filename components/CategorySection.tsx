'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

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
          .limit(4);

        if (error) throw error;
        
        // Add layout spans for the grid
        const layouts = [
          'md:col-span-2 md:row-span-2',
          'md:col-span-1 md:row-span-1',
          'md:col-span-1 md:row-span-2',
          'md:col-span-1 md:row-span-1'
        ];

        const mapped = (data || []).map((cat, i) => ({
          ...cat,
          gridSpan: layouts[i % layouts.length]
        }));

        setCategories(mapped);
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
    <section className="max-w-screen-xl mx-auto px-6 py-6 md:py-10">
      {/* Titles removed per user request */}

      <div className="grid grid-cols-3 gap-3 md:gap-8">
        {categories.slice(0, 3).map((cat, idx) => (
          <Link 
            key={idx} 
            href={`/category/${cat.slug || cat.name.toLowerCase()}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl md:rounded-[2rem] bg-stone-100 transition-all duration-700 hover:shadow-2xl"
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
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

