"use client";

import { useState } from "react";
import { Sparkles, Send, CheckCircle, MapPin, Clock, MessageCircle, CalendarCheck } from "lucide-react";
import { buildWhatsAppLink } from "@/config/boutique";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const COLLECTIONS = [
    "Suits & Anarkalis (Chapter 01)",
    "Bridal Lehengas (Chapter 02)",
    "Haldi & Mehendi (Chapter 03)",
    "Maternity Gowns (Chapter 04)",
    "Baby Clothes (Chapter 05)",
];

export default function HomeContactForm() {
    const [activeTab, setActiveTab] = useState("message");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        chapterInterest: COLLECTIONS[1],
        message: "",
    });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const text = `Hi Designs by Nisha! My name is ${formData.name} (${formData.phone}). I am interested in: ${formData.chapterInterest}. Note: ${formData.message}`;

        window.open(buildWhatsAppLink({ customMessage: text }), "_blank", "noopener,noreferrer");

        fetch("/api/data/enquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                productName: formData.chapterInterest,
                productCategory: "Home Contact Form",
                message: formData.message,
            }),
        }).catch(() => { });

        setSent(true);
        setFormData({ name: "", phone: "", chapterInterest: COLLECTIONS[1], message: "" });
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-boutique-muted-border focus:outline-none focus:ring-2 focus:ring-boutique-rose/40 text-sm bg-white";

    return (
        <section className="py-16 md:py-24 bg-boutique-bg-card border-t border-boutique-muted-border/40">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">



                {/* Section Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 text-boutique-rose text-xs font-semibold uppercase tracking-[0.25em]">
                        <Sparkles className="w-4 h-4 text-boutique-gold" />
                        <span>Direct Boutique Inquiry</span>
                    </div>
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-boutique-charcoal mt-2">
                        Get In Touch
                    </h2>
                    <p className="text-sm text-boutique-taupe font-light mt-2 max-w-lg mx-auto">
                        Send us a message or come visit us at our New Delhi atelier.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex rounded-2xl border border-boutique-muted-border overflow-hidden mb-6 bg-white shadow-xs">
                    <button
                        type="button"
                        onClick={() => setActiveTab("message")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeTab === "message"
                            ? "bg-[#1F4A3B] text-white shadow-inner"
                            : "text-boutique-charcoal hover:bg-boutique-blush/30"
                            }`}
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send a Message</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("visit")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${activeTab === "visit"
                            ? "bg-[#1F4A3B] text-white shadow-inner"
                            : "text-boutique-charcoal hover:bg-boutique-blush/30"
                            }`}
                    >
                        <MapPin className="w-4 h-4" />
                        <span>Visit the Boutique</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="transition-all duration-300">

                    {/* Tab 1 — Contact Form */}
                    {activeTab === "message" && (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-6 sm:p-8 rounded-3xl border border-boutique-muted-border shadow-md space-y-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                        Your Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Ananya Sharma"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setSent(false);
                                            setFormData({ ...formData, name: e.target.value });
                                        }}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                        WhatsApp Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="e.g. +91 98765 43210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                    Collection of Interest
                                </label>
                                <select
                                    value={formData.chapterInterest}
                                    onChange={(e) => setFormData({ ...formData, chapterInterest: e.target.value })}
                                    className={`${inputClass}`}
                                >
                                    {COLLECTIONS.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider font-semibold text-boutique-charcoal mb-1">
                                    Your Message
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your event date, colour preferences, or fitting needs…"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className={inputClass}
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
                    )}

                    {/* Tab 2 — Visit Info */}
                    {activeTab === "visit" && (
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-boutique-muted-border shadow-md space-y-5">
                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-[#1c4d3d]/10 text-[#1c4d3d] flex-shrink-0 mt-0.5">
                                    <MapPin className="w-5 h-5 stroke-[1.75]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs tracking-wider uppercase text-[#1c4d3d] mb-1">Our Atelier</h4>
                                    <p className="text-sm text-boutique-charcoal font-medium leading-snug">Designs by Nisha</p>
                                    <p className="text-sm text-boutique-taupe font-light leading-relaxed mt-0.5">
                                        New Delhi, India
                                    </p>
                                    <a
                                        href="https://maps.google.com/?q=Designs+by+Nisha+New+Delhi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-2 text-xs font-semibold text-[#1F4A3B] underline underline-offset-2 hover:text-[#153e31] transition-colors"
                                    >
                                        Open in Google Maps →
                                    </a>
                                </div>
                            </div>

                            <hr className="border-boutique-muted-border/60" />

                            {/* Hours */}
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-[#1c4d3d]/10 text-[#1c4d3d] flex-shrink-0 mt-0.5">
                                    <Clock className="w-5 h-5 stroke-[1.75]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs tracking-wider uppercase text-[#1c4d3d] mb-1">Opening Hours</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs gap-8">
                                            <span className="text-boutique-charcoal font-medium">Monday – Sunday</span>
                                            <span className="text-boutique-taupe font-light">10:00 AM – 9:00 PM</span>
                                        </div>
                                        <p className="text-xs text-boutique-taupe/70 italic mt-1">Walk-ins welcome · Appointments preferred</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-boutique-muted-border/60" />

                            {/* WhatsApp CTA */}
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-[#1c4d3d]/10 text-[#1c4d3d] flex-shrink-0 mt-0.5">
                                    <CalendarCheck className="w-5 h-5 stroke-[1.75]" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-xs tracking-wider uppercase text-[#1c4d3d] mb-1">Book A Visit</h4>
                                    <p className="text-sm text-boutique-taupe font-light mb-3">
                                        Message us on WhatsApp to confirm your appointment and get directions.
                                    </p>
                                    <a
                                        href={buildWhatsAppLink({ customMessage: "Hi! I'd like to book a visit to your boutique." })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#1F4A3B] hover:bg-[#153e31] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <WhatsAppIcon className="w-4 h-4 text-white" />
                                        <span>Book Via WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
