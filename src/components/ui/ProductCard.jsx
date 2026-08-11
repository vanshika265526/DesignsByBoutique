import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { buildWhatsAppLink } from "@/config/boutique";

export default function ProductCard({ product }) {
    const {
        slug,
        name,
        category,
        originalPrice,
        salePrice,
        discountPercentage,
        images,
        chapterTitle,
    } = product;

    const mainImage = images && images.length > 0 ? images[0] : "/images/placeholder.jpg";
    const whatsappUrl = buildWhatsAppLink({
        productName: name,
        productCategory: category,
        price: salePrice,
        productImage: mainImage,
        productSlug: slug,
    });

    return (
        <div className="group bg-boutique-bg-card rounded-2xl overflow-hidden border border-boutique-muted-border/60 hover:shadow-xl transition-all duration-500 flex flex-col justify-between">
            {/* Product Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                <Image
                    src={mainImage}
                    alt={`${name} — ${category} by Designs by Nisha New Delhi`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Chapter & Discount Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {chapterTitle && (
                        <span className="bg-white/88 backdrop-blur-md text-boutique-rose text-[10px] uppercase font-medium tracking-wider px-2.5 py-1 rounded-full border border-boutique-rose/10">
                            {chapterTitle}
                        </span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="bg-boutique-rose text-white text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-sm ml-auto">
                            {discountPercentage}% OFF
                        </span>
                    )}
                </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <span className="text-[11px] uppercase tracking-widest text-boutique-gold font-medium">
                        {category}
                    </span>
                    <h3 className="font-serif-editorial text-xl text-boutique-charcoal group-hover:text-boutique-rose transition-colors line-clamp-1 mt-0.5">
                        <Link href={`/product/${slug}`}>{name}</Link>
                    </h3>
                </div>

                {/* Price & Action Row */}
                <div className="pt-2 border-t border-boutique-muted-border/40 flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-serif-editorial font-bold text-boutique-rose">
                            ₹{salePrice?.toLocaleString("en-IN")}
                        </span>
                        {originalPrice && originalPrice > salePrice && (
                            <span className="text-xs text-neutral-400 line-through font-light">
                                ₹{originalPrice?.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>

                    <Link
                        href={`/product/${slug}`}
                        className="text-xs text-boutique-charcoal hover:text-boutique-rose font-medium inline-flex items-center space-x-1"
                    >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Direct WhatsApp Conversion CTA */}
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-3 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-xl text-xs font-medium tracking-wider uppercase flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Enquire on WhatsApp</span>
                </a>
            </div>
        </div>
    );
}
