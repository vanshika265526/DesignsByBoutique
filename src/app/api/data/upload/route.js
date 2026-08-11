import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename and create unique timestamp
        const ext = path.extname(file.name) || '.png';
        const sanitizedBaseName = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const fileName = `${sanitizedBaseName}-${Date.now()}${ext}`;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/uploads/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
