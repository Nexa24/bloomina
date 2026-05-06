"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24">
      <main className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Header & Contact Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-light text-surface-on tracking-tight leading-tight">
                Connect with <br /> the Collective
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">Our door is always open</p>
            </div>

            <div className="space-y-10">
              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-stone-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Ethereal Inquiries</h4>
                  <p className="text-lg font-display text-surface-on">sanctuary@bloomina.in</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-stone-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Our Sanctuary</h4>
                  <p className="text-lg font-display text-surface-on">
                    Design Atelier, 4th Floor <br />
                    Bandra West, Mumbai 400050
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-stone-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Atelier Hours</h4>
                  <p className="text-lg font-display text-surface-on">Mon — Fri, 10am — 7pm IST</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 flex gap-4">
              {['Instagram', 'Pinterest', 'LinkedIn'].map((social) => (
                <Link key={social} href="#" className="px-5 py-3 rounded-full border border-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:border-primary hover:text-primary transition-all">
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(241,145,161,0.1)] border border-stone-50 relative overflow-hidden">
              
              {isSubmitted ? (
                <div className="py-20 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8">
                    <span className="material-symbols-outlined text-3xl">check</span>
                  </div>
                  <h3 className="text-3xl font-display font-light text-surface-on mb-4">Message Received</h3>
                  <p className="text-sm text-surface-on-variant max-w-xs mx-auto leading-relaxed">
                    Thank you for reaching out. We will weave our response and get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-10 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-display font-light text-surface-on mb-10">Send an Inquiry</h2>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Your Name</label>
                        <input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Elena Gilbert"
                          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="elena@mystic.com"
                          className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Subject</label>
                      <input 
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Collaboration, Order Query, or Feedback"
                        className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Message</label>
                      <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={5}
                        placeholder="Tell us what's on your mind..."
                        className="w-full bg-stone-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-300 resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-6 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <span className="material-symbols-outlined text-sm">send</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
