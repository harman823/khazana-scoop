import { Router } from 'express';
import { handleCaptureLead } from '../controllers/lead.controller';

const router = Router();

router.post('/callback', (req, res) => { handleCaptureLead(req, res); });

export default router;
