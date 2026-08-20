/**
 * The Baby Girl ball gowns belong under BOTH "Gowns" and "Party Wear".
 *
 * A product's primary home stays in `subcategory`; the optional `subcategories`
 * array lists every subcategory it should appear under. SubcategoryProductsLayout
 * matches against the whole set, so this is deliberate multi-listing rather than
 * the loose text guessing that used to scatter products across the wrong pills.
 *
 * Usage:  node scripts/list-baby-gowns-in-both.mjs [--apply]
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const PRIMARY = 'gowns';
const ALSO = ['gowns', 'party-wear'];

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');
const products = db.collection('products');

// The gowns are currently sitting in either subcategory depending on whether the
// earlier move ran, so match on both.
const filter = { category: 'baby-girl-dresses', subcategory: { $in: ALSO } };
const docs = await products.find(filter).toArray();

console.log(`${docs.length} gown(s) to list under ${ALSO.join(' + ')}:`);
for (const p of docs) console.log(`  ${p.name.trim()}`);

if (APPLY) {
    const res = await products.updateMany(filter, { $set: { subcategory: PRIMARY, subcategories: ALSO } });
    console.log(`\nUpdated ${res.modifiedCount} product(s).`);
} else {
    console.log('\nDry run — re-run with --apply to write the change.');
}

await client.close();
