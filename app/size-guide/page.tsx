"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'panties' | 'teenage_bras' | 'standard_bras'>('panties');

  const pantiesData = [
    { size: 'XS', halfWaist: '27.0', hips: '70 - 75' },
    { size: 'S', halfWaist: '29.0', hips: '80 - 85' },
    { size: 'M', halfWaist: '31.5', hips: '90 - 95' },
    { size: 'L', halfWaist: '34.0', hips: '100 - 105' },
    { size: 'XL', halfWaist: '36.5', hips: '110 - 115' },
    { size: '2XL', halfWaist: '39.0', hips: '120 - 125' },
  ];

  const teenageBraData = [
    { size: 'XS', overbust: '54 - 56', underbust: '52 - 54' },
    { size: 'S', overbust: '58 - 60', underbust: '56 - 58' },
    { size: 'M', overbust: '62 - 64', underbust: '60 - 62' },
  ];

  const standardBraData = [
    { size: '32B', overbust: '80 - 82', underbust: '68 - 72' },
    { size: '34B', overbust: '85 - 87', underbust: '73 - 77' },
    { size: '36B', overbust: '90 - 92', underbust: '78 - 82' },
    { size: '38B', overbust: '95 - 97', underbust: '83 - 87' },
    { size: '40B', overbust: '100 - 102', underbust: '88 - 92' },
  ];

  return (
    <div className="min-h-screen bg-white antialiased pt-28 pb-24 font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="flex justify-center mb-2">
            <Image 
              src="/logo/BLO_TRNSP_PINK_LRG.png" 
              alt="Bloomina Logo" 
              width={160} 
              height={44} 
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <p className="text-xs italic font-serif text-primary">Feel Every Moments</p>
          <div className="w-12 h-px bg-primary/20 mx-auto my-4" />
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider text-surface-on">
            SIZE GUIDE
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            All measurements are in cm
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-10 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('panties')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'panties'
                ? 'bg-primary text-white shadow-md'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Mid Hipster Panties
          </button>
          <button
            onClick={() => setActiveTab('teenage_bras')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'teenage_bras'
                ? 'bg-primary text-white shadow-md'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Teenage Bra
          </button>
          <button
            onClick={() => setActiveTab('standard_bras')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'standard_bras'
                ? 'bg-primary text-white shadow-md'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Standard Bra
          </button>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
          
          {/* Panties Table */}
          {(activeTab === 'panties' || activeTab === 'teenage_bras') && (
            <div className="bg-pink-50/40 p-6 rounded-3xl border border-pink-200/60 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary text-center">
                MID HIPSTER PANTIES
              </h2>
              <div className="overflow-hidden rounded-2xl border border-pink-200/80 bg-white">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-pink-100/70 text-primary text-xs font-bold uppercase tracking-wider border-b border-pink-200">
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Half Waist (cm)</th>
                      <th className="py-3 px-4">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 text-xs font-medium text-stone-700">
                    {pantiesData.map((row) => (
                      <tr key={row.size} className="hover:bg-pink-50/50 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-stone-900">{row.size}</td>
                        <td className="py-2.5 px-4">{row.halfWaist}</td>
                        <td className="py-2.5 px-4">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center">
                <span className="inline-block bg-pink-100/80 text-primary text-[11px] font-semibold px-4 py-1 rounded-full">
                  Tolerance ±2 cm
                </span>
              </div>
            </div>
          )}

          {/* Teenage Bra Table */}
          {(activeTab === 'teenage_bras' || activeTab === 'panties') && (
            <div className="bg-pink-50/40 p-6 rounded-3xl border border-pink-200/60 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary text-center">
                TEENAGE BRA MEASUREMENTS
              </h2>
              <div className="overflow-hidden rounded-2xl border border-pink-200/80 bg-white">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-pink-100/70 text-primary text-xs font-bold uppercase tracking-wider border-b border-pink-200">
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Overbust (cm)</th>
                      <th className="py-3 px-4">Underbust (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 text-xs font-medium text-stone-700">
                    {teenageBraData.map((row) => (
                      <tr key={row.size} className="hover:bg-pink-50/50 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-stone-900">{row.size}</td>
                        <td className="py-2.5 px-4">{row.overbust}</td>
                        <td className="py-2.5 px-4">{row.underbust}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center">
                <span className="inline-block bg-pink-100/80 text-primary text-[11px] font-semibold px-4 py-1 rounded-full">
                  Designed for Growing Comfort
                </span>
              </div>
            </div>
          )}

          {/* Standard Bra Table */}
          {activeTab === 'standard_bras' && (
            <div className="md:col-span-2 bg-pink-50/40 p-6 rounded-3xl border border-pink-200/60 shadow-sm space-y-4 max-w-xl mx-auto w-full">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary text-center">
                STANDARD BRA MEASUREMENTS
              </h2>
              <div className="overflow-hidden rounded-2xl border border-pink-200/80 bg-white">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-pink-100/70 text-primary text-xs font-bold uppercase tracking-wider border-b border-pink-200">
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Overbust (cm)</th>
                      <th className="py-3 px-4">Underbust (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100 text-xs font-medium text-stone-700">
                    {standardBraData.map((row) => (
                      <tr key={row.size} className="hover:bg-pink-50/50 transition-colors">
                        <td className="py-2.5 px-4 font-bold text-stone-900">{row.size}</td>
                        <td className="py-2.5 px-4">{row.overbust}</td>
                        <td className="py-2.5 px-4">{row.underbust}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* HOW TO MEASURE Section */}
        <div className="my-16 space-y-8">
          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pink-200" /></div>
            <span className="relative bg-white px-6 text-sm font-bold uppercase tracking-widest text-primary">
              HOW TO MEASURE
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Card 1: Half Waist */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 text-center space-y-3 flex flex-col justify-between">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-200">
                <Image
                  src="/how-to-measure_pantie.png"
                  alt="Half Waist Measurement"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">HALF WAIST</h3>
                <p className="text-[11px] text-stone-600 leading-snug font-light">
                  Measure the width of the waistband straight across from one side to the other (half waist).
                </p>
              </div>
            </div>

            {/* Card 2: Hips */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 text-center space-y-3 flex flex-col justify-between">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-200">
                <Image
                  src="/how-to-measure_pantie.png"
                  alt="Hips Measurement"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">HIPS</h3>
                <p className="text-[11px] text-stone-600 leading-snug font-light">
                  Measure around the widest part of your hips and buttocks.
                </p>
              </div>
            </div>

            {/* Card 3: Overbust */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 text-center space-y-3 flex flex-col justify-between">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-200">
                <Image
                  src="/how-to-measure_bra.png"
                  alt="Overbust Measurement"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">OVERBUST</h3>
                <p className="text-[11px] text-stone-600 leading-snug font-light">
                  Measure around the fullest part of your bust.
                </p>
              </div>
            </div>

            {/* Card 4: Underbust */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 text-center space-y-3 flex flex-col justify-between">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-200">
                <Image
                  src="/how-to-measure_bra.png"
                  alt="Underbust Measurement"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">UNDERBUST</h3>
                <p className="text-[11px] text-stone-600 leading-snug font-light">
                  Measure around your ribcage right under your bust.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* TIPS FOR ACCURATE MEASUREMENT */}
        <div className="bg-pink-50/50 p-6 md:p-8 rounded-3xl border border-pink-200/60 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary text-center">
            TIPS FOR ACCURATE MEASUREMENT
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
              <span className="material-symbols-outlined text-primary text-xl">straighten</span>
              <span className="text-xs text-stone-700 font-medium">Use a soft measuring tape.</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
              <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
              <span className="text-xs text-stone-700 font-medium">Wear a non-padded bra for bra measurements.</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
              <span className="material-symbols-outlined text-primary text-xl">accessibility_new</span>
              <span className="text-xs text-stone-700 font-medium">Stand straight and breathe normally.</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
              <span className="material-symbols-outlined text-primary text-xl">tune</span>
              <span className="text-xs text-stone-700 font-medium">Keep the tape snug, not tight.</span>
            </div>
          </div>

          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">favorite</span>
            <p className="text-xs text-primary font-medium">
              For best fit, if your measurement is between two sizes, we recommend choosing the larger size.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
