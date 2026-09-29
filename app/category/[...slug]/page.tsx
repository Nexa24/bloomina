"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

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
        dbNames: ['Padded Bras', 'Padded', 'PADDED BRAS', 'padded-bras', 'PADDED', 'PADDED T-SHIRT BRAS'],
      },
      {
        name: 'Non-Padded Bras', slug: 'non-padded',
        dbNames: ['Non-Padded', 'NON-PADDED', 'non-padded', 'Non Padded', 'Non-Padded Bras'],
      },
      {
        name: 'T-Shirt Bras', slug: 't-shirt-bras',
        dbNames: ['T-Shirt Bras', 'T-SHIRT BRAS', 't-shirt-bras', 'T Shirt Bras', 'PADDED T-SHIRT BRAS'],
      },
      {
        name: 'Full Coverage Bras', slug: 'full-coverage-bras',
        dbNames: ['Full Coverage', 'FULL COVERAGE BRAS', 'full-coverage-bras', 'Full Coverage Bras'],
      },
      {
        name: 'Everyday Essentials', slug: 'everyday-essentials',
        dbNames: ['EVERYDAY ESSENTIALS', 'Everyday Essentials', 'EVERYDAY COMFORT BRAS', 'everyday-essentials'],
      },
      {
        name: 'Minimizer Bras', slug: 'minimizer-bra',
        dbNames: ['Minimizer Bras', 'MINIMIZER BRA', 'minimizer-bra', 'Minimizer Bra'],
      },
      {
        name: 'Teenager Bra', slug: 'teenager-bra',
        dbNames: ['TEENAGER BRA', 'Teenager Bra', 'teenager-bra'],
      }
    ],
  },
  'panties': {
    label: 'Panties',
    dbName: 'Panties',
    subs: [
      {
        name: 'Cotton Lycra Panties', slug: 'cotton-lycra',
        dbNames: ['COTTON LYCRA PANTIES', 'COTTON LYCRA', 'cotton-lycra', 'Cotton Lycra Panties', 'Cotton Lycra'],
      },
      {
        name: 'Modal Panties', slug: 'modal-panties',
        dbNames: ['MODAL PANTIES', 'modal-panties', 'Modal Panties', 'Modal'],
      },
      {
        name: 'Everyday Essentials', slug: 'everyday-essentials',
        dbNames: ['EVERYDAY ESSENTIALS', 'Everyday Essentials', 'everyday-essentials'],
      }
    ],
  },
  'sale': {
    label: 'Offers%',
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
  'offers': {
    label: 'Offers%',
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
  'new-arrivals':{ label: 'New Arrivals', dbName: 'New Arrivals' },
  'signature':   { label: 'Signature Collection', dbName: 'Signature Collection' },
  'buy-1-get-1': { label: 'Buy 1 Get 1', dbName: 'BOGO' },
  'bogo':        { label: 'Buy 1 Get 1', dbName: 'BOGO' },
  'combos':      { label: 'Combo Packs', dbName: 'Combo Packs' },
  'all': {
    label: 'All Products',
    dbName: 'All',
    subs: [
      { name: 'Bras', slug: 'bras', dbNames: ['Bras', 'BRAS', 'bras'] },
      { name: 'Panties', slug: 'panties', dbNames: ['Panties', 'PANTIES', 'panties'] },
    ],
  },
};

const CategoryPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const slugArray = params.slug as string[];
  const mainSlug = slugArray?.[0] || '';
  const subSlug  = slugArray?.[1] || '';
  const searchQuery = searchParams ? (searchParams.get('q') || searchParams.get('search') || '') : '';

  const [products, setProducts] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<Record<string, { rating: number; count: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const isSearchPage = mainSlug.toLowerCase() === 'search' || !!searchQuery;
  const currentCategory = isSearchPage
    ? { label: searchQuery ? `Search: "${searchQuery}"` : 'Search Results', dbName: 'Search' }
    : categoryMap[mainSlug] || { label: mainSlug?.toUpperCase(), dbName: mainSlug };
  const currentSub = !isSearchPage && (currentCategory.subs as SubCategory[] | undefined)?.find(s => s.slug === subSlug);

  useEffect(() => {
    let isCancelled = false;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch products and approved reviews in parallel
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

        if (isCancelled) return;
        if (productsRes.error) {
          console.error('Products fetch error:', productsRes.error);
          throw productsRes.error;
        }

        const data = productsRes.data;

        // Aggregate genuine review stats per product
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

        // 2. Resolve names from categoryMap or categories table if needed
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
        } else if (!isSearchPage && mainSlug) {
          try {
            const { data: directCat } = await supabase
              .from('categories')
              .select('*')
              .eq('slug', mainSlug.toLowerCase())
              .maybeSingle();

            if (directCat) {
              if (directCat.parent_id) {
                dbSubCategoryName = directCat.name;
                const { data: parentData } = await supabase
                  .from('categories')
                  .select('name')
                  .eq('id', directCat.parent_id)
                  .maybeSingle();
                if (parentData) {
                  dbCategoryName = parentData.name;
                  dbParentCategoryName = parentData.name;
                } else {
                  dbCategoryName = directCat.name;
                }
              } else {
                dbCategoryName = directCat.name;
              }
            }
          } catch (e) {
            console.warn('Category lookup notice:', e);
          }
        }

        if (!dbCategoryName) {
          dbCategoryName = mainSlug;
        }

        if (data) {
          const filtered = data.filter((p: any) => {
            if (p.status && p.status !== 'Active') return false;

            // Search filter: if on search page OR search query parameter is present
            if (searchQuery) {
              const q = searchQuery.toLowerCase().trim();
              const nameMatch = (p.name || '').toLowerCase().includes(q);
              const descMatch = (p.description || '').toLowerCase().includes(q);
              const productCats: string[] = Array.isArray(p.categories)
                ? p.categories
                : p.category ? [p.category] : [];
              const catMatch = productCats.some(c => typeof c === 'string' && c.trim().toLowerCase().includes(q));
              if (!nameMatch && !descMatch && !catMatch) return false;
              if (mainSlug.toLowerCase() === 'search') return true;
            } else if (mainSlug.toLowerCase() === 'search') {
              return true;
            }

            const productCats: string[] = Array.isArray(p.categories)
              ? p.categories
              : p.category ? [p.category] : [];

            // ── Main category match ──
            const isAllSection = mainSlug.toLowerCase() === 'all';
            const isSaleSection = mainSlug.toLowerCase() === 'sale' || mainSlug.toLowerCase() === 'offers' || dbCategoryName.toLowerCase() === 'sale%';
            const isBogoSection = mainSlug.toLowerCase() === 'bogo' || mainSlug.toLowerCase() === 'buy-1-get-1' || mainSlug.toLowerCase() === 'buy-one-get-one';
            const isBogoProduct = Boolean(
              p.is_bogo === true ||
              (Array.isArray(p.specifications) && p.specifications.some((s: any) => s.name === 'is_bogo' && s.value === 'true')) ||
              productCats.some(c => typeof c === 'string' && /^(bogo|buy 1 get 1|buy 1 get 1 free|buy-1-get-1)$/i.test(c.trim()))
            );

            const prodPrice = parseFloat(p.price) || 0;
            const prodComparePrice = parseFloat(p.comparePrice || p.original_price || p.mrp) || 0;
            const hasDiscount = prodComparePrice > prodPrice;

            const matchesMain = isAllSection
              ? true
              : isSaleSection 
                ? (hasDiscount || productCats.some(c => typeof c === 'string' && (c.trim().toLowerCase() === 'sale%' || c.trim().toLowerCase().includes('offer'))))
                : isBogoSection
                  ? isBogoProduct
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
              // Look up aliases from categoryMap if not already set by currentSub
              let aliases = currentSub?.dbNames;
              if (!aliases) {
                for (const catKey of Object.keys(categoryMap)) {
                  const foundSub = categoryMap[catKey].subs?.find(
                    s => s.slug.toLowerCase() === mainSlug.toLowerCase() ||
                         s.slug.toLowerCase() === subSlug.toLowerCase() ||
                         s.name.toLowerCase() === targetSubName.trim().toLowerCase()
                  );
                  if (foundSub) {
                    aliases = foundSub.dbNames;
                    break;
                  }
                }
              }
              const finalAliases = aliases || [targetSubName];
              const aliasesLow = finalAliases.map(n => n.toLowerCase().trim());
              return productCats.some(c => {
                if (typeof c !== 'string') return false;
                const low = c.trim().toLowerCase();
                return (
                  aliasesLow.includes(low) ||
                  low === targetSubName.toLowerCase().trim() ||
                  (mainSlug && low === mainSlug.toLowerCase().trim()) ||
                  (subSlug && low === subSlug.toLowerCase().trim())
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
        if (!isCancelled) setIsLoading(false);
      }
    };

    if (mainSlug) fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [mainSlug, subSlug, searchQuery]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sortBy === 'price-high') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      <main className="flex-1 pt-32 pb-24">



        {/* ── Category Header & Breadcrumb ── */}
        <div className="max-w-screen-xl mx-auto px-6 mb-8">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-surface-on/40 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-stone-300">/</span>
            <Link href="/all-categories" className="hover:text-primary transition-colors">All Categories</Link>
            <span className="text-stone-300">/</span>
            <Link href="/category/all" className="hover:text-primary transition-colors">All Products</Link>
            {mainSlug && mainSlug.toLowerCase() !== 'all' && (
              <>
                <span className="text-stone-300">/</span>
                {subSlug ? (
                  <Link href={`/category/${mainSlug}`} className="hover:text-primary transition-colors text-primary font-bold">
                    {currentCategory.label}
                  </Link>
                ) : (
                  <span className="text-primary font-bold">{currentCategory.label}</span>
                )}
              </>
            )}
            {subSlug && (
              <>
                <span className="text-stone-300">/</span>
                <span className="text-primary font-bold">{currentSub?.name || subSlug}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2">Bloomina Collection</p>
              <h1 className="text-4xl md:text-5xl font-display font-light text-surface-on tracking-tight capitalize">
                {subSlug ? (currentSub?.name || subSlug) : currentCategory.label}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {subSlug && (
                <Link 
                  href={`/category/${mainSlug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary hover:underline group"
                >
                  <span>View Full {currentCategory.label} Collection</span>
                  <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
              )}
              <Link
                href="/all-categories"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-700 hover:text-primary hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-primary">grid_view</span>
                <span>All Categories</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-y border-stone-50 mb-12">
          <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {subSlug ? (
                <Link 
                  href={`/category/${mainSlug}`} 
                  className="text-[10px] font-bold uppercase tracking-widest text-surface-on/60 hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>{currentCategory.label}</span>
                </Link>
              ) : (
                <Link 
                  href="/all-categories" 
                  className="text-[10px] font-bold uppercase tracking-widest text-surface-on/60 hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>All Categories</span>
                </Link>
              )}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-16">
              {sortedProducts.map(product => {
                const genuine = reviewStats[String(product.id)];
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    price={parseFloat(product.price) || 0}
                    comparePrice={product.comparePrice || product.original_price || product.mrp}
                    image={(Array.isArray(product.images) ? product.images[0] : product.images?.[0]?.url) || 'https://placehold.co/600x800?text=No+Image'}
                    category={Array.isArray(product.categories) ? product.categories[0] : (product.category || currentCategory.label)}
                    colorConfigs={product.colorConfigs || []}
                    variants={product.variants || []}
                    rating={genuine?.rating}
                    reviewCount={genuine?.count || 0}
                  />
                );
              })}
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
