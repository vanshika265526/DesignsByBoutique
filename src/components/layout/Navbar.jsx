"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight, Sparkles, Search } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";
import { categoriesTaxonomy } from "@/data/products";

const LEGACY_CATEGORY_SLUGS = {
    "suits-anarkalis": "her-beginning",
    "gowns-lehengas": "her-bridal-story",
    "haldi-mehendi": "her-big-day",
    "bridal-lehengas": "her-big-day",
    "maternity-gowns": "maternity",
    "baby-clothes": "baby-girl-dresses",
};

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
    const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [liveCategories, setLiveCategories] = useState([]);

    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setCollectionsOpen(false);
                setHoveredCategory(null);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setCollectionsOpen(false);
        setHoveredCategory(null);
        setSearchOpen(false);
        setSearchQuery("");
    }, [pathname]);

    useEffect(() => {
        fetch("/api/data/categories", { cache: "no-store" })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) setLiveCategories(result.data || []);
            })
            .catch((error) => console.error("Failed to load category navigation:", error));
    }, []);

    useEffect(() => {
        fetch("/api/data/products?status=published", { cache: "no-store" })
            .then((response) => response.json())
            .then((result) => {
                if (result.success) setProducts(result.data || []);
            })
            .catch((error) => console.error("Failed to load product search:", error));
    }, []);

    const searchTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const searchResults = searchTerms.length > 0
        ? products
            .filter((product) => {
                const searchableText = [
                    product.name,
                    product.categoryName,
                    product.category,
                    product.subcategory,
                    product.shortDescription,
                    product.description,
                    product.chapterName,
                    ...(product.details || []),
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return searchTerms.every((term) => searchableText.includes(term));
            })
            .slice(0, 6)
        : [];
    const navigationCategories = categoriesTaxonomy.map((taxonomyCategory) => {
        const liveCategory = liveCategories.find((category) =>
            (LEGACY_CATEGORY_SLUGS[category.slug] || category.slug) === taxonomyCategory.slug
        );
        return {
            ...taxonomyCategory,
            ...(liveCategory || {}),
            slug: taxonomyCategory.slug,
            subcategories: liveCategory?.subcategories?.length
                ? liveCategory.subcategories
                : taxonomyCategory.subcategories,
        };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));

    const handleSearchKeyDown = (event) => {
        if (event.key === "Escape") {
            setSearchOpen(false);
            setSearchQuery("");
        }
        if (event.key === "Enter" && searchResults[0]) {
            router.push(`/product/${searchResults[0].slug}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const linkClass = (active) =>
        `text-[11px] uppercase tracking-[0.18em] transition-colors ${active ? "text-boutique-rose font-bold" : "text-boutique-charcoal font-medium hover:text-boutique-rose"
        }`;

    const mobileLinkClass = (active) =>
        `flex items-center font-serif-editorial text-lg py-2.5 pl-3 border-b border-boutique-muted-border/50 border-l-4 rounded-r transition-colors ${active
            ? "text-boutique-rose font-bold bg-boutique-blush/40 border-l-boutique-rose"
            : "text-boutique-charcoal font-normal border-l-transparent hover:text-boutique-rose"
        }`;

    const isCollections = pathname.startsWith("/collections");

    return (
        <header className="sticky top-0 left-0 right-0 z-50 glass-nav shadow-xs">
            <div className="w-full px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-3 items-center h-[80px] md:h-24">

                    {/* Left: Mobile Menu Toggle on Mobile, Main Desktop Nav (Home, Collections, Gallery) */}
                    <div className="flex items-center justify-start">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-1.5 text-boutique-charcoal hover:bg-boutique-blush/40 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <nav className="hidden md:flex items-center gap-7">
                            <Link href="/" className={linkClass(pathname === "/")}>Home</Link>

                            {/* Collections Dropdown with 2-Level Nested Dropdown */}
                            <div
                                className="relative"
                                ref={dropdownRef}
                                onMouseEnter={() => setCollectionsOpen(true)}
                                onMouseLeave={() => {
                                    setCollectionsOpen(false);
                                    setHoveredCategory(null);
                                }}
                            >
                                <Link
                                    href="/collections"
                                    className={`inline-flex items-center gap-1 ${linkClass(isCollections)}`}
                                >
                                    <span>Collections</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${collectionsOpen ? "rotate-180 text-boutique-rose" : ""}`} />
                                </Link>

                                {/* 1st Level Dropdown: List of 5 Main Categories */}
                                {collectionsOpen && (
                                    <div className="absolute top-full left-0 pt-3 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="bg-boutique-bg-card/95 backdrop-blur-md rounded-xl shadow-2xl border border-boutique-muted-border overflow-visible py-2 relative">

                                            <div className="px-4 py-1.5 mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-boutique-gold border-b border-boutique-muted-border/60">
                                                Boutique Categories
                                            </div>

                                            {navigationCategories.map((cat) => {
                                                const isCatHovered = hoveredCategory === cat.slug;
                                                const hasSubs = cat.subcategories && cat.subcategories.length > 0;

                                                return (
                                                    <div
                                                        key={cat.slug}
                                                        className="relative"
                                                        onMouseEnter={() => setHoveredCategory(cat.slug)}
                                                    >
                                                        <Link
                                                            href={`/collections/${cat.slug}`}
                                                            className={`flex items-center justify-between px-4 py-2.5 hover:bg-boutique-blush/50 transition-colors group/item ${isCatHovered ? "bg-boutique-blush/60 text-boutique-rose font-semibold" : ""
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-md overflow-hidden relative flex-shrink-0 border border-boutique-muted-border group-hover/item:scale-105 transition-transform duration-300">
                                                                    <Image
                                                                        src={cat.image || "/images/placeholder.jpg"}
                                                                        alt={cat.name}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="32px"
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-medium text-boutique-charcoal group-hover/item:text-boutique-rose transition-colors">
                                                                    {cat.name}
                                                                </span>
                                                            </div>

                                                            {hasSubs && (
                                                                <ChevronRight className={`w-3.5 h-3.5 text-boutique-taupe transition-transform group-hover/item:translate-x-0.5 ${isCatHovered ? "text-boutique-rose" : ""
                                                                    }`} />
                                                            )}
                                                        </Link>

                                                        {/* 2nd Level Nested Flyout Dropdown: Subcategories of Hovered Category */}
                                                        {isCatHovered && hasSubs && (
                                                            <div className="absolute left-full top-0 -ml-px w-64 z-50 animate-in fade-in slide-in-from-left-2 duration-200">
                                                                <div className="bg-boutique-bg-card/95 backdrop-blur-md rounded-xl shadow-2xl border border-boutique-muted-border p-2.5">
                                                                    <div className="px-3 py-1 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-boutique-gold border-b border-boutique-muted-border/60 flex items-center gap-1.5">
                                                                        <Sparkles className="w-3 h-3 text-boutique-gold" />
                                                                        {cat.name}
                                                                    </div>

                                                                    <div className="space-y-1">
                                                                        {cat.subcategories.map((sub) => (
                                                                            <Link
                                                                                key={sub.slug}
                                                                                href={`/collections/${cat.slug}?sub=${sub.slug}`}
                                                                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-boutique-blush/60 transition-colors group/sub"
                                                                            >
                                                                                <div className="w-7 h-7 rounded-md overflow-hidden relative flex-shrink-0 border border-boutique-muted-border">
                                                                                    <Image
                                                                                        src={sub.image || cat.image || "/images/placeholder.jpg"}
                                                                                        alt={sub.name}
                                                                                        fill
                                                                                        className="object-cover"
                                                                                        sizes="28px"
                                                                                    />
                                                                                </div>
                                                                                <span className="text-xs font-medium text-boutique-charcoal group-hover/sub:text-boutique-rose transition-colors">
                                                                                    {sub.name}
                                                                                </span>
                                                                            </Link>
                                                                        ))}
                                                                    </div>

                                                                    <Link
                                                                        href={`/collections/${cat.slug}`}
                                                                        className="block text-center mt-2 pt-2 border-t border-boutique-muted-border/60 text-[10px] uppercase tracking-[0.18em] font-semibold text-boutique-rose hover:text-boutique-rose-dark transition-colors"
                                                                    >
                                                                        Explore All {cat.name} →
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            <Link
                                                href="/collections"
                                                className="block px-4 pt-2.5 mt-1 border-t border-boutique-muted-border text-[11px] uppercase tracking-[0.18em] font-semibold text-boutique-rose hover:text-boutique-rose-dark transition-colors"
                                            >
                                                View All Collections →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/gallery" className={linkClass(pathname.startsWith("/gallery"))}>Gallery</Link>
                        </nav>
                    </div>

                    {/* Center: Brand Logo Centered */}
                    <div className="flex items-center justify-center">
                        <Link href="/" className="group flex-shrink-0" aria-label="Designs by Nisha — Home">
                            <span className="relative block h-16 w-[165px] sm:h-[72px] sm:w-[190px] md:h-[92px] md:w-[240px]">
                                <Image
                                    src="/images/logo-transparent.png"
                                    alt="Designs by Nisha Boutique New Delhi"
                                    fill
                                    priority
                                    sizes="(min-width: 768px) 240px, 190px"
                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </span>
                        </Link>
                    </div>

                    {/* Right: Secondary Links & CTAs */}
                    <div className="flex items-center justify-end gap-3 sm:gap-5">
                        <div className="relative" ref={searchRef}>
                            <button
                                type="button"
                                onClick={() => setSearchOpen((open) => !open)}
                                className="p-2 text-boutique-charcoal hover:bg-boutique-blush/60 rounded-full transition-colors"
                                aria-label="Search products"
                                aria-expanded={searchOpen}
                            >
                                <Search className="w-4 h-4" />
                            </button>

                            {searchOpen && (
                                <div className="fixed inset-x-3 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-96 max-h-[85vh] overflow-y-auto rounded-xl border border-boutique-muted-border bg-boutique-bg-card/95 backdrop-blur-md p-3.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-boutique-taupe" />
                                        <input
                                            autoFocus
                                            type="search"
                                            value={searchQuery}
                                            onChange={(event) => setSearchQuery(event.target.value)}
                                            onKeyDown={handleSearchKeyDown}
                                            placeholder="Search outfits, suits, gowns, frocks..."
                                            className="w-full pl-9 pr-8 py-2.5 bg-white border border-boutique-muted-border rounded-lg text-xs text-boutique-charcoal focus:outline-none focus:border-boutique-rose placeholder:text-boutique-taupe/70 shadow-inner"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-boutique-taupe hover:text-boutique-charcoal p-1 text-xs font-bold"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {/* Popular Search Suggestions when query is empty */}
                                    {!searchQuery.trim() && (
                                        <div className="mt-3 pt-2 border-t border-boutique-muted-border/60">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-boutique-gold mb-2">
                                                Popular Searches
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {["Anarkali", "Baby Frock", "Sharara", "Haldi", "Maternity Gowns", "Bridal Lehenga"].map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => setSearchQuery(tag)}
                                                        className="text-[11px] bg-white border border-boutique-muted-border/80 hover:border-boutique-rose hover:bg-boutique-blush/40 px-2.5 py-1 rounded-full text-boutique-charcoal transition-all"
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Live Search Results Dropdown */}
                                    {searchQuery.trim() && (
                                        <div className="mt-3 pt-2 border-t border-boutique-muted-border/60 space-y-1.5 max-h-80 overflow-y-auto scrollbar-thin">
                                            <div className="flex items-center justify-between px-1 mb-1">
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-boutique-gold">
                                                    Results ({searchResults.length})
                                                </span>
                                            </div>
                                            {searchResults.length > 0 ? (
                                                searchResults.map((product) => (
                                                    <Link
                                                        key={product.id || product.slug}
                                                        href={`/product/${product.slug}`}
                                                        onClick={() => setSearchOpen(false)}
                                                        className="flex items-center gap-3 p-2 rounded-lg bg-white/80 hover:bg-boutique-blush/50 border border-transparent hover:border-boutique-rose/30 transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-md overflow-hidden relative flex-shrink-0 border border-boutique-muted-border group-hover:scale-105 transition-transform">
                                                            <Image
                                                                src={product.image || "/images/placeholder.jpg"}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="40px"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs font-semibold text-boutique-charcoal group-hover:text-boutique-rose transition-colors truncate">
                                                                {product.name}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] text-boutique-taupe capitalize truncate">
                                                                    {product.subcategory || product.categoryName || "Boutique Outfit"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {product.price && (
                                                            <span className="text-xs font-bold text-boutique-rose flex-shrink-0">
                                                                ₹{Number(product.price).toLocaleString("en-IN")}
                                                            </span>
                                                        )}
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="py-4 text-center">
                                                    <p className="text-xs text-boutique-taupe">No outfits found matching &quot;{searchQuery}&quot;</p>
                                                    <p className="text-[11px] text-boutique-taupe/70 mt-1">Try searching for &quot;Anarkali&quot;, &quot;Frock&quot;, or &quot;Lehenga&quot;</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link href="/our-story" className={`hidden lg:inline ${linkClass(pathname.startsWith("/our-story"))}`}>Our Story</Link>
                        <Link href="/contact" className={`hidden lg:inline ${linkClass(pathname.startsWith("/contact"))}`}>Contact</Link>

                        <a
                            href={boutiqueConfig.instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center justify-center p-2 rounded-full hover:bg-boutique-blush/60 transition-colors"
                            aria-label="Instagram"
                        >
                            <InstagramIcon className="w-4 h-4" colored />
                        </a>

                        <a
                            href={buildWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-4 py-2 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase transition-all shadow-xs hover:shadow-md"
                        >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            Enquire
                        </a>

                        <a
                            href={buildWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm:hidden p-2 bg-boutique-rose text-white rounded-full shadow-xs flex items-center justify-center"
                            aria-label="WhatsApp"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-nav border-t border-boutique-muted-border px-5 py-4 space-y-2 animate-in slide-in-from-top duration-300 max-h-[85vh] overflow-y-auto">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass(pathname === "/")}>Home</Link>

                    {/* Collections Accordion with Nested Category & Subcategory Accordions */}
                    <div className="border-b border-boutique-muted-border/50 rounded-lg overflow-hidden my-1">
                        <button
                            onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                            className={`w-full flex items-center justify-between font-serif-editorial text-lg py-2.5 pl-3 pr-2 border-l-4 rounded-r transition-colors ${isCollections
                                ? "text-boutique-rose font-bold bg-boutique-blush/40 border-l-boutique-rose"
                                : "text-boutique-charcoal font-normal border-l-transparent hover:text-boutique-rose"
                                }`}
                        >
                            <span>Collections</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCollectionsOpen ? "rotate-180 text-boutique-rose" : ""}`} />
                        </button>

                        {/* Level 1: Categories inside Collections */}
                        {mobileCollectionsOpen && (
                            <div className="pl-3 py-2 space-y-1.5 bg-boutique-blush/20 border-l-2 border-boutique-rose/40 my-1">
                                <p className="px-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-boutique-gold">Select Category</p>

                                {navigationCategories.map((cat) => {
                                    const isExpanded = mobileExpandedCat === cat.slug;
                                    const isCatActive = pathname === `/collections/${cat.slug}` || pathname.startsWith(`/collections/${cat.slug}`);

                                    return (
                                        <div key={cat.slug} className="rounded-md overflow-hidden bg-white/60 border border-boutique-muted-border/60">
                                            <div className="flex items-center justify-between pr-1">
                                                <Link
                                                    href={`/collections/${cat.slug}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex-1 py-2 px-3 text-xs font-semibold uppercase tracking-wider ${isCatActive ? "text-boutique-rose font-bold" : "text-boutique-charcoal"
                                                        }`}
                                                >
                                                    {cat.name}
                                                </Link>
                                                {cat.subcategories && cat.subcategories.length > 0 && (
                                                    <button
                                                        onClick={() => setMobileExpandedCat(isExpanded ? null : cat.slug)}
                                                        className="p-1.5 text-boutique-charcoal hover:bg-boutique-blush/60 rounded"
                                                        aria-label={`Toggle ${cat.name}`}
                                                    >
                                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-boutique-rose" : ""}`} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Level 2: Subcategories inside Category */}
                                            {isExpanded && cat.subcategories && (
                                                <div className="pl-4 pr-2 pb-2 pt-1 space-y-1 border-t border-boutique-muted-border/40 bg-white">
                                                    {cat.subcategories.map((sub) => (
                                                        <Link
                                                            key={sub.slug}
                                                            href={`/collections/${cat.slug}?sub=${sub.slug}`}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-boutique-blush/50 text-xs font-medium text-boutique-charcoal/90"
                                                        >
                                                            <div className="w-5 h-5 rounded overflow-hidden relative flex-shrink-0 border border-boutique-muted-border">
                                                                <Image
                                                                    src={sub.image || cat.image || "/images/placeholder.jpg"}
                                                                    alt={sub.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="20px"
                                                                />
                                                            </div>
                                                            <span>{sub.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                <Link
                                    href="/collections"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-2 pt-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-boutique-rose"
                                >
                                    View All Collections →
                                </Link>
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
                            className={mobileLinkClass(pathname.startsWith(link.href))}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="pt-4 px-3 flex items-center justify-between">
                        <a
                            href={boutiqueConfig.instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity flex items-center gap-2 text-xs text-boutique-charcoal font-medium"
                        >
                            <InstagramIcon className="w-5 h-5" colored />
                            <span>@designsbynisha00</span>
                        </a>
                        <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-boutique-rose text-white px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.18em]">
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            Enquire
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
