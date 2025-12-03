import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import { createServer } from 'http';
import { initSocket } from './lib/socket.js';
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
// Configure helmet to not interfere with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

// CORS configuration - allow multiple origins
let allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://skillsync-green.vercel.app',
];

// Add custom CORS_ORIGIN if provided
if (process.env.CORS_ORIGIN) {
  const customOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
  allowedOrigins = [...allowedOrigins, ...customOrigins];
}

// Normalize origins (remove trailing slashes)
allowedOrigins = allowedOrigins.map(origin => origin.replace(/\/$/, ''));

logger.info(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`🔐 CORS allowed origins: ${allowedOrigins.join(', ')}`);

// Simple and robust CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) {
      logger.info('✅ CORS: No origin (allowed)');
      return callback(null, true);
    }

    // Normalize the incoming origin
    const normalizedOrigin = origin.replace(/\/$/, '');

    // Check if origin is allowed
    if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
      logger.info(`✅ CORS: Allowed origin - ${origin}`);
      return callback(null, true);
    }

    logger.warn(`❌ CORS: Blocked origin - ${origin}`);
    logger.warn(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400, // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', cors(corsOptions));

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
const io = initSocket(httpServer, allowedOrigins);

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
