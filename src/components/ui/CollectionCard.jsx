import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Normalizes both DB chapters (initialChapters shape) and boutiqueConfig.chapters shapes
export default function CollectionCard({ chapter }) {
    // DB chapters use: { id, number, title, categorySlug, categoryName, description, image }
    // Config chapters use: { id, number, title, category, slug, description, image, badge }
    const number = chapter.number;
    const title = chapter.title;
    const category = chapter.category || chapter.categoryName || "";
    const slug = chapter.slug || chapter.categorySlug || chapter.id || "";
    const description = chapter.description || "";
    const image = chapter.image || "";

    if (!slug) return null;

    return (
        <Link
            href={`/collections/${slug}`}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] block shadow-md hover:shadow-2xl transition-all duration-700 border border-boutique-muted-border/40"
        >
            {/* Background Image */}
            {image ? (
                <Image
                    src={image}
                    alt={`${title} — ${category} by Designs by Nisha New Delhi`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-boutique-blush to-boutique-rose/20" />
            )}

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

            {/* Chapter Badge Top Left */}
            {number && (
                <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md text-boutique-rose text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        CHAPTER {number}
                    </span>
                </div>
            )}

            {/* Bottom Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs uppercase tracking-[0.2em] text-boutique-gold font-medium">
                    {category}
                </span>
                <h3 className="font-serif-editorial text-2xl sm:text-3xl text-white font-bold leading-tight">
                    {title}
                </h3>
                <p className="text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                    {description}
                </p>

                <div className="pt-2 flex items-center text-xs font-medium text-boutique-blush space-x-2 group-hover:text-white transition-colors">
                    <span className="tracking-wider uppercase">Explore Collection</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
            </div>
        </Link>
    );
}
