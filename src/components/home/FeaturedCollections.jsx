import SectionHeading from "@/components/ui/SectionHeading";
import CollectionCard from "@/components/ui/CollectionCard";

// Receives `chapters` prop from the DB-connected parent server component
export default function FeaturedCollections({ chapters = [] }) {
    return (
        <section className="py-24 bg-boutique-bg-alt border-y border-boutique-muted-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <SectionHeading
                    badge="OUR COLLECTIONS"
                    title="Curated For Her Moments"
                    subtitle="Explore hand-crafted silhouettes designed for life's most precious occasions in New Delhi."
                />

                {chapters.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {chapters.map((chapter, idx) => (
                            <CollectionCard key={chapter.id || idx} chapter={chapter} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-boutique-taupe text-sm italic">
                        Collections coming soon.
                    </div>
                )}
            </div>
        </section>
    );
}
