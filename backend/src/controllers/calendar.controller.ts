import { Request, Response } from 'express';
import {
  exchangeCodeForToken,
  getAvailableSlotsForDay,
  getMonthlyAvailability,
  getOAuthClientUrl,
} from '../services/calendar.service';

export const getMonthlyDays = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string, 10) || new Date().getFullYear();
    const month = parseInt(req.query.month as string, 10) || new Date().getMonth() + 1;
    const serviceId = req.query.serviceId as string | undefined;

    if (month < 1 || month > 12) {
      res.status(400).json({ success: false, message: 'Invalid month (1-12 expected)' });
      return;
    }

    const days = await getMonthlyAvailability(year, month, serviceId);
    res.json({ success: true, data: { year, month, days } });
  } catch (err: any) {
    console.error('getMonthlyDays error:', err);

    if (err.message === 'Service not found') {
      res.status(404).json({ success: false, message: err.message });
      return;
    }

    res.status(500).json({ success: false, message: 'Failed to fetch monthly availability' });
  }
};

export const getDaySlots = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string;
    const serviceId = req.query.serviceId as string | undefined;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ success: false, message: 'date param required in YYYY-MM-DD format' });
      return;
    }

    const slots = await getAvailableSlotsForDay(date, serviceId);
    res.json({ success: true, data: { date, slots } });
  } catch (err: any) {
    console.error('getDaySlots error:', err);

    if (err.message === 'Service not found') {
      res.status(404).json({ success: false, message: err.message });
      return;
    }

    res.status(500).json({ success: false, message: 'Failed to fetch time slots' });
  }
};

export const getOAuthUrl = (_req: Request, res: Response) => {
  try {
    const url = getOAuthClientUrl();
    res.json({ success: true, data: { url } });
  } catch {
    res.status(500).json({ success: false, message: 'OAuth not configured' });
  }
};

export const handleOAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).json({ success: false, message: 'Missing OAuth code' });
      return;
    }

    const tokens = await exchangeCodeForToken(code);
    res.json({ success: true, message: 'Google Calendar connected', data: { tokens } });
  } catch (err: any) {
    console.error('handleOAuthCallback error:', err);
    res.status(500).json({ success: false, message: 'OAuth callback failed' });
  }
};
