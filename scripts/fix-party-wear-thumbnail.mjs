/**
 * Baby Girl Dresses > "Frock" and "Party Wear" both pointed at the same stock
 * photo, so the navbar drew identical thumbnails for the two entries.
 *
 * Party Wear gets a real boutique photo of its own — one of the heavy ball
 * gowns, which is what baby party wear looks like here.
 *
 * Usage:  node scripts/fix-party-wear-thumbnail.mjs [--apply]
 * Without --apply it just reports what it would change.
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const CATEGORY_ID = 'baby-girl-dresses';
const SUB_SLUG = 'party-wear';
// "Heavy ball gown" — a real product photo, and not the image any other
// subcategory in this category already uses.
const NEW_IMAGE = 'https://res.cloudinary.com/likdneok/image/upload/v1787141971/designs-by-nisha/whatsapp-image-2026-08-19-at-2-50-46-pm-1-1787141971497.jpg';

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');
const categories = db.collection('categories');

const cat = await categories.findOne({ id: CATEGORY_ID });
if (!cat) throw new Error(`Category ${CATEGORY_ID} not found`);

const subcategories = (cat.subcategories || []).map((sub) =>
    sub.slug === SUB_SLUG ? { ...sub, image: NEW_IMAGE } : sub
);

console.log(`${cat.name} subcategory thumbnails:`);
for (const sub of subcategories) console.log(`  ${sub.slug.padEnd(14)} ${sub.image}`);

const urls = subcategories.map((s) => s.image);
const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
console.log(dupes.length ? `\nStill duplicated: ${[...new Set(dupes)].join(', ')}` : '\nAll thumbnails are distinct.');

if (APPLY) {
    const res = await categories.updateOne({ id: CATEGORY_ID }, { $set: { subcategories } });
    console.log(`\nUpdated ${res.modifiedCount} category document(s).`);
} else {
    console.log('\nDry run — re-run with --apply to write the fix.');
}

await client.close();
