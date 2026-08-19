import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog, getDbAsync } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDbAsync();
        return NextResponse.json({ success: true, data: db.gallery || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const db = await getDbAsync();
        if (!db.gallery) db.gallery = [];

        const newItem = {
            id: body.id || `lb-${Date.now()}`,
            title: body.title || 'Untitled',
            category: body.category || 'Boutique',
            image: body.image || '/images/placeholder.jpg',
            aspectRatio: body.aspectRatio || 'aspect-[3/4]',
            location: body.location || '',
            published: body.published !== false,
            createdAt: new Date().toISOString(),
        };

        db.gallery.unshift(newItem);
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Gallery Photo Added', `Added lookbook photo "${newItem.title}"`);
            return NextResponse.json({ success: true, data: newItem }, { status: 201 });
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
        const db = await getDbAsync();
        const index = (db.gallery || []).findIndex((g) => g.id === id);
        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Gallery item not found' }, { status: 404 });
        }
        db.gallery[index] = { ...db.gallery[index], ...updates };
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Gallery Photo Updated', `Updated lookbook photo "${db.gallery[index].title}"`);
            return NextResponse.json({ success: true, data: db.gallery[index] });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
        }
        const db = await getDbAsync();
        db.gallery = (db.gallery || []).filter((g) => g.id !== id);
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Gallery Photo Deleted', `Removed lookbook photo ID ${id}`);
            return NextResponse.json({ success: true, message: 'Gallery item deleted' });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
