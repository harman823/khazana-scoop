import { findAllServices, findServiceBySlug } from '../repositories/service.repository';
import { defaultServices } from '../data/default-services';

const fallbackServices = defaultServices.map((service) => ({
  ...service,
  id: service.slug,
  sessionMode: String(service.sessionMode),
}));

export const getAllServices = async () => {
  try {
    return await findAllServices();
  } catch {
    return fallbackServices;
  }
};

export const getServiceDetails = async (slug: string) => {
  let service = await findServiceBySlug(slug);
  
  if (!service) {
    service = fallbackServices.find((fallbackService) => fallbackService.slug === slug) as any;
  }

  if (!service) {
    throw new Error('Service not found');
  }
  
  return service;
};
