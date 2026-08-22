import { getDbAsync } from "@/lib/db";
import Hero from "@/components/home/Hero";
import ShopByCategory from "@/components/home/ShopByCategory";
import ChapterTimeline from "@/components/home/ChapterTimeline";
import TrendingNow from "@/components/home/TrendingNow";
import GalleryPreviewSection from "@/components/home/GalleryPreviewSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramSection from "@/components/home/InstagramSection";
import SignatureCTA from "@/components/home/SignatureCTA";
import HomeContactForm from "@/components/home/HomeContactForm";

// ISR — cached & regenerated at most once a minute so the homepage loads fast
// while still reflecting admin edits within ~a minute.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
    const db = await getDbAsync();

    const settings = db.settings || {};

    // Featured products: published + featured flag
    const featuredProducts = (db.products || [])
        .filter((p) => p.featured && (p.status === "published" || !p.status));

    return (
        <>
            {/* 1 — Premium boutique hero */}
            <Hero settings={settings} />

            {/* 2 — "For Every Chapter of Her Story" animated life-journey timeline */}
            <ChapterTimeline />

            {/* 2.5 — Shop by Category (women's boutique categories) */}
            <ShopByCategory categories={db.categories} />

            {/* 3 — Featured / New Arrival products */}
            <TrendingNow products={featuredProducts} />

            {/* 4 — Gallery preview */}
            <GalleryPreviewSection items={db.gallery} />

            {/* 6 — Testimonials */}
            <TestimonialsSection />

            {/* 7 — Instagram section */}
            <InstagramSection settings={settings} items={db.gallery} />

            {/* 8 — Call / Instagram / WhatsApp CTA */}
            <SignatureCTA />

            {/* 9 — Send us a message form */}
            <HomeContactForm />
        </>
    );
}
