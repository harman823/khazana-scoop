import { Request, Response } from 'express';
import { getDashboardAnalytics } from '../services/analytics.service';

export const handleGetAnalytics = async (req: Request, res: Response) => {
  try {
    const data = await getDashboardAnalytics();
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate analytics'
    });
  }
};
