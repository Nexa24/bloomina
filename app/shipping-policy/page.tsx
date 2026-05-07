"use client";

import React from 'react';

const ShippingPolicyPage = () => {
  const sections = [
    {
      title: "Order Processing",
      content: "Each Bloomina piece is handled with the utmost care. Orders are typically processed within 24-48 business hours. Once your selection is prepared, you will receive a confirmation with tracking details to follow its journey to your sanctuary."
    },
    {
      title: "Delivery Timelines",
      content: "Standard shipping across India generally takes 3-7 business days depending on your location. Metro cities often see delivery within 3 days, while remote regions may take slightly longer. We appreciate your patience as we ensure your package arrives in pristine condition."
    },
    {
      title: "Shipping Charges",
      content: "We are pleased to offer complimentary standard shipping on all orders above ₹2,999. For orders below this amount, a nominal shipping fee of ₹99 is applied at checkout to cover the logistics of our specialized packaging."
    },
    {
      title: "Tracking Your Sanctuary",
      content: "A tracking link will be shared via email and SMS once your order is dispatched. You can also monitor your order status directly through your Bloomina Account dashboard."
    },
    {
      title: "International Inquiries",
      content: "Currently, we specialize in deliveries within India. For international inquiries, please reach out to our sanctuary support at support@bloomina.in to discuss custom shipping arrangements."
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Shipping Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">The Journey to Your Doorstep</p>
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
            "Patience is the companion of wisdom, and the wait for elegance is always rewarded."
          </p>
          <div className="h-px w-12 bg-primary/20 mx-auto mb-6" />
          <p className="text-xs text-stone-400">Questions? Contact support@bloomina.in</p>
        </div>
      </main>
    </div>
  );
};

export default ShippingPolicyPage;
