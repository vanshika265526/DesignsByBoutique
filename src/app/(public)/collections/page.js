import SectionHeading from "@/components/ui/SectionHeading";
import CollectionCard from "@/components/ui/CollectionCard";
import ProductCard from "@/components/ui/ProductCard";
import { boutiqueConfig } from "@/config/boutique";
import { products } from "@/data/products";

export const metadata = {
    title: "Collections — For Every Chapter of Her Story",
    description:
        "Explore Designs by Nisha's luxury collections: Suits & Anarkalis, Bridal Lehengas, Haldi & Mehendi outfits, Maternity Gowns, and Baby Clothes in New Delhi.",
};

export default function CollectionsPage() {
    return (
        <div className="pt-28 pb-24 bg-boutique-bg min-h-screen space-y-20">
            {/* Header Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="OUR CATALOGUE"
                    title="For Every Chapter of Her Story"
                    subtitle="Explore hand-crafted Indian ethnic wear, bespoke bridal lehengas, maternity occasion gowns, and baby outfits."
                />
            </div>

            {/* 5 Life Chapters Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <h3 className="font-serif-editorial text-2xl text-boutique-charcoal font-bold">
                    Explore by Chapter
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {boutiqueConfig.chapters.map((chapter) => (
                        <CollectionCard key={chapter.id} chapter={chapter} />
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
                        New Delhi Atelier Selection
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
