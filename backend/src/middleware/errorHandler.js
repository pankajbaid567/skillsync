import { logger } from '../index.js';

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  logger.error({
    message: err.message,
    status: err.status,
    code: err.code,
    name: err.name,
    path: req.path,
    method: req.method,
  });

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal server error';
  let errors = null;

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    status = 422;
    message = 'Validation failed';
    errors = err.errors.reduce((acc, error) => {
      const field = error.path.join('.');
      if (!acc[field]) acc[field] = [];
      acc[field].push(error.message);
      return acc;
    }, {});
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    // Unique constraint violation
    status = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = field === 'email' 
      ? 'This email is already registered. Please login or use a different email.'
      : `This ${field} already exists.`;
  }

  if (err.code === 'P2025') {
    // Record not found
    status = 404;
    message = 'The requested resource was not found.';
  }

  if (err.code === 'P2003') {
    // Foreign key constraint violation
    status = 400;
    message = 'Invalid reference to related resource.';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid authentication token. Please login again.';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Your session has expired. Please login again.';
  }

  // Don't expose internal errors in production
  if (status === 500 && process.env.NODE_ENV === 'production') {
    message = 'An unexpected error occurred. Please try again later.';
  }

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    }),
  });
};

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}
