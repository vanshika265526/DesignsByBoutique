// Always run on request - never let Next cache this handler's response.
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import path from 'path';
import { uploadToCloudinary } from '@/lib/cloudinary';


export const runtime = 'nodejs';

// Max upload size — 50MB for video and image media.
const MAX_BYTES = 50 * 1024 * 1024;

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
        const isImage = contentType.startsWith('image/');
        const isVideo = contentType.startsWith('video/');

        if (!isImage && !isVideo) {
            return NextResponse.json({ success: false, error: 'Only image and video files are allowed.' }, { status: 400 });
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
            .basename(file.name || (isVideo ? 'video' : 'image'), path.extname(file.name || ''))
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || (isVideo ? 'video' : 'image');
        const publicId = `${base}-${Date.now()}`;

        const result = await uploadToCloudinary(buffer, {
            public_id: publicId,
            resource_type: isVideo ? 'video' : 'auto',
            overwrite: false,
        });

        const detectedMediaType = result.resource_type === 'video' || isVideo ? 'video' : 'image';

        // Return the Cloudinary CDN URL directly — no proxy route needed.
        return NextResponse.json({
            success: true,
            url: result.secure_url,
            fileName: result.public_id,
            mediaType: detectedMediaType,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
