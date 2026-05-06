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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center antialiased">
      <main className="max-w-md w-full">
        <div className="mb-10 inline-flex w-24 h-24 bg-green-50 rounded-full items-center justify-center text-green-500 shadow-lg shadow-green-100 animate-bounce">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-light text-surface-on tracking-tight mb-4">
          Order Confirmed
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">Your sanctuary is being prepared</p>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 mb-12">
          <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-2">Order Reference</p>
          <p className="text-lg font-display text-surface-on font-medium">#{orderId?.slice(-8).toUpperCase() || 'BLOOM-ORDER'}</p>
          <div className="h-px bg-stone-50 my-6" />
          <p className="text-sm text-surface-on-variant leading-relaxed">
            A confirmation email has been sent to your inbox. We will notify you once your ethereal comfort pieces are on their way.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link 
            href="/account"
            className="w-full bg-primary text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            View My Orders
          </Link>
          <Link 
            href="/"
            className="w-full py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary transition-colors"
          >
            Return to Sanctuary
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
