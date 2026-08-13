"use client";

import { useState } from "react";
import { X } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/config/boutique";

export default function FloatingWhatsApp() {
    const [showTooltip, setShowTooltip] = useState(true);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center group">
            {/* Desktop Floating Tooltip */}
            {showTooltip && (
                <div className="hidden sm:flex items-center space-x-2 bg-white text-boutique-charcoal px-3 py-1.5 rounded-xl shadow-lg border border-boutique-muted-border mr-3 text-xs animate-in fade-in slide-in-from-right duration-300">
                    <span className="font-medium">Direct Boutique Enquiry</span>
                    <button
                        onClick={() => setShowTooltip(false)}
                        className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                        aria-label="Dismiss tooltip"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Floating Button */}
            <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Chat with Designs by Nisha on WhatsApp"
            >
                <WhatsAppIcon className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            </a>
        </div>
    );
}
