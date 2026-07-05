import CategorySection from "@/components/CategorySection";
import SignatureSection from "@/components/SignatureSection";
import OtherCategoriesSection from "@/components/OtherCategoriesSection";
import HeroSlideshow from "@/components/HeroSlideshow";
import CategoryCarousel from "@/components/CategoryCarousel";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-24 pb-24 md:pb-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <HeroSlideshow />
      </section>

      {/* Category Section - Now Second */}
      <CategorySection />

      {/* Signature Collection Section - New */}
      <SignatureSection />

      {/* Category Carousel - New */}
      <CategoryCarousel />

      {/* Other Categories Section - New */}
      <OtherCategoriesSection />

      {/* Testimonials Marquee - New */}
      <Testimonials />

      {/* About Us Section */}
      <section className="max-w-screen-xl mx-auto px-6 py-12 md:py-20 border-t border-stone-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="space-y-6 md:space-y-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-light text-surface-on tracking-tight leading-tight">
              About <span className="italic text-primary">Bloomina</span>
            </h2>
            <p className="text-base text-surface-on-variant font-light leading-relaxed max-w-xl">
              At Bloomina, we believe innerwear is the most intimate form of self-expression. Meticulously crafted from the finest, ultra-soft fabrics, our collections blend ethereal comfort with modern, minimal aesthetics. 
            </p>
            <p className="text-base text-surface-on-variant font-light leading-relaxed max-w-xl">
              Designed to elevate your everyday rituals, every piece celebrates your natural silhouette with lightweight support and seamless elegance. We invite you to experience comfort that feels like a second skin.
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-stone-50 rounded-[2.5rem] overflow-hidden p-10 flex flex-col justify-between border border-stone-100 petal-shadow">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-4xl text-primary font-light">favorite</span>
              <p className="text-xl md:text-2xl font-display font-light italic text-surface-on leading-relaxed">
                "Real comfort starts from within. We design for the modern woman who values both exquisite quality and effortless elegance."
              </p>
            </div>
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-surface-on text-xs uppercase tracking-widest">The Bloomina Touch</h4>
                <p className="text-[9px] font-bold uppercase tracking-widest text-primary/60 mt-1">Ethereal Comfort</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
