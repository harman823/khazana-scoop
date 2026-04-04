import { Request, Response } from 'express';
import { registerWebinarSchema } from '../validations/webinar.validation';
import { listWebinars, registerForWebinar } from '../services/webinar.service';

export const handleGetWebinars = async (req: Request, res: Response) => {
  try {
    const data = await listWebinars();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('List webinars error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve webinars' });
  }
};

export const handleRegisterWebinar = async (req: Request, res: Response) => {
  try {
    const parsed = registerWebinarSchema.safeParse(req);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.flatten() });
      return;
    }

    const result = await registerForWebinar(parsed.data.body);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Successfully registered for webinar'
    });
  } catch (error: any) {
    console.error('Register webinar error:', error);
    res.status(404).json({ success: false, message: error.message || 'Registration failed' });
  }
};
