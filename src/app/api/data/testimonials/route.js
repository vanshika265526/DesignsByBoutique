import { NextResponse } from "next/server";
import { readDb, writeDb, addAuditLog } from "@/lib/db";

export async function GET() {
    try {
        const db = readDb();
        const testimonials = db.testimonials || [];
        return NextResponse.json({ success: true, data: testimonials });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const db = readDb();
        if (!db.testimonials) db.testimonials = [];

        const newTestimonial = {
            id: `test-${Date.now()}`,
            author: body.author || "Valued Client",
            city: body.city || "New Delhi",
            rating: Number(body.rating) || 5,
            text: body.text || "",
            outfit: body.outfit || "Custom Boutique Outfit",
            avatar: body.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
            featured: body.featured !== undefined ? body.featured : true,
            createdAt: new Date().toISOString(),
        };

        db.testimonials.unshift(newTestimonial);
        await writeDb(db);
        addAuditLog("Added Testimonial", `Added review by ${newTestimonial.author}`);
        return NextResponse.json({ success: true, data: newTestimonial });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;
        const db = readDb();
        if (!db.testimonials) db.testimonials = [];

        const idx = db.testimonials.findIndex((t) => t.id === id);
        if (idx === -1) {
            return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
        }

        db.testimonials[idx] = { ...db.testimonials[idx], ...updates };
        await writeDb(db);
        addAuditLog("Updated Testimonial", `Updated review ID ${id}`);
        return NextResponse.json({ success: true, data: db.testimonials[idx] });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
        }

        const db = readDb();
        if (!db.testimonials) db.testimonials = [];

        db.testimonials = db.testimonials.filter((t) => t.id !== id);
        await writeDb(db);
        addAuditLog("Deleted Testimonial", `Removed testimonial ID ${id}`);
        return NextResponse.json({ success: true, message: "Testimonial deleted" });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
