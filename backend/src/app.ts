import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Friendly root route for local development
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    name: 'Kosmic Align API',
    status: 'running',
    health: '/health',
    apiBase: '/api/v1',
    frontendDev: 'http://localhost:5173',
  });
});

// Avoid noisy 404s from browser favicon requests during API development
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

import router from './routes';

// V1 API Routes
app.use('/api/v1', router);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
