"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Suspense } from 'react';
import { checkUserExists } from '@/app/actions/auth';

const LoginContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const { signInWithGoogle, user: authUser } = useAuth();
  
  const [supabase] = useState(() => {
    try {
      const { createClient } = require('@/utils/supabase/client');
      return createClient();
    } catch (e) {
      return null;
    }
  });

  // Redirect if already logged in
  useEffect(() => {
    if (authUser) {
      router.push(next);
    }
  }, [authUser, router, next]);

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
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle(next);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Check if user exists in database first
      const checkResult = await checkUserExists(email);
      if (!checkResult.success) {
        throw new Error(checkResult.error || 'Failed to verify account.');
      }
      if (!checkResult.exists) {
        setError('No account found with this email address.');
        setIsLoading(false);
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/update-password`,
      });
      if (resetError) throw resetError;
      
      // Flag that a password reset was requested on this device
      localStorage.setItem('bloomina_reset_password_requested', 'true');
      
      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
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
              <h1 className="text-4xl font-display font-light text-surface-on tracking-tight">
                {isForgotPassword ? 'Reset Access' : 'Welcome Back'}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-4">
                {isForgotPassword ? 'Recovery link will be sent' : 'Enter your sanctuary'}
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {resetEmailSent ? (
              <div className="space-y-8 animate-in fade-in duration-700">
                <div className="p-8 rounded-3xl bg-stone-50 border border-stone-100 text-center">
                  <span className="material-symbols-outlined text-4xl text-primary/40 mb-4">mail</span>
                  <p className="text-sm font-light text-surface-on/60 leading-relaxed">
                    A secure recovery link has been dispatched to <br />
                    <span className="font-bold text-surface-on">{email}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetEmailSent(false);
                  }}
                  className="w-full py-5 rounded-full border border-stone-100 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-stone-50 transition-all"
                >
                  Return to Login
                </button>
              </div>
            ) : isForgotPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
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
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Recovery Link'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-surface-on/40 hover:text-primary transition-colors"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-8 animate-in slide-in-from-left-4 duration-500">
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
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary"
                    >
                      Forgot?
                    </button>
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
                  onClick={handleGoogleLogin}
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
            )}

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

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
