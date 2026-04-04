import { Router } from 'express';
import { verifyPaymentController } from '../controllers/payment.controller';

const router = Router();

// POST /api/v1/payments/verify
router.post('/verify', (req, res) => {
  verifyPaymentController(req, res);
});

export default router;
