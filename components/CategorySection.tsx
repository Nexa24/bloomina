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
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading || categories.length === 0) return null;

  return (
    <section className="max-w-screen-xl mx-auto px-6 space-y-12 md:space-y-16 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60">Shop by Story</h2>
          <h3 className="text-4xl font-display font-medium text-surface-on">Curated Collections</h3>
        </div>
        <p className="max-w-md text-surface-on-variant font-light leading-relaxed">
          Each piece is a testament to our commitment to <span className="italic">Floral Minimalism</span>—where nature meets luxury.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 h-[800px] md:h-[700px]">
        {categories.map((cat, idx) => (
          <Link 
            key={idx} 
            href={`/category/${cat.slug || cat.name.toLowerCase()}`}
            className={`${cat.gridSpan} group relative overflow-hidden rounded-3xl bg-surface-container-low transition-all duration-700 hover:petal-shadow block`}
          >
            <Image
              src={cat.image || 'https://placehold.co/800x800?text=Category'}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-700 group-hover:translate-y-[-8px]">
              <h4 className="text-white font-display text-2xl mb-2 tracking-tight">{cat.name}</h4>
              <p className="text-white/80 text-sm font-light mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-[240px]">
                {cat.description}
              </p>
              <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                <span>Explore</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

