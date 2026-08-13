import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog } from '@/lib/db';

export async function GET() {
    try {
        const db = readDb();
        return NextResponse.json({ success: true, data: db });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = readDb();
        const updatedDb = { ...db, ...body };
        const saved = await writeDb(updatedDb);
        if (saved) {
            addAuditLog('Full database sync', 'Updated whole database configuration');
            return NextResponse.json({ success: true, message: 'Database saved successfully' });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
