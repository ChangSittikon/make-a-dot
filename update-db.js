const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.systemConfig.update({
    where: { id: 'GLOBAL' },
    data: { 
      primaryModel: 'gemini-1.5-pro',
      fallbackModels: 'gemini-1.5-flash'
    }
  });
  console.log('Successfully updated DB');
  process.exit(0);
}
run();
