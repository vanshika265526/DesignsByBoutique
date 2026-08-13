import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/config/boutique";

export default function SignatureCTA() {
    return (
        <section className="py-28 bg-boutique-bg-alt relative overflow-hidden border-t border-boutique-muted-border">
            {/* Soft Background Accent Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-boutique-blush/30 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
                <span className="inline-block px-4 py-1.5 bg-boutique-blush/60 text-boutique-rose text-xs font-semibold tracking-[0.25em] uppercase rounded-full border border-boutique-rose/20">
                    YOUR NEXT CHAPTER
                </span>

                <h2 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl text-boutique-charcoal font-bold leading-tight">
                    Your next chapter deserves something beautiful.
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-boutique-taupe font-light max-w-2xl mx-auto leading-relaxed">
                    Visit our New Delhi boutique atelier or speak with our master designer directly on WhatsApp to begin your bespoke outfit journey.
                </p>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/collections"
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white px-8 py-4 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-all shadow-lg hover:shadow-xl"
                    >
                        <span>Explore The Collection</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                        href={buildWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-full text-xs font-semibold tracking-[0.15em] uppercase transition-all shadow-md"
                    >
                        <WhatsAppIcon className="w-4 h-4 text-white" />
                        <span>Chat With Us on WhatsApp</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
