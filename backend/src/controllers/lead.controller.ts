import { Request, Response } from 'express';
import { createLeadSchema } from '../validations/lead.validation';
import { captureLead } from '../services/lead.service';

export const handleCaptureLead = async (req: Request, res: Response) => {
  try {
    const parsed = createLeadSchema.safeParse(req);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.flatten() });
      return;
    }

    const result = await captureLead(parsed.data.body);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Lead captured successfully'
    });
  } catch (error: any) {
    console.error('Lead capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture lead'
    });
  }
};
