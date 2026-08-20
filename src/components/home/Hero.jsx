"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Scissors, CalendarCheck } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";

const trustBadges = [
    { icon: Scissors, title: "Made Just for You", subtitle: "Stitched to your size and style" },
    { icon: CalendarCheck, title: "Visit or Book a Time", subtitle: "Open Mon–Sun, 10 AM – 9 PM" },
    { icon: WhatsAppIcon, title: "Ask on WhatsApp", subtitle: "Message us anytime — it's quick and easy" },
];

// Auto-rotating hero slides — each editorial image in /public/images/hero/ has
// its own caption. They advance every SLIDE_INTERVAL_MS.
const SLIDE_INTERVAL_MS = 5000;

const HERO_SLIDES = [
    {
        src: "/images/hero/slide-1.png",
        mobileSrc: "/images/hero/mobile-slide-1.png",
        text: "Handcrafted Suits, Anarkalis, Bridal Lehengas, Haldi & Mehendi outfits.",
    },
    {
        src: "/images/hero/slide-2.png",
        text: "From her first twirl to little celebrations.",
    },
    {
        src: "/images/hero/slide-3.png",
        text: "Effortless Suits, Contemporary Anarkalis, Occasion Wear.",
    },
    {
        src: "/images/hero/slide-4.png",
        text: "Bridal Lehengas, Bespoke Anarkalis, Haldi & Mehendi",
    },
    {
        src: "/images/hero/slide-5.png",
        text: "Maternity Gowns, Elegant Nursing Wear, Mother-Daughter.",
    },
    {
        src: "/images/hero/slide-6.png",
        text: "Beautiful mother-and-child ensembles and delicate baby wear.",
    },
];

export default function Hero() {
    // Drop any slide whose file fails to load, so a not-yet-added image never
    // shows as a blank/broken frame in the rotation.
    const [broken, setBroken] = useState({});
    const slides = HERO_SLIDES.filter((s) => !broken[s.src] && (!s.mobileSrc || !broken[s.mobileSrc]));

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
                                {/* Mobile image */}
                                <Image
                                    src={slide.mobileSrc}
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
                        className="font-devanagari text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white"
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

            {/* CTA bar — sits right below the hero image */}
            <div className="bg-boutique-bg-card border-b border-boutique-muted-border/60 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex flex-row items-center justify-center gap-0 divide-x divide-boutique-muted-border/60">
                    <Link
                        href="/collections"
                        className="inline-flex items-center justify-center gap-2 px-8 py-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase bg-boutique-rose hover:bg-boutique-rose-dark text-white transition-colors"
                    >
                        Explore Collections
                    </Link>
                    <a
                        href={buildWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                        Enquire on WhatsApp
                    </a>
                </div>
            </div>

            {/* Trust badge strip.
                Mobile: 2 columns — first two badges share a row, the third spans
                the full width below. Desktop (sm+): 3 equal columns in one row. */}
            <div className="border-b border-boutique-muted-border/70 bg-boutique-bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3">
                    {trustBadges.map((b, i) => (
                        <div
                            key={b.title}
                            className={[
                                "flex items-start sm:items-center gap-2.5 sm:gap-3 px-3 py-5 sm:py-6 sm:px-6 border-boutique-muted-border/60",
                                i === 0 ? "border-r sm:border-r-0" : "",       // mobile divider between the first two
                                i > 0 ? "sm:border-l" : "",                     // desktop vertical dividers
                                // third badge: full-width row below, centered on mobile
                                i === 2 ? "col-span-2 border-t justify-center sm:col-span-1 sm:border-t-0 sm:justify-start" : "justify-start",
                            ].join(" ")}
                        >
                            <b.icon className="w-5 h-5 mt-0.5 sm:mt-0 text-boutique-rose flex-shrink-0" />
                            <div className="leading-snug">
                                <p className="text-xs font-semibold uppercase tracking-wider text-boutique-charcoal">{b.title}</p>
                                <p className="text-[11px] text-boutique-taupe font-light mt-0.5">{b.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
