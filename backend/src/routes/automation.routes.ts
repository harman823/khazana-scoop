import { Router } from 'express';
import { handleAutomationStatus, handleOrderThankYouWebhook, handlePollInventory } from '../controllers/automation.controller';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

router.post('/orders/thank-you', handleOrderThankYouWebhook);
router.get('/status', adminMiddleware, (req, res) => { handleAutomationStatus(req, res); });
router.post('/inventory/poll', adminMiddleware, (req, res) => { handlePollInventory(req, res); });

export default router;

