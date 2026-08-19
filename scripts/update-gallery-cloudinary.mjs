import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
}

const CLOUD_NAME = env['CLOUDINARY_CLOUD_NAME'];
const API_KEY = env['CLOUDINARY_API_KEY'];
const API_SECRET = env['CLOUDINARY_API_SECRET'];

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('Missing Cloudinary credentials. Check .env.local');
    process.exit(1);
}

console.log(`Using Cloudinary cloud: ${CLOUD_NAME}`);

async function fetchAllCloudinaryImages() {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=500`;
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

    const res = await fetch(url, {
        headers: { 'Authorization': `Basic ${auth}` }
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cloudinary API error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return data.resources || [];
}

function toCloudinaryUrl(publicId, cloudName) {
    // Transform to high quality 1200px wide image
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_1200/${publicId}`;
}

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const rawDb = fs.readFileSync(dbPath, 'utf-8');
const dbData = JSON.parse(rawDb);

try {
    const images = await fetchAllCloudinaryImages();

    if (images.length === 0) {
        console.log('No images found in Cloudinary. Gallery not updated.');
        process.exit(0);
    }

    console.log(`Found ${images.length} images in Cloudinary.`);

    // Convert to gallery items
    const galleryItems = images.map((img, idx) => {
        const publicId = img.public_id;
        const name = publicId.split('/').pop().replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const imageUrl = toCloudinaryUrl(publicId, CLOUD_NAME);

        return {
            id: `lb-cld-${String(idx + 1).padStart(2, '0')}`,
            title: name,
            image: imageUrl,
            location: 'Designs By Nisha Atelier, Chattarpur, New Delhi',
            category: 'editorial',
            published: true,
            createdAt: img.created_at || new Date().toISOString(),
        };
    });

    dbData.gallery = galleryItems;

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    console.log(`✅ Updated gallery with ${galleryItems.length} Cloudinary images in data/db.json`);
    console.log('First few gallery images:');
    galleryItems.slice(0, 5).forEach(g => console.log(` - ${g.title}: ${g.image}`));

} catch (err) {
    console.error('Error fetching Cloudinary images:', err.message);
    process.exit(1);
}
