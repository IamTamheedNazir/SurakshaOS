const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configure multer storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * File filter function
 */
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
  
  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX are allowed.'));
  }
};

/**
 * Image file filter
 */
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WEBP) are allowed.'));
  }
};

/**
 * Document file filter
 */
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|xls|xlsx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /pdf|msword|vnd.openxmlformats|vnd.ms-excel/.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only documents (PDF, DOC, DOCX, XLS, XLSX) are allowed.'));
  }
};

/**
 * Default upload configuration
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

/**
 * Image upload configuration
 */
const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB for images
  },
  fileFilter: imageFilter
});

/**
 * Document upload configuration
 */
const uploadDocument = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB for documents
  },
  fileFilter: documentFilter
});

/**
 * Large file upload configuration
 */
const uploadLargeFile = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB for large files
  },
  fileFilter: fileFilter
});

/**
 * Error handling middleware for multer
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size allowed is ' + (err.limits.fileSize / (1024 * 1024)) + 'MB'
      });
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum ' + err.limits.files + ' files allowed'
      });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field: ' + err.field
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

/**
 * Clean up temp files after upload
 */
const cleanupTempFiles = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Clean up uploaded files
    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (error) {
        console.error('Error cleaning up temp file:', error);
      }
    }
    
    if (req.files) {
      const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      
      files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (error) {
          console.error('Error cleaning up temp file:', error);
        }
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Validate file size before upload
 */
const validateFileSize = (maxSize) => {
  return (req, res, next) => {
    if (req.headers['content-length']) {
      const contentLength = parseInt(req.headers['content-length']);
      
      if (contentLength > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File too large. Maximum size allowed is ${maxSize / (1024 * 1024)}MB`
        });
      }
    }
    
    next();
  };
};

/**
 * Validate file type
 */
const validateFileType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }
    
    const files = req.file ? [req.file] : (Array.isArray(req.files) ? req.files : Object.values(req.files).flat());
    
    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      
      if (!allowedTypes.includes(ext)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        });
      }
    }
    
    next();
  };
};

module.exports = {
  upload,
  uploadImage,
  uploadDocument,
  uploadLargeFile,
  handleMulterError,
  cleanupTempFiles,
  validateFileSize,
  validateFileType
};
