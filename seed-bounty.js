const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found to assign as requester.");
    return;
  }

  const bounty = await prisma.problemNode.create({
    data: {
      rawDescription: 'ต้องการทีมพัฒนา MVP ระบบจองคิว สำหรับร้านอาหาร รองรับ 1000 คิวต่อวัน',
      bountyDescription: 'ต้องการทีมพัฒนา MVP ระบบจองคิว',
      urgencyState: 'HOT_MISSION',
      primaryGap: 'TECHNOLOGY',
      entityType: 'ENTERPRISE',
      status: 'OPEN',
      bountyPrizeSatang: 5000000,
      bountyType: 'CASH',
      requesterId: user.id
    }
  });
  console.log('Seeded bounty:', bounty.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
