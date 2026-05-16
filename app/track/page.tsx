"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

const TrackPage = () => {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  
  const [orderId, setOrderId] = useState(urlId || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    if (urlId) setOrderId(urlId.toUpperCase());
  }, [urlId]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      let query = supabase.from('orders').select('*');
      
      if (orderId.includes('-')) {
        // Full UUID
        query = query.eq('id', orderId);
      } else {
        // Partial ID search
        query = query.ilike('id', `${orderId}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      if (!data || data.length === 0) {
        setError('No order found with this ID.');
      } else {
        // If multiple found (partial ID), try to match email or just take the first if email wasn't provided
        const matchedOrder = email 
          ? data.find(o => o.customer_email?.toLowerCase() === email.toLowerCase() || o.shipping_address?.email?.toLowerCase() === email.toLowerCase())
          : data[0];

        if (!matchedOrder) {
          setError('Order ID found, but email verification failed.');
        } else {
          setOrder(matchedOrder);
        }
      }
    } catch (err: any) {
      console.error('Tracking error:', err);
      setError('An error occurred while tracking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { status: 'Payment Pending', icon: 'payments', label: 'Order Placed' },
    { status: 'Payment Done', icon: 'verified', label: 'Payment Confirmed' },
    { status: 'Processing', icon: 'inventory_2', label: 'In Preparation' },
    { status: 'Shipped', icon: 'local_shipping', label: 'Dispatched' },
    { status: 'Delivered', icon: 'task_alt', label: 'Delivered' }
  ];

  const getStatusIndex = (currentStatus: string) => {
    if (currentStatus === 'Cancelled') return -1;
    const index = steps.findIndex(s => s.status === currentStatus);
    if (index === -1) return 1; // Default for payment done
    return index;
  };

  const currentStep = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col antialiased">
      <Navbar />
      
      <main className="flex-1 pt-40 pb-24 px-6">
        <div className="max-w-screen-md mx-auto">
          
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">Concierge Services</p>
            <h1 className="text-5xl font-display font-light text-surface-on tracking-tight mb-6">Track Your Sanctuary</h1>
            <p className="text-stone-400 font-light max-w-md mx-auto leading-relaxed">
              Enter your order details below to trace the journey of your Bloomina selection.
            </p>
          </div>

          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-stone-100">
            {!order ? (
              <form onSubmit={handleTrack} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Order ID</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 8B50E2DD"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-stone-100 py-4 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200 text-lg font-display" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-stone-100 py-4 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200 text-lg font-display" 
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? 'Consulting Records...' : 'Trace Order'}
                </button>
              </form>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-start mb-16 pb-8 border-b border-stone-50">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Order Tracking Success</p>
                    <h3 className="text-3xl font-display">#{order.id.slice(0, 8).toUpperCase()}</h3>
                  </div>
                  <button 
                    onClick={() => setOrder(null)}
                    className="text-[10px] font-bold uppercase tracking-widest text-stone-300 hover:text-stone-900 transition-colors"
                  >
                    Track Another
                  </button>
                </div>

                {order.status === 'Cancelled' ? (
                  <div className="p-8 rounded-3xl bg-red-50 border border-red-100 text-center space-y-4">
                    <span className="material-symbols-outlined text-red-400 text-4xl">cancel</span>
                    <div>
                      <h4 className="text-lg font-display text-red-900">Order Cancelled</h4>
                      <p className="text-xs text-red-700">This order has been removed or cancelled from our fulfillment system.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-16">
                    {/* Visual Stepper */}
                    <div className="relative">
                      {/* Connecting Line */}
                      <div className="absolute top-6 left-0 right-0 h-[2px] bg-stone-100 hidden md:block" />
                      <div 
                        className="absolute top-6 left-0 h-[2px] bg-primary transition-all duration-1000 hidden md:block" 
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      />

                      <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0">
                        {steps.map((step, i) => (
                          <div key={i} className="flex md:flex-col items-center gap-6 md:gap-4 text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 shadow-xl ${
                              i <= currentStep ? 'bg-primary text-white scale-110 shadow-primary/30' : 'bg-white text-stone-200 border-2 border-stone-100'
                            }`}>
                              <span className="material-symbols-outlined text-xl">{step.icon}</span>
                            </div>
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${i <= currentStep ? 'text-surface-on' : 'text-stone-300'}`}>
                                {step.label}
                              </p>
                              {i === currentStep && (
                                <p className="text-[9px] text-primary font-bold mt-1 animate-pulse italic">Current Status</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-stone-50 rounded-3xl space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">Shipping Details</h4>
                        <div className="space-y-2">
                          <p className="text-sm text-surface-on/60 leading-relaxed">
                            {order.shipping_address?.address}, {order.shipping_address?.city}<br />
                            {order.shipping_address?.state} - {order.shipping_address?.postalCode}
                          </p>
                        </div>
                      </div>
                      
                      {order.tracking_number && (
                        <div className="p-8 border border-primary/10 rounded-3xl space-y-4 bg-primary/[0.02]">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Live Tracking</h4>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Carrier</p>
                            <p className="text-sm font-semibold">{order.delivery_method}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Tracking ID</p>
                            <p className="text-sm font-semibold text-primary">{order.tracking_number}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-stone-400">
              Need assistance? <a href="/contact" className="text-primary font-bold hover:underline">Contact our Concierge</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackPage;
