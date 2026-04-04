import { Router } from 'express';
import { handleCancel, handleReschedule } from '../controllers/modification.controller';

const router = Router();

router.post('/cancel', (req, res) => { handleCancel(req, res); });
router.post('/reschedule', (req, res) => { handleReschedule(req, res); });

export default router;
