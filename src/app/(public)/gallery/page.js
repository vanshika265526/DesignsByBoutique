import SectionHeading from "@/components/ui/SectionHeading";
import LookbookGrid from "@/components/gallery/LookbookGrid";
import { getDbAsync } from "@/lib/db";

// Always render on request — the gallery must reflect live Cloudinary media the
// moment an admin publishes it, never a snapshot baked at build time.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
    title: "Lookbook Gallery — High Fashion Editorial",
    description:
        "Explore Designs by Nisha's visual fashion lookbook. High-resolution bridal, festive, maternity, and baby outfit photography from our New Delhi atelier.",
};

export default async function GalleryPage() {
    const db = await getDbAsync();
    const items = db.gallery || [];

    return (
        <div className="pt-8 pb-24 bg-boutique-bg min-h-screen space-y-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="FASHION EDITORIAL"
                    title="Lookbook & Gallery"
                    subtitle="Immerse yourself in our visual journal of bridal craftsmanship, festive heirlooms, and motherhood grace in New Delhi."
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LookbookGrid items={items} />
            </div>
        </div>
    );
}
