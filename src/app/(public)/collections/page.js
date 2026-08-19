import SectionHeading from "@/components/ui/SectionHeading";
import CollectionCard from "@/components/ui/CollectionCard";
import ProductCard from "@/components/ui/ProductCard";
import { categoriesTaxonomy } from "@/data/products";
import { getDbAsync } from "@/lib/db";

// ISR — cached & regenerated at most once a minute for fast loads.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "Collections — Suits, Bridal Lehengas & Maternity Wear | Chattarpur New Delhi",
    description:
        "Explore Designs by Nisha's luxury collections in Chattarpur, New Delhi: Suits & Anarkalis, Bridal Lehengas, Haldi & Mehendi outfits, Maternity Gowns, and Baby Clothes (318, near Aayushman Arogya Mandir).",
};

export default async function CollectionsPage() {
    const db = await getDbAsync();
    const products = (db.products || []).filter((product) => product.status === "published" || !product.status);
    const liveCategories = db.categories || [];
    const liveChapters = db.chapters || [];
    const legacySlugs = {
        "suits-anarkalis": "her-beginning",
        "gowns-lehengas": "her-bridal-story",
        "haldi-mehendi": "her-big-day",
        "bridal-lehengas": "her-big-day",
        "maternity-gowns": "maternity",
        "baby-clothes": "baby-girl-dresses",
    };
    const chapters = categoriesTaxonomy.map((category, index) => {
        const liveChapter = liveChapters.find((chapter) => {
            const chapterSlug = chapter.categorySlug || chapter.slug;
            return (legacySlugs[chapterSlug] || chapterSlug) === category.slug;
        });
        const matchingCategory = liveCategories.find((liveCategory) =>
            (legacySlugs[liveCategory.slug] || liveCategory.slug) === category.slug
        );

        return {
            ...liveChapter,
            id: category.id,
            number: String(index + 1).padStart(2, "0"),
            title: matchingCategory?.name || category.name,
            categoryName: matchingCategory?.name || category.name,
            categorySlug: category.slug,
            description: matchingCategory?.description || liveChapter?.description || category.description,
            image: matchingCategory?.image || liveChapter?.image || category.image,
            subcategories: matchingCategory?.subcategories?.length ? matchingCategory.subcategories : category.subcategories,
        };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className="pt-14 md:pt-16 pb-24 bg-boutique-bg min-h-screen space-y-20">
            {/* Header Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="OUR BOUTIQUE CATALOGUE"
                    title="For Every Chapter of Her Story"
                    subtitle="Explore hand-crafted Indian ethnic wear, bespoke bridal lehengas, maternity occasion gowns, and baby outfits crafted in Chattarpur, New Delhi."
                />
            </div>

            {/* 5 Life Chapters Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <h3 className="font-serif-editorial text-2xl text-boutique-charcoal font-bold">
                    Explore by Chapter
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chapters.map((chapter, idx) => (
                        <CollectionCard key={chapter.id || idx} chapter={chapter} />
                    ))}
                </div>
            </div>

            {/* All Outfits Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8 border-t border-boutique-muted-border/60">
                <div className="flex items-center justify-between">
                    <h3 className="font-serif-editorial text-2xl text-boutique-charcoal font-bold">
                        All Boutique Outfits ({products.length})
                    </h3>
                    <span className="text-xs text-boutique-taupe uppercase tracking-wider font-medium">
                        Chattarpur, New Delhi Atelier Selection
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
