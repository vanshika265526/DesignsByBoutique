import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog, getDbAsync } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDbAsync();
        return NextResponse.json({ success: true, data: db.enquiries || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const enqData = await request.json();
        const db = readDb();
        if (!db.enquiries) db.enquiries = [];

        const newEnquiry = {
            id: `enq-${Date.now()}`,
            name: enqData.name || 'Anonymous Guest',
            phone: enqData.phone || '',
            email: enqData.email || '',
            productName: enqData.productName || 'General Boutique Enquiry',
            productCategory: enqData.productCategory || 'Boutique',
            message: enqData.message || '',
            status: 'New',
            createdAt: new Date().toISOString()
        };

        db.enquiries.unshift(newEnquiry);
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Enquiry Recorded', `New enquiry from ${newEnquiry.name}`);
            return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, status } = body;
        const db = readDb();
        const index = (db.enquiries || []).findIndex(e => e.id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
        }

        db.enquiries[index].status = status || db.enquiries[index].status;
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Enquiry Status Updated', `Set status of enquiry #${id} to "${status}"`);
            return NextResponse.json({ success: true, data: db.enquiries[index] });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
