"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
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
        name: 'Padded Bras', slug: 'padded-bras',
        dbNames: ['Padded Bras', 'Padded', 'PADDED BRAS', 'padded-bras'],
      },
      {
        name: 'Non-Padded', slug: 'non-padded',
        dbNames: ['Non-Padded', 'NON-PADDED', 'non-padded', 'Non Padded'],
      },
      {
        name: 'Full Coverage', slug: 'full-coverage-bras',
        dbNames: ['Full Coverage', 'FULL COVERAGE BRAS', 'full-coverage-bras', 'Full Coverage Bras'],
      },
      {
        name: 'Feeding & Maternity', slug: 'feeding-maternity-bras',
        dbNames: ['Feeding & Maternity', 'FEEDING / MATERNITY BRAS', 'feeding-maternity-bras', 'Maternity Bras', 'Nursing Bras'],
      },
      {
        name: 'Minimizer Bras', slug: 'minimizer-bra',
        dbNames: ['Minimizer Bras', 'MINIMIZER BRA', 'minimizer-bra', 'Minimizer Bra'],
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
  'sale': {
    label: 'Sale%',
    dbName: 'Sale%',
    subs: [
      {
        name: 'Bras on Sale', slug: 'bras',
        dbNames: ['Bras on Sale', 'Sale Bras', 'bras-on-sale'],
      },
      {
        name: 'Panties on Sale', slug: 'panties',
        dbNames: ['Panties on Sale', 'Sale Panties', 'panties-on-sale'],
      },
      {
        name: 'Combo Pack Offers', slug: 'combos',
        dbNames: ['Combo Pack Offers', 'Combo Packs on Sale', 'combos-on-sale'],
      },
      {
        name: 'Clearance', slug: 'clearance',
        dbNames: ['Clearance', 'Clearance Sale', 'clearance-sale'],
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
  'signature':   { label: 'Signature Collection', dbName: 'Signature' },
};

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const slugArray = params.slug as string[];
  const mainSlug = slugArray?.[0] || '';
  const subSlug  = slugArray?.[1] || '';
  const searchQuery = searchParams ? (searchParams.get('q') || '') : '';

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const isSearchPage = mainSlug.toLowerCase() === 'search';
  const currentCategory = isSearchPage
    ? { label: 'Search Results', dbName: 'Search' }
    : categoryMap[mainSlug] || { label: mainSlug?.toUpperCase(), dbName: mainSlug };
  const currentSub = !isSearchPage && (currentCategory.subs as SubCategory[] | undefined)?.find(s => s.slug === subSlug);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // 1. Resolve names from database or hardcoded categoryMap
        let dbCategoryName = '';
        let dbSubCategoryName = '';
        let dbParentCategoryName = '';

        const hardcoded = categoryMap[mainSlug.toLowerCase()];
        if (hardcoded) {
          dbCategoryName = hardcoded.dbName;
          if (subSlug) {
            const sub = hardcoded.subs?.find(s => s.slug === subSlug.toLowerCase());
            if (sub) {
              dbSubCategoryName = sub.name;
            }
          }
        }

        // Fetch category by mainSlug from DB if not resolved
        if (!dbCategoryName) {
          const { data: catData } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', mainSlug.toLowerCase())
            .maybeSingle();

          if (catData) {
            if (catData.parent_id) {
              // It's a direct subcategory URL (e.g. /category/feeding-maternity-bras)
              dbSubCategoryName = catData.name;
              // Fetch parent category name
              const { data: parentData } = await supabase
                .from('categories')
                .select('name')
                .eq('id', catData.parent_id)
                .maybeSingle();
              if (parentData) {
                dbCategoryName = parentData.name;
                dbParentCategoryName = parentData.name;
              } else {
                dbCategoryName = catData.name;
              }
            } else {
              // It's a main category URL (e.g. /category/bras)
              dbCategoryName = catData.name;
            }
          } else {
            // Fallback
            dbCategoryName = mainSlug;
          }
        }

        // If there is a subSlug in URL, try to resolve it from the DB
        if (subSlug && !dbSubCategoryName) {
          const { data: subData } = await supabase
            .from('categories')
            .select('name')
            .eq('slug', subSlug.toLowerCase())
            .maybeSingle();
          if (subData) {
            dbSubCategoryName = subData.name;
          }
        }

        // 2. Fetch all products
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const filtered = data.filter((p: any) => {
            if (p.status && p.status !== 'Active') return false;

            if (isSearchPage) {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase().trim();
              const nameMatch = (p.name || '').toLowerCase().includes(q);
              const descMatch = (p.description || '').toLowerCase().includes(q);
              const productCats: string[] = Array.isArray(p.categories)
                ? p.categories
                : p.category ? [p.category] : [];
              const catMatch = productCats.some(c => typeof c === 'string' && c.trim().toLowerCase().includes(q));
              return nameMatch || descMatch || catMatch;
            }

            const productCats: string[] = Array.isArray(p.categories)
              ? p.categories
              : p.category ? [p.category] : [];

            // ── Main category match ──
            const isSaleSection = mainSlug.toLowerCase() === 'sale' || dbCategoryName.toLowerCase() === 'sale%';
            const matchesMain = isSaleSection 
              ? (p.is_sale === true || productCats.some(c => typeof c === 'string' && c.trim().toLowerCase() === 'sale%'))
              : productCats.some(c => {
                  if (typeof c !== 'string') return false;
                  const low = c.trim().toLowerCase();
                  return (
                    low === dbCategoryName.toLowerCase() ||
                    low === mainSlug.toLowerCase() ||
                    (dbParentCategoryName && low === dbParentCategoryName.toLowerCase()) ||
                    (mainSlug.toLowerCase() === 'signature' && low === 'signature collection')
                  );
                });

            if (!matchesMain) return false;

            // If we are showing a specific subcategory (resolved or by subSlug in URL)
            const targetSubName = dbSubCategoryName || subSlug;
            if (targetSubName) {
              if (isSaleSection) {
                const aliasesLow = currentSub?.dbNames ? currentSub.dbNames.map(n => n.toLowerCase()) : [];
                const hasSaleSubcat = productCats.some(c => typeof c === 'string' && aliasesLow.includes(c.trim().toLowerCase()));
                if (hasSaleSubcat) return true;

                const isSaleProduct = p.is_sale === true || productCats.some(c => typeof c === 'string' && c.trim().toLowerCase() === 'sale%');
                if (isSaleProduct) {
                  const targetSubLow = targetSubName.toLowerCase();
                  if (targetSubLow === 'bras') {
                    return /bra/i.test(p.name || '') || productCats.some(c => /bra/i.test(c));
                  }
                  if (targetSubLow === 'panties') {
                    return /pantie|panties|panty|brief/i.test(p.name || '') || productCats.some(c => /pantie|panties|panty|brief/i.test(c));
                  }
                  if (targetSubLow === 'combos') {
                    return /combo|set|pack/i.test(p.name || '') || productCats.some(c => /combo|pack/i.test(c));
                  }
                  if (targetSubLow === 'clearance') {
                    return productCats.some(c => /clearance/i.test(c));
                  }
                }
                return false;
              }

              // ── Sub-category match using all known DB aliases or direct matching ──
              const aliases = currentSub?.dbNames || [targetSubName];
              const aliasesLow = aliases.map(n => n.toLowerCase());
              return productCats.some(c => {
                if (typeof c !== 'string') return false;
                const low = c.trim().toLowerCase();
                return (
                  aliasesLow.includes(low) ||
                  low === targetSubName.toLowerCase() ||
                  (subSlug && low === subSlug.toLowerCase())
                );
              });
            }

            return true;
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
  }, [mainSlug, subSlug, searchQuery]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sortBy === 'price-high') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <main className="flex-1 pt-32 pb-24">



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
                    <h3 className="text-base md:text-lg font-dmsans font-bold text-surface-on group-hover:text-primary transition-colors tracking-tight">{product.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-price font-bold text-surface-on-variant">
                        ₹{product.price ? parseFloat(product.price).toLocaleString() : '0'}
                      </p>
                      {(product.comparePrice || product.original_price || product.mrp) &&
                        parseFloat(product.comparePrice || product.original_price || product.mrp) > parseFloat(product.price) && (
                        <span className="text-xs font-price text-stone-400 line-through">
                          ₹{parseFloat(product.comparePrice || product.original_price || product.mrp).toLocaleString()}
                        </span>
                      )}
                    </div>
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
