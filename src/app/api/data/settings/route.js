import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog, getDbAsync } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDbAsync();
        return NextResponse.json({ success: true, data: db.settings || {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST — full settings replacement (used by /admin/content save)
export async function POST(request) {
    try {
        const updates = await request.json();
        const db = readDb();
        db.settings = { ...db.settings, ...updates, updatedAt: new Date().toISOString() };
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Settings Updated', 'Updated boutique settings via Content Management Studio.');
            return NextResponse.json({ success: true, data: db.settings });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const updates = await request.json();
        const db = readDb();
        db.settings = { ...db.settings, ...updates, updatedAt: new Date().toISOString() };
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Settings Updated', 'Updated boutique settings (WhatsApp, Contact, SEO, etc.)');
            return NextResponse.json({ success: true, data: db.settings });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

