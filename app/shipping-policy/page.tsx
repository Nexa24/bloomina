"use client";

import React from 'react';

const ShippingPolicyPage = () => {
  const sections = [
    {
      title: "General Shipping Information",
      content: [
        { text: "At Bloomina, we pledge to ensure your order arrives correctly, in perfect condition, and punctually. To achieve this, we exclusively collaborate with esteemed national courier partners via our logistics fulfillment networks to guarantee a premium and secure delivery experience." },
        { label: "Processing Time", text: "Orders are typically processed and prepared for dispatch within 1 to 3 business days. During peak collection launches or unforeseen logistical constraints, processing times may slightly extend." },
        { label: "Estimated Delivery Time", text: "Once dispatched from our facility, delivery typically takes 5 to 7 business days to arrive at your destination doorstep across India." }
      ]
    },
    {
      title: "Shipping Cost",
      content: [
        { text: "To provide an effortless and premium shopping experience from start to finish, standard shipping is complimentary on all orders all over Kerala, with no hidden additional costs at checkout." }
      ]
    },
    {
      title: "Order Tracking Infrastructure",
      content: [
        { text: "The moment your apparel package is dispatched and assigned to our shipping carrier, our automated system will trigger a confirmation notification via email or your registered contact channel (such as WhatsApp). This dispatch update will include a dedicated Tracking ID (AWB Number) and a direct link, allowing you to monitor your package’s journey in real time." }
      ]
    },
    {
      title: "Customer Responsibilities & Special Instructions",
      content: [
        { label: "Address Accuracy", text: "Please ensure that your shipping address, pin code, and contact phone number are completely accurate and updated during checkout. LIVE WEAR APPARELS PRIVATE LIMITED cannot be held liable for delivery failures or delays caused by incorrect or incomplete address inputs." },
        { label: "Delivery Instructions", text: "You may provide specific delivery instructions (e.g., gate codes, preferred delivery times) in the designated notes field at checkout. We will pass these variables on to our third-party courier partners, though fulfillment depends on local carrier routing." }
      ]
    },
    {
      title: "Changes and Cancellations",
      content: [
        { text: "If you realize there is an error in your shipping details or wish to cancel an order, please connect with our administrative support desk immediately at info@bloomina.in." },
        { label: "Important Note", text: "To maintain fast fulfillment loops, we are completely unable to modify delivery addresses or cancel orders once they have been handed over to the courier partners and dispatched from our hub." }
      ]
    },
    {
      title: "Logistical Support & Contact",
      content: [
        { text: "We appreciate your business and strive to provide an enjoyable and seamless shopping experience. If you have any ongoing inquiries, unexpected transit delays, or specific logistical concerns regarding your parcel, please don’t hesitate to contact our customer support desk:" },
        { label: "Email Support", text: "info@bloomina.in" },
        { label: "Parent Entity", text: "LIVE WEAR APPARELS PRIVATE LIMITED" },
        { label: "Registered Hub", text: "8/256 Pushpagiri, Koodaranhi, Kozhikode, Kerala, India - 673604." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Shipping & Delivery Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Seamless Journey to Your Doorstep</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mt-2">Effective Date: May 20, 2026</p>
        </div>

        <div className="space-y-16">
          {sections.map((section, idx) => (
            <section key={idx} className="border-b border-primary/5 pb-12 last:border-0 last:pb-0">
              <h2 className="text-2xl font-display font-light text-surface-on mb-6 flex items-center gap-4">
                <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-xs font-semibold">
                  {idx + 1}
                </span>
                {section.title}
              </h2>
              <div className="space-y-4 pl-12">
                {section.content.map((item, itemIdx) => (
                  <p key={itemIdx} className="text-surface-on-variant leading-relaxed text-sm md:text-base font-light">
                    {item.label && (
                      <span className="font-normal text-surface-on block md:inline md:mr-1">
                        {item.label}:
                      </span>
                    )}
                    {item.text}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-24 p-10 bg-white rounded-[2.5rem] border border-stone-100 text-center">
          <p className="text-sm text-surface-on-variant leading-relaxed mb-6 italic">
            "Patience is the companion of wisdom, and the journey of elegance is always curated to perfection."
          </p>
          <div className="h-px w-12 bg-primary/20 mx-auto mb-6" />
          <p className="text-xs text-stone-400">Logistical Inquiries? Reach out to info@bloomina.in</p>
        </div>
      </main>
    </div>
  );
};

export default ShippingPolicyPage;
