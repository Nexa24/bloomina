"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [orderInfo, setOrderInfo] = React.useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      const { data } = await supabase
        .from('orders')
        .select('payment_method, email, status')
        .eq('id', orderId)
        .single();
      setOrderInfo(data);
    };
    fetchOrder();
  }, [orderId, supabase]);

  useEffect(() => {
    // Elegant confetti burst
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 100, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
      // Soft rose and white petals effect
      const colors = ['#944555', '#F191A1', '#ffffff'];
      
      confetti({ 
        ...defaults, 
        particleCount, 
        colors,
        origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } 
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        colors,
        origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } 
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const isCOD = orderInfo?.payment_method === 'COD';

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center p-6 antialiased relative overflow-hidden">
      {/* Editorial Background Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <main className="max-w-2xl w-full relative z-10 flex flex-col items-center">
        {/* The Star: High-Fidelity 3D Animation */}
        <div className="mb-8 w-full max-w-[400px] h-64 md:h-80 relative animate-fade-in">
          <img 
            src="/order-3d-success.svg" 
            alt="Order Fulfillment Animation" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* Messaging Section */}
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary mb-4">
            {isCOD ? 'Order Confirmed' : 'Payment Successful'}
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-light text-[#1A1C1C] tracking-tighter leading-none mb-6">
            Refined Luxury, <br />
            <span className="italic font-serif">{isCOD ? 'Reserved for You.' : 'Now Confirmed.'}</span>
          </h1>
          <div className="h-px w-24 bg-[#944555]/20 mx-auto" />
        </div>

        {/* Order Details Card - Luxury Stationery Style */}
        <div className="w-full bg-white rounded-[3rem] shadow-[0_50px_120px_-20px_rgba(148,69,85,0.08)] border border-white p-10 md:p-16 mb-12 relative animate-slide-up [animation-delay:200ms]">
          {/* Sublte pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-[3rem] overflow-hidden" style={{ backgroundImage: 'radial-gradient(#944555 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-1">Confirmation</p>
                <p className="text-xl font-display text-[#1A1C1C]">#{orderId?.slice(-8).toUpperCase() || 'BLOOM-777-SUCCESS'}</p>
              </div>
              <div className="flex items-center gap-3 py-2 px-5 bg-primary/5 rounded-full border border-primary/10">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {isCOD ? 'Awaiting Dispatch' : 'In Preparation'}
                </span>
              </div>
            </div>

            <p className="text-lg text-[#534345] font-light leading-relaxed mb-12 max-w-lg">
              {isCOD 
                ? "Your order has been logged into our system. We will contact you shortly to verify your delivery details before dispatching your lovely selection."
                : "Your selection has been curated. Our artisans are now preparing your pieces with the meticulous attention to detail that defines the Bloomina standard."
              }
            </p>

            <div className="grid grid-cols-2 gap-8 py-8 border-t border-stone-50">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2">Estimated Arrival</p>
                <p className="text-sm font-medium text-[#1A1C1C]">3 — 5 Business Days</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2">Notification Sent</p>
                <p className="text-sm font-medium text-[#1A1C1C] truncate">{orderInfo?.email || 'Your Inbox'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md animate-slide-up [animation-delay:400ms]">
          <Link 
            href="/account"
            className="group relative flex-1 bg-[#1A1C1C] text-white py-7 rounded-full text-center overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
          >
            <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em]">Track Selection</span>
            <div className="absolute inset-0 bg-[#944555] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
          
          <Link 
            href="/"
            className="flex-1 bg-white text-[#1A1C1C] border border-stone-200 py-7 rounded-full text-center transition-all duration-500 hover:bg-stone-50 hover:border-stone-300 text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            Back to Studio
          </Link>
        </div>

        <p className="mt-16 text-[9px] text-stone-400 uppercase tracking-[0.4em] font-medium text-center opacity-60">
          Crafted with Passion &middot; Bloomina Fulfillment Studio
        </p>
      </main>
    </div>
  );
};

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
