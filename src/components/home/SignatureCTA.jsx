import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { buildWhatsAppLink } from "@/config/boutique";

export default function SignatureCTA() {
    return (
        <section className="py-16 sm:py-20 bg-boutique-bg-alt relative overflow-hidden border-t border-boutique-muted-border">
            {/* Soft Background Accent Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-boutique-blush/30 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
                {/* Header & Tagline */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-boutique-blush/60 text-boutique-rose text-xs font-semibold tracking-[0.25em] uppercase rounded-full border border-boutique-rose/20">
                        <Sparkles className="w-3.5 h-3.5 text-boutique-rose" />
                        <span>YOUR NEXT CHAPTER</span>
                    </span>

                    <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl text-boutique-charcoal font-bold leading-tight">
                        Your next chapter deserves something beautiful.
                    </h2>

                    <p className="text-sm sm:text-base text-boutique-taupe font-light max-w-2xl mx-auto leading-relaxed">
                        Visit our New Delhi boutique atelier or speak with our master designer directly on WhatsApp to begin your bespoke outfit journey.
                    </p>
                </div>

                {/* Sleek Action Buttons Row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
                    <Link
                        href="/collections"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#1F4A3B] hover:bg-[#153e31] text-white text-xs font-semibold tracking-[0.14em] uppercase whitespace-nowrap transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center"
                    >
                        <span>EXPLORE COLLECTIONS</span>
                        <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
                    </Link>

                    <a
                        href={buildWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white border-2 border-[#1F4A3B] text-[#1F4A3B] hover:bg-[#1F4A3B] hover:text-white text-xs font-semibold tracking-[0.14em] uppercase whitespace-nowrap transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-center"
                    >
                        <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                        <span>ENQUIRE ON WHATSAPP</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

