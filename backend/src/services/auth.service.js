import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import { AppError } from '../middleware/errorHandler.js';

const SALT_ROUNDS = 10;

export const authService = {
  /**
   * Register a new user
   */
  async signup(data) {
    const { email, password, name, bio, skillsOffered, skillsWanted } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        bio: bio || null,
        skillsOffered: skillsOffered || [],
        skillsWanted: skillsWanted || [],
      },
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
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = this.generateToken({ id: user.id, email: user.email });

    return { token, user };
  },

  /**
   * Login user
   */
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = this.generateToken({ id: user.id, email: user.email });

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  },

  /**
   * Generate JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  },

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  },
};
