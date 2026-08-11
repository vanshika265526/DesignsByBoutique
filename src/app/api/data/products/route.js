import { readDb, writeDb, addAuditLog, getDbAsync } from '@/lib/db';

// GET all products or filter by category/chapter
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const chapter = searchParams.get('chapter');
        const status = searchParams.get('status');
        const featured = searchParams.get('featured');

        const db = await getDbAsync();
        let products = db.products || [];

        if (category) {
            products = products.filter(p => p.category === category);
        }
        if (chapter) {
            products = products.filter(p => p.chapter === chapter);
        }
        if (status) {
            products = products.filter(p => p.status === status);
        }
        if (featured === 'true') {
            products = products.filter(p => p.featured === true);
        }

        return NextResponse.json({ success: true, count: products.length, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST create a new product
export async function POST(request) {
    try {
        const productData = await request.json();
        const db = readDb();
        if (!db.products) db.products = [];

        // Generate ID and slug if missing
        const newId = productData.id || `prod-${Date.now()}`;
        const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const newProduct = {
            id: newId,
            name: productData.name || 'Untitled Product',
            slug,
            category: productData.category || 'suits-anarkalis',
            categoryName: productData.categoryName || 'Suits & Anarkalis',
            chapter: productData.chapter || 'her-beginnings',
            chapterName: productData.chapterName || 'Her Beginnings',
            price: Number(productData.price) || 0,
            originalPrice: Number(productData.originalPrice) || Number(productData.price) || 0,
            discount: productData.discount || `${Math.round((1 - (productData.price / (productData.originalPrice || productData.price))) * 100)}% OFF`,
            description: productData.description || '',
            shortDescription: productData.shortDescription || '',
            image: productData.image || productData.images?.[0] || '/images/hero-bridal.png',
            images: productData.images || [productData.image || '/images/hero-bridal.png'],
            featured: productData.featured || false,
            status: productData.status || 'published',
            details: productData.details || ['Handcrafted embroidery', 'Custom sizing available'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.products.unshift(newProduct);
        const saved = writeDb(db);
        if (saved) {
            addAuditLog('Product Created', `Added product "${newProduct.name}" (ID: ${newProduct.id})`);
            return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
        }
        return NextResponse.json({ success: false, error: 'Failed to write DB' }, { status: 500 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
