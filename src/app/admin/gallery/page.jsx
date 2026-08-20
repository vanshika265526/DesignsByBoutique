"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Trash2, Upload, Sparkles, MapPin, Tag } from "lucide-react";

export default function AdminGalleryPage() {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newModal, setNewModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [newItem, setNewItem] = useState({
        title: "",
        category: "Bridal",
        image: "",
        aspectRatio: "aspect-[3/4]",
        location: "Studio New Delhi",
    });

    const loadGallery = () => {
        setLoading(true);
        fetch("/api/data/gallery")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setGallery(json.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadGallery();
    }, []);

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/data/upload", { method: "POST", body: data });
            const json = await res.json();
            if (json.success && json.url) {
                setNewItem((prev) => ({ ...prev, image: json.url }));
            }
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    const addGalleryItem = async () => {
        if (!newItem.title) return;
        try {
            const res = await fetch("/api/data/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            const json = await res.json();
            if (json.success) {
                setGallery((prev) => [json.data, ...prev]);
                setNewModal(false);
                setNewItem({
                    title: "",
                    category: "Bridal",
                    image: "",
                    aspectRatio: "aspect-[3/4]",
                    location: "Studio New Delhi",
                });
            }
        } catch (err) {
            console.error("Error adding gallery photo:", err);
        }
    };

    const deleteGalleryItem = async (id) => {
        try {
            const res = await fetch(`/api/data/gallery?id=${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                setGallery((prev) => prev.filter((g) => g.id !== id));
            }
        } catch (err) {
            console.error("Error deleting photo:", err);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Editorial Lookbook Gallery
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Manage high-resolution photography featured on the public website lookbook page (`/gallery`)
                    </p>
                </div>

                <button
                    onClick={() => setNewModal(true)}
                    className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm w-fit"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Lookbook Photo</span>
                </button>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                {loading ? (
                    <div className="p-8 text-center text-xs text-neutral-400">Loading lookbook photos...</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {gallery.map((item) => (
                            <div
                                key={item.id}
                                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200"
                            >
                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 p-3 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-boutique-rose text-white text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold">
                                            {item.category}
                                        </span>
                                        <button
                                            onClick={() => deleteGalleryItem(item.id)}
                                            className="p-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div>
                                        <h4 className="font-serif-editorial text-xs font-bold text-white line-clamp-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-[10px] text-neutral-300 flex items-center space-x-1 mt-0.5">
                                            <MapPin className="w-2.5 h-2.5 text-boutique-gold" />
                                            <span>{item.location}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Lookbook Photo Modal */}
            {newModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                            Add Editorial Photo
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Title / Caption</label>
                                <input
                                    type="text"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    placeholder="e.g. Royal Mughal Velvet Bride"
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Category</label>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                >
                                    <option value="Bridal">Bridal</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Maternity">Maternity</option>
                                    <option value="Baby">Baby</option>
                                    <option value="Boutique">Boutique</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Location / Tag</label>
                                <input
                                    type="text"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Photo Upload / URL</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newItem.image}
                                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] font-mono"
                                    />
                                    <label className="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-xl cursor-pointer hover:bg-neutral-300 font-semibold">
                                        Upload
                                        <input type="file" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-100">
                            <button
                                onClick={() => setNewModal(false)}
                                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addGalleryItem}
                                className="px-4 py-2 bg-boutique-rose text-white rounded-xl text-xs font-semibold"
                            >
                                Save Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
