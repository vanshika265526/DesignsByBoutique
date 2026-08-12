"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Instagram, Menu, X, ChevronDown } from "lucide-react";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";
import { initialCategories } from "@/data/products";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCollectionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setCollectionsOpen(false);
    }, [pathname]);

    const linkClass = (active) =>
        `text-[11px] uppercase tracking-[0.18em] font-medium transition-colors ${
            active ? "text-boutique-rose" : "text-boutique-charcoal hover:text-boutique-rose"
        }`;

    const isCollections = pathname.startsWith("/collections");

    return (
        <header className="sticky top-0 left-0 right-0 z-50 glass-nav">
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-2 md:grid-cols-3 items-center h-[72px] md:h-20">
                    {/* Left: desktop nav */}
                    <nav className="hidden md:flex items-center gap-7">
                        <Link href="/" className={linkClass(pathname === "/")}>Home</Link>

                        <div
                            className="relative"
                            ref={dropdownRef}
                            onMouseEnter={() => setCollectionsOpen(true)}
                            onMouseLeave={() => setCollectionsOpen(false)}
                        >
                            <Link
                                href="/collections"
                                className={`inline-flex items-center gap-1 ${linkClass(isCollections)}`}
                            >
                                Collections
                                <ChevronDown className={`w-3 h-3 transition-transform ${collectionsOpen ? "rotate-180" : ""}`} />
                            </Link>

                            {collectionsOpen && (
                                <div className="absolute top-full left-0 pt-4 w-64 z-50">
                                    <div className="bg-boutique-bg-card rounded-lg shadow-xl border border-boutique-muted-border overflow-hidden py-2">
                                        {initialCategories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/collections/${cat.slug}`}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-boutique-blush/40 transition-colors"
                                            >
                                                <div className="w-9 h-9 rounded-md overflow-hidden relative flex-shrink-0 border border-boutique-muted-border">
                                                    <Image src={cat.image || "/images/placeholder.jpg"} alt={cat.name} fill className="object-cover" sizes="36px" />
                                                </div>
                                                <span className="text-xs font-medium text-boutique-charcoal tracking-wide">{cat.name}</span>
                                            </Link>
                                        ))}
                                        <Link
                                            href="/collections"
                                            className="block px-4 pt-2.5 mt-1 border-t border-boutique-muted-border text-[11px] uppercase tracking-[0.18em] font-semibold text-boutique-rose"
                                        >
                                            View All →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/gallery" className={linkClass(pathname.startsWith("/gallery"))}>Gallery</Link>
                    </nav>

                    {/* Center: logo */}
                    <div className="flex items-center justify-start md:justify-center">
                        <Link href="/" className="group flex-shrink-0" aria-label="Designs by Nisha — Home">
                            <span className="relative block h-14 w-[140px] md:h-16 md:w-[170px]">
                                <Image
                                    src="/images/logo.png?v=redesign"
                                    alt="Designs by Nisha Boutique New Delhi"
                                    fill
                                    priority
                                    sizes="(min-width: 768px) 170px, 140px"
                                    className="object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                                />
                            </span>
                        </Link>
                    </div>

                    {/* Right: links + social */}
                    <div className="flex items-center justify-end gap-5">
                        <Link href="/our-story" className={`hidden lg:inline ${linkClass(pathname.startsWith("/our-story"))}`}>Our Story</Link>
                        <Link href="/contact" className={`hidden lg:inline ${linkClass(pathname.startsWith("/contact"))}`}>Contact</Link>

                        <a
                            href={boutiqueConfig.instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline text-boutique-charcoal hover:text-boutique-rose transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-[18px] h-[18px]" />
                        </a>

                        <a
                            href={buildWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center gap-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-4 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase transition-all"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Enquire
                        </a>

                        {/* Mobile controls */}
                        <a
                            href={buildWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="md:hidden p-2 bg-boutique-rose text-white rounded-full"
                            aria-label="WhatsApp"
                        >
                            <MessageCircle className="w-4 h-4" />
                        </a>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-1 text-boutique-charcoal"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-nav border-t border-boutique-muted-border px-6 py-5 space-y-1 animate-in slide-in-from-top duration-300">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`block font-serif-editorial text-lg py-2.5 border-b border-boutique-muted-border/50 ${pathname === "/" ? "text-boutique-rose" : "text-boutique-charcoal"}`}>Home</Link>

                    <div className="border-b border-boutique-muted-border/50">
                        <button
                            onClick={() => setMobileCollectionsOpen((v) => !v)}
                            className="w-full flex items-center justify-between font-serif-editorial text-lg py-2.5 text-boutique-charcoal"
                        >
                            <span className={isCollections ? "text-boutique-rose" : ""}>Collections</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${mobileCollectionsOpen ? "rotate-180" : ""}`} />
                        </button>
                        {mobileCollectionsOpen && (
                            <div className="pb-3 space-y-1">
                                <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-[11px] font-semibold text-boutique-rose uppercase tracking-[0.18em]">All Collections →</Link>
                                {initialCategories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        href={`/collections/${cat.slug}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-boutique-blush/40"
                                    >
                                        <div className="w-8 h-8 rounded-md overflow-hidden relative flex-shrink-0 border border-boutique-muted-border">
                                            <Image src={cat.image || "/images/placeholder.jpg"} alt={cat.name} fill className="object-cover" sizes="32px" />
                                        </div>
                                        <span className="text-sm text-boutique-charcoal font-medium">{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {[
                        { name: "Gallery", href: "/gallery" },
                        { name: "Our Story", href: "/our-story" },
                        { name: "Contact", href: "/contact" },
                    ].map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block font-serif-editorial text-lg py-2.5 border-b border-boutique-muted-border/50 ${pathname.startsWith(link.href) ? "text-boutique-rose" : "text-boutique-charcoal"}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="pt-4 flex items-center justify-between">
                        <a href={boutiqueConfig.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-boutique-charcoal font-medium">
                            <Instagram className="w-4 h-4 text-boutique-rose" />
                            <span>{boutiqueConfig.instagram.handle}</span>
                        </a>
                        <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-boutique-rose text-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
                            <MessageCircle className="w-4 h-4" />
                            Enquire
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
