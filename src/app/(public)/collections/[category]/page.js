import { notFound } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { boutiqueConfig } from "@/config/boutique";
import { getDbAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const categoryParam = params.category;
    const db = await getDbAsync();
    const chapters = db.chapters || boutiqueConfig.chapters;
    const chapter = chapters.find((ch) => ch.slug === categoryParam || ch.categorySlug === categoryParam);

    if (!chapter) {
        return { title: "Collection | Designs by Nisha Chattarpur New Delhi" };
    }

    const title = chapter.title || chapter.categoryName || chapter.category;
    const catName = chapter.category || chapter.categoryName;

    return {
        title: `${catName} — ${title} Collection | Chattarpur New Delhi`,
        description: `${chapter.description} Available at Designs by Nisha Boutique, 318 near Aayushman Arogya Mandir, Chattarpur, New Delhi.`,
    };
}

export default async function CategoryPage({ params }) {
    const categorySlug = params.category;
    const db = await getDbAsync();
    const chapters = db.chapters || boutiqueConfig.chapters;
    const chapter = chapters.find((ch) => ch.slug === categorySlug || ch.categorySlug === categorySlug);

    if (!chapter) {
        notFound();
    }

    const categoryTitle = chapter.title || chapter.categoryName || chapter.category;
    const categoryName = chapter.category || chapter.categoryName;
    const chapterNum = chapter.number || "01";
    const tagline = chapter.tagline || chapter.subtitle || "";
    const description = chapter.description || "";

    const categoryProducts = (db.products || []).filter((product) => {
        const isPublished = product.status === "published" || !product.status;
        return (
            isPublished &&
            (product.category === categorySlug ||
                product.categorySlug === categorySlug ||
                product.chapter === categorySlug)
        );
    });

    return (
        <div className="pt-10 md:pt-12 pb-24 bg-boutique-bg min-h-screen space-y-12">
            {/* Category Editorial Hero Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-boutique-bg-card rounded-3xl p-7 sm:p-10 border border-boutique-muted-border shadow-sm space-y-4 text-center">
                    <span className="inline-block px-3 py-1 bg-boutique-blush/60 text-boutique-rose text-xs font-semibold uppercase tracking-widest rounded-full">
                        CHAPTER {chapterNum} • {categoryTitle}
                    </span>

                    <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl text-boutique-charcoal font-bold">
                        {categoryName}
                    </h1>

                    {tagline && (
                        <p className="font-serif-editorial text-xl text-boutique-rose italic max-w-xl mx-auto">
                            &ldquo;{tagline}&rdquo;
                        </p>
                    )}

                    {description && (
                        <p className="text-sm text-boutique-taupe max-w-2xl mx-auto font-light leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Product Items Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-serif-editorial text-2xl text-boutique-charcoal font-bold">
                        Curated Silhouettes ({categoryProducts.length})
                    </h2>
                    <span className="text-xs text-boutique-taupe uppercase tracking-wider">
                        Designs by Nisha • Chattarpur Atelier
                    </span>
                </div>

                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-boutique-muted-border">
                        <p className="font-serif-editorial text-xl text-boutique-taupe italic">
                            New bespoke additions coming soon to our Chattarpur atelier.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
