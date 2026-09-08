const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    console.log('Found users:', users.map(u => u.email));
    await prisma.user.updateMany({
      data: { role: 'ADMIN' }
    });
    console.log('Updated all users to ADMIN.');
  } else {
    console.log('No users found.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
