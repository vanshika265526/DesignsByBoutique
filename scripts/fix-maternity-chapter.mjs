/**
 * Maternity products carried chapter "her-beginnings", which made the
 * Her Beginning collection page pick them up through its legacy chapter
 * mapping. They belong to the Her Motherhood chapter only.
 *
 * Usage:  node scripts/fix-maternity-chapter.mjs [--apply]
 * Without --apply it just reports what it would change.
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');

const filter = { category: 'maternity', chapter: { $ne: 'her-motherhood' } };
const affected = await db.collection('products').find(filter).project({ id: 1, name: 1, chapter: 1 }).toArray();

console.log(`${affected.length} maternity product(s) filed under the wrong chapter:`);
for (const p of affected) console.log(`  ${p.id}  ${p.name}  (chapter: ${p.chapter})`);

if (!APPLY) {
    console.log('\nDry run — re-run with --apply to write the fix.');
} else if (affected.length) {
    const res = await db.collection('products').updateMany(filter, {
        $set: { chapter: 'her-motherhood', chapterName: 'Her Motherhood' },
    });
    console.log(`\nUpdated ${res.modifiedCount} product(s) to chapter "her-motherhood".`);
}

await client.close();
