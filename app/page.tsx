import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import OtherCategoriesSection from "@/components/OtherCategoriesSection";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-24 pb-24 md:pb-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <HeroSlideshow />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 animate-slide-up">
          <div className="space-y-4">
            <span className="inline-block px-6 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-primary/10 text-[10px] font-bold uppercase tracking-[0.4em] text-primary shadow-sm">
              Bloomina — Est. 2026
            </span>
            <h1 className="text-5xl md:text-[80px] font-display font-light tracking-tight text-surface-on leading-[0.95]">
              Floral <span className="italic font-normal text-primary">Minimalism.</span>
            </h1>
          </div>
          <p className="max-w-xl mx-auto text-base md:text-lg text-surface-on-variant font-light leading-relaxed">
            Every piece is thoughtfully designed to embrace your natural beauty.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/products" className="px-10 py-5 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:brightness-110 transition-all hover:scale-105 shadow-2xl shadow-primary/30">
              Shop The Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Category Section - Now Second */}
      <CategorySection />

      {/* Featured Products - Now Third */}
      <section className="max-w-screen-xl mx-auto px-6 space-y-16 pb-24">
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

      {/* Other Categories Section - New */}
      <OtherCategoriesSection />
    </div>
  );
}
