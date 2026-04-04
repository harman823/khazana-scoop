import { Request, Response } from 'express';
import { cancelBookingSchema, rescheduleBookingSchema } from '../validations/modification.validation';
import { cancelBooking, rescheduleBooking } from '../services/modification.service';

export const handleCancel = async (req: Request, res: Response) => {
  try {
    const parsed = cancelBookingSchema.safeParse(req);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.flatten() });
      return;
    }

    const { bookingId } = parsed.data.body;
    const result = await cancelBooking(bookingId);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    console.error('Cancellation error:', error);
    res.status(error.message.includes('not found') ? 404 : 400).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
};

export const handleReschedule = async (req: Request, res: Response) => {
  try {
    const parsed = rescheduleBookingSchema.safeParse(req);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid payload', errors: parsed.error.flatten() });
      return;
    }

    const { bookingId, newBookingDateTime } = parsed.data.body;
    const result = await rescheduleBooking(bookingId, newBookingDateTime);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Booking rescheduled successfully'
    });
  } catch (error: any) {
    console.error('Reschedule error:', error);
    res.status(error.message.includes('not found') ? 404 : 409).json({
      success: false,
      message: error.message || 'Failed to reschedule booking'
    });
  }
};
