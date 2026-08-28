const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');
const { ApiError } = require('./errorMiddleware');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../', env.uploadPath);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `attachment-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        'Invalid file type. Supported types: JPG, PNG, WEBP, GIF, PDF, DOC, DOCX, TXT',
        400,
        'INVALID_FILE_TYPE'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: env.maxFileSize, // 5MB
  },
  fileFilter,
});

module.exports = {
  upload,
};
