import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear all data in correct order (respect FK)
  await prisma.endorsement.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.escrowVault.deleteMany();
  await prisma.guarantorNode.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.collaborationCanvas.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.domainDirector.deleteMany();
  await prisma.option.deleteMany();
  await prisma.node.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================
  // USERS
  // ============================================================
  const admin = await prisma.user.create({
    data: {
      email: 'admin@makeadot.com',
      name: 'System Admin',
      role: 'ADMIN',
      isVerified: true,
      trustScore: 10000,
    },
  });

  const directorMusic = await prisma.user.create({
    data: {
      email: 'somchai@makeadot.com',
      name: 'สมชาย ศิลปินแห่งชาติ',
      role: 'DIRECTOR',
      isVerified: true,
      trustScore: 9500,
      avatarUrl: 'https://i.pravatar.cc/150?img=68',
    },
  });

  const directorConstruction = await prisma.user.create({
    data: {
      email: 'wichai@makeadot.com',
      name: 'วิชัย วิศวกรรมไทย',
      role: 'DIRECTOR',
      isVerified: true,
      trustScore: 9200,
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
  });

  const userA = await prisma.user.create({
    data: {
      email: 'emmy@example.com',
      name: 'เอมมี่',
      role: 'USER',
      isVerified: true,
      trustScore: 750,
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
    },
  });

  const userB = await prisma.user.create({
    data: {
      email: 'krit@example.com',
      name: 'กฤษณ์ (Krit)',
      role: 'USER',
      isVerified: true,
      trustScore: 620,
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
    },
  });

  const userC = await prisma.user.create({
    data: {
      email: 'ploy@example.com',
      name: 'พลอยใส',
      role: 'USER',
      trustScore: 300,
    },
  });

  // ============================================================
  // INDUSTRIES
  // ============================================================
  const music = await prisma.industry.create({
    data: {
      name: 'วงการดนตรี',
      icon: 'fa-solid fa-music',
      order: 0,
      macroFeePercentage: 500, // 5.00%
    },
  });

  const video = await prisma.industry.create({
    data: {
      name: 'วิดีโอโปรดักชัน',
      icon: 'fa-solid fa-clapperboard',
      order: 1,
      macroFeePercentage: 500,
    },
  });

  const tech = await prisma.industry.create({
    data: {
      name: 'เทคโนโลยี & IT',
      icon: 'fa-solid fa-code',
      order: 2,
      macroFeePercentage: 400, // 4.00%
    },
  });

  const construction = await prisma.industry.create({
    data: {
      name: 'รับเหมาก่อสร้าง',
      icon: 'fa-solid fa-helmet-safety',
      order: 3,
      macroFeePercentage: 600, // 6.00%
    },
  });

  // ============================================================
  // DOMAIN DIRECTORS (ผู้อำนวยการวงการ — พาร์ทเนอร์ระดับชาติ)
  // ============================================================
  const musicDirector = await prisma.domainDirector.create({
    data: {
      userId: directorMusic.id,
      industryId: music.id,
      displayName: 'สมชาย ศิลปินแห่งชาติ',
      title: 'ผู้อำนวยการวงการดนตรีแห่งประเทศไทย',
      bio: 'ศิลปินแห่งชาติ สาขาศิลปะการแสดง (ดนตรีไทยสากล) ผู้คร่ำหวอดในวงการเพลงมากกว่า 30 ปี',
      profitSharePercentage: 2000, // 20% ของ Platform Fee
      equityPoints: 1000,
      totalEarnedSatang: 0,
    },
  });

  await prisma.domainDirector.create({
    data: {
      userId: directorConstruction.id,
      industryId: construction.id,
      displayName: 'วิชัย วิศวกรรมไทย',
      title: 'ผู้อำนวยการวงการก่อสร้างแห่งประเทศไทย',
      bio: 'วิศวกรโยธาระดับ วย. ผู้เชี่ยวชาญงานโครงสร้างพื้นฐานขนาดใหญ่',
      profitSharePercentage: 2500, // 25% ของ Platform Fee
      equityPoints: 800,
      totalEarnedSatang: 0,
    },
  });

  // ============================================================
  // FLOW LOGIC TREE (วงการดนตรี)
  // ============================================================
  const node1 = await prisma.node.create({
    data: {
      industryId: music.id,
      type: 'START',
      question: 'เป้าหมายหลักในการเข้ามา MAKE A DOT ของคุณคืออะไร?',
      order: 0,
    },
  });

  const node2 = await prisma.node.create({
    data: {
      industryId: music.id,
      type: 'QUESTION',
      question: 'โปรเจกต์แนวไหนที่คุณอยากสร้างสรรค์?',
      order: 1,
    },
  });

  const node3 = await prisma.node.create({
    data: {
      industryId: music.id,
      type: 'QUESTION',
      question: 'คุณถนัดให้บริการด้านไหนเพื่อสร้างรายได้?',
      order: 2,
    },
  });

  const node4 = await prisma.node.create({
    data: {
      industryId: music.id,
      type: 'QUESTION',
      question: 'แนวร่วมหรือทีมงานแบบไหนที่คุณกำลังตามหา?',
      order: 3,
    },
  });

  const node5 = await prisma.node.create({
    data: {
      industryId: music.id,
      type: 'QUESTION',
      question: 'ทรัพยากรหรือแหล่งทุนแบบไหนที่คุณขาดอยู่?',
      order: 4,
    },
  });

  // Options for Node 1
  await prisma.option.createMany({
    data: [
      { nodeId: node1.id, label: 'ริเริ่มโครงการใหม่ (Create Project)', icon: 'fa-solid fa-lightbulb', targetNodeId: node2.id, order: 0 },
      { nodeId: node1.id, label: 'สร้างรายได้จากทักษะ (Generate Revenue)', icon: 'fa-solid fa-money-bill-trend-up', targetNodeId: node3.id, order: 1 },
      { nodeId: node1.id, label: 'หาคน/แนวร่วมทำโปรเจกต์ (Find Teammates)', icon: 'fa-solid fa-users', targetNodeId: node4.id, order: 2 },
      { nodeId: node1.id, label: 'หาทรัพยากร/นายทุน (Find Resources)', icon: 'fa-solid fa-hand-holding-dollar', targetNodeId: node5.id, order: 3 },
    ],
  });

  // Options for Node 2
  await prisma.option.createMany({
    data: [
      { nodeId: node2.id, label: 'ฟอร์มวงดนตรีหน้าใหม่', icon: 'fa-solid fa-guitar', order: 0 },
      { nodeId: node2.id, label: 'ทำอัลบั้ม/ซิงเกิลเดี่ยว', icon: 'fa-solid fa-compact-disc', order: 1 },
      { nodeId: node2.id, label: 'ทำเพลงประกอบโฆษณา/ภาพยนตร์', icon: 'fa-solid fa-film', order: 2 },
    ],
  });

  // Options for Node 3
  await prisma.option.createMany({
    data: [
      { nodeId: node3.id, label: 'รับจ้างร้องเพลง/ไกด์โวคอล', icon: 'fa-solid fa-microphone', order: 0 },
      { nodeId: node3.id, label: 'รับจ้างแต่งเนื้อร้อง/ทำนอง', icon: 'fa-solid fa-pen', order: 1 },
      { nodeId: node3.id, label: 'รับมิกซ์/มาสเตอร์ริ่งเพลง', icon: 'fa-solid fa-sliders', order: 2 },
    ],
  });

  // Options for Node 4
  await prisma.option.createMany({
    data: [
      { nodeId: node4.id, label: 'หาโปรดิวเซอร์มาช่วยทำเพลง', icon: 'fa-solid fa-headphones', order: 0 },
      { nodeId: node4.id, label: 'หานักแต่งเพลงฝีมือดี', icon: 'fa-solid fa-file-signature', order: 1 },
      { nodeId: node4.id, label: 'หานักดนตรี Back up', icon: 'fa-solid fa-drum', order: 2 },
    ],
  });

  // Options for Node 5
  await prisma.option.createMany({
    data: [
      { nodeId: node5.id, label: 'หาห้องอัดเสียง (Studio)', icon: 'fa-solid fa-microphone-lines', order: 0 },
      { nodeId: node5.id, label: 'หานายทุน/สปอนเซอร์ออกทุน', icon: 'fa-solid fa-sack-dollar', order: 1 },
      { nodeId: node5.id, label: 'หาที่ปรึกษาด้านลิขสิทธิ์ดนตรี', icon: 'fa-solid fa-scale-balanced', order: 2 },
    ],
  });

  // ============================================================
  // DEMO PROJECT (โปรเจกต์ตัวอย่าง พร้อม Canvas + Escrow + Guarantor)
  // ============================================================
  const demoProject = await prisma.project.create({
    data: {
      title: 'ทำอัลบั้ม "เสียงเล็กๆ ที่ดังก้อง"',
      description: 'รวมตัวศิลปินอินดี้จากทั่วประเทศ ทำอัลบั้มรวมเพลง 10 เพลง',
      industryId: music.id,
      ownerId: userA.id,
      status: 'IN_PROGRESS',
      budgetSatang: 15000000, // 150,000 บาท
      province: 'กรุงเทพมหานคร',
      district: 'ลาดพร้าว',
      isEndorsed: true,
    },
  });

  // Members
  await prisma.projectMember.createMany({
    data: [
      { projectId: demoProject.id, userId: userA.id, role: 'OWNER', equityPercentage: 4000, status: 'ACCEPTED' }, // 40%
      { projectId: demoProject.id, userId: userB.id, role: 'MEMBER', equityPercentage: 3500, status: 'ACCEPTED' }, // 35%
      { projectId: demoProject.id, userId: userC.id, role: 'CONTRACTOR', equityPercentage: 2500, status: 'ACCEPTED' }, // 25%
    ],
  });

  // Collaboration Canvas
  const canvas = await prisma.collaborationCanvas.create({
    data: {
      projectId: demoProject.id,
      proposerId: userA.id,
      splitType: 'REVENUE_SHARE',
      hasBreakeven: true,
      breakevenAmountSatang: 5000000, // 50,000 บาท (ค่าห้องอัด)
      breakevenRecipientId: userB.id,
      status: 'SIGNED',
      smartSummary: 'หักค่าห้องอัด 50,000 บาทคืนกฤษณ์ก่อน จากนั้นแบ่งกำไร: เอมมี่ 40% / กฤษณ์ 35% / พลอยใส 25%',
      signedAt: new Date(),
    },
  });

  // Resources
  await prisma.resource.createMany({
    data: [
      { canvasId: canvas.id, contributorId: userA.id, label: 'เสียงร้อง 10 เพลง', icon: 'fa-solid fa-microphone', category: 'LABOR', equivalentValueSatang: 5000000 },
      { canvasId: canvas.id, contributorId: userB.id, label: 'ห้องอัด Studio A (10 วัน)', icon: 'fa-solid fa-building', category: 'VENUE', equivalentValueSatang: 5000000 },
      { canvasId: canvas.id, contributorId: userB.id, label: 'มิกซ์ + มาสเตอร์ 10 เพลง', icon: 'fa-solid fa-sliders', category: 'LABOR', equivalentValueSatang: 3000000 },
      { canvasId: canvas.id, contributorId: userC.id, label: 'แต่งเนื้อร้อง 10 เพลง', icon: 'fa-solid fa-pen-nib', category: 'LABOR', equivalentValueSatang: 2000000 },
    ],
  });

  // Escrow Vault
  const vault = await prisma.escrowVault.create({
    data: {
      projectId: demoProject.id,
      totalAmountSatang: 15000000, // 150,000 บาท
      releasedSatang: 5000000,     // 50,000 ปลดล็อกไปแล้ว
      frozenSatang: 0,
      paymentMethod: 'BANK_TRANSFER',
      status: 'PARTIALLY_RELEASED',
      platformFeeSatang: 750000,   // 5% = 7,500 บาท
      directorFeeSatang: 150000,   // 20% ของ Fee = 1,500 บาท
    },
  });

  // Milestones
  await prisma.milestone.createMany({
    data: [
      { escrowId: vault.id, title: 'งวดที่ 1: ส่งเดโม 3 เพลงแรก', amountSatang: 5000000, order: 0, status: 'RELEASED' },
      { escrowId: vault.id, title: 'งวดที่ 2: ส่งเพลงที่ 4-7', amountSatang: 5000000, order: 1, status: 'PENDING_REVIEW' },
      { escrowId: vault.id, title: 'งวดที่ 3: ส่งอัลบั้มฉบับสมบูรณ์', amountSatang: 5000000, order: 2, status: 'LOCKED' },
    ],
  });

  // Guarantor
  await prisma.guarantorNode.create({
    data: {
      projectId: demoProject.id,
      guarantorType: 'PEER',
      guarantorUserId: directorMusic.id,
      collateralAmountSatang: 5000000, // ค้ำ 50,000 บาท
      premiumFeePercentage: 300,       // 3%
      status: 'ACTIVE',
      approvedAt: new Date(),
    },
  });

  // Endorsement
  await prisma.endorsement.create({
    data: {
      directorId: musicDirector.id,
      projectId: demoProject.id,
      message: 'โปรเจกต์นี้ผ่านการคัดกรองจากผม ศิลปินทุกท่านมีฝีมือระดับมืออาชีพ',
      isFeatured: true,
    },
  });

  console.log('✅ Seed completed! Created:');
  console.log(`   - ${6} Users (1 Admin, 2 Directors, 3 Users)`);
  console.log(`   - ${4} Industries`);
  console.log(`   - ${2} Domain Directors`);
  console.log(`   - ${5} Flow Nodes + Options (วงการดนตรี)`);
  console.log(`   - ${1} Demo Project with Canvas + Escrow + Guarantor + Endorsement`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
