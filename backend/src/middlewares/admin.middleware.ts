import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['x-admin-key'];

  if (!adminKey || adminKey !== env.ADMIN_KEY) {
    res.status(403).json({ success: false, message: 'Forbidden. Invalid admin key.' });
    return;
  }

  next();
};
