"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setSubscribeStatus('idle');

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          name: 'Newsletter Subscriber',
          email: email.trim().toLowerCase(),
          type: 'Newsletter',
          message: 'Subscribed to Bloomina Newsletter',
          status: 'new'
        }]);

      if (error) throw error;
      setSubscribeStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Newsletter subscribe error:', err);
      setSubscribeStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-surface-container-lowest border-t border-primary/5 pt-24 pb-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          {/* Brand Story */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo/BLO_TRNSP_PINK_LRG.png" 
                alt="Bloomina Logo" 
                width={160} 
                height={42} 
                className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-surface-on-variant leading-relaxed font-light">
              Crafting weightless support and effortless elegance through the science of <span className="italic font-normal">Floral Minimalism</span>. Designed to make you feel every moment.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
            </div>
          </div>

          {/* Ethereal Links */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-on/40">Collections</h3>
            <ul className="space-y-4">
              <li><Link href="/category/bras" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Signature Bras</Link></li>
              <li><Link href="/category/panties" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Seamless Panties</Link></li>
              <li><Link href="/category/nightwear" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Lounge & Nightwear</Link></li>
              <li><Link href="/category/bestsellers" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Our Bestsellers</Link></li>
            </ul>
          </div>

          {/* Assistance */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-on/40">Assistance</h3>
            <ul className="space-y-4">
              <li><Link href="/size-guide" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Size Guide</Link></li>
              <li><Link href="/shipping-policy" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Shipping Policy</Link></li>
              <li><Link href="/returns-exchanges" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Returns & Exchanges</Link></li>
              <li><Link href="/cancellation-policy" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Cancellation Policy</Link></li>
              <li><Link href="/feedback" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Brand Feedback</Link></li>
              <li><Link href="/contact" className="text-sm text-surface-on-variant hover:text-primary transition-colors font-light tracking-wide">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-surface-on/40">Newsletter</h3>
            <p className="text-sm text-surface-on-variant font-light">Join the Bloomina collective for exclusive releases and design insights.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="w-full bg-transparent border-b border-primary/20 py-3 pr-10 text-sm focus:outline-none focus:border-primary transition-colors font-light text-surface-on placeholder:text-stone-300"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform disabled:opacity-50"
              >
                <span className="material-symbols-outlined">east</span>
              </button>
            </form>
            {subscribeStatus === 'success' && (
              <p className="text-xs text-green-600 font-medium animate-pulse">Thank you for subscribing to our collective!</p>
            )}
            {subscribeStatus === 'error' && (
              <p className="text-xs text-red-500 font-light">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-24 pt-12 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 grayscale opacity-30">
            {['payments', 'wallet', 'contactless', 'credit_card'].map((icon) => (
              <span key={icon} className="material-symbols-outlined text-3xl">{icon}</span>
            ))}
          </div>
          
          <div className="text-center md:text-right space-y-2 md:pr-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-on/30">
              © 2026 Bloomina. Designed with Intention.
            </p>
            <div className="flex justify-center md:justify-end gap-6 text-[9px] font-bold uppercase tracking-[0.1em] text-surface-on/20">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
