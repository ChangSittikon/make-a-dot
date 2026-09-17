const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const node = await prisma.node.findFirst({
    where: { question: 'คุณต้องการอะไร?' },
    include: { options: true }
  });
  console.log(JSON.stringify(node, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
