"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], productName = "Outfit" }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[3/4] bg-neutral-100 rounded-3xl flex items-center justify-center text-neutral-400">
                No image available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md bg-white border border-boutique-muted-border">
                <Image
                    src={images[selectedImageIndex]}
                    alt={`${productName} — Designs by Nisha New Delhi`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center transition-all duration-500 hover:scale-105"
                />
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${idx === selectedImageIndex
                                    ? "border-boutique-rose ring-2 ring-boutique-rose/20 scale-105"
                                    : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover object-center"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
