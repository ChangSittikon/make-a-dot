import os

page_path = r"C:\Users\CHANG-PCSONSAI\.gemini\antigravity\scratch\make-a-dot\src\app\profile\bounty\[id]\page.tsx"

with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to add logic to upsert two mock users and two proposals.
# Let's find the `bounty = await prisma.problemNode.upsert({` block

upsert_logic = """
  if (!bounty) {
    // Upsert a test bounty so the UI and API works
    bounty = await prisma.problemNode.upsert({
      where: { id: resolvedParams.id },
      update: {},
      create: {
        id: resolvedParams.id,
        rawDescription: "ต้องการทีมพัฒนา MVP สำหรับจองคิวร้านอาหาร โดยต้องการฟีเจอร์พื้นฐาน...",
        entityType: "ENTERPRISE",
        primaryGap: "SKILL_GAP",
        urgencyState: "HOT_MISSION",
        bountyPrizeSatang: 5000000,
        requesterId: user?.id || "",
      },
      include: {
        upgradeProposals: {
          include: { proposer: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Seed mock proposals if we just created the bounty
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

    // Re-fetch to get the new proposals
    bounty = await prisma.problemNode.findUnique({
      where: { id: resolvedParams.id },
      include: {
        upgradeProposals: {
          include: { proposer: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }
"""

# replace the existing if (!bounty) block
import re
new_content = re.sub(
    r"if \(\!bounty\) \{[\s\S]*?\}\s*// Fallbacks if bounty is still null for some reason",
    upsert_logic + "\n\n  // Fallbacks if bounty is still null for some reason",
    content
)

with open(page_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated page.tsx with mock data")
