"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching all categories from Supabase...');
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Supabase categories fetch error:', err);
        // Fallback standard list if database fails or has no entries
        setCategories([
          { name: 'Bras', slug: 'bras', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80' },
          { name: 'Panties', slug: 'panties', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80' },
          { name: 'Sale%', slug: 'sale', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80' },
          { name: 'Combo Packs', slug: 'combo-packs', image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a5bf?auto=format&fit=crop&q=80' },
          { name: 'Nightwear', slug: 'nightwear', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80' },
          { name: 'Innerwear', slug: 'innerwear', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <main className="flex-1 pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-screen-xl mx-auto px-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">Our Collections</p>
            <h1 className="text-6xl font-display font-light text-surface-on tracking-tight leading-none mb-6">
              All Categories <br />
              <span className="italic text-primary/30">curated for comfort.</span>
            </h1>
            <p className="text-sm font-light text-surface-on-variant leading-relaxed max-w-lg">
              Browse through our premium collections. Every piece is meticulously designed with soft materials and elegant silhouettes to elevate your everyday luxury.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-screen-xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square md:aspect-[4/3] bg-stone-50 rounded-2xl md:rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {categories.map((cat) => (
                <Link 
                  key={cat.id || cat.slug} 
                  href={`/category/${cat.slug || cat.name.toLowerCase()}`}
                  className="group relative aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl md:rounded-[2rem] bg-stone-100 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <Image
                    src={cat.image || 'https://placehold.co/800x1000?text=Category'}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-w-768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent transition-opacity group-hover:opacity-90" />
                  
                  <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
                    <h2 className="text-white font-display text-lg md:text-3xl lg:text-4xl tracking-tight mb-1 md:mb-2 leading-tight">
                      {cat.name}
                    </h2>
                    <div className="flex items-center gap-1.5 text-white/80 text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-500">
                      <span className="hidden sm:inline">Explore Collection</span>
                      <span className="material-symbols-outlined text-[10px] md:text-xs">north_east</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-sm text-surface-on/40 font-medium italic">No categories found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-stone-100">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-on/20">Bloomina Collective — Curated with Love</p>
      </footer>
    </div>
  );
};

export default CategoriesPage;
