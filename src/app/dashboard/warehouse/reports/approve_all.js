const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      approvalStatus: 'APPROVED'
    }
  });
  console.log(`Successfully approved ${result.count} users.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
