"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Grid,
    BookOpen,
    Image as ImageIcon,
    Tag,
    MessageCircle,
    Search,
    Globe,
    Settings,
    ExternalLink,
    Bell,
    Menu,
    X,
    UserCheck,
    Sparkles,
} from "lucide-react";

const navigationItems = [
    {
        title: "OVERVIEW",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ],
    },
    {
        title: "CATALOG",
        items: [
            { name: "Products", href: "/admin/products", icon: ShoppingBag, badge: "Live" },
            { name: "Categories", href: "/admin/categories", icon: Grid },
            { name: "Her Chapters", href: "/admin/chapters", icon: BookOpen },
        ],
    },
    {
        title: "CONTENT & MARKETING",
        items: [
            { name: "Lookbook Gallery", href: "/admin/gallery", icon: ImageIcon },
            { name: "Offers & Discounts", href: "/admin/offers", icon: Tag },
            { name: "Customer Enquiries", href: "/admin/enquiries", icon: MessageCircle, badge: "New" },
            { name: "SEO & Metadata", href: "/admin/seo", icon: Globe },
        ],
    },
    {
        title: "STUDIO SETTINGS",
        items: [
            { name: "General Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-neutral-800 flex flex-col md:flex-row font-sans">
            {/* Mobile Header Topbar */}
            <div className="md:hidden bg-boutique-charcoal text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-boutique-gold/20">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <span className="font-serif-editorial text-lg font-bold text-boutique-blush tracking-wide">
                        STUDIO ADMIN
                    </span>
                </div>
                <Link
                    href="/"
                    target="_blank"
                    className="text-xs bg-boutique-rose/80 hover:bg-boutique-rose text-white px-3 py-1.5 rounded-full flex items-center space-x-1"
                >
                    <span>View Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-boutique-charcoal text-white flex flex-col justify-between transition-transform duration-300 border-r border-neutral-800/80 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div>
                    {/* Brand Header */}
                    <div className="p-6 border-b border-neutral-800">
                        <Link href="/" aria-label="Designs by Nisha Home">
                            <Image
                                src="/images/logo.png"
                                alt="Designs by Nisha Boutique Logo"
                                width={160}
                                height={70}
                                className="h-10 w-auto object-contain mb-2"
                                style={{ filter: "brightness(0) invert(1)", opacity: 0.95 }}
                            />
                        </Link>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] tracking-[0.2em] text-boutique-gold uppercase font-medium">
                                MANAGEMENT STUDIO
                            </span>
                            <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                                Single Truth API
                            </span>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="px-4 py-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                        {navigationItems.map((group, idx) => (
                            <div key={idx} className="space-y-1">
                                <h4 className="px-3 text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-mono">
                                    {group.title}
                                </h4>
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${isActive
                                                ? "bg-boutique-rose text-white shadow-sm font-semibold"
                                                : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon
                                                    className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-boutique-gold group-hover:text-white"
                                                        }`}
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                            {item.badge && (
                                                <span
                                                    className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold ${isActive
                                                        ? "bg-white/20 text-white"
                                                        : "bg-boutique-gold/20 text-boutique-gold"
                                                        }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 space-y-3">
                    <Link
                        href="/"
                        target="_blank"
                        className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-boutique-blush hover:text-white text-xs rounded-lg flex items-center justify-center space-x-2 transition-colors border border-boutique-gold/20"
                    >
                        <span>View Public Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center space-x-3 pt-1">
                        <div className="w-8 h-8 rounded-full bg-boutique-rose/30 text-boutique-blush flex items-center justify-center font-serif text-sm font-bold border border-boutique-rose/40">
                            N
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-medium text-white truncate">Nisha (Owner)</p>
                            <p className="text-[10px] text-neutral-400 truncate">Super Admin</p>
                        </div>
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                </div>
            </aside>

            {/* Mobile overlay backdrop */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col">
                {/* Top Desktop Navigation Bar */}
                <header className="hidden md:flex items-center justify-between bg-white px-8 py-4 border-b border-neutral-200 sticky top-0 z-30 shadow-2xs">
                    <div className="flex items-center space-x-3 w-96">
                        <div className="relative w-full">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search products, categories, enquiries..."
                                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-boutique-rose transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-xs text-neutral-500 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                            <span>Live Database Connected</span>
                        </div>

                        <button className="p-2 text-neutral-500 hover:text-boutique-rose hover:bg-neutral-100 rounded-lg relative transition-colors">
                            <Bell className="w-4 h-4" />
                            <span className="w-2 h-2 bg-boutique-rose rounded-full absolute top-1.5 right-1.5" />
                        </button>

                        <div className="h-4 w-px bg-neutral-200" />

                        <div className="flex items-center space-x-2 text-xs">
                            <span className="text-neutral-500">Boutique:</span>
                            <span className="font-semibold text-boutique-charcoal">New Delhi Studio</span>
                        </div>
                    </div>
                </header>

                {/* Page Content Viewport */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
            </main>
        </div>
    );
}
