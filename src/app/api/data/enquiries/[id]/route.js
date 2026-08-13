import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog } from '@/lib/db';

// PATCH — update enquiry status
export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { status } = body;
        const db = readDb();
        const index = (db.enquiries || []).findIndex(e => e.id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
        }

        if (status) db.enquiries[index].status = status;
        db.enquiries[index].updatedAt = new Date().toISOString();

        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Enquiry Updated', `Set status of enquiry #${id} to "${status}"`);
            return NextResponse.json({ success: true, data: db.enquiries[index] });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE — remove an enquiry from CRM
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const db = readDb();
        const index = (db.enquiries || []).findIndex(e => e.id === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
        }

        const clientName = db.enquiries[index].name;
        db.enquiries.splice(index, 1);
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Enquiry Deleted', `Removed CRM enquiry from ${clientName} (ID: ${id})`);
            return NextResponse.json({ success: true, message: `Enquiry ${id} deleted` });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
