"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    PlusCircle,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    Sparkles,
    Check,
    X,
    Tag,
    AlertTriangle,
    ArrowUpDown,
} from "lucide-react";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
    const [updatingId, setUpdatingId] = useState(null);

    // Fetch products and categories
    const loadData = () => {
        setLoading(true);
        Promise.all([
            fetch("/api/data/products").then((r) => r.json()),
            fetch("/api/data/categories").then((r) => r.json()),
        ])
            .then(([prodRes, catRes]) => {
                if (prodRes.success) setProducts(prodRes.data);
                if (catRes.success) setCategories(catRes.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load catalog:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    // Toggle featured status
    const toggleFeatured = async (product) => {
        setUpdatingId(product.id);
        try {
            const res = await fetch(`/api/data/products/${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: !product.featured }),
            });
            const json = await res.json();
            if (json.success) {
                setProducts((prev) =>
                    prev.map((p) => (p.id === product.id ? { ...p, featured: !product.featured } : p))
                );
            }
        } catch (err) {
            console.error("Failed to toggle featured status:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Toggle publish status (Published vs Draft)
    const toggleStatus = async (product) => {
        setUpdatingId(product.id);
        const newStatus = product.status === "published" ? "draft" : "published";
        try {
            const res = await fetch(`/api/data/products/${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const json = await res.json();
            if (json.success) {
                setProducts((prev) =>
                    prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
                );
            }
        } catch (err) {
            console.error("Failed to toggle status:", err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete product action
    const confirmDelete = async () => {
        if (!deleteModal.product) return;
        const id = deleteModal.product.id;
        try {
            const res = await fetch(`/api/data/products/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                setProducts((prev) => prev.filter((p) => p.id !== id));
                setDeleteModal({ open: false, product: null });
            }
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    // Filter logic
    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.slug.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || p.category === selectedCategory || p.categorySlug === selectedCategory;
        const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Product Catalog
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Manage products, update prices, upload images, and control website visibility
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm w-fit"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add New Product</span>
                </Link>
            </div>

            {/* Controls Bar: Search & Filters */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product name or slug..."
                        className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center space-x-2 text-xs text-neutral-500">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Category:</span>
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-boutique-rose"
                    >
                        <option value="all">All Categories ({products.length})</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-boutique-rose"
                    >
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-2xs">
                {loading ? (
                    <div className="p-12 text-center text-xs text-neutral-400 space-y-3">
                        <div className="w-6 h-6 border-2 border-boutique-rose border-t-transparent rounded-full animate-spin mx-auto" />
                        <p>Loading boutique catalog...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                        <Tag className="w-8 h-8 text-neutral-300 mx-auto" />
                        <h3 className="font-serif-editorial text-lg text-neutral-700 font-semibold">
                            No products found
                        </h3>
                        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                            Try broadening your search term or select another category filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-mono border-b border-neutral-200">
                                <tr>
                                    <th className="py-3.5 px-4">Item Image</th>
                                    <th className="py-3.5 px-4">Product Name</th>
                                    <th className="py-3.5 px-4">Category</th>
                                    <th className="py-3.5 px-4">Selling Price</th>
                                    <th className="py-3.5 px-4">Discount</th>
                                    <th className="py-3.5 px-4">Featured</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 font-sans">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-neutral-50/80 transition-colors">
                                        {/* Image */}
                                        <td className="py-3 px-4">
                                            <div className="w-12 h-14 bg-neutral-100 rounded-lg overflow-hidden relative border border-neutral-200">
                                                <Image
                                                    src={product.image || product.images?.[0] || "/images/hero-bridal.png"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>

                                        {/* Product info */}
                                        <td className="py-3 px-4 max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <p className="font-semibold text-neutral-800 line-clamp-1">
                                                    {product.name}
                                                </p>
                                                {product.newArrival && (
                                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase border border-amber-300">
                                                        New
                                                    </span>
                                                )}
                                                {product.instagramReel && (
                                                    <span className="text-pink-600 font-mono text-[10px] font-semibold" title="Instagram Reel attached">
                                                        Reel
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-neutral-400 font-mono">
                                                /{product.slug}
                                            </p>
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 px-4 text-neutral-600 font-medium">
                                            {product.categoryName || product.category}
                                        </td>

                                        {/* Selling price */}
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-boutique-rose">
                                                ₹{Number(product.price).toLocaleString('en-IN')}
                                            </span>
                                            {product.originalPrice > product.price && (
                                                <span className="text-[10px] text-neutral-400 line-through block">
                                                    ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </td>

                                        {/* Discount */}
                                        <td className="py-3 px-4">
                                            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-mono font-semibold">
                                                {product.discount || "Standard"}
                                            </span>
                                        </td>

                                        {/* Featured Toggle */}
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => toggleFeatured(product)}
                                                disabled={updatingId === product.id}
                                                className={`p-1.5 rounded-lg border transition-all ${product.featured
                                                    ? "bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-100"
                                                    : "bg-neutral-50 text-neutral-400 border-neutral-200 hover:text-neutral-600"
                                                    }`}
                                                title="Toggle Homepage Featured Grid"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </button>
                                        </td>

                                        {/* Status Badge Toggle */}
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => toggleStatus(product)}
                                                disabled={updatingId === product.id}
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium uppercase border transition-all ${product.status === "published" || !product.status
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                                    : "bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200"
                                                    }`}
                                            >
                                                {product.status || "published"}
                                            </button>
                                        </td>

                                        {/* Action buttons */}
                                        <td className="py-3 px-4 text-right space-x-1">
                                            <Link
                                                href={`/product/${product.slug}`}
                                                target="_blank"
                                                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg inline-block transition-colors"
                                                title="View on Public Site"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>

                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-1.5 text-neutral-400 hover:text-boutique-rose hover:bg-neutral-100 rounded-lg inline-block transition-colors"
                                                title="Edit Product"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </Link>

                                            <button
                                                onClick={() => setDeleteModal({ open: true, product })}
                                                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Protection Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
                        <div className="flex items-center space-x-3 text-rose-600">
                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                                    Archive Product?
                                </h3>
                                <p className="text-xs text-neutral-500">
                                    Confirm product removal from catalog
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-neutral-600 leading-relaxed">
                            Are you sure you want to remove <strong>"{deleteModal.product?.name}"</strong>? It will immediately stop appearing on the public customer website.
                        </p>

                        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-100">
                            <button
                                onClick={() => setDeleteModal({ open: false, product: null })}
                                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
