const AWS = require('aws-sdk');
require('dotenv').config();

/**
 * Wasabi S3 Configuration
 * Wasabi is S3-compatible storage with better pricing
 * 
 * Endpoints by region:
 * - us-east-1: https://s3.wasabisys.com
 * - us-east-2: https://s3.us-east-2.wasabisys.com
 * - us-west-1: https://s3.us-west-1.wasabisys.com
 * - eu-central-1: https://s3.eu-central-1.wasabisys.com
 * - ap-northeast-1: https://s3.ap-northeast-1.wasabisys.com
 */

// Configure Wasabi S3
const wasabiS3 = new AWS.S3({
  endpoint: process.env.WASABI_ENDPOINT || 'https://s3.wasabisys.com',
  region: process.env.WASABI_REGION || 'us-east-1',
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true, // Required for Wasabi
  signatureVersion: 'v4',
});

// Bucket name
const bucketName = process.env.WASABI_BUCKET_NAME || 'umrahconnect-storage';

// S3 Folder structure
const folders = {
  users: process.env.S3_FOLDER_USERS || 'users',
  vendors: process.env.S3_FOLDER_VENDORS || 'vendors',
  packages: process.env.S3_FOLDER_PACKAGES || 'packages',
  documents: process.env.S3_FOLDER_DOCUMENTS || 'documents',
  reports: process.env.S3_FOLDER_REPORTS || 'reports',
  invoices: process.env.S3_FOLDER_INVOICES || 'invoices',
};

/**
 * Upload file to Wasabi S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} folder - Folder name (users, vendors, packages, etc.)
 * @param {string} contentType - MIME type
 * @returns {Promise<Object>} Upload result with URL
 */
const uploadFile = async (fileBuffer, fileName, folder, contentType) => {
  try {
    const key = `${folders[folder]}/${Date.now()}-${fileName}`;
    
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Make file publicly accessible
    };

    const result = await wasabiS3.upload(params).promise();
    
    return {
      success: true,
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
    };
  } catch (error) {
    console.error('Wasabi S3 Upload Error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Delete file from Wasabi S3
 * @param {string} key - File key/path
 * @returns {Promise<Object>} Delete result
 */
const deleteFile = async (key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    await wasabiS3.deleteObject(params).promise();
    
    return {
      success: true,
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error('Wasabi S3 Delete Error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Get signed URL for private file access
 * @param {string} key - File key/path
 * @param {number} expiresIn - URL expiry time in seconds (default: 3600)
 * @returns {Promise<string>} Signed URL
 */
const getSignedUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn,
    };

    const url = await wasabiS3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('Wasabi S3 Signed URL Error:', error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};

/**
 * List files in a folder
 * @param {string} folder - Folder name
 * @param {number} maxKeys - Maximum number of files to return
 * @returns {Promise<Array>} List of files
 */
const listFiles = async (folder, maxKeys = 1000) => {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: `${folders[folder]}/`,
      MaxKeys: maxKeys,
    };

    const result = await wasabiS3.listObjectsV2(params).promise();
    
    return {
      success: true,
      files: result.Contents.map(file => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        url: `${process.env.WASABI_ENDPOINT}/${bucketName}/${file.Key}`,
      })),
      count: result.Contents.length,
    };
  } catch (error) {
    console.error('Wasabi S3 List Files Error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

/**
 * Check if bucket exists, create if not
 * @returns {Promise<boolean>}
 */
const ensureBucketExists = async () => {
  try {
    await wasabiS3.headBucket({ Bucket: bucketName }).promise();
    console.log(`✓ Wasabi bucket "${bucketName}" exists`);
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`Creating Wasabi bucket "${bucketName}"...`);
      await wasabiS3.createBucket({ Bucket: bucketName }).promise();
      console.log(`✓ Wasabi bucket "${bucketName}" created`);
      return true;
    }
    throw error;
  }
};

/**
 * Get file metadata
 * @param {string} key - File key/path
 * @returns {Promise<Object>} File metadata
 */
const getFileMetadata = async (key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const result = await wasabiS3.headObject(params).promise();
    
    return {
      success: true,
      metadata: {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        lastModified: result.LastModified,
        etag: result.ETag,
      },
    };
  } catch (error) {
    console.error('Wasabi S3 Metadata Error:', error);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

/**
 * Copy file within bucket
 * @param {string} sourceKey - Source file key
 * @param {string} destinationKey - Destination file key
 * @returns {Promise<Object>} Copy result
 */
const copyFile = async (sourceKey, destinationKey) => {
  try {
    const params = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourceKey}`,
      Key: destinationKey,
    };

    await wasabiS3.copyObject(params).promise();
    
    return {
      success: true,
      message: 'File copied successfully',
      url: `${process.env.WASABI_ENDPOINT}/${bucketName}/${destinationKey}`,
    };
  } catch (error) {
    console.error('Wasabi S3 Copy Error:', error);
    throw new Error(`Failed to copy file: ${error.message}`);
  }
};

module.exports = {
  wasabiS3,
  bucketName,
  folders,
  uploadFile,
  deleteFile,
  getSignedUrl,
  listFiles,
  ensureBucketExists,
  getFileMetadata,
  copyFile,
};
