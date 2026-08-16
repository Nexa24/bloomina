'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ScrollReveal from './ScrollReveal';

const fallbackItems = [
  {
    title: "Wireless Bras",
    tagline: "Comfort redefined.",
    href: "/category/bras/wireless-bras",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80"
  },
  {
    title: "Seamless Panties",
    tagline: "Breathable by design.",
    href: "/category/panties/seamless",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80"
  },
  {
    title: "Lace Intimates",
    tagline: "Feather light feel.",
    href: "/category/bras/lace-intimates",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80"
  },
  {
    title: "Bestsellers",
    tagline: "Curated with love.",
    href: "/category/bestsellers",
    image: "https://images.unsplash.com/photo-1601924638867-3a6de6b7a5bf?auto=format&fit=crop&q=80"
  }
];

const getCategoryHref = (cat: any, parent: any) => {
  if (cat.category_type === 'universal') {
    return `/category/${cat.slug}`;
  }
  if (cat.category_type === 'subcategory' && parent) {
    let parentSlug = parent.slug.toLowerCase();
    let subSlug = cat.slug.toLowerCase();
    
    // Map database slugs to storefront categoryMap slugs for backward-compatibility
    if (subSlug === 'seamless-panties') subSlug = 'seamless';
    if (subSlug === 'lace-bras') subSlug = 'lace-intimates';
    if (subSlug === 'padded-bras') subSlug = 'full-coverage';
    
    return `/category/${parentSlug}/${subSlug}`;
  }
  return `/category/${cat.slug}`;
};

export default function CategoryCarousel() {
  const [items, setItems] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const fetchCarouselCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*');

        if (error) throw error;

        if (data) {
          const carouselCats = data.filter((cat: any) => 
            cat.home_carousel === true
          );

          const mapped = carouselCats.map((cat: any) => {
            const parent = cat.parent_id ? data.find((p: any) => p.id === cat.parent_id) : null;
            
            let tagline = cat.badge || "Curated with love.";
            if (cat.slug.includes('wireless')) tagline = "Comfort redefined.";
            if (cat.slug.includes('seamless')) tagline = "Breathable by design.";
            if (cat.slug.includes('lace')) tagline = "Feather light feel.";

            return {
              title: cat.name,
              tagline,
              href: getCategoryHref(cat, parent),
              image: cat.image || 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80'
            };
          });

          if (mapped.length > 0) {
            setItems(mapped);
            // Default active index to center element
            setActiveIndex(Math.floor(mapped.length / 2));
          } else {
            setItems(fallbackItems);
            setActiveIndex(1);
          }
        }
      } catch (err) {
        console.error('Error fetching carousel categories:', err);
        setItems(fallbackItems);
        setActiveIndex(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselCategories();
  }, []);

  const nextSlide = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Helper to calculate visual positions
  const getSlidePosition = (index: number) => {
    if (items.length === 0) return 'hidden';
    const diff = (index - activeIndex + items.length) % items.length;
    if (diff === 0) return 'active';
    if (diff === 1 || (activeIndex === items.length - 1 && index === 0)) return 'right';
    if (diff === items.length - 1 || (activeIndex === 0 && index === items.length - 1)) return 'left';
    return 'hidden';
  };

  if (isLoading || items.length === 0) return null;

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-4 md:py-6">
      <ScrollReveal variant="slide-up" duration={800}>
        <div className="mb-4 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-display font-light uppercase tracking-[0.25em] text-primary">Featured Categories</h2>
        </div>
      </ScrollReveal>

      <div 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative flex items-center justify-center h-[260px] md:h-[380px] select-none overflow-hidden py-2"
      >
        {/* Navigation Left */}
        {items.length > 1 && (
          <button 
            onClick={prevSlide}
            className="absolute left-2 md:left-6 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-stone-200 shadow-lg flex items-center justify-center text-surface-on hover:text-primary transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Slides Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          {items.map((item, idx) => {
            const position = getSlidePosition(idx);
            
            if (position === 'hidden') return null;

            let positionClasses = "";
            if (position === 'active') {
              positionClasses = "z-20 scale-100 md:scale-105 opacity-100 w-[70%] sm:w-[55%] md:w-[38%] translate-x-0";
            } else if (position === 'left') {
              positionClasses = "z-10 scale-90 md:scale-95 opacity-85 w-[60%] sm:w-[48%] md:w-[34%] -translate-x-[75%] sm:-translate-x-[70%] md:-translate-x-[80%]";
            } else if (position === 'right') {
              positionClasses = "z-10 scale-90 md:scale-95 opacity-85 w-[60%] sm:w-[48%] md:w-[34%] translate-x-[75%] sm:translate-x-[70%] md:translate-x-[80%]";
            }

            return (
              <div 
                key={idx}
                className={`absolute transition-all duration-700 ease-out h-full ${positionClasses}`}
              >
                <div className="w-full h-full rounded-[2rem] overflow-hidden border border-stone-100/10 relative shadow-2xl group flex flex-col justify-end">
                  {/* Full Element Image Background */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-w-768px) 70vw, 30vw"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />
                  </div>

                  {/* Text & Action Buttons Overlaid */}
                  <div className="relative z-10 p-6 md:p-10 flex flex-col justify-end h-full text-white space-y-4 md:space-y-6">
                    <div className="space-y-1.5 md:space-y-3">
                      <h4 className="text-lg sm:text-xl md:text-3xl font-display font-light text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs md:text-sm font-light text-white/80 leading-normal">
                        {item.tagline}
                      </p>
                    </div>
                    <div>
                      <Link 
                        href={item.href}
                        className="inline-block px-5 py-2.5 md:px-8 md:py-3.5 border border-white/85 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white hover:bg-primary hover:border-primary hover:scale-105 hover:shadow-xl transition-all duration-300"
                      >
                        Explore Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Right */}
        {items.length > 1 && (
          <button 
            onClick={nextSlide}
            className="absolute right-2 md:right-6 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-stone-200 shadow-lg flex items-center justify-center text-surface-on hover:text-primary transition-all duration-300 hover:scale-105"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}
      </div>
    </section>
  );
}
