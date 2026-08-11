"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, Video, Share2, Check, X } from "lucide-react";

export default function ProductGallery({ images = [], productName = "Outfit", instagramReel = null }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[3/4] bg-neutral-100 rounded-3xl flex items-center justify-center text-neutral-400">
                No image available
            </div>
        );
    }

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="space-y-4 relative">
            {/* Main Image Display */}
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-md bg-white border border-boutique-muted-border group">
                <Image
                    src={images[selectedImageIndex]}
                    alt={`${productName} — Designs by Nisha New Delhi`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center transition-all duration-500 group-hover:scale-105"
                />

                {/* Interactive Action Badges */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                    {/* Zoom Button */}
                    <button
                        onClick={() => setLightboxOpen(true)}
                        className="p-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-md text-boutique-charcoal hover:text-boutique-rose transition-all"
                        title="Zoom Image"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Share Button */}
                    <button
                        onClick={handleShare}
                        className="p-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-md text-boutique-charcoal hover:text-boutique-rose transition-all"
                        title="Share Outfit Link"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>

                    {/* Instagram Reel Button */}
                    {instagramReel && (
                        <a
                            href={instagramReel}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-semibold shadow-md hover:opacity-95 transition-all"
                        >
                            <Video className="w-3.5 h-3.5" />
                            <span>Watch Reel</span>
                        </a>
                    )}
                </div>

                {copied && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-boutique-charcoal text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl animate-in fade-in slide-in-from-bottom-2">
                        Link copied to clipboard!
                    </div>
                )}
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

            {/* Lightbox Zoom Modal */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all z-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
                        <img
                            src={images[selectedImageIndex]}
                            alt={productName}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

