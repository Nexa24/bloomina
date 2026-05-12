"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const SignupContent = () => {
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
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const { signInWithGoogle } = useAuth();
  
  const [supabase] = useState(() => {
    try {
      const { createClient } = require('@/utils/supabase/client');
      return createClient();
    } catch (e) {
      return null;
    }
  });

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
        // Success: Redirect directly to 'next' destination
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
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

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-100"></div>
                </div>
                <div className="relative flex justify-center text-[8px] font-bold uppercase tracking-widest">
                  <span className="bg-white px-4 text-stone-300">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full bg-white border border-stone-200 text-surface-on py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-sm hover:bg-stone-50 hover:border-stone-300 active:scale-95 transition-all duration-300 flex items-center justify-center gap-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
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

import { Suspense } from 'react';

const SignupPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
};

export default SignupPage;
