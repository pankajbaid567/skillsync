import { logger } from '../index.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Unauthorized';
  }

  if (err.code === 'P2002') {
    // Prisma unique constraint violation
    status = 409;
    message = 'Resource already exists';
  }

  if (err.code === 'P2025') {
    // Prisma record not found
    status = 404;
    message = 'Resource not found';
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}
