import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Sparkles, Scissors } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/ui/ProductCard";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";
import { getDbAsync } from "@/lib/db";

// ISR: pages are served instantly from cache and regenerated in the background
// at most once every 60s, so admin edits appear within ~a minute while every
// click loads fast (no full server render per request).
export const revalidate = 60;

// Pre-build a static page for each product at deploy time.
export async function generateStaticParams() {
    const db = await getDbAsync();
    return (db.products || [])
        .filter((p) => p.slug && (p.status === "published" || !p.status))
        .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
    const db = await getDbAsync();
    const product = (db.products || []).find((p) => p.slug === params.slug);
    if (!product) return { title: "Outfit | Designs by Nisha New Delhi" };

    const productImages =
        product.images && product.images.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];

    return {
        title: `${product.name} — ${product.categoryName || product.category}`,
        description: `${product.description} Available at Designs by Nisha Boutique, New Delhi.`,
        openGraph: {
            title: product.name,
            description: product.description,
            images: productImages.length > 0 ? [{ url: productImages[0] }] : [],
        },
    };
}

export default async function ProductDetailPage({ params }) {
    const db = await getDbAsync();
    const allProducts = db.products || [];

    // Find product by slug from the live database
    const product = allProducts.find((p) => p.slug === params.slug);

    if (!product || (product.status && product.status !== "published")) {
        notFound();
    }

    const {
        name,
        category,
        categoryName,
        originalPrice,
        price,
        salePrice,
        discount,
        description,
        sizes,
        fabric,
        customization,
        care,
        details,
    } = product;

    // Normalize images array
    const images =
        product.images && product.images.length > 0
            ? product.images
            : product.image
                ? [product.image]
                : [];

    const currentPrice = price || salePrice;
    const displayCategory = categoryName || category || "";
    const displayChapterTitle = product.chapterTitle || product.chapterName || "";

    // Compute discount percentage
    const computedDiscount =
        product.discountPercentage ||
        (originalPrice && currentPrice && originalPrice > currentPrice
            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
            : 0);

    const whatsappUrl = buildWhatsAppLink({
        productName: name,
        productCategory: displayCategory,
        price: currentPrice,
        productImage: images.length > 0 ? images[0] : null,
        productSlug: product.slug,
    });

    // Related products: same category, published, different slug, up to 4
    const relatedProducts = allProducts
        .filter(
            (p) =>
                (p.category === product.category ||
                    p.categorySlug === product.categorySlug ||
                    p.category === product.categorySlug) &&
                p.slug !== product.slug &&
                (p.status === "published" || !p.status)
        )
        .slice(0, 4);

    // JSON-LD Product Schema
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: name,
        image: images,
        description: description,
        sku: product.id,
        brand: { "@type": "Brand", name: "Designs by Nisha" },
        offers: {
            "@type": "Offer",
            url: `${boutiqueConfig.seo.siteUrl}/product/${product.slug}`,
            priceCurrency: "INR",
            price: currentPrice,
            priceValidUntil: "2027-12-31",
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "Designs by Nisha New Delhi" },
        },
    };

    return (
        <div className="pt-8 md:pt-10 pb-24 bg-boutique-bg min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center space-x-2 text-xs text-boutique-taupe">
                    <Link href="/" className="hover:text-boutique-rose transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/collections" className="hover:text-boutique-rose transition-colors">
                        Collections
                    </Link>
                    <span>/</span>
                    <Link
                        href={`/collections/${product.category || product.categorySlug}`}
                        className="hover:text-boutique-rose transition-colors capitalize"
                    >
                        {displayCategory}
                    </Link>
                    <span>/</span>
                    <span className="text-boutique-rose font-medium truncate">{name}</span>
                </div>

                {/* Product Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Gallery Section Left */}
                    <div className="lg:col-span-7">
                        <ProductGallery
                            images={images}
                            productName={name}
                            instagramReel={product.instagramReel}
                        />
                    </div>

                    {/* Product Details Section Right */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center flex-wrap gap-2">
                                {displayChapterTitle && (
                                    <span className="bg-boutique-blush/60 text-boutique-rose text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {displayChapterTitle}
                                    </span>
                                )}
                                {computedDiscount > 0 && (
                                    <span className="bg-boutique-rose text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                                        {computedDiscount}% OFF
                                    </span>
                                )}
                                {product.newArrival && (
                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border border-amber-300">
                                        New Arrival
                                    </span>
                                )}
                            </div>

                            <h1 className="font-serif-editorial text-3xl sm:text-4xl text-boutique-charcoal font-bold leading-tight">
                                {name}
                            </h1>

                            <p className="text-xs uppercase tracking-widest text-boutique-gold font-semibold">
                                {displayCategory} • NEW DELHI ATELIER
                            </p>
                        </div>

                        {/* Price Display */}
                        <div className="p-4 bg-boutique-bg-card rounded-2xl border border-boutique-muted-border">
                            <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                                <span className="font-serif-editorial text-3xl font-bold text-boutique-rose">
                                    ₹
                                    {currentPrice
                                        ? Number(currentPrice).toLocaleString("en-IN")
                                        : "Price on Request"}
                                </span>
                                {originalPrice && originalPrice > currentPrice && (
                                    <span className="text-sm text-neutral-400 line-through">
                                        ₹{Number(originalPrice).toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-neutral-500 font-light mt-2">
                                Taxes included • Custom Fitting Available
                            </p>
                        </div>

                        {/* WhatsApp Enquiry CTA — right below the price */}
                        <div className="space-y-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 px-6 rounded-2xl text-xs font-semibold tracking-widest uppercase flex items-center justify-center space-x-3 transition-all shadow-lg hover:shadow-xl"
                            >
                                <WhatsAppIcon className="w-5 h-5 text-white" />
                                <span>Enquire on WhatsApp</span>
                            </a>
                            <p className="text-[11px] text-center text-boutique-taupe italic">
                                Direct consultation with Designs by Nisha atelier in New Delhi. No checkout required.
                            </p>
                        </div>

                        {/* Description */}
                        {description && (
                            <p className="text-sm text-boutique-taupe font-light leading-relaxed">
                                {description}
                            </p>
                        )}

                        {/* Sizes */}
                        {sizes && sizes.length > 0 && (
                            <div className="space-y-2 pt-2">
                                <label className="text-xs uppercase tracking-wider font-semibold text-boutique-charcoal flex items-center justify-between">
                                    <span>Available Size Options</span>
                                    <span className="text-boutique-rose text-[11px] lowercase">
                                        Custom sizing included
                                    </span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((s, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3.5 py-2 bg-white text-boutique-charcoal rounded-xl text-xs font-medium border border-boutique-muted-border"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details list */}
                        {details && details.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-boutique-muted-border/60 text-xs">
                                {details.map((detail, idx) => (
                                    <div key={idx} className="flex items-start space-x-3">
                                        <Sparkles className="w-4 h-4 text-boutique-gold flex-shrink-0 mt-0.5" />
                                        <span className="text-boutique-taupe">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Typed spec fields (fabric, customization, care) */}
                        {(fabric || customization || care) && (
                            <div className="space-y-3 pt-4 border-t border-boutique-muted-border/60 text-xs">
                                {fabric && (
                                    <div className="flex items-start space-x-3">
                                        <Sparkles className="w-4 h-4 text-boutique-gold flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-boutique-charcoal">
                                                Fabric &amp; Embellishment:{" "}
                                            </span>
                                            <span className="text-boutique-taupe">{fabric}</span>
                                        </div>
                                    </div>
                                )}
                                {customization && (
                                    <div className="flex items-start space-x-3">
                                        <Scissors className="w-4 h-4 text-boutique-rose flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-boutique-charcoal">
                                                Bespoke Customization:{" "}
                                            </span>
                                            <span className="text-boutique-taupe">{customization}</span>
                                        </div>
                                    </div>
                                )}
                                {care && (
                                    <div className="flex items-start space-x-3">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-semibold text-boutique-charcoal">
                                                Garment Care:{" "}
                                            </span>
                                            <span className="text-boutique-taupe">{care}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* Related Outfits Section */}
                {relatedProducts.length > 0 && (
                    <div className="pt-16 border-t border-boutique-muted-border/60 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif-editorial text-2xl text-boutique-charcoal font-bold">
                                You May Also Love
                            </h2>
                            <Link
                                href="/collections"
                                className="text-xs font-medium text-boutique-rose hover:underline"
                            >
                                Browse All
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((rel) => (
                                <ProductCard key={rel.id} product={rel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
