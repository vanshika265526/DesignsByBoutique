"use client";

import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Calendar, Check, X } from "lucide-react";

export default function AdminOffersPage() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);

    const [newOffer, setNewOffer] = useState({
        title: "Festive Season Discount",
        code: "FESTIVE2026",
        discountPercent: 20,
        description: "20% off all Bridal Lehengas & Anarkalis",
        applicableCategory: "bridal-lehengas",
        active: true,
        startDate: "2026-08-15",
        endDate: "2026-11-01",
    });

    const loadOffers = () => {
        setLoading(true);
        fetch("/api/data/offers")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setOffers(json.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadOffers();
    }, []);

    const toggleOfferActive = async (offer) => {
        try {
            const res = await fetch(`/api/data/offers/${offer.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !offer.active }),
            });
            const json = await res.json();
            if (json.success) {
                setOffers((prev) =>
                    prev.map((o) => (o.id === offer.id ? { ...o, active: !offer.active } : o))
                );
            }
        } catch (err) {
            console.error("Failed to toggle offer:", err);
        }
    };

    const addOffer = async () => {
        try {
            const res = await fetch("/api/data/offers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newOffer),
            });
            const json = await res.json();
            if (json.success) {
                setOffers((prev) => [json.data, ...prev]);
                setModal(false);
            }
        } catch (err) {
            console.error("Error creating offer:", err);
        }
    };

    const deleteOffer = async (id) => {
        try {
            const res = await fetch(`/api/data/offers/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                setOffers((prev) => prev.filter((o) => o.id !== id));
            }
        } catch (err) {
            console.error("Error deleting offer:", err);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Offers & Promotional Discounts
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Configure festive coupon codes and seasonal sale badges across the boutique catalog
                    </p>
                </div>

                <button
                    onClick={() => setModal(true)}
                    className="bg-boutique-rose hover:bg-boutique-rose-dark text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-sm w-fit"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Discount Code</span>
                </button>
            </div>

            {/* Offers List */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-2xs">
                {loading ? (
                    <div className="p-8 text-center text-xs text-neutral-400">Loading offers...</div>
                ) : offers.length === 0 ? (
                    <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
                        <Tag className="w-8 h-8 mx-auto text-neutral-300" />
                        <p>No active promotions configured yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-mono border-b border-neutral-200">
                                <tr>
                                    <th className="py-3.5 px-4">Offer Name</th>
                                    <th className="py-3.5 px-4">Promo Code</th>
                                    <th className="py-3.5 px-4">Discount %</th>
                                    <th className="py-3.5 px-4">Applicable Collection</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 font-sans">
                                {offers.map((offer) => (
                                    <tr key={offer.id} className="hover:bg-neutral-50/80 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-neutral-800">
                                            {offer.title}
                                            <p className="text-[10px] text-neutral-400 font-normal">
                                                {offer.description}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="font-mono bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1 rounded text-xs font-bold">
                                                {offer.code}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-boutique-rose font-mono">
                                            {offer.discountPercent}% OFF
                                        </td>
                                        <td className="py-3.5 px-4 text-neutral-600 font-medium">
                                            {offer.applicableCategory || "All Catalog"}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <button
                                                onClick={() => toggleOfferActive(offer)}
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium uppercase border ${offer.active
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                                        : "bg-neutral-100 text-neutral-600 border-neutral-300"
                                                    }`}
                                            >
                                                {offer.active ? "Active" : "Disabled"}
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => deleteOffer(offer.id)}
                                                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

            {/* Create Offer Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                        <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal">
                            Create Promotional Discount
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newOffer.title}
                                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-neutral-700 font-medium mb-1">Promo Code</label>
                                    <input
                                        type="text"
                                        value={newOffer.code}
                                        onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-neutral-700 font-medium mb-1">Discount %</label>
                                    <input
                                        type="number"
                                        value={newOffer.discountPercent}
                                        onChange={(e) => setNewOffer({ ...newOffer, discountPercent: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-neutral-700 font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    value={newOffer.description}
                                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-100">
                            <button
                                onClick={() => setModal(false)}
                                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-xl text-xs font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addOffer}
                                className="px-4 py-2 bg-boutique-rose text-white rounded-xl text-xs font-semibold"
                            >
                                Save Discount
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
