"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from "next/image";

const images = [
    "/2ebec6153d7f836685b7397e8670d46f.jpg",
    "/d31c416a1c344d8d7a9bdadbada23d87.jpg",
    "/29b1b71c71dc10ed5838d1934fea3dc8.jpg"
];

const HeroSlideshow = () => {
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % images.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(next, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, [next]);

    return (
        <div className="absolute inset-0 -z-20">
            {images.map((img, idx) => (
                <div
                    key={img}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={img}
                        alt={`Bloomina Hero ${idx + 1}`}
                        fill
                        className="object-cover brightness-[0.85]"
                        priority={idx === 0}
                    />
                </div>
            ))}
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
            
            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
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
        </div>
    );
};

export default HeroSlideshow;
