import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-32 pb-24 md:pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/29b1b71c71dc10ed5838d1934fea3dc8.jpg"
            alt="Bloomina Hero Background"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-white/10" />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-primary/5 blur-[140px] -z-10 rounded-full animate-pulse" />
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 border border-primary/20 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
            Signature Series 2026
          </span>
          <h1 className="text-6xl md:text-8xl font-display font-light tracking-tight text-surface-on leading-[1.05]">
            Bloom in <br />
            <span className="italic font-normal text-primary">purest silk.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-surface-on-variant font-light leading-relaxed">
            Experience weightless support and effortless elegance. <br />
            Designed to make you <span className="text-surface-on font-semibold">Feel Every Moment.</span>
          </p>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-10 py-5 bg-primary text-white rounded-full font-semibold tracking-wide hover:brightness-110 transition-all hover:scale-105 shadow-lg shadow-primary/20 uppercase text-xs">
              Explore Collection
            </button>
            <button className="px-10 py-5 bg-white text-surface-on border border-outline-variant/30 rounded-full font-semibold tracking-wide hover:bg-surface-container-low transition-all uppercase text-xs">
              Our Bestsellers
            </button>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <CategorySection />

      {/* Trust Badges */}
      <section className="max-w-screen-xl mx-auto px-6">
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-wrap justify-between items-center gap-8 border border-white">
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[120px]">
                <span className="material-symbols-outlined text-surface-on-variant scale-125">verified_user</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-surface-on-variant">Premium Quality</p>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[120px]">
                <span className="material-symbols-outlined text-surface-on-variant scale-125">spa</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-surface-on-variant">Ethical Silk</p>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 min-w-[120px]">
                <span className="material-symbols-outlined text-surface-on-variant scale-125">local_shipping</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-surface-on-variant">Free Shipping</p>
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-screen-xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60">Featured Selection</h2>
          <h3 className="text-4xl font-display font-medium text-surface-on">The Art of Comfort</h3>
        </div>
        
        <ProductGrid />
        
        <div className="pt-10 text-center">
          <button className="text-xs font-bold uppercase tracking-[0.2em] text-primary border-b-2 border-primary/20 pb-2 hover:border-primary transition-all">
            View All Products
          </button>
        </div>
      </section>

      {/* Philosophy Section (Asymmetric Bento Grid) */}
      <section className="max-w-screen-xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-primary/60">Our Philosophy</h2>
          <h3 className="text-4xl font-display font-medium text-surface-on">The Material Science</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-surface-container-high">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent p-8 flex flex-col justify-end z-10">
              <h4 className="text-white font-display text-2xl mb-2">Ethical Mulberry Silk</h4>
              <p className="text-white/80 max-w-md">Our silk is sourced from sustainable farms, ensuring a carbon-neutral footprint while providing unmatched softness.</p>
            </div>
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors duration-700" />
          </div>
          
          <div className="bg-surface-container-high p-8 flex flex-col justify-center rounded-2xl group hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-primary scale-150 mb-6">spa</span>
            <h4 className="font-display text-2xl mb-4 text-surface-on">Floral Intricacy</h4>
            <p className="text-surface-on-variant">Each lace pattern is custom-illustrated to mimic the organic geometry of spring petals.</p>
          </div>
          
          <div className="bg-primary/10 p-8 flex flex-col justify-center rounded-2xl group hover:bg-primary/20 transition-colors">
            <h4 className="text-primary font-display text-2xl mb-4">4-Way Stretch</h4>
            <p className="text-primary/80">Premium elastane fibers blended for a lift that never feels restrictive, ensuring all-day comfort.</p>
          </div>
          
          <div className="md:col-span-2 relative group overflow-hidden rounded-2xl bg-surface-container-high">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent p-8 flex flex-col justify-end z-10">
              <h4 className="text-white font-display text-2xl">Precision Fit</h4>
            </div>
            <div className="absolute inset-0 bg-surface-variant/50 group-hover:bg-surface-variant/80 transition-colors duration-700" />
          </div>
        </div>
      </section>
    </div>
  );
}
