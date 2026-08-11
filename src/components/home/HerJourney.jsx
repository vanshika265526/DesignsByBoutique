"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { boutiqueConfig } from "@/config/boutique";
import SectionHeading from "@/components/ui/SectionHeading";

export default function HerJourney() {
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const chapters = boutiqueConfig.chapters;
    const currentChapter = chapters[activeChapterIndex];

    return (
        <section id="her-journey" className="py-24 bg-boutique-bg relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="SIGNATURE EXPERIENCE"
                    title="Her Story. Her Style. Her Chapters."
                    subtitle="Explore the five life milestones that inspire every bespoke creation at Designs by Nisha New Delhi."
                />

                {/* Interactive Chapter Selector Bar */}
                <div className="mt-12 overflow-x-auto pb-4 scrollbar-none">
                    <div className="flex items-center justify-start sm:justify-center min-w-max space-x-3 sm:space-x-4 px-2">
                        {chapters.map((ch, idx) => {
                            const isActive = idx === activeChapterIndex;
                            return (
                                <button
                                    key={ch.id}
                                    onClick={() => setActiveChapterIndex(idx)}
                                    className={`px-5 py-3 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center space-x-2 border ${isActive
                                            ? "bg-boutique-rose text-white border-boutique-rose shadow-md scale-105"
                                            : "bg-white text-boutique-charcoal border-boutique-muted-border hover:border-boutique-rose/40 hover:bg-boutique-blush/20"
                                        }`}
                                >
                                    <span className={isActive ? "text-boutique-gold" : "text-boutique-rose font-serif-editorial"}>
                                        {ch.number}
                                    </span>
                                    <span>{ch.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Chapter Showcase Stage */}
                <div className="mt-10 bg-boutique-bg-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-boutique-muted-border shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-500">
                    {/* Chapter Feature Image */}
                    <div className="lg:col-span-7 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-boutique-muted-border/60">
                        <Image
                            src={currentChapter.image}
                            alt={`${currentChapter.title} — ${currentChapter.category} by Designs by Nisha`}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover object-center transition-all duration-700 hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-boutique-rose tracking-wider uppercase">
                            CHAPTER {currentChapter.number} OF 05
                        </div>
                    </div>

                    {/* Chapter Story Narrative & Action */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs uppercase tracking-[0.25em] text-boutique-gold font-semibold">
                                {currentChapter.category}
                            </span>
                            <h3 className="font-serif-editorial text-3xl sm:text-4xl text-boutique-charcoal font-bold leading-tight">
                                {currentChapter.title}
                            </h3>
                            <p className="font-serif-editorial text-lg text-boutique-rose italic font-medium">
                                "{currentChapter.tagline}"
                            </p>
                        </div>

                        <p className="text-sm sm:text-base text-boutique-taupe font-light leading-relaxed">
                            {currentChapter.description}
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href={`/collections/${currentChapter.slug}`}
                                className="inline-flex items-center justify-center space-x-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                            >
                                <span>Explore {currentChapter.category}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <button
                                onClick={() =>
                                    setActiveChapterIndex((prev) => (prev + 1) % chapters.length)
                                }
                                className="inline-flex items-center justify-center space-x-1 text-xs text-boutique-taupe hover:text-boutique-rose font-medium py-2 transition-colors"
                            >
                                <span>Next Chapter</span>
                                <Sparkles className="w-3.5 h-3.5 text-boutique-gold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
