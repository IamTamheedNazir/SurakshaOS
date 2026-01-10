const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload Service
 * Handles file uploads to AWS S3 or local storage
 */

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const USE_S3 = process.env.USE_S3 === 'true';
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './storage/uploads';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB

/**
 * Configure Multer for file upload
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const uploadType = req.body.uploadType || 'image';
  
  if (uploadType === 'image') {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image type. Only JPEG, PNG, and WebP are allowed.'), false);
    }
  } else if (uploadType === 'document') {
    if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document type.'), false);
    }
  } else {
    cb(new Error('Invalid upload type.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE
  }
});

/**
 * Upload single file
 */
exports.uploadSingle = upload.single('file');

/**
 * Upload multiple files
 */
exports.uploadMultiple = upload.array('files', 10);

/**
 * Process and upload image
 */
exports.uploadImage = async (file, folder = 'general') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid image type');
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error('Image size exceeds limit');
    }

    // Generate unique filename
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filepath = `${folder}/${filename}`;

    // Optimize image
    const optimizedBuffer = await sharp(file.buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Upload to S3 or local storage
    if (USE_S3) {
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: filepath,
        Body: optimizedBuffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      await s3.upload(s3Params).promise();

      return {
        success: true,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${filepath}`,
        filename: filename,
        size: optimizedBuffer.length
      };
    } else {
      // Save to local storage
      const localPath = path.join(UPLOAD_DIR, folder);
      await fs.mkdir(localPath, { recursive: true });
      await fs.writeFile(path.join(localPath, filename), optimizedBuffer);

      return {
        success: true,
        url: `/uploads/${folder}/${filename}`,
        filename: filename,
        size: optimizedBuffer.length
      };
    }
  } catch (error) {
    console.error('Upload image error:', error);
    throw error;
  }
};

/**
 * Upload document
 */
exports.uploadDocument = async (file, folder = 'documents') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid document type');
    }

    // Validate file size
    if (file.size > MAX_DOCUMENT_SIZE) {
      throw new Error('Document size exceeds limit');
    }

    // Generate unique filename
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filepath = `${folder}/${filename}`;

    // Upload to S3 or local storage
    if (USE_S3) {
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: filepath,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private' // Documents are private
      };

      await s3.upload(s3Params).promise();

      return {
        success: true,
        url: filepath, // Store S3 key, generate signed URL when needed
        filename: filename,
        size: file.size,
        originalName: file.originalname
      };
    } else {
      // Save to local storage
      const localPath = path.join(UPLOAD_DIR, folder);
      await fs.mkdir(localPath, { recursive: true });
      await fs.writeFile(path.join(localPath, filename), file.buffer);

      return {
        success: true,
        url: `/uploads/${folder}/${filename}`,
        filename: filename,
        size: file.size,
        originalName: file.originalname
      };
    }
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 */
exports.uploadMultipleImages = async (files, folder = 'general') => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files provided');
    }

    const uploadPromises = files.map(file => exports.uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      files: results
    };
  } catch (error) {
    console.error('Upload multiple images error:', error);
    throw error;
  }
};

/**
 * Delete file
 */
exports.deleteFile = async (fileUrl) => {
  try {
    if (USE_S3) {
      // Extract S3 key from URL
      const key = fileUrl.replace(`https://${S3_BUCKET}.s3.amazonaws.com/`, '');

      await s3.deleteObject({
        Bucket: S3_BUCKET,
        Key: key
      }).promise();
    } else {
      // Delete from local storage
      const localPath = path.join(UPLOAD_DIR, fileUrl.replace('/uploads/', ''));
      await fs.unlink(localPath);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Generate signed URL for private files (S3 only)
 */
exports.getSignedUrl = async (fileKey, expiresIn = 3600) => {
  try {
    if (!USE_S3) {
      throw new Error('Signed URLs are only available for S3 storage');
    }

    const signedUrl = await s3.getSignedUrlPromise('getObject', {
      Bucket: S3_BUCKET,
      Key: fileKey,
      Expires: expiresIn
    });

    return {
      success: true,
      url: signedUrl,
      expiresIn: expiresIn
    };
  } catch (error) {
    console.error('Generate signed URL error:', error);
    throw error;
  }
};

/**
 * Create thumbnail
 */
exports.createThumbnail = async (file, width = 300, height = 300) => {
  try {
    const thumbnailBuffer = await sharp(file.buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return thumbnailBuffer;
  } catch (error) {
    console.error('Create thumbnail error:', error);
    throw error;
  }
};

/**
 * Validate image dimensions
 */
exports.validateImageDimensions = async (file, minWidth, minHeight, maxWidth, maxHeight) => {
  try {
    const metadata = await sharp(file.buffer).metadata();

    if (minWidth && metadata.width < minWidth) {
      throw new Error(`Image width must be at least ${minWidth}px`);
    }

    if (minHeight && metadata.height < minHeight) {
      throw new Error(`Image height must be at least ${minHeight}px`);
    }

    if (maxWidth && metadata.width > maxWidth) {
      throw new Error(`Image width must not exceed ${maxWidth}px`);
    }

    if (maxHeight && metadata.height > maxHeight) {
      throw new Error(`Image height must not exceed ${maxHeight}px`);
    }

    return {
      success: true,
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error('Validate image dimensions error:', error);
    throw error;
  }
};

/**
 * Get file info
 */
exports.getFileInfo = async (fileUrl) => {
  try {
    if (USE_S3) {
      const key = fileUrl.replace(`https://${S3_BUCKET}.s3.amazonaws.com/`, '');

      const headObject = await s3.headObject({
        Bucket: S3_BUCKET,
        Key: key
      }).promise();

      return {
        success: true,
        size: headObject.ContentLength,
        contentType: headObject.ContentType,
        lastModified: headObject.LastModified
      };
    } else {
      const localPath = path.join(UPLOAD_DIR, fileUrl.replace('/uploads/', ''));
      const stats = await fs.stat(localPath);

      return {
        success: true,
        size: stats.size,
        lastModified: stats.mtime
      };
    }
  } catch (error) {
    console.error('Get file info error:', error);
    throw error;
  }
};

module.exports = exports;
