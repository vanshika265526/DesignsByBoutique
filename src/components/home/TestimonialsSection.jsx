"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const defaultReviews = [
    {
        id: "t1",
        author: "Ananya Iyer",
        city: "Kanpur",
        rating: 5,
        text: "Beautiful collection! Found so many outfits for my daughter. The kids section is amazing - great variety and super cute designs.",
        outfit: "Kids Lehenga Set",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: "t2",
        author: "Karan Verma",
        city: "Varanasi",
        rating: 5,
        text: "The gown fit like a dream. Ordered two in different colors and both are fantastic. Will definitely shop here again!",
        outfit: "Designer Evening Gown",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: "t3",
        author: "Sneha Kapoor",
        city: "New Delhi",
        rating: 5,
        text: "Got so many compliments wearing the Indo Western gown! Easy fitting and great customer support. Love Designs by Nisha!",
        outfit: "Indo Western Gown",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: "t4",
        author: "Meera Mehta",
        city: "Mumbai",
        rating: 5,
        text: "Ordered a party wear evening gown and I am amazed by the stitching and silk quality. The drape is elegant and photogenic.",
        outfit: "Silk Party Wear Gown",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: "t5",
        author: "Pooja Sharma",
        city: "Gurugram",
        rating: 5,
        text: "Finding graceful maternity gowns felt impossible until I visited Nisha's boutique. Featherlight silk and super comfortable fit!",
        outfit: "Rose Silk Maternity Gown",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: "t6",
        author: "Rhea Singhania",
        city: "South Extension, Delhi",
        rating: 5,
        text: "Custom bridal reception gown handcrafted in just 3 weeks! The zardozi work and fitting sessions were pure luxury.",
        outfit: "Ivory Bridal Reception Gown",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop",
    },
];

export default function TestimonialsSection() {
    const [reviews, setReviews] = useState(defaultReviews);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetch("/api/data/testimonials")
            .then((res) => res.json())
            .then((json) => {
                if (json.success && json.data && json.data.length > 0) {
                    // Combine fetched reviews with defaults for continuous scrolling
                    setReviews([...json.data, ...defaultReviews]);
                }
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

                                <p className="text-xs sm:text-sm text-boutique-charcoal/90 font-light italic leading-relaxed line-clamp-4">
                                    &ldquo;{rev.text}&rdquo;
                                </p>
                            </div>

                            {/* Outfit Tag Pill matching Image 2 */}
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-boutique-blush/60 text-boutique-rose text-[11px] font-semibold tracking-wide">
                                    {rev.outfit || "Custom Couture Gown"}
                                </span>
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
                                    <p className="text-[11px] text-boutique-taupe capitalize truncate">
                                        {rev.city || "New Delhi"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
