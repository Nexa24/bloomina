"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize Supabase client
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use Supabase Auth for signup
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          }
        }
      });

      if (authError) {
        setError(authError.message || 'Failed to create account.');
      } else {
        // Success: Redirect directly to account/dashboard instead of login page
        router.push('/account');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">

      <main className="flex-1 flex items-center justify-center pt-24 px-6 pb-12">
        <div className="w-full max-w-[1100px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(241,145,161,0.15)] flex flex-col md:flex-row-reverse min-h-[750px] border border-stone-50">

          {/* Right (Visual): Editorial Image */}
          <div className="hidden md:block w-1/2 relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvfO2NIxaIgCESyQcNtM9KnBrKiNYbF7ncAfgP-RUU4bZRIUlzs3DmbF5JT_vhDyeU0jBWVop-pmwcivPOHz61VEjqkU1G0R6tzQuvJ9K6bmIsl6QfzQQttZo3o9G2szNxydX8C-REZATP4egaVlqSgtg5twEbhRn_0Y0_2vpFAdYbocuk-_avrPvSnzH5Bjpa5KLyLZsZkT7pKTZSZJMu4jOhIxbTNxwWYOVZ0D0poUYyI1UdojIvIXLyptrhEHgnKsUrJQeD9WY"
              alt="Bloomina Comfort"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />
            <div className="absolute top-12 left-12 right-12 text-right">
              <p className="text-white text-3xl font-display font-light leading-tight">
                "Start your journey towards <br /> effortless elegance."
              </p>
              <div className="h-px w-12 bg-white/40 my-6 ml-auto" />
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">The Bloomina Collective</p>
            </div>
          </div>

          {/* Left: Signup Form */}
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <div className="mb-12">
              <h1 className="text-4xl font-display font-light text-surface-on tracking-tight">Join the Collective</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-4">Create your personalized sanctuary</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2 relative group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Evelyn Sterling"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200"
                  required
                />
              </div>

              <div className="space-y-2 relative group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200"
                />
              </div>

              <div className="space-y-2 relative group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="evelyn@bloomina.in"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200"
                  required
                />
              </div>

              <div className="space-y-2 relative group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200"
                  required
                />
              </div>

              <div className="space-y-2 relative group pb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40">
                Already have an account? <br />
                <Link href="/login" className="text-primary hover:underline underline-offset-4 mt-2 inline-block decoration-1">Sign In to Sanctuary</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-surface-on/20">Bloomina Collective — 256-bit Secure Encryption</p>
      </footer>
    </div>
  );
};

export default SignupPage;
