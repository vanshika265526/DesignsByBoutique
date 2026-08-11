"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Clock, CheckCircle2, AlertCircle, Trash2, Filter } from "lucide-react";

export default function AdminEnquiriesPage() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    const loadEnquiries = () => {
        setLoading(true);
        fetch("/api/data/enquiries")
            .then((r) => r.json())
            .then((json) => {
                if (json.success) setEnquiries(json.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadEnquiries();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/data/enquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const json = await res.json();
            if (json.success) {
                setEnquiries((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
                );
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const deleteEnquiry = async (id) => {
        try {
            const res = await fetch(`/api/data/enquiries/${id}`, { method: "DELETE" });
            const json = await res.json();
            if (json.success) {
                setEnquiries((prev) => prev.filter((e) => e.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete enquiry:", err);
        }
    };

    const filtered = enquiries.filter(
        (e) => filterStatus === "all" || e.status === filterStatus
    );

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
                <div>
                    <h1 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-boutique-charcoal">
                        Customer WhatsApp Enquiries
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1">
                        Inbound client leads generated from product pages and customization requests
                    </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                    <span className="text-neutral-500">Filter Status:</span>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    >
                        <option value="all">All Leads ({enquiries.length})</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed / Fitted</option>
                    </select>
                </div>
            </div>

            {/* CRM Table */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-2xs">
                {loading ? (
                    <div className="p-8 text-center text-xs text-neutral-400">Loading enquiries...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
                        <MessageCircle className="w-8 h-8 mx-auto text-neutral-300" />
                        <p>No enquiries found matching filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-mono border-b border-neutral-200">
                                <tr>
                                    <th className="py-3.5 px-4">Client Name</th>
                                    <th className="py-3.5 px-4">Interested Product</th>
                                    <th className="py-3.5 px-4">WhatsApp / Phone</th>
                                    <th className="py-3.5 px-4">Custom Message</th>
                                    <th className="py-3.5 px-4">Status Lead</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 font-sans">
                                {filtered.map((enq) => (
                                    <tr key={enq.id} className="hover:bg-neutral-50/80 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-neutral-800">
                                            {enq.name}
                                            <p className="text-[10px] text-neutral-400 font-mono">
                                                {new Date(enq.createdAt).toLocaleDateString("en-IN")}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-4 text-neutral-700 font-medium">
                                            {enq.productName || "General Consultation"}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700">
                                            <a
                                                href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                                                    enq.name
                                                )},%20thank%20you%20for%20contacting%20Designs%20by%20Nisha!`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:underline flex items-center space-x-1"
                                            >
                                                <span>{enq.phone}</span>
                                                <MessageCircle className="w-3 h-3 text-emerald-600" />
                                            </a>
                                        </td>
                                        <td className="py-3.5 px-4 text-neutral-600 max-w-xs line-clamp-2">
                                            {enq.message}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <select
                                                value={enq.status}
                                                onChange={(e) => updateStatus(enq.id, e.target.value)}
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase border ${enq.status === "New"
                                                        ? "bg-amber-100 text-amber-800 border-amber-300"
                                                        : enq.status === "Contacted"
                                                            ? "bg-blue-100 text-blue-800 border-blue-300"
                                                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                                                    }`}
                                            >
                                                <option value="New">New Lead</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Closed">Fitting Scheduled</option>
                                            </select>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => deleteEnquiry(enq.id)}
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
        </div>
    );
}
