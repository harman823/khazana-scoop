import { Router } from 'express';
import serviceRoutes from './service.routes';
// import availabilityRoutes from './availability.routes';
import bookingRoutes from './booking.routes';
import paymentRoutes from './payment.routes';
import modificationRoutes from './modification.routes';
import leadRoutes from './lead.routes';
import webinarRoutes from './webinar.routes';
import analyticsRoutes from './analytics.routes';
import calendarRoutes from './calendar.routes';
import chatRoutes from './chat.routes';

const router = Router();

router.use('/services', serviceRoutes);
// router.use('/availability', availabilityRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/modifications', modificationRoutes);
router.use('/leads', leadRoutes);
router.use('/webinars', webinarRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/calendar', calendarRoutes);
router.use('/chat', chatRoutes);

export default router;
