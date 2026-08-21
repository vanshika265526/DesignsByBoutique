/**
 * Replaces the seeded placeholder testimonials with the boutique's real Google
 * reviews, transcribed from the Google Business profile.
 *
 * Deliberate choices:
 *  - No `city`. Google does not publish reviewer locations and the old cards
 *    invented them.
 *  - No `outfit`. The old cards tagged every review with a garment name that the
 *    reviewer never mentioned.
 *  - No `avatar`. Putting a stock photo of a stranger next to a real customer's
 *    name misrepresents that person; the card falls back to an initial badge,
 *    which is what Google itself shows for these reviewers.
 *
 * Usage:  node scripts/sync-google-reviews.mjs [--apply]
 */
import { MongoClient } from 'mongodb';
import fs from 'fs';

for (const line of fs.readFileSync('.env.local', 'utf-8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

// Ordered newest first, matching the "weeks ago" stamps on the profile.
const REVIEWS = [
    {
        id: 'gr-adeebanoor-ashraf',
        author: 'Adeebanoor Ashraf',
        rating: 5,
        text: 'Absolutely love Designs by Nisha in Delhi! Every single visit has been a wonderful experience.',
    },
    {
        id: 'gr-kaushalya-kumar',
        author: 'Kaushalya Kumar',
        rating: 5,
        text: 'The stitching of my dress is just wonderful! Every seam, lace, and frill detail is done so neatly and cleanly. The fit is absolute perfection and the finishing is top-notch. Thank you for such great work!',
    },
    {
        id: 'gr-pinki-tamta',
        author: 'Pinki Tamta',
        rating: 5,
        text: "Amazing designs and great customer service. I'm very satisfied with the quality and attention to detail. Highly recommended!",
    },
    {
        id: 'gr-saloni-singh',
        author: 'Saloni Singh',
        rating: 5,
        text: 'Design crafted with perfection and care. Each garment has a story to tell. Must visit to make your simple occasion to an extraordinary affairs.',
    },
    {
        id: 'gr-satya-prakash-singh',
        author: 'Satya Prakash Singh',
        rating: 5,
        text: 'Best boutique, she is professional and best at her work. Timely response and quality stitching.',
    },
    {
        id: 'gr-rini-sharma',
        author: 'Rini Sharma',
        rating: 5,
        text: 'Absolutely loved my experience here! The collection is stunning, but what really stood out was the quick and efficient service. I found exactly what I needed without any hassle. Highly recommend!',
    },
    {
        id: 'gr-sadaf-salman',
        author: 'Sadaf Salman',
        rating: 5,
        text: 'Finally found a boutique with excellent stitching! The fit was perfect on the first try, and they are very professional and punctual with delivery. 😍',
    },
    {
        id: 'gr-shivani-banoula',
        author: 'Shivani Banoula',
        rating: 5,
        text: "The fitting and finishing of your outfits are very good. Nisha is undoubtedly talented in her field, she knows what she's doing.",
    },
    {
        id: 'gr-megha-bisht',
        author: 'Megha Bisht',
        rating: 5,
        text: "I have visited Nisha's boutique and had such a wonderful experience! The quality of the fabrics and the finishing of each piece really stand out. What I loved the most was the personalized attention. Nisha is so polite, patient, and genuinely helpful in suggesting outfits that suited my style and body type. If you're looking for stylish outfits with great quality and excellent customer service, this boutique is definitely worth visiting. Highly recommended! Cheers to Nisha ❣️",
    },
    {
        id: 'gr-komal-mehta',
        author: 'Komal Mehta',
        rating: 5,
        text: 'The work she does is really very amazing.. Its being almost 4-5 years since I know her and get almost my very dress stiched by her.. Truly holds magic in her hands.... Very genuine person... Passionate. Would recommend very one to give it a try she will never disappoint... ❤️',
    },
    {
        id: 'gr-rashmi-singh',
        author: 'Rashmi Singh',
        rating: 5,
        text: "Beautiful boutique with a lovely collection. You can tell a lot of effort has gone into selecting the designs and fabrics. The service is friendly and helpful. Worth checking out if you're looking for something elegant and well-stitched.",
    },
];

const APPLY = process.argv.includes('--apply');
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB || 'designs_by_nisha');
const col = db.collection('testimonials');

const existing = await col.find({}).toArray();
console.log(`Existing testimonials (${existing.length}):`);
for (const t of existing) console.log(`  ${t.author} — ${(t.text || '').slice(0, 60)}...`);

console.log(`\nReplacing with ${REVIEWS.length} real Google reviews:`);
for (const r of REVIEWS) console.log(`  ${r.author.padEnd(22)} ${r.rating}★  ${r.text.slice(0, 55)}...`);

if (APPLY) {
    await col.deleteMany({});
    await col.insertMany(REVIEWS.map((r) => ({ ...r, featured: true, source: 'google' })));
    console.log(`\nTestimonials collection now holds ${await col.countDocuments()} review(s).`);
} else {
    console.log('\nDry run — re-run with --apply to write the reviews.');
}

await client.close();
