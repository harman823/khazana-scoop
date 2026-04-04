import { findAllServices, findServiceBySlug } from '../repositories/service.repository';

export const getAllServices = async () => {
  return findAllServices();
};

export const getServiceDetails = async (slug: string) => {
  const service = await findServiceBySlug(slug);
  
  if (!service) {
    throw new Error('Service not found');
  }
  
  return service;
};
