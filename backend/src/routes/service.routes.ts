import { Router, Request, Response } from 'express';
import { getServices, getServiceBySlug } from '../controllers/service.controller';

const router = Router();

// GET /api/v1/services
router.get('/', (req: Request, res: Response) => {
  getServices(req, res);
});

// GET /api/v1/services/:slug
router.get('/:slug', (req: Request, res: Response) => {
  getServiceBySlug(req, res);
});

export default router;
