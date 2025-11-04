import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import { logger } from '../index.js';

/**
 * Setup Socket.IO for real-time chat
 */
export const setupSocketIO = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      });

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.name} (${socket.user.id})`);

    /**
     * Join a swap room
     */
    socket.on('join', async ({ swapId }) => {
      try {
        // Verify user is part of the swap
        const swap = await prisma.skillSwap.findUnique({
          where: { id: swapId },
        });

        if (!swap) {
          socket.emit('error', { message: 'Swap not found' });
          return;
        }

        if (swap.requesterId !== socket.user.id && swap.receiverId !== socket.user.id) {
          socket.emit('error', { message: 'Unauthorized access to this swap' });
          return;
        }

        const roomName = `swap:${swapId}`;
        socket.join(roomName);
        logger.info(`User ${socket.user.id} joined room ${roomName}`);

        socket.emit('joined', { swapId, room: roomName });

        // Send existing messages
        const messages = await prisma.message.findMany({
          where: { swapId },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        });

        socket.emit('messages', messages);
      } catch (error) {
        logger.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    /**
     * Send a message
     */
    socket.on('message', async ({ swapId, content }) => {
      try {
        // Verify user is part of the swap
        const swap = await prisma.skillSwap.findUnique({
          where: { id: swapId },
        });

        if (!swap) {
          socket.emit('error', { message: 'Swap not found' });
          return;
        }

        if (swap.requesterId !== socket.user.id && swap.receiverId !== socket.user.id) {
          socket.emit('error', { message: 'Unauthorized access to this swap' });
          return;
        }

        // Save message to database
        const message = await prisma.message.create({
          data: {
            swapId,
            senderId: socket.user.id,
            content,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        });

        // Broadcast message to room
        const roomName = `swap:${swapId}`;
        io.to(roomName).emit('message', message);

        logger.info(`Message sent in swap ${swapId} by user ${socket.user.id}`);
      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * Typing indicator
     */
    socket.on('typing', ({ swapId, isTyping }) => {
      const roomName = `swap:${swapId}`;
      socket.to(roomName).emit('typing', {
        userId: socket.user.id,
        userName: socket.user.name,
        isTyping,
      });
    });

    /**
     * Leave a room
     */
    socket.on('leave', ({ swapId }) => {
      const roomName = `swap:${swapId}`;
      socket.leave(roomName);
      logger.info(`User ${socket.user.id} left room ${roomName}`);
    });

    /**
     * Disconnect
     */
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.name} (${socket.user.id})`);
    });
  });

  return io;
};
