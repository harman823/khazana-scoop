import { Router } from 'express';
import { handleGetWebinars, handleRegisterWebinar } from '../controllers/webinar.controller';

const router = Router();

router.get('/', (req, res) => { handleGetWebinars(req, res); });
router.post('/register', (req, res) => { handleRegisterWebinar(req, res); });

export default router;
