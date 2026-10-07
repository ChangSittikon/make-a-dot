const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bounties = await prisma.problemNode.findMany({
    select: { id: true, rawDescription: true }
  });

  for (let i = 0; i < bounties.length; i++) {
    const desc = bounties[i].rawDescription || '';
    let scale = 'LOCAL';
    if (desc.includes('ยึดทรัพย์') || desc.includes('หนี้')) {
      scale = 'STRUCTURAL';
    } else if (desc.includes('บัญชี') || desc.includes('test') || desc.includes('นักร้อง')) {
      scale = 'MICRO';
    } else if (desc.includes('ร้านอาหาร') || desc.includes('คิว')) {
      scale = 'LOCAL';
    } else if (i % 5 === 0) {
      scale = 'MACRO';
    } else if (i % 6 === 0) {
      scale = 'GLOBAL';
    } else if (i % 7 === 0) {
      scale = 'MOONSHOT';
    }
    await prisma.problemNode.update({
      where: { id: bounties[i].id },
      data: { impactScale: scale }
    });
  }

  const projects = await prisma.project.findMany({
    select: { id: true, title: true }
  });

  const projectScales = ['LOCAL', 'MACRO', 'LOCAL', 'STRUCTURAL', 'GLOBAL', 'MOONSHOT', 'MICRO', 'LOCAL', 'MACRO'];
  for (let i = 0; i < projects.length; i++) {
    await prisma.project.update({
      where: { id: projects[i].id },
      data: { impactScale: projectScales[i % projectScales.length] }
    });
  }

  console.log('Successfully updated realistic scales for bounties and projects');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
