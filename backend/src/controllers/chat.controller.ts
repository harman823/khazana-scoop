import { Request, Response } from 'express';
import { answerChat } from '../services/chat.service';

export const postChat = async (req: Request, res: Response) => {
  try {
    const message = String(req.body?.message || '').trim();

    if (!message) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    const answer = await answerChat({
      message,
      history: Array.isArray(req.body?.history) ? req.body.history : [],
    });

    res.json({ success: true, data: answer });
  } catch (error) {
    console.error('postChat error:', error);
    res.status(500).json({
      success: false,
      message: 'The assistant could not answer right now. Please try again or contact admin.',
    });
  }
};
