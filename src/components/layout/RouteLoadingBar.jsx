"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Small centered loading screen that appears the instant a visitor clicks any
// internal link — a product card, category image, nav item, or search result
// — so there's always visible feedback that "something is happening" instead
// of a stale-feeling wait.
//
// Deliberately click-driven only (not a history.pushState patch): browser
// back/forward is never a click on our own page, so this can't ever fire for
// it by construction — no timing race against Next.js's internal popstate
// handling needed. Also deliberately keyed on pathname only (not
// useSearchParams()), which would otherwise force this into a Suspense
// boundary that can suspend and remount mid-navigation, silently resetting
// the loading state right when it's supposed to show.

// A navigation that resolves in a handful of milliseconds (warm local dev, a
// cached route) would otherwise make the screen flash for less than a frame —
// invisible to a human, which reads as "no loader at all". Enforcing a floor
// keeps it perceptible on every click regardless of how fast the route is.
const MIN_VISIBLE_MS = 500;

export default function RouteLoadingBar() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const safetyTimer = useRef(null);
    const finishTimer = useRef(null);
    const startedAt = useRef(0);
    const mounted = useRef(false);

    const startLoading = () => {
        clearTimeout(finishTimer.current);
        startedAt.current = Date.now();
        setLoading(true);
        clearTimeout(safetyTimer.current);
        safetyTimer.current = setTimeout(() => setLoading(false), 4000);
    };

    const finishLoading = () => {
        const elapsed = Date.now() - startedAt.current;
        clearTimeout(finishTimer.current);
        clearTimeout(safetyTimer.current);
        if (elapsed >= MIN_VISIBLE_MS) {
            setLoading(false);
        } else {
            finishTimer.current = setTimeout(() => setLoading(false), MIN_VISIBLE_MS - elapsed);
        }
    };

    // Any real <a>/Link click (product cards, category images, nav links,
    // search results) — fires the instant the tap lands, before Next.js even
    // starts the route transition. Note: a Next.js <Link> ALWAYS calls
    // event.preventDefault() as the first step of its own client-side
    // navigation (that's how it stops the browser's native full-page
    // reload), so defaultPrevented is expected to already be true here — it
    // is NOT a signal to skip.
    useEffect(() => {
        const handleClick = (event) => {
            if (event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const anchor = event.target.closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
            if (anchor.hasAttribute("download") || anchor.target === "_blank") return;

            let destination;
            try {
                destination = new URL(href, window.location.href);
            } catch {
                return;
            }
            if (destination.origin !== window.location.origin) return;
            if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

            startLoading();
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        if (mounted.current) {
            finishLoading();
        }
        mounted.current = true;
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-boutique-charcoal/40 backdrop-blur-[4px] animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-5 rounded-[28px] bg-boutique-bg-card px-12 py-10 shadow-2xl border border-boutique-gold/25 animate-in zoom-in-95 fade-in duration-300">
                {/* Jewel-frame emblem: two counter-rotating gold rings around the boutique mark, with a soft ambient glow */}
                <div className="relative w-20 h-20">
                    <div
                        className="absolute -inset-2 rounded-full opacity-60"
                        style={{ boxShadow: "0 0 24px 4px rgba(176, 140, 79, 0.35)" }}
                    />
                    <div className="absolute inset-0 rounded-full border border-boutique-gold/20" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-boutique-gold border-r-boutique-gold/70 animate-spin" />
                    <div
                        className="absolute inset-1 rounded-full border border-transparent border-b-boutique-rose/50"
                        style={{ animation: "spin 2.4s linear infinite reverse" }}
                    />
                    <div className="absolute inset-[6px] rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center">
                        <Image
                            src="/images/logo-transparent.png"
                            alt=""
                            fill
                            sizes="72px"
                            className="object-contain p-2 animate-pulse"
                        />
                    </div>
                </div>

                {/* Brand wordmark, matching the navbar treatment */}
                <div className="flex flex-col items-center gap-1.5">
                    <h2 className="font-serif-editorial text-base font-bold uppercase tracking-wide leading-none">
                        <span className="text-boutique-charcoal">Designs by </span>
                        <span className="text-gold-gradient italic">Nisha</span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="h-px w-4 bg-gradient-to-r from-transparent to-boutique-gold/70" />
                        <span className="font-serif-editorial italic text-xs text-boutique-rose tracking-wide whitespace-nowrap">
                            Curating your next chapter…
                        </span>
                        <span className="h-px w-4 bg-gradient-to-l from-transparent to-boutique-gold/70" />
                    </div>
                </div>
            </div>
        </div>
    );
}
