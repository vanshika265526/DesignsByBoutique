"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";

export default function AnnouncementBanner() {
    const [banner, setBanner] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    const dismissBanner = useCallback(() => {
        setDismissed(true);
    }, []);

    useEffect(() => {
        fetch("/api/data/settings")
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data?.announcementBanner) {
                    setBanner(json.data.announcementBanner);
                    setDismissed(false);
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!banner || dismissed || !banner.enabled || !banner.message) return;

        // Show the promotion once at the beginning of each page load, then
        // remove it after the single ticker pass.
        const timeout = window.setTimeout(dismissBanner, 12000);
        return () => window.clearTimeout(timeout);
    }, [banner, dismissed, dismissBanner]);

    if (dismissed || !banner || !banner.enabled || !banner.message) {
        return null;
    }

    const bgStyles = {
        rose: "bg-gradient-to-r from-rose-900 via-pink-800 to-rose-950 text-rose-50 border-rose-800/40",
        gold: "bg-gradient-to-r from-amber-950 via-amber-900 to-yellow-950 text-amber-100 border-amber-800/40",
        dark: "bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 border-neutral-800/40",
        emerald: "bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-100 border-emerald-800/40",
    };

    const activeBgClass = bgStyles[banner.bgType || "rose"] || bgStyles.rose;

    return (
        <div className={`relative z-40 h-9 border-b overflow-hidden text-xs px-4 shadow-sm transition-all duration-300 ${activeBgClass}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Ticker Content Wrapper */}
                <div className="flex h-9 flex-1 items-center overflow-hidden">
                    <div className="flex items-center space-x-3 animate-announcement-once whitespace-nowrap">
                        <span className="inline-flex items-center space-x-1 font-semibold tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse flex-shrink-0" />
                            <span>{banner.message}</span>
                        </span>

                        {banner.linkUrl && (
                            <Link
                                href={banner.linkUrl}
                                className="inline-flex items-center space-x-1 font-bold underline underline-offset-4 hover:text-white transition-colors uppercase tracking-wider text-[11px] ml-3"
                            >
                                <span>{banner.linkText || "Learn More"}</span>
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Dismiss Button */}
                <button
                    onClick={dismissBanner}
                    className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors flex-shrink-0 ml-2 self-center"
                    title="Dismiss Announcement"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
