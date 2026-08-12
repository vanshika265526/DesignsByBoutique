"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { buildWhatsAppLink } from "@/config/boutique";

// Dedicated Gown Showcase Dataset matching Image 1 Trending Now design
const gownsData = [
    {
        id: "gown-01",
        slug: "pale-pink-sequins-net-gown",
        name: "Pale Pink Sequins Floor Length Net Gown",
        brand: "DESIGNS BY NISHA",
        price: 8500,
        originalPrice: 10500,
        sizes: "XS, S, M, L, XL",
        tags: ["TRENDING", "NEW"],
        image: "https://assets2.andaazfashion.com/media/catalog/product/p/a/pale-pink-sequins-embroidered-floor-length-net-gown-lstv135801-1.jpg",
        category: "Floor Length Net Gowns",
    },
    {
        id: "gown-02",
        slug: "burgundy-maroon-georgette-anarkali",
        name: "Burgundy Maroon Resham Georgette Anarkali",
        brand: "DESIGNS BY NISHA",
        price: 7900,
        originalPrice: 9500,
        sizes: "S, M, L, XL",
        tags: ["TRENDING"],
        image: "https://assets2.andaazfashion.com/media/catalog/product/r/e/resham-embroidered-georgette-burgundy-maroon-anarkali-suit-lstv01058-maroon-1_1.jpg",
        category: "Resham Georgette Anarkalis",
    },
    {
        id: "gown-03",
        slug: "royal-blue-sequins-anarkali-gown",
        name: "Royal Blue Sequins Designer Anarkali Gown",
        brand: "DESIGNS BY NISHA",
        price: 8890,
        originalPrice: 10990,
        sizes: "XS, S, M, L",
        tags: ["BESTSELLER"],
        image: "https://assets2.andaazfashion.com/media/catalog/product/1/9/1979-blue.jpg",
        category: "Designer Anarkali Gowns",
    },
    {
        id: "gown-04",
        slug: "deep-red-net-embroidered-anarkali",
        name: "Deep Red Net Hand-Embroidered Anarkali Suit",
        brand: "DESIGNS BY NISHA",
        price: 9400,
        originalPrice: 11800,
        sizes: "S, M, L, XL, XXL",
        tags: ["TRENDING", "NEW"],
        image: "https://assets2.andaazfashion.com/media/catalog/product/d/e/deep-red-net-embroidered-anarkali-suit-lstv07512-1.jpg",
        category: "Bridal & Festive Anarkalis",
    },
    {
        id: "gown-05",
        slug: "black-velvet-embroidered-anarkali-skirt",
        name: "Black Velvet Embroidered Anarkali with Skirt",
        brand: "DESIGNS BY NISHA",
        price: 9200,
        originalPrice: 11200,
        sizes: "XS, S, M, L",
        tags: ["NEW"],
        image: "https://assets2.andaazfashion.com/media/catalog/product/b/l/black-velvet-embroidered-anarkali-suit-with-skirt-lstv03688-1.jpg",
        category: "Royal Velvet Couture",
    },
    {
        id: "gown-06",
        slug: "black-embroidered-couture-anarkali",
        name: "Black Embroidered Designer Couture Anarkali",
        brand: "DESIGNS BY NISHA",
        price: 8890,
        originalPrice: 10800,
        sizes: "S, M, L, XL",
        tags: ["POPULAR"],
        image: "https://assets2.andaazfashion.com/media/catalog/product/1/9/1979-black.jpg",
        category: "Festive Evening Wear",
    },
    {
        id: "gown-07",
        slug: "velvet-dream-red-dupion-anarkali",
        name: "Velvet Dream Red Dupion Silk Anarkali Suit",
        brand: "DESIGNS BY NISHA",
        price: 9900,
        originalPrice: 12500,
        sizes: "XS, S, M, L, XL",
        tags: ["LUXURY"],
        image: "https://assets2.andaazfashion.com/media/catalog/product/v/e/velvet-dream-red-dupion-embroidered-anarkali-suit-1-1979_7.jpg",
        category: "Royal Velvet Couture",
    },
    {
        id: "gown-08",
        slug: "lavender-scalloped-pastels-gown",
        name: "Lavender Scalloped Lace Gown",
        brand: "DESIGNS BY NISHA",
        price: 3290,
        originalPrice: 4100,
        sizes: "S, M, L",
        tags: ["NEW"],
        image: "/images/maternity/gown-11.png",
        category: "Pastel Gowns",
    },
];

export default function TrendingNow({ products = [] }) {
    const scrollContainerRef = useRef(null);

    // Combine DB products that are gowns or fallback to our rich gowns showcase dataset
    const displayGowns = products.length > 0
        ? products.map((p, idx) => ({
            id: p.id || `p-${idx}`,
            slug: p.slug || "gown",
            name: p.name || "Bespoke Gown",
            brand: "DESIGNS BY NISHA",
            price: p.price || 3500,
            originalPrice: p.originalPrice || 4500,
            sizes: "XS, S, M, L, XL",
            tags: idx % 2 === 0 ? ["TRENDING", "NEW"] : ["TRENDING"],
            image: p.image || gownsData[idx % gownsData.length].image,
            category: p.categoryName || "Gown Collection",
        }))
        : gownsData;

    // Double the array for seamless infinite marquee loop
    const marqueeGowns = [...displayGowns, ...displayGowns];

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
    };

    return (
        <section className="py-16 md:py-24 bg-boutique-bg overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Title Accent & View All Link */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-boutique-muted-border/40 gap-4">
                    <div>
                        <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-boutique-charcoal uppercase">
                            TRENDING NOW
                        </h2>
                        <div className="h-[3px] w-16 bg-gradient-to-r from-boutique-rose via-boutique-gold to-boutique-rose mt-2 rounded-full" />
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Scroll Navigation Arrows */}
                        <div className="hidden sm:flex items-center space-x-2">
                            <button
                                onClick={scrollLeft}
                                aria-label="Scroll left"
                                className="w-9 h-9 rounded-full bg-boutique-bg-alt hover:bg-boutique-rose hover:text-white border border-boutique-muted-border flex items-center justify-center text-boutique-charcoal transition-colors duration-200"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={scrollRight}
                                aria-label="Scroll right"
                                className="w-9 h-9 rounded-full bg-boutique-bg-alt hover:bg-boutique-rose hover:text-white border border-boutique-muted-border flex items-center justify-center text-boutique-charcoal transition-colors duration-200"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <Link
                            href="/collections/maternity-gowns"
                            className="inline-flex items-center space-x-1.5 text-boutique-rose hover:text-boutique-rose-dark font-semibold text-xs sm:text-sm tracking-wider uppercase transition-colors"
                        >
                            <span>View All Gowns</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Continuous Marquee Carousel Container */}
            <div
                ref={scrollContainerRef}
                className="overflow-x-auto no-scrollbar scroll-smooth py-2 px-4"
            >
                <div className="animate-marquee-slow flex space-x-6">
                    {marqueeGowns.map((gown, index) => (
                        <div
                            key={`${gown.id}-${index}`}
                            className="w-[240px] sm:w-[270px] lg:w-[290px] flex-shrink-0 group flex flex-col"
                        >
                            {/* Card Image Wrapper */}
                            <div className="relative aspect-[3/4] rounded-2xl bg-[#EFEFEF] overflow-hidden mb-3 border border-boutique-muted-border/40 shadow-xs group-hover:shadow-md transition-all duration-300">
                                <Image
                                    src={gown.image}
                                    alt={gown.name}
                                    fill
                                    sizes="290px"
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Top Left Badges matching Image 1 */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                                    {gown.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                                                tag === "TRENDING"
                                                    ? "bg-boutique-blush text-boutique-rose border border-boutique-rose/20"
                                                    : "bg-amber-100 text-amber-800 border border-amber-300"
                                            }`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Quick WhatsApp Button Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                                    <a
                                        href={buildWhatsAppLink({
                                            productName: gown.name,
                                            productCategory: gown.category,
                                            price: gown.price,
                                        })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-boutique-rose hover:bg-boutique-rose-dark text-white text-xs font-semibold py-2 rounded-xl text-center shadow-md transition-all"
                                    >
                                        Enquire Gown
                                    </a>
                                </div>
                            </div>

                            {/* Product Info below image */}
                            <div className="space-y-1 text-left px-1">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-boutique-taupe">
                                    {gown.brand}
                                </span>
                                <h3 className="font-serif-editorial text-base sm:text-lg font-bold text-boutique-charcoal leading-snug line-clamp-1 group-hover:text-boutique-rose transition-colors">
                                    {gown.name}
                                </h3>
                                <div className="flex items-center space-x-2 pt-0.5">
                                    <span className="font-semibold text-sm text-boutique-charcoal">
                                        ₹{gown.price.toLocaleString("en-IN")}
                                    </span>
                                    {gown.originalPrice && (
                                        <span className="text-xs text-boutique-taupe line-through">
                                            ₹{gown.originalPrice.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-boutique-taupe/90 font-light">
                                    Sizes: {gown.sizes}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
