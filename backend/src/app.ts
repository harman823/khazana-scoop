import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';

const allowedOrigins = env.FRONTEND_URL
  ? env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : null;
const apiBasePaths = ['/api/v1', '/v1'];

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!allowedOrigins || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Friendly root route for local development
app.get(['/', '/api'], (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Kosmic Align API',
    status: 'running',
    health: '/health',
    apiBase: '/api/v1',
    frontendDev: 'http://localhost:5173',
  });
});

// Avoid noisy 404s from browser favicon requests during API development
app.get(['/favicon.ico', '/api/favicon.ico'], (req: Request, res: Response) => {
  res.status(204).end();
});

import router from './routes';

// V1 API Routes
for (const basePath of apiBasePaths) {
  app.use(basePath, router);
}

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
