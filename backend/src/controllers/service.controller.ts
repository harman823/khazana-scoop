import { Request, Response } from 'express';
import { getServiceBySlugSchema } from '../validations/service.validation';
import { getAllServices, getServiceDetails } from '../services/service.service';

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await getAllServices();
    
    res.status(200).json({
      success: true,
      data: services,
      message: 'Services retrieved successfully'
    });
  } catch (error: any) {
    console.error('Error in getServices controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve services'
    });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    // Validate request params
    const parsed = getServiceBySlugSchema.safeParse(req);
    
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid input',
        errors: parsed.error.flatten()
      });
      return;
    }

    const { slug } = parsed.data.params;
    const service = await getServiceDetails(slug);
    
    res.status(200).json({
      success: true,
      data: service,
      message: 'Service retrieved successfully'
    });
  } catch (error: any) {
    console.error('Error in getServiceBySlug controller:', error);
    if (error.message === 'Service not found') {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve service'
    });
  }
};
