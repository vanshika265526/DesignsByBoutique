import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload a Buffer or base64 data URI to Cloudinary.
 * Returns the secure_url of the uploaded image.
 */
export async function uploadToCloudinary(buffer, options = {}) {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: 'designs-by-nisha',
            resource_type: 'image',
            ...options,
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
}
