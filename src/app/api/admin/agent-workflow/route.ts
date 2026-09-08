import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import fs from 'fs';
import path from 'path';
import { logger } from '@/lib/logger';

async function isAdmin() {
  const session = await auth();
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === 'ADMIN';
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    logger.warn('Unauthorized attempt to update agent workflow');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phases } = await req.json();
    if (!phases || !Array.isArray(phases)) {
      logger.warn('Invalid phases payload received');
      return NextResponse.json({ error: 'Invalid phases data' }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), 'workflow-config.json');
    fs.writeFileSync(configPath, JSON.stringify({ phases }, null, 2), 'utf8');

    // Log the activity
    const logPath = path.join(process.cwd(), 'dev-activity.json');
    if (fs.existsSync(logPath)) {
      const devLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      devLogs.push({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: "Updated Agent Workflow (WI)",
        details: `อัปเดตสถานะและ Work Instruction ของ Agent Workflow`
      });
      fs.writeFileSync(logPath, JSON.stringify(devLogs, null, 2), 'utf8');
    }

    logger.info('Successfully updated agent workflow config');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to update agent workflow');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
