"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Expand } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { lookbookItems } from "@/data/products";

export default function GalleryPreviewSection() {
    // Show top 4 editorial lookbook items
    const previewItems = lookbookItems.slice(0, 4);

    return (
        <section className="py-24 bg-boutique-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <SectionHeading
                        badge="EDITORIAL LOOKBOOK"
                        title="Craftsmanship in Focus"
                        subtitle="A visual preview of our bespoke bridal drapes, festive embroidery, and studio portraiture."
                        centered={false}
                    />

                    <Link
                        href="/gallery"
                        className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-boutique-rose hover:text-boutique-rose-dark transition-colors self-start md:self-auto border-b border-boutique-rose pb-1"
                    >
                        <span>View Full Editorial Gallery</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {previewItems.map((item) => (
                        <Link
                            key={item.id}
                            href="/gallery"
                            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border border-boutique-muted-border aspect-[3/4] block"
                        >
                            <Image
                                src={item.image}
                                alt={`${item.title} — Designs by Nisha Lookbook`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-boutique-gold font-semibold">
                                    {item.category}
                                </span>
                                <h3 className="font-serif-editorial text-xl font-bold text-white leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-neutral-300 flex items-center space-x-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Expand className="w-3.5 h-3.5 text-boutique-blush" />
                                    <span>Explore Gallery</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
