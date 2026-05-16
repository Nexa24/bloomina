"use client";

import React, { useEffect, useState } from 'react';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

const WishlistPage = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <main className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-display font-light text-surface-on tracking-tight">
              My Sanctuary
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Your curated collection of ethereal pieces
            </p>
          </div>
          
          {items.length > 0 && (
            <button 
              onClick={() => {
                if(confirm('Are you sure you want to clear your sanctuary?')) {
                  clearWishlist();
                }
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Clear All Favorites
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-fade-in">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
              <span className="material-symbols-outlined text-5xl text-primary/20 absolute inset-0 flex items-center justify-center">favorite</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-display font-light text-surface-on">Your sanctuary is empty</h2>
              <p className="text-sm text-stone-400 max-w-xs mx-auto">Discover pieces that speak to your soul and save them here.</p>
            </div>
            <Link 
              href="/products" 
              className="bg-primary text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {items.map((item) => (
              <div key={item.id} className="relative group/item">
                <ProductCard 
                  id={item.id}
                  title={item.name}
                  price={item.price}
                  image={item.image}
                  category={item.category || 'Collection'}
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({
                      id: `${item.id}-default`,
                      productId: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      quantity: 1
                    });
                    // Optional: show a toast or feedback
                  }}
                  className="mt-4 w-full bg-surface-on text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-all hover:bg-primary"
                >
                  Quick Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Section for Premium Feel */}
        {items.length > 0 && (
          <div className="mt-32 pt-24 border-t border-stone-100">
            <h3 className="text-xl font-display font-light text-surface-on mb-12 text-center italic">
              Inspired by your choices
            </h3>
            {/* We could add a ProductGrid with random products here later */}
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;
