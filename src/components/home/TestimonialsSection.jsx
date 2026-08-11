"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const defaultTestimonials = [
    {
        id: "t1",
        author: "Meera & Rohan Kapoor",
        city: "Defence Colony, New Delhi",
        rating: 5,
        text: "Designs by Nisha crafted my dream royal red bridal lehenga and my husband's matching Sherwani dupatta. The intricate zardozi work and personal fitting sessions at their Delhi studio were pure luxury.",
        outfit: "Custom Velvet Bridal Lehenga",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: "t2",
        author: "Ananya Sharma",
        city: "South Extension, New Delhi",
        rating: 5,
        text: "Finding graceful maternity gowns for my pre-baby shoot felt impossible until I visited Nisha's atelier. The silk drape was featherlight and photographically breathtaking.",
        outfit: "Rose Silk Maternity Gown",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    },
    {
        id: "t3",
        author: "Pooja & Vikram Malhotra",
        city: "Vasant Vihar, New Delhi",
        rating: 5,
        text: "We ordered matching mother-daughter outfits for our baby girl's first birthday. The skin-friendly soft lining and custom embroidery detail surpassed all our expectations.",
        outfit: "Heirloom Baby Lehenga & Anarkali",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },
];

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState(defaultTestimonials);

    useEffect(() => {
        fetch("/api/data/testimonials")
            .then((res) => res.json())
            .then((json) => {
                if (json.success && json.data && json.data.length > 0) {
                    setTestimonials(json.data);
                }
            })
            .catch(() => {
                // Fallback to default client reviews
            });
    }, []);

    return (
        <section className="py-24 bg-boutique-bg-card border-y border-boutique-muted-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                <SectionHeading
                    badge="CLIENT EXPERIENCES"
                    title="Words from Our Patrons"
                    subtitle="Heartfelt stories from brides, mothers, and families who trusted us with their special moments."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white p-8 rounded-3xl border border-boutique-muted-border shadow-sm flex flex-col justify-between space-y-6 relative hover:shadow-md transition-shadow duration-300"
                        >
                            <Quote className="w-10 h-10 text-boutique-rose/20 absolute top-6 right-6" />

                            <div className="space-y-4 relative z-10">
                                {/* Star Rating */}
                                <div className="flex items-center space-x-1">
                                    {[...Array(review.rating || 5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 text-amber-500 fill-amber-500"
                                        />
                                    ))}
                                </div>

                                <p className="text-sm text-boutique-charcoal font-light leading-relaxed italic">
                                    &ldquo;{review.text}&rdquo;
                                </p>
                            </div>

                            <div className="flex items-center space-x-4 pt-4 border-t border-boutique-muted-border/60">
                                {review.avatar ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-boutique-rose/30">
                                        <Image
                                            src={review.avatar}
                                            alt={review.author}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-boutique-blush/40 flex items-center justify-center text-boutique-rose font-bold font-serif-editorial text-base flex-shrink-0">
                                        {review.author?.charAt(0) || "C"}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h4 className="font-serif-editorial text-base font-bold text-boutique-charcoal truncate">
                                        {review.author}
                                    </h4>
                                    <p className="text-[11px] text-boutique-taupe truncate">
                                        {review.outfit || review.city}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
