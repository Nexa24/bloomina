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
    <div className="bg-background pt-24 md:pt-32 pb-8 md:pb-12">
      <main className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-light text-surface-on tracking-tight">
              My Wishlist <span className="text-primary font-normal text-2xl md:text-4xl">({items.length})</span>
            </h1>
          </div>
          
          {items.length > 0 && (
            <button 
              onClick={() => {
                if(confirm('Are you sure you want to clear your wishlist?')) {
                  clearWishlist();
                }
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Clear All Favorites
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center space-y-4 animate-fade-in">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-primary/5 rounded-full" />
              <span className="material-symbols-outlined text-3xl text-primary/30 absolute inset-0 flex items-center justify-center">favorite</span>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl md:text-2xl font-display font-light text-surface-on">Your wishlist is empty</h2>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">Discover pieces you love and save them here.</p>
            </div>
            <Link 
              href="/products" 
              className="bg-primary text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-block"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
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
