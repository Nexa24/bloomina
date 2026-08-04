"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import { supabase } from '../lib/supabase';

interface HeroSlide {
    id: string;
    image_url: string;
    order_index: number;
}

const DEFAULT_SLIDES: HeroSlide[] = [
    { id: 'default-1', image_url: '/our_story.png', order_index: 0 },
    { id: 'default-2', image_url: '/european_lace.png', order_index: 1 },
    { id: 'default-3', image_url: '/micro_modal.png', order_index: 2 },
];

const HeroSlideshow = () => {
    const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
    const [failedSlideIds, setFailedSlideIds] = useState<Record<string, boolean>>({});
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data, error } = await supabase
                    .from('hero_slides')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (error) throw error;
                if (data && data.length > 0) {
                    setSlides(data);
                }
            } catch (err) {
                console.error("Error fetching hero slides:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    const next = useCallback(() => {
        if (slides.length === 0) return;
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(next, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, [next, slides.length]);

    if (loading && slides.length === 0) {
        return (
            <div className="absolute inset-0 -z-20 bg-slate-100 animate-pulse" />
        );
    }

    return (
        <div className="absolute inset-0 -z-20">
            {slides.map((slide, idx) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={failedSlideIds[slide.id] ? DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].image_url : slide.image_url}
                        alt={`Bloomina Hero ${idx + 1}`}
                        fill
                        className="object-cover brightness-[0.85]"
                        priority={idx === 0}
                        onError={() => setFailedSlideIds(prev => ({ ...prev, [slide.id]: true }))}
                    />
                </div>
            ))}
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Slide Indicators */}
            {slides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1 rounded-full transition-all duration-500 ${
                                idx === current ? 'w-8 bg-primary' : 'w-2 bg-white/40'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSlideshow;
