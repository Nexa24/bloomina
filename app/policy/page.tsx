"use client";

import React from 'react';

const PolicyPage = () => {
  const sections = [
    {
      title: "Data Stewardship",
      content: "At Bloomina, we treat your data as a sacred trust. We only collect the information necessary to provide you with our ethereal comfort pieces and a personalized experience. This includes your name, email, and shipping destination."
    },
    {
      title: "How We Use Information",
      content: "Your data is used to process orders, communicate updates about your sanctuary selections, and, with your permission, share new editorial collections from our collective. We never sell your personal essence to third parties."
    },
    {
      title: "Secure Sanctuary",
      content: "We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is encrypted and transmitted via Secure Socket Layer (SSL) technology and then encrypted into our payment provider's database."
    },
    {
      title: "Cookies & Essence",
      content: "We use cookies to help us remember and process the items in your shopping cart and understand your preferences for future visits. These are small files that a site or its service provider transfers to your computer's hard drive."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal data from our collective at any time. Simply reach out to our sanctuary support, and we will fulfill your request with the utmost care."
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Privacy Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Protecting Your Digital Sanctuary</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mt-2">Last Updated: May 2026</p>
        </div>

        <div className="space-y-16">
          {sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-display font-light text-surface-on mb-6 flex items-center gap-4">
                <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-[10px] font-bold tracking-tighter">
                  {idx + 1}
                </span>
                {section.title}
              </h2>
              <p className="text-surface-on-variant leading-relaxed text-sm md:text-base font-light pl-12">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-24 p-10 bg-white rounded-[2.5rem] border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-semibold text-surface-on mb-1">Data Protection Officer</h4>
            <p className="text-xs text-surface-on-variant">privacy@bloomina.in</p>
          </div>
          <a href="/contact" className="px-8 py-4 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            Inquire About Data
          </a>
        </div>
      </main>
    </div>
  );
};

export default PolicyPage;
