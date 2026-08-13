import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/config/boutique";

export default function BridalFeature() {
    const whatsappUrl = buildWhatsAppLink({
        customMessage: "Hi Designs by Nisha! I am looking for bespoke bridal lehengas and wedding occasion wear. I'd love to book a bridal consultation.",
    });

    return (
        <section className="py-24 bg-gradient-to-b from-boutique-rose-dark to-boutique-rose text-white relative overflow-hidden">
            {/* Decorative Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Text Editorial Spotlight */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-boutique-gold/30 text-boutique-gold text-xs uppercase tracking-widest font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>CHAPTER 02 SPOTLIGHT</span>
                        </div>

                        <h2 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl text-white font-bold leading-tight">
                            The Heirloom Bridal Experience
                        </h2>

                        <p className="font-serif-editorial text-xl text-boutique-blush italic">
                            "For the unforgettable moment that begins a lifetime."
                        </p>

                        <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
                            Every bride carries a vision of her wedding day. At Designs by Nisha New Delhi, we transform that vision into an heirloom lehenga woven with hand-done Zardozi gold embroidery, imperial silk, and dual organza dupattas.
                        </p>

                        <ul className="space-y-2 text-xs text-neutral-300 pt-2 font-light">
                            <li className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-boutique-gold" />
                                <span>Bespoke bridal consultations in our New Delhi Atelier</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-boutique-gold" />
                                <span>Custom wedding date embroidery & personalized latkans</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-boutique-gold" />
                                <span>Complete Haldi, Mehendi & Sangeet outfit styling</span>
                            </li>
                        </ul>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center space-x-2 bg-boutique-gold hover:bg-amber-600 text-boutique-charcoal font-semibold px-6 py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-lg"
                            >
                                <WhatsAppIcon className="w-4 h-4 text-boutique-charcoal" />
                                <span>Book Bridal Consultation</span>
                            </a>

                            <Link
                                href="/collections/bridal-lehengas"
                                className="inline-flex items-center justify-center border border-white/40 hover:border-white text-white px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors"
                            >
                                Explore Bridal Collection
                            </Link>
                        </div>
                    </div>

                    {/* Bridal Feature Image */}
                    <div className="lg:col-span-6 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                        <Image
                            src="https://images.pexels.com/photos/9418855/pexels-photo-9418855.jpeg?auto=compress&cs=tinysrgb&w=1600"
                            alt="Designs by Nisha Heirloom Crimson Bridal Lehenga New Delhi"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
