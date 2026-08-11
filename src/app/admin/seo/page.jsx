"use client";

import { useEffect, useState } from "react";
import { Globe, Save, Search, Sparkles, Check } from "lucide-react";

export default function AdminSeoPage() {
    const [seo, setSeo] = useState({
        siteTitle: "Designs by Nisha | Premium Luxury Fashion & Bridal Boutique New Delhi",
        metaDescription: "Explore bespoke bridal lehengas, silk Anarkalis, Haldi shararas, and handcrafted maternity gowns at Designs by Nisha, New Delhi.",
        keywords: "bridal lehenga delhi, luxury boutique new delhi, anarkali suit, maternity gown, designer baby lehenga, designs by nisha",
        gaMeasurementId: "G-XXXXXXXXXX",
        ogImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    });

    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);

    useEffect(() => {
        fetch("/api/data/settings")
            .then((r) => r.json())
            .then((json) => {
                if (json.success && json.data?.seo) {
                    setSeo((prev) => ({ ...prev, ...json.data.seo }));
                }
            })
            .catch(() => { });
    }, []);

    const saveSeo = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/data/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ seo }),
            });
            const json = await res.json();
            if (json.success) {
                setSavedMsg(true);
                setTimeout(() => setSavedMsg(false), 3000);
            }
        } catch (err) {
            console.error("Error saving SEO config:", err);
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
                        SEO & Metadata Manager
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Control Search Engine Title tags, Meta Descriptions, Google Analytics, and OpenGraph social media preview cards
                    </p>
                </div>

                <button
                    onClick={saveSeo}
                    disabled={saving}
                    className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm w-fit"
                >
                    {saving ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    <span>{savedMsg ? "SEO Saved!" : "Save SEO Metadata"}</span>
                </button>
            </div>

            {/* Form & Google Search Snippet Preview */}
            <div className="space-y-6">
                {/* Live Google Search Preview */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3 shadow-2xs">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase text-neutral-400 font-semibold border-b border-neutral-100 pb-2">
                        <Search className="w-3.5 h-3.5 text-blue-600" />
                        <span>Google Search Snippet Preview</span>
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 font-sans space-y-1">
                        <p className="text-[11px] text-neutral-500 font-mono">
                            https://www.designsbynisha.com
                        </p>
                        <h3 className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                            {seo.siteTitle || "Designs by Nisha | Luxury Boutique"}
                        </h3>
                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                            {seo.metaDescription || "Bespoke Indian ethnic wear boutique."}
                        </p>
                    </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={saveSeo} className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 text-xs shadow-2xs">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="font-semibold text-neutral-700">Global Website Title Tag</label>
                            <span className="text-[10px] text-neutral-400 font-mono">
                                {seo.siteTitle.length} / 60 chars
                            </span>
                        </div>
                        <input
                            type="text"
                            value={seo.siteTitle}
                            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="font-semibold text-neutral-700">Meta Description</label>
                            <span className="text-[10px] text-neutral-400 font-mono">
                                {seo.metaDescription.length} / 160 chars
                            </span>
                        </div>
                        <textarea
                            rows={3}
                            value={seo.metaDescription}
                            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-neutral-700 mb-1">SEO Target Keywords (comma separated)</label>
                        <input
                            type="text"
                            value={seo.keywords}
                            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                            className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-[11px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
                        <div>
                            <label className="block font-semibold text-neutral-700 mb-1">Google Analytics Measurement ID</label>
                            <input
                                type="text"
                                value={seo.gaMeasurementId}
                                onChange={(e) => setSeo({ ...seo, gaMeasurementId: e.target.value })}
                                placeholder="G-XXXXXXXXXX"
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-neutral-700 mb-1">OpenGraph Social Share Image URL</label>
                            <input
                                type="text"
                                value={seo.ogImage}
                                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-[11px]"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
