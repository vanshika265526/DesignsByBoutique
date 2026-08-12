"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { initialCategories } from "@/data/products";

export default function ShopByCategory() {
    return (
        <section className="py-16 md:py-24 bg-boutique-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-boutique-gold font-semibold mb-3">
                        The Boutique
                    </p>
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-boutique-charcoal">
                        Shop by Category
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-boutique-taupe font-light">
                        Curated selections for every occasion in her story.
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                    {initialCategories.map((cat) => (
                        <Link
                            key={cat.id || cat.slug}
                            href={`/collections/${cat.slug}`}
                            className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-500 block border border-boutique-muted-border/50"
                        >
                            <Image
                                src={cat.image || "/images/placeholder.jpg"}
                                alt={cat.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Bottom Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-boutique-charcoal/85 via-boutique-charcoal/10 to-transparent" />

                            {/* Category Label */}
                            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 z-10">
                                <h3 className="font-serif-editorial text-lg sm:text-2xl font-semibold tracking-wide text-white leading-tight">
                                    {cat.name}
                                </h3>
                                <span className="mt-1 inline-flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/85 font-medium">
                                    Explore
                                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </div>
                        </Link>
                    ))}

                    {/* View-all card to balance the grid */}
                    <Link
                        href="/collections"
                        className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/5] flex flex-col items-center justify-center text-center p-6 bg-boutique-rose text-white transition-all duration-500 hover:bg-boutique-rose-dark"
                    >
                        <span className="font-serif-editorial text-xl sm:text-2xl font-semibold leading-tight">
                            View All Collections
                        </span>
                        <span className="mt-3 inline-flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-boutique-gold-light font-medium">
                            Browse the Boutique
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
