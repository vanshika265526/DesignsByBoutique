"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Auto-rotating hero slides — each editorial image in /public/images/hero/ has
// its own caption. They advance every SLIDE_INTERVAL_MS.
const SLIDE_INTERVAL_MS = 5000;

const HERO_SLIDES = [
    {
        src: "/images/hero/slide-1.png",
        mobileSrc: "/images/hero/mobile-slide-1.jpeg",
        text: "Handcrafted Suits, Anarkalis, Bridal Lehengas, Haldi & Mehendi outfits.",
    },
    {
        src: "/images/hero/slide-2.png",
        mobileSrc: "/images/hero/mobile-slide-2.png",
        text: "From her first twirl to little celebrations.",
    },
    {
        src: "/images/hero/slide-3.png",
        mobileSrc: "/images/hero/mobile-slide-3.png",
        text: "Effortless Suits, Contemporary Anarkalis, Occasion Wear.",
    },
    {
        src: "/images/hero/slide-4.png",
        mobileSrc: "/images/hero/mobile-slide-4.png",
        text: "Bridal Lehengas, Bespoke Anarkalis, Haldi & Mehendi",
    },
    {
        src: "/images/hero/slide-5.png",
        mobileSrc: "/images/hero/mobile-slide-5.jpeg",
        text: "Maternity Gowns, Elegant Nursing Wear, Mother-Daughter.",
    },
    {
        src: "/images/hero/slide-6.png",
        mobileSrc: "/images/hero/mobile-slide-6.png",
        text: "Beautiful mother-and-child ensembles and delicate baby wear.",
    },
];

export default function Hero() {
    // Drop any slide whose file fails to load, so a not-yet-added image never
    // shows as a blank/broken frame in the rotation.
    const [broken, setBroken] = useState({});
    // Only the desktop image decides whether a slide exists. A missing mobile
    // variant just falls back to the desktop crop rather than dropping the slide
    // from the rotation entirely.
    const slides = HERO_SLIDES.filter((s) => !broken[s.src]);

    const [active, setActive] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const id = setInterval(() => {
            setActive((i) => (i + 1) % slides.length);
        }, SLIDE_INTERVAL_MS);
        return () => clearInterval(id);
    }, [slides.length]);

    // Keep the active index valid if the list shrinks (a slide failed to load).
    useEffect(() => {
        if (active >= slides.length) setActive(0);
    }, [slides.length, active]);

    return (
        <section className="w-full bg-boutique-bg">
            {/* Full-bleed editorial hero */}
            <div className="relative w-full h-[78vh] min-h-[520px] md:h-[86vh] overflow-hidden bg-boutique-charcoal">
                {slides.map((slide, i) => (
                    <div
                        key={slide.src}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        {slide.mobileSrc ? (
                            <>
                                {/* Desktop image */}
                                <Image
                                    src={slide.src}
                                    alt="Designs by Nisha — Luxury Indian bridal & women's couture, New Delhi"
                                    fill
                                    priority={i === 0}
                                    sizes="100vw"
                                    onError={() => setBroken((b) => ({ ...b, [slide.src]: true }))}
                                    className="hidden md:block object-cover object-center"
                                />
                                {/* Mobile image — falls back to the desktop crop if the
                                    portrait variant has not been added yet. */}
                                <Image
                                    src={broken[slide.mobileSrc] ? slide.src : slide.mobileSrc}
                                    alt="Designs by Nisha — Luxury Indian bridal & women's couture, New Delhi"
                                    fill
                                    priority={i === 0}
                                    sizes="100vw"
                                    onError={() => setBroken((b) => ({ ...b, [slide.mobileSrc]: true }))}
                                    className="block md:hidden object-cover object-center"
                                />
                            </>
                        ) : (
                            <Image
                                src={slide.src}
                                alt="Designs by Nisha — Luxury Indian bridal & women's couture, New Delhi"
                                fill
                                priority={i === 0}
                                sizes="100vw"
                                onError={() => setBroken((b) => ({ ...b, [slide.src]: true }))}
                                className="object-cover object-center"
                            />
                        )}
                    </div>
                ))}

                {/* Legibility overlay — stronger at bottom-left for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-boutique-charcoal/75 via-boutique-charcoal/20 to-transparent" />

                {/* Bottom-left content */}
                <div className="relative z-10 h-full flex flex-col items-start justify-end text-left px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14 max-w-2xl">
                    <h1
                        lang="hi"
                        className="font-devanagari whitespace-nowrap text-[clamp(1.5rem,5.2vw,3.75rem)] text-white"
                    >
                        हर सफ़र खूबसूरती के साथ
                    </h1>
                    <p
                        key={`text-${active}`}
                        className="mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-white/85 font-light"
                    >
                        {slides[active]?.text}
                    </p>
                </div>

                {/* Slide indicators */}
                {slides.length > 1 && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                aria-label={`Show slide ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

