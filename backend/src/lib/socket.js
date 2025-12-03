import { Server } from 'socket.io';
import { logger } from '../index.js';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

let io;

export const initSocket = (httpServer, allowedOrigins) => {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });

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

        // Join a room specific to the user for personal notifications
        const userRoom = `user:${socket.user.id}`;
        socket.join(userRoom);
        logger.info(`User ${socket.user.id} joined personal room ${userRoom}`);

        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.user.name} (${socket.user.id})`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
