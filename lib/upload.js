import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFileToCloudinary(file) {
  const buffer = await file.arrayBuffer();
  const base64String = Buffer.from(buffer).toString('base64');
  const mimeType = file.type;
  const fileUri = `data:${mimeType};base64,${base64String}`;
  
  const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';

  const result = await cloudinary.uploader.upload(fileUri, {
    resource_type: resourceType,
    public_id: file.name ? file.name.split('.')[0] : `upload_${Date.now()}`,
    overwrite: true,
  });

  return {
    filename: result.public_id,
    originalname: file.name,
    size: file.size,
    url: result.secure_url,
    cloudinaryId: result.public_id,
    resourceType: result.resource_type,
  };
}
