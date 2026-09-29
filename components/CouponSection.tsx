"use client";

import React, { useState } from 'react';
import { validateCoupon } from '@/app/actions/checkout';

interface CouponSectionProps {
  cartTotal: number;
  items?: any[];
  onApply: (coupon: { code: string; discountAmount: number }) => void;
  onRemove: () => void;
  appliedCoupon: { code: string; discountAmount: number } | null;
}

const CouponSection: React.FC<CouponSectionProps> = ({ cartTotal, items = [], onApply, onRemove, appliedCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Total quantity of items in cart
  const totalItemCount = Array.isArray(items) 
    ? items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) 
    : 0;

  const isBogoEligible = totalItemCount >= 2;

  const handleApply = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim();
    if (!code) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await validateCoupon(code, cartTotal, items);
      
      if (result.success && result.coupon) {
        onApply({
          code: result.coupon.code,
          discountAmount: result.coupon.discountAmount
        });
        setCouponCode('');
      } else {
        setError(result.error || 'Failed to apply coupon.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">confirmation_number</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Coupon Applied</p>
            <p className="text-sm font-display font-medium text-surface-on">{appliedCoupon.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-primary">-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
          <button 
            onClick={onRemove}
            className="w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Offer Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50/50 dark:from-amber-950/30 dark:to-rose-950/20 border border-amber-200/80 dark:border-amber-800/40 p-4 rounded-2xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎁</span>
            <div>
              <p className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">
                BUY 1 GET 1 FREE (BOGO)
              </p>
              <p className="text-[10px] font-semibold text-amber-700/90 dark:text-amber-400/90">
                Add 2 or more items &middot; Lower priced item is 100% FREE!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleApply('BOGO')}
            disabled={isLoading}
            className="bg-[#944555] hover:bg-[#7d3a47] text-white px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm shrink-0 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Apply Code'}
          </button>
        </div>

        {/* Dynamic customer guidance based on items in cart */}
        {!isBogoEligible && (
          <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between text-[10px]">
            <span className="text-amber-800 dark:text-amber-300 font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs">info</span>
              You have {totalItemCount} of 2 items in cart for BOGO
            </span>
            <a 
              href="/products" 
              className="text-[#944555] font-bold hover:underline underline-offset-2 flex items-center gap-1"
            >
              + Add 1 more item &rarr;
            </a>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="ENTER COUPON CODE (E.G. BOGO)"
          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-[11px] font-bold tracking-widest focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300 uppercase"
        />
        <button 
          onClick={() => handleApply()}
          disabled={isLoading || !couponCode.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-surface-on text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-30"
        >
          {isLoading ? '...' : 'Apply'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-red-500">error</span>
            <span className="font-medium text-[11px]">{error}</span>
          </div>
          {error.toLowerCase().includes('bogo') && !isBogoEligible && (
            <a 
              href="/products" 
              className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors shrink-0"
            >
              Browse Products
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponSection;
