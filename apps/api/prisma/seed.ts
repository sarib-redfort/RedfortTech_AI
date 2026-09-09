import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default users...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const writerPassword = await bcrypt.hash('writer123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@redforai.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@redforai.com',
      password: adminPassword,
      role: Role.Admin,
      status: Status.Active,
    },
  });
  console.log('Admin user created:', admin.email);

  const writer = await prisma.user.upsert({
    where: { email: 'writer@redforai.com' },
    update: {},
    create: {
      name: 'Content Writer',
      email: 'writer@redforai.com',
      password: writerPassword,
      role: Role.ContentWriter,
      status: Status.Active,
    },
  });
  console.log('Content writer created:', writer.email);

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
