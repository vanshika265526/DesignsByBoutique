"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const collections = [
    {
        id: "ethnic",
        title: "Ethnic Collection",
        subtitle: "Bridal Lehengas & Heritage Anarkalis",
        image: "https://assets2.andaazfashion.com/media/catalog/product/e/t/ethnic-wear-maroon-georgette-embroidered-saree-for-sangeet-sarv161146-1.jpg",
        link: "/collections/bridal-lehengas",
        bgOffset: "bg-[#F7EBE8]",
    },
    {
        id: "indo-western",
        title: "Indo Western",
        subtitle: "Draped Sarees, Gowns & Fusion Silhouettes",
        image: "https://preview.redd.it/any-recommendations-for-fusion-bridal-lehengas-inspired-by-v0-wncwu7sx93re1.jpg?width=1024&format=pjpg&auto=webp&s=6199a0c5f23e63995ea5d0237e8fc61d74a39d55",
        link: "/collections/bridal-lehengas",
        bgOffset: "bg-[#EFE7E1]",
    },
    {
        id: "party-wear",
        title: "Party Wear",
        subtitle: "Cocktail Outfits, Blazers & Evening Couture",
        image: "https://assets2.andaazfashion.com/media/catalog/product/t/e/teal-green-chiffon-trouser-suit-with-zari-work-for-mehndi-lstv141798-1.jpg?tr=w-800,h-1200,c-at_max,q-70",
        link: "/collections/haldi-mehendi",
        bgOffset: "bg-[#F4EFEA]",
    },
];

export default function CuratedCollections() {
    return (
        <section className="py-16 md:py-24 bg-boutique-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-boutique-charcoal uppercase">
                        CURATED COLLECTIONS
                    </h2>
                    <div className="h-[2px] w-14 bg-gradient-to-r from-boutique-rose via-boutique-gold to-boutique-rose mx-auto my-3 rounded-full" />
                    <p className="text-sm sm:text-base text-boutique-taupe font-light italic">
                        Handpicked styles for every occasion
                    </p>
                </div>

                {/* 3 Grid Cards Side-by-Side on all screen sizes */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-8 lg:gap-10">
                    {collections.map((item) => (
                        <Link key={item.id} href={item.link} className="group block relative">
                            {/* Card Wrapper with Subtle Pastel Background Accent */}
                            <div className="relative">
                                {/* Pastel Background Box effect underneath */}
                                <div
                                    className={`absolute inset-0 translate-y-2 translate-x-1 sm:translate-y-4 sm:translate-x-2 rounded-2xl sm:rounded-3xl ${item.bgOffset} transition-transform duration-500 group-hover:translate-y-2 group-hover:translate-x-0`}
                                />

                                {/* Main Image Card */}
                                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] shadow-md group-hover:shadow-xl transition-all duration-500 bg-boutique-bg-card border border-boutique-muted-border/50">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 33vw, 33vw"
                                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-6">
                                        <div className="text-white flex items-center space-x-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                                            <span>Explore</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title Below Image */}
                            <div className="mt-3 sm:mt-5 text-center">
                                <h3 className="font-serif-editorial text-xs sm:text-2xl font-bold text-boutique-charcoal group-hover:text-boutique-rose transition-colors duration-300 line-clamp-2">
                                    {item.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
