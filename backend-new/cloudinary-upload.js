const cloudinary = require('cloudinary').v2;

// Configure Cloudinary - gọi khi được import
const configCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Missing Cloudinary config:');
    console.error('   CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    console.error('   CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '***' : 'missing');
    console.error('   CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***' : 'missing');
  }
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  console.log('✅ Cloudinary configured with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);
};

// Call config immediately
configCloudinary();

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} filename - Original filename
 * @param {string} resourceType - Resource type: 'image', 'video', or 'auto' (default: 'auto')
 * @returns {Promise<Object>} Upload result with secure_url
 */
async function uploadToCloudinary(fileBuffer, filename, resourceType = 'auto') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: filename.split('.')[0], // Remove extension for public_id
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Write file buffer to stream
    stream.end(fileBuffer);
  });
}

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file in Cloudinary
 * @param {string} resourceType - Resource type: 'image' or 'video'
 * @returns {Promise<Object>} Deletion result
 */
async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary,
};
