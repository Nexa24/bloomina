"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface SizeGuide {
  id: string;
  name: string;
  description: string;
  chart_data: Array<Record<string, string>>;
}

export default function SizeGuidePage() {
  const [sizeGuides, setSizeGuides] = useState<SizeGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  useEffect(() => {
    async function fetchGuides() {
      try {
        const { data, error } = await supabase
          .from('size_guides')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setSizeGuides(data || []);
      } catch (err) {
        console.error('Error fetching size guides:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  // Helper to dynamically convert inches to cm in size ranges
  const formatCellValue = (val: string, keyName: string) => {
    if (!val) return '-';
    if (unit === 'in') return val;

    // Only convert if the column key contains indicators of measurement (like Chest, Waist, Hips, Bust, Underbust, etc.)
    const isMeasurementColumn = /chest|waist|hips|bust|underbust|band|cup|measurement|size/i.test(keyName);
    if (!isMeasurementColumn) return val;

    // Convert number sequences (e.g., "34-36" to "86-91", "32" to "81")
    return val.replace(/(\d+(\.\d+)?)/g, (match) => {
      const inches = parseFloat(match);
      const cm = Math.round(inches * 2.54);
      return String(cm);
    });
  };

  // Helper to format table headers
  const formatHeader = (header: string) => {
    if (unit === 'cm') {
      return header.replace(/\(in\)/gi, '(cm)').replace(/inches/gi, 'cm');
    }
    return header;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background antialiased pt-32 pb-24 flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-primary font-display text-lg animate-pulse">Loading Bloomina Fit Atelier...</p>
        </div>
      </div>
    );
  }

  const activeGuide = sizeGuides[activeTabIdx] || null;

  return (
    <div className="min-h-screen bg-background antialiased pt-32 pb-24 bg-white">
      <main className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-light text-surface-on tracking-tight leading-tight">
            Bloomina Fit Atelier
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-6">
            Find Your Perfect, Weightless Fit
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300 mt-2">
            Dynamic Precision Charts
          </p>
        </div>

        {sizeGuides.length === 0 ? (
          <div className="text-center py-20 bg-stone-50/50 rounded-[3rem] border border-stone-100 max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-5xl text-stone-300 mb-4">straighten</span>
            <h3 className="text-2xl font-display font-light text-surface-on mb-2">No size guides published yet</h3>
            <p className="text-sm text-surface-on-variant font-light">
              Please check back later or set up size guides inside the Admin Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Selector & Details */}
            <div className="lg:col-span-4 space-y-8">
              {/* Category selector */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100/80 petal-shadow space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  Select Garment Style
                </h3>
                <div className="flex flex-col gap-2.5">
                  {sizeGuides.map((guide, idx) => (
                    <button
                      key={guide.id}
                      onClick={() => setActiveTabIdx(idx)}
                      className={`w-full text-left px-6 py-4.5 rounded-2xl transition-all duration-300 flex items-center justify-between group ${
                        activeTabIdx === idx
                          ? 'bg-primary text-white shadow-xl shadow-primary/10'
                          : 'bg-stone-50/60 hover:bg-stone-100/50 text-surface-on border border-transparent'
                      }`}
                    >
                      <span className="font-display text-sm font-medium tracking-wide">
                        {guide.name.toUpperCase().startsWith("SIZE GUIDE FOR") ? guide.name : (guide.name.toLowerCase().includes("bra") ? "SIZE GUIDE FOR BRAS" : guide.name.toLowerCase().includes("panty") ? "SIZE GUIDE FOR PANTIES" : `SIZE GUIDE FOR ${guide.name.toUpperCase()}`)}
                      </span>
                      <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${
                        activeTabIdx === idx ? 'translate-x-1 text-white' : 'text-stone-300 group-hover:translate-x-1 group-hover:text-primary'
                      }`}>
                        east
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Measurement Unit Toggler */}
              <div className="bg-stone-50/40 p-6 rounded-3xl border border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-surface-on">Preferred Metric</h4>
                  <p className="text-[10px] text-stone-400 font-light mt-0.5">Toggle between sizing systems</p>
                </div>
                <div className="bg-white/80 p-1 rounded-full border border-stone-200/60 flex relative shadow-inner">
                  <button
                    onClick={() => setUnit('in')}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      unit === 'in' ? 'bg-primary text-white shadow-md' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      unit === 'cm' ? 'bg-primary text-white shadow-md' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    Cm
                  </button>
                </div>
              </div>

              {/* Description Card */}
              {activeGuide && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100/80 petal-shadow space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Garment Overview</h4>
                  <h3 className="text-2xl font-display font-light text-surface-on">
                    {activeGuide.name.toUpperCase().startsWith("SIZE GUIDE FOR") ? activeGuide.name : (activeGuide.name.toLowerCase().includes("bra") ? "SIZE GUIDE FOR BRAS" : activeGuide.name.toLowerCase().includes("panty") ? "SIZE GUIDE FOR PANTIES" : `SIZE GUIDE FOR ${activeGuide.name.toUpperCase()}`)}
                  </h3>
                  <p className="text-sm text-surface-on-variant font-light leading-relaxed">
                    {activeGuide.description || 'Precision size mapping curated by our atelier to deliver structured, weightless luxury.'}
                  </p>
                  <div className="h-px w-8 bg-primary/10 mt-6" />
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2">
                    <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                    Atelier Handcrafted Sizing
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Size Table & measurement instructions */}
            <div className="lg:col-span-8 space-y-8">
              {activeGuide && (
                <>
                  {/* Grid Table */}
                  <div className="bg-white p-8 rounded-[3rem] border border-stone-100/80 petal-shadow space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-stone-50">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-400">
                        Interactive Fit Table
                      </h3>
                      <span className="text-[10px] font-bold bg-primary/5 text-primary px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Active Unit: {unit === 'in' ? 'Inches' : 'Centimeters'}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-stone-50 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-50/50">
                            {activeGuide.chart_data?.[0] && Object.keys(activeGuide.chart_data[0]).map((key) => (
                              <th
                                key={key}
                                className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 border-b border-stone-100"
                              >
                                {formatHeader(key)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const headers = activeGuide.chart_data?.[0] ? Object.keys(activeGuide.chart_data[0]) : [];
                            return activeGuide.chart_data?.map((row, idx) => (
                              <tr key={idx} className="hover:bg-stone-50/30 transition-colors">
                                {headers.map((key, vidx) => (
                                  <td
                                    key={key}
                                    className={`px-6 py-5 text-sm font-light text-surface-on border-b border-stone-50/50 ${
                                      vidx === 0 ? 'font-bold text-primary/80' : ''
                                    }`}
                                  >
                                    {formatCellValue(row[key], key)}
                                  </td>
                                ))}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Measuring Guide Section */}
                  <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100/80 petal-shadow space-y-12">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">Measurement Guide</h4>
                      <h3 className="text-3xl font-display font-light text-surface-on">How to Take Your Measurements</h3>
                      <p className="text-sm text-surface-on-variant font-light mt-2">
                        For the most accurate fit, take your measurements wearing lightweight innerwear or a non-padded bra.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                      <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-stone-100 bg-stone-50">
                        <Image
                          src="/how-to-measure.png"
                          alt="Bloomina Measurement Guide Silhouette"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          priority
                        />
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">1</span>
                            <h5 className="text-sm font-bold uppercase tracking-wider text-surface-on">Bust / Chest</h5>
                          </div>
                          <p className="text-xs text-surface-on-variant font-light leading-relaxed pl-9">
                            Measure around the fullest part of your bust, keeping the measuring tape parallel to the floor. Do not pull too tight.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">2</span>
                            <h5 className="text-sm font-bold uppercase tracking-wider text-surface-on">Underbust (Bra Band)</h5>
                          </div>
                          <p className="text-xs text-surface-on-variant font-light leading-relaxed pl-9">
                            Measure snug around your ribcage directly beneath your bust, where your bra band normally sits.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">3</span>
                            <h5 className="text-sm font-bold uppercase tracking-wider text-surface-on">Waist</h5>
                          </div>
                          <p className="text-xs text-surface-on-variant font-light leading-relaxed pl-9">
                            Measure around your natural waistline, which is the narrowest part of your torso (usually just above your belly button).
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">4</span>
                            <h5 className="text-sm font-bold uppercase tracking-wider text-surface-on">Hips</h5>
                          </div>
                          <p className="text-xs text-surface-on-variant font-light leading-relaxed pl-9">
                            Stand with your heels together and measure around the fullest part of your hips and seat.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4 items-start">
                      <span className="material-symbols-outlined text-primary mt-0.5">help_outline</span>
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">Fit Atelier Tip</p>
                        <p className="text-xs text-primary/80 leading-relaxed font-light">
                          If your measurements fall between two sizes, we suggest choosing the larger size for a relaxed, weightless hold, or the smaller size for a sculpted, firm lift.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
