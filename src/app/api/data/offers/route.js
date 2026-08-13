import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog } from '@/lib/db';

export async function GET() {
    try {
        const db = readDb();
        return NextResponse.json({ success: true, data: db.offers || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const offerData = await request.json();
        const db = readDb();
        if (!db.offers) db.offers = [];

        const newOffer = {
            id: offerData.id || `offer-${Date.now()}`,
            title: offerData.title || 'Special Promotion',
            code: offerData.code || 'SPECIAL',
            discountPercent: Number(offerData.discountPercent) || 10,
            description: offerData.description || '',
            applicableCategory: offerData.applicableCategory || 'all',
            active: offerData.active !== false,
            startDate: offerData.startDate || new Date().toISOString().split('T')[0],
            endDate: offerData.endDate || '',
            createdAt: new Date().toISOString()
        };

        db.offers.unshift(newOffer);
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Offer Created', `Created promotion "${newOffer.title}" (${newOffer.discountPercent}% OFF)`);
            return NextResponse.json({ success: true, data: newOffer }, { status: 201 });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        const db = readDb();
        const index = (db.offers || []).findIndex(o => o.id === id);

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
