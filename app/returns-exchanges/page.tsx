"use client";

import React from 'react';

const ReturnsExchangesPage = () => {
  const sections = [
    {
      title: "Split COD Fee Policy",
      items: [
        {
          text: "For orders placed using the Split Cash on Delivery (Split COD) payment option, the Split COD fee collected at the time of placing the order is strictly non-refundable. In the event of an order cancellation, return, rejection, or non-acceptance at the time of delivery, this fee will not be refunded, as this charge is applied towards the upfront processing and handling of Split COD logistics."
        }
      ]
    },
    {
      title: "Innerwear & Hygiene Considerations",
      items: [
        {
          text: "At Bloomina, customer satisfaction is our priority, and we are committed to resolving any concerns you may have regarding our products. However, due to strict health and hygiene considerations, products from our innerwear and lingerie categories are not eligible for standard returns or exchanges unless there is a confirmed manufacturing defect or an incorrect product has been delivered."
        },
        {
          text: "We encourage all customers to consult our dynamic size guide before placing an order to ensure an accurate fit."
        }
      ]
    },
    {
      title: "Products Eligible for Returns & Exchanges",
      intro: "Returns and exchanges are accepted across our product categories strictly in cases involving:",
      bullets: [
        "Manufacturing defects discovered upon opening the package.",
        "Damaged products sustained during transit.",
        "Incorrect items delivered (wrong size, color, or style compared to your invoice)."
      ],
      items: [
        {
          label: "Verification Guidelines",
          text: "To process these requests efficiently, customers are required to share clear photographs or an unboxing video of the delivered products via email at info@bloomina.in."
        },
        {
          text: "Individual products from curated multipacks cannot be returned or exchanged separately unless explicitly approved by our customer care team."
        },
        {
          text: "Products purchased from the Offer Zone, flash sales, or clearance events are final and are not eligible for returns or exchanges."
        }
      ]
    },
    {
      title: "Return & Exchange Windows",
      items: [
        {
          label: "7-Day Window",
          text: "Any complaint, return, or exchange request regarding structural defects or shipping mistakes must be reported within 7 days from the date of delivery."
        },
        {
          label: "Direct Purchases Only",
          text: "Returns and exchanges are applicable only for products purchased directly through the official bloomina.in website storefront."
        },
        {
          label: "Condition of Items",
          text: "Products that have been used, washed, worn, torn, stitched, altered, or damaged by the customer will be instantly disqualified from our return and exchange queue. All original packaging and tags must remain intact."
        }
      ]
    },
    {
      title: "Logistics Fees & Missing Items",
      items: [
        {
          label: "Exchange Fee",
          text: "For all approved exchange orders, a nominal exchange fee of ₹150 will be charged to cover the cost of reverse pickup and subsequent shipping."
        },
        {
          label: "Pickup Accuracy",
          text: "Customers are responsible for providing an accurate and accessible pickup address to our logistics partners (Shiprocket) to ensure smooth handling."
        },
        {
          label: "Missing Shipments",
          text: "If any item or accessory is missing from your shipment, please contact our customer care team immediately with your order details. We will verify our fulfillment logs and arrange to dispatch the missing item at the earliest."
        }
      ]
    },
    {
      title: "Contact & Support",
      intro: "For all cancellation updates, defect reporting, or return approvals, connect with our administrative desk:",
      items: [
        { label: "Email Support", text: "info@bloomina.in" },
        { label: "Parent Organization", text: "LIVE WEAR APPARELS PRIVATE LIMITED" },
        { label: "Registered Address", text: "8/256 Pushpagiri, Koodaranhi, Kozhikode, Kerala, India - 673604." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-md mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">Return, Refund & Exchange Policy</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Your Satisfaction, Our Commitment</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mt-2">Effective Date: May 20, 2026</p>
        </div>

        <div className="space-y-16">
          {sections.map((section, idx) => (
            <section key={idx} className="border-b border-primary/5 pb-12 last:border-0 last:pb-0">
              <h2 className="text-2xl font-display font-light text-surface-on mb-6 flex items-center gap-4">
                <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                  {idx + 1}
                </span>
                {section.title}
              </h2>

              <div className="pl-12 space-y-4">
                {/* Intro paragraph */}
                {section.intro && (
                  <p className="text-surface-on-variant leading-relaxed text-sm md:text-base font-light">
                    {section.intro}
                  </p>
                )}

                {/* Bullet list */}
                {section.bullets && (
                  <ul className="space-y-2 list-none">
                    {section.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-surface-on-variant text-sm md:text-base font-light leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Content items */}
                {section.items?.map((item, itemIdx) => (
                  <p key={itemIdx} className="text-surface-on-variant leading-relaxed text-sm md:text-base font-light">
                    {item.label && (
                      <span className="font-semibold text-surface-on">
                        {item.label}:{' '}
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
            "Your comfort and confidence are at the heart of every Bloomina creation."
          </p>
          <div className="h-px w-12 bg-primary/20 mx-auto mb-6" />
          <p className="text-xs text-stone-400">Return & Exchange queries? Reach out to info@bloomina.in</p>
        </div>
      </main>
    </div>
  );
};

export default ReturnsExchangesPage;
