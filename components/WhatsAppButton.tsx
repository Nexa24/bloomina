"use client";

import React, { useState, useEffect } from 'react';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button after 1.5 seconds delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Show tooltip pulse 4 seconds after that, then hide it after 5 seconds
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
      
      const hideTooltipTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(hideTooltipTimer);
    }, 5500);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 font-sans pointer-events-none">
      {/* Tooltip */}
      <div 
        className={`bg-white text-stone-800 text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-stone-100/80 transition-all duration-500 ease-out transform origin-right ${
          showTooltip 
            ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
            : 'opacity-0 translate-x-4 scale-90 pointer-events-none'
        }`}
      >
        <div className="relative font-medium flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Chat with us</span>
          <span className="text-stone-500 text-[11px]">How can we help you?</span>
          {/* Arrow */}
          <div className="absolute right-[-21px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-white" />
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919567797776?text=Hi%20Bloomina%2C%20I%27d%20like%20to%20know%20more%20about%20your%20products%21"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:bg-[#22c05b] transition-colors duration-200 pointer-events-auto"
      >
        {/* Icon */}
        <svg 
          className="w-7 h-7 fill-current" 
          viewBox="0 0 448 512"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
