import { PrismaClient } from '@prisma/client';
import { defaultServices } from '../src/data/default-services';

const prisma = new PrismaClient();

async function main() {
  for (const s of defaultServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }
  
  console.log('Database seeded with initial services.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
