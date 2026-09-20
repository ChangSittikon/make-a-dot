import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const mockUser1 = await prisma.user.upsert({
    where: { id: 'mock-user-1' },
    update: {},
    create: {
      id: 'mock-user-1',
      name: 'สมชาย ครีเอเตอร์',
      email: 'somchai@mock.com',
      role: 'USER',
      trustScore: 10,
    }
  });
  
  const mockUser4 = await prisma.user.upsert({
    where: { id: 'mock-user-4' },
    update: {},
    create: {
      id: 'mock-user-4',
      name: 'ดร. วิทยา ไดเรกเตอร์',
      email: 'wittaya@mock.com',
      role: 'DIRECTOR',
      trustScore: 99,
    }
  });

  const bounty = await prisma.problemNode.findUnique({ where: { id: 'test-id' } });
  
  if (bounty) {
    // Delete existing proposals for test-id to avoid duplicates
    await prisma.upgradeProposal.deleteMany({ where: { bountyId: bounty.id } });

    await prisma.upgradeProposal.createMany({
      data: [
        {
          bountyId: bounty.id,
          proposerId: mockUser1.id,
          vision: "ผมเป็นช่างภาพและนักออกแบบ UI ผมเห็นว่าแอพจองคิวควรมีหน้าตาที่สวยงาม ผมขอเอาแรงเข้าแลก (Sweat Equity) เพื่อช่วยออกแบบ UI ให้โปรเจกต์นี้ครับ",
          proposedRole: "SWEAT_SHARE",
          status: "PENDING"
        },
        {
          bountyId: bounty.id,
          proposerId: mockUser4.id,
          vision: "โครงสร้าง MVP นี้น่าสนใจมาก ผมมีทีมพัฒนาที่เชี่ยวชาญด้าน React/Node.js พร้อมลุยทันที ผมเสนอให้เปลี่ยนเป็น Project เพื่อแบ่ง Rev-Share กันระยะยาว",
          proposedRole: "PROJECT_MANAGER",
          status: "PENDING"
        }
      ]
    });
    console.log("Mock proposals seeded successfully for test-id");
  } else {
    console.log("Bounty test-id not found");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
