"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Heart,
    Crown,
    Baby,
    Gift,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Star,
    Compass
} from "lucide-react";

// Icons mapping for the 5 phases
const phaseIcons = [Sparkles, Crown, Heart, Baby, Gift];

// Default phase highlights if not in DB
const phaseHighlights = [
    ["Pastel Tussar Silk", "College Fests & Festive Mornings", "Custom Sleeves"],
    ["Heirloom Zardozi Work", "Mulberry Velvet & Double Dupattas", "Bespoke Fitting"],
    ["Haldi Sunshine Yellow", "Emerald Mehendi Shararas", "Post-Wedding Dinners"],
    ["Hypoallergenic Satin", "Hidden Trimester Zippers", "Photoshoot Trails"],
    ["Zero-Scratch Lining", "Annaprashan Mini Sets", "First Birthday Couture"]
];

export default function ChapterTimeline({ chapters = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef(null);

    // Re-enable Auto advance phase timer (5.5s interval), auto-resetting on user interaction
    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (chapters.length > 0) {
            timerRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % chapters.length);
            }, 5500);
        }
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [chapters.length]);

    const handleSelectPhase = (index) => {
        setActiveIndex(index);
        startTimer(); // Reset auto-advance timer on click
    };

    if (!chapters || chapters.length === 0) return null;

    const currentChapter = chapters[activeIndex] || chapters[0];
    const num = currentChapter.number || String(activeIndex + 1).padStart(2, "0");
    const title = currentChapter.title || "";
    const subtitle = currentChapter.subtitle || currentChapter.tagline || "";
    const categoryName = currentChapter.categoryName || currentChapter.category || "";
    const categorySlug = currentChapter.categorySlug || currentChapter.slug || currentChapter.id || "suits-anarkalis";
    const description = currentChapter.description || "";
    const image = currentChapter.image || "https://assets2.andaazfashion.com/media/catalog/product/s/i/silk-deep-red-zari-embroidered-panelled-style-lehenga-llcv120562-1_1.jpg";
    const highlights = phaseHighlights[activeIndex] || phaseHighlights[0];
    const PhaseIcon = phaseIcons[activeIndex % phaseIcons.length];

    // Mathematically exact percentage between node 0 (0%) and node 4 (100%)
    const progressPercentage = (activeIndex / Math.max(1, chapters.length - 1)) * 100;

    return (
        <section id="chapter-timeline" className="py-16 md:py-28 bg-gradient-to-b from-boutique-bg via-[#FBF7F4] to-boutique-bg relative overflow-hidden border-y border-boutique-muted-border/40">
            {/* Ambient Background Decorative Elements */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-boutique-rose/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-boutique-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-boutique-rose/10 border border-boutique-rose/20 text-boutique-rose text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
                            <Compass className="w-3.5 h-3.5" />
                            <span>LIFETIME JOURNEY TIMELINE</span>
                        </div>
                        <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-boutique-charcoal uppercase">
                            HER 5 CHAPTERS OF ELEGANCE
                        </h2>
                        <div className="h-[2px] w-20 bg-gradient-to-r from-boutique-rose via-boutique-gold to-boutique-rose my-3 rounded-full" />
                        <p className="text-sm sm:text-base text-boutique-taupe font-light italic max-w-xl">
                            From young celebrations to motherhood — explore how Designs by Nisha crafts bespoke outfits for every major phase of a woman's life.
                        </p>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center space-x-2 self-start md:self-end">
                        <span className="text-xs font-semibold uppercase tracking-wider text-boutique-taupe mr-2">
                            Phase {num} / 05
                        </span>
                        <button
                            onClick={() => handleSelectPhase(activeIndex === 0 ? chapters.length - 1 : activeIndex - 1)}
                            className="p-2.5 rounded-full bg-white border border-boutique-muted-border hover:bg-boutique-rose hover:text-white hover:border-boutique-rose transition-all shadow-sm active:scale-95"
                            aria-label="Previous Phase"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleSelectPhase((activeIndex + 1) % chapters.length)}
                            className="p-2.5 rounded-full bg-white border border-boutique-muted-border hover:bg-boutique-rose hover:text-white hover:border-boutique-rose transition-all shadow-sm active:scale-95"
                            aria-label="Next Phase"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* VISUAL TIMELINE PROGRESS BAR WITH NODES */}
                {/* Scrollable container on mobile with exact node center alignment */}
                <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-6 mb-10 sm:mb-16">
                    <div className="relative min-w-[560px] sm:min-w-full px-6 sm:px-7">
                        {/* Background Track Line — Placed exactly between circle centers */}
                        <div className="absolute top-[22px] sm:top-7 left-6 right-6 sm:left-7 sm:right-7 h-[3px] bg-boutique-muted-border/70 -translate-y-1/2 rounded-full z-0" />

                        {/* Active Filled Progress Line — Animate width percentage from 0% to 100% of the inner track */}
                        <div className="absolute top-[22px] sm:top-7 left-6 right-6 sm:left-7 sm:right-7 h-[3px] pointer-events-none z-0 -translate-y-1/2">
                            <motion.div
                                className="h-full bg-gradient-to-r from-boutique-rose via-boutique-gold to-boutique-rose rounded-full shadow-sm"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.45, ease: "easeInOut" }}
                            />
                        </div>

                        {/* 5 Milestone Timeline Nodes */}
                        <div className="relative z-10 flex justify-between items-start">
                            {chapters.map((ch, idx) => {
                                const isActive = idx === activeIndex;
                                const isPast = idx < activeIndex;
                                const chTitle = ch.title || "";
                                const IconComp = phaseIcons[idx % phaseIcons.length];

                                return (
                                    <div key={ch.id || idx} className="flex flex-col items-center group cursor-pointer" onClick={() => handleSelectPhase(idx)}>
                                        {/* Opaque Node Circle Button */}
                                        <div className="relative">
                                            <button
                                                className={`relative z-10 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-md ${
                                                    isActive
                                                        ? "bg-[#7A283E] text-white border-boutique-gold scale-110 shadow-lg ring-2 ring-boutique-gold/30"
                                                        : isPast
                                                        ? "bg-[#7A283E] text-white border-[#7A283E]"
                                                        : "bg-white text-boutique-charcoal border-boutique-muted-border group-hover:border-boutique-rose/60 group-hover:scale-105"
                                                }`}
                                            >
                                                <IconComp className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-boutique-gold" : isPast ? "text-white" : "text-boutique-rose"}`} />
                                            </button>
                                        </div>

                                        {/* Node Title Label Below */}
                                        <div className="mt-3 text-center max-w-[95px] sm:max-w-[120px]">
                                            <span className={`block text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-300 line-clamp-2 ${
                                                isActive ? "text-boutique-rose font-bold" : "text-boutique-charcoal/80 group-hover:text-boutique-charcoal"
                                            }`}>
                                                {chTitle}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ACTIVE PHASE INTERACTIVE SHOWCASE CARD */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 20, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.99 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="bg-white rounded-3xl border border-boutique-muted-border/80 shadow-2xl overflow-hidden grid grid-cols-12 gap-0"
                        >
                            {/* Left Image Showcase (Side-by-Side on Mobile) */}
                            <div className="col-span-5 sm:col-span-6 lg:col-span-6 relative min-h-[260px] sm:min-h-[420px] lg:min-h-[480px] overflow-hidden bg-boutique-bg-card group">
                                <Image
                                    src={image}
                                    alt={`${title} — ${categoryName}`}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 50vw, 50vw"
                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Subtle Dark Gradient Overlay for Badges */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                                {/* Top Phase Badge */}
                                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center space-x-2">
                                    <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/40 text-[9px] sm:text-[11px] font-bold text-boutique-rose tracking-widest uppercase shadow-md flex items-center space-x-1">
                                        <PhaseIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-boutique-gold" />
                                        <span>CH {num}</span>
                                    </div>
                                </div>

                                {/* Bottom Category Badge */}
                                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex justify-between items-end">
                                    <div className="text-white">
                                        <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-boutique-gold block">
                                            {categoryName}
                                        </span>
                                        <h4 className="font-serif-editorial text-sm sm:text-3xl font-bold text-white leading-tight line-clamp-1">
                                            {subtitle}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Right Narrative & Interactive Content (Side-by-Side on Mobile) */}
                            <div className="col-span-7 sm:col-span-6 lg:col-span-6 p-4 sm:p-10 lg:p-12 flex flex-col justify-between space-y-4 sm:space-y-8 bg-gradient-to-br from-white via-boutique-bg/30 to-white">
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Category Subtitle */}
                                    <div className="flex items-center space-x-3">
                                        <div className="h-[2px] w-8 bg-boutique-gold rounded-full" />
                                        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold text-boutique-rose">
                                            CHAPTER {num} • {categoryName}
                                        </span>
                                    </div>

                                    {/* Main Phase Title */}
                                    <div className="space-y-1 sm:space-y-2">
                                        <h3 className="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-bold text-boutique-charcoal leading-tight">
                                            {title}
                                        </h3>
                                        <p className="text-xs sm:text-base font-serif-editorial text-boutique-taupe italic">
                                            "{subtitle}"
                                        </p>
                                    </div>

                                    {/* Phase Description */}
                                    <p className="text-xs sm:text-base text-boutique-taupe font-light leading-relaxed">
                                        {description}
                                    </p>

                                    {/* Highlights Pill Badges */}
                                    <div className="space-y-2 pt-1 sm:pt-2">
                                        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-boutique-charcoal/60 font-semibold block">
                                            CHAPTER HIGHLIGHTS & OUTFIT FEATURES:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                            {highlights.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-boutique-blush/40 border border-boutique-rose/20 text-boutique-charcoal text-[11px] sm:text-xs font-medium"
                                                >
                                                    <Star className="w-3 h-3 text-boutique-gold fill-boutique-gold" />
                                                    <span>{item}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 sm:pt-6 border-t border-boutique-muted-border/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                                    <Link
                                        href={`/collections/${categorySlug}`}
                                        className="inline-flex items-center justify-center space-x-3 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-center"
                                    >
                                        <span>EXPLORE {categoryName.toUpperCase()}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>

                                    <Link
                                        href={`/collections`}
                                        className="inline-flex items-center justify-center space-x-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white hover:bg-boutique-blush/30 border border-boutique-muted-border text-boutique-charcoal text-xs font-semibold tracking-wider uppercase transition-all text-center"
                                    >
                                        <span>VIEW ALL CHAPTERS</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
