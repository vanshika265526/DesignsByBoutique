import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Philosophy() {
    return (
        <section className="py-20 md:py-28 bg-boutique-bg-alt relative overflow-hidden border-y border-boutique-muted-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Asymmetric Image Feature */}
                    <div className="lg:col-span-6 relative space-y-4">
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl border border-boutique-muted-border">
                            <Image
                                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
                                alt="Designs by Nisha Atelier Craftsmanship New Delhi"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Floating Editorial Quote Badge */}
                        <div className="absolute -bottom-6 -right-4 sm:bottom-6 sm:-right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-boutique-rose/10 max-w-xs space-y-1">
                            <p className="font-serif-editorial text-lg text-boutique-rose font-bold">
                                Handcrafted in Delhi
                            </p>
                            <p className="text-xs text-boutique-taupe leading-relaxed font-light">
                                Tailored with traditional Indian embroidery, zardozi gold threadwork, and pure silks.
                            </p>
                        </div>
                    </div>

                    {/* Philosophy Editorial Text */}
                    <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0">
                        <SectionHeading
                            badge="BRAND PHILOSOPHY"
                            title="Every woman has a story. Every story has its chapters."
                            centered={false}
                        />

                        <div className="space-y-4 text-boutique-charcoal text-base font-light leading-relaxed">
                            <p className="font-serif-editorial text-2xl text-boutique-rose italic">
                                "Designs by Nisha brings together thoughtfully curated fashion for the moments that become memories — from everyday celebrations to weddings, motherhood and the little ones who come after."
                            </p>
                            <p>
                                Founded in New Delhi, our boutique is rooted in the belief that luxury clothing should feel personal, graceful, and emotionally resonant. We do not design for mass trends; we design for milestones.
                            </p>
                            <p className="text-sm text-boutique-taupe">
                                Whether you are stepping into a celebration as a young woman, choosing your heirloom bridal lehenga, dressing your bump for a maternity photoshoot, or picking soft silk outfits for your newborn — our studio accompanies you through every chapter.
                            </p>
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-4 border-t border-boutique-muted-border">
                            <div>
                                <span className="font-serif-editorial text-3xl text-boutique-rose font-bold">100%</span>
                                <p className="text-xs text-boutique-taupe uppercase tracking-wider font-medium">Bespoke Fit Available</p>
                            </div>
                            <div>
                                <span className="font-serif-editorial text-3xl text-boutique-gold font-bold">5 Chapters</span>
                                <p className="text-xs text-boutique-taupe uppercase tracking-wider font-medium">For Every Life Stage</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
