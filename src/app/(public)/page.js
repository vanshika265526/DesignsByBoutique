import { getDbAsync } from "@/lib/db";
import Hero from "@/components/home/Hero";
import Philosophy from "@/components/home/Philosophy";
import HerJourney from "@/components/home/HerJourney";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BridalFeature from "@/components/home/BridalFeature";
import GalleryPreviewSection from "@/components/home/GalleryPreviewSection";
import MaternityFeature from "@/components/home/MaternityFeature";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramSection from "@/components/home/InstagramSection";
import SignatureCTA from "@/components/home/SignatureCTA";

// Force dynamic so homepage always reflects latest DB data (featured products, chapters, etc.)
export const dynamic = "force-dynamic";

export default async function HomePage() {
    const db = await getDbAsync();

    const chapters = db.chapters || [];
    const settings = db.settings || {};

    // Featured products: published + featured flag
    const featuredProducts = (db.products || [])
        .filter((p) => p.featured && (p.status === "published" || !p.status));

    // Testimonials
    const testimonials = db.testimonials || [];

    return (
        <>
            <Hero settings={settings} />
            <Philosophy />
            <HerJourney chapters={chapters} />
            <FeaturedCollections chapters={chapters} />
            <FeaturedProducts products={featuredProducts} />
            <BridalFeature />
            <GalleryPreviewSection />
            <MaternityFeature />
            <TestimonialsSection testimonials={testimonials} />
            <InstagramSection settings={settings} />
            <SignatureCTA />
        </>
    );
}
