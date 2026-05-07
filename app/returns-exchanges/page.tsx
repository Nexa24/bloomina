"use client";

import React from 'react';

const ReturnsExchangesPage = () => {
  const sections = [
    {
      title: "Our Philosophy",
      content: "At Bloomina, we want you to feel the weightless comfort of our pieces. If a selection doesn't resonate with your sanctuary, we offer a 7-day return and exchange window from the date of delivery."
    },
    {
      title: "Eligibility for Returns",
      content: "To maintain the sanctity of our intimate apparel, returns are accepted for items that are unworn, unwashed, and in their original editorial packaging with all tags intact. Due to hygiene standards, certain categories may be ineligible for return if the hygiene seal is broken."
    },
    {
      title: "The Return Process",
      content: "Initiating a return is simple. Visit your Account dashboard or email support@bloomina.in with your order number. Once approved, we will arrange a reverse pickup from your address within 48 hours."
    },
    {
      title: "Exchanges",
      content: "Found the perfect style but need a different size? We offer one-time free exchanges for size-related adjustments. Our size guide is always available to help you find your perfect fit before purchase."
    },
    {
      title: "Refunds & Credits",
      content: "Once we receive and inspect your return, we will process your refund within 5-7 business days. You can choose between a direct refund to your original payment method or Bloomina Sanctuary Credits for future selections."
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Returns & Exchanges</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Ensuring Your Perfect Fit</p>
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

        <div className="mt-24 p-10 bg-white rounded-[2.5rem] border border-stone-100 text-center">
          <p className="text-sm text-surface-on-variant leading-relaxed mb-6 italic">
            "Beauty is finding what makes you feel most at home in your own skin."
          </p>
          <div className="h-px w-12 bg-primary/20 mx-auto mb-6" />
          <p className="text-xs text-stone-400">Need assistance? Contact support@bloomina.in</p>
        </div>
      </main>
    </div>
  );
};

export default ReturnsExchangesPage;
