/**
 * "Royal Red Heritage Lehenga" was filed under Her Bridal Story > Engagement
 * lehenga, but its own description calls it bridal ("timeless Indian bridal
 * elegance"). Her Bridal Story has no bridal subcategory, so it moves to
 * Her Big Day > Bridal lehenga alongside the other bridal lehengas.
 *
 * Usage:  node scripts/refile-royal-red-heritage-lehenga.mjs [--apply]
 * Without --apply it just reports what it would change.
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const ID = 'prod-1787143227232';

// Mirrors the shape of the bridal lehengas already in that subcategory.
const DESTINATION = {
    category: 'her-big-day',
    categoryName: 'Her Big Day',
    categorySlug: 'her-big-day',
    subcategory: 'bridal-lehenga',
    chapter: 'her-new-chapter',
    chapterName: 'Her Forever',
};

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');
const products = db.collection('products');

const before = await products.findOne({ id: ID });
if (!before) {
    console.error(`Product ${ID} not found — nothing to do.`);
} else {
    console.log(`${before.name.trim()}: ${before.category} > ${before.subcategory} -> ${DESTINATION.category} > ${DESTINATION.subcategory}`);
    if (APPLY) {
        const res = await products.updateOne({ id: ID }, { $set: DESTINATION });
        console.log(`Updated ${res.modifiedCount} product(s).`);
    } else {
        console.log('\nDry run — re-run with --apply to write the fix.');
    }
}

await client.close();
