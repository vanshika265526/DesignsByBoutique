"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Grid, BookOpen, Edit3, Save, Plus, Trash2, X } from "lucide-react";

const slugify = (s) =>
    (s || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const emptyCat = {
    name: "",
    slug: "",
    description: "",
    image: "https://images.pexels.com/photos/1322993/pexels-photo-1322993.jpeg?auto=compress&cs=tinysrgb&w=1200",
    chapter: "",
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatForm, setEditCatForm] = useState({});

    // Create-category modal state
    const [newModal, setNewModal] = useState(false);
    const [newCat, setNewCat] = useState(emptyCat);
    const [slugTouched, setSlugTouched] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const loadData = () => {
        setLoading(true);
        Promise.all([
            fetch("/api/data/categories").then((r) => r.json()),
            fetch("/api/data/chapters").then((r) => r.json()),
        ]).then(([catRes, chapRes]) => {
            if (catRes.success) setCategories(catRes.data);
            if (chapRes.success) setChapters(chapRes.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    // ---- Edit existing ----
    const startEditingCategory = (cat) => {
        setEditingCatId(cat.id);
        setEditCatForm({ ...cat });
    };

    const saveCategory = async () => {
        try {
            const res = await fetch(`/api/data/categories/${editingCatId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editCatForm),
            });
            const json = await res.json();
            if (json.success) {
                setCategories((prev) => prev.map((c) => (c.id === editingCatId ? json.data : c)));
                setEditingCatId(null);
            } else {
                alert(json.error || "Failed to update category");
            }
        } catch (err) {
            console.error("Failed to update category:", err);
            alert("Failed to update category");
        }
    };

    // ---- Create new ----
    const openNew = () => {
        setNewCat(emptyCat);
        setSlugTouched(false);
        setError("");
        setNewModal(true);
    };

    const handleNameChange = (val) => {
        setNewCat((prev) => ({
            ...prev,
            name: val,
            slug: slugTouched ? prev.slug : slugify(val),
        }));
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        try {
            const res = await fetch("/api/data/upload", { method: "POST", body: data });
            const json = await res.json();
            if (json.success && json.url) setNewCat((prev) => ({ ...prev, image: json.url }));
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    const createCategory = async () => {
        setError("");
        if (!newCat.name.trim()) {
            setError("Category name is required.");
            return;
        }
        const slug = newCat.slug ? slugify(newCat.slug) : slugify(newCat.name);
        if (categories.some((c) => c.slug === slug)) {
            setError(`A category with slug "${slug}" already exists.`);
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/data/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newCat, slug }),
            });
            const json = await res.json();
            if (json.success) {
                setCategories((prev) => [...prev, json.data]);
                setNewModal(false);
            } else {
                setError(json.error || "Failed to create category.");
            }
        } catch (err) {
            console.error("Failed to create category:", err);
            setError("Failed to create category.");
        } finally {
            setSaving(false);
        }
    };

    // ---- Delete ----
    const deleteCategory = async (cat) => {
        if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`/api/data/categories/${cat.id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                setCategories((prev) => prev.filter((c) => c.id !== cat.id));
            } else {
                alert(json.error || "Failed to delete category");
            }
        } catch (err) {
            console.error("Failed to delete category:", err);
            alert("Failed to delete category");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                    Categories & Her Story Chapters
                </h1>
                <p className="text-xs text-neutral-500 mt-1">
                    Manage boutique product collections and the 5 life chapter narratives displayed across the customer website
                </p>
            </div>

            {/* Categories Section */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                    <div className="flex items-center space-x-2">
                        <Grid className="w-5 h-5 text-boutique-rose" />
                        <h2 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                            Product Collection Categories
                        </h2>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                            {categories.length} Categories
                        </span>
                        <button
                            onClick={openNew}
                            className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Category</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-xs text-neutral-400">Loading categories...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categories.map((cat) => {
                            const isEditing = editingCatId === cat.id;
                            return (
                                <div
                                    key={cat.id}
                                    className="border border-neutral-200 rounded-2xl p-5 bg-[#FAF7F2] space-y-4 relative flex flex-col justify-between"
                                >
                                    <div className="flex space-x-4">
                                        <div className="w-20 h-24 bg-neutral-200 rounded-xl overflow-hidden relative flex-shrink-0 border border-neutral-300">
                                            <Image
                                                src={isEditing ? editCatForm.image : cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        value={editCatForm.name}
                                                        onChange={(e) => setEditCatForm({ ...editCatForm, name: e.target.value })}
                                                        className="w-full text-xs font-semibold px-2 py-1 bg-white border border-neutral-300 rounded"
                                                    />
                                                    <textarea
                                                        rows={2}
                                                        value={editCatForm.description}
                                                        onChange={(e) => setEditCatForm({ ...editCatForm, description: e.target.value })}
                                                        className="w-full text-[11px] px-2 py-1 bg-white border border-neutral-300 rounded"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editCatForm.image}
                                                        onChange={(e) => setEditCatForm({ ...editCatForm, image: e.target.value })}
                                                        placeholder="Image URL..."
                                                        className="w-full text-[10px] font-mono px-2 py-1 bg-white border border-neutral-300 rounded"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3 className="font-serif-editorial text-lg font-bold text-boutique-charcoal">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                                                        {cat.description}
                                                    </p>
                                                    <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono text-neutral-400">
                                                        <span>Slug: /{cat.slug}</span>
                                                        <span>•</span>
                                                        <span>{cat.count || 0} Outfits</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-end space-x-2">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => setEditingCatId(null)}
                                                    className="px-3 py-1 bg-neutral-200 text-neutral-700 text-xs rounded-lg font-medium"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={saveCategory}
                                                    className="px-3 py-1 bg-boutique-rose text-white text-xs rounded-lg font-semibold flex items-center space-x-1"
                                                >
                                                    <Save className="w-3.5 h-3.5" />
                                                    <span>Save Changes</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => deleteCategory(cat)}
                                                    className="px-3 py-1 bg-white border border-neutral-300 hover:border-rose-500 text-neutral-600 hover:text-rose-600 text-xs rounded-lg font-medium flex items-center space-x-1 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Delete</span>
                                                </button>
                                                <button
                                                    onClick={() => startEditingCategory(cat)}
                                                    className="px-3 py-1 bg-white border border-neutral-300 hover:border-boutique-rose text-neutral-700 hover:text-boutique-rose text-xs rounded-lg font-medium flex items-center space-x-1 transition-colors"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit Category</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Chapters Section */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-6 shadow-2xs">
                <div className="flex items-center space-x-2 border-b border-neutral-100 pb-4">
                    <BookOpen className="w-5 h-5 text-boutique-gold" />
                    <h2 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                        "For Every Chapter of Her Story" Life Stages
                    </h2>
                </div>

                <div className="space-y-4">
                    {chapters.map((ch) => (
                        <div
                            key={ch.id}
                            className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200"
                        >
                            <div className="flex items-center space-x-4">
                                <span className="font-serif text-xl font-bold text-boutique-rose font-mono">
                                    {ch.number}
                                </span>
                                <div>
                                    <h4 className="font-serif-editorial text-base font-bold text-boutique-charcoal">
                                        {ch.title} — <span className="font-normal text-xs text-neutral-500">{ch.subtitle}</span>
                                    </h4>
                                    <p className="text-xs text-neutral-600 font-light mt-0.5">
                                        {ch.description}
                                    </p>
                                </div>
                            </div>

                            <span className="text-[10px] bg-boutique-rose/10 text-boutique-rose px-2.5 py-1 rounded-full font-mono font-semibold">
                                {ch.categoryName || ch.categorySlug}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Category Modal */}
            {newModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                                Add New Category
                            </h3>
                            <button onClick={() => setNewModal(false)} className="text-neutral-400 hover:text-neutral-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={newCat.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="e.g. Party Wear Gowns"
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">
                                    URL Slug <span className="text-neutral-400 font-normal">(used in /collections/…)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newCat.slug}
                                    onChange={(e) => {
                                        setSlugTouched(true);
                                        setNewCat({ ...newCat, slug: e.target.value });
                                    }}
                                    placeholder="party-wear-gowns"
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono lowercase"
                                />
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    value={newCat.description}
                                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                                    placeholder="Short description shown on the collection page"
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                />
                            </div>

                            {chapters.length > 0 && (
                                <div>
                                    <label className="block text-neutral-700 font-medium mb-1">Life Chapter (optional)</label>
                                    <select
                                        value={newCat.chapter}
                                        onChange={(e) => setNewCat({ ...newCat, chapter: e.target.value })}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                    >
                                        <option value="">— None —</option>
                                        {chapters.map((ch) => (
                                            <option key={ch.id} value={ch.slug || ch.categorySlug || ch.id}>
                                                {ch.number} — {ch.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Cover Image (URL or upload)</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newCat.image}
                                        onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] font-mono"
                                    />
                                    <label className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-xl cursor-pointer hover:bg-neutral-300 font-semibold whitespace-nowrap">
                                        {uploading ? "…" : "Upload"}
                                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                    </label>
                                </div>
                                {newCat.image && (
                                    <div className="mt-2 w-16 h-20 rounded-lg overflow-hidden relative border border-neutral-200">
                                        <Image src={newCat.image} alt="preview" fill className="object-cover" />
                                    </div>
                                )}
                            </div>

                            {error && <p className="text-rose-600 font-medium">{error}</p>}
                        </div>

                        <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-100">
                            <button
                                onClick={() => setNewModal(false)}
                                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createCategory}
                                disabled={saving}
                                className="px-4 py-2 bg-boutique-rose text-white rounded-xl text-xs font-semibold flex items-center space-x-1 disabled:opacity-60"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{saving ? "Creating…" : "Create Category"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
