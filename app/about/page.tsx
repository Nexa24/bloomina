import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFBFB] antialiased text-stone-800">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-16">
        <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-5 sm:px-6">

          {/* SECTION 1: ABOUT BLOOMINA */}
          <section className="pt-4 md:pt-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Text Left (or full on mobile) */}
              <div className="md:col-span-7 space-y-3.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#A34355] block">
                  ABOUT BLOOMINA
                </span>
                
                <h1 className="text-3xl md:text-5xl font-display font-medium text-stone-900 leading-[1.15] tracking-tight">
                  More Than Innerwear. <br />
                  <span className="italic text-[#A34355] font-normal">Thoughtfully Designed for Every Day.</span>
                </h1>

                <p className="text-[13px] md:text-sm text-stone-600 font-light leading-relaxed pt-1">
                  At Bloomina, we create everyday innerwear that brings together comfort, thoughtful design, and practical details. We believe what you wear closest to your skin should help you feel comfortable, confident, and completely yourself — in every moment of your day.
                </p>
              </div>

              {/* Image Right: Model wearing bra */}
              <div className="md:col-span-5">
                <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-sm border border-stone-100">
                  <Image
                    src="/aboutus_mn.png"
                    alt="About Bloomina Model"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: MATERIAL / FABRIC IMAGE BANNER */}
          <section className="py-2">
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-stone-100">
              <Image
                src="/meterial.png"
                alt="Finishing Materials and Trims"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          </section>

          {/* SECTION 3: OUR APPROACH */}
          <section className="pt-8 pb-10 space-y-4">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#A34355] block">
                OUR APPROACH
              </span>

              <h2 className="text-2xl md:text-4xl font-display font-medium text-stone-900 leading-[1.15] tracking-tight">
                Carefully Chosen, <br />
                <span className="italic text-[#A34355] font-normal">Thoughtfully Made.</span>
              </h2>

              <p className="text-[13px] md:text-sm text-stone-600 font-light leading-relaxed">
                From fabrics and raw materials to the smallest finishing details, we carefully select every component that goes into our innerwear. Our experienced production team handles stitching and assembly with care and precision, while trained quality-control staff carefully inspect each piece for fit, construction, and finish.
              </p>

              <p className="text-[13px] md:text-sm text-stone-600 font-light leading-relaxed">
                Every detail is considered to bring you innerwear designed for everyday comfort and style.
              </p>
            </div>

            {/* 5 Approach Feature List Items */}
            <div className="space-y-4 pt-3">

              {/* 1. Carefully Selected Fabrics */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0F2] border border-[#FAD8DC] flex items-center justify-center shrink-0 text-[#A34355] shadow-xs">
                  {/* Layered fabrics icon */}
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.7]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-stone-900">
                    Carefully Selected Fabrics
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-stone-600 font-light leading-snug mt-0.5">
                    Soft, breathable and durable fabrics chosen with attention to comfort and everyday use.
                  </p>
                </div>
              </div>

              {/* 2. Quality Raw Materials */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0F2] border border-[#FAD8DC] flex items-center justify-center shrink-0 text-[#A34355] shadow-xs">
                  {/* Raw materials / components icon */}
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.7]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-stone-900">
                    Quality Raw Materials
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-stone-600 font-light leading-snug mt-0.5">
                    Elastics, straps, hooks, eyes, sliders and trims selected for their intended function and fit.
                  </p>
                </div>
              </div>

              {/* 3. Skilled Stitching */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0F2] border border-[#FAD8DC] flex items-center justify-center shrink-0 text-[#A34355] shadow-xs">
                  {/* Scissors / Craft / Stitching icon */}
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.7]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <line x1="20" y1="4" x2="8.12" y2="15.88" />
                    <line x1="14.47" y1="14.48" x2="20" y2="20" />
                    <line x1="8.12" y1="8.12" x2="12" y2="12" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-stone-900">
                    Skilled Stitching
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-stone-600 font-light leading-snug mt-0.5">
                    Experienced staff handle stitching and assembly with care and attention to detail.
                  </p>
                </div>
              </div>

              {/* 4. Strict Quality Checks */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0F2] border border-[#FAD8DC] flex items-center justify-center shrink-0 text-[#A34355] shadow-xs">
                  {/* Shield check icon */}
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.7]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-stone-900">
                    Strict Quality Checks
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-stone-600 font-light leading-snug mt-0.5">
                    Each piece is inspected for construction, fit and finish before it reaches you.
                  </p>
                </div>
              </div>

              {/* 5. Designed for Everyday Wear */}
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF0F2] border border-[#FAD8DC] flex items-center justify-center shrink-0 text-[#A34355] shadow-xs">
                  {/* Heart icon */}
                  <svg className="w-5 h-5 stroke-current fill-none stroke-[1.7]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-stone-900">
                    Designed for Everyday Wear
                  </h3>
                  <p className="text-[12px] md:text-[13px] text-stone-600 font-light leading-snug mt-0.5">
                    Practical styles that bring together thoughtful design and effortless style.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 4: CLOSING BRAND SIGNATURE CARD */}
          <section className="pt-2 pb-6">
            <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF5F6] via-[#FFF1F3] to-[#FCE7EB] border border-[#F8D2D8] p-6 sm:p-8 flex items-center justify-between">
              <div className="space-y-1.5 z-10">
                <Image
                  src="/logo/BLO_TRNSP_PINK_LRG.png"
                  alt="Bloomina"
                  width={140}
                  height={38}
                  className="h-8 w-auto object-contain"
                />
                <div className="w-10 h-0.5 bg-[#A34355]/40 my-2" />
                <p className="text-lg sm:text-xl font-display italic text-[#A34355] font-normal tracking-wide">
                  Feel Every Moment.
                </p>
              </div>

              {/* Decorative side bra image snippet matching reference */}
              <div className="relative w-36 sm:w-52 h-24 sm:h-32 -mr-3 sm:-mr-4 -my-4 overflow-hidden rounded-l-2xl">
                <Image
                  src="/meterial.png"
                  alt="Bloomina Intimates"
                  fill
                  className="object-cover object-right opacity-90"
                />
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
