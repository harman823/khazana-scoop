import { prisma } from '../lib/prisma';
import { defaultServices } from '../data/default-services';

const ensureDefaultServices = async () => {
  const serviceCount = await prisma.service.count();

  if (serviceCount > 0) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const currentCount = await tx.service.count();

    if (currentCount > 0) {
      return;
    }

    for (const service of defaultServices) {
      await tx.service.upsert({
        where: { slug: service.slug },
        update: {},
        create: service,
      });
    }
  });
};

export const findAllServices = async () => {
  await ensureDefaultServices();

  return prisma.service.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const findServiceBySlug = async (slug: string) => {
  await ensureDefaultServices();

  return prisma.service.findUnique({
    where: { slug },
  });
};
