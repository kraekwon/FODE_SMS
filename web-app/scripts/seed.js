const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: { password },
    create: {
      email: 'staff@example.com',
      password,
      name: 'Staff Member',
      role: 'STAFF',
    },
  });

  await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: { password },
    create: {
      email: 'student@example.com',
      password,
      name: 'Test Student',
      role: 'STUDENT',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password },
    create: {
      email: 'admin@example.com',
      password,
      name: 'Back Office Admin',
      role: 'BACK_OFFICE',
    },
  });
  
  console.log('Database seeded with default users.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });