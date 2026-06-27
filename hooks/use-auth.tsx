"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: (next?: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchUser = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      setUser(supabaseUser);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Intercept code query parameter (fallback when Supabase ignores redirectTo)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (code) {
        const wasReset = localStorage.getItem('bloomina_reset_password_requested') === 'true';
        localStorage.removeItem('bloomina_reset_password_requested');
        const nextPath = wasReset ? '/account/update-password' : '/account';
        
        // Redirect to the server callback
        window.location.href = `/auth/callback?code=${code}&next=${encodeURIComponent(nextPath)}`;
        return;
      }
    }

    // Check user on mount
    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (next?: string) => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Google Sign In Error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser: fetchUser, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
