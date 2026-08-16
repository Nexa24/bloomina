'use client';

import React, { useEffect, useState } from 'react';
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
  { id: 1, customer_name: "Sneha R.", rating: 5, comment: "Absolutely love the wireless bras! So comfortable and soft, fits like a second skin." },
  { id: 2, customer_name: "Priyanka M.", rating: 5, comment: "The seamless panties are completely invisible under my leggings. Excellent fabric quality!" },
  { id: 3, customer_name: "Anjali K.", rating: 5, comment: "Super fast delivery and premium packaging. Bloomina experiences are always the best!" },
  { id: 4, customer_name: "Divya T.", rating: 5, comment: "The lace bralette is gorgeous and supportive. Customer support was also very helpful." }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, customer_name, rating, comment, status, show_on_home')
          .eq('status', 'approved')
          .eq('show_on_home', true);

        if (error) throw error;

        if (data && data.length > 0) {
          const parsed = data.map((t: any) => ({
            id: t.id,
            customer_name: t.customer_name,
            rating: t.rating,
            comment: parseReviewComment(t.comment).cleanComment
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

  if (isLoading || testimonials.length === 0) return null;

  // Duplicate items to ensure seamless wrapping inside the marquee trails
  const marqueeItemsRow1 = [...testimonials, ...testimonials, ...testimonials];
  const marqueeItemsRow2 = [...testimonials].reverse().concat([...testimonials].reverse(), [...testimonials].reverse());

  return (
    <section className="py-4 md:py-6 bg-stone-50/50 dark:bg-stone-900/10 border-t border-b border-stone-100 overflow-hidden relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-trail {
          display: flex;
          width: max-content;
          animation: marquee 45s linear infinite;
        }
        .animate-marquee-trail-reverse {
          display: flex;
          width: max-content;
          animation: marquee-reverse 45s linear infinite;
        }
      `}</style>

      <div className="max-w-screen-xl mx-auto px-6 mb-4">
        <ScrollReveal variant="slide-up" duration={800}>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-display font-light uppercase tracking-[0.25em] text-primary">Voices of Comfort</h2>
          </div>
        </ScrollReveal>
      </div>

      {/* Row 1: Leftward Scrolling */}
      <div className="relative w-full flex items-center select-none py-3">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-48 bg-gradient-to-r from-stone-50/50 dark:from-[#0f0f12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-48 bg-gradient-to-l from-stone-50/50 dark:from-[#0f0f12] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-trail gap-6 px-6">
          {marqueeItemsRow1.map((item, idx) => (
            <div 
              key={`row1-${item.id}-${idx}`}
              className="w-[280px] md:w-[360px] bg-white dark:bg-[#15171e] p-6 md:p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col justify-between shrink-0"
            >
              <div className="space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-500' : 'text-stone-200 dark:text-stone-700'}`} 
                    />
                  ))}
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base font-light italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100/80 dark:border-stone-800/80 flex items-center justify-between">
                <h4 className="font-bold text-xs md:text-sm text-stone-800 dark:text-stone-200 uppercase tracking-widest">
                  {item.customer_name}
                </h4>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#944555] bg-[#944555]/5 px-2.5 py-1 rounded-full">
                  Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Rightward Scrolling (Reverse Direction) */}
      <div className="relative w-full flex items-center select-none py-3 mt-4">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-48 bg-gradient-to-r from-stone-50/50 dark:from-[#0f0f12] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-48 bg-gradient-to-l from-stone-50/50 dark:from-[#0f0f12] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-trail-reverse gap-6 px-6">
          {marqueeItemsRow2.map((item, idx) => (
            <div 
              key={`row2-${item.id}-${idx}`}
              className="w-[280px] md:w-[360px] bg-white dark:bg-[#15171e] p-6 md:p-8 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col justify-between shrink-0"
            >
              <div className="space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-500' : 'text-stone-200 dark:text-stone-700'}`} 
                    />
                  ))}
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-sm md:text-base font-light italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100/80 dark:border-stone-800/80 flex items-center justify-between">
                <h4 className="font-bold text-xs md:text-sm text-stone-800 dark:text-stone-200 uppercase tracking-widest">
                  {item.customer_name}
                </h4>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#944555] bg-[#944555]/5 px-2.5 py-1 rounded-full">
                  Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
