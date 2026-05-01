"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock Cart Data for initial "wow" effect
const initialCartItems = [
  {
    id: '1',
    name: 'Petal Lace Bralette',
    variant: 'Size: M | Color: Bloom Pink',
    price: 3499,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAtTWwa3VJHNdsEG9oh5tTD15FG99afrssGfm94XV_lmqu2lz5xhHh8baJqMbO6_pBR9T__va2ZSnk8byx9iPNLAJ9oyVz-VTDPa7tn7X21Jll0_DYfCidLpHlP2d1IMDxHXZ_XKIq_WtWfdKF8vICuD8HyOxPLkk52M5BQ8wF2vR4irro2gTc_5lJaVZh_Ht3LXdc-p4TNf_K2ayzw46-pnv6gJk8TaqdWKSsROYZBx5PwA9kr-HpDF055nX5Y9k04Rbgy1h19mY'
  },
  {
    id: '2',
    name: 'Silk Lounge Pants',
    variant: 'Size: L | Color: Midnight Navy',
    price: 5200,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvfO2NIxaIgCESyQcNtM9KnBrKiNYbF7ncAfgP-RUU4bZRIUlzs3DmbF5JT_vhDyeU0jBWVop-pmwcivPOHz61VEjqkU1G0R6tzQuvJ9K6bmIsl6QfzQQttZo3o9G2szNxydX8C-REZATP4egaVlqSgtg5twEbhRn_0Y0_2vpFAdYbocuk-_avrPvSnzH5Bjpa5KLyLZsZkT7pKTZSZJMu4jOhIxbTNxwWYOVZ0D0poUYyI1UdojIvIXLyptrhEHgnKsUrJQeD9WY'
  }
];

const CartPage = () => {
  const [items, setItems] = useState(initialCartItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-40 pb-20 max-w-screen-xl mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-6xl text-primary/20 mb-6 font-light">shopping_basket</span>
          <h1 className="text-4xl font-display font-light text-surface-on mb-4">Your sanctuary is empty</h1>
          <p className="text-surface-on-variant mb-12 max-w-md mx-auto">Discover our collection of ethereal comfort and find your next favorite piece.</p>
          <Link href="/products" className="inline-block bg-primary text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            Explore Collection
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background antialiased">
      
      <main className="pt-32 md:pt-40 pb-24 max-w-screen-xl mx-auto px-6">
        <div className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-light text-surface-on tracking-tight">Your Selection</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-4">Review your ethereal comfort pieces</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-10">
            <div className="hidden md:grid grid-cols-12 pb-6 border-b border-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-10 border-b border-stone-50 group">
                {/* Product Info */}
                <div className="col-span-1 md:col-span-6 flex gap-6">
                  <div className="w-24 h-32 md:w-32 md:h-40 bg-stone-50 rounded-2xl overflow-hidden flex-shrink-0 petal-shadow">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <h3 className="text-lg md:text-xl font-display font-light text-surface-on">{item.name}</h3>
                    <p className="text-sm text-surface-on-variant/60">{item.variant}</p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-primary mt-4 hover:underline underline-offset-4 decoration-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden md:block col-span-2 text-center font-display text-lg text-surface-on/80">
                  ₹{item.price.toLocaleString()}
                </div>

                {/* Quantity Controls */}
                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <div className="flex items-center gap-4 bg-white border border-stone-100 px-4 py-2 rounded-full shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-stone-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-4 text-center text-xs font-bold font-body-md">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-stone-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-1 md:col-span-2 text-right">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Subtotal</span>
                  <span className="font-display text-xl text-primary font-medium">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebox */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(241,145,161,0.08)] border border-stone-50">
              <h2 className="text-2xl font-display font-light text-surface-on mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-on-variant">Subtotal</span>
                  <span className="font-medium text-surface-on">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-on-variant">Shipping</span>
                  <span className="text-green-600 font-medium uppercase text-[10px] tracking-widest">Free</span>
                </div>
                <div className="h-px bg-stone-100 my-4" />
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-display text-surface-on">Total</span>
                  <span className="text-3xl font-display text-primary font-medium">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                Proceed to Checkout
              </button>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-stone-400">
                  <span className="material-symbols-outlined text-lg font-light">verified_user</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <span className="material-symbols-outlined text-lg font-light">package_2</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Discreet Packaging</span>
                </div>
              </div>
            </div>

            {/* Support info */}
            <div className="mt-8 px-6">
              <p className="text-[10px] text-surface-on-variant/40 uppercase tracking-widest leading-relaxed">
                Need assistance? <br />
                Contact our concierge at <br />
                <span className="text-primary hover:underline cursor-pointer transition-colors">support@bloomina.com</span>
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
