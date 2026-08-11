"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Phone, MapPin, Instagram, Mail, Clock, Sparkles } from "lucide-react";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        boutiqueName: "Designs by Nisha",
        tagline: "For Every Chapter of Her Story",
        whatsapp: "+91 98100 12345",
        phone: "+91 98100 12345",
        email: "contact@designsbynisha.com",
        address: "Design Studio & Atelier, Greater Kailash 1, Main Market, New Delhi, India 110048",
        instagram: "https://instagram.com/designsbynisha",
        businessHours: "Mon - Sat: 11:00 AM - 7:30 PM (Sun By Appointment)",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);

    useEffect(() => {
        fetch("/api/data/settings")
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data) {
                    setSettings((prev) => ({ ...prev, ...json.data }));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const saveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/data/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
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

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Studio Settings & Contact Config
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Update official phone numbers, WhatsApp routing, store location, and social links
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
                                <span>New Delhi Studio Address</span>
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
