import { NextResponse } from "next/server";
import { readDb, writeDb, addAuditLog } from "@/lib/db";

export async function GET() {
    try {
        const db = readDb();
        const analytics = db.analytics || {
            totalPageViews: 14850,
            monthlyPageViews: 4230,
            productViews: 8920,
            whatsappClicks: 640,
            callClicks: 215,
            instagramClicks: 1120,
            dailyPageViews: [],
            categoryPerformance: [],
            topProducts: [],
        };
        return NextResponse.json({ success: true, data: analytics });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { action, payload } = body;
        const db = readDb();
        if (!db.analytics) db.analytics = {};

        if (action === "track_click") {
            const { type } = payload; // whatsapp, call, instagram, view
            if (type === "whatsapp") db.analytics.whatsappClicks = (db.analytics.whatsappClicks || 0) + 1;
            if (type === "call") db.analytics.callClicks = (db.analytics.callClicks || 0) + 1;
            if (type === "instagram") db.analytics.instagramClicks = (db.analytics.instagramClicks || 0) + 1;
            if (type === "view") db.analytics.totalPageViews = (db.analytics.totalPageViews || 0) + 1;
            writeDb(db);
            return NextResponse.json({ success: true, data: db.analytics });
        }

        if (action === "update") {
            db.analytics = { ...db.analytics, ...payload };
            writeDb(db);
            addAuditLog("Updated Analytics", "Analytics metrics manually recalibrated by admin");
            return NextResponse.json({ success: true, data: db.analytics });
        }

        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
