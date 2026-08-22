import Image from "next/image";
import { Video } from "lucide-react";

// Varied aspect ratios cycled by index to keep the Pinterest-style masonry
// rhythm even though the images/videos themselves are admin-managed.
const RATIOS = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/5]",
    "aspect-[4/3]",
    "aspect-[5/6]",
];

// Content comes from the DB `gallery` collection, which admins add to / remove from in the admin panel.
export default function LookbookGrid({ items = [] }) {
    if (!items.length) {
        return (
            <p className="text-center text-sm text-boutique-taupe font-light py-16">
                Our lookbook is being curated — check back soon.
            </p>
        );
    }

    return (
        <div className="columns-2 md:columns-3 lg:columns-4 [column-gap:0.6rem]">
            {items.map((item, idx) => {
                const isVideo = item.type === "video" || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(item.image);

                return (
                    <div
                        key={item.id || item._id || idx}
                        className={`group relative mb-2.5 break-inside-avoid overflow-hidden rounded-xl border border-boutique-muted-border/40 shadow-sm ${RATIOS[idx % RATIOS.length]}`}
                    >
                        {isVideo ? (
                            <div className="w-full h-full relative">
                                <video
                                    src={item.image}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2.5 right-2.5 bg-black/65 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold flex items-center gap-1 border border-white/20 shadow-xs z-10">
                                    <Video className="w-2.5 h-2.5 text-boutique-gold" />
                                    Reel
                                </span>
                            </div>
                        ) : (
                            <Image
                                src={item.image || "/images/placeholder.jpg"}
                                alt={item.title || "Designs by Nisha lookbook"}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
