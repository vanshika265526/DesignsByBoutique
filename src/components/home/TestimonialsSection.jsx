"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
    // Real Google reviews from the DB and nothing else. This used to fall back to
    // a hardcoded list of invented customers and append it to the live data, so
    // made-up reviews showed on the homepage no matter what.
    const [reviews, setReviews] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetch("/api/data/testimonials", { cache: "no-store" })
            .then((res) => res.json())
            .then((json) => {
                if (json.success && Array.isArray(json.data)) setReviews(json.data);
            })
            .catch(() => {});
    }, []);

    // Duplicate array for seamless infinite marquee loop
    const marqueeReviews = [...reviews, ...reviews];

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
    };

    return (
        <section className="py-16 md:py-24 bg-boutique-bg-card border-y border-boutique-muted-border/40 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                {/* Header matching Image 2 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left mx-auto sm:mx-0">
                        <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-boutique-charcoal uppercase">
                            WHAT OUR CUSTOMERS SAY
                        </h2>
                        <div className="h-[2px] w-14 bg-gradient-to-r from-boutique-rose via-boutique-gold to-boutique-rose mx-auto sm:mx-0 my-3 rounded-full" />
                    </div>

                    {/* Manual Navigation Buttons */}
                    <div className="hidden sm:flex items-center space-x-2">
                        <button
                            onClick={scrollLeft}
                            aria-label="Previous review"
                            className="w-9 h-9 rounded-full bg-white hover:bg-boutique-rose hover:text-white border border-boutique-muted-border flex items-center justify-center text-boutique-charcoal transition-colors duration-200 shadow-xs"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollRight}
                            aria-label="Next review"
                            className="w-9 h-9 rounded-full bg-white hover:bg-boutique-rose hover:text-white border border-boutique-muted-border flex items-center justify-center text-boutique-charcoal transition-colors duration-200 shadow-xs"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Continuous Marquee Scrolling Container */}
            <div
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar scroll-smooth py-3 px-4"
            >
                <div className="animate-marquee-slow flex space-x-6">
                    {marqueeReviews.map((rev, index) => (
                        <div
                            key={`${rev.id}-${index}`}
                            className="w-[280px] sm:w-[320px] lg:w-[350px] flex-shrink-0 bg-white rounded-3xl p-6 sm:p-7 border border-boutique-muted-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between space-y-5"
                        >
                            {/* Top Star Rating & Review Text */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-1">
                                    {[...Array(rev.rating || 5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 text-amber-400 fill-amber-400"
                                        />
                                    ))}
                                </div>

                                <p className="text-xs sm:text-sm text-boutique-charcoal/90 font-light italic leading-relaxed line-clamp-6">
                                    &ldquo;{rev.text}&rdquo;
                                </p>
                            </div>

                            {/* Customer Profile Info at Bottom */}
                            <div className="flex items-center space-x-3 pt-3 border-t border-boutique-muted-border/40">
                                {rev.avatar ? (
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-boutique-rose/20">
                                        <Image
                                            src={rev.avatar}
                                            alt={rev.author}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-boutique-blush/50 text-boutique-rose font-bold font-serif-editorial text-sm flex items-center justify-center flex-shrink-0">
                                        {rev.author?.charAt(0) || "C"}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h3 className="font-serif-editorial text-sm font-bold text-boutique-charcoal truncate">
                                        {rev.author}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
