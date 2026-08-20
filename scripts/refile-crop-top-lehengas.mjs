/**
 * Three crop-top lehengas were filed under Her Beginning > Bodycon Dresses,
 * which is not what they are. Her Beginning has no lehenga subcategory, so they
 * move to Her Bridal Story > Engagement lehenga alongside the other lehengas.
 *
 * Usage:  node scripts/refile-crop-top-lehengas.mjs [--apply]
 * Without --apply it just reports what it would change.
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const IDS = ['prod-1787138263085', 'prod-1787138521308', 'prod-1787139299560'];

// Mirrors the shape of the lehengas already living in this category.
const DESTINATION = {
    category: 'her-bridal-story',
    categoryName: 'Her Bridal Story',
    categorySlug: 'her-bridal-story',
    subcategory: 'engagement-lehenga',
    chapter: 'her-forever',
    chapterName: 'Her New Chapter',
};

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');
const products = db.collection('products');

const before = await products.find({ id: { $in: IDS } }).toArray();
console.log(`${before.length} product(s) to refile:`);
for (const p of before) console.log(`  ${p.id}  ${p.name}  (${p.category} > ${p.subcategory})`);

if (!APPLY) {
    console.log('\nDry run — re-run with --apply to write the fix.');
} else {
    const res = await products.updateMany({ id: { $in: IDS } }, { $set: DESTINATION });
    console.log(`\nUpdated ${res.modifiedCount} product(s) -> ${DESTINATION.category} > ${DESTINATION.subcategory}.`);
    const remaining = await products.countDocuments({ subcategory: 'bodycon-dresses' });
    console.log(`Products still in the bodycon-dresses subcategory: ${remaining}`);
}

await client.close();
