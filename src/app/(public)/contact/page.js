"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Send, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { boutiqueConfig, buildWhatsAppLink } from "@/config/boutique";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        chapterInterest: "Bridal Lehengas (Chapter 02)",
        message: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = `Hi Designs by Nisha! My name is ${formData.name} (${formData.phone}). I am interested in: ${formData.chapterInterest}. Note: ${formData.message}`;
        const url = buildWhatsAppLink({ customMessage: text });
        window.open(url, "_blank");
    };

    return (
        <div className="pt-28 pb-24 bg-boutique-bg min-h-screen space-y-16">
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

                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-boutique-rose flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-boutique-charcoal block">Email Inquiries</span>
                                    <span>{boutiqueConfig.contact.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Direct Channel Buttons */}
                        <div className="pt-4 border-t border-boutique-muted-border space-y-3">
                            <a
                                href={buildWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-sm"
                            >
                                <MessageCircle className="w-4 h-4 text-white" />
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
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
