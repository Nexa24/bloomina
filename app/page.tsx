import Image from "next/image";
import Link from "next/link";
import CategorySection from "@/components/CategorySection";
import SignatureSection from "@/components/SignatureSection";
import OtherCategoriesSection from "@/components/OtherCategoriesSection";
import HeroSlideshow from "@/components/HeroSlideshow";
import CategoryCarousel from "@/components/CategoryCarousel";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="pb-16 md:pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <HeroSlideshow />
      </section>

      {/* Category Section - Now Second */}
      <CategorySection />

      {/* About Us Section - Elevated Editorial Redesign */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-stone-50/60 via-white to-white overflow-hidden relative border-y border-stone-100/60">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Image with Floating Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden petal-shadow group border border-stone-100">
                <Image
                  src="/our_story.png"
                  alt="The Bloomina Story"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-4 md:bottom-8 md:-right-8 bg-white/95 backdrop-blur-xl p-6 rounded-3xl border border-stone-100/80 shadow-2xl max-w-[230px] space-y-2 hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary">Atelier Fit</span>
                </div>
                <p className="text-xs font-display italic text-surface-on leading-snug">
                  "Weightless luxury tailored for daily empowerment."
                </p>
              </div>
            </div>

            {/* Right Column: Narrative & Pillars */}
            <div className="lg:col-span-7 space-y-8 lg:pl-6">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-1.5 rounded-full inline-block">
                  About Bloomina
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-light text-surface-on tracking-tight leading-[1.15]">
                  More Than Innerwear. <br />
                  <span className="italic text-primary">A Thoughtfully Crafted Everyday Essential.</span>
                </h2>
              </div>

              <p className="text-base md:text-lg text-surface-on-variant/80 font-light leading-relaxed max-w-2xl">
                At Bloomina, we believe that comfort is the foundation of confidence. Every woman deserves innerwear that feels effortless, supports her throughout the day, and complements her lifestyle without compromise.
              </p>

              {/* Three Craft Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-100">
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-2xl text-primary font-light">feather</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-surface-on">Ultra-Soft Fabrics</h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">Breathable bio-modal weaves engineered for non-stop ease.</p>
                </div>
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-2xl text-primary font-light">favorite</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-surface-on">Natural Silhouette</h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">Seamless design that gently shapes without pinching.</p>
                </div>
                <div className="space-y-2">
                  <span className="material-symbols-outlined text-2xl text-primary font-light">verified</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-surface-on">Ethical Craft</h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">Sustainably sourced and lovingly finished for high durability.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Discover Our Story
                  <span className="material-symbols-outlined text-sm">east</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Signature Collection Section - New */}
      <SignatureSection />

      {/* Category Carousel - New */}
      <CategoryCarousel />

      {/* Other Categories Section - New */}
      <OtherCategoriesSection />

      {/* Testimonials Marquee - New */}
      <Testimonials />
    </div>
  );
}
