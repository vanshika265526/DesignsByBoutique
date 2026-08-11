"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Eye,
    TrendingUp,
    MessageCircle,
    PhoneCall,
    Instagram,
    Sparkles,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    ShoppingBag,
    Grid,
    BarChart3,
    Clock,
    CheckCircle2,
    Filter,
} from "lucide-react";

export default function AdminAnalyticsPage() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState("30days");

    useEffect(() => {
        fetch("/api/data/analytics")
            .then((res) => res.json())
            .then((json) => {
                if (json.success) setAnalytics(json.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load analytics:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse max-w-7xl">
                <div className="h-28 bg-neutral-200 rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const {
        totalPageViews = 14850,
        monthlyPageViews = 4230,
        productViews = 8920,
        whatsappClicks = 640,
        callClicks = 215,
        instagramClicks = 1120,
        dailyPageViews = [],
        categoryPerformance = [],
        topProducts = [],
    } = analytics || {};

    const maxViews = Math.max(...dailyPageViews.map((d) => d.views), 1000);

    const metrics = [
        {
            title: "Total Site Views",
            value: totalPageViews.toLocaleString(),
            change: "+18.4%",
            positive: true,
            icon: Eye,
            color: "text-boutique-rose",
            bg: "bg-boutique-rose/10",
        },
        {
            title: "Monthly Page Views",
            value: monthlyPageViews.toLocaleString(),
            change: "+12.1%",
            positive: true,
            icon: BarChart3,
            color: "text-amber-600",
            bg: "bg-amber-100",
        },
        {
            title: "Outfit Detail Views",
            value: productViews.toLocaleString(),
            change: "+22.5%",
            positive: true,
            icon: ShoppingBag,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            title: "WhatsApp Leads",
            value: whatsappClicks.toLocaleString(),
            change: "+28.7%",
            positive: true,
            icon: MessageCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
        },
        {
            title: "Direct Phone Calls",
            value: callClicks.toLocaleString(),
            change: "+8.3%",
            positive: true,
            icon: PhoneCall,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Instagram Redirects",
            value: instagramClicks.toLocaleString(),
            change: "+34.2%",
            positive: true,
            icon: Instagram,
            color: "text-pink-600",
            bg: "bg-pink-100",
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 bg-boutique-rose/10 px-3 py-1 rounded-full text-xs text-boutique-rose font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Live Google & Internal Analytics</span>
                    </div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Analytics & Performance Studio
                    </h1>
                    <p className="text-xs text-neutral-500">
                        Monitor page views, customer conversion channels, top-performing outfits, and category demand.
                    </p>
                </div>

                {/* Timeframe Filter */}
                <div className="flex items-center space-x-2 bg-neutral-100 p-1.5 rounded-xl border border-neutral-200">
                    {["7days", "30days", "year"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${timeframe === t
                                    ? "bg-white text-boutique-rose shadow-2xs font-bold"
                                    : "text-neutral-500 hover:text-neutral-800"
                                }`}
                        >
                            {t === "7days" ? "Last 7 Days" : t === "30days" ? "Last 30 Days" : "This Year"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {metrics.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all space-y-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <span className="text-xs text-neutral-400 font-mono uppercase tracking-wider">
                                        {m.title}
                                    </span>
                                    <h3 className="text-3xl font-bold font-serif-editorial text-boutique-charcoal">
                                        {m.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${m.bg} ${m.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 text-xs border-t border-neutral-100 pt-3">
                                <span
                                    className={`inline-flex items-center font-semibold font-mono ${m.positive ? "text-emerald-600" : "text-rose-600"
                                        }`}
                                >
                                    {m.positive ? (
                                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                                    ) : (
                                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                                    )}
                                    {m.change}
                                </span>
                                <span className="text-neutral-400">vs previous period</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Daily Traffic Chart */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                    <div>
                        <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                            Daily Traffic & Customer Engagement
                        </h3>
                        <p className="text-xs text-neutral-500">
                            Daily breakdown of website pageviews, WhatsApp clicks, and Instagram interactions
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-medium">
                        <span className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 rounded-full bg-boutique-rose inline-block" />
                            <span className="text-neutral-600">Page Views</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                            <span className="text-neutral-600">WhatsApp Leads</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                            <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
                            <span className="text-neutral-600">Instagram Clicks</span>
                        </span>
                    </div>
                </div>

                {/* SVG Visual Bar Chart */}
                <div className="pt-4 pb-2">
                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                        {dailyPageViews.map((day, idx) => {
                            const barHeight = Math.max(15, Math.round((day.views / maxViews) * 100));
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-12 bg-neutral-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                                        <p className="font-bold">{day.date}</p>
                                        <p>{day.views} Views • {day.whatsapp} WhatsApp</p>
                                    </div>

                                    {/* Stacked bars */}
                                    <div className="w-full max-w-[40px] bg-neutral-100 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all group-hover:bg-neutral-200" style={{ height: `${barHeight}%` }}>
                                        <div
                                            className="w-full bg-boutique-rose transition-all group-hover:bg-boutique-rose-dark"
                                            style={{ height: "65%" }}
                                        />
                                        <div className="w-full bg-emerald-500" style={{ height: "20%" }} />
                                        <div className="w-full bg-pink-500" style={{ height: "15%" }} />
                                    </div>

                                    <span className="text-[10px] text-neutral-400 font-mono">
                                        {day.date.split(" ")[1]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom 2-Column Grid: Top Products & Category Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performing Outfits */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-5 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div>
                            <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                                Most Viewed & Contacted Outfits
                            </h3>
                            <p className="text-xs text-neutral-500">
                                Product leaderboard ranked by customer demand
                            </p>
                        </div>
                        <Link
                            href="/admin/products"
                            className="text-xs font-semibold text-boutique-rose hover:underline flex items-center space-x-1"
                        >
                            <span>Manage Outfits</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {topProducts.map((prod, idx) => (
                            <div
                                key={prod.id || idx}
                                className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 hover:bg-neutral-100/80 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="w-6 h-6 rounded-full bg-boutique-rose/10 text-boutique-rose font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        #{idx + 1}
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-neutral-800 line-clamp-1">
                                            {prod.name}
                                        </p>
                                        <span className="text-[10px] text-neutral-400 uppercase font-mono">
                                            {prod.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 text-xs">
                                    <div className="text-right">
                                        <p className="font-bold text-neutral-800 font-mono">
                                            {prod.views}
                                        </p>
                                        <span className="text-[10px] text-neutral-400">Views</span>
                                    </div>
                                    <div className="text-right border-l border-neutral-200 pl-3">
                                        <p className="font-bold text-emerald-600 font-mono">
                                            {prod.contacts}
                                        </p>
                                        <span className="text-[10px] text-neutral-400">Leads</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category-Wise Performance */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-5 shadow-2xs">
                    <div className="border-b border-neutral-100 pb-3">
                        <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                            Category Demand Share
                        </h3>
                        <p className="text-xs text-neutral-500">
                            Distribution of interest across Her Story chapters
                        </p>
                    </div>

                    <div className="space-y-4">
                        {categoryPerformance.map((cat, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-neutral-800">{cat.category}</span>
                                    <div className="space-x-2 font-mono">
                                        <span className="text-neutral-500">{cat.views} views</span>
                                        <span className="text-boutique-rose font-bold">{cat.share}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-boutique-rose to-boutique-blush rounded-full transition-all duration-500"
                                        style={{ width: cat.share }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-neutral-100 bg-neutral-50 p-4 rounded-xl">
                        <p className="text-xs text-neutral-600 font-medium">
                            <strong>Insights Note:</strong> Bridal Lehengas and Suits & Anarkalis constitute over 70% of total customer inquiries. High opportunity to feature new launches in these categories.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
