import { Router } from 'express';
import { handleGetAnalytics } from '../controllers/analytics.controller';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Apply static admin key block
router.use(adminMiddleware);

router.get('/dashboard', (req, res) => { handleGetAnalytics(req, res); });

export default router;
