const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const startNodeId = "cmt7hp42w000fvi7ogzq90wd5";
  
  // Update order of existing options
  await prisma.option.updateMany({
    where: { nodeId: startNodeId, label: 'หารายได้เสริม' },
    data: { order: 2 }
  });
  await prisma.option.updateMany({
    where: { nodeId: startNodeId, label: 'หาคน/แนวร่วมทำโปรเจกต์' },
    data: { order: 3 }
  });
  await prisma.option.updateMany({
    where: { nodeId: startNodeId, label: 'หาทรัพยากร/นายทุน' },
    data: { order: 4 }
  });

  // Check if new options exist
  const existing1 = await prisma.option.findFirst({ where: { nodeId: startNodeId, label: 'ฉันมีปัญหาต้องการทางแก้' } });
  if (!existing1) {
    await prisma.option.create({
      data: {
        nodeId: startNodeId,
        label: 'ฉันมีปัญหาต้องการทางแก้',
        targetNodeId: null, // End node from Flow's perspective, but JS will navigate
        vectorWeight: JSON.stringify({ url: '/profile/bounty/create' }),
        order: 0
      }
    });
  } else {
    await prisma.option.update({
      where: { id: existing1.id },
      data: {
        targetNodeId: null,
        vectorWeight: JSON.stringify({ url: '/profile/bounty/create' }),
        order: 0
      }
    })
  }

  const existing2 = await prisma.option.findFirst({ where: { nodeId: startNodeId, label: 'ฉันแก้ปัญหาได้คุณตอบแทนฉันยังไงละ' } });
  if (!existing2) {
    await prisma.option.create({
      data: {
        nodeId: startNodeId,
        label: 'ฉันแก้ปัญหาได้คุณตอบแทนฉันยังไงละ',
        targetNodeId: null,
        vectorWeight: JSON.stringify({ url: '/profile/bounty' }),
        order: 1
      }
    });
  } else {
    await prisma.option.update({
      where: { id: existing2.id },
      data: {
        targetNodeId: null,
        vectorWeight: JSON.stringify({ url: '/profile/bounty' }),
        order: 1
      }
    })
  }

  console.log("Database updated successfully");
}
main().catch(console.error).finally(() => prisma.$disconnect());
