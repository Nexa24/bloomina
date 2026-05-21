'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  duration?: number; // in ms
  delay?: number; // in ms
  threshold?: number;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  variant = 'slide-up',
  duration = 800,
  delay = 0,
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -80px 0px', // Trigger slightly before the element is fully in view
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, once]);

  // Variant classes mapping
  const getVariantStyles = () => {
    switch (variant) {
      case 'fade':
        return {
          initial: 'opacity-0',
          revealed: 'opacity-100',
        };
      case 'slide-up':
        return {
          initial: 'opacity-0 translate-y-8',
          revealed: 'opacity-100 translate-y-0',
        };
      case 'slide-down':
        return {
          initial: 'opacity-0 -translate-y-8',
          revealed: 'opacity-100 translate-y-0',
        };
      case 'slide-left':
        return {
          initial: 'opacity-0 translate-x-8',
          revealed: 'opacity-100 translate-x-0',
        };
      case 'slide-right':
        return {
          initial: 'opacity-0 -translate-x-8',
          revealed: 'opacity-100 translate-x-0',
        };
      case 'scale':
        return {
          initial: 'opacity-0 scale-95',
          revealed: 'opacity-100 scale-100',
        };
      default:
        return {
          initial: 'opacity-0 translate-y-8',
          revealed: 'opacity-100 translate-y-0',
        };
    }
  };

  const styles = getVariantStyles();
  
  const transitionStyle = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Premium ease-out-expo
  };

  return (
    <div
      ref={ref}
      style={transitionStyle}
      className={`transition-all will-change-[transform,opacity] ${
        isRevealed ? styles.revealed : styles.initial
      } ${className}`}
    >
      {children}
    </div>
  );
}
