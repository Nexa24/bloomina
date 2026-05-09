"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/utils/supabase/client';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orderCount, setOrderCount] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const { user, isLoading, logout } = useAuth();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchAccountData();
    }
  }, [user, isLoading, router]);

  const fetchAccountData = async () => {
    if (!user) return;
    setIsDataLoading(true);
    try {
      // Fetch Orders count and data
      const { data: userOrders, count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setOrders(userOrders || []);
        setOrderCount(count || 0);
      }
      
      // Fetch profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setName(profile.full_name || '');
        setPhone(profile.phone || '');
        setAddress({
          line1: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.postal_code || '',
        });
      } else if (user.user_metadata) {
        // Fallback to metadata
        setName(user.user_metadata.name || '');
        setPhone(user.user_metadata.phone || '');
        if (user.user_metadata.address) {
          setAddress({
            line1: user.user_metadata.address.line1 || '',
            city: user.user_metadata.address.city || '',
            state: user.user_metadata.address.state || '',
            pincode: user.user_metadata.address.pincode || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching account data:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsDataLoading(true);
    
    try {
        // Update profiles table
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: name,
            phone,
            address: address.line1,
            city: address.city,
            state: address.state,
            postal_code: address.pincode,
            email: user.email,
            updated_at: new Date().toISOString()
        });

        if (profileError) throw profileError;

        // Also update auth metadata for legacy support
        const { error: authError } = await supabase.auth.updateUser({
            data: { 
                name, 
                phone,
                address
            }
        });

        if (authError) throw authError;

        alert('Profile updated successfully!');
    } catch (error: any) {
        alert('Error updating profile: ' + error.message);
    } finally {
        setIsDataLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'grid_view' },
    { id: 'orders', name: 'Orders', icon: 'shopping_bag' },
    { id: 'profile', name: 'Profile', icon: 'person' },
    { id: 'addresses', name: 'Addresses', icon: 'location_on' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col antialiased">
      <main className="flex-1 pt-32 pb-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-3">Welcome Back</p>
              <h1 className="text-5xl font-display font-light text-surface-on tracking-tight">
                {(user?.user_metadata?.name || user?.email)?.split(' ')[0] || 'Member'} <span className="text-primary/20 font-sans italic">.</span>
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 hover:text-red-400 transition-colors flex items-center gap-2 group"
            >
              Sign Out
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">logout</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3">
              <nav className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                      activeTab === tab.id 
                      ? 'bg-white text-primary shadow-[0_10px_30px_-5px_rgba(241,145,161,0.1)]' 
                      : 'text-surface-on/40 hover:bg-white/50 hover:text-surface-on'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${activeTab === tab.id ? 'text-primary' : 'text-surface-on/20'}`}>
                      {tab.icon}
                    </span>
                    <span className="text-sm font-semibold tracking-tight">{tab.name}</span>
                  </button>
                ))}
              </nav>

            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 min-h-[600px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-stone-100">
                
                {activeTab === 'overview' && (
                  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Total Orders', value: orderCount.toString().padStart(2, '0'), icon: 'shopping_bag' },
                        { label: 'Active Cart', value: '$0.00', icon: 'shopping_cart' },
                        { label: 'Wishlist Items', value: '00', icon: 'favorite' },
                      ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-stone-50 border border-stone-100 flex flex-col gap-4">
                          <span className="material-symbols-outlined text-primary/40">{stat.icon}</span>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 mb-1">{stat.label}</p>
                            <p className="text-2xl font-display text-surface-on">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-lg font-display mb-6">Recent Activity</h3>
                      <div className="space-y-4">
                        {orders.length > 0 ? (
                          orders.slice(0, 3).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-6 rounded-2xl border border-stone-50 hover:bg-stone-50/50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                  <span className="material-symbols-outlined">package_2</span>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">Order #{order.id.slice(0, 8).toUpperCase()} - {order.status}</p>
                                  <p className="text-[10px] text-surface-on/40 uppercase tracking-widest font-bold">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button className="text-[10px] font-bold uppercase tracking-widest text-primary">Details</button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-surface-on/40 italic">No recent activity found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-2xl font-display mb-8">Order History</h2>
                    <div className="space-y-6">
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <div key={order.id} className="p-8 rounded-3xl border border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-primary/5 transition-all">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-primary/40">
                                <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                              </div>
                              <div>
                                <h4 className="font-display text-xl mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</h4>
                                <div className="flex gap-4">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                  <p className={`text-[10px] font-bold uppercase tracking-widest ${order.status?.toLowerCase() === 'delivered' ? 'text-green-500' : 'text-primary'}`}>
                                    {order.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right hidden md:block">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 mb-1">Total Amount</p>
                                <p className="font-display text-lg">₹{(order.total || 0).toLocaleString()}</p>
                              </div>
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="px-8 py-4 bg-stone-50 text-surface-on rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 rounded-3xl border border-dashed border-stone-200 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 mb-6">
                            <span className="material-symbols-outlined text-3xl">inbox</span>
                          </div>
                          <p className="text-sm text-surface-on/40 font-medium italic">No orders found yet. <br /> Your Bloomina journey starts here.</p>
                          <Link href="/products" className="mt-8 px-8 py-4 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Start Shopping</Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedOrder(null)} />
                    <div className="relative bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-[3rem] p-10 md:p-16 shadow-2xl animate-in zoom-in-95 duration-300">
                      <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                      
                      <div className="mb-12">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">Order Details</p>
                        <h2 className="text-4xl font-display font-light text-surface-on">#{selectedOrder.id.slice(0, 8).toUpperCase()}</h2>
                      </div>

                      <div className="space-y-12">
                        {/* Status & Date */}
                        <div className="flex justify-between py-6 border-y border-stone-50">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Status</p>
                            <p className="text-sm font-semibold text-primary uppercase tracking-widest">{selectedOrder.status}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Ordered On</p>
                            <p className="text-sm font-semibold">{new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-6">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900">Purchased Selection</h3>
                          <div className="space-y-4">
                            {(selectedOrder.items || []).map((item: any, i: number) => (
                              <div key={i} className="flex gap-6 items-center">
                                <div className="w-16 h-20 bg-stone-50 rounded-xl overflow-hidden shrink-0">
                                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-surface-on">{item.title || item.name}</h4>
                                  <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Qty: {item.quantity} | {item.size || 'Standard'}</p>
                                </div>
                                <div className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals */}
                        <div className="bg-stone-50 p-8 rounded-3xl space-y-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-400 font-bold uppercase tracking-widest">Subtotal</span>
                            <span className="font-semibold">₹{(selectedOrder.subtotal || selectedOrder.total).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-400 font-bold uppercase tracking-widest">Shipping</span>
                            <span className="text-green-600 font-bold uppercase tracking-widest">Complimentary</span>
                          </div>
                          <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline">
                            <span className="text-sm font-black uppercase tracking-widest">Total Amount</span>
                            <span className="text-2xl font-display text-primary">₹{(selectedOrder.total || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Shipping Info */}
                        {selectedOrder.delivery_method && (
                          <div className="p-8 border border-stone-100 rounded-3xl">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4">Tracking Information</h3>
                            <div className="grid grid-cols-2 gap-8">
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Carrier</p>
                                <p className="text-sm font-semibold">{selectedOrder.delivery_method}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1">Tracking Number</p>
                                <p className="text-sm font-semibold text-primary">{selectedOrder.tracking_number}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-2xl font-display mb-8">Profile Details</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Full Name</label>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Email Address</label>
                        <input 
                          type="email" 
                          value={user?.email} 
                          disabled 
                          className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 opacity-50 cursor-not-allowed" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Phone Number</label>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 99999 99999"
                          className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200" 
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isDataLoading}
                        className="px-12 py-5 bg-surface-on text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors disabled:opacity-50"
                      >
                        {isDataLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-2xl font-display mb-8">Default Shipping Address</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Street Address</label>
                        <input 
                          type="text" 
                          value={address.line1}
                          onChange={(e) => setAddress({...address, line1: e.target.value})}
                          placeholder="Room/Flat, Building, Area"
                          className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">City</label>
                          <input 
                            type="text" 
                            value={address.city}
                            onChange={(e) => setAddress({...address, city: e.target.value})}
                            className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Pincode</label>
                          <input 
                            type="text" 
                            value={address.pincode}
                            onChange={(e) => setAddress({...address, pincode: e.target.value})}
                            className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">State</label>
                        <input 
                          type="text" 
                          value={address.state}
                          onChange={(e) => setAddress({...address, state: e.target.value})}
                          className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all" 
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={isDataLoading}
                        className="px-12 py-5 bg-surface-on text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary transition-colors disabled:opacity-50"
                      >
                        {isDataLoading ? 'Saving...' : 'Update Address'}
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-stone-100 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-surface-on/20">Bloomina Collective — Personal Sanctuary</p>
      </footer>
    </div>
  );
};

export default AccountPage;
