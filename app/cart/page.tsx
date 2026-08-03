"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import CouponSection from '@/components/CouponSection';

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-40 pb-20 max-w-screen-xl mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-6xl text-primary/20 mb-6 font-light">shopping_basket</span>
          <h1 className="text-4xl font-display font-light text-surface-on mb-4">Your sanctuary is empty</h1>
          <p className="text-surface-on-variant mb-12 max-w-md mx-auto">Discover our collection of ethereal comfort and find your next favorite piece.</p>
          <Link href="/products" className="inline-block bg-primary text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            Explore Collection
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background antialiased">
      <main className="pt-32 md:pt-40 pb-24 max-w-screen-xl mx-auto px-6">
        <div className="mb-12 md:mb-16 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-light text-surface-on tracking-tight">Your Selection</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-4">Review your ethereal comfort pieces</p>
          </div>
          <button
            onClick={clearCart}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-all flex items-center gap-2 pb-1 border-b border-transparent hover:border-primary/20"
          >
            <span className="material-symbols-outlined text-sm font-light">delete_sweep</span>
            Clear Selection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-10">
            <div className="hidden md:grid grid-cols-12 pb-6 border-b border-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-10 border-b border-stone-50 group">
                {/* Product Info */}
                <div className="col-span-1 md:col-span-6 flex gap-6">
                  <Link href={`/product/${item.productId}`} className="w-24 h-32 md:w-32 md:h-40 bg-stone-50 rounded-2xl overflow-hidden flex-shrink-0 petal-shadow relative group/img block">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 text-lg drop-shadow">open_in_new</span>
                    </div>
                  </Link>
                  <div className="flex flex-col justify-center gap-1">
                    <Link href={`/product/${item.productId}`} className="group/name">
                      <h3 className="text-lg md:text-xl font-display font-light text-surface-on group-hover/name:text-primary transition-colors duration-200 underline-offset-4 group-hover/name:underline decoration-primary/30">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-surface-on-variant/60">
                      {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-primary mt-4 hover:underline underline-offset-4 decoration-1 text-left"
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
            ))}
          </div>

          {/* Order Summary Sidebox */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(241,145,161,0.08)] border border-stone-50">
              <h2 className="text-2xl font-display font-light text-surface-on mb-8">Order Summary</h2>

              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 ml-1">Have a coupon?</p>
                <CouponSection 
                  cartTotal={subtotal}
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
                <div className="flex justify-between text-sm">
                  <span className="text-surface-on-variant">Shipping</span>
                  <span className={`${shipping === 0 ? 'text-green-600' : 'text-surface-on'} font-medium uppercase text-[10px] tracking-widest`}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
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

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-stone-400">
                  <span className="material-symbols-outlined text-lg font-light">verified_user</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <span className="material-symbols-outlined text-lg font-light">package_2</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Discreet Packaging</span>
                </div>
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
