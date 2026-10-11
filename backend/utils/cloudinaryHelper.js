const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const isConfigured = cloudName && cloudName !== 'your_cloudinary_cloud_name';

    if (!isConfigured) {
      // Local file fallback
      try {
        const uploadsFolder = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsFolder)) {
          fs.mkdirSync(uploadsFolder, { recursive: true });
        }

        const extension = options.resource_type === 'raw' || options.format === 'pdf' ? '.pdf' : '.jpg';
        const fileName = `file-${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;
        const filePath = path.join(uploadsFolder, fileName);

        fs.writeFileSync(filePath, fileBuffer);
        const localUrl = `/uploads/${fileName}`;

        console.log(`[Local Upload Fallback] File saved to ${localUrl}`);
        return resolve({
          secure_url: localUrl,
          public_id: fileName,
          bytes: fileBuffer.length
        });
      } catch (err) {
        return reject(err);
      }
    }

    // Direct Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'magranchal_khoj_khabar',
        resource_type: options.resource_type || 'auto',
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (cloudName && cloudName !== 'your_cloudinary_cloud_name' && publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
