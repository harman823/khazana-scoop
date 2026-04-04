import { Request, Response } from 'express';
import { verifyPayment } from '../services/payment.service';

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId) {
      res.status(400).json({ success: false, message: 'Missing orderId' });
      return;
    }

    const webhookId = req.headers['x-razorpay-signature'] as string || undefined;
    const result = await verifyPayment(orderId, razorpayPaymentId, razorpaySignature, webhookId);

    res.status(200).json({
      success: true,
      message: result.alreadyVerified
        ? result.confirmationEmailSent
          ? 'Payment was already verified and the booking email has already been sent.'
          : 'Payment was already verified, but the booking email could not be confirmed.'
        : result.confirmationEmailSent
          ? 'Payment verified successfully and the booking email has been sent.'
          : 'Payment verified successfully, but the booking email could not be confirmed.',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in verifyPayment controller:', error);

    if (error.message === 'Payment order not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }

    if (
      error.message === 'Missing Razorpay payment verification fields' ||
      error.message === 'Invalid Razorpay signature'
    ) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment',
    });
  }
};
