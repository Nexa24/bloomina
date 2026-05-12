'use client';

import React from 'react';
import ProductReviews from '@/components/ProductReviews';
import Image from 'next/image';

export default function BrandFeedbackPage() {
  return (
    <div className="bg-white min-h-screen pt-28 md:pt-40">
      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-6 mb-24">
        <div className="relative h-[40vh] md:h-[60vh] rounded-[40px] md:rounded-[80px] overflow-hidden group petal-shadow">
          <Image 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
            alt="Bloomina Experience" 
            fill 
            className="object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/60 flex flex-col items-center justify-center text-center p-8">
            <span className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-[0.4em] text-white mb-6">
              Our Legacy
            </span>
            <h1 className="text-4xl md:text-7xl font-display font-light text-white tracking-tight leading-tight max-w-3xl">
              Your Story is <span className="italic">Our Masterpiece.</span>
            </h1>
            <p className="mt-6 max-w-lg text-white/80 font-light text-base md:text-lg">
              We believe in the power of continuous refinement. Your feedback helps us perfect the art of Bloomina.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Feedback Component - No productId means general brand feedback */}
      <ProductReviews title="Brand Testimonials" />

      {/* Values Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-24 border-t border-stone-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                { label: "Listen", title: "Human Centric", desc: "Every word you share is reviewed by our design team to improve our next collection." },
                { label: "Refine", title: "Ever-Evolving", desc: "We don't believe in perfection, only in the beautiful pursuit of it through your eyes." },
                { label: "Respect", title: "Absolute Privacy", desc: "Your personal details are never shared. We only celebrate your honest experiences." }
            ].map((v, i) => (
                <div key={i} className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40 italic">{v.label}</span>
                    <h4 className="text-2xl font-display text-surface-on">{v.title}</h4>
                    <p className="text-surface-on-variant font-light leading-relaxed">{v.desc}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}
