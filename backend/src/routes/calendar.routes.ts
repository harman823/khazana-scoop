import { Router } from 'express';
import { getMonthlyDays, getDaySlots, getOAuthUrl, handleOAuthCallback } from '../controllers/calendar.controller';

const router = Router();

// Public endpoints
router.get('/days',              getMonthlyDays);
router.get('/slots',             getDaySlots);

// OAuth admin endpoints (should be protected in production)
router.get('/oauth/url',         getOAuthUrl);
router.get('/oauth/callback',    handleOAuthCallback);

export default router;
