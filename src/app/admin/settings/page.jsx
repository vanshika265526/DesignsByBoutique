"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Settings, Save, Phone, MapPin, Instagram, Mail, Clock, Sparkles, Megaphone, CheckCircle, ExternalLink, Image as ImageIcon, Upload } from "lucide-react";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        boutiqueName: "Designs by Nisha",
        tagline: "For Every Chapter of Her Story",
        whatsapp: "+91 82187 52043",
        phone: "+91 82187 52043",
        email: "enquire@designsbynisha.com",
        address: "318, near Aayushman Arogya Mandir (Dispensary, Block A1, Chattarpur, Chhatarpur, New Delhi, Delhi 110074",
        instagram: "https://www.instagram.com/designsbynisha00?igsh=Ym92OXh5emZsdm9t",
        businessHours: "Monday – Sunday: 10 AM – 9 PM (By Appointment & Walk-ins)",
        announcementBanner: {
            enabled: true,
            message: "✨ Festive Season Special: Enjoy 15% off bespoke Bridal & Festive orders with code BRIDAL2026! ✨",
            linkText: "Explore Bridal",
            linkUrl: "/collections/bridal-lehengas",
            bgType: "rose",
            speed: "normal",
        },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);

    const handleHeroUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingHero(true);
        const data = new FormData();
        data.append("file", file);
        try {
            const res = await fetch("/api/data/upload", { method: "POST", body: data });
            const json = await res.json();
            if (json.success && json.url) {
                setSettings((prev) => ({ ...prev, heroImage: json.url }));
            }
        } catch (err) {
            console.error("Hero upload error:", err);
        } finally {
            setUploadingHero(false);
        }
    };

    useEffect(() => {
        fetch("/api/data/settings")
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data) {
                    setSettings((prev) => ({
                        ...prev,
                        ...json.data,
                        address: json.data.fullAddress || json.data.address || prev.address,
                        announcementBanner: {
                            ...prev.announcementBanner,
                            ...(json.data.announcementBanner || {}),
                        },
                    }));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const saveSettings = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/data/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...settings,
                    fullAddress: settings.address,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setSavedMsg(true);
                setTimeout(() => setSavedMsg(false), 3000);
            }
        } catch (err) {
            console.error("Error saving settings:", err);
        } finally {
            setSaving(false);
        }
    };

    const updateBanner = (field, value) => {
        setSettings((prev) => ({
            ...prev,
            announcementBanner: {
                ...prev.announcementBanner,
                [field]: value,
            },
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Studio Settings &amp; Contact Config
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Update official phone numbers, WhatsApp routing, Chattarpur studio address, and live announcement banner
                    </p>
                </div>

                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm w-fit"
                >
                    {saving ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>{savedMsg ? "Saved Successfully!" : "Save Settings"}</span>
                </button>
            </div>

            {/* Announcement Banner Management Section */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div className="flex items-center space-x-2">
                        <Megaphone className="w-5 h-5 text-boutique-rose" />
                        <div>
                            <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal">
                                Running Announcement Banner
                            </h3>
                            <p className="text-xs text-neutral-500">
                                Controls the live ticker bar displayed at the very top of the public website
                            </p>
                        </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.announcementBanner?.enabled ?? true}
                            onChange={(e) => updateBanner("enabled", e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-boutique-rose"></div>
                        <span className="ml-2 text-xs font-bold text-neutral-700">
                            {settings.announcementBanner?.enabled ? "ACTIVE (Visible)" : "DISABLED"}
                        </span>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                        <label className="block text-neutral-700 font-semibold mb-1">Banner Announcement Message</label>
                        <input
                            type="text"
                            value={settings.announcementBanner?.message || ""}
                            onChange={(e) => updateBanner("message", e.target.value)}
                            placeholder="e.g. ✨ Festive Season Special: Enjoy 15% off bespoke Bridal & Festive orders! ✨"
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Button / Link Text (Optional)</label>
                        <input
                            type="text"
                            value={settings.announcementBanner?.linkText || ""}
                            onChange={(e) => updateBanner("linkText", e.target.value)}
                            placeholder="e.g. Explore Bridal"
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Button Link Target URL</label>
                        <input
                            type="text"
                            value={settings.announcementBanner?.linkUrl || ""}
                            onChange={(e) => updateBanner("linkUrl", e.target.value)}
                            placeholder="e.g. /collections/bridal-lehengas"
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Banner Color Style</label>
                        <select
                            value={settings.announcementBanner?.bgType || "rose"}
                            onChange={(e) => updateBanner("bgType", e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl bg-white"
                        >
                            <option value="rose">Boutique Rose (Luxury Pink)</option>
                            <option value="gold">Royal Gold</option>
                            <option value="emerald">Festive Emerald</option>
                            <option value="charcoal">Classic Charcoal</option>
                        </select>
                    </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                        Live Preview (Public View)
                    </p>
                    {settings.announcementBanner?.enabled ? (
                        <div className="bg-boutique-rose text-white text-xs py-2 px-4 rounded-lg flex items-center justify-between">
                            <span className="truncate">{settings.announcementBanner?.message}</span>
                            {settings.announcementBanner?.linkText && (
                                <span className="bg-white/20 hover:bg-white/30 text-white text-[11px] px-2.5 py-0.5 rounded-full font-semibold ml-3 flex-shrink-0">
                                    {settings.announcementBanner?.linkText}
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-neutral-500 italic">Banner is currently disabled and hidden from the website.</p>
                    )}
                </div>
            </div>

            {/* Homepage Main Banner Section */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-5 shadow-2xs">
                <div className="flex items-center space-x-2 border-b border-neutral-100 pb-3">
                    <ImageIcon className="w-5 h-5 text-boutique-rose" />
                    <div>
                        <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal">
                            Homepage Main Banner
                        </h3>
                        <p className="text-xs text-neutral-500">
                            The large hero image at the very top of the landing page. Upload from your device or paste an image link.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-5 items-start">
                    {/* Preview */}
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                        <Image
                            src={settings.heroImage || "/images/hero.png"}
                            alt="Homepage banner preview"
                            fill
                            className="object-cover"
                            sizes="220px"
                        />
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-neutral-700 font-semibold mb-1">Image link (URL)</label>
                            <input
                                type="text"
                                value={settings.heroImage || ""}
                                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                                placeholder="/images/hero.png or https://…"
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-[11px]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-boutique-charcoal text-white rounded-xl cursor-pointer hover:bg-neutral-800 font-semibold transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>{uploadingHero ? "Uploading…" : "Upload from device"}</span>
                                <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" disabled={uploadingHero} />
                            </label>
                            {settings.heroImage && (
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, heroImage: "" })}
                                    className="px-3 py-2 text-neutral-500 hover:text-rose-600 rounded-xl border border-neutral-200 hover:border-rose-300 transition-colors"
                                >
                                    Reset to default
                                </button>
                            )}
                        </div>
                        <p className="text-[11px] text-neutral-400">
                            Recommended: a wide, high-resolution photo (landscape, at least 1600px wide). Click
                            <span className="font-semibold text-neutral-600"> Save Settings</span> above to publish.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Settings */}
            <form onSubmit={saveSettings} className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                <div className="space-y-4">
                    <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                        General Identity
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-neutral-700 font-semibold mb-1">Boutique Name</label>
                            <input
                                type="text"
                                value={settings.boutiqueName}
                                onChange={(e) => setSettings({ ...settings, boutiqueName: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-semibold mb-1">Tagline</label>
                            <input
                                type="text"
                                value={settings.tagline}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-neutral-100">
                    <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                        Direct Client Touchpoints
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <label className="block text-neutral-700 font-semibold mb-1 flex items-center space-x-1">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WhatsApp Phone Number (with Country Code)</span>
                            </label>
                            <input
                                type="text"
                                value={settings.whatsapp}
                                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-semibold mb-1 flex items-center space-x-1">
                                <Mail className="w-3.5 h-3.5 text-blue-600" />
                                <span>Official Contact Email</span>
                            </label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-neutral-700 font-semibold mb-1 flex items-center space-x-1">
                                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                                <span>Chattarpur New Delhi Studio Address</span>
                            </label>
                            <input
                                type="text"
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-semibold mb-1 flex items-center space-x-1">
                                <Instagram className="w-3.5 h-3.5 text-purple-600" />
                                <span>Instagram URL</span>
                            </label>
                            <input
                                type="text"
                                value={settings.instagram}
                                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-[11px]"
                            />
                        </div>

                        <div>
                            <label className="block text-neutral-700 font-semibold mb-1 flex items-center space-x-1">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Studio Operating Hours</span>
                            </label>
                            <input
                                type="text"
                                value={settings.businessHours}
                                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
