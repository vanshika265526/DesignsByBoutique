"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Instagram, Send, Sparkles, CheckCircle } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        chapterInterest: "Bridal Lehengas (Chapter 02)",
        message: "",
    });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const text = `Hi Designs by Nisha! My name is ${formData.name} (${formData.phone}). I am interested in: ${formData.chapterInterest}. Note: ${formData.message}`;
        const url = buildWhatsAppLink({ customMessage: text });

        // Open WhatsApp to the boutique number immediately, inside the click
        // gesture so the browser does not block it as a popup.
        window.open(url, "_blank", "noopener,noreferrer");

        // Best-effort: also record the lead in the admin dashboard so no
        // enquiry is lost even if the WhatsApp hand-off is not completed.
        fetch("/api/data/enquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                productName: formData.chapterInterest,
                productCategory: "Contact Form",
                message: formData.message,
            }),
        }).catch(() => {});

        setSent(true);
        setFormData({
            name: "",
            phone: "",
            chapterInterest: "Bridal Lehengas (Chapter 02)",
            message: "",
        });
    };

    return (
        <div className="pt-8 pb-24 bg-boutique-bg min-h-screen space-y-16">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="VISIT US IN NEW DELHI"
                    title="Begin Your Journey With Us"
                    subtitle="Speak with our master designers, schedule a private bridal fitting, or enquire about bespoke outfit customizations."
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Studio Contact Information Left */}
                    <div className="lg:col-span-5 space-y-8 bg-boutique-bg-card p-8 rounded-3xl border border-boutique-muted-border shadow-sm">
                        <div>
                            <h3 className="font-serif-editorial text-2xl text-boutique-charcoal font-bold">
                                Designs by Nisha Boutique
                            </h3>
                            <p className="text-xs uppercase tracking-widest text-boutique-gold font-semibold pt-1">
                                NEW DELHI • ATELIER
                            </p>
                        </div>

                        <div className="space-y-5 text-sm text-boutique-taupe font-light">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-boutique-rose flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-boutique-charcoal block">Location Address</span>
                                    <span>{boutiqueConfig.fullAddress}</span>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Clock className="w-5 h-5 text-boutique-gold flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-boutique-charcoal block">Studio Hours</span>
                                    <span>{boutiqueConfig.contact.hours}</span>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-boutique-charcoal block">Phone & WhatsApp</span>
                                    <span>{boutiqueConfig.contact.phoneDisplay}</span>
                                </div>
                            </div>

                            <a
                                href={boutiqueConfig.instagram.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-3 group"
                            >
                                <Instagram className="w-5 h-5 text-boutique-rose flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-boutique-charcoal block">Instagram</span>
                                    <span className="group-hover:text-boutique-rose transition-colors">@{boutiqueConfig.instagram.handle}</span>
                                </div>
                            </a>
                        </div>

                        {/* Direct Channel Buttons */}
                        <div className="pt-4 border-t border-boutique-muted-border space-y-3">
                            <a
                                href={buildWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-sm"
                            >
                                <WhatsAppIcon className="w-4 h-4 text-white" />
                                <span>Chat Directly on WhatsApp</span>
                            </a>

                            <a
                                href={boutiqueConfig.instagram.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-white hover:bg-boutique-blush/30 text-boutique-charcoal border border-boutique-muted-border py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                            >
                                <Instagram className="w-4 h-4 text-boutique-rose" />
                                <span>Follow {boutiqueConfig.instagram.handle}</span>
                            </a>
                        </div>
                    </div>

                    {/* Contact & Enquiry Form Right */}
                    <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-boutique-muted-border shadow-md space-y-6">
                        <div>
                            <div className="flex items-center space-x-2 text-boutique-rose text-xs font-semibold uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-boutique-gold" />
                                <span>DIRECT BOUTIQUE INQUIRY</span>
                            </div>
                            <h3 className="font-serif-editorial text-3xl text-boutique-charcoal font-bold mt-1">
                                Send Us A Message
                            </h3>
                            <p className="text-xs text-boutique-taupe font-light mt-1">
                                Submitting this form connects you directly with our New Delhi design team on WhatsApp for fast response.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                    Your Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ananya Sharma"
                                    value={formData.name}
                                    onChange={(e) => { setSent(false); setFormData({ ...formData, name: e.target.value }); }}
                                    className="w-full px-4 py-3 rounded-xl border border-boutique-muted-border focus:outline-none focus:ring-2 focus:ring-boutique-rose/40 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                    WhatsApp Contact Number
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="e.g. +91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-boutique-muted-border focus:outline-none focus:ring-2 focus:ring-boutique-rose/40 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                    Collection of Interest
                                </label>
                                <select
                                    value={formData.chapterInterest}
                                    onChange={(e) => setFormData({ ...formData, chapterInterest: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-boutique-muted-border focus:outline-none focus:ring-2 focus:ring-boutique-rose/40 text-sm bg-white"
                                >
                                    <option value="Suits & Anarkalis (Chapter 01)">Chapter 01 — Suits & Anarkalis</option>
                                    <option value="Bridal Lehengas (Chapter 02)">Chapter 02 — Bridal Lehengas</option>
                                    <option value="Haldi & Mehendi (Chapter 03)">Chapter 03 — Haldi & Mehendi Wear</option>
                                    <option value="Maternity Gowns (Chapter 04)">Chapter 04 — Maternity Gowns</option>
                                    <option value="Baby Clothes (Chapter 05)">Chapter 05 — Baby Clothes</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                    Customization Details or Date of Event
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your event date, color preferences, or fitting requirements..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-boutique-muted-border focus:outline-none focus:ring-2 focus:ring-boutique-rose/40 text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-boutique-rose hover:bg-boutique-rose-dark text-white py-4 rounded-xl text-xs font-semibold tracking-widest uppercase flex items-center justify-center space-x-2 transition-all shadow-md"
                            >
                                <Send className="w-4 h-4" />
                                <span>Submit Inquiry via WhatsApp</span>
                            </button>

                            {sent && (
                                <div className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-3 px-4 text-xs font-medium">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>
                                        Thank you! Your inquiry has been sent. If WhatsApp didn&apos;t open automatically, please check for a blocked popup.
                                    </span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Google Maps Studio Embed Placeholder */}
                <div className="mt-16 bg-white rounded-3xl overflow-hidden border border-boutique-muted-border shadow-sm p-4 text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-boutique-rose">
                        <MapPin className="w-5 h-5" />
                        <span className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                            New Delhi Studio Map Location
                        </span>
                    </div>
                    <p className="text-xs text-boutique-taupe">
                        Located conveniently in South New Delhi. Walk-ins welcome & private bridal appointments available.
                    </p>
                    <a
                        href={boutiqueConfig.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-boutique-bg-alt hover:bg-boutique-blush/40 text-boutique-rose text-xs font-semibold px-6 py-2.5 rounded-full border border-boutique-rose/20 transition-colors"
                    >
                        Open in Google Maps
                    </a>
                </div>
            </div>
        </div>
    );
}
