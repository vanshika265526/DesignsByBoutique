"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
    {
        id: "men",
        name: "MEN",
        image: "https://assets2.andaazfashion.com/media/catalog/product/m/e/mens-ethnic-maroon-kurta-for-eid-mkpv0712.jpg",
        link: "/collections/suits-anarkalis",
        gradientOverlay: "from-[#6B2135]/80 via-[#6B2135]/20 to-transparent",
    },
    {
        id: "women",
        name: "WOMEN",
        image: "https://assets2.andaazfashion.com/media/catalog/product/d/u/dusty-orange-tissue-gharara-suit-with-dori-hand-embroidered-for-wedding-wear-lstv146809-1_3.jpg",
        link: "/collections/bridal-lehengas",
        gradientOverlay: "from-[#7A283E]/80 via-[#7A283E]/20 to-transparent",
    },
    {
        id: "kids",
        name: "KIDS",
        image: "https://assets2.andaazfashion.com/media/catalog/product/o/l/olive-green-tissue-sequins-embroidered-girl-anarkali-suit-for-party-wear-lstv145726-1_1.jpg",
        link: "/collections/baby-clothes",
        gradientOverlay: "from-[#8B3B4B]/80 via-[#8B3B4B]/20 to-transparent",
    },
];

export default function ShopByCategory() {
    return (
        <section className="py-16 md:py-24 bg-boutique-bg-alt border-y border-boutique-muted-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-boutique-charcoal uppercase">
                        SHOP BY CATEGORY
                    </h2>
                    <div className="h-[2px] w-14 bg-gradient-to-r from-boutique-rose via-boutique-gold to-boutique-rose mx-auto my-3 rounded-full" />
                </div>

                {/* 3 Cards Side-by-Side on all screen sizes */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.link}
                            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] sm:aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500 block border border-boutique-muted-border/40"
                        >
                            {/* Image */}
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                sizes="(max-width: 768px) 33vw, 33vw"
                                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                            />

                            {/* Bottom Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-boutique-rose/80 group-hover:via-boutique-rose/30 transition-colors duration-500" />

                            {/* Category Title Centered at Bottom */}
                            <div className="absolute inset-x-0 bottom-0 pb-4 sm:pb-8 text-center z-10 px-1">
                                <h3 className="font-serif-editorial text-lg sm:text-4xl lg:text-5xl font-bold tracking-wider text-white drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                                    {cat.name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
