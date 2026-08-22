"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, MessageSquarePlus, X, CheckCircle2, Upload, Loader2 } from "lucide-react";

export default function TestimonialsSection() {
    // Real Google reviews from the DB
    const [reviews, setReviews] = useState([]);
    const scrollRef = useRef(null);

    // Modal & Form State
    const [isOpen, setIsOpen] = useState(false);
    const [author, setAuthor] = useState("");
    const [avatar, setAvatar] = useState("");
    const [rating, setRating] = useState(5);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetch("/api/data/testimonials", { cache: "no-store" })
            .then((res) => res.json())
            .then((json) => {
                if (json.success && Array.isArray(json.data)) setReviews(json.data);
            })
            .catch(() => { });
    }, []);

    // Duplicate array for seamless infinite marquee loop
    const marqueeReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
    };

    // File Upload Handler
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/data/upload", {
                method: "POST",
                body: formData,
            });
            const json = await res.json();

            if (json.success && json.url) {
                setAvatar(json.url);
            } else {
                window.alert(json.error || "Upload failed. Please try again.");
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            window.alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!author.trim() || !text.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/data/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author: author.trim(),
                    avatar: avatar.trim() || undefined,
                    rating: Number(rating) || 5,
                    text: text.trim(),
                }),
            });
            const json = await res.json();

            if (json.success && json.data) {
                // Prepend new review directly to reviews state so it shows immediately
                setReviews((prev) => [json.data, ...prev]);

                // Reset form & close modal
                setAuthor("");
                setAvatar("");
                setRating(5);
                setText("");
                setIsOpen(false);

                // Show success alert
                setAlert("Review posted successfully! Thank you for sharing your experience.");
                setTimeout(() => setAlert(null), 4500);
            } else {
                window.alert(json.error || "Failed to post review. Please try again.");
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            window.alert("Something went wrong while posting your review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-16 md:py-24 bg-boutique-bg-card border-y border-boutique-muted-border/40 overflow-hidden relative">
            {/* Top Success Alert Toast */}
            {alert && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-950 text-emerald-100 border border-emerald-500/40 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-slide-down">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">{alert}</span>
                    <button
                        onClick={() => setAlert(null)}
                        className="ml-2 text-emerald-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="text-center sm:text-left mx-auto sm:mx-0">
                        <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-boutique-charcoal uppercase">
                            WHAT OUR CUSTOMERS SAY
                        </h2>
                        <div className="h-[2px] w-14 bg-gradient-to-r from-boutique-rose via-boutique-gold to-boutique-rose mx-auto sm:mx-0 my-3 rounded-full" />
                    </div>

                    {/* Manual Navigation Buttons */}
                    <div className="hidden sm:flex items-center space-x-2">
                        <button
                            onClick={scrollLeft}
                            aria-label="Previous review"
                            className="w-9 h-9 rounded-full bg-white hover:bg-boutique-rose hover:text-white border border-boutique-muted-border flex items-center justify-center text-boutique-charcoal transition-colors duration-200 shadow-xs"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={scrollRight}
                            aria-label="Next review"
                            className="w-9 h-9 rounded-full bg-white hover:bg-boutique-rose hover:text-white border border-boutique-muted-border flex items-center justify-center text-boutique-charcoal transition-colors duration-200 shadow-xs"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Continuous Marquee Scrolling Container */}
            <div
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar scroll-smooth py-3 px-4"
            >
                <div className="animate-marquee-slow flex space-x-6">
                    {marqueeReviews.map((rev, index) => (
                        <div
                            key={`${rev.id}-${index}`}
                            className="w-[280px] sm:w-[320px] lg:w-[350px] flex-shrink-0 bg-white rounded-3xl p-6 sm:p-7 border border-boutique-muted-border/60 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between space-y-5"
                        >
                            {/* Top Star Rating & Review Text */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-1">
                                    {[...Array(rev.rating || 5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 text-amber-400 fill-amber-400"
                                        />
                                    ))}
                                </div>

                                <p className="text-xs sm:text-sm text-boutique-charcoal/90 font-light italic leading-relaxed line-clamp-6">
                                    &ldquo;{rev.text}&rdquo;
                                </p>
                            </div>

                            {/* Customer Profile Info at Bottom */}
                            <div className="flex items-center space-x-3 pt-3 border-t border-boutique-muted-border/40">
                                {rev.avatar ? (
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-boutique-rose/20">
                                        <Image
                                            src={rev.avatar}
                                            alt={rev.author}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-boutique-blush/50 text-boutique-rose font-bold font-serif-editorial text-sm flex items-center justify-center flex-shrink-0">
                                        {rev.author?.charAt(0) || "C"}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h3 className="font-serif-editorial text-sm font-bold text-boutique-charcoal truncate">
                                        {rev.author}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Post-Reviews Clean Text CTA Section */}
            <div className="mt-12 text-center px-4 flex flex-col items-center space-y-3">
                <h3 className="font-serif-editorial text-xl sm:text-2xl md:text-3xl font-bold text-boutique-charcoal uppercase tracking-wide">
                    HAVE YOU VISITED OUR BOUTIQUE?
                </h3>
                <p className="text-xs sm:text-sm text-boutique-taupe font-light max-w-lg mx-auto leading-relaxed">
                    We would love to hear about your experience! Share your feedback with us to inspire future brides and customers.
                </p>

                <div className="pt-2">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-boutique-rose hover:bg-boutique-rose-dark text-white text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-sm hover:shadow active:scale-95"
                    >
                        <MessageSquarePlus className="w-4 h-4 text-white/95" />
                        <span>Write a Review</span>
                    </button>
                </div>
            </div>

            {/* Write a Review Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-boutique-muted-border shadow-2xl relative animate-scale-up">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-boutique-muted-border/50">
                            <div>
                                <h3 className="font-serif-editorial text-xl font-bold text-boutique-charcoal uppercase">
                                    Write a Review
                                </h3>
                                <p className="text-xs text-boutique-taupe mt-0.5 font-light">
                                    Share your experience with Designs by Nisha
                                </p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-boutique-bg hover:bg-boutique-muted-border/30 flex items-center justify-center text-boutique-taupe hover:text-boutique-charcoal transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            {/* Customer Name */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-boutique-charcoal mb-1.5">
                                    Your Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ananya Sharma"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-boutique-muted-border text-sm focus:outline-none focus:border-boutique-rose bg-boutique-bg/30 text-boutique-charcoal"
                                />
                            </div>

                            {/* Image File Upload & URL input */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-boutique-charcoal mb-1.5">
                                    Your Photo <span className="text-boutique-taupe text-[10px] font-normal lowercase">(optional)</span>
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        {avatar ? (
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-boutique-rose flex-shrink-0 shadow-xs">
                                                <Image src={avatar} alt="Avatar preview" fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setAvatar("")}
                                                    title="Remove image"
                                                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : null}

                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-boutique-rose/60 bg-boutique-blush/30 hover:bg-boutique-blush/70 text-boutique-rose text-xs font-semibold transition-all shadow-2xs">
                                            {uploading ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-boutique-rose" />
                                            ) : (
                                                <Upload className="w-4 h-4 text-boutique-rose" />
                                            )}
                                            <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <input
                                        type="url"
                                        placeholder="Or paste image URL"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-boutique-muted-border text-xs focus:outline-none focus:border-boutique-rose bg-boutique-bg/30 text-boutique-charcoal"
                                    />
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-boutique-charcoal mb-1.5">
                                    Rating
                                </label>
                                <div className="flex items-center space-x-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 fill-gray-100"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-boutique-charcoal mb-1.5">
                                    Your Review <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell us about your outfit, fitting, or boutique experience..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-boutique-muted-border text-sm focus:outline-none focus:border-boutique-rose bg-boutique-bg/30 text-boutique-charcoal resize-none"
                                />
                            </div>

                            {/* Form Buttons */}
                            <div className="flex items-center justify-end space-x-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-boutique-muted-border text-xs font-semibold text-boutique-charcoal hover:bg-boutique-bg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="px-6 py-2.5 rounded-xl bg-boutique-rose hover:bg-boutique-rose-dark disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
                                >
                                    {loading ? "Posting..." : "Post Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
