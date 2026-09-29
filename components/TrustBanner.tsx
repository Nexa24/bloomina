import React from 'react';

interface TrustBannerProps {
  variant?: 'strip' | 'cards' | 'compact';
  className?: string;
}

const trustItems = [
  {
    icon: 'lock',
    title: '100% Secure Checkout',
    description: '256-bit encrypted Razorpay & UPI transactions'
  },
  {
    icon: 'payments',
    title: 'Cash on Delivery Available',
    description: 'Pay on delivery with low ₹50 booking fee'
  },
  {
    icon: 'local_shipping',
    title: 'Express All-India Delivery',
    description: 'Free shipping in Kerala • 3-5 days delivery'
  },
  {
    icon: 'package_2',
    title: 'Discreet Packaging',
    description: '100% private, plain eco-friendly parcels'
  }
];

export default function TrustBanner({ variant = 'cards', className = '' }: TrustBannerProps) {
  if (variant === 'compact') {
    return (
      <div className={`p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 ${className}`}>
        <div className="grid grid-cols-2 gap-3 text-left">
          {trustItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base shrink-0">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-stone-900 truncate uppercase tracking-wider">{item.title}</p>
                <p className="text-[9px] text-stone-500 font-light truncate">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'strip') {
    return (
      <section className={`w-full bg-[#fff9fa] border-y border-stone-100 py-6 ${className}`}>
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-stone-200/60 flex items-center justify-center text-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined text-lg">
                    {item.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-surface-on truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 font-light truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-12 md:py-16 ${className}`}>
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 rounded-[2rem] bg-white border border-stone-100/80 shadow-[0_15px_40px_-15px_rgba(241,145,161,0.12)] hover:shadow-[0_20px_50px_-15px_rgba(241,145,161,0.22)] transition-all duration-300 flex flex-col items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#fff5f7] border border-[#944555]/15 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                <span className="material-symbols-outlined text-2xl font-light">
                  {item.icon}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-surface-on">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
