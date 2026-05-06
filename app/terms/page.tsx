"use client";

import React from 'react';

const TermsPage = () => {
  const sections = [
    {
      title: "Introduction",
      content: "Welcome to Bloomina. These terms and conditions outline the rules and regulations for the use of our collective's website and services. By accessing this sanctuary, we assume you accept these terms and conditions in full."
    },
    {
      title: "Intellectual Property",
      content: "Unless otherwise stated, Bloomina and/or its licensors own the intellectual property rights for all material on Bloomina. All intellectual property rights are reserved. You may view and/or print pages for your own personal use subject to restrictions set in these terms."
    },
    {
      title: "Order Acceptance",
      content: "The receipt of an order number or an email order confirmation does not constitute the acceptance of an order or a confirmation of an offer to sell. Bloomina reserves the right, without prior notification, to limit the order quantity on any item and/or to refuse service to any customer."
    },
    {
      title: "Ethereal Experience",
      content: "We strive to provide a seamless and premium experience. However, we do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations exactly, as digital representations may vary."
    },
    {
      title: "Pricing & Currency",
      content: "All prices are listed in Indian Rupees (INR). We reserve the right to change our prices at any time without notice. We also reserve the right to correct any pricing errors that may inadvertently occur."
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Terms & Conditions</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">The Bloomina Collective Agreement</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mt-2">Last Updated: May 2026</p>
        </div>

        <div className="space-y-16">
          {sections.map((section, idx) => (
            <section key={idx} className="relative">
              <div className="absolute -left-12 top-0 text-primary/10 text-4xl font-display font-light hidden md:block">
                0{idx + 1}
              </div>
              <h2 className="text-2xl font-display font-light text-surface-on mb-6">{section.title}</h2>
              <p className="text-surface-on-variant leading-relaxed text-sm md:text-base font-light">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-24 p-10 bg-white rounded-[2.5rem] border border-stone-100 text-center">
          <p className="text-sm text-surface-on-variant leading-relaxed mb-6">
            If you have any questions regarding our terms, please reach out to our legal sanctuary.
          </p>
          <a href="/contact" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
