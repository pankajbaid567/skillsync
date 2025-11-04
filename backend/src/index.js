import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSocketIO } from './services/chat.service.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const httpServer = createServer(app);

// Initialize logger
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

// Middleware
app.use(helmet());

// CORS configuration - allow multiple origins
let allowedOrigins = [];

if (process.env.NODE_ENV === 'production') {
  // In production, allow both local dev and production frontend
  allowedOrigins = [
    'http://localhost:5173',
    'https://skillsync-green.vercel.app',
  ];
  // Also add custom CORS_ORIGIN if provided
  if (process.env.CORS_ORIGIN) {
    allowedOrigins = [...allowedOrigins, ...process.env.CORS_ORIGIN.split(',')];
  }
} else {
  // In development, use CORS_ORIGIN or default to localhost
  allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173'];
}

logger.info(`🔐 CORS allowed origins: ${allowedOrigins.join(', ')}`);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        logger.warn(`❌ CORS blocked origin: ${origin}`);
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SkillSync API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

// Setup Socket.IO with same CORS policy
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

setupSocketIO(io);

// Start server
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔌 Socket.IO ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export { app, io, logger };
