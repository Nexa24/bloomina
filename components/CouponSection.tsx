"use client";

import React, { useState } from 'react';
import { validateCoupon } from '@/app/actions/checkout';

interface CouponSectionProps {
  cartTotal: number;
  onApply: (coupon: { code: string; discountAmount: number }) => void;
  onRemove: () => void;
  appliedCoupon: { code: string; discountAmount: number } | null;
}

const CouponSection: React.FC<CouponSectionProps> = ({ cartTotal, onApply, onRemove, appliedCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!couponCode.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await validateCoupon(couponCode, cartTotal);
      
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
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 p-3.5 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🎁</span>
            <div>
              <p className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Active Offer: BUY 1 GET 1 FREE</p>
              <p className="text-[10px] font-bold text-amber-700/80 dark:text-amber-400/80 uppercase">Code: BOGO (Get 2nd item 100% FREE)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              setCouponCode('BOGO');
              setIsLoading(true);
              setError(null);
              try {
                const res = await validateCoupon('BOGO', cartTotal);
                if (res.success && res.coupon) {
                  onApply({ code: res.coupon.code, discountAmount: res.coupon.discountAmount });
                } else {
                  setError(res.error || 'Failed to apply BOGO.');
                }
              } catch (e) {
                setError('Error applying BOGO offer.');
              } finally {
                setIsLoading(false);
              }
            }}
            className="bg-[#944555] hover:bg-[#7d3a47] text-white px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm shrink-0"
          >
            Apply Code
          </button>
        </div>
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
          onClick={handleApply}
          disabled={isLoading || !couponCode.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-surface-on text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-30"
        >
          {isLoading ? '...' : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2 animate-fade-in-up">
          {error}
        </p>
      )}
    </div>
  );
};

export default CouponSection;
