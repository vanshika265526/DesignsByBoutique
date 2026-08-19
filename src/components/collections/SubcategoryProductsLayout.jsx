"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { Sparkles, Layers, Grid } from "lucide-react";

function SubcategoryProductsContent({ category, products = [] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const subParam = searchParams.get("sub");

    const subcategories = category?.subcategories || [];

    const [activeSubSlug, setActiveSubSlug] = useState(() => {
        if (subParam && subcategories.some((s) => s.slug === subParam)) {
            return subParam;
        }
        return "all";
    });

    useEffect(() => {
        if (subParam && subcategories.some((s) => s.slug === subParam)) {
            setActiveSubSlug(subParam);
        } else if (!subParam) {
            setActiveSubSlug("all");
        }
    }, [subParam, subcategories]);

    const handleSubClick = (slug) => {
        setActiveSubSlug(slug);
        if (slug === "all") {
            router.push(`/collections/${category.slug}`, { scroll: false });
        } else {
            router.push(`/collections/${category.slug}?sub=${slug}`, { scroll: false });
        }
    };

    const activeSubcategory = subcategories.find((s) => s.slug === activeSubSlug);

    const filteredProducts = products.filter((product) => {
        if (activeSubSlug === "all") return true;

        const subSlug = activeSubSlug.toLowerCase();
        const subName = activeSubcategory ? activeSubcategory.name.toLowerCase() : subSlug;

        if (product.subcategory && product.subcategory.toLowerCase() === subSlug) return true;

        const pName = (product.name || "").toLowerCase();
        const pDesc = (product.description || "").toLowerCase();
        const pCat = (product.categoryName || "").toLowerCase();

        if (pName.includes(subSlug) || pName.includes(subName)) return true;
        if (pDesc.includes(subSlug) || pDesc.includes(subName)) return true;
        if (pCat.includes(subSlug) || pCat.includes(subName)) return true;

        if (subSlug === "anarkali" && (pName.includes("anarkali") || pDesc.includes("anarkali"))) return true;
        if (subSlug === "suits" && (pName.includes("suit") || pName.includes("kurta") || pDesc.includes("kurta"))) return true;
        if (subSlug === "sharara" && (pName.includes("sharara") || pDesc.includes("sharara"))) return true;
        if (subSlug === "frock" && (pName.includes("frock") || pDesc.includes("frock"))) return true;
        if (subSlug === "gowns" && (pName.includes("gown") || pDesc.includes("gown"))) return true;
        if (subSlug === "party-wear" && (pName.includes("frock") || pName.includes("gown") || pName.includes("ball"))) return true;
        if (subSlug === "mini-lehengas" && (pName.includes("lehenga") || pName.includes("choli"))) return true;
        if (subSlug === "haldi-outfit" && (pName.includes("haldi") || pName.includes("saffron") || pDesc.includes("haldi") || pName.includes("yellow"))) return true;
        if (subSlug === "mehandi-outfit" && (pName.includes("mehendi") || pName.includes("emerald") || pName.includes("green") || pDesc.includes("mehendi"))) return true;
        if (subSlug === "sangeet-lehenga" && (pName.includes("sangeet") || pName.includes("organza") || pName.includes("lehenga"))) return true;
        if (subSlug === "bridal-lehenga" && (pName.includes("bridal") || pName.includes("royal") || pName.includes("heirloom") || pName.includes("lehenga"))) return true;
        if (subSlug === "engagement-lehenga" && (pName.includes("lehenga") || pName.includes("royal"))) return true;
        if (subSlug === "engagement-gown" && (pName.includes("gown") || pName.includes("draped") || pName.includes("saree"))) return true;
        if (subSlug === "pre-wedding-gown" && (pName.includes("gown") || pName.includes("draped"))) return true;
        if (subSlug === "bodycon-dresses" && (pName.includes("draped") || pName.includes("gown") || pName.includes("saree") || pName.includes("mermaid"))) return true;
        if (subSlug === "pant-suit" && (pName.includes("suit") || pName.includes("palazzo") || pName.includes("kurta"))) return true;
        if (subSlug === "maternity-gowns" && (pName.includes("maternity") || pName.includes("gown"))) return true;
        if (subSlug === "reception-outfit" && (pName.includes("reception") || pName.includes("straight") || pName.includes("draped"))) return true;
        if (subSlug === "saree" && (pName.includes("saree") || pDesc.includes("saree"))) return true;

        return false;
    });

    const activeTitle = activeSubcategory
        ? activeSubcategory.name
        : `${category.name}`;

    return (
        <div className="space-y-4 sm:space-y-5">

            {/* SUBCATEGORY COMPACT LUXURY OVAL CAPSULES */}
            {subcategories.length > 0 && (
                <div className="bg-white/80 backdrop-blur-xs border border-boutique-muted-border/80 rounded-2xl p-2.5 sm:p-3.5 shadow-xs">

                    {/* Compact Horizontal Scrollable Capsules Row */}
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-boutique-rose/20">

                        {/* "ALL" Category Capsule */}
                        <button
                            onClick={() => handleSubClick("all")}
                            className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all duration-300 flex-shrink-0 group ${activeSubSlug === "all"
                                    ? "bg-boutique-charcoal text-white border-boutique-gold ring-2 ring-boutique-gold/50 shadow-md scale-105"
                                    : "bg-white text-boutique-charcoal border-boutique-muted-border hover:border-boutique-rose hover:bg-boutique-blush/30"
                                }`}
                        >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all flex-shrink-0 ${activeSubSlug === "all" ? "bg-boutique-gold/20 border-boutique-gold text-boutique-gold-light" : "bg-boutique-blush/40 border-boutique-muted-border text-boutique-rose group-hover:border-boutique-rose"
                                }`}>
                                <Grid className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap pr-0.5">
                                All {category.name}
                            </span>
                        </button>

                        {/* Individual Subcategory Capsules */}
                        {subcategories.map((sub) => {
                            const isActive = activeSubSlug === sub.slug;
                            return (
                                <button
                                    key={sub.slug}
                                    onClick={() => handleSubClick(sub.slug)}
                                    className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border transition-all duration-300 flex-shrink-0 group ${isActive
                                            ? "bg-boutique-charcoal text-white border-boutique-gold ring-2 ring-boutique-gold/50 shadow-md scale-105"
                                            : "bg-white text-boutique-charcoal border-boutique-muted-border hover:border-boutique-rose hover:bg-boutique-blush/30"
                                        }`}
                                >
                                    <div className={`w-7 h-7 rounded-full overflow-hidden relative border transition-all flex-shrink-0 ${isActive ? "border-boutique-gold ring-1 ring-boutique-gold/40 shadow-xs" : "border-boutique-muted-border group-hover:border-boutique-rose"
                                        }`}>
                                        <Image
                                            src={sub.image || category.image || "/images/placeholder.jpg"}
                                            alt={sub.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            sizes="28px"
                                        />
                                    </div>
                                    <span className={`text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap pr-0.5 ${isActive ? "text-boutique-gold-light font-bold" : "text-boutique-charcoal group-hover:text-boutique-rose"
                                        }`}>
                                        {sub.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ACTIVE SUBCATEGORY COMPACT HEADING & COUNT */}
            <div className="flex items-center justify-between py-1.5 px-1 border-b border-boutique-muted-border/60">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-boutique-gold" />
                    <h2 className="font-serif-editorial text-lg sm:text-2xl font-bold tracking-tight text-boutique-charcoal uppercase">
                        {activeTitle}
                    </h2>
                </div>
                <span className="text-[11px] text-boutique-taupe font-medium italic">
                    {filteredProducts.length} Outfit{filteredProducts.length === 1 ? "" : "s"}
                </span>
            </div>

            {/* PRODUCT CARDS GRID — VISIBLE IMMEDIATELY ABOVE THE FOLD */}
            <div className="pt-1">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id || product.slug} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-boutique-muted-border p-6 space-y-3 max-w-xl mx-auto shadow-xs">
                        <Layers className="w-8 h-8 text-boutique-rose/60 mx-auto" />
                        <h3 className="font-serif-editorial text-xl text-boutique-charcoal font-semibold">
                            Bespoke {activeTitle} Creations Coming Soon
                        </h3>
                        <p className="text-xs text-boutique-taupe font-light">
                            Our atelier is currently handcrafting new silhouettes for {activeTitle}. Enquire directly with Nisha for custom orders.
                        </p>
                        <button
                            onClick={() => handleSubClick("all")}
                            className="inline-flex items-center gap-2 bg-boutique-rose text-white px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider hover:bg-boutique-rose-dark transition-colors"
                        >
                            View All {category.name} Outfits
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SubcategoryProductsLayout(props) {
    return (
        <Suspense fallback={
            <div className="text-center py-12 text-boutique-taupe">
                Loading collection...
            </div>
        }>
            <SubcategoryProductsContent {...props} />
        </Suspense>
    );
}
