"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Thin top-of-page progress bar that appears the instant a visitor clicks any
// internal link, and clears once the new route has actually rendered — so
// there's always visible feedback that "something is happening" during the
// (sometimes DB-backed, non-instant) navigation.
export default function RouteLoadingBar() {
    return (
        <Suspense fallback={null}>
            <RouteLoadingBarInner />
        </Suspense>
    );
}

function RouteLoadingBarInner() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const safetyTimer = useRef(null);
    const mounted = useRef(false);

    useEffect(() => {
        const handleClick = (event) => {
            if (event.defaultPrevented || event.button !== 0) return;
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

            setLoading(true);
            clearTimeout(safetyTimer.current);
            safetyTimer.current = setTimeout(() => setLoading(false), 4000);
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        if (mounted.current) {
            setLoading(false);
            clearTimeout(safetyTimer.current);
        }
        mounted.current = true;
    }, [pathname, searchParams]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden bg-transparent pointer-events-none">
            <div className="h-full w-full bg-gradient-to-r from-[#1F4A3B] via-[#B08C4F] to-[#1F4A3B] bg-[length:200%_100%] animate-route-loading-bar" />
        </div>
    );
}
