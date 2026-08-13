import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import InstagramIcon from "@/components/ui/InstagramIcon";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";

export default function Footer() {
    return (
        <footer className="bg-boutique-charcoal text-white pt-16 pb-12 border-t border-boutique-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
                    {/* Column 1: Brand Logo + Philosophy */}
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" aria-label="Designs by Nisha Boutique — Home" className="inline-block group">
                            <div className="bg-white/95 p-3 rounded-2xl border border-white/20 shadow-md inline-block transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/images/logo.png?v=20260812"
                                    alt="Designs by Nisha Boutique New Delhi"
                                    width={200}
                                    height={100}
                                    className="h-16 w-auto object-contain mix-blend-multiply"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-neutral-300 leading-relaxed italic">
                            &ldquo;{boutiqueConfig.tagline}&rdquo;
                        </p>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            Curating luxury Indian fashion, bespoke bridal lehengas, maternity gowns, and heirloom baby outfits for life&rsquo;s grandest celebrations.
                        </p>
                    </div>

                    {/* Column 2: The 5 Chapters */}
                    <div className="space-y-4">
                        <h4 className="font-serif-editorial text-lg text-boutique-gold tracking-wide">
                            Her Chapters
                        </h4>
                        <ul className="space-y-2 text-xs text-neutral-300">
                            <li>
                                <Link href="/collections/suits-anarkalis" className="hover:text-boutique-blush transition-colors">
                                    01. Her Beginnings (Suits &amp; Anarkalis)
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/bridal-lehengas" className="hover:text-boutique-blush transition-colors">
                                    02. Her Forever (Bridal Lehengas)
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/haldi-mehendi" className="hover:text-boutique-blush transition-colors">
                                    03. Her New Chapter (Haldi &amp; Mehendi)
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/maternity-gowns" className="hover:text-boutique-blush transition-colors">
                                    04. Her Motherhood (Maternity Gowns)
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections/baby-clothes" className="hover:text-boutique-blush transition-colors">
                                    05. Her Little One (Baby Clothes)
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Navigation Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-serif-editorial text-lg text-boutique-gold tracking-wide">
                            Boutique Experience
                        </h4>
                        <ul className="space-y-2 text-xs text-neutral-300">
                            <li>
                                <Link href="/our-story" className="hover:text-boutique-blush transition-colors">
                                    Our Atelier &amp; Story
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="hover:text-boutique-blush transition-colors">
                                    Lookbook &amp; Editorial Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections" className="hover:text-boutique-blush transition-colors">
                                    Browse All Collections
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-boutique-blush transition-colors">
                                    Visit New Delhi Studio
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Social */}
                    <div className="space-y-4">
                        <h4 className="font-serif-editorial text-lg text-boutique-gold tracking-wide">
                            New Delhi Studio
                        </h4>
                        <div className="space-y-3 text-xs text-neutral-300">
                            <a
                                href={boutiqueConfig.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-2 group hover:text-boutique-blush transition-colors"
                            >
                                <MapPin className="w-4 h-4 text-boutique-gold flex-shrink-0 mt-0.5" />
                                <span className="group-hover:underline">{boutiqueConfig.fullAddress}</span>
                            </a>
                            <p className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-boutique-gold flex-shrink-0" />
                                <span>{boutiqueConfig.contact.phoneDisplay}</span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-boutique-gold flex-shrink-0" />
                                <span>{boutiqueConfig.contact.email}</span>
                            </p>
                        </div>

                        {/* Mini map — opens full Google Maps on click */}
                        <a
                            href={boutiqueConfig.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open Designs by Nisha studio location in Google Maps"
                            className="group relative block rounded-xl overflow-hidden border border-white/10 shadow-md"
                        >
                            <iframe
                                title="Map to Designs by Nisha — New Delhi studio"
                                src="https://maps.google.com/maps?q=318%20Block%20A1%20Chattarpur%20Chhatarpur%20New%20Delhi%20110074&z=15&output=embed"
                                className="w-full h-32 border-0 pointer-events-none grayscale-[0.25] group-hover:grayscale-0 transition-all duration-500"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            <span className="absolute bottom-2 right-2 bg-boutique-charcoal/85 text-white text-[10px] font-medium px-2 py-1 rounded-full inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-boutique-gold" />
                                Open in Maps
                            </span>
                        </a>

                        <div className="pt-2 flex items-center space-x-3">
                            <a
                                href={boutiqueConfig.instagram.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 rounded-full text-white transition-opacity shadow-sm"
                                aria-label="Instagram"
                            >
                                <InstagramIcon className="w-4 h-4" />
                            </a>
                            <a
                                href={buildWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white transition-colors"
                                aria-label="WhatsApp"
                            >
                                <WhatsAppIcon className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-400 space-y-4 md:space-y-0">
                    <p>© 2026 Designs by Nisha. All rights reserved.</p>
                    <p className="flex items-center space-x-1 italic text-neutral-400">
                        <span>Designed with</span>
                        <Heart className="w-3.5 h-3.5 text-boutique-rose fill-boutique-rose mx-1" />
                        <span>for every chapter of her story.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
