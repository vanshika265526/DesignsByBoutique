"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Sparkles, MessageCircle } from "lucide-react";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";

export default function Hero() {
    return (
        <section className="relative -mt-[84px] min-h-screen w-full flex items-start justify-center overflow-hidden bg-boutique-bg pt-[84px] md:-mt-[90px] md:pt-[90px]">
            {/* Background High-Fashion Editorial Imagery with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop"
                    alt="Designs by Nisha Luxury Indian Bridal Fashion New Delhi"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center brightness-90 contrast-[1.02] animate-float-slow opacity-25"
                />
                {/* Soft Radial Vignette & Warm Tint Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-boutique-bg via-boutique-bg/70 to-transparent" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-boutique-rose/5 to-boutique-bg/80" />
            </div>

            {/* Hero Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 md:pt-10 pb-10 space-y-4 md:space-y-5">
                {/* Sub-Header Location Tag */}
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-boutique-blush/40 border border-boutique-rose/20 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-boutique-rose" />
                    <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-boutique-rose">
                        NEW DELHI • LUXURY BOUTIQUE
                    </span>
                </div>

                {/* Main Editorial Brand Title */}
                <div className="space-y-2">
                    <h1 className="font-serif-editorial text-5xl sm:text-7xl md:text-8xl tracking-tight text-boutique-charcoal font-semibold leading-[0.95]">
                        DESIGNS BY NISHA
                    </h1>
                    <p className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl text-boutique-rose italic font-medium pt-1">
                        "{boutiqueConfig.tagline}"
                    </p>
                </div>

                {/* Story Narrative Lines */}
                <p className="text-sm sm:text-base md:text-lg text-boutique-taupe max-w-2xl mx-auto font-light leading-relaxed">
                    From her first celebrations, to her wedding day, to motherhood and beyond.
                    Crafting bespoke Indian ethnic wear, bridal lehengas, maternity gowns, and baby clothes.
                </p>

                {/* Action Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
                    <Link
                        href="#her-journey"
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <span>Explore Her Story</span>
                    </Link>

                    <a
                        href={buildWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white px-7 py-3.5 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all shadow-md"
                    >
                        <MessageCircle className="w-4 h-4 text-white" />
                        <span>Chat on WhatsApp</span>
                    </a>
                </div>

                {/* Scroll Indicator */}
                <div className="pt-4 flex flex-col items-center justify-center space-y-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-boutique-taupe font-medium">
                        SCROLL TO EXPLORE
                    </span>
                    <ChevronDown className="w-5 h-5 text-boutique-rose animate-bounce" />
                </div>
            </div>
        </section>
    );
}
