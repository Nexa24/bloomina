"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  useEffect(() => {
    // Trigger confetti for a premium feel
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 antialiased relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <main className="max-w-xl w-full relative z-10 text-center">
        <div className="mb-10 w-64 h-48 mx-auto relative animate-fade-in-up">
          <img src="/order-3d-success.svg" alt="Order Verified" className="w-full h-full object-contain" />
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-light text-surface-on tracking-tighter mb-4 animate-fade-in-up delay-100">
          A New Beginning
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary mb-12 animate-fade-in-up delay-200">
          Your Bloomina selection is confirmed
        </p>

        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(241,145,161,0.1)] border border-stone-50 mb-12 animate-fade-in-up delay-300">
          <div className="space-y-1 mb-8">
            <p className="text-stone-300 text-[10px] font-bold uppercase tracking-[0.3em]">Order Reference</p>
            <p className="text-2xl font-display text-surface-on tracking-tight">#{orderId?.slice(-8).toUpperCase() || 'BLOOM-SANCTUARY'}</p>
          </div>
          
          <div className="h-px w-12 bg-primary/20 mx-auto mb-8" />
          
          <p className="text-sm md:text-base text-surface-on-variant leading-relaxed font-light mb-8">
            Thank you for choosing Bloomina. We are now meticulously preparing your pieces to ensure they bring the weightless comfort you deserve. A digital summary has been sent to your email sanctuary.
          </p>

          <div className="flex items-center justify-center gap-8 py-6 px-4 bg-stone-50/50 rounded-2xl border border-stone-100/50">
            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Status</p>
              <p className="text-[10px] font-bold uppercase text-primary tracking-tighter flex items-center gap-1 justify-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Preparing
              </p>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Timeline</p>
              <p className="text-[10px] font-bold uppercase text-surface-on tracking-tighter">3-5 Days</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-in-up delay-400">
          <Link 
            href="/account"
            className="flex-1 bg-primary text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 hover:scale-[1.03] active:scale-95 transition-all duration-500"
          >
            Track Order
          </Link>
          <Link 
            href="/"
            className="flex-1 bg-white text-surface-on border border-stone-100 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-stone-50 transition-all duration-500"
          >
            Continue Browsing
          </Link>
        </div>
      </main>
    </div>
  );
};

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
