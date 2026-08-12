"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { initialChapters } from "@/data/products";

const DURATION = 4200; // ms each phase stays on screen

export default function ChapterTimeline() {
    const reduce = useReducedMotion();
    const chapters = initialChapters || [];
    const count = chapters.length;

    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const timer = useRef(null);

    const go = useCallback((i) => setActive(((i % count) + count) % count), [count]);
    const next = useCallback(() => setActive((p) => (p + 1) % count), [count]);
    const prev = useCallback(() => setActive((p) => (p - 1 + count) % count), [count]);

    useEffect(() => {
        if (reduce || paused || count <= 1) return;
        timer.current = setTimeout(next, DURATION);
        return () => clearTimeout(timer.current);
    }, [active, paused, reduce, next, count]);

    if (count === 0) return null;

    return (
        <section className="relative overflow-hidden bg-boutique-charcoal text-white py-20 md:py-28">
            {/* Soft warm glow (no green) */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-boutique-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-boutique-gold/5 blur-3xl" />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-boutique-gold-light font-semibold mb-4">
                        The Journey
                    </p>
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
                        For Every Chapter <span className="italic">of Her Story</span>
                    </h2>
                    <p className="mt-5 text-sm sm:text-base text-white/65 font-light leading-relaxed">
                        One boutique, dressing every phase of her life — from her first celebrations
                        to bridal vows, motherhood, and her little one&apos;s earliest milestones.
                    </p>
                </div>

                {/* Progress segments */}
                <div className="flex gap-2 mb-5 max-w-4xl mx-auto">
                    {chapters.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => go(i)}
                            aria-label={`Go to chapter ${i + 1}`}
                            className="flex-1 h-[3px] rounded-full bg-white/15 overflow-hidden"
                        >
                            {i < active && <span className="block h-full w-full bg-boutique-gold" />}
                            {i === active && (
                                <motion.span
                                    key={`fill-${active}-${paused}`}
                                    className="block h-full bg-boutique-gold"
                                    initial={{ width: reduce ? "100%" : "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: reduce || paused ? 0 : DURATION / 1000, ease: "linear" }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Carousel */}
                <div
                    className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div
                        className="flex transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                        style={{ transform: `translateX(-${active * 100}%)` }}
                    >
                        {chapters.map((ch, i) => (
                            <div key={ch.id || i} className="relative w-full flex-shrink-0">
                                <div className="relative h-[460px] sm:h-[520px] md:h-[560px] w-full">
                                    <Image
                                        src={ch.image}
                                        alt={`${ch.title} — ${ch.categoryName}`}
                                        fill
                                        priority={i === 0}
                                        sizes="(max-width: 1024px) 100vw, 1152px"
                                        className="object-cover object-center"
                                    />
                                    {/* Neutral cinematic darken for legibility */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-boutique-charcoal via-boutique-charcoal/70 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-boutique-charcoal/60 to-transparent" />

                                    {/* Text */}
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="px-6 sm:px-10 md:px-14 max-w-xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="font-serif-editorial text-5xl sm:text-6xl font-light text-boutique-gold-light leading-none">
                                                    {ch.number}
                                                </span>
                                                <span className="text-[11px] uppercase tracking-[0.25em] text-boutique-gold-light font-semibold">
                                                    {ch.categoryName}
                                                </span>
                                            </div>
                                            <h3 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-medium leading-tight">
                                                {ch.title}
                                            </h3>
                                            <p className="text-sm text-white/60 italic mt-2">{ch.subtitle}</p>
                                            <p className="text-sm sm:text-base text-white/80 font-light mt-4 leading-relaxed line-clamp-3 max-w-md">
                                                {ch.description}
                                            </p>
                                            <Link
                                                href={`/collections/${ch.categorySlug}`}
                                                className="mt-6 inline-flex items-center gap-2 bg-boutique-gold hover:bg-boutique-gold-light text-boutique-charcoal px-6 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors"
                                            >
                                                <span>Discover {ch.categoryName}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Arrows */}
                    <button
                        onClick={prev}
                        aria-label="Previous chapter"
                        className="absolute top-1/2 -translate-y-1/2 right-16 sm:right-20 md:right-24 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next chapter"
                        className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 md:right-8 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Numbered phase nav */}
                <div className="mt-8 grid grid-cols-5 gap-2 sm:gap-4 max-w-4xl mx-auto">
                    {chapters.map((ch, i) => (
                        <button
                            key={ch.id || i}
                            onClick={() => go(i)}
                            className={`group text-left transition-opacity ${
                                i === active ? "opacity-100" : "opacity-45 hover:opacity-80"
                            }`}
                        >
                            <span
                                className={`font-serif-editorial text-lg sm:text-xl ${
                                    i === active ? "text-boutique-gold-light" : "text-white"
                                }`}
                            >
                                {ch.number}
                            </span>
                            <span className="hidden sm:block text-[10px] uppercase tracking-[0.14em] text-white/70 mt-1 leading-tight line-clamp-2">
                                {ch.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
