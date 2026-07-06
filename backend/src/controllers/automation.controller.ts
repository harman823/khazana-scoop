import { Request, Response } from 'express';
import { getAutomationStatus, pollLowInventory, processOrderThankYouWebhook } from '../services/automation.service';

export const handleOrderThankYouWebhook = async (req: Request, res: Response) => {
  try {
    const data = await processOrderThankYouWebhook(req.body);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('[LANGGRAPH] order thank-you webhook failed:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to process order thank-you webhook' });
  }
};

export const handlePollInventory = async (req: Request, res: Response) => {
  try {
    const data = await pollLowInventory();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('[LANGGRAPH] inventory poll failed:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to poll inventory' });
  }
};

export const handleAutomationStatus = async (req: Request, res: Response) => {
  try {
    const data = await getAutomationStatus();
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('[LANGGRAPH] status failed:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to load automation status' });
  }
};
