const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { getAllowedOrigins, hasCloudinaryCredentials, validateEnvironment } = require('./config/env');
const { log } = require('./config/logger');
const { seedAdminUser } = require('./controllers/authController');

const app = express();
let initializationPromise;

const initializeApplication = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      validateEnvironment();
      await connectDB();
      await seedAdminUser();
      log('info', 'application_initialized', {
        environment: process.env.NODE_ENV || 'development',
        cloudinaryConfigured: hasCloudinaryCredentials()
      });
    })().catch((error) => {
      initializationPromise = undefined;
      throw error;
    });
  }

  return initializationPromise;
};

app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  const startedAt = Date.now();

  res.on('finish', () => {
    log(res.statusCode >= 500 ? 'error' : 'info', 'request_completed', {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt
    });
  });

  next();
});

app.use(async (req, res, next) => {
  try {
    await initializeApplication();
    next();
  } catch (error) {
    next(error);
  }
});

const allowedOrigins = getAllowedOrigins();
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    const error = new Error(`CORS rejected origin: ${origin}`);
    error.status = 403;
    return callback(error);
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/newspapers', require('./routes/newspaperRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Magranchal Khoj Khabar API',
    time: new Date().toISOString(),
    services: {
      database: 'connected',
      cloudinary: hasCloudinaryCredentials() ? 'configured' : 'not_configured'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', requestId: req.requestId });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  log('error', 'request_failed', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code: err.code,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
  res.status(statusCode).json({
    message: statusCode >= 500 ? 'Internal Server Error' : err.message,
    requestId: req.requestId
  });
});

process.on('unhandledRejection', (error) => log('error', 'unhandled_rejection', { message: error.message, stack: error.stack }));
process.on('uncaughtException', (error) => log('error', 'uncaught_exception', { message: error.message, stack: error.stack }));

if (require.main === module) {
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => log('info', 'server_listening', { port, environment: process.env.NODE_ENV || 'development' }));
}

module.exports = app;
