"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AllProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Categories based on the collection definition
  const categories = [
    { label: 'All Essentials', value: 'all' },
    { label: 'Innerwear', value: 'innerwear' },
    { label: 'Lounge', value: 'lounge' },
    { label: 'Activewear', value: 'activewear' },
    { label: 'Accessories', value: 'accessories' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.docs || []);
          setFilteredProducts(data.docs || []);
        } else {
          // If no data, use some premium mocks to keep the WOW factor
          const mocks = [
            { id: '1', title: 'The Petal Lace Bra', price: 89, category: 'innerwear', images: [{ url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAtTWwa3VJHNdsEG9oh5tTD15FG99afrssGfm94XV_lmqu2lz5xhHh8baJqMbO6_pBR9T__va2ZSnk8byx9iPNLAJ9oyVz-VTDPa7tn7X21Jll0_DYfCidLpHlP2d1IMDxHXZ_XKIq_WtWfdKF8vICuD8HyOxPLkk52M5BQ8wF2vR4irro2gTc_5lJaVZh_Ht3LXdc-p4TNf_K2ayzw46-pnv6gJk8TaqdWKSsROYZBx5PwA9kr-HpDF055nX5Y9k04Rbgy1h19mY' }] },
            { id: '2', title: 'Silk Morning Robe', price: 145, category: 'lounge', images: [{ url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvfO2NIxaIgCESyQcNtM9KnBrKiNYbF7ncAfgP-RUU4bZRIUlzs3DmbF5JT_vhDyeU0jBWVop-pmwcivPOHz61VEjqkU1G0R6tzQuvJ9K6bmIsl6QfzQQttZo3o9G2szNxydX8C-REZATP4egaVlqSgtg5twEbhRn_0Y0_2vpFAdYbocuk-_avrPvSnzH5Bjpa5KLyLZsZkT7pKTZSZJMu4jOhIxbTNxwWYOVZ0D0poUYyI1UdojIvIXLyptrhEHgnKsUrJQeD9WY' }] },
            { id: '3', title: 'Essential High-Waist Panty', price: 32, category: 'innerwear', images: [{ url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80' }] },
            { id: '4', title: 'Zen Flow Leggings', price: 78, category: 'activewear', images: [{ url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&q=80' }] },
            { id: '5', title: 'Signature Silk Scarf', price: 45, category: 'accessories', images: [{ url: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a5bf?auto=format&fit=crop&q=80' }] },
            { id: '6', title: 'Midnight Lace Bralette', price: 92, category: 'innerwear', images: [{ url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80' }] },
          ];
          setProducts(mocks);
          setFilteredProducts(mocks);
        }
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    
    setFilteredProducts([...result]);
  }, [activeCategory, sortBy, products]);

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased">
      
      <main className="flex-1 pt-32 pb-24">
        {/* Collection Header */}
        <div className="max-w-screen-xl mx-auto px-6 mb-16">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">The Bloomina Collection</p>
            <h1 className="text-6xl font-display font-light text-surface-on tracking-tight leading-none mb-6">
              Essential Elegance <br />
              <span className="italic text-primary/30">for every silhouette.</span>
            </h1>
            <p className="text-sm font-light text-surface-on-variant leading-relaxed max-w-lg">
              Explore our meticulously curated selection of premium innerwear and lounge essentials, designed to embrace your natural beauty with ethereal comfort.
            </p>
          </div>
        </div>

        {/* Toolbar: Filters & Sorting */}
        <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-y border-stone-50 mb-12">
          <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat.value 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-stone-50 text-surface-on/40 hover:bg-stone-100 hover:text-surface-on'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sorting */}
            <div className="hidden md:flex items-center gap-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-surface-on/20">Sort By</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-primary focus:ring-0 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-screen-xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4 animate-pulse">
                  <div className="aspect-[3/4] bg-stone-50 rounded-[2rem]" />
                  <div className="h-4 bg-stone-50 rounded w-2/3" />
                  <div className="h-3 bg-stone-50 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/product/${product.slug || product.id}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-stone-50 mb-6 petal-shadow transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(241,145,161,0.25)]">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/600x800'} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="w-full py-4 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-bold uppercase tracking-widest text-primary shadow-xl hover:bg-primary hover:text-white transition-colors">
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 px-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/40">{product.category}</p>
                    <h3 className="text-lg font-display text-surface-on group-hover:text-primary transition-colors tracking-tight">{product.title}</h3>
                    <p className="text-sm font-light text-surface-on-variant">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <span className="material-symbols-outlined text-4xl text-stone-200 mb-4">search_off</span>
              <p className="text-sm text-surface-on/40 font-medium italic">No products found in this category.</p>
              <button 
                onClick={() => setActiveCategory('all')}
                className="mt-6 text-[10px] font-bold uppercase tracking-widest text-primary underline underline-offset-4"
              >
                View All Collections
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Decorative Newsletter Section */}
      <section className="bg-stone-50 py-32 px-6">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-display font-light mb-6">Bloom in Your Inbox</h2>
            <p className="text-sm font-light text-surface-on-variant mb-12">Join the collective for exclusive early access to new collections and invitations to private sanctuary events.</p>
            <form className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-1 bg-white border border-stone-100 rounded-full px-8 py-5 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
              <button className="px-12 py-5 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center border-t border-stone-100">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-on/20">Bloomina Collective — Curated with Love</p>
      </footer>
    </div>
  );
};

export default AllProductsPage;
