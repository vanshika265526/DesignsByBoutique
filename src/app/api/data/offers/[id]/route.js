// Always run on request - never let Next cache this handler's response.
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog, getDbAsync } from '@/lib/db';


export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const updates = await request.json();
        const db = await getDbAsync();
        const index = (db.offers || []).findIndex((o) => o.id === id);
        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
        }
        db.offers[index] = { ...db.offers[index], ...updates };
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Offer Updated', `Updated promotion "${db.offers[index].title}"`);
            return NextResponse.json({ success: true, data: db.offers[index] });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const db = await getDbAsync();
        const before = (db.offers || []).length;
        db.offers = (db.offers || []).filter((o) => o.id !== id);
        if (db.offers.length === before) {
            return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
        }
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Offer Deleted', `Removed promotion ID ${id}`);
            return NextResponse.json({ success: true, message: 'Offer deleted' });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
