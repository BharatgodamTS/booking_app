import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 [SEED] Starting database seeding...');

  // 1. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bharatgodam.com' },
    update: {},
    create: {
      email: 'admin@bharatgodam.com',
      name: 'Super Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ [SEED] Admin created:', admin.email);

  // 2. Create Test Client
  const clientPassword = await bcrypt.hash('client123', 10);
  const client = await prisma.user.upsert({
    where: { email: 'client@bharatgodam.com' },
    update: {},
    create: {
      email: 'client@bharatgodam.com',
      name: 'Test Client',
      password: clientPassword,
      role: 'CLIENT',
    },
  });
  console.log('✅ [SEED] Client created:', client.email);

  // 3. Create Test Owner (Optional, but helpful for consistency)
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@bharatgodam.com' },
    update: {},
    create: {
      email: 'owner@bharatgodam.com',
      name: 'Test Owner',
      password: ownerPassword,
      role: 'OWNER',
    },
  });
  console.log('✅ [SEED] Owner created:', owner.email);

  console.log('✨ [SEED] Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ [SEED] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
