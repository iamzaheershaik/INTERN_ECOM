export class AppError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }
}

// Global error handler middleware — single place for logging + response
const errorHandler = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      issue: e.message,
    }));
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details },
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: { code: 'DUPLICATE', message: `${field} already exists` },
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: { code: 'INVALID_ID', message: 'Invalid resource ID' },
    });
  }

  // Our own AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  // Unknown / programmer error — don't leak internals
  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({
    error: { code: 'SERVER_ERROR', message: 'Something went wrong' },
  });
};

export default errorHandler;
