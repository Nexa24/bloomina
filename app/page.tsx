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
    <div className="pb-6 md:pb-8 overflow-x-hidden">
      {/* Hero Section - 16:9 Aspect Ratio on Laptop */}
      <section className="relative w-full aspect-[16/9] max-h-[85vh] flex items-center justify-center overflow-hidden">
        <h1 className="sr-only">Bloomina | Ethereal Comfort & Everyday Essentials</h1>
        <HeroSlideshow />
      </section>

      {/* Category Section - Now Second */}
      <CategorySection />

      {/* About Us Section - Clean Editorial Centered Layout */}
      <section className="py-5 md:py-8 bg-gradient-to-b from-stone-50/60 via-white to-white overflow-hidden relative border-y border-stone-100/60">
        <div className="max-w-screen-md mx-auto px-6 text-center space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-1.5 rounded-full inline-block">
            About Bloomina
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-surface-on tracking-tight leading-[1.2]">
            More Than Innerwear. <br />
            <span className="italic text-primary">A Thoughtfully Crafted Everyday Essential.</span>
          </h2>
          <p className="text-base md:text-lg text-surface-on-variant/80 font-light leading-relaxed">
            At Bloomina, we believe that comfort is the foundation of confidence. Every woman deserves innerwear that feels effortless, supports her throughout the day, and complements her lifestyle without compromise.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Discover Our Story
              <span className="material-symbols-outlined text-sm" aria-hidden="true">east</span>
            </Link>
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
