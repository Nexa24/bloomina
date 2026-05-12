'use client';
import React from 'react';
import Image from 'next/image';
import { Settings, Lock, Heart } from 'lucide-react';

interface MaintenanceProps {
    message?: string;
}

const Maintenance: React.FC<MaintenanceProps> = ({ 
    message = "We are currently performing scheduled maintenance to enhance your experience. Please check back soon!" 
}) => {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8 animate-fade-in">
                {/* Logo Section */}
                <div className="flex justify-center mb-12">
                    <div className="relative w-64 h-24">
                        <Image 
                            src="/logo/BLO_TRNSP_PINK_LRG.png" 
                            alt="Bloomina" 
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100">
                    <Settings className="w-3 h-3 animate-spin" />
                    System Maintenance
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                        Refining the <span className="text-[#944555]">Sanctuary</span>.
                    </h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Decorative Element */}
                <div className="pt-12 flex flex-col items-center gap-4">
                    <div className="w-12 h-px bg-slate-200"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                        Feel Every Moment <Heart className="w-3 h-3 text-[#944555]" />
                    </p>
                </div>

                {/* Back Link (Optional) */}
                <div className="pt-8 text-xs text-slate-400">
                    Need urgent help? <a href="mailto:support@bloomina.com" className="text-indigo-600 font-bold underline">Contact Support</a>
                </div>
            </div>

            {/* Background Blur Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#944555] rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
};

export default Maintenance;
