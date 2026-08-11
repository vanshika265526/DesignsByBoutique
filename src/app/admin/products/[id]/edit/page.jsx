"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Upload,
    Plus,
    X,
    Eye,
    Sparkles,
    MessageCircle,
} from "lucide-react";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [categories, setCategories] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewModal, setPreviewModal] = useState(false);

    // Product Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "suits-anarkalis",
        categoryName: "Suits & Anarkalis",
        chapter: "her-beginnings",
        chapterName: "Her Beginnings",
        price: "",
        originalPrice: "",
        discount: "",
        description: "",
        shortDescription: "",
        image: "/images/hero-bridal.png",
        images: [],
        instagramReel: "",
        newArrival: false,
        featured: false,
        status: "published",
        details: [],
    });

    const [detailInput, setDetailInput] = useState("");

    // Load Product Data & Categories/Chapters
    useEffect(() => {
        Promise.all([
            fetch(`/api/data/products/${productId}`).then((r) => r.json()),
            fetch("/api/data/categories").then((r) => r.json()),
            fetch("/api/data/chapters").then((r) => r.json()),
        ])
            .then(([prodRes, catRes, chapRes]) => {
                if (prodRes.success && prodRes.data) {
                    const p = prodRes.data;
                    setFormData({
                        name: p.name || "",
                        slug: p.slug || "",
                        category: p.category || p.categorySlug || "suits-anarkalis",
                        categoryName: p.categoryName || "Suits & Anarkalis",
                        chapter: p.chapter || "her-beginnings",
                        chapterName: p.chapterName || "Her Beginnings",
                        price: p.price || "",
                        originalPrice: p.originalPrice || p.price || "",
                        discount: p.discount || "",
                        description: p.description || "",
                        shortDescription: p.shortDescription || "",
                        image: p.image || p.images?.[0] || "/images/hero-bridal.png",
                        images: p.images || [p.image || "/images/hero-bridal.png"],
                        instagramReel: p.instagramReel || "",
                        newArrival: p.newArrival || false,
                        featured: p.featured || false,
                        status: p.status || "published",
                        details: p.details || [],
                    });
                }
                if (catRes.success) setCategories(catRes.data);
                if (chapRes.success) setChapters(chapRes.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load product for editing:", err);
                setLoading(false);
            });
    }, [productId]);

    // Handle Name change -> Auto generate Slug
    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        setFormData((prev) => ({ ...prev, name, slug }));
    };

    // Calculate discount percentage automatically
    const handlePriceChange = (field, val) => {
        const updated = { ...formData, [field]: val };
        const p = Number(field === "price" ? val : updated.price);
        const op = Number(field === "originalPrice" ? val : updated.originalPrice);

        if (op > p && p > 0) {
            const discPercent = Math.round((1 - p / op) * 100);
            updated.discount = `${discPercent}% OFF`;
        } else {
            updated.discount = "Standard Price";
        }
        setFormData(updated);
    };

    // Handle Category change
    const handleCategoryChange = (e) => {
        const catSlug = e.target.value;
        const catObj = categories.find((c) => c.slug === catSlug);
        const matchedChap = chapters.find((ch) => ch.categorySlug === catSlug || ch.id === catObj?.chapter);

        setFormData((prev) => ({
            ...prev,
            category: catSlug,
            categoryName: catObj ? catObj.name : catSlug,
            chapter: matchedChap ? matchedChap.id : prev.chapter,
            chapterName: matchedChap ? matchedChap.title : prev.chapterName,
        }));
    };

    // Upload image file
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/api/data/upload", {
                method: "POST",
                body: uploadData,
            });
            const json = await res.json();
            if (json.success && json.url) {
                setFormData((prev) => {
                    const newImages = [...prev.images, json.url];
                    return {
                        ...prev,
                        images: newImages,
                        image: prev.image ? prev.image : json.url,
                    };
                });
            }
        } catch (err) {
            console.error("Image upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    // Add Detail specification item
    const addDetailItem = () => {
        if (!detailInput.trim()) return;
        setFormData((prev) => ({
            ...prev,
            details: [...prev.details, detailInput.trim()],
        }));
        setDetailInput("");
    };

    // Remove Detail item
    const removeDetailItem = (idx) => {
        setFormData((prev) => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== idx),
        }));
    };

    // Save Changes via PATCH
    const handleSubmit = async (targetStatus) => {
        if (!formData.name || !formData.price) {
            alert("Please provide at least Product Name and Selling Price.");
            return;
        }

        setSaving(true);
        const payload = {
            ...formData,
            status: targetStatus || formData.status,
            price: Number(formData.price),
            originalPrice: Number(formData.originalPrice) || Number(formData.price),
        };

        try {
            const res = await fetch(`/api/data/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (json.success) {
                router.push("/admin/products");
            } else {
                alert(`Error saving product: ${json.error}`);
            }
        } catch (err) {
            console.error("Save product error:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 text-center text-xs text-neutral-400 space-y-3">
                <div className="w-6 h-6 border-2 border-boutique-rose border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading outfit details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header Top Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Link
                        href="/admin/products"
                        className="p-2 bg-white rounded-xl border border-neutral-200 text-neutral-600 hover:text-boutique-rose transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="font-serif-editorial text-2xl font-bold text-boutique-charcoal">
                            Edit Boutique Outfit
                        </h1>
                        <p className="text-xs text-neutral-500">
                            Updating ID: <span className="font-mono text-boutique-rose">{productId}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setPreviewModal(true)}
                        className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
                    >
                        <Eye className="w-4 h-4 text-neutral-500" />
                        <span>Preview Product</span>
                    </button>

                    <button
                        onClick={() => handleSubmit("draft")}
                        disabled={saving}
                        className="bg-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                    >
                        Save Draft
                    </button>

                    <button
                        onClick={() => handleSubmit("published")}
                        disabled={saving}
                        className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
                    >
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        <span>Update & Publish</span>
                    </button>
                </div>
            </div>

            {/* Form Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-2xs">
                        <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                            1. Basic Information
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    URL Slug
                                </label>
                                <div className="flex items-center">
                                    <span className="bg-neutral-100 border border-r-0 border-neutral-200 px-3 py-2.5 text-xs text-neutral-400 rounded-l-xl font-mono">
                                        /product/
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-r-xl text-xs font-mono focus:outline-none focus:border-boutique-rose"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Short Tagline / Summary
                                </label>
                                <input
                                    type="text"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Full Editorial Description
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Instagram Reel Link (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.instagramReel}
                                    onChange={(e) => setFormData({ ...formData, instagramReel: e.target.value })}
                                    placeholder="https://www.instagram.com/reel/C..."
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-boutique-rose"
                                />
                                <p className="text-[10px] text-neutral-400 mt-1">
                                    Include a video reel link to showcase high-definition video of the outfit on public detail pages.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-2xs">
                        <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                            2. Pricing & Automatic Discount
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Original MRP (₹)
                                </label>
                                <input
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={(e) => handlePriceChange("originalPrice", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-boutique-rose"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Selling Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => handlePriceChange("price", e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-boutique-rose focus:outline-none focus:border-boutique-rose"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Calculated Tag
                                </label>
                                <input
                                    type="text"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono font-semibold text-rose-700 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Gallery */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                            <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal">
                                3. Product Media Gallery
                            </h3>
                            <label className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer flex items-center space-x-1.5 transition-colors">
                                <Upload className="w-3.5 h-3.5 text-boutique-rose" />
                                <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {formData.images.map((imgUrl, idx) => (
                                <div
                                    key={idx}
                                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border ${formData.image === imgUrl ? "border-2 border-boutique-rose ring-2 ring-boutique-rose/20" : "border-neutral-200"
                                        } group`}
                                >
                                    <Image src={imgUrl} alt="Product media" fill className="object-cover" />

                                    <button
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                images: prev.images.filter((_, i) => i !== idx),
                                                image: prev.image === imgUrl ? prev.images[0] || "" : prev.image,
                                            }))
                                        }
                                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>

                                    {formData.image === imgUrl ? (
                                        <span className="absolute bottom-1 left-1 bg-boutique-rose text-white text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold">
                                            Cover
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => setFormData({ ...formData, image: imgUrl })}
                                            className="absolute bottom-1 left-1 bg-black/60 hover:bg-boutique-rose text-white text-[9px] font-mono px-1.5 py-0.5 rounded uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Set Cover
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right 1 Col */}
                <div className="space-y-6">
                    {/* Categorization */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-2xs">
                        <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                            Categorization
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Collection Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1 font-mono">
                                    Her Story Chapter
                                </label>
                                <select
                                    value={formData.chapter}
                                    onChange={(e) => {
                                        const chObj = chapters.find((c) => c.id === e.target.value);
                                        setFormData({
                                            ...formData,
                                            chapter: e.target.value,
                                            chapterName: chObj ? chObj.title : e.target.value,
                                        });
                                    }}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose"
                                >
                                    {chapters.map((ch) => (
                                        <option key={ch.id} value={ch.id}>
                                            {ch.number}. {ch.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Status & Featured */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-2xs">
                        <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                            Publishing Settings
                        </h3>

                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-800">New Arrival Badge</p>
                                    <p className="text-[10px] text-neutral-500">Show 'New Arrival' tag in collection catalog</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.newArrival}
                                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                                    className="w-4 h-4 text-boutique-rose rounded focus:ring-boutique-rose"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
                                <div>
                                    <p className="text-xs font-semibold text-neutral-800">Featured Outfit</p>
                                    <p className="text-[10px] text-neutral-500">Show in homepage showcase grid</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 text-boutique-rose rounded focus:ring-boutique-rose"
                                />
                            </label>

                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider font-mono">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-boutique-rose font-mono"
                                >
                                    <option value="published">Published (Visible on site)</option>
                                    <option value="draft">Draft (Admin only)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Details Specification */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-2xs">
                        <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal border-b border-neutral-100 pb-3">
                            Fabric & Craftsmanship Details
                        </h3>

                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={detailInput}
                                onChange={(e) => setDetailInput(e.target.value)}
                                placeholder="Add detail point..."
                                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={addDetailItem}
                                className="p-2 bg-boutique-rose text-white rounded-xl text-xs hover:bg-boutique-rose-dark transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <ul className="space-y-2">
                            {formData.details.map((d, i) => (
                                <li key={i} className="flex items-center justify-between text-xs text-neutral-700 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                                    <span>• {d}</span>
                                    <button onClick={() => removeDetailItem(i)} className="text-neutral-400 hover:text-rose-600">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Live Product Preview Modal */}
            {previewModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
                        <button
                            onClick={() => setPreviewModal(false)}
                            className="absolute top-4 right-4 p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="border-b border-neutral-100 pb-3">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-boutique-gold font-bold">
                                Live Customer Website Preview
                            </span>
                            <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                                {formData.name || "Untitled Product"}
                            </h3>
                        </div>

                        <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-[#FAF7F2] p-4 space-y-4">
                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-neutral-100">
                                <Image
                                    src={formData.image || "/images/hero-bridal.png"}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                {formData.discount && (
                                    <span className="absolute top-3 left-3 bg-boutique-rose text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                                        {formData.discount}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] text-boutique-gold uppercase font-mono tracking-wider font-semibold">
                                    {formData.categoryName} • {formData.chapterName}
                                </span>
                                <h4 className="font-serif-editorial text-lg font-bold text-boutique-charcoal">
                                    {formData.name || "Product Title"}
                                </h4>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-base font-bold text-boutique-rose font-serif">
                                        ₹{Number(formData.price || 0).toLocaleString("en-IN")}
                                    </span>
                                    {formData.originalPrice > formData.price && (
                                        <span className="text-xs text-neutral-400 line-through">
                                            ₹{Number(formData.originalPrice).toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-600 line-clamp-2">
                                    {formData.shortDescription || formData.description}
                                </p>
                            </div>

                            <div className="pt-2">
                                <div className="w-full bg-emerald-600 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center space-x-2">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Enquire via WhatsApp</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setPreviewModal(false)}
                            className="w-full py-2.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
