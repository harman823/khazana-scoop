import { Request, Response } from 'express';
import { initiateBookingSchema } from '../validations/booking.validation';
import { createPendingBooking } from '../services/booking.service';

export const initiateBooking = async (req: Request, res: Response) => {
  try {
    const parsed = initiateBookingSchema.safeParse(req);
    
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid booking data',
        errors: parsed.error.flatten()
      });
      return;
    }

    const result = await createPendingBooking(parsed.data.body);

    res.status(201).json({
      success: true,
      message: 'Booking initiated successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Error in initiateBooking controller:', error);
    
    if (
      error.message === 'Slot already booked or pending' ||
      error.message === 'Slot unavailable due to calendar conflict' ||
      error.message === 'Service not found'
    ) {
      res.status(409).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to initiate booking'
    });
  }
};
