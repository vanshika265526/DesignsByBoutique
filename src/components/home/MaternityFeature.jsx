import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/config/boutique";

export default function MaternityFeature() {
    const whatsappUrl = buildWhatsAppLink({
        customMessage: "Hi Designs by Nisha! I am an expecting mother and looking for custom maternity gowns and photoshoot outfits. Could you share details?",
    });

    return (
        <section className="py-24 bg-boutique-bg-alt relative overflow-hidden border-b border-boutique-muted-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Feature Image */}
                    <div className="lg:col-span-6 order-2 lg:order-1 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-boutique-muted-border">
                        <Image
                            src="/images/maternity/gown-1.png"
                            alt="Designs by Nisha Powder Pink Maternity Gown New Delhi"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-boutique-rose/10 flex items-center space-x-3">
                            <Heart className="w-5 h-5 text-boutique-rose flex-shrink-0 fill-boutique-rose/20" />
                            <p className="text-xs text-boutique-charcoal font-medium">
                                Hypoallergenic silks & adjustable trimester sizing for maximum comfort.
                            </p>
                        </div>
                    </div>

                    {/* Editorial Narrative */}
                    <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-boutique-blush/60 text-boutique-rose text-xs uppercase tracking-widest font-semibold">
                            <span>CHAPTER 04 • HER MOTHERHOOD</span>
                        </div>

                        <h2 className="font-serif-editorial text-4xl sm:text-5xl text-boutique-charcoal font-bold leading-tight">
                            Grace Silhouettes for Motherhood
                        </h2>

                        <p className="font-serif-editorial text-xl text-boutique-rose italic">
                            "Celebrating one of life’s most divine transitions."
                        </p>

                        <p className="text-sm sm:text-base text-boutique-taupe font-light leading-relaxed">
                            Motherhood brings soft, glowing strength. Our maternity line features fluid silk gowns, draped Anarkalis, and photoshoot ensemble dresses with empire waistlines that expand effortlessly through every trimester.
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/collections/maternity-gowns"
                                className="inline-flex items-center justify-center bg-boutique-rose hover:bg-boutique-rose-dark text-white px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all shadow-md"
                            >
                                View Maternity Gowns
                            </Link>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center space-x-2 border border-boutique-rose text-boutique-rose hover:bg-boutique-blush/30 px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 text-boutique-rose" />
                                <span>Enquire on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
