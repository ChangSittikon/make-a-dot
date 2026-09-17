const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.problemNode.findMany({where: {status: 'OPEN'}});
  console.log(count);
}
main().finally(() => prisma.$disconnect());
