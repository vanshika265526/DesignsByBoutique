import { notFound } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { boutiqueConfig } from "@/config/boutique";
import { getProductsByCategory } from "@/data/products";

export async function generateMetadata({ params }) {
    const categoryParam = params.category;
    const chapter = boutiqueConfig.chapters.find((ch) => ch.slug === categoryParam);

    if (!chapter) {
        return { title: "Collection | Designs by Nisha New Delhi" };
    }

    return {
        title: `${chapter.category} — ${chapter.title} Collection`,
        description: chapter.description,
    };
}

export async function generateStaticParams() {
    return boutiqueConfig.chapters.map((ch) => ({
        category: ch.slug,
    }));
}

export default function CategoryPage({ params }) {
    const categorySlug = params.category;
    const chapter = boutiqueConfig.chapters.find((ch) => ch.slug === categorySlug);

    if (!chapter) {
        notFound();
    }

    const categoryProducts = getProductsByCategory(categorySlug);

    return (
        <div className="pt-28 pb-24 bg-boutique-bg min-h-screen space-y-16">
            {/* Category Editorial Hero Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-boutique-bg-card rounded-3xl p-8 sm:p-12 border border-boutique-muted-border shadow-sm space-y-4 text-center">
                    <span className="inline-block px-3 py-1 bg-boutique-blush/60 text-boutique-rose text-xs font-semibold uppercase tracking-widest rounded-full">
                        CHAPTER {chapter.number} • {chapter.title}
                    </span>

                    <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl text-boutique-charcoal font-bold">
                        {chapter.category}
                    </h1>

                    <p className="font-serif-editorial text-xl text-boutique-rose italic max-w-xl mx-auto">
                        "{chapter.tagline}"
                    </p>

                    <p className="text-sm text-boutique-taupe max-w-2xl mx-auto font-light leading-relaxed">
                        {chapter.description}
                    </p>
                </div>
            </div>

            {/* Product Items Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="font-serif-editorial text-2xl text-boutique-charcoal font-bold">
                        Curated Silhouettes ({categoryProducts.length})
                    </h2>
                    <span className="text-xs text-boutique-taupe uppercase tracking-wider">
                        Designs by Nisha New Delhi
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
                            New bespoke additions coming soon to our atelier.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
