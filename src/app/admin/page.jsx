"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ShoppingBag,
    Grid,
    Sparkles,
    Tag,
    MessageCircle,
    Users,
    PlusCircle,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
} from "lucide-react";

export default function AdminDashboardPage() {
    const [dbData, setDbData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/data")
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setDbData(json.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching dashboard data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-28 bg-neutral-200 rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const products = dbData?.products || [];
    const categories = dbData?.categories || [];
    const offers = dbData?.offers || [];
    const enquiries = dbData?.enquiries || [];
    const auditLogs = dbData?.auditLogs || [];

    const totalProducts = products.length;
    const publishedProducts = products.filter((p) => p.status === "published" || !p.status).length;
    const featuredProducts = products.filter((p) => p.featured).length;
    const activeOffers = offers.filter((o) => o.active !== false).length;
    const newEnquiries = enquiries.filter((e) => e.status === "New").length;

    const statsCards = [
        {
            title: "Total Products",
            value: totalProducts,
            subtitle: `${publishedProducts} Published • ${totalProducts - publishedProducts} Drafts`,
            icon: ShoppingBag,
            color: "text-boutique-rose",
            bg: "bg-boutique-rose/10",
            href: "/admin/products",
        },
        {
            title: "Active Collections",
            value: categories.length,
            subtitle: "5 Life Chapters Configured",
            icon: Grid,
            color: "text-boutique-gold",
            bg: "bg-boutique-gold/10",
            href: "/admin/categories",
        },
        {
            title: "Featured on Homepage",
            value: featuredProducts,
            subtitle: "Products pinned to Hero Grid",
            icon: Sparkles,
            color: "text-amber-600",
            bg: "bg-amber-100",
            href: "/admin/products?featured=true",
        },
        {
            title: "Active Offers",
            value: activeOffers,
            subtitle: "Promotional Discounts Live",
            icon: Tag,
            color: "text-purple-600",
            bg: "bg-purple-100",
            href: "/admin/offers",
        },
        {
            title: "WhatsApp Enquiries",
            value: enquiries.length,
            subtitle: `${newEnquiries} Unread Leads`,
            icon: MessageCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            href: "/admin/enquiries",
        },
        {
            title: "Website Visitors",
            value: "2,431",
            subtitle: "Google Analytics Active",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            href: "/admin/seo",
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl">
            {/* Header Welcome Banner */}
            <div className="bg-gradient-to-r from-boutique-charcoal via-neutral-900 to-boutique-rose/90 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10 space-y-3 max-w-2xl">
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-boutique-blush font-medium border border-white/10">
                        <Sparkles className="w-3.5 h-3.5 text-boutique-gold" />
                        <span>Designs by Nisha • New Delhi Studio Admin</span>
                    </div>
                    <h1 className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-wide">
                        Boutique Management Studio
                    </h1>
                    <p className="text-sm text-neutral-300 leading-relaxed font-light">
                        Manage your boutique catalog, update prices, activate promotions, and track customer WhatsApp enquiries from a single source of truth.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Link
                            href="/admin/products/new"
                            className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Add New Product</span>
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all"
                        >
                            <span>WhatsApp Settings</span>
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="text-boutique-blush hover:text-white text-xs underline underline-offset-4 flex items-center space-x-1 ml-2"
                        >
                            <span>Open Public Website</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-boutique-gold/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {statsCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={idx}
                            href={card.href}
                            className="group bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md hover:border-boutique-rose/40 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider font-mono">
                                        {card.title}
                                    </p>
                                    <h2 className="text-3xl font-bold font-serif-editorial text-boutique-charcoal">
                                        {card.value}
                                    </h2>
                                </div>
                                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                                <span>{card.subtitle}</span>
                                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-boutique-rose transition-colors" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Dashboard 2-Column Section: Enquiries + Audit Log */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Customer WhatsApp Enquiries CRM */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-6 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                                Customer WhatsApp Enquiries
                            </h3>
                            <p className="text-xs text-neutral-500">
                                Inbound leads generated from product detail pages
                            </p>
                        </div>
                        <Link
                            href="/admin/enquiries"
                            className="text-xs text-boutique-rose hover:underline font-semibold flex items-center space-x-1"
                        >
                            <span>View All</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-mono border-b border-neutral-200">
                                <tr>
                                    <th className="py-3 px-4">Client</th>
                                    <th className="py-3 px-4">Interested Outfit</th>
                                    <th className="py-3 px-4">Phone / WhatsApp</th>
                                    <th className="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 font-sans">
                                {enquiries.slice(0, 5).map((enq) => (
                                    <tr key={enq.id} className="hover:bg-neutral-50/80 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-neutral-800">
                                            {enq.name}
                                        </td>
                                        <td className="py-3.5 px-4 text-neutral-600">
                                            {enq.productName}
                                        </td>
                                        <td className="py-3.5 px-4 text-neutral-600 font-mono">
                                            {enq.phone}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase font-mono ${enq.status === "New"
                                                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                                                        : enq.status === "Contacted"
                                                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                                                            : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                                    }`}
                                            >
                                                {enq.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right 1 Col: Recent Audit Log */}
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-5 shadow-2xs flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                                Activity Log
                            </h3>
                            <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-600 font-mono">
                                Realtime Sync
                            </span>
                        </div>

                        <div className="space-y-4">
                            {auditLogs.slice(0, 5).map((log) => (
                                <div key={log.id} className="flex items-start space-x-3 text-xs">
                                    <div className="w-7 h-7 rounded-full bg-boutique-rose/10 text-boutique-rose flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Clock className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-neutral-800 truncate">
                                            {log.action}
                                        </p>
                                        <p className="text-neutral-500 text-[11px] line-clamp-2">
                                            {log.details}
                                        </p>
                                        <p className="text-[9px] text-neutral-400 font-mono mt-0.5">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 text-center">
                        <p className="text-[11px] text-neutral-500 italic">
                            All database changes take effect immediately on public site.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
