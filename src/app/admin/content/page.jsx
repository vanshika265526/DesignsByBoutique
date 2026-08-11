"use client";

import { useEffect, useState } from "react";
import {
    MessageSquare,
    Phone,
    MapPin,
    Clock,
    Instagram,
    Star,
    Plus,
    Trash2,
    Save,
    Sparkles,
    Check,
    Globe,
    User,
    Mail,
    MessageCircle,
} from "lucide-react";

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState("testimonials");
    const [testimonials, setTestimonials] = useState([]);
    const [settings, setSettings] = useState({
        boutiqueName: "",
        tagline: "",
        phone: "",
        phoneDisplay: "",
        whatsappNumber: "",
        defaultWhatsAppMessage: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        fullAddress: "",
        instagramUsername: "",
        instagramUrl: "",
        hours: "",
        openingHours: {
            weekdays: "",
            sunday: "",
            closed: "",
        },
        seoTitle: "",
        seoDescription: "",
    });

    const [loading, setLoading] = useState(true);
    const [savingSettings, setSavingSettings] = useState(false);
    const [savedNotice, setSavedNotice] = useState(false);

    // Testimonial Modal State
    const [showTestimonialModal, setShowTestimonialModal] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [testimonialForm, setTestimonialForm] = useState({
        author: "",
        city: "",
        rating: 5,
        text: "",
        outfit: "",
        avatar: "",
        featured: true,
    });

    useEffect(() => {
        Promise.all([
            fetch("/api/data/testimonials").then((res) => res.json()),
            fetch("/api/data/settings").then((res) => res.json()),
        ])
            .then(([testRes, setRes]) => {
                if (testRes.success) setTestimonials(testRes.data);
                if (setRes.success && setRes.data) setSettings(setRes.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load content management data:", err);
                setLoading(false);
            });
    }, []);

    // Save Settings Handler
    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            const res = await fetch("/api/data/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            const json = await res.json();
            if (json.success) {
                setSavedNotice(true);
                setTimeout(() => setSavedNotice(false), 3000);
            }
        } catch (err) {
            console.error("Save settings error:", err);
        } finally {
            setSavingSettings(false);
        }
    };

    // Testimonial Submit (Create or Update)
    const handleTestimonialSubmit = async () => {
        if (!testimonialForm.author || !testimonialForm.text) {
            alert("Author name and review text are required.");
            return;
        }

        try {
            if (editingTestimonial) {
                const res = await fetch("/api/data/testimonials", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingTestimonial.id, ...testimonialForm }),
                });
                const json = await res.json();
                if (json.success) {
                    setTestimonials((prev) =>
                        prev.map((t) => (t.id === editingTestimonial.id ? json.data : t))
                    );
                }
            } else {
                const res = await fetch("/api/data/testimonials", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(testimonialForm),
                });
                const json = await res.json();
                if (json.success) {
                    setTestimonials((prev) => [json.data, ...prev]);
                }
            }
            setShowTestimonialModal(false);
            setEditingTestimonial(null);
            setTestimonialForm({
                author: "",
                city: "",
                rating: 5,
                text: "",
                outfit: "",
                avatar: "",
                featured: true,
            });
        } catch (err) {
            console.error("Save testimonial error:", err);
        }
    };

    // Delete Testimonial
    const handleDeleteTestimonial = async (id) => {
        if (!confirm("Are you sure you want to remove this client review?")) return;
        try {
            const res = await fetch(`/api/data/testimonials?id=${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (json.success) {
                setTestimonials((prev) => prev.filter((t) => t.id !== id));
            }
        } catch (err) {
            console.error("Delete testimonial error:", err);
        }
    };

    if (loading) {
        return (
            <div className="p-12 text-center text-xs text-neutral-400 space-y-3">
                <div className="w-6 h-6 border-2 border-boutique-rose border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading content management studio...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div>
                    <div className="inline-flex items-center space-x-2 bg-boutique-rose/10 px-3 py-1 rounded-full text-xs text-boutique-rose font-medium mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Homepage & Contact CMS</span>
                    </div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Boutique Content & Testimonials
                    </h1>
                    <p className="text-xs text-neutral-500">
                        Manage client reviews, studio contact information, WhatsApp messaging, and operating hours.
                    </p>
                </div>

                <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm self-start sm:self-auto"
                >
                    {savingSettings ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : savedNotice ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>{savedNotice ? "Settings Saved!" : "Save All Changes"}</span>
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2 overflow-x-auto">
                {[
                    { id: "testimonials", label: "Client Testimonials", icon: MessageSquare },
                    { id: "contact", label: "Contact & WhatsApp", icon: Phone },
                    { id: "hours", label: "Address & Opening Hours", icon: Clock },
                    { id: "social", label: "Social & SEO", icon: Instagram },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-neutral-900 text-white shadow-sm"
                                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab 1: Client Testimonials */}
            {activeTab === "testimonials" && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                                Client Love & Reviews
                            </h3>
                            <p className="text-xs text-neutral-500">
                                Testimonials displayed on the homepage showcase
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingTestimonial(null);
                                setTestimonialForm({
                                    author: "",
                                    city: "",
                                    rating: 5,
                                    text: "",
                                    outfit: "",
                                    avatar: "",
                                    featured: true,
                                });
                                setShowTestimonialModal(true);
                            }}
                            className="bg-boutique-rose text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 hover:bg-boutique-rose-dark transition-colors shadow-2xs"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Client Testimonial</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-2xs relative group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden relative border border-neutral-200 flex-shrink-0">
                                            {t.avatar ? (
                                                <img
                                                    src={t.avatar}
                                                    alt={t.author}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-5 h-5 text-neutral-400 m-2.5" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-neutral-800">{t.author}</h4>
                                            <p className="text-xs text-neutral-400">{t.city}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingTestimonial(t);
                                                setTestimonialForm(t);
                                                setShowTestimonialModal(true);
                                            }}
                                            className="text-xs font-semibold text-boutique-rose hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTestimonial(t.id)}
                                            className="text-neutral-400 hover:text-rose-600 p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-1 text-amber-400">
                                    {[...Array(t.rating || 5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>

                                <p className="text-xs text-neutral-600 italic font-serif leading-relaxed">
                                    "{t.text}"
                                </p>

                                {t.outfit && (
                                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                                        <span className="text-neutral-400 uppercase font-mono">Bespoke Outfit</span>
                                        <span className="font-semibold text-boutique-rose">{t.outfit}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab 2: Contact & WhatsApp */}
            {activeTab === "contact" && (
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                    <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                        Studio Contact Details & Direct Messaging
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Studio Display Phone Number
                            </label>
                            <input
                                type="text"
                                value={settings.phoneDisplay || ""}
                                onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Official WhatsApp Number (Numeric with Country Code)
                            </label>
                            <input
                                type="text"
                                value={settings.whatsappNumber || ""}
                                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                placeholder="919876543210"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-boutique-rose"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Concierge Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.email || ""}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                placeholder="enquire@designsbynisha.com"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Default WhatsApp Welcome Pre-filled Message
                            </label>
                            <textarea
                                rows={3}
                                value={settings.defaultWhatsAppMessage || ""}
                                onChange={(e) => setSettings({ ...settings, defaultWhatsAppMessage: e.target.value })}
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Address & Opening Hours */}
            {activeTab === "hours" && (
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                    <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                        Physical Boutique Address & Fitting Hours
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Full Studio Address
                            </label>
                            <input
                                type="text"
                                value={settings.fullAddress || ""}
                                onChange={(e) => setSettings({ ...settings, fullAddress: e.target.value })}
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Weekday Opening Hours (Mon - Sat)
                            </label>
                            <input
                                type="text"
                                value={settings.hours || settings.openingHours?.weekdays || ""}
                                onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                                placeholder="10:30 AM - 8:00 PM"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Sunday & Appointments Note
                            </label>
                            <input
                                type="text"
                                value={settings.openingHours?.sunday || "By Appointment Only"}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        openingHours: { ...settings.openingHours, sunday: e.target.value },
                                    })
                                }
                                placeholder="By Appointment Only"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 4: Social & SEO */}
            {activeTab === "social" && (
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                    <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                        Social Media & Search Engine Metadata
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Instagram Handle
                            </label>
                            <input
                                type="text"
                                value={settings.instagramUsername || ""}
                                onChange={(e) => setSettings({ ...settings, instagramUsername: e.target.value })}
                                placeholder="@designsbynisha"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-boutique-rose"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Instagram Profile URL
                            </label>
                            <input
                                type="text"
                                value={settings.instagramUrl || ""}
                                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/designsbynisha"
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-boutique-rose"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                Default Website SEO Meta Title
                            </label>
                            <input
                                type="text"
                                value={settings.seoTitle || ""}
                                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Testimonial Modal */}
            {showTestimonialModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
                        <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                            {editingTestimonial ? "Edit Client Review" : "Add Client Testimonial"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Client Name *
                                </label>
                                <input
                                    type="text"
                                    value={testimonialForm.author}
                                    onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                                    placeholder="e.g. Kavita Malhotra"
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Location / City
                                </label>
                                <input
                                    type="text"
                                    value={testimonialForm.city}
                                    onChange={(e) => setTestimonialForm({ ...testimonialForm, city: e.target.value })}
                                    placeholder="e.g. South Extension, New Delhi"
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Bespoke Outfit Purchased
                                </label>
                                <input
                                    type="text"
                                    value={testimonialForm.outfit}
                                    onChange={(e) => setTestimonialForm({ ...testimonialForm, outfit: e.target.value })}
                                    placeholder="e.g. Heirloom Bridal Lehenga"
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Review Text *
                                </label>
                                <textarea
                                    rows={4}
                                    value={testimonialForm.text}
                                    onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                                    placeholder="Write client words..."
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-100">
                            <button
                                type="button"
                                onClick={() => setShowTestimonialModal(false)}
                                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleTestimonialSubmit}
                                className="px-5 py-2 bg-boutique-rose hover:bg-boutique-rose-dark text-white rounded-xl text-xs font-semibold"
                            >
                                Save Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
