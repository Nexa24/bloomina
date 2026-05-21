import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const CraftsmanshipPage = () => {
  const materials = [
    {
      title: "Lenzing Modal",
      subtitle: "Buttery Soft Comfort",
      description: "Sourced from sustainable beechwood pulp, our modal is twice as soft as cotton and drapes beautifully to adapt to your body's every move, offering an organic second-skin feel.",
      image: "/micro_modal.png",
      benefits: ["Buttery-soft texture", "Natural stretch & recovery", "Carbon-neutral process"]
    },
    {
      title: "Premium Nylon Spandex",
      subtitle: "Sleek & Seamless Support",
      description: "Engineered with a high-performance blend of 85% Nylon and 15% Spandex. It provides a lightweight, invisible finish under clothing with exceptional multi-directional stretch.",
      image: "/our_story.png",
      benefits: ["Invisible, seamless edge", "Premium four-way stretch", "Moisture-wicking finish"]
    },
    {
      title: "Combed Cotton Elastane",
      subtitle: "Everyday Breathability",
      description: "Crafted from long-staple combed cotton blended with flexible elastane fibers. This natural-knit fabric offers maximum breathability and reliable comfort for everyday wear.",
      image: "/d31c416a1c344d8d7a9bdadbada23d87.jpg",
      benefits: ["Naturally hypoallergenic", "Highly breathable knit", "Durable everyday comfort"]
    },
    {
      title: "Powernet Mesh Support",
      subtitle: "Sculpted Comfort Wings",
      description: "Designed with an open-knit powernet mesh that provides targeted back and side support, smoothing your silhouette while ensuring maximum ventilation and airflow.",
      image: "/european_lace.png",
      benefits: ["Power-mesh structure", "Breathable, airy weave", "Smooth silhouette control"]
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="max-w-screen-xl mx-auto px-6 mb-24 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">The Bloomina Atelier</p>
          <h1 className="text-5xl md:text-6xl font-display font-light text-surface-on mb-8">Craftsmanship in Every Fiber</h1>
          <p className="text-lg text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
            We believe that the foundation of luxury lies in the integrity of materials. Explore the actual elements that make the Bloomina collection a sensory experience.
          </p>
        </section>

        {/* Materials List */}
        <section className="max-w-screen-xl mx-auto px-6 space-y-40">
          {materials.map((mat, index) => (
            <div key={mat.title} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Text Column */}
              <div className={`lg:col-span-6 space-y-8 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
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

              {/* Image Column */}
              <div className={`lg:col-span-6 relative aspect-[4/3] rounded-[3rem] overflow-hidden petal-shadow group ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
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

export default CraftsmanshipPage;
