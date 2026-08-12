"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Grid, BookOpen, Edit3, Save, Plus, Check, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatForm, setEditCatForm] = useState({});

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
            }
        } catch (err) {
            console.error("Failed to update category:", err);
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
                    <span className="text-xs text-neutral-400 font-mono">
                        {categories.length} Categories Configured
                    </span>
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
                                            <button
                                                onClick={() => startEditingCategory(cat)}
                                                className="px-3 py-1 bg-white border border-neutral-300 hover:border-boutique-rose text-neutral-700 hover:text-boutique-rose text-xs rounded-lg font-medium flex items-center space-x-1 transition-colors"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Edit Category</span>
                                            </button>
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
        </div>
    );
}
