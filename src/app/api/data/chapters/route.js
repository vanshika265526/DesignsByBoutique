import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog, getDbAsync } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDbAsync();
        return NextResponse.json({ success: true, data: db.chapters || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        const db = await getDbAsync();
        const index = (db.chapters || []).findIndex(c => c.id === id || c.slug === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
        }

        db.chapters[index] = { ...db.chapters[index], ...updates };
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Chapter Updated', `Updated chapter "${db.chapters[index].title}"`);
            return NextResponse.json({ success: true, data: db.chapters[index] });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
