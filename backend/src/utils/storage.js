const AWS = require('aws-sdk');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

/**
 * Get default storage settings
 */
const getStorageSettings = async () => {
  const [settings] = await db.query(
    'SELECT * FROM storage_settings WHERE is_default = true AND enabled = true LIMIT 1'
  );
  return settings[0] || null;
};

/**
 * Upload to AWS S3
 */
const uploadToS3 = async (file, settings) => {
  const s3 = new AWS.S3({
    accessKeyId: settings.access_key,
    secretAccessKey: settings.secret_key,
    region: settings.region
  });
  
  const fileContent = fs.readFileSync(file.path);
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  
  const params = {
    Bucket: settings.bucket_name,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  
  // Delete temp file
  fs.unlinkSync(file.path);
  
  return {
    url: result.Location,
    key: result.Key,
    provider: 'aws_s3'
  };
};

/**
 * Upload to Wasabi
 */
const uploadToWasabi = async (file, settings) => {
  const s3 = new AWS.S3({
    accessKeyId: settings.access_key,
    secretAccessKey: settings.secret_key,
    endpoint: settings.endpoint || `s3.${settings.region}.wasabisys.com`,
    region: settings.region,
    s3ForcePathStyle: true
  });
  
  const fileContent = fs.readFileSync(file.path);
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  
  const params = {
    Bucket: settings.bucket_name,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  
  // Delete temp file
  fs.unlinkSync(file.path);
  
  return {
    url: `https://${settings.bucket_name}.s3.${settings.region}.wasabisys.com/${fileName}`,
    key: result.Key,
    provider: 'wasabi'
  };
};

/**
 * Upload to Cloudinary
 */
const uploadToCloudinary = async (file, settings) => {
  const config = JSON.parse(settings.config || '{}');
  
  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: settings.access_key,
    api_secret: settings.secret_key
  });
  
  const result = await cloudinary.uploader.upload(file.path, {
    folder: config.folder || 'umrahconnect',
    resource_type: 'auto'
  });
  
  // Delete temp file
  fs.unlinkSync(file.path);
  
  return {
    url: result.secure_url,
    key: result.public_id,
    provider: 'cloudinary'
  };
};

/**
 * Upload to DigitalOcean Spaces
 */
const uploadToDigitalOceanSpaces = async (file, settings) => {
  const spacesEndpoint = new AWS.Endpoint(settings.endpoint);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: settings.access_key,
    secretAccessKey: settings.secret_key
  });
  
  const fileContent = fs.readFileSync(file.path);
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  
  const params = {
    Bucket: settings.bucket_name,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  
  // Delete temp file
  fs.unlinkSync(file.path);
  
  return {
    url: `https://${settings.bucket_name}.${settings.region}.digitaloceanspaces.com/${fileName}`,
    key: result.Key,
    provider: 'digitalocean_spaces'
  };
};

/**
 * Upload to local storage
 */
const uploadToLocal = async (file) => {
  const uploadDir = path.join(__dirname, '../../uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const filePath = path.join(uploadDir, fileName);
  
  // Move file to uploads directory
  fs.renameSync(file.path, filePath);
  
  return {
    url: `/uploads/${fileName}`,
    key: fileName,
    provider: 'local'
  };
};

/**
 * Upload file to storage
 * @param {Object} file - Multer file object
 * @param {Object} options - Upload options
 */
const uploadToStorage = async (file, options = {}) => {
  try {
    // Get storage settings
    const settings = await getStorageSettings();
    
    if (!settings) {
      // Fallback to local storage
      return await uploadToLocal(file);
    }
    
    // Upload based on provider
    let result;
    
    switch (settings.provider) {
      case 'aws_s3':
        result = await uploadToS3(file, settings);
        break;
        
      case 'wasabi':
        result = await uploadToWasabi(file, settings);
        break;
        
      case 'cloudinary':
        result = await uploadToCloudinary(file, settings);
        break;
        
      case 'digitalocean_spaces':
        result = await uploadToDigitalOceanSpaces(file, settings);
        break;
        
      case 'local':
      default:
        result = await uploadToLocal(file);
        break;
    }
    
    console.log('File uploaded:', result.url);
    
    return result;
    
  } catch (error) {
    console.error('Upload to storage error:', error);
    
    // Fallback to local storage on error
    try {
      return await uploadToLocal(file);
    } catch (localError) {
      throw error;
    }
  }
};

/**
 * Upload multiple files
 */
const uploadMultipleFiles = async (files, options = {}) => {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await uploadToStorage(file, options);
      results.push({
        success: true,
        ...result
      });
    } catch (error) {
      results.push({
        success: false,
        filename: file.originalname,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Delete file from storage
 */
const deleteFromStorage = async (fileKey, provider) => {
  try {
    const [settings] = await db.query(
      'SELECT * FROM storage_settings WHERE provider = ? AND enabled = true',
      [provider]
    );
    
    if (settings.length === 0) {
      throw new Error('Storage settings not found');
    }
    
    const setting = settings[0];
    
    switch (provider) {
      case 'aws_s3':
      case 'wasabi':
        const s3 = new AWS.S3({
          accessKeyId: setting.access_key,
          secretAccessKey: setting.secret_key,
          region: setting.region,
          ...(provider === 'wasabi' && {
            endpoint: setting.endpoint || `s3.${setting.region}.wasabisys.com`,
            s3ForcePathStyle: true
          })
        });
        
        await s3.deleteObject({
          Bucket: setting.bucket_name,
          Key: fileKey
        }).promise();
        break;
        
      case 'cloudinary':
        const config = JSON.parse(setting.config || '{}');
        cloudinary.config({
          cloud_name: config.cloud_name,
          api_key: setting.access_key,
          api_secret: setting.secret_key
        });
        
        await cloudinary.uploader.destroy(fileKey);
        break;
        
      case 'local':
        const filePath = path.join(__dirname, '../../uploads', fileKey);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        break;
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Delete from storage error:', error);
    throw error;
  }
};

/**
 * Test storage connection
 */
const testStorageConnection = async (provider, credentials) => {
  try {
    switch (provider) {
      case 'aws_s3':
        const s3 = new AWS.S3({
          accessKeyId: credentials.access_key,
          secretAccessKey: credentials.secret_key,
          region: credentials.region
        });
        
        await s3.listBuckets().promise();
        return { success: true, message: 'AWS S3 connection successful' };
        
      case 'wasabi':
        const wasabi = new AWS.S3({
          accessKeyId: credentials.access_key,
          secretAccessKey: credentials.secret_key,
          endpoint: credentials.endpoint || `s3.${credentials.region}.wasabisys.com`,
          region: credentials.region,
          s3ForcePathStyle: true
        });
        
        await wasabi.listBuckets().promise();
        return { success: true, message: 'Wasabi connection successful' };
        
      case 'cloudinary':
        cloudinary.config({
          cloud_name: credentials.cloud_name,
          api_key: credentials.api_key,
          api_secret: credentials.api_secret
        });
        
        await cloudinary.api.ping();
        return { success: true, message: 'Cloudinary connection successful' };
        
      default:
        return { success: false, message: 'Unsupported provider' };
    }
  } catch (error) {
    throw new Error(`Connection test failed: ${error.message}`);
  }
};

/**
 * Get file URL
 */
const getFileUrl = (fileKey, provider) => {
  if (provider === 'local') {
    return `${process.env.API_URL}/uploads/${fileKey}`;
  }
  return fileKey; // For cloud providers, fileKey is already the full URL
};

module.exports = {
  uploadToStorage,
  uploadMultipleFiles,
  deleteFromStorage,
  testStorageConnection,
  getFileUrl
};
