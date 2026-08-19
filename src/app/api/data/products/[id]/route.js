import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProductByIdAsync, updateProductAsync, deleteProductAsync, addAuditLog } from '@/lib/db';

// GET single product by ID or slug
export async function GET(request, { params }) {
    try {
        const { id } = params;
        const product = await getProductByIdAsync(id);
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
        const existing = await getProductByIdAsync(id);

        if (!existing) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const targetId = existing.id;

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

        const saved = await updateProductAsync(targetId, updatedProduct);
        if (saved) {
            addAuditLog('Product Updated', `Updated "${updatedProduct.name}" (ID: ${targetId})`);
            revalidatePath('/', 'layout');
            if (updatedProduct.slug) revalidatePath(`/product/${updatedProduct.slug}`);
            if (updatedProduct.category) revalidatePath(`/collections/${updatedProduct.category}`);
            return NextResponse.json({ success: true, data: updatedProduct });
        }
        return NextResponse.json(
            { success: false, error: 'Failed to update product in MongoDB Atlas or the local database.' },
            { status: 500 }
        );
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE product (or archive)
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const existing = await getProductByIdAsync(id);

        if (!existing) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const targetId = existing.id;
        const removedName = existing.name;

        const saved = await deleteProductAsync(targetId);
        if (saved) {
            addAuditLog('Product Deleted', `Removed "${removedName}" (ID: ${targetId})`);
            revalidatePath('/', 'layout');
            if (existing.slug) revalidatePath(`/product/${existing.slug}`);
            if (existing.category) revalidatePath(`/collections/${existing.category}`);
            return NextResponse.json({ success: true, message: `Product ${targetId} deleted` });
        }
        return NextResponse.json({ success: false, error: 'Failed to delete DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

