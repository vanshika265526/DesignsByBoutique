import { NextResponse } from 'next/server';
import path from 'path';
import { getDatabase } from '@/lib/mongodb';

export const runtime = 'nodejs';

// Max upload size (Atlas BSON document limit is 16MB; keep well under it).
const MAX_BYTES = 8 * 1024 * 1024;

// Uploads are stored in MongoDB Atlas (not the local filesystem) because
// Vercel's serverless filesystem is read-only/ephemeral. They are served back
// by GET /api/uploads/[id].
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file.arrayBuffer !== 'function') {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const contentType = file.type || 'application/octet-stream';
        if (!contentType.startsWith('image/')) {
            return NextResponse.json({ success: false, error: 'Only image files are allowed.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (buffer.length === 0) {
            return NextResponse.json({ success: false, error: 'Empty file.' }, { status: 400 });
        }
        if (buffer.length > MAX_BYTES) {
            return NextResponse.json(
                { success: false, error: `File too large. Max ${Math.round(MAX_BYTES / 1024 / 1024)}MB.` },
                { status: 413 }
            );
        }

        const ext = (path.extname(file.name || '') || '.png').toLowerCase();
        const base = path
            .basename(file.name || 'image', path.extname(file.name || ''))
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'image';
        const id = `${base}-${Date.now()}${ext}`;

        const db = await getDatabase();
        await db.collection('uploads').insertOne({
            _id: id,
            filename: file.name || id,
            contentType,
            size: buffer.length,
            data: buffer, // stored as BSON binary
            createdAt: new Date(),
        });

        // Served by the GET route below.
        return NextResponse.json({ success: true, url: `/api/uploads/${id}`, fileName: id });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
