const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const nodes = await prisma.node.findMany({
    include: {
      options: true
    }
  });
  console.log(JSON.stringify(nodes, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
