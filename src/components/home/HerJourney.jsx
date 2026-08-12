"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// Receives `chapters` prop from the DB-connected parent server component
export default function HerJourney({ chapters = [] }) {
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    if (chapters.length === 0) {
        return null;
    }

    const currentChapter = chapters[activeChapterIndex] || chapters[0];

    // Normalize chapter fields — DB chapters and config chapters have slightly different shapes
    const chapterNumber = currentChapter.number || String(activeChapterIndex + 1).padStart(2, "0");
    const chapterTitle = currentChapter.title || "";
    const chapterCategory = currentChapter.category || currentChapter.categoryName || "";
    const chapterTagline = currentChapter.tagline || currentChapter.subtitle || "";
    const chapterDescription = currentChapter.description || "";
    const chapterImage = currentChapter.image || "";
    const chapterSlug = currentChapter.slug || currentChapter.categorySlug || currentChapter.id || "";

    return (
        <section id="her-journey" className="py-24 bg-boutique-bg relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="SIGNATURE EXPERIENCE"
                    title="Her Story. Her Style. Her Chapters."
                    subtitle="Explore the life milestones that inspire every bespoke creation at Designs by Nisha New Delhi."
                />

                {/* Interactive Chapter Selector Bar */}
                <div className="mt-12 overflow-x-auto pb-4 scrollbar-none">
                    <div className="flex items-center justify-start sm:justify-center min-w-max space-x-3 sm:space-x-4 px-2">
                        {chapters.map((ch, idx) => {
                            const isActive = idx === activeChapterIndex;
                            const num = ch.number || String(idx + 1).padStart(2, "0");
                            const title = ch.title || ch.categoryName || "";
                            return (
                                <button
                                    key={ch.id || idx}
                                    onClick={() => setActiveChapterIndex(idx)}
                                    className={`px-5 py-3 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center space-x-2 border ${isActive
                                            ? "bg-boutique-rose text-white border-boutique-rose shadow-md scale-105"
                                            : "bg-white text-boutique-charcoal border-boutique-muted-border hover:border-boutique-rose/40 hover:bg-boutique-blush/20"
                                        }`}
                                >
                                    <span
                                        className={
                                            isActive
                                                ? "text-boutique-gold"
                                                : "text-boutique-rose font-serif-editorial"
                                        }
                                    >
                                        {num}
                                    </span>
                                    <span>{title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Chapter Showcase */}
                <div className="mt-10 bg-boutique-bg-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-boutique-muted-border shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-500">
                    {/* Chapter Feature Image */}
                    <div className="lg:col-span-7 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-boutique-muted-border/60">
                        {chapterImage ? (
                            <Image
                                src={chapterImage}
                                alt={`${chapterTitle} — ${chapterCategory} by Designs by Nisha`}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover object-center transition-all duration-700 hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-boutique-blush/30 flex items-center justify-center">
                                <span className="text-boutique-rose/50 font-serif-editorial text-xl">
                                    {chapterTitle}
                                </span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-boutique-rose tracking-wider uppercase">
                            CHAPTER {chapterNumber} OF {String(chapters.length).padStart(2, "0")}
                        </div>
                    </div>

                    {/* Chapter Narrative & Action */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs uppercase tracking-[0.25em] text-boutique-gold font-semibold">
                                {chapterCategory}
                            </span>
                            <h3 className="font-serif-editorial text-3xl sm:text-4xl text-boutique-charcoal font-bold leading-tight">
                                {chapterTitle}
                            </h3>
                            {chapterTagline && (
                                <p className="font-serif-editorial text-lg text-boutique-rose italic font-medium">
                                    &ldquo;{chapterTagline}&rdquo;
                                </p>
                            )}
                        </div>

                        <p className="text-sm sm:text-base text-boutique-taupe font-light leading-relaxed">
                            {chapterDescription}
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <Link
                                href={`/collections/${chapterSlug}`}
                                className="inline-flex items-center justify-center space-x-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                            >
                                <span>Explore {chapterCategory}</span>
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
