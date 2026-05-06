import Image from "next/image";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";

export default function Home() {
  return (
    <div className="space-y-24 md:space-y-40 pb-24 md:pb-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/29b1b71c71dc10ed5838d1934fea3dc8.jpg"
            alt="Bloomina Hero Background"
            fill
            className="object-cover brightness-95"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/10" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-12 animate-slide-up">
          <div className="space-y-4">
            <span className="inline-block px-6 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-primary/10 text-[10px] font-bold uppercase tracking-[0.4em] text-primary shadow-sm">
              Bloomina — Est. 2026
            </span>
            <h1 className="text-6xl md:text-[100px] font-display font-light tracking-tight text-surface-on leading-[0.95]">
              Bloom in <br />
              <span className="italic font-normal text-primary">Comfort.</span>
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-surface-on-variant font-light leading-relaxed">
            Every piece is thoughtfully designed to embrace your natural beauty — <br />
            <span className="text-surface-on italic font-medium">so you don’t just wear it… you become it.</span>
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link href="/products" className="px-12 py-6 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:brightness-110 transition-all hover:scale-105 shadow-2xl shadow-primary/30">
              Shop The Collection
            </Link>
            <Link href="/about" className="px-12 py-6 bg-white/80 backdrop-blur-md text-surface-on border border-stone-200 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-stone-900/5">
              Our Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-screen-xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-primary/60 italic">Featured Selection</h2>
          <h3 className="text-4xl md:text-5xl font-display font-light text-surface-on">The Signature Collection</h3>
        </div>
        
        <ProductGrid />
        
        <div className="pt-10 text-center">
          <Link href="/products" className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b-2 border-primary/20 pb-2 hover:border-primary transition-all">
            Explore All Pieces
          </Link>
        </div>
      </section>

      {/* Category Section */}
      <CategorySection />

      {/* Brand Teasers */}
      <section className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-12 pb-24 md:pb-32">
        <div className="group relative aspect-[16/9] rounded-[40px] overflow-hidden bg-stone-100 p-12 flex flex-col justify-end shadow-xl shadow-stone-900/5">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent z-10" />
          <Image src="/our_story.png" alt="Our Story" fill className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
          <div className="relative z-20 space-y-4">
            <h4 className="text-white text-3xl font-display font-light">The Bloomina Story</h4>
            <Link href="/about" className="inline-flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-widest hover:gap-6 transition-all">
              Discover Our Philosophy <span className="material-symbols-outlined scale-75">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="group relative aspect-[16/9] rounded-[40px] overflow-hidden bg-stone-100 p-12 flex flex-col justify-end shadow-xl shadow-stone-900/5">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent z-10" />
          <Image src="/d31c416a1c344d8d7a9bdadbada23d87.jpg" alt="Craftsmanship" fill className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
          <div className="relative z-20 space-y-4">
            <h4 className="text-white text-3xl font-display font-light">Craftsmanship</h4>
            <Link href="/materials" className="inline-flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-widest hover:gap-6 transition-all">
              The Bloomina Touch <span className="material-symbols-outlined scale-75">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Final Resonance */}
      <section className="max-w-3xl mx-auto px-6 text-center py-20 space-y-8 border-t border-stone-50">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary/60 italic">Bloomina Lingerie</p>
        <p className="text-3xl font-display font-light text-surface-on italic leading-relaxed">
          "Confidence starts beneath. <br />
          And Bloomina is where it begins."
        </p>
      </section>
    </div>
  );
}
