import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const MaterialsPage = () => {
  const materials = [
    {
      title: "Mulberry Silk",
      subtitle: "Grade 6A Excellence",
      description: "Our silk is sourced from the finest mulberry leaves, resulting in long-fiber threads that create a fabric of unparalleled smoothness and natural sheen.",
      image: "/d31c416a1c344d8d7a9bdadbada23d87.jpg",
      benefits: ["Naturally Hypoallergenic", "Temperature Regulating", "Protein-Rich Surface"]
    },
    {
      title: "European Lace",
      subtitle: "Responsibly Crafted",
      description: "Intricate patterns woven on heritage looms in France and Italy. Our lace is designed to be soft against the skin, eliminating the irritation common in mass-market alternatives.",
      image: "https://images.unsplash.com/photo-1584273143981-43c26a09f8d7?q=80&w=2069&auto=format&fit=crop",
      benefits: ["Breathable Patterns", "Dimensional Texture", "Durable Elegance"]
    },
    {
      title: "Bio-Based Micro-Modal",
      subtitle: "The Second Skin",
      description: "Extracted from beechwood pulp, our micro-modal is twice as soft as cotton and significantly more absorbent, keeping you cool and dry throughout the day.",
      image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=1912&auto=format&fit=crop",
      benefits: ["Carbon Neutral Process", "Shrink Resistant", "Silk-Like Drape"]
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="max-w-screen-xl mx-auto px-6 mb-24 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">The Bloomina Archive</p>
          <h1 className="text-5xl md:text-6xl font-display font-light text-surface-on mb-8">Craftsmanship in Every Fiber</h1>
          <p className="text-lg text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
            We believe that the foundation of luxury lies in the integrity of materials. Explore the elements that make Bloomina a sensory experience.
          </p>
        </section>

        {/* Materials List */}
        <section className="max-w-screen-xl mx-auto px-6 space-y-40">
          {materials.map((mat, index) => (
            <div key={mat.title} className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`lg:col-span-6 space-y-8 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{mat.subtitle}</p>
                  <h2 className="text-4xl font-display font-light text-surface-on">{mat.title}</h2>
                </div>
                <p className="text-stone-500 font-light leading-relaxed">
                  {mat.description}
                </p>
                <ul className="space-y-4">
                  {mat.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-surface-on/60">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`lg:col-span-6 relative aspect-[4/3] rounded-[3rem] overflow-hidden petal-shadow group ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Image 
                  src={mat.image} 
                  alt={mat.title} 
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </section>

        {/* Sustainability Callout */}
        <section className="mt-40 bg-stone-900 text-white py-32 rounded-[4rem] mx-6">
          <div className="max-w-screen-xl mx-auto px-6 text-center space-y-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60">Our Commitment</p>
            <h2 className="text-4xl md:text-5xl font-display font-light leading-tight">
              Ethical Sourcing, <br />
              Zero Compromise.
            </h2>
            <p className="text-stone-400 font-light max-w-xl mx-auto leading-relaxed">
              Every supplier in the Bloomina ecosystem is audited for fair labor practices and environmental impact. We believe transparency is the ultimate luxury.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MaterialsPage;
