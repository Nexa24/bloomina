"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/account');
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/account');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">

      <main className="flex-1 flex items-center justify-center pt-24 px-6 pb-12">
        <div className="w-full max-w-[1100px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(241,145,161,0.15)] flex flex-col md:flex-row min-h-[650px] border border-stone-50">

          {/* Left: Editorial Image */}
          <div className="hidden md:block w-1/2 relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAtTWwa3VJHNdsEG9oh5tTD15FG99afrssGfm94XV_lmqu2lz5xhHh8baJqMbO6_pBR9T__va2ZSnk8byx9iPNLAJ9oyVz-VTDPa7tn7X21Jll0_DYfCidLpHlP2d1IMDxHXZ_XKIq_WtWfdKF8vICuD8HyOxPLkk52M5BQ8wF2vR4irro2gTc_5lJaVZh_Ht3LXdc-p4TNf_K2ayzw46-pnv6gJk8TaqdWKSsROYZBx5PwA9kr-HpDF055nX5Y9k04Rbgy1h19mY"
              alt="Bloomina Editorial"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
            <div className="absolute bottom-12 left-12 right-12">
              <p className="text-white text-3xl font-display font-light leading-tight">
                "True elegance begins with the comfort of being oneself."
              </p>
              <div className="h-px w-12 bg-white/40 my-6" />
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">The Bloomina Philosophy</p>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
            <div className="mb-12">
              <h1 className="text-4xl font-display font-light text-surface-on tracking-tight">Welcome Back</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-4">Enter your sanctuary</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2 relative group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="evelyn@bloomina.in"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all placeholder:text-stone-200"
                  required
                />
              </div>

              <div className="space-y-2 relative group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40">Password</label>
                  <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary">Forgot?</Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40">
                New to the Collective? <br />
                <Link href="/signup" className="text-primary hover:underline underline-offset-4 mt-2 inline-block decoration-1">Join the Sanctuary</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-surface-on/20">Bloomina Collective — Secure Encryption Enabled</p>
      </footer>
    </div>
  );
};

export default LoginPage;
