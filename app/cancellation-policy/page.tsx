"use client";

import React from 'react';

const CancellationPolicyPage = () => {
  const sections = [
    {
      title: "Immediate Cancellations",
      content: "We understand that intentions can change. You can cancel your order for a full refund within 4 hours of placement, as long as it hasn't entered our editorial fulfillment process."
    },
    {
      title: "How to Cancel",
      content: "To initiate a cancellation, visit your Account dashboard or email us immediately at support@bloomina.in with the subject 'Cancellation: [Your Order Number]'."
    },
    {
      title: "After Fulfillment",
      content: "Once an order has been meticulously packed and dispatched, it can no longer be cancelled. In such cases, you may follow our Returns & Exchanges policy once the package arrives."
    },
    {
      title: "Refunds for Cancellations",
      content: "Approved cancellations are refunded immediately to your original payment method. Please note that banks may take 5-7 business days to reflect the amount in your account."
    },
    {
      title: "Bloomina's Right to Cancel",
      content: "In rare instances such as unforeseen inventory shifts or quality check failures, we may need to cancel an order. We will notify you instantly and issue a full refund."
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Cancellation Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Clarity in Every Choice</p>
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
            "Your peace of mind is the ultimate luxury."
          </p>
          <div className="h-px w-12 bg-primary/20 mx-auto mb-6" />
          <p className="text-xs text-stone-400">Questions about your order? support@bloomina.in</p>
        </div>
      </main>
    </div>
  );
};

export default CancellationPolicyPage;
