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

    const startLoading = () => {
        setLoading(true);
        clearTimeout(safetyTimer.current);
        safetyTimer.current = setTimeout(() => setLoading(false), 4000);
    };

    // Fast path: any real <a>/Link click — fires the instant the tap lands,
    // before Next.js even starts the route transition.
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

            startLoading();
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    // Catch-all: any navigation the click-listener above can't see — a button
    // or image with an onClick that calls router.push()/replace() instead of
    // rendering a real <a>. Every App Router navigation ultimately goes
    // through the History API, so hooking it here catches literally all of
    // them regardless of what triggered the click.
    useEffect(() => {
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
            startLoading();
            return originalPushState.apply(this, args);
        };
        window.history.replaceState = function (...args) {
            startLoading();
            return originalReplaceState.apply(this, args);
        };
        window.addEventListener("popstate", startLoading);

        return () => {
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
            window.removeEventListener("popstate", startLoading);
        };
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
