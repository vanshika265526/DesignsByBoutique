import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog } from '@/lib/db';

export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const updates = await request.json();
        const db = readDb();
        const index = (db.categories || []).findIndex((c) => c.id === id || c.slug === id);
        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        // never allow id/slug collisions to silently break product links
        const { id: _ignore, ...safeUpdates } = updates;
        db.categories[index] = { ...db.categories[index], ...safeUpdates };
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Category Updated', `Updated category "${db.categories[index].name}"`);
            return NextResponse.json({ success: true, data: db.categories[index] });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const db = readDb();
        const cat = (db.categories || []).find((c) => c.id === id || c.slug === id);
        if (!cat) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        // Guard: block delete if products still use this category
        const productCount = (db.products || []).filter(
            (p) => p.category === cat.slug || p.categorySlug === cat.slug || p.category === cat.id
        ).length;
        if (productCount > 0) {
            return NextResponse.json(
                { success: false, error: `Cannot delete "${cat.name}" — ${productCount} product(s) still use it. Move or delete those products first.` },
                { status: 409 }
            );
        }
        db.categories = db.categories.filter((c) => !(c.id === id || c.slug === id));
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Category Deleted', `Removed category "${cat.name}"`);
            return NextResponse.json({ success: true, message: 'Category deleted' });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
