"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { createOrder, verifyPayment, validateCoupon, deleteOrder, getCheckoutConfig } from '@/app/actions/checkout';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import CouponSection from '@/components/CouponSection';

const INDIAN_STATES = [
  "Kerala",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const CheckoutPage = () => {
  const { items: cartItems, getTotalPrice: getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCouponCode = searchParams.get('coupon');
  const isBuyNow = searchParams.get('buyNow') === 'true';

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirectingToSuccess, setIsRedirectingToSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<any>(null);

  // The items used for this checkout session
  const items = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;

  const [checkoutConfig, setCheckoutConfig] = useState({
    cod_enabled: true,
    cod_min_order: 0,
    whatsapp_enabled: true
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    state: 'Kerala'
  });

  useEffect(() => {
    setIsMounted(true);
    // In buyNow mode, load the single item from sessionStorage
    if (isBuyNow) {
      const stored = sessionStorage.getItem('buyNowItem');
      if (stored) {
        setBuyNowItem(JSON.parse(stored));
      } else {
        router.push('/cart');
      }
      return;
    }
    if (cartItems.length === 0 && !isRedirectingToSuccess) {
      router.push('/cart');
    }
  }, [isBuyNow, cartItems, router, isRedirectingToSuccess]);

  // Handle initial coupon from query
  useEffect(() => {
    const applyInitialCoupon = async () => {
      if (initialCouponCode && items.length > 0) {
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const result = await validateCoupon(initialCouponCode, subtotal);
        if (result.success && result.coupon) {
          setAppliedCoupon({
            code: result.coupon.code,
            discountAmount: result.coupon.discountAmount
          });
        }
      }
    };
    applyInitialCoupon();
  }, [initialCouponCode, items.length]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getCheckoutConfig();
        setCheckoutConfig({
          cod_enabled: config.cod_enabled,
          cod_min_order: config.cod_min_order,
          whatsapp_enabled: config.whatsapp_enabled
        });
      } catch (err) {
        console.error('Failed to load checkout config:', err);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setFormData({
            fullName: profile.full_name || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            postalCode: profile.postal_code || '',
            state: profile.state || 'Kerala'
          });
        } else if (user.email) {
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
      }
    };

    fetchProfile();
  }, [user, supabase]);

  if (!isMounted || items.length === 0) {
    return null;
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isKerala = formData.state?.trim().toLowerCase() === 'kerala';
  const shipping = isKerala ? 0 : 80;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const isCodEligible = false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Create Order via Server Action
      const result = await createOrder({
        items,
        shippingAddress: formData,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon?.code
      });

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // 2. Handle Success for COD
      if (result.isCOD) {
        await finalizeOrder(result.orderId);
        return;
      }

      // 3. Handle Razorpay Payment
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Check your internet connection.");
      }

      const options = {
        key: result.key,
        amount: result.amount,
        currency: result.currency,
        name: "Bloomina",
        description: "Order Checkout",
        order_id: result.razorpayOrderId,
        handler: async function (response: any) {
          setIsLoading(true);
          const verification = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: result.orderId || ''
          });

          if (verification.success) {
            await finalizeOrder(result.orderId);
          } else {
            setError(verification.error || "Payment verification failed");
            setIsLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#F191A1"
        },
        modal: {
          ondismiss: async function() {
            setIsLoading(false);
            if (result.orderId) {
              console.log("[Checkout] Payment dismissed. Cleaning up pending order:", result.orderId);
              await deleteOrder(result.orderId);
            }
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const finalizeOrder = async (orderId: string) => {
    if (user && saveAddress) {
      console.log('Attempting to save address for user:', user.id);
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        updated_at: new Date().toISOString()
      });

      if (profileError) {
        console.error('Error saving profile address:', profileError);
      } else {
        console.log('Address saved successfully');
      }
    }

    setIsRedirectingToSuccess(true);
    // In buyNow mode only clear the sessionStorage entry, leave the cart intact
    if (isBuyNow) {
      sessionStorage.removeItem('buyNowItem');
    } else {
      clearCart();
    }
    router.push(`/order-success?id=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <main className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/cart" className="text-primary hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-4xl font-display font-light text-surface-on tracking-tight">Checkout</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-2">Finalize your selection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-12">
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-stone-100">
              <h2 className="text-2xl font-display font-light text-surface-on mb-10 flex items-center gap-4">
                <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-sm font-bold">1</span>
                Shipping Destination
              </h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
                    <input 
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="E.g. Elena Gilbert"
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Phone Number</label>
                    <input 
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 00000 00000"
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!!user}
                    placeholder="elena@mystic.com"
                    className={`w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300 ${user ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                  {user && <p className="text-[8px] font-bold text-primary/40 uppercase tracking-widest ml-1">Linked to your sanctuary account</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Street Address</label>
                  <textarea 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Street name, house number, apartment details..."
                    className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">City</label>
                    <input 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">State</label>
                    <select 
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-surface-on cursor-pointer font-medium"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Postal Code</label>
                    <input 
                      required
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                    />
                  </div>
                </div>

                {user && (
                  <div className="pt-4 border-t border-stone-50">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox"
                          checked={saveAddress}
                          onChange={(e) => setSaveAddress(e.target.checked)}
                          className="w-5 h-5 rounded-lg border-2 border-stone-200 text-primary focus:ring-primary/20 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary"
                        />
                        {saveAddress && (
                          <span className="material-symbols-outlined absolute text-white text-sm pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">check</span>
                        )}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-500 group-hover:text-primary transition-colors">Save this address for future lovely orders</span>
                    </label>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-stone-100">
              <h2 className="text-2xl font-display font-light text-surface-on mb-10 flex items-center gap-4">
                <span className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-primary text-sm font-bold">2</span>
                Payment Method
              </h2>
              <div className="space-y-4">
                <div 
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${paymentMethod === 'Razorpay' ? 'bg-primary/5 border-primary/20' : 'bg-stone-50 border-transparent hover:border-stone-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined ${paymentMethod === 'Razorpay' ? 'text-primary' : 'text-stone-400'}`}>payments</span>
                    <div>
                      <p className={`text-sm font-semibold ${paymentMethod === 'Razorpay' ? 'text-surface-on' : 'text-stone-500'}`}>Pay with Razorpay</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">Cards, UPI, Netbanking</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'Razorpay' ? 'border-primary' : 'border-stone-200'}`}>
                    {paymentMethod === 'Razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-scale-in" />}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5 sticky top-32">
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(241,145,161,0.1)] border border-stone-50">
              <h2 className="text-2xl font-display font-light text-surface-on mb-10">Order Review</h2>
              
              <div className="space-y-8 mb-10">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-surface-on truncate">{item.name}</h4>
                      <p className="text-[10px] text-surface-on-variant/60 uppercase tracking-widest mt-1">
                        Qty: {item.quantity} | {item.size}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-surface-on">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 ml-1">Have a coupon?</p>
                <CouponSection 
                  cartTotal={subtotal}
                  appliedCoupon={appliedCoupon}
                  onApply={(coupon) => setAppliedCoupon(coupon)}
                  onRemove={() => setAppliedCoupon(null)}
                />
              </div>

              <div className="space-y-4 mb-10 py-8 border-y border-stone-50">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-on-variant">Subtotal</span>
                  <span className="font-medium text-surface-on">₹{subtotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm animate-fade-in-up">
                    <span className="text-primary font-bold uppercase text-[10px] tracking-widest">Discount ({appliedCoupon.code})</span>
                    <span className="font-medium text-primary">-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                 <div className="flex justify-between text-sm items-center">
                   <div>
                     <span className="text-surface-on-variant">Shipping</span>
                     <p className="text-[9px] text-stone-400 font-light">
                       {isKerala ? 'Free shipping across Kerala' : `Standard shipping for ${formData.state || 'other states'}`}
                     </p>
                   </div>
                   <span className={`${shipping === 0 ? 'text-primary font-bold' : 'text-surface-on font-medium'} uppercase text-[10px] tracking-widest`}>
                     {shipping === 0 ? 'Free' : `₹${shipping}.00`}
                   </span>
                 </div>  </div>
                <div className="pt-4 flex justify-between items-baseline">
                  <span className="text-lg font-display text-surface-on">Total</span>
                  <span className="text-3xl font-price text-primary font-bold">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs rounded-2xl border border-red-100 flex items-start gap-3">
                  <span className="material-symbols-outlined text-lg">error</span>
                  <p>{error}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {paymentMethod === 'COD' ? 'Confirm COD Order' : 'Complete Purchase'}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>

              <p className="mt-8 text-center text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
                By completing your purchase you agree to our <br />
                <span className="underline cursor-pointer">Terms & Conditions</span>
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 px-4">
              <div className="flex flex-col items-center gap-2 text-center opacity-40">
                <span className="material-symbols-outlined text-xl">encrypted</span>
                <span className="text-[8px] font-bold uppercase tracking-widest">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center opacity-40">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
                <span className="text-[8px] font-bold uppercase tracking-widest">Express</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center opacity-40">
                <span className="material-symbols-outlined text-xl">workspace_premium</span>
                <span className="text-[8px] font-bold uppercase tracking-widest">Premium</span>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
