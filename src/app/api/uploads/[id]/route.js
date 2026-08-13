import { getDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Streams an image previously stored in MongoDB Atlas by the upload route.
export async function GET(_request, { params }) {
    try {
        const { id } = params;
        const db = await getDatabase();
        const doc = await db.collection('uploads').findOne({ _id: id });

        if (!doc || !doc.data) {
            return new Response('Not found', { status: 404 });
        }

        // The driver returns BSON Binary; normalise to a Node Buffer.
        const buf = doc.data.buffer
            ? Buffer.from(doc.data.buffer)
            : Buffer.from(doc.data);

        return new Response(buf, {
            status: 200,
            headers: {
                'Content-Type': doc.contentType || 'image/png',
                'Content-Length': String(buf.length),
                // Immutable: each upload has a unique, timestamped id.
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving upload:', error);
        return new Response('Error', { status: 500 });
    }
}
