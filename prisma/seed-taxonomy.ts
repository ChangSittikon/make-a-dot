import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DOT017 Taxonomy...');

  // Layer 1: Work Types
  const workTypes = [
    'รับจ้างทั่วไป',
    'พนักงานประจำ',
    'ข้าราชการ/นักการเมือง',
    'วิชาชีพเฉพาะ(ใบประกอบวิชาชีพ)',
    'ผู้ประกอบการ/ร้านค้า',
    'ฟรีแลนซ์/อาชีพอิสระ',
    'นักเรียน/นักศึกษา',
    'นักลงทุน',
  ];

  for (const wt of workTypes) {
    await prisma.workType.upsert({
      where: { name: wt },
      update: {},
      create: { name: wt },
    });
  }
  console.log('WorkTypes seeded.');

  // Layer 2 & 3: Industries & Occupations
  const industries = [
    { name: 'ก่อสร้างและอสังหาริมทรัพย์', icon: 'fa-solid fa-building' },
    { name: 'การแพทย์และสาธารณสุข', icon: 'fa-solid fa-user-doctor' },
    { name: 'เทคโนโลยีและไอที', icon: 'fa-solid fa-computer' },
    { name: 'การศึกษา', icon: 'fa-solid fa-graduation-cap' },
    { name: 'อาหารเครื่องดื่ม', icon: 'fa-solid fa-utensils' },
    { name: 'เกษตรกรรม', icon: 'fa-solid fa-leaf' },
    { name: 'ขนส่ง', icon: 'fa-solid fa-truck' },
    { name: 'การเงิน/การธนาคาร/บัญชี', icon: 'fa-solid fa-coins' },
    { name: 'การท่องเที่ยวและบริการ (โรงแรม)', icon: 'fa-solid fa-plane' },
    { name: 'โรงงานและการผลิต', icon: 'fa-solid fa-industry' },
    { name: 'สื่อ/ความบันเทิง/ศิลปะ', icon: 'fa-solid fa-music', occupations: ['นักร้อง', 'นักดนตรี', 'นักแสดง', 'ผู้กำกับ', 'ช่างภาพ', 'นักเขียน'] },
    { name: 'กฎหมาย', icon: 'fa-solid fa-scale-balanced' },
  ];

  for (const ind of industries) {
    let existingInd = await prisma.industry.findFirst({ where: { name: ind.name } });
    if (!existingInd) {
      existingInd = await prisma.industry.create({ data: { name: ind.name, icon: ind.icon } });
    } else {
      await prisma.industry.update({ where: { id: existingInd.id }, data: { icon: ind.icon } });
    }

    if (ind.occupations) {
      for (const occName of ind.occupations) {
        const existingOcc = await prisma.occupation.findFirst({
          where: { industryId: existingInd.id, name: occName }
        });
        if (!existingOcc) {
          await prisma.occupation.create({
            data: { name: occName, industryId: existingInd.id, icon: 'fa-solid fa-user' }
          });
        }
      }
    }
  }
  
  console.log('Industries and Occupations seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
