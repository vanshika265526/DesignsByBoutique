import Image from "next/image";

// Varied aspect ratios cycled by index to keep the Pinterest-style masonry
// rhythm even though the images themselves are admin-managed.
const RATIOS = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/5]",
    "aspect-[4/3]",
    "aspect-[5/6]",
];

// A plain, unclickable image wall. Content comes from the DB `gallery`
// collection, which admins add to / remove from in the admin panel.
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
            {items.map((item, idx) => (
                <div
                    key={item.id || item._id || idx}
                    className={`relative mb-2.5 break-inside-avoid overflow-hidden rounded-xl border border-boutique-muted-border/40 shadow-sm ${RATIOS[idx % RATIOS.length]}`}
                >
                    <Image
                        src={item.image || "/images/placeholder.jpg"}
                        alt={item.title || "Designs by Nisha lookbook"}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center"
                    />
                </div>
            ))}
        </div>
    );
}
