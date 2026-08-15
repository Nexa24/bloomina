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
          {/* Brand Story & Address */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo/BLO_TRNSP_PINK_LRG.png" 
                alt="Bloomina Logo" 
                width={160} 
                height={42} 
                className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-xs text-surface-on-variant leading-relaxed font-normal">
              Comfort • Elegant • Everyday
            </p>
            <div className="space-y-1 text-xs text-stone-600 font-medium">
              <p className="font-bold text-stone-900">Bloomina Atelier</p>
              <p>150/8438, MOUNTPARK INDUSTRIAL ESTATES,</p>
              <p>Pushpagiri, Calicut, India</p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://facebook.com" aria-label="Bloomina Facebook" className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-primary/80 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg" aria-hidden="true">facebook</span>
              </a>
              <a href="https://linktr.ee/livewearapparels" target="_blank" rel="noopener noreferrer" aria-label="Livewear Apparels Linktree" className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-primary/80 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg" aria-hidden="true">public</span>
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-on">Collections</h3>
            <ul className="space-y-3">
              <li><Link href="/category/bras" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Signature Bras</Link></li>
              <li><Link href="/category/panties" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Seamless Panties</Link></li>
              <li><Link href="/category/bestsellers" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Bestsellers</Link></li>
              <li><Link href="/all-products" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">All Products</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-on">Customer Care</h3>
            <ul className="space-y-3">
              <li><Link href="/size-guide" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Size Guide</Link></li>
              <li><Link href="/shipping-policy" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Shipping Policy</Link></li>
              <li><Link href="/returns-exchanges" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Returns & Exchanges</Link></li>
              <li><Link href="/cancellation-policy" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Cancellation Policy</Link></li>
              <li><Link href="/contact" className="text-xs text-surface-on-variant hover:text-primary transition-colors font-medium">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-surface-on">Stay Connected</h3>
            <p className="text-xs text-surface-on-variant font-normal leading-relaxed">Subscribe for exclusive offers and product releases.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <label htmlFor="footer-newsletter-email" className="sr-only">Email address for newsletter</label>
              <input 
                type="email" 
                id="footer-newsletter-email"
                aria-label="Email address for newsletter"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full bg-transparent border-b border-stone-400 py-3 pr-10 text-xs focus:outline-none focus:border-primary transition-colors font-medium text-surface-on placeholder:text-stone-400"
              />
              <button 
                type="submit"
                aria-label="Subscribe to newsletter"
                disabled={isSubmitting}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base" aria-hidden="true">east</span>
              </button>
            </form>
            {subscribeStatus === 'success' && (
              <p className="text-xs text-green-600 font-medium animate-pulse">Thank you for subscribing!</p>
            )}
            {subscribeStatus === 'error' && (
              <p className="text-xs text-red-500 font-normal">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-stone-200/80 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 grayscale opacity-40">
            {['payments', 'wallet', 'contactless', 'credit_card'].map((icon) => (
              <span key={icon} className="material-symbols-outlined text-2xl" aria-hidden="true">{icon}</span>
            ))}
          </div>
          
          <div className="text-center md:text-right space-y-2">
            <p className="text-xs font-semibold text-stone-600">
              © 2026 Bloomina. All rights reserved.
            </p>
            <div className="flex justify-center md:justify-end gap-6 text-xs font-medium text-stone-500">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
