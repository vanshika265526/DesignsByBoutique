"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Scissors, CalendarCheck, Sparkles } from "lucide-react";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";

const trustBadges = [
    { icon: Scissors, title: "Made Just for You", subtitle: "Stitched to your size and style" },
    { icon: CalendarCheck, title: "Visit or Book a Time", subtitle: "Open Mon–Sat, 10:30 AM – 7:30 PM" },
    { icon: MessageCircle, title: "Ask on WhatsApp", subtitle: "Message us anytime — it's quick and easy" },
];

// Auto-rotating hero slides. First entry is the existing/admin hero image;
// the rest are the studio editorial shots in /public/images/hero/.
const SLIDE_INTERVAL_MS = 5000;

export default function Hero({ settings = {} }) {
    const allImages = [
        settings.heroImage || "/images/hero.png",
        "/images/hero/slide-1.png",
        "/images/hero/slide-2.png",
        "/images/hero/slide-3.png",
    ];

    // Drop any slide whose file fails to load, so a not-yet-added image never
    // shows as a blank/broken frame in the rotation.
    const [broken, setBroken] = useState({});
    const heroImages = allImages.filter((src) => !broken[src]);

    const [active, setActive] = useState(0);

    useEffect(() => {
        if (heroImages.length <= 1) return;
        const id = setInterval(() => {
            setActive((i) => (i + 1) % heroImages.length);
        }, SLIDE_INTERVAL_MS);
        return () => clearInterval(id);
    }, [heroImages.length]);

    // Keep the active index valid if the list shrinks (a slide failed to load).
    useEffect(() => {
        if (active >= heroImages.length) setActive(0);
    }, [heroImages.length, active]);

    return (
        <section className="w-full bg-boutique-bg">
            {/* Full-bleed editorial hero */}
            <div className="relative w-full h-[78vh] min-h-[520px] md:h-[86vh] overflow-hidden bg-boutique-charcoal">
                {heroImages.map((src, i) => (
                    <Image
                        key={src}
                        src={src}
                        alt="Designs by Nisha — Luxury Indian bridal & women's couture, New Delhi"
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        onError={() => setBroken((b) => ({ ...b, [src]: true }))}
                        className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${
                            i === active ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}
                {/* Legibility overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-boutique-charcoal/40 via-boutique-charcoal/25 to-boutique-charcoal/60" />

                {/* Centered content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
                    <p className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.35em] text-white/90 font-medium mb-5">
                        <Sparkles className="w-3.5 h-3.5 text-boutique-gold-light" />
                        Bespoke Couture · New Delhi
                    </p>

                    <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.98] max-w-4xl">
                        For Every Chapter
                        <span className="block italic font-normal">of Her Story</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-sm sm:text-base text-white/85 font-light leading-relaxed">
                        Handcrafted Suits, Anarkalis, Bridal Lehengas, Haldi &amp; Mehendi
                        outfits, Maternity Gowns and Baby wear — designed to be treasured.
                    </p>

                    <div className="mt-9 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <Link
                            href="/collections"
                            className="w-full sm:w-auto inline-flex items-center justify-center bg-boutique-rose hover:bg-boutique-rose-dark text-white px-9 py-3.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-lg"
                        >
                            Explore Collections
                        </Link>
                        <a
                            href={buildWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/70 hover:bg-white hover:text-boutique-charcoal text-white px-8 py-3.5 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Enquire on WhatsApp
                        </a>
                    </div>
                </div>

                {/* Slide indicators */}
                {heroImages.length > 1 && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {heroImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                aria-label={`Show slide ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === active ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Trust badge strip */}
            <div className="border-b border-boutique-muted-border/70 bg-boutique-bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-boutique-muted-border/60">
                    {trustBadges.map((b) => (
                        <div key={b.title} className="flex items-center gap-3 py-4 sm:py-6 sm:px-6 justify-center sm:justify-start">
                            <b.icon className="w-5 h-5 text-boutique-rose flex-shrink-0" />
                            <div className="leading-tight">
                                <p className="text-xs font-semibold uppercase tracking-wider text-boutique-charcoal">{b.title}</p>
                                <p className="text-[11px] text-boutique-taupe font-light">{b.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
