import { prisma } from '../lib/prisma';
import { defaultServices } from '../data/default-services';

const ensureDefaultServices = async () => {
  await prisma.$transaction(async (tx) => {
    const activeSlugs = defaultServices.map((service) => service.slug).filter((slug): slug is string => Boolean(slug));

    for (const service of defaultServices) {
      await tx.service.upsert({
        where: { slug: service.slug },
        update: service,
        create: service,
      });
    }

    await tx.service.updateMany({
      where: {
        slug: {
          notIn: activeSlugs,
        },
      },
      data: {
        isActive: false,
      },
    });
  });
};

export const findAllServices = async () => {
  await ensureDefaultServices();

  return prisma.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

export const findServiceBySlug = async (slug: string) => {
  await ensureDefaultServices();

  return prisma.service.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });
};
