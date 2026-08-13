"use client";

import { useState } from "react";
import { Sparkles, Send, CheckCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/config/boutique";

const COLLECTIONS = [
    "Suits & Anarkalis (Chapter 01)",
    "Bridal Lehengas (Chapter 02)",
    "Haldi & Mehendi (Chapter 03)",
    "Maternity Gowns (Chapter 04)",
    "Baby Clothes (Chapter 05)",
];

export default function HomeContactForm() {
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

        // Open WhatsApp inside the click gesture so it isn't blocked as a popup.
        window.open(buildWhatsAppLink({ customMessage: text }), "_blank", "noopener,noreferrer");

        // Best-effort: also log the lead to the admin dashboard.
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
        }).catch(() => {});

        setSent(true);
        setFormData({ name: "", phone: "", chapterInterest: COLLECTIONS[1], message: "" });
    };

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-boutique-muted-border focus:outline-none focus:ring-2 focus:ring-boutique-rose/40 text-sm";

    return (
        <section className="py-16 md:py-24 bg-boutique-bg-card border-t border-boutique-muted-border/40">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 text-boutique-rose text-xs font-semibold uppercase tracking-[0.25em]">
                        <Sparkles className="w-4 h-4 text-boutique-gold" />
                        <span>Direct Boutique Inquiry</span>
                    </div>
                    <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-boutique-charcoal mt-2">
                        Send Us A Message
                    </h2>
                    <p className="text-sm text-boutique-taupe font-light mt-2 max-w-lg mx-auto">
                        Tell us what you&apos;re looking for and we&apos;ll reply on WhatsApp for a fast, personal response.
                    </p>
                </div>

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
                            className={`${inputClass} bg-white`}
                        >
                            {COLLECTIONS.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
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
            </div>
        </section>
    );
}
