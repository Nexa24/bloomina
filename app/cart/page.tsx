"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import CouponSection from '@/components/CouponSection';
import TrustBanner from '@/components/TrustBanner';
import { supabase } from '@/lib/supabase';

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [bogoEligibleIds, setBogoEligibleIds] = useState<Set<string>>(new Set());

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);

  // Avoid hydration mismatch and fetch accurate BOGO product statuses from database
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkBogoEligibility = async () => {
      const itemIds = Array.from(new Set(
        items.map(i => {
          const raw = String(i.productId || i.id || '');
          const match = raw.match(UUID_REGEX);
          return match ? match[0] : (raw.includes('-') && raw.length > 36 ? raw.split('-')[0] : raw);
        }).filter(Boolean)
      ));

      if (itemIds.length === 0) {
        setBogoEligibleIds(new Set());
        return;
      }

      try {
        const { data: dbProducts } = await supabase
          .from('products')
          .select('id, name, categories, specifications')
          .in('id', itemIds);

        const eligible = new Set<string>();
        if (dbProducts) {
          dbProducts.forEach((p: any) => {
            const pCats: string[] = Array.isArray(p.categories) ? p.categories : (p.categories ? [p.categories] : []);
            const pSpecs: any[] = Array.isArray(p.specifications) ? p.specifications : [];
            const isBogo = Boolean(
              p.is_bogo === true ||
              String(p.is_bogo) === 'true' ||
              pSpecs.some((s: any) => {
                const sName = String(s.name || s.key || '').trim().toLowerCase();
                const sVal = String(s.value || '').trim().toLowerCase();
                return (sName === 'is_bogo' || sName === 'bogo') && (sVal === 'true' || sVal === 'yes' || sVal === '1');
              }) ||
              pCats.some(c => typeof c === 'string' && /bogo|buy\s*1\s*get\s*1|buy\s*one\s*get\s*one/i.test(c.trim()))
            );
            if (isBogo) {
              eligible.add(String(p.id).toLowerCase());
              if (p.name) eligible.add(String(p.name).toLowerCase().trim());
            }
          });
        }
        setBogoEligibleIds(eligible);
      } catch (err) {
        console.error('BOGO check error:', err);
      }
    };

    checkBogoEligibility();
  }, [items]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Check if cart contains any Offer% / Sale products
  const hasOfferProduct = items.some((item: any) => {
    return (
      item.is_sale === true ||
      (item.comparePrice && Number(item.comparePrice) > Number(item.price)) ||
      (item.categories && Array.isArray(item.categories) && item.categories.some((c: string) => /sale|offer/i.test(c))) ||
      (typeof item.category === 'string' && /sale|offer/i.test(item.category))
    );
  });

  // Shipping rules:
  // - If cart has any Offer% product: ₹50 shipping
  // - Otherwise, if subtotal < 499: ₹50 shipping
  // - Otherwise: Free shipping (orders >= 499 with regular items)
  const shipping = hasOfferProduct ? 50 : (subtotal < 499 && subtotal > 0 ? 50 : 0);

  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-28 md:pt-36 pb-16 max-w-screen-xl mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-4xl text-primary/30 mb-4 font-light">shopping_basket</span>
          <h1 className="text-2xl md:text-3xl font-display font-light text-surface-on mb-2">Your cart is empty</h1>
          <p className="text-stone-400 text-xs mb-8 max-w-sm mx-auto">Discover our collection and find your favorite pieces.</p>
          <Link href="/products" className="inline-block bg-primary text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-md shadow-primary/20">
            Explore Collection
          </Link>
        </main>
      </div>
    );
  }

  const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  return (
    <div className="min-h-screen bg-background antialiased">
      <main className="pt-28 md:pt-36 pb-20 max-w-screen-xl mx-auto px-6">
        <div className="mb-6 md:mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-light text-surface-on tracking-tight">
              Your Cart <span className="text-primary font-normal text-2xl md:text-4xl">({totalItems})</span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-all flex items-center gap-1.5 pb-1 border-b border-transparent hover:border-primary/20"
          >
            <span className="material-symbols-outlined text-sm font-light">delete_sweep</span>
            Clear All
          </button>
        </div>

        {/* BOGO Interactive Guidance Banner (Strictly for Eligible Items) */}
        {(() => {
          const eligibleItemsInCart = items.filter(item => {
            const rawId = String(item.productId || item.id || '').trim();
            const match = rawId.match(UUID_REGEX);
            const uuid = match ? match[0].toLowerCase() : '';
            const cleanId = rawId.includes('-') && rawId.length > 36 ? rawId.split('-')[0].toLowerCase() : rawId.toLowerCase();
            const name = String(item.name || '').toLowerCase().trim();
            return (uuid && bogoEligibleIds.has(uuid)) || bogoEligibleIds.has(cleanId) || bogoEligibleIds.has(rawId.toLowerCase()) || (name && bogoEligibleIds.has(name));
          });
          const eligibleQty = eligibleItemsInCart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

          if (eligibleQty === 1) {
            return (
              <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                    <span className="material-symbols-outlined text-xl">redeem</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                        Offer Alert
                      </span>
                      <p className="text-xs font-bold text-stone-900">
                        Add 1 more BOGO-eligible item to unlock <span className="text-rose-600 font-black">BUY 1 GET 1 FREE</span>
                      </p>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 font-light">
                      The lower-priced eligible item will be completely <strong className="text-rose-600">FREE</strong> at checkout!
                    </p>
                  </div>
                </div>
                <Link
                  href="/category/buy-1-get-1"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-200 shrink-0"
                >
                  <span>Select BOGO Item</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            );
          }
          if (eligibleQty >= 2) {
            return (
              <div className="mb-10 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-3 animate-fade-in text-emerald-900">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-xl">task_alt</span>
                  <div>
                    <p className="text-xs font-bold">
                      🎉 BOGO Unlocked! You have {eligibleQty} eligible BOGO items in your cart.
                    </p>
                    <p className="text-[10px] text-emerald-700 font-light">
                      Apply code <strong className="font-bold">BOGO</strong> in the order summary to get your 2nd eligible item 100% free.
                    </p>
                  </div>
                </div>
                {!appliedCoupon && (
                  <button
                    onClick={() => {
                      const couponEl = document.querySelector('input[placeholder*="COUPON"]') as HTMLInputElement;
                      if (couponEl) couponEl.focus();
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 underline underline-offset-4 hover:text-emerald-950 shrink-0"
                  >
                    Apply Below &darr;
                  </button>
                )}
              </div>
            );
          }
          return null;
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="hidden md:grid grid-cols-12 pb-3 border-b border-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => {
              const rawId = String(item.productId || item.id || '').trim();
              const match = rawId.match(UUID_REGEX);
              const uuid = match ? match[0].toLowerCase() : '';
              const cleanId = rawId.includes('-') && rawId.length > 36 ? rawId.split('-')[0].toLowerCase() : rawId.toLowerCase();
              const name = String(item.name || '').toLowerCase().trim();
              const isItemBogo = (uuid && bogoEligibleIds.has(uuid)) || bogoEligibleIds.has(cleanId) || bogoEligibleIds.has(rawId.toLowerCase()) || (name && bogoEligibleIds.has(name));

              return (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center pb-4 border-b border-stone-100/70 group">
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-3.5">
                    <Link href={`/product/${item.productId}`} className="w-16 h-20 md:w-20 md:h-24 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0 petal-shadow relative group/img block">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 text-sm drop-shadow">open_in_new</span>
                      </div>
                      {isItemBogo && (
                        <div className="absolute top-1 left-1 bg-[#944555] text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full shadow">
                          BOGO
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/product/${item.productId}`} className="group/name truncate">
                          <h3 className="text-sm md:text-base font-display font-medium text-surface-on group-hover/name:text-primary transition-colors duration-200 truncate">{item.name}</h3>
                        </Link>
                        {isItemBogo && (
                          <span className="text-[8px] font-black uppercase tracking-wider text-[#944555] bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded shrink-0">
                            BOGO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] font-bold uppercase tracking-wider text-primary mt-1 hover:underline text-left"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                {/* Price */}
                <div className="hidden md:block col-span-2 text-center font-display text-lg text-surface-on/80">
                  ₹{item.price.toLocaleString()}
                </div>

                {/* Quantity Controls */}
                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <div className="flex items-center gap-4 bg-white border border-stone-100 px-4 py-2 rounded-full shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-stone-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-4 text-center text-xs font-bold font-body-md">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-stone-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-1 md:col-span-2 text-right">
                  <span className="md:hidden text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Subtotal</span>
                  <span className="font-display text-xl text-primary font-medium">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
          </div>

          {/* Order Summary Sidebox */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(241,145,161,0.08)] border border-stone-50">
              <h2 className="text-2xl font-display font-light text-surface-on mb-8">Order Summary</h2>

              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 ml-1">Have a coupon?</p>
                <CouponSection 
                  cartTotal={subtotal}
                  items={items}
                  hasBogoItems={bogoEligibleIds.size > 0}
                  appliedCoupon={appliedCoupon}
                  onApply={(coupon) => setAppliedCoupon(coupon)}
                  onRemove={() => setAppliedCoupon(null)}
                />
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-on-variant">Subtotal</span>
                  <span className="font-medium text-surface-on">₹{subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm animate-fade-in-up">
                    <span className="text-primary">Discount ({appliedCoupon.code})</span>
                    <span className="font-medium text-primary">-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm items-center">
                  <div>
                    <span className="text-surface-on-variant">Shipping</span>
                    <p className="text-[9px] text-stone-400 font-light">
                      {hasOfferProduct 
                        ? 'Flat ₹50 shipping for Offer% items' 
                        : subtotal < 499 
                          ? 'Standard ₹50 shipping for orders under ₹499' 
                          : 'Free shipping on orders above ₹499'}
                    </p>
                  </div>
                  <span className={`${shipping === 0 ? 'text-green-600 font-bold' : 'text-surface-on font-medium'} uppercase text-[10px] tracking-widest`}>
                    {shipping === 0 ? 'Free' : `₹${shipping}.00`}
                  </span>
                </div>
                <div className="h-px bg-stone-100 my-4" />
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-display text-surface-on">Total</span>
                  <span className="text-3xl font-price text-primary font-bold">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href={{
                  pathname: '/checkout',
                  query: appliedCoupon ? { coupon: appliedCoupon.code } : {}
                }}
                className="w-full bg-primary text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 block text-center"
              >
                Proceed to Checkout
              </Link>

              {/* Trust & Guarantee Banner */}
              <div className="mt-8 pt-6 border-t border-stone-100">
                <TrustBanner variant="compact" />
              </div>
            </div>

            {/* Support info */}
            <div className="mt-8 px-6">
              <p className="text-[10px] text-surface-on-variant/40 uppercase tracking-widest leading-relaxed">
                Need assistance? <br />
                Contact our concierge at <br />
                <span className="text-primary hover:underline cursor-pointer transition-colors">support@bloomina.in</span>
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
