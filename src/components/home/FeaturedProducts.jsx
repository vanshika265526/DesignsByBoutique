import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";

// Receives `products` prop from the parent (DB-fetched server component)
export default function FeaturedProducts({ products = [] }) {
    return (
        <section className="py-24 bg-boutique-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <SectionHeading
                    badge="FEATURED SILHOUETTES"
                    title="Handcrafted For Her Story"
                    subtitle="Explore our most sought-after bespoke suits, bridal lehengas, maternity gowns, and baby clothes."
                />

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-boutique-taupe text-sm italic">
                        New featured designs coming soon to our atelier.
                    </div>
                )}

                <div className="text-center pt-6">
                    <Link
                        href="/collections"
                        className="inline-flex items-center space-x-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-md"
                    >
                        <span>View All Boutique Outfits</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
