"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    LogOut,
    LayoutDashboard,
    ShoppingBag,
    Grid,
    BookOpen,
    Image as ImageIcon,
    Tag,
    MessageCircle,
    Search,
    Settings,
    ExternalLink,
    Bell,
    Menu,
    X,
    UserCheck,
    BarChart3,
    FileText,
    Shield,
} from "lucide-react";

const navigationItems = [
    {
        title: "OVERVIEW",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { name: "Analytics Studio", href: "/admin/analytics", icon: BarChart3 },
        ],
    },
    {
        title: "CATALOG MANAGEMENT",
        items: [
            { name: "Products", href: "/admin/products", icon: ShoppingBag },
            { name: "Categories", href: "/admin/categories", icon: Grid },
        ],
    },
    {
        title: "CONTENT & MARKETING",
        items: [
            { name: "Content & Testimonials", href: "/admin/content", icon: FileText },
            { name: "Lookbook Gallery", href: "/admin/gallery", icon: ImageIcon },
            { name: "Offers & Discounts", href: "/admin/offers", icon: Tag },
            { name: "Customer Enquiries", href: "/admin/enquiries", icon: MessageCircle },
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
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const logout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
        } catch {
            // ignore
        }
        router.replace("/admin/login");
        router.refresh();
    };

    // The login page renders without the admin dashboard chrome.
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

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
                    <span className="font-serif-editorial text-lg font-bold text-boutique-blush tracking-wide flex items-center space-x-1.5">
                        <Shield className="w-4 h-4 text-boutique-gold" />
                        <span>ADMIN PORTAL</span>
                    </span>
                </div>
                <Link
                    href="/"
                    target="_blank"
                    className="text-xs bg-boutique-rose/80 hover:bg-boutique-rose text-white px-3 py-1 rounded-full flex items-center space-x-1"
                >
                    <span>View Site</span>
                    <ExternalLink className="w-3 h-3" />
                </Link>
            </div>

            {/* Sidebar Navigation */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-boutique-charcoal text-white flex flex-col justify-between transition-transform duration-300 border-r border-neutral-800/80 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                {/* Header Section */}
                <div className="shrink-0 px-5 py-4 border-b border-neutral-800 bg-neutral-950/40">
                    <Link href="/admin" aria-label="Designs by Nisha Admin Dashboard" className="block">
                        <Image
                            src="/images/logo-transparent.png?v=logo2"
                            alt="Designs by Nisha Boutique Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto object-contain"
                            style={{ filter: "brightness(0) invert(1)", opacity: 0.95 }}
                        />
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1.5 bg-boutique-rose/20 text-boutique-blush text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-boutique-rose/30 uppercase tracking-widest">
                            <Shield className="w-3 h-3 text-boutique-gold" />
                            <span>ADMIN PORTAL</span>
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">v2.4</span>
                    </div>
                </div>

                {/* Nav Items — flex-1 min-h-0 overflow-y-auto ensures the bottom section is ALWAYS visible and never cut off */}
                <nav className="flex-1 min-h-0 px-4 py-4 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800">
                    {navigationItems.map((group, idx) => (
                        <div key={idx} className="space-y-1">
                            <h4 className="px-3 text-[10px] font-semibold text-neutral-400 tracking-wider uppercase font-mono">
                                {group.title}
                            </h4>
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/admin" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${isActive
                                                ? "bg-boutique-rose text-white shadow-sm font-semibold"
                                                : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon
                                                className={`w-4 h-4 transition-colors ${isActive
                                                        ? "text-white"
                                                        : "text-boutique-gold group-hover:text-white"
                                                    }`}
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer — Fixed shrink-0 at bottom, always fully visible */}
                <div className="shrink-0 p-4 border-t border-neutral-800 bg-neutral-900/95 space-y-3">
                    <Link
                        href="/"
                        target="_blank"
                        className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-boutique-blush hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors border border-boutique-gold/30 shadow-xs"
                    >
                        <span>View Public Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center space-x-3 pt-1 border-t border-neutral-800/80">
                        <div className="w-8 h-8 rounded-full bg-boutique-rose text-white flex items-center justify-center font-serif text-xs font-bold border border-boutique-blush/40 shadow-sm shrink-0">
                            N
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">Nisha (Owner)</p>
                            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>ADMIN LOGGED IN</span>
                            </div>
                        </div>
                        <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>

                    <button
                        onClick={logout}
                        className="w-full py-2.5 px-3 bg-boutique-rose/90 hover:bg-boutique-rose text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                    </button>
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
                    <div className="flex items-center space-x-4">
                        <span className="bg-boutique-rose/10 text-boutique-rose text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-boutique-rose/20">
                            ADMIN PORTAL
                        </span>
                        <div className="relative w-80">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search products, categories, enquiries..."
                                className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-boutique-rose transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setNotificationsOpen((open) => !open)}
                                className="p-2 text-neutral-500 hover:text-boutique-rose hover:bg-neutral-100 rounded-lg relative transition-colors"
                                aria-label="Open notifications"
                                aria-expanded={notificationsOpen}
                            >
                                <Bell className="w-4 h-4" />
                                <span className="w-2 h-2 bg-boutique-rose rounded-full absolute top-1.5 right-1.5" />
                            </button>

                            {notificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-neutral-200 bg-white shadow-xl z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-neutral-100 bg-boutique-bg">
                                        <p className="text-xs font-bold text-boutique-charcoal uppercase tracking-wider">
                                            Admin Studio Alerts
                                        </p>
                                        <p className="text-[11px] text-neutral-500 mt-0.5">
                                            Live database updates
                                        </p>
                                    </div>
                                    <div className="divide-y divide-neutral-100 text-xs">
                                        <Link
                                            href="/admin/enquiries"
                                            className="block px-4 py-3 hover:bg-neutral-50 transition-colors"
                                        >
                                            <p className="font-semibold text-boutique-charcoal">
                                                Customer Enquiries
                                            </p>
                                            <p className="text-[11px] text-neutral-500 mt-0.5">
                                                Track leads &amp; WhatsApp inquiries.
                                            </p>
                                        </Link>
                                        <Link
                                            href="/admin/products"
                                            className="block px-4 py-3 hover:bg-neutral-50 transition-colors"
                                        >
                                            <p className="font-semibold text-boutique-charcoal">
                                                Product Catalogue
                                            </p>
                                            <p className="text-[11px] text-neutral-500 mt-0.5">
                                                Published outfits sync live to the user site.
                                            </p>
                                        </Link>
                                        <Link
                                            href="/admin/settings"
                                            className="block px-4 py-3 hover:bg-neutral-50 transition-colors"
                                        >
                                            <p className="font-semibold text-boutique-charcoal">
                                                Studio Settings &amp; Banner
                                            </p>
                                            <p className="text-[11px] text-neutral-500 mt-0.5">
                                                Manage announcement banner and Chattarpur studio details.
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-4 w-px bg-neutral-200" />

                        <div className="flex items-center space-x-2 text-xs">
                            <span className="text-neutral-400">Atelier:</span>
                            <span className="font-semibold text-boutique-charcoal">
                                Chattarpur, New Delhi
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content Viewport */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
            </main>
        </div>
    );
}
