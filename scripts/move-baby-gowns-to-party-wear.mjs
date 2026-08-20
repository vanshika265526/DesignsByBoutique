/**
 * Files the nine Baby Girl ball gowns under the Party Wear subcategory, which
 * was empty. Subcategories are exclusive (SubcategoryProductsLayout treats an
 * explicit tag as authoritative), so this moves them out of "Gowns" rather than
 * listing them in both places.
 *
 * Usage:  node scripts/move-baby-gowns-to-party-wear.mjs [--apply]
 *         node scripts/move-baby-gowns-to-party-wear.mjs --revert [--apply]
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const APPLY = process.argv.includes('--apply');
const REVERT = process.argv.includes('--revert');
const [from, to] = REVERT ? ['party-wear', 'gowns'] : ['gowns', 'party-wear'];

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');
const products = db.collection('products');

const filter = { category: 'baby-girl-dresses', subcategory: from };
const docs = await products.find(filter).toArray();

console.log(`Moving ${docs.length} product(s) from "${from}" to "${to}":`);
for (const p of docs) console.log(`  ${p.name.trim()}`);

if (APPLY) {
    const res = await products.updateMany(filter, { $set: { subcategory: to } });
    console.log(`\nUpdated ${res.modifiedCount} product(s).`);
    for (const slug of ['gowns', 'frock', 'party-wear', 'mini-lehengas']) {
        const n = await products.countDocuments({ category: 'baby-girl-dresses', subcategory: slug });
        console.log(`  ${slug.padEnd(14)} ${n}`);
    }
} else {
    console.log('\nDry run — re-run with --apply to write the change.');
}

await client.close();
