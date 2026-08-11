import { NextResponse } from 'next/server';
import { readDb, writeDb, addAuditLog } from '@/lib/db';

// GET single product by ID or slug
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const db = readDb();
        const product = (db.products || []).find(p => p.id === id || p.slug === id);
        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PATCH update product
export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const updates = await request.json();
        const db = readDb();
        const index = (db.products || []).findIndex(p => p.id === id || p.slug === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const existing = db.products[index];
        const updatedProduct = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        // Recalculate discount if price/originalPrice updated
        if (updates.price || updates.originalPrice) {
            const p = Number(updatedProduct.price) || 0;
            const op = Number(updatedProduct.originalPrice) || p;
            if (op > p && p > 0) {
                updatedProduct.discount = `${Math.round((1 - (p / op)) * 100)}% OFF`;
            }
        }

        db.products[index] = updatedProduct;
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Product Updated', `Updated "${updatedProduct.name}" (ID: ${id})`);
            return NextResponse.json({ success: true, data: updatedProduct });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE product (or archive)
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const db = readDb();
        const index = (db.products || []).findIndex(p => p.id === id || p.slug === id);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const removedName = db.products[index].name;
        db.products.splice(index, 1);
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Product Deleted', `Removed "${removedName}" (ID: ${id})`);
            return NextResponse.json({ success: true, message: `Product ${id} deleted` });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
