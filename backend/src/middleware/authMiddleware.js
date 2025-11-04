import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import prisma from '../prisma/client.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        skillsOffered: true,
        skillsWanted: true,
        rating: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

// Optional auth middleware (doesn't throw error if no token)
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatarUrl: true,
          skillsOffered: true,
          skillsWanted: true,
          rating: true,
          isVerified: true,
        },
      });

      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silent fail for optional auth
  }

  next();
};
