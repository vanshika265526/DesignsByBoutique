import Hero from "@/components/home/Hero";
import Philosophy from "@/components/home/Philosophy";
import HerJourney from "@/components/home/HerJourney";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BridalFeature from "@/components/home/BridalFeature";
import MaternityFeature from "@/components/home/MaternityFeature";
import InstagramSection from "@/components/home/InstagramSection";
import SignatureCTA from "@/components/home/SignatureCTA";

export default function HomePage() {
    return (
        <>
            <Hero />
            <Philosophy />
            <HerJourney />
            <FeaturedCollections />
            <FeaturedProducts />
            <BridalFeature />
            <MaternityFeature />
            <InstagramSection />
            <SignatureCTA />
        </>
    );
}
