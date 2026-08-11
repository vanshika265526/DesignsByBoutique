"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Instagram, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";
import { initialCategories } from "@/data/products";

import AnnouncementBanner from "@/components/layout/AnnouncementBanner";

// Category emoji tags for visual richness
const categoryEmoji = {
    "suits-anarkalis": "✨",
    "bridal-lehengas": "👰",
    "maternity-gowns": "🌸",
    "baby-ethnic-wear": "🎀",
    "haldi-mehndi": "💛",
    "festive-sarees": "🪷",
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCollectionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setCollectionsOpen(false);
    }, [pathname]);

    const simpleLinks = [
        { name: "Home", href: "/" },
        { name: "Our Story", href: "/our-story" },
        { name: "Gallery", href: "/gallery" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 transition-all duration-300 border-b border-boutique-muted-border/50 shadow-sm overflow-hidden"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=60&w=1920&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center 30%",
            }}
        >
            {/* Same warm overlay as hero so text stays legible */}
            <div className="absolute inset-0 bg-[#FAF7F2]/88 backdrop-blur-md pointer-events-none" />
            {/* All content above overlay */}
            <div className="relative z-10">
                <AnnouncementBanner />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="group focus:outline-none flex-shrink-0" aria-label="Designs by Nisha Boutique — Home">
                            <Image
                                src="/images/logo.png"
                                alt="Designs by Nisha Boutique New Delhi"
                                width={200}
                                height={90}
                                priority
                                className="h-14 sm:h-16 w-auto object-contain transition-all duration-300 group-hover:opacity-75"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {/* Home */}
                            <Link
                                href="/"
                                className={`text-sm tracking-wide transition-colors relative py-1 font-medium ${pathname === "/"
                                    ? "text-boutique-rose font-semibold"
                                    : "text-boutique-charcoal hover:text-boutique-rose"
                                    }`}
                            >
                                Home
                                {pathname === "/" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-boutique-rose rounded-full" />}
                            </Link>

                            {/* Collections Mega Dropdown */}
                            <div
                                className="relative py-2"
                                ref={dropdownRef}
                                onMouseEnter={() => setCollectionsOpen(true)}
                                onMouseLeave={() => setCollectionsOpen(false)}
                            >
                                <Link
                                    href="/collections"
                                    onClick={() => setCollectionsOpen(false)}
                                    onFocus={() => setCollectionsOpen(true)}
                                    className={`inline-flex items-center space-x-1 text-sm tracking-wide transition-colors relative py-1 font-medium ${pathname.startsWith("/collections")
                                        ? "text-boutique-rose font-semibold"
                                        : "text-boutique-charcoal hover:text-boutique-rose"
                                        }`}
                                >
                                    <span>Collections</span>
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${collectionsOpen ? "rotate-180 text-boutique-rose" : ""}`}
                                    />
                                    {pathname.startsWith("/collections") && (
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-boutique-rose rounded-full" />
                                    )}
                                </Link>

                                {/* Invisible bridge container to prevent mouseleave gap & Mega Dropdown */}
                                {collectionsOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[540px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200/90 overflow-hidden">
                                            {/* Dropdown Header */}
                                            <div className="bg-gradient-to-r from-boutique-rose/10 to-boutique-blush/20 px-6 py-3.5 border-b border-neutral-100 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold text-boutique-rose uppercase tracking-[0.15em] flex items-center space-x-1.5">
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                        <span>For Every Chapter of Her Story</span>
                                                    </p>
                                                    <p className="text-[11px] text-neutral-500 mt-0.5">Explore our handcrafted couture & pret ensembles</p>
                                                </div>
                                                <span className="text-[10px] bg-white/80 border border-boutique-rose/20 text-boutique-rose font-mono px-2 py-0.5 rounded-full font-bold">
                                                    {initialCategories.length} Categories
                                                </span>
                                            </div>

                                            {/* Category Grid */}
                                            <div className="grid grid-cols-2 gap-1 p-3">
                                                {initialCategories.map((cat) => (
                                                    <Link
                                                        key={cat.id}
                                                        href={`/collections/${cat.slug}`}
                                                        onClick={() => setCollectionsOpen(false)}
                                                        className="group flex items-center space-x-3 p-2.5 rounded-xl hover:bg-boutique-rose/5 transition-all border border-transparent hover:border-boutique-rose/20"
                                                    >
                                                        <div className="w-11 h-11 rounded-xl overflow-hidden relative flex-shrink-0 border border-neutral-200 group-hover:border-boutique-rose/50 transition-colors shadow-2xs">
                                                            <Image
                                                                src={cat.image}
                                                                alt={cat.name}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                sizes="44px"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold text-boutique-charcoal group-hover:text-boutique-rose transition-colors line-clamp-1">
                                                                {categoryEmoji[cat.id] || "✦"} {cat.name}
                                                            </p>
                                                            <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                                                                {cat.description}
                                                            </p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* View All Footer */}
                                            <div className="border-t border-neutral-100 p-2.5 bg-neutral-50/50">
                                                <Link
                                                    href="/collections"
                                                    onClick={() => setCollectionsOpen(false)}
                                                    className="flex items-center justify-center w-full py-2.5 text-xs font-bold text-boutique-rose bg-white border border-boutique-rose/30 hover:bg-boutique-rose hover:text-white rounded-xl transition-all shadow-2xs"
                                                >
                                                    View All Boutique Collections & Chapters →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Other Nav Links */}
                            {simpleLinks.slice(1).map((link) => {
                                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`text-sm tracking-wide transition-colors relative py-1 font-medium ${isActive
                                            ? "text-boutique-rose font-semibold"
                                            : "text-boutique-charcoal hover:text-boutique-rose"
                                            }`}
                                    >
                                        {link.name}
                                        {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-boutique-rose rounded-full" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Social & CTA */}
                        <div className="hidden md:flex items-center space-x-4">
                            <a
                                href={boutiqueConfig.instagram.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-boutique-charcoal hover:text-boutique-rose transition-colors"
                                aria-label="Instagram Profile"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>

                            <a
                                href={buildWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all shadow-sm hover:shadow"
                            >
                                <MessageCircle className="w-4 h-4 text-white" />
                                <span>WhatsApp Enquiry</span>
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center space-x-3">
                            <a
                                href={buildWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-emerald-600 text-white rounded-full"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-boutique-charcoal focus:outline-none"
                                aria-label="Toggle Navigation Menu"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6 text-boutique-rose" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden glass-nav border-t border-boutique-muted-border px-6 py-6 space-y-2 animate-in slide-in-from-top duration-300">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block text-base font-serif-editorial py-2.5 border-b border-boutique-muted-border/40 ${pathname === "/" ? "text-boutique-rose font-bold" : "text-boutique-charcoal"
                                }`}
                        >
                            Home
                        </Link>

                        {/* Mobile Collections Accordion */}
                        <div className="border-b border-boutique-muted-border/40">
                            <button
                                onClick={() => setMobileCollectionsOpen((v) => !v)}
                                className="w-full flex items-center justify-between text-base font-serif-editorial py-2.5 text-boutique-charcoal"
                            >
                                <span className={pathname.startsWith("/collections") ? "text-boutique-rose font-bold" : ""}>
                                    Collections
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${mobileCollectionsOpen ? "rotate-180" : ""}`} />
                            </button>

                            {mobileCollectionsOpen && (
                                <div className="pb-3 space-y-1">
                                    <Link
                                        href="/collections"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 text-xs font-semibold text-boutique-rose uppercase tracking-wider"
                                    >
                                        All Collections →
                                    </Link>
                                    {initialCategories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/collections/${cat.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-boutique-rose/5"
                                        >
                                            <div className="w-8 h-8 rounded-lg overflow-hidden relative flex-shrink-0 border border-neutral-200">
                                                <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="32px" />
                                            </div>
                                            <span className="text-sm text-boutique-charcoal font-medium">
                                                {categoryEmoji[cat.id] || "✦"} {cat.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {simpleLinks.slice(1).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block text-base font-serif-editorial py-2.5 border-b border-boutique-muted-border/40 ${pathname === link.href ? "text-boutique-rose font-bold" : "text-boutique-charcoal"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-4 flex items-center justify-between">
                            <a
                                href={boutiqueConfig.instagram.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-sm text-boutique-charcoal font-medium"
                            >
                                <Instagram className="w-4 h-4 text-boutique-rose" />
                                <span>{boutiqueConfig.instagram.handle}</span>
                            </a>

                            <a
                                href={buildWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-medium uppercase"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
