/**
 * The 17 Her Beginning products carry no subcategory, so the collection page
 * had to guess from their name and description — which put "Three Flair
 * Sharara" under Pant suit (its description mentions "sharara pants") and
 * listed every anarkali under three pills at once.
 *
 * This files each one under exactly one subcategory. Paired with the
 * explicit-subcategory-wins rule in SubcategoryProductsLayout, a product now
 * appears under one pill and one pill only.
 *
 * Usage:  node scripts/assign-her-beginning-subcategories.mjs [--apply]
 * Without --apply it just reports what it would change.
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const ASSIGNMENTS = {
    'prod-1787127867911': 'suits',       // Patayala suit
    'prod-1787128184648': 'pant-suit',   // Straight Plazo Suit
    'prod-1787128348172': 'anarkali',    // Ruffle anarkali suit
    'prod-1787128580126': 'anarkali',    // Bridal anarkali suit
    'prod-1787128801683': 'anarkali',    // White anarkali
    'prod-1787128995811': 'anarkali',    // Madhubala style Anarkali
    'prod-1787129556600': 'sharara',     // Handwork elegant Bridal sharara
    'prod-1787129705598': 'sharara',     // Three Flair Sharara
    'prod-1787129865588': 'sharara',     // Brocket sharara
    'prod-1787130064677': 'sharara',     // Sharara -Yellow & Green
    'prod-1787130240054': 'anarkali',    // Anarkali suit
    'prod-1787130436863': 'anarkali',    // Anarkali Suit
    'prod-1787130584232': 'anarkali',    // Black anarkali suit
    'prod-1787130773594': 'anarkali',    // Anarkali Suit Saree
    'prod-1787132796457': 'anarkali',    // Pink Anarkali Suit
    'prod-1787133269840': 'anarkali',    // Anarkali From Saree
    'prod-1787134407235': 'anarkali',    // Organza Anarkali
};

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');
const products = db.collection('products');

const ids = Object.keys(ASSIGNMENTS);
const docs = await products.find({ id: { $in: ids } }).toArray();
const missing = ids.filter((id) => !docs.some((d) => d.id === id));
if (missing.length) console.warn(`WARNING: not found in the database: ${missing.join(', ')}`);

let changed = 0;
for (const doc of docs) {
    const target = ASSIGNMENTS[doc.id];
    if (doc.subcategory === target) continue;
    changed += 1;
    console.log(`  ${doc.name.trim().padEnd(34)} ${String(doc.subcategory)} -> ${target}`);
    if (APPLY) await products.updateOne({ id: doc.id }, { $set: { subcategory: target } });
}

console.log(`\n${changed} product(s) ${APPLY ? 'updated' : 'would change'}.`);
if (!APPLY) console.log('Dry run — re-run with --apply to write the fix.');

await client.close();
