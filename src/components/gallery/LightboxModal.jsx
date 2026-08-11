"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, MapPin } from "lucide-react";
import { buildWhatsAppLink } from "@/config/boutique";

export default function LightboxModal({ item, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!item) return null;

    const whatsappUrl = buildWhatsAppLink({
        customMessage: `Hi Designs by Nisha! I saw "${item.title}" (${item.category}) in your lookbook gallery and would love to know more.`,
        productImage: item.image,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative max-w-4xl w-full bg-boutique-bg rounded-3xl overflow-hidden shadow-2xl border border-boutique-muted-border grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-boutique-charcoal rounded-full shadow-md transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Modal Image Left */}
                <div className="md:col-span-7 relative aspect-[3/4] md:aspect-auto min-h-[350px] bg-black">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover object-center"
                    />
                </div>

                {/* Modal Information Right */}
                <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                        <span className="text-xs uppercase tracking-[0.25em] text-boutique-gold font-semibold">
                            {item.category} • LOOKBOOK
                        </span>
                        <h3 className="font-serif-editorial text-2xl sm:text-3xl text-boutique-charcoal font-bold">
                            {item.title}
                        </h3>

                        <div className="flex items-center space-x-2 text-xs text-boutique-taupe pt-2">
                            <MapPin className="w-4 h-4 text-boutique-rose flex-shrink-0" />
                            <span>Location: {item.location || "Designs by Nisha Atelier New Delhi"}</span>
                        </div>

                        <p className="text-xs text-boutique-taupe leading-relaxed font-light pt-2">
                            Every outfit featured in our lookbook gallery can be customized to your precise measurements and color preference at our New Delhi atelier.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-boutique-muted-border space-y-3">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Enquire About Outfit</span>
                        </a>

                        <button
                            onClick={onClose}
                            className="w-full text-center text-xs text-boutique-taupe hover:text-boutique-rose py-2"
                        >
                            Back to Gallery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
