'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in ms
  duration?: number; // duration in ms
  tiltStrength?: number; // angle of 3D tilt
}

export default function ScrollReveal3D({
  children,
  className = '',
  delay = 0,
  duration = 800,
  tiltStrength = 12,
}: ScrollReveal3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: `perspective(1200px) rotateX(${tiltStrength}deg) translateY(30px) scale(0.95)`,
    willChange: 'transform, opacity',
  });

  useEffect(() => {
    let frameId: number;
    const currentRef = containerRef.current;

    const handleScroll = () => {
      if (!currentRef) return;
      const rect = currentRef.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Element is way above the screen or way below the screen
      if (rect.bottom < -100 || rect.top > viewportHeight + 100) {
        return;
      }

      // Entrance progress (0 = just entering at bottom of viewport, 1 = fully in view)
      const startRevealAt = viewportHeight;
      const fullyRevealAt = viewportHeight * 0.2;
      
      let progress = 1;
      if (rect.top > fullyRevealAt) {
        progress = 1 - (rect.top - fullyRevealAt) / (startRevealAt - fullyRevealAt);
      }
      progress = Math.max(0, Math.min(1, progress));

      // Exit progress (1 = top edge is at 0, 0 = bottom edge has exited top of screen)
      let exitProgress = 1;
      if (rect.top < 0) {
        const height = rect.height || 500;
        exitProgress = 1 - Math.abs(rect.top) / height;
      }
      exitProgress = Math.max(0, Math.min(1, exitProgress));

      // Calculate 3D values
      const rotateX = (1 - progress) * tiltStrength - (1 - exitProgress) * 6;
      const scale = 0.95 + progress * 0.05 - (1 - exitProgress) * 0.03;
      const translateY = (1 - progress) * 30;
      const opacity = progress; // keep visible as it scrolls off, just slightly fade/scale

      setStyle({
        opacity,
        transform: `perspective(1200px) rotateX(${rotateX}deg) translateY(${translateY}px) scale(${scale})`,
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial run
    handleScroll();

    // Trigger again after a small timeout to make sure initial layout calculation is accurate
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, [delay, duration, tiltStrength]);

  return (
    <div
      ref={containerRef}
      style={style}
      className={`transform-gpu ${className}`}
    >
      {children}
    </div>
  );
}
