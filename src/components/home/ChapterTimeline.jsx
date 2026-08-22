"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { initialChapters } from "@/data/products";

// Soft alternating tints (warm, cohesive with cream — no heavy green)
const TINTS = ["#E7EFE6", "#F6E7D6", "#EFE9DC", "#F4E6DF", "#F0E7CD"];

// Hand-drawn style curved connector that draws itself
function Connector({ flip, reduce }) {
    return (
        <div className="flex justify-center py-1" aria-hidden="true">
            <svg
                width="220"
                height="96"
                viewBox="0 0 220 96"
                fill="none"
                className={`w-44 sm:w-56 md:w-64 h-auto ${flip ? "-scale-x-100" : ""}`}
            >
                {/* curve sweeping from the top circle toward the next card */}
                <motion.path
                    d="M26 12 C 74 30, 128 40, 190 84"
                    stroke="#B08C4F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                />
                {/* arrowhead pointing into the next card */}
                <motion.path
                    d="M171 80 L192 86 L184 66"
                    stroke="#B08C4F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: 0.75, duration: 0.3 }}
                />
            </svg>
        </div>
    );
}

export default function ChapterTimeline() {
    const reduce = useReducedMotion();
    const chapters = initialChapters || [];
    const count = chapters.length;
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    // Auto-cycle the highlighted phase down the journey
    useEffect(() => {
        if (reduce || paused || count <= 1) return;
        const t = setTimeout(() => setActive((p) => (p + 1) % count), 2600);
        return () => clearTimeout(t);
    }, [active, paused, reduce, count]);

    if (count === 0) return null;

    return (
        <section
            className="relative overflow-hidden bg-boutique-bg pt-16 pb-10 md:pt-24 md:pb-14"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-boutique-gold font-semibold mb-4">
                        The Journey
                    </p>
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-boutique-charcoal">
                        For Every Chapter <span className="italic">of Her Story</span>
                    </h2>
                    <p className="mt-5 text-sm sm:text-base text-boutique-taupe font-light leading-relaxed">
                        One boutique, dressing every phase of her life — from her first celebrations
                        to bridal vows, motherhood, and her little one&apos;s earliest milestones.
                    </p>
                </div>

                {/* Journey of circles + connectors */}
                <div className="flex flex-col items-stretch">
                    {chapters.map((ch, i) => {
                        const left = i % 2 === 0;
                        const isActive = i === active;
                        return (
                            <div key={ch.id || i}>
                                <motion.div
                                    initial={reduce ? false : { opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    className={`flex ${left ? "justify-start" : "justify-end"}`}
                                >
                                    <Link
                                        href={`/collections/${ch.categorySlug}`}
                                        onMouseEnter={() => setActive(i)}
                                        className={`group flex items-center gap-5 sm:gap-8 text-left ${left ? "" : "flex-row-reverse"
                                            }`}
                                    >
                                        {/* Circle node */}
                                        <div className="relative flex-shrink-0">
                                            {/* soft tint backing */}
                                            <span
                                                className={`absolute rounded-full transition-all duration-500 ${left ? "-left-3 -top-3" : "-right-3 -top-3"
                                                    }`}
                                                style={{
                                                    backgroundColor: TINTS[i % TINTS.length],
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            />
                                            <motion.div
                                                animate={
                                                    reduce
                                                        ? {}
                                                        : { scale: isActive ? 1.06 : 1 }
                                                }
                                                transition={{ type: "spring", stiffness: 200, damping: 16 }}
                                                className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg ring-4 transition-colors duration-500 ${isActive ? "ring-boutique-gold" : "ring-white"
                                                    }`}
                                            >
                                                <Image
                                                    src={ch.image}
                                                    alt={`${ch.title} — ${ch.categoryName}`}
                                                    fill
                                                    sizes="(max-width: 768px) 40vw, 12rem"
                                                    // These are tall full-length outfit shots. Cropping them to a
                                                    // circle from the centre lands on the skirt and cuts the model's
                                                    // head off above the frame, so anchor the crop near the top where
                                                    // the face actually is.
                                                    className="object-cover object-[50%_12%]"
                                                />
                                            </motion.div>
                                            {/* chapter number chip */}
                                            <span
                                                className={`absolute -bottom-1 ${left ? "-right-1" : "-left-1"
                                                    } w-9 h-9 rounded-full bg-boutique-charcoal text-white font-serif-editorial text-sm flex items-center justify-center shadow-md`}
                                            >
                                                {ch.number}
                                            </span>
                                        </div>

                                        {/* Side label */}
                                        <div className={`max-w-[15rem] ${left ? "text-left" : "text-right"}`}>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-boutique-gold font-semibold">
                                                Chapter {ch.number}
                                            </p>
                                            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-boutique-charcoal leading-tight mt-1">
                                                {ch.title}
                                            </h3>
                                            <p className="text-xs text-boutique-taupe italic mt-1">
                                                {ch.categoryName}
                                            </p>
                                            <span
                                                className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-boutique-rose ${left ? "" : "flex-row-reverse"
                                                    }`}
                                            >
                                                <span>Explore Collection</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>

                                {i < count - 1 && <Connector flip={!left} reduce={reduce} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
