import { NextResponse } from "next/server";
import { getDbAsync } from "@/lib/db";

// Always run on request - never let Next cache this handler's response.
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        const slug = params.slug;
        const db = await getDbAsync();
        const products = db.products || [];
        const product = products.find((p) => p.slug === slug);

        if (!product) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
