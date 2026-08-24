/**
 * Rebuilds the lookbook gallery from the real catalogue.
 *
 * The gallery collection shipped with 20 seeded entries pointing at Pexels stock
 * photos and local placeholder files. This replaces them with the actual product
 * photography already used across the collections, interleaved so the masonry
 * mixes categories instead of running 19 maternity gowns in a row.
 *
 * Re-run it after adding products to refresh the gallery.
 *
 * Usage:  node scripts/sync-gallery-from-products.mjs [--apply]
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

// Legacy category slugs still on some products, mapped to the current taxonomy.
const LEGACY = {
    'suits-anarkalis': 'her-beginning',
    'baby-clothes': 'baby-girl-dresses',
    'maternity-gowns': 'maternity',
    'haldi-mehendi': 'her-big-day',
    'bridal-lehengas': 'her-big-day',
};

const RATIOS = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[3/5]', 'aspect-[4/3]', 'aspect-[5/6]'];

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');

const categories = await db.collection('categories').find({}).toArray();
const nameBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

const resolveCategoryName = (product) => {
    const slug = (product.category || '').toLowerCase();
    if (nameBySlug[slug]) return nameBySlug[slug];
    // "gowns-lehengas" spans two collections — the chapter decides which.
    if (slug === 'gowns-lehengas') {
        return product.chapter === 'her-new-chapter' ? nameBySlug['her-big-day'] : nameBySlug['her-bridal-story'];
    }
    return nameBySlug[LEGACY[slug]] || product.categoryName || 'Designs by Nisha';
};

const products = await db.collection('products').find({
    $or: [{ status: 'published' }, { status: { $exists: false } }],
}).toArray();

// Group by collection, then take one from each in turn so the wall mixes.
const groups = new Map();
for (const p of products) {
    if (!p.image) continue;
    const name = resolveCategoryName(p);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(p);
}

const interleaved = [];
const lists = [...groups.values()];
for (let i = 0; lists.some((l) => i < l.length); i += 1) {
    for (const list of lists) if (i < list.length) interleaved.push(list[i]);
}

// The lookbook renders each photo at its own aspect ratio so nothing is cropped
// — a fixed ratio over a full-length portrait cut the model's head off. Cloudinary
// reports dimensions via fl_getinfo without downloading the image itself.
async function naturalSize(url) {
    if (!url.includes('/upload/')) return null;
    try {
        const res = await fetch(url.replace('/upload/', '/upload/fl_getinfo/'));
        if (!res.ok) return null;
        const info = (await res.json()).input;
        return info?.width && info?.height ? { width: info.width, height: info.height } : null;
    } catch {
        return null;
    }
}

const sizes = await Promise.all(interleaved.map((p) => naturalSize(p.image)));
const missing = sizes.filter((s) => !s).length;
if (missing) console.log(`Could not read dimensions for ${missing} image(s); those fall back to 3:4.`);

const items = interleaved.map((p, idx) => ({
    id: `lb-${p.id}`,
    title: (p.name || '').trim(),
    category: resolveCategoryName(p),
    image: p.image,
    width: sizes[idx]?.width ?? null,
    height: sizes[idx]?.height ?? null,
    aspectRatio: RATIOS[idx % RATIOS.length],
    location: 'New Delhi Atelier',
}));

const existing = await db.collection('gallery').countDocuments();
console.log(`Replacing ${existing} gallery item(s) with ${items.length} product photo(s).`);
const counts = {};
for (const it of items) counts[it.category] = (counts[it.category] || 0) + 1;
console.log(`By collection: ${Object.entries(counts).map(([k, v]) => `${k} (${v})`).join(', ')}`);
console.log(`First six: ${items.slice(0, 6).map((i) => `${i.title} [${i.category}]`).join(' | ')}`);
const nonCloudinary = items.filter((i) => !i.image.includes('res.cloudinary.com'));
console.log(`Entries not backed by uploaded boutique photos: ${nonCloudinary.length}`);

if (APPLY) {
    await db.collection('gallery').deleteMany({});
    if (items.length) await db.collection('gallery').insertMany(items);
    console.log(`\nGallery now holds ${await db.collection('gallery').countDocuments()} item(s).`);
} else {
    console.log('\nDry run — re-run with --apply to write the gallery.');
}

await client.close();
