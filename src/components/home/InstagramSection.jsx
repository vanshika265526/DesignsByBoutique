import Image from "next/image";
import { Instagram, ArrowUpRight } from "lucide-react";
import { boutiqueConfig } from "@/config/boutique";
import { lookbookItems } from "@/data/products";
import SectionHeading from "@/components/ui/SectionHeading";

export default function InstagramSection() {
    return (
        <section className="py-24 bg-boutique-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <SectionHeading
                        badge="INSTAGRAM LOOKBOOK"
                        title="Follow Her Story"
                        subtitle="Get daily bridal fitting inspiration, behind-the-scenes embroidery reels, and new arrivals."
                        centered={false}
                    />

                    <a
                        href={boutiqueConfig.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm self-start md:self-auto"
                    >
                        <Instagram className="w-4 h-4" />
                        <span>{boutiqueConfig.instagram.handle}</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>

                {/* Editorial Instagram Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {lookbookItems.map((item) => (
                        <a
                            key={item.id}
                            href={boutiqueConfig.instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 block border border-boutique-muted-border/60"
                        >
                            <Image
                                src={item.image}
                                alt={`${item.title} — Designs by Nisha Instagram`}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-boutique-rose/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                                <Instagram className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
