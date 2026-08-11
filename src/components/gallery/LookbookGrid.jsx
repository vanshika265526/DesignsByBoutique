"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand, Sparkles } from "lucide-react";
import { lookbookItems } from "@/data/products";
import LightboxModal from "./LightboxModal";

export default function LookbookGrid() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeItem, setActiveItem] = useState(null);

    const categories = ["All", "Bridal", "Festive", "Maternity", "Women's Wear", "Baby"];

    const filteredItems =
        selectedCategory === "All"
            ? lookbookItems
            : lookbookItems.filter((item) => item.category === selectedCategory);

    return (
        <div className="space-y-8">
            {/* Category Filter Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all border ${selectedCategory === cat
                                ? "bg-boutique-rose text-white border-boutique-rose shadow-sm"
                                : "bg-white text-boutique-charcoal border-boutique-muted-border hover:border-boutique-rose/40"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Editorial Masonry Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border border-boutique-muted-border aspect-[3/4]"
                    >
                        <Image
                            src={item.image}
                            alt={`${item.title} — Designs by Nisha Lookbook`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-boutique-gold font-semibold">
                                {item.category}
                            </span>
                            <h3 className="font-serif-editorial text-2xl font-bold text-white">
                                {item.title}
                            </h3>
                            <p className="text-xs text-neutral-300 flex items-center space-x-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Expand className="w-3.5 h-3.5 text-boutique-blush" />
                                <span>Click to expand view</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {activeItem && (
                <LightboxModal item={activeItem} onClose={() => setActiveItem(null)} />
            )}
        </div>
    );
}
