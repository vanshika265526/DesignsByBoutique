import { getDbAsync } from "@/lib/db";
import Hero from "@/components/home/Hero";
import CuratedCollections from "@/components/home/CuratedCollections";
import ShopByCategory from "@/components/home/ShopByCategory";
import ChapterTimeline from "@/components/home/ChapterTimeline";
import TrendingNow from "@/components/home/TrendingNow";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramSection from "@/components/home/InstagramSection";
import SignatureCTA from "@/components/home/SignatureCTA";

// Force dynamic so homepage always reflects latest DB data (products, chapters, settings, etc.)
export const dynamic = "force-dynamic";

export default async function HomePage() {
    const db = await getDbAsync();

    const chapters = db.chapters || [];
    const settings = db.settings || {};

    // Featured products: published + featured flag
    const featuredProducts = (db.products || [])
        .filter((p) => p.featured && (p.status === "published" || !p.status));

    return (
        <>
            <Hero settings={settings} />

            {/* SHOP BY CATEGORY — Men, Women, Kids */}
            <ShopByCategory />

            {/* CURATED COLLECTIONS — Ethnic Collection, Indo Western, Party Wear */}
            <CuratedCollections />

            {/* HER 5 CHAPTERS ANIMATED TIMELINE — Interactive Phase 01 to 05 */}
            <ChapterTimeline chapters={chapters} />

            {/* TRENDING NOW — Gown Showcase with continuous scrolling animation */}
            <TrendingNow products={featuredProducts} />

            {/* WHAT OUR CUSTOMERS SAY — Client Reviews with continuous scrolling animation */}
            <TestimonialsSection />

            {/* INSTAGRAM & CONTACT CTA */}
            <InstagramSection settings={settings} />
            <SignatureCTA />
        </>
    );
}
