"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Verify that the user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Your reset session has expired or is invalid. Please request a new link.");
      }
    };
    checkSession();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/login?message=reset-success');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col antialiased">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-40 pb-24 px-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-[0_40px_100px_-20px_rgba(241,145,161,0.12)] border border-stone-100">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4">Security Protocol</p>
            <h1 className="text-4xl font-display font-light text-surface-on tracking-tight">Create New Password</h1>
            <p className="text-[11px] text-stone-400 font-light mt-3">
              Enter your new credentials below to restore secure account access.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-500 text-xs rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">error</span>
              <p className="flex-1 leading-normal">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4 py-6 animate-in fade-in duration-700">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl">check</span>
              </div>
              <p className="text-sm font-semibold text-surface-on">Account Secured</p>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Redirecting you to login...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all text-lg font-display"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-surface-on/40 px-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-stone-100 py-3 px-1 focus:ring-0 focus:border-primary transition-all text-lg font-display"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Updating credentials...' : 'Set Password'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
