const logger = require('../utils/logger');

// Custom API Error class
class ApiError extends Error {
  constructor(message, statusCode = 500, errorCode = 'SERVER_ERROR', errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'SERVER_ERROR';
  let errors = err.errors || null;

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    errorCode = field === 'email' ? 'DUPLICATE_EMAIL' : 'DUPLICATE_KEY';
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format for ${err.path}`;
    errorCode = 'INVALID_ID';
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation failed';
    errorCode = 'VALIDATION_ERROR';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
    errorCode = 'UNAUTHORIZED';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
    errorCode = 'UNAUTHORIZED';
  }

  // Handle Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large (maximum size 5MB)';
      errorCode = 'FILE_TOO_LARGE';
    } else {
      message = err.message;
      errorCode = 'INVALID_FILE_TYPE';
    }
  }

  if (statusCode >= 500) {
    logger.error(`[500 Server Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    errors,
  });
};

module.exports = {
  ApiError,
  errorHandler,
};
