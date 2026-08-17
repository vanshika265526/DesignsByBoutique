"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/config/boutique";

export default function LightboxModal({ item, onClose }) {
    useEffect(() => {
        // Lock background scroll while the modal is open (kills the page scrollbar).
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    if (!item) return null;

    const whatsappUrl = buildWhatsAppLink({
        customMessage: `Hi Designs by Nisha! I saw "${item.title}" (${item.category}) in your lookbook gallery and would love to know more.`,
        productImage: item.image,
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="relative max-w-3xl w-full bg-boutique-bg rounded-3xl overflow-hidden shadow-2xl border border-boutique-muted-border grid grid-cols-1 md:grid-cols-12 max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/85 hover:bg-white text-boutique-charcoal rounded-full shadow-md transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image — height capped on phone so the info + button stay on screen */}
                <div className="md:col-span-7 relative bg-black h-[40vh] md:h-auto md:min-h-[480px]">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover object-center"
                    />
                </div>

                {/* Info */}
                <div className="md:col-span-5 p-5 sm:p-8 flex flex-col justify-center gap-6">
                    <div className="space-y-2.5">
                        <span className="text-[11px] uppercase tracking-[0.25em] text-boutique-gold font-semibold">
                            {item.category} • Lookbook
                        </span>
                        <h3 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl text-boutique-charcoal font-bold leading-tight">
                            {item.title}
                        </h3>

                        <div className="flex items-center gap-2 text-[11px] text-boutique-taupe">
                            <MapPin className="w-3.5 h-3.5 text-boutique-rose flex-shrink-0" />
                            <span>{item.location || "Designs by Nisha Atelier, New Delhi"}</span>
                        </div>

                        <p className="text-xs text-boutique-taupe leading-relaxed font-light pt-1">
                            Tailored to your measurements and colour preference at our New Delhi atelier.
                        </p>
                    </div>

                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>Enquire About This Outfit</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
