import Image from "next/image";
import { Sparkles, Heart, Award, MapPin } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";

export const metadata = {
    title: "Our Story — More Than A Boutique",
    description:
        "Discover the heritage and philosophy of Designs by Nisha. Luxury Indian fashion and bespoke bridal boutique located in New Delhi, India.",
};

export default function OurStoryPage() {
    return (
        <div className="pt-8 pb-24 bg-boutique-bg min-h-screen space-y-20">
            {/* Header Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="OUR HERITAGE & ATELIER"
                    title="More Than A Boutique."
                    subtitle="Fashion curated for every chapter of her story — from her first celebrations to her wedding day, motherhood, and the little ones who follow."
                />
            </div>

            {/* Main Narrative & Craftsmanship Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Atelier Image Grid */}
                    <div className="lg:col-span-6 relative grid grid-cols-2 gap-4">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-boutique-muted-border">
                            <Image
                                src="https://images.pexels.com/photos/32081698/pexels-photo-32081698.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Designs by Nisha Atelier Crafting New Delhi"
                                fill
                                sizes="(max-width: 1024px) 50vw, 30vw"
                                className="object-cover object-center"
                            />
                        </div>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-boutique-muted-border mt-8">
                            <Image
                                src="https://images.pexels.com/photos/31750737/pexels-photo-31750737.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Bespoke Zardozi Embroidery Details"
                                fill
                                sizes="(max-width: 1024px) 50vw, 30vw"
                                className="object-cover object-center"
                            />
                        </div>
                    </div>

                    {/* Narrative Content */}
                    <div className="lg:col-span-6 space-y-6">
                        <h2 className="font-serif-editorial text-3xl sm:text-4xl text-boutique-charcoal font-bold leading-tight">
                            Woven with love in New Delhi
                        </h2>

                        <p className="font-serif-editorial text-xl text-boutique-rose italic">
                            "We believe clothing is not merely fabric; it is the visual poetry of a woman’s memories."
                        </p>

                        <div className="space-y-4 text-sm sm:text-base text-boutique-taupe font-light leading-relaxed">
                            <p>
                                Designs by Nisha was created to fill a quiet void in modern fashion — a boutique that honours every transition of a woman's journey with equal grace and artistry.
                            </p>
                            <p>
                                Located in New Delhi, India, our studio houses master Karigars who bring decades of Zardozi, Gota Patti, Resham threadwork, and handloom weaving to life. Each garment is crafted with hypoallergenic silks, soft linings, and customizable fittings.
                            </p>
                            <p>
                                From young women seeking floaty festive Anarkalis to brides designing heirloom crimson lehengas, expecting mothers wanting comfortable photoshoot gowns, and mothers dressing their infants in soft cotton kurti sets — we welcome you to experience fashion tailored for your life story.
                            </p>
                        </div>

                        {/* Core Values */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-boutique-muted-border">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-boutique-rose font-bold font-serif-editorial text-lg">
                                    <Sparkles className="w-4 h-4 text-boutique-gold" />
                                    <span>Master Karigars</span>
                                </div>
                                <p className="text-xs text-boutique-taupe">Decades of authentic Indian embroidery heritage.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-boutique-rose font-bold font-serif-editorial text-lg">
                                    <Heart className="w-4 h-4 text-boutique-rose" />
                                    <span>5 Life Chapters</span>
                                </div>
                                <p className="text-xs text-boutique-taupe">Thoughtfully curated for every stage of womanhood.</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-boutique-rose font-bold font-serif-editorial text-lg">
                                    <Award className="w-4 h-4 text-boutique-gold" />
                                    <span>Bespoke Fitting</span>
                                </div>
                                <p className="text-xs text-boutique-taupe">Made-to-measure tailoring for perfect silhouette.</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <a
                                href={buildWhatsAppLink({ customMessage: "Hi Designs by Nisha! I read your story and would love to visit your New Delhi studio for a consultation." })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center space-x-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                            >
                                <WhatsAppIcon className="w-4 h-4 text-white" />
                                <span>Speak With Our Designer</span>
                            </a>

                            <a
                                href="https://share.google/oMRWNqTN0EFZn8Ac9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center space-x-2 border border-boutique-rose text-boutique-rose hover:bg-boutique-blush/30 px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                            >
                                <MapPin className="w-4 h-4 text-boutique-rose" />
                                <span>Visit New Delhi Studio</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
