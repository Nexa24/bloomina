import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* About Bloomina Hero Section */}
        <section className="max-w-screen-xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-1.5 rounded-full inline-block">
                  About Bloomina
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-light text-surface-on leading-[1.15] tracking-tight">
                  More Than Innerwear. <br />
                  <span className="italic text-primary">A Thoughtfully Crafted Everyday Essential.</span>
                </h1>
              </div>
              
              <div className="space-y-6 text-stone-600 font-light leading-relaxed text-base md:text-lg">
                <p>
                  At Bloomina, we believe that comfort is the foundation of confidence. Every woman deserves innerwear that feels effortless, supports her throughout the day, and complements her lifestyle without compromise.
                </p>
                <p>
                  Bloomina was created with a simple vision—to redefine everyday innerwear by combining premium materials, thoughtful design, and exceptional comfort at an accessible price.
                </p>
                <p>
                  Rather than following trends, we focus on creating timeless essentials that women can rely on every day. From selecting soft, high-quality fabrics to refining every detail of fit, support, and finish, every Bloomina product is carefully developed with comfort and functionality at its core.
                </p>
                <p>
                  Our collections are designed by Bloomina and brought to life through experienced production unit which ensure commitment to quality and craftsmanship. Every material, trim, colour, and specification is carefully chosen by our team, ensuring that every product reflects the standards we stand for.
                </p>
                <p>
                  Each piece undergoes careful quality evaluation before reaching our customers because we believe that true luxury lies in consistency, comfort, and attention to detail.
                </p>
                <p className="font-medium text-surface-on">
                  Whether you’re heading to work, relaxing at home, travelling, or celebrating life’s special moments, Bloomina is designed to move with you by offering the confidence and comfort you deserve throughout the day.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden petal-shadow group border border-stone-100">
                <Image 
                  src="/our_story.png" 
                  alt="About Bloomina" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              
              <div className="mt-8 p-6 bg-stone-50 rounded-3xl border border-stone-100/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">The Bloomina Promise</span>
                </div>
                <p className="text-xs font-display italic text-surface-on leading-relaxed">
                  "Because we believe confidence begins with comfort."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy Section */}
        <section id="philosophy" className="bg-gradient-to-b from-stone-50/80 via-white to-stone-50/80 py-24 mb-24 border-y border-stone-100/80">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-light text-surface-on leading-snug">
                "We believe innerwear should never be an afterthought."
              </h2>
              <div className="space-y-6 text-stone-600 font-light text-base md:text-lg leading-relaxed">
                <p>
                  It is the first layer you wear and the one that stays with you throughout the day. That’s why every Bloomina product is developed with a balance of thoughtful design, premium materials, and reliable performance—creating pieces that feel as good as they look.
                </p>
                <p className="font-medium text-surface-on text-lg">
                  We don’t believe that premium should mean complicated. We believe it should mean better fabrics, better fit, better craftsmanship, and a better everyday experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise Section */}
        <section className="max-w-screen-xl mx-auto px-6 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Our Commitment
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-surface-on">
              Our Promise
            </h2>
            <p className="text-sm text-stone-500 font-light">
              Every Bloomina product is created with the same steadfast commitment:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: 'feather', title: 'Premium Fabrics', desc: 'Carefully selected premium fabrics for softness and breathability.' },
              { icon: 'auto_awesome', title: 'Thoughtful Design', desc: 'Thoughtfully developed designs for optimal comfort and support.' },
              { icon: 'handshake', title: 'Trusted Production', desc: 'Reliable quality through experienced production partners.' },
              { icon: 'straighten', title: 'Fit to Finish', desc: 'Attention to every detail, from precision fit to finish.' },
              { icon: 'verified', title: 'Timeless Style', desc: 'Timeless styles made for everyday confidence.' },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white p-8 rounded-3xl border border-stone-100 petal-shadow space-y-4 text-center hover:border-primary/20 transition-all duration-300">
                <span className="material-symbols-outlined text-3xl text-primary font-light">{pillar.icon}</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-surface-on">{pillar.title}</h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Designed for Modern Women Section */}
        <section className="max-w-screen-xl mx-auto px-6">
          <div className="bg-surface-on text-white rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden text-center space-y-8 shadow-2xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Made for Your Routine
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light leading-tight max-w-3xl mx-auto">
              Designed for Modern Women
            </h2>
            <p className="text-stone-300 font-light text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Today’s women need innerwear that adapts to every part of their day. Whether you’re working, studying, travelling, exercising, or simply enjoying time at home, Bloomina is designed to provide comfort, confidence, and effortless elegance from morning to night.
            </p>
            <div className="pt-4">
              <p className="text-base md:text-lg font-display italic text-primary">
                Because we believe confidence begins with comfort.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
