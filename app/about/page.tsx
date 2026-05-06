import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-screen-xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">The Bloomina Story</p>
                <h1 className="text-5xl md:text-7xl font-display font-light text-surface-on leading-[1.1] tracking-tight">
                  Ethereal Comfort, <br />
                  Timeless Elegance.
                </h1>
              </div>
              <p className="text-lg text-surface-on-variant/80 font-light leading-relaxed max-w-lg">
                Founded in 2026, Bloomina was born from a singular vision: to create intimate wear that feels like a second skin while radiating the confidence of fine art.
              </p>
              <div className="flex gap-12 pt-4">
                <div>
                  <p className="text-3xl font-display text-primary">2026</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2">Established</p>
                </div>
                <div>
                  <p className="text-3xl font-display text-primary">100%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-2">Ethical Craft</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden petal-shadow group">
              <Image 
                src="/our_story.png" 
                alt="About Bloomina" 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="bg-primary/5 py-32 mb-32">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto space-y-12">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Our Philosophy</p>
              <h2 className="text-4xl md:text-5xl font-display font-light text-surface-on">
                "Beauty is not just seen, it is felt. It is the quiet confidence of a morning ritual."
              </h2>
              <p className="text-stone-500 font-light leading-relaxed text-lg">
                At Bloomina, we believe that luxury should not be reserved for special occasions. It is a daily practice. Our designs are a tribute to the modern woman—multifaceted, resilient, and inherently beautiful.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-screen-xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <span className="material-symbols-outlined text-4xl text-primary font-light">auto_awesome</span>
              <h3 className="text-2xl font-display font-light">The Bloomina Aura</h3>
              <p className="text-sm text-stone-500 font-light leading-relaxed">
                Every piece is designed with an 'aura' of lightness, ensuring that our intimates never feel restrictive, only supportive.
              </p>
            </div>
            <div className="space-y-6">
              <span className="material-symbols-outlined text-4xl text-primary font-light">eco</span>
              <h3 className="text-2xl font-display font-light">Sustainable Luxury</h3>
              <p className="text-sm text-stone-500 font-light leading-relaxed">
                We prioritize bio-based materials and low-impact dyes, proving that high fashion and environmental consciousness can coexist.
              </p>
            </div>
            <div className="space-y-6">
              <span className="material-symbols-outlined text-4xl text-primary font-light">volunteer_activism</span>
              <h3 className="text-2xl font-display font-light">Craftsmanship First</h3>
              <p className="text-sm text-stone-500 font-light leading-relaxed">
                From the initial sketch to the final stitch, each garment undergoes rigorous quality checks to ensure it meets our heritage standards.
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
