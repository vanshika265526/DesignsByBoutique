import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog, getDbAsync } from '@/lib/db';

// Always run on request - never let Next cache this handler's response.
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const db = await getDbAsync();
        return NextResponse.json({ success: true, data: db.categories || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const categoryData = await request.json();
        const db = await getDbAsync();
        if (!db.categories) db.categories = [];

        const newId = categoryData.id || categoryData.slug || `cat-${Date.now()}`;
        const newCategory = {
            id: newId,
            name: categoryData.name,
            slug: categoryData.slug || categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            chapter: categoryData.chapter || 'her-beginnings',
            description: categoryData.description || '',
            image: categoryData.image || '/images/category-suits.png',
            subcategories: Array.isArray(categoryData.subcategories) ? categoryData.subcategories : [],
            count: categoryData.count || 0,
            published: categoryData.published !== false,
            order: categoryData.order || db.categories.length + 1
        };

        db.categories.push(newCategory);
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Category Created', `Created category "${newCategory.name}"`);
            return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
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
        const index = (db.categories || []).findIndex(c => c.id === id || c.slug === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }

        db.categories[index] = { ...db.categories[index], ...updates };
        const saved = await writeDb(db);
        if (saved) {
            addAuditLog('Category Updated', `Updated category "${db.categories[index].name}"`);
            return NextResponse.json({ success: true, data: db.categories[index] });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
