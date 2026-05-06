"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Each sub-category has a dbNames array: all possible values stored in the DB
// that should be treated as this sub-category (covers renamed/legacy tags)
type SubCategory = { name: string; slug: string; dbNames: string[] };
type CategoryEntry = { label: string; dbName: string; subs?: SubCategory[] };

const categoryMap: { [key: string]: CategoryEntry } = {
  'bras': {
    label: 'Bras',
    dbName: 'Bras',
    subs: [
      {
        name: 'Wireless Bras', slug: 'wireless-bras',
        dbNames: ['Wireless Bras', 'Wireless Comfort', 'Wireless', 'wireless-bras', 'Everyday Comfort'],
      },
      {
        name: 'Padded & Push-Up', slug: 'full-coverage',
        dbNames: ['Full Coverage', 'Padded & Push-Up', 'Push-up Bras', 'Supportive Contour', 'Padded', 'Push Up', 'full-coverage'],
      },
      {
        name: 'Lace Bras', slug: 'lace-intimates',
        dbNames: ['Lace Bras', 'Lace Intimates', 'Signature Lace', 'lace-intimates', 'Premium Lace'],
      },
      {
        name: 'Bralettes', slug: 'bralettes',
        dbNames: ['Bralettes', 'Silk Bralettes', 'Bralette', 'bralettes'],
      },
      {
        name: 'Nursing Bras', slug: 'nursing-bras',
        dbNames: ['Nursing Bras', 'Maternity', 'nursing-bras'],
      }
    ],
  },
  'panties': {
    label: 'Panties',
    dbName: 'Panties',
    subs: [
      {
        name: 'Seamless Panties', slug: 'seamless',
        dbNames: ['Seamless', 'Seamless Panties', 'Seamless Invisibles', 'seamless'],
      },
      {
        name: 'High-Waist Panties', slug: 'high-waisted',
        dbNames: ['High-Waisted', 'High-Waist Panties', 'High-Waist Luxe', 'high-waisted', 'High Waist', 'Hipsters'],
      },
      {
        name: 'Bikini Panties', slug: 'bikini-panties',
        dbNames: ['Bikini Panties', 'Bikini Bliss', 'bikini-panties', 'Bikini'],
      },
      {
        name: 'Thongs', slug: 'thongs',
        dbNames: ['Thongs', 'Thongs & V-Strings', 'thongs', 'Thong'],
      },
      {
        name: 'Period Panties', slug: 'period-panties',
        dbNames: ['Period Panties', 'Period Care', 'period-panties'],
      }
    ],
  },
  'luxe': {
    label: 'Luxe Collection',
    dbName: 'Luxe',
    subs: [
      {
        name: 'Bridal Sets', slug: 'bridal',
        dbNames: ['Bridal Sets', 'Bridal Collection', 'Bridal Sanctuary', 'bridal', 'Bridal'],
      },
      {
        name: 'Silk & Satin Robes', slug: 'robes',
        dbNames: ['Silk Robes', 'Silk & Satin Robes', 'robes', 'Robes', 'Satin'],
      },
      {
        name: 'Nightwear', slug: 'nightwear',
        dbNames: ['Nightwear', 'Night Rituals', 'nightwear', 'Loungewear', 'Lounge'],
      },
      {
        name: 'Gift Sets', slug: 'gifts',
        dbNames: ['Gift Sets', 'gifts', 'Gifts', 'The Aura Series'],
      },
    ],
  },
  'nightwear': {
    label: 'Nightwear',
    dbName: 'Nightwear',
    subs: [
      {
        name: 'Babydolls', slug: 'babydolls',
        dbNames: ['Babydolls', 'Babydoll', 'babydolls'],
      },
      {
        name: 'Pajama Sets', slug: 'pajamas',
        dbNames: ['Pajama Sets', 'Pajamas', 'pajamas'],
      },
      {
        name: 'Nighties', slug: 'nighties',
        dbNames: ['Nighties', 'Nighty', 'nighties'],
      },
    ],
  },
  'innerwear': {
    label: 'Innerwear',
    dbName: 'Innerwear',
    subs: [
      {
        name: 'Camisoles', slug: 'camisoles',
        dbNames: ['Camisoles', 'Camisole', 'camisoles'],
      },
      {
        name: 'Shapewear', slug: 'shapewear',
        dbNames: ['Shapewear', 'shapewear', 'Shape Wear', 'Slips'],
      },
    ],
  },
  'bestsellers': { label: 'Bestsellers', dbName: 'Bestsellers' },
  'combos':      { label: 'Combo Packs', dbName: 'Combo Packs' },
};

const CategoryPage = () => {
  const params = useParams();
  const slugArray = params.slug as string[];
  const mainSlug = slugArray?.[0] || '';
  const subSlug  = slugArray?.[1] || '';

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const currentCategory = categoryMap[mainSlug] || { label: mainSlug?.toUpperCase(), dbName: mainSlug };
  const currentSub = (currentCategory.subs as SubCategory[] | undefined)?.find(s => s.slug === subSlug);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const filtered = data.filter((p: any) => {
            if (p.status && p.status !== 'Active') return false;

            const productCats: string[] = Array.isArray(p.categories)
              ? p.categories
              : p.category ? [p.category] : [];

            // ── Main category match (case-insensitive) ──
            const matchesMain = productCats.some(c => {
              if (typeof c !== 'string') return false;
              const low = c.trim().toLowerCase();
              return low === currentCategory.dbName.toLowerCase() ||
                     low === mainSlug.toLowerCase();
            });

            if (!matchesMain) return false;
            if (!subSlug)     return true;   // no sub-filter → show everything in main cat

            // ── Sub-category match using all known DB aliases ──
            if (currentSub?.dbNames) {
              const aliasesLow = currentSub.dbNames.map(n => n.toLowerCase());
              return productCats.some(c => {
                if (typeof c !== 'string') return false;
                const low = c.trim().toLowerCase();
                // Use exact match to avoid main categories (e.g. "Bras") 
                // matching sub-categories that contain that word (e.g. "Wireless Bras")
                return aliasesLow.some(alias => low === alias);
              });
            }

            // Fallback: match slug or display name directly
            const fallback = (currentSub?.name || subSlug).toLowerCase();
            return productCats.some(c => {
              if (typeof c !== 'string') return false;
              const low = c.trim().toLowerCase();
              return low === fallback || low === subSlug.toLowerCase();
            });
          });

          setProducts(filtered);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (mainSlug) fetchProducts();
  }, [mainSlug, subSlug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sortBy === 'price-high') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <main className="flex-1 pt-32 pb-24">

        {/* ── Category Header ── */}
        <div className="max-w-screen-xl mx-auto px-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">Bloomina Collection</p>
            <h1 className="text-6xl font-display font-light text-surface-on tracking-tight leading-none mb-8 capitalize">
              {currentSub ? currentSub.name : currentCategory.label} <br />
              <span className="italic text-primary/30">refined for you.</span>
            </h1>

            {/* Sub-category Pills */}
            {currentCategory.subs && (
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href={`/category/${mainSlug}`}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    !subSlug
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-stone-50 text-surface-on/40 hover:bg-stone-100'
                  }`}
                >
                  All {currentCategory.label}
                </Link>
                {(currentCategory.subs as SubCategory[]).map(sub => (
                  <Link
                    key={sub.slug}
                    href={`/category/${mainSlug}/${sub.slug}`}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      subSlug === sub.slug
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-stone-50 text-surface-on/40 hover:bg-stone-100'
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}

            <p className="text-sm font-light text-surface-on-variant leading-relaxed max-w-lg">
              Explore our {currentSub ? currentSub.name.toLowerCase() : currentCategory.label.toLowerCase()} essentials,
              meticulously crafted to provide ethereal comfort and a perfect silhouette.
            </p>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-y border-stone-50 mb-12">
          <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 hover:text-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                All Products
              </Link>
              <div className="h-4 w-[1px] bg-stone-100" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {products.length} {products.length === 1 ? 'Item' : 'Items'} Found
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-surface-on/20">Sort By</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-primary focus:ring-0 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="max-w-screen-xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-stone-50 rounded-[2rem]" />
                  <div className="h-4 bg-stone-50 rounded w-2/3" />
                  <div className="h-3 bg-stone-50 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {sortedProducts.map(product => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug || product.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-stone-50 mb-6 petal-shadow transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(241,145,161,0.25)]">
                    <img
                      src={(Array.isArray(product.images) ? product.images[0] : product.images?.[0]?.url) || 'https://via.placeholder.com/600x800'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-full py-4 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-bold uppercase tracking-widest text-primary shadow-xl hover:bg-primary hover:text-white transition-colors text-center">
                        View Product
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 px-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/40">
                      {Array.isArray(product.categories) ? product.categories[0] : (product.category || currentCategory.label)}
                    </p>
                    <h3 className="text-lg font-display text-surface-on group-hover:text-primary transition-colors tracking-tight">{product.name}</h3>
                    <p className="text-sm font-light text-surface-on-variant">
                      ₹{product.price ? parseFloat(product.price).toLocaleString() : '0'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-sm text-surface-on/40 font-medium italic">No products found in this collection yet.</p>
              <p className="mt-2 text-[10px] text-stone-300">Check back soon — new pieces arrive regularly.</p>
              <Link href="/products" className="mt-6 inline-block text-[10px] font-bold uppercase tracking-widest text-primary underline underline-offset-4">
                Browse All Collections
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 text-center border-t border-stone-100">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-on/20">Bloomina Collective — Curated with Love</p>
      </footer>
    </div>
  );
};

export default CategoryPage;
