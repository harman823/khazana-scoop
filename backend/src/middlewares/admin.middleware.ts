import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['x-admin-key'];
  
  // If no env ADMIN_KEY is set, default to 'kosmicalign_admin_mock' for MVP
  const validKey = process.env.ADMIN_KEY || 'kosmicalign_admin_mock';

  if (!adminKey || adminKey !== validKey) {
    res.status(403).json({ success: false, message: 'Forbidden. Invalid admin key.' });
    return;
  }

  next();
};
