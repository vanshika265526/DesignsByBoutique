import SectionHeading from "@/components/ui/SectionHeading";
import LookbookGrid from "@/components/gallery/LookbookGrid";

export const metadata = {
    title: "Lookbook Gallery — High Fashion Editorial",
    description:
        "Explore Designs by Nisha's visual fashion lookbook. High-resolution bridal, festive, maternity, and baby outfit photography from our New Delhi atelier.",
};

export default function GalleryPage() {
    return (
        <div className="pt-28 pb-24 bg-boutique-bg min-h-screen space-y-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="FASHION EDITORIAL"
                    title="Lookbook & Gallery"
                    subtitle="Immerse yourself in our visual journal of bridal craftsmanship, festive heirlooms, and motherhood grace in New Delhi."
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <LookbookGrid />
            </div>
        </div>
    );
}
