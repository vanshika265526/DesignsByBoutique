// Always run on request - never let Next cache this handler's response.
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import path from 'path';
import { uploadToCloudinary } from '@/lib/cloudinary';


export const runtime = 'nodejs';

// Max upload size — Cloudinary free tier handles up to 10MB per upload.
const MAX_BYTES = 10 * 1024 * 1024;

// Uploads are sent directly to Cloudinary. The returned secure_url is stored
// on product/gallery records in MongoDB and served from Cloudinary's CDN.
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

        // Build a clean public_id from the original filename
        const base = path
            .basename(file.name || 'image', path.extname(file.name || ''))
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'image';
        const publicId = `${base}-${Date.now()}`;

        const result = await uploadToCloudinary(buffer, {
            public_id: publicId,
            overwrite: false,
        });

        // Return the Cloudinary CDN URL directly — no proxy route needed.
        return NextResponse.json({
            success: true,
            url: result.secure_url,
            fileName: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
