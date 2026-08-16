import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 font-sans">
      <div className="space-y-6 max-w-md mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary bg-primary/5 px-4 py-1.5 rounded-full inline-block">
          404 Error
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-light text-surface-on tracking-tight leading-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-surface-on-variant font-light leading-relaxed">
          The sanctuary page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
