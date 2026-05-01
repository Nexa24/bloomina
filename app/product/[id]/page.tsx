"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data for initial rendering
const mockProduct = {
  id: '1',
  title: 'The Petal Silk Contour Bra',
  price: 2499,
  category: 'Signature Collection',
  description: "Designed to feel like a second skin, the Petal Silk Contour Bra combines our signature floral lace with ultra-breathable Japanese mulberry silk. Experience effortless support without the weight, featuring our patented 'Soft-Lift' technology that moves with your body.",
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBTbghw_WZVzhd9DKApPxJcoUK9cwJkf44QoDbHoRjTRnubMMge4zVDFV4aKhYlPUZNpOupfdzT_0TFOc5M6oK763b3jWnP3FX8u0mOjZs3PFlSuFUrwyW4_flxdqhvotNurlXfZlqgu9fsu5PAuM8dAy-TskCzImUd_-ghDraPg07vOihUfj8zdinMGOjJgvlkxSv-3v0qUaYWyUveFWSIXwp6uyeh7Wq5XildCnMHdWUN0Mar7Gjox8ZGa_kkMAJD0mIuDs0er5Y',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCTIWoOnng9K5yPSpMmXc95o8OC9DqFYy3aJ-qQmGyDE1_nwTAQUviGPWPn4a_6jwpIJqbdd--zu-Ora9nPDKYVguXj8l2ZejYrHveF9Ub1ZgQHV7rMX8Yj0AQOXTRj5q0bvo9oUiiNxuFOAd03b06nnez2bXMjJJiDilYl1btuP5V7mnHYLRi-NO9uc3eqPndWIDalbP7JGONXA7vm198_diIzFOlrgW3k6encuh-Fq_-x8zekJG8dUBArnl581pQGNhON2yiS-wg'
  ],
  features: [
    { icon: 'auto_awesome', title: 'Breathable Mesh', desc: 'Stay fresh with advanced moisture-wicking technology.' },
    { icon: 'favorite', title: 'Silk Lined', desc: 'Inner cups lined with 100% hypoallergenic mulberry silk.' }
  ],
  colors: [
    { name: 'Bloom Pink', hex: '#f191a1' },
    { name: 'Pure White', hex: '#f5f5f5' },
    { name: 'Midnight', hex: '#575d78' }
  ],
  sizes: ['32B', '34B', '36B', '38B', '32C', '34C', '36C', '38C']
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const [selectedSize, setSelectedSize] = useState('34B');
  const [selectedColor, setSelectedColor] = useState('Bloom Pink');
  const [isAdded, setIsAdded] = useState(false);

  const product = mockProduct;

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="bg-white min-h-screen antialiased overflow-x-hidden">
      
      <main className="pb-32 w-full">
        {/* Product Gallery & Core Info */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-28 md:pt-40 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          
          {/* Left: Sticky Image Gallery */}
          <div className="w-full space-y-4 lg:sticky lg:top-32 self-start">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container-low petal-shadow group">
              <Image 
                src={product.images[0]} 
                alt={product.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <Image src={product.images[1]} alt="Detail 1" fill className="object-cover" />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-low flex items-center justify-center border border-primary/10 group cursor-pointer">
                <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">add_photo_alternate</span>
                <span className="absolute bottom-4 text-[10px] font-bold uppercase tracking-widest text-primary/40">+4 View Detail</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Controls */}
          <div className="flex flex-col space-y-8 py-4 w-full min-w-0">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">{product.category}</span>
              <h1 className="text-3xl md:text-5xl font-display font-light text-surface-on tracking-tight leading-tight">
                {product.title}
              </h1>
              <p className="text-2xl font-display text-primary/80">₹{product.price.toLocaleString('en-IN')}.00</p>
            </div>

            <p className="text-surface-on-variant font-light leading-relaxed text-base max-w-lg">
              {product.description}
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-primary/5">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary/60">{feature.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-surface-on">{feature.title}</h4>
                    <p className="text-xs text-surface-on-variant font-light mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Controls */}
            <div className="space-y-10 pt-4">
              {/* Color Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-on/40">Select Color</h3>
                  <span className="text-xs font-medium text-surface-on-variant">{selectedColor}</span>
                </div>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button 
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full p-0.5 border-2 transition-all ${selectedColor === color.name ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                    >
                      <span className="block w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-on/40">Select Size</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-primary underline underline-offset-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">straighten</span>
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 rounded-xl text-sm transition-all border ${selectedSize === size ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-primary/10 text-surface-on-variant hover:border-primary/40'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 relative">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 overflow-hidden relative ${isAdded ? 'bg-green-500 shadow-green-100 text-white' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95'}`}
                >
                  <span className={`flex items-center justify-center gap-2 transition-transform duration-500 ${isAdded ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                    Add to Cart
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ${isAdded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    <span className="material-symbols-outlined text-base">check</span>
                    Added to Cart
                  </span>
                </button>
                <button className="px-6 py-5 border border-primary/20 rounded-full flex items-center justify-center hover:bg-primary/5 transition-all text-primary">
                  <span className="material-symbols-outlined">favorite</span>
                </button>

                {/* Quick Link to Cart (Appears after adding) */}
                <Link 
                  href="/cart"
                  className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-primary transition-all duration-500 ${isAdded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                >
                  View Cart
                </Link>
              </div>

              {/* Delivery Estimation */}
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-surface-on/30 pt-10">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                <span>Ships in 2-3 business days • Free Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Material Science Section */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 mt-24 space-y-16 w-full overflow-hidden">
          <div className="text-center space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Philosophy</h2>
            <h3 className="text-4xl font-display font-medium text-surface-on">The Material Science</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[600px]">
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-surface-container-low petal-shadow">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGPPq_cBqSwAdy2cUN61awIe3gHZnI8rrU8p6OcWfMpd9O15RW-Pthd8D6uFCE5kfCG903UdG_jYB0ug4BL7eK1XqDYW2VAhwENq3ocFtqhu-fJZN4sr6JoTXii2sCC-evy2PSGkGuQST8e0MOToQ39ZZjjb9ZnXDsQq0YDbjANz3SfEC5TScPZmV8eB-xVNcTfnVQJx7IWG5N5I-9Pq8SEUfzjLXQnrTp-1TvMAxlbsuJQQZb63KpyPBNctGiuZQ5pFmVlRFml0s" 
                alt="Silk Texture" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-12 flex flex-col justify-end">
                <h4 className="text-white font-display text-3xl mb-4">Ethical Mulberry Silk</h4>
                <p className="text-white/80 max-w-md font-light leading-relaxed">
                  Our silk is sourced from sustainable farms, ensuring a carbon-neutral footprint while providing unmatched softness and breathability.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-surface-container-low p-10 rounded-3xl flex flex-col justify-center gap-6 border border-white">
                <span className="material-symbols-outlined text-primary scale-150 origin-left">spa</span>
                <h4 className="text-2xl font-display text-surface-on">Floral Intricacy</h4>
                <p className="text-surface-on-variant font-light text-sm">Each lace pattern is custom-illustrated to mimic the organic geometry of spring petals.</p>
              </div>
              <div className="flex-1 bg-primary text-white p-10 rounded-3xl flex flex-col justify-center gap-6 petal-shadow">
                <span className="material-symbols-outlined scale-150 origin-left">biotech</span>
                <h4 className="text-2xl font-display">Soft-Lift Tech</h4>
                <p className="text-white/80 font-light text-sm">Revolutionary non-wire support that adapts to your unique silhouette effortlessly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
