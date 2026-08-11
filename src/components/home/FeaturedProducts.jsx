import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { getFeaturedProducts } from "@/data/products";

export default function FeaturedProducts() {
    const featured = getFeaturedProducts();

    return (
        <section className="py-24 bg-boutique-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <SectionHeading
                    badge="FEATURED SILHOUETTES"
                    title="Handcrafted For Her Story"
                    subtitle="Explore our most sought-after bespoke suits, bridal lehengas, maternity gowns, and baby clothes."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featured.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

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
