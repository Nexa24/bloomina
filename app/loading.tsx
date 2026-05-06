import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative">
        {/* Elegant Pulsing Petal */}
        <div className="w-24 h-24 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] border-2 border-primary/20 animate-[spin_8s_linear_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
        </div>
      </div>
      
      <div className="mt-12 text-center space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40 animate-pulse">
          Entering the Sanctuary
        </p>
        <div className="h-px w-12 bg-primary/10 mx-auto" />
      </div>
      
      {/* Subtle background text */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <p className="text-[8px] font-bold uppercase tracking-[1em] text-surface-on/5">Bloomina</p>
      </div>
    </div>
  );
}
