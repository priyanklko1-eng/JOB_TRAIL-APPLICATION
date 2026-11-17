import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import applicationRouter from './routes/application.routes.js';

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json());

// 2. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 3. Mount Feature Routers
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter);

// 4. Unknown Route (404) Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      details: null,
    },
  });
});

// 5. Central Error Handler (Must have 4 parameters: err, req, res, next)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: err.details || null,
    },
  });
});

export default app;