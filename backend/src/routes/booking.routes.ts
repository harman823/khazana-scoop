import { Router } from 'express';
import { initiateBooking } from '../controllers/booking.controller';

const router = Router();

// POST /api/v1/bookings/initiate
router.post('/initiate', (req, res) => {
  initiateBooking(req, res);
});

export default router;
