import React from 'react';
import Image from 'next/image';

const categories = [
  {
    title: 'Signature Bras',
    slug: 'bras',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTbghw_WZVzhd9DKApPxJcoUK9cwJkf44QoDbHoRjTRnubMMge4zVDFV4aKhYlPUZNpOupfdzT_0TFOc5M6oK763b3jWnP3FX8u0mOjZs3PFlSuFUrwyW4_flxdqhvotNurlXfZlqgu9fsu5PAuM8dAy-TskCzImUd_-ghDraPg07vOihUfj8zdinMGOjJgvlkxSv-3v0qUaYWyUveFWSIXwp6uyeh7Wq5XildCnMHdWUN0Mar7Gjox8ZGa_kkMAJD0mIuDs0er5Y',
    gridSpan: 'md:col-span-2 md:row-span-2',
    description: 'Weightless support in ethereal silk.'
  },
  {
    title: 'Silk Panties',
    slug: 'panties',
    image: 'https://images.unsplash.com/photo-1598555138243-70d109f06124?q=80&w=800&auto=format&fit=crop',
    gridSpan: 'md:col-span-1 md:row-span-1',
    description: 'Everyday luxury.'
  },
  {
    title: 'Lounge Sets',
    slug: 'lounge',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
    gridSpan: 'md:col-span-1 md:row-span-2',
    description: 'Effortless elegance at home.'
  },
  {
    title: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop',
    gridSpan: 'md:col-span-1 md:row-span-1',
    description: 'The final touch.'
  },
];

const CategorySection = () => {
  return (
    <section className="max-w-screen-xl mx-auto px-6 space-y-12 md:space-y-16 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60">Shop by Story</h2>
          <h3 className="text-4xl font-display font-medium text-surface-on">Curated Collections</h3>
        </div>
        <p className="max-w-md text-surface-on-variant font-light leading-relaxed">
          Each piece is a testament to our commitment to <span className="italic">Floral Minimalism</span>—where nature meets luxury.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 h-[800px] md:h-[700px]">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className={`${cat.gridSpan} group relative overflow-hidden rounded-3xl bg-surface-container-low transition-all duration-700 hover:petal-shadow`}
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-700 group-hover:translate-y-[-8px]">
              <h4 className="text-white font-display text-2xl mb-2 tracking-tight">{cat.title}</h4>
              <p className="text-white/80 text-sm font-light mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-[240px]">
                {cat.description}
              </p>
              <div className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                <span>Explore</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
