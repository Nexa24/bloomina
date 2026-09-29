'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { Star } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

// Helper to parse review comment prefixes
function parseReviewComment(comment: string) {
  if (!comment) return { cleanComment: '' };
  const newMatch = comment.match(/^\[Fabric:\s*(\d)\/5,\s*Comfort:\s*(\d)\/5,\s*Service\s*&\s*Packaging:\s*(\d)\/5\]\s*([\s\S]*)$/);
  if (newMatch) {
    return { cleanComment: newMatch[4].trim() };
  }
  const oldMatch = comment.match(/^\[Fabric:\s*(\d)\/5,\s*Comfort:\s*(\d)\/5,\s*Service:\s*(\d)\/5,\s*Package:\s*(\d)\/5\]\s*([\s\S]*)$/);
  if (oldMatch) {
    return { cleanComment: oldMatch[5].trim() };
  }
  return { cleanComment: comment };
}

const fallbackTestimonials = [
  { id: 1, customer_name: "Sneha R.", rating: 5, comment: "Absolutely love the wireless bras! So comfortable and soft, fits like a second skin.", product: { name: "Cloud Comfort Wireless Bra", image: null } },
  { id: 2, customer_name: "Priyanka M.", rating: 5, comment: "The seamless panties are completely invisible under my leggings. Excellent fabric quality!", product: { name: "Silk Touch Seamless Brief", image: null } },
  { id: 3, customer_name: "Anjali K.", rating: 5, comment: "Super fast delivery and premium packaging. Bloomina experiences are always the best!", product: { name: "Everyday Contour Bralette", image: null } },
  { id: 4, customer_name: "Divya T.", rating: 5, comment: "The lace bralette is gorgeous and supportive. Customer support was also very helpful.", product: { name: "Lace Romance Push-Up", image: null } }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            customer_name,
            rating,
            comment,
            status,
            show_on_home,
            product_id,
            products (
              id,
              name,
              images
            )
          `)
          .eq('status', 'approved')
          .eq('show_on_home', true);

        if (error) throw error;

        if (data && data.length > 0) {
          const parsed = data.map((t: any) => ({
            id: t.id,
            customer_name: t.customer_name,
            rating: t.rating,
            comment: parseReviewComment(t.comment).cleanComment,
            product: t.products ? {
              id: t.products.id,
              name: t.products.name,
              image: Array.isArray(t.products.images) ? t.products.images[0] : null
            } : null
          }));
          setTestimonials(parsed);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const prev = () => {
    setCurrentIndex(curr => (curr <= 0 ? maxIndex : curr - 1));
  };

  const next = () => {
    setCurrentIndex(curr => (curr >= maxIndex ? 0 : curr + 1));
  };

  if (isLoading || testimonials.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-stone-50/60 dark:bg-stone-900/10 border-t border-b border-stone-100 overflow-hidden relative">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Real Experiences
            </span>
            <h2 className="text-2xl md:text-4xl font-display font-light text-surface-on tracking-tight mt-1">
              Voices of <span className="italic text-primary">Comfort</span>
            </h2>
          </div>

          {/* Manual Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center text-surface-on hover:bg-primary hover:text-white transition-all shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center text-surface-on hover:bg-primary hover:text-white transition-all shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Manual Movable Cards Carousel Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {testimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 bg-white dark:bg-[#15171e] p-7 md:p-8 rounded-[2rem] border border-stone-100 dark:border-stone-800 shadow-[0_20px_40px_-20px_rgba(241,145,161,0.12)] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-200 dark:text-stone-700'
                          }`}
                        />
                      ))}
                    </div>

                    {item.product && (
                      item.product.id ? (
                        <Link
                          href={`/product/${item.product.id}`}
                          className="inline-flex items-center gap-1.5 max-w-[55%] px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors group/prod"
                          title={item.product.name}
                        >
                          {item.product.image && (
                            <img
                              src={item.product.image}
                              alt=""
                              className="w-4 h-4 rounded-full object-cover shrink-0"
                            />
                          )}
                          <span className="text-[10px] font-medium truncate group-hover/prod:text-primary transition-colors">
                            {item.product.name}
                          </span>
                        </Link>
                      ) : (
                        <div
                          className="inline-flex items-center gap-1.5 max-w-[55%] px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                          title={item.product.name}
                        >
                          <span className="text-[10px] font-medium truncate">
                            {item.product.name}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base font-light italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <h4 className="font-bold text-xs md:text-sm text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                    {item.customer_name}
                  </h4>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
