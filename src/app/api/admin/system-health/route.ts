import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1. Check Database
  let dbStatus = 'Stable';
  let dbColor = 'emerald-500';
  let dbIcon = 'fa-circle-check';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = 'Error';
    dbColor = 'red-500';
    dbIcon = 'fa-circle-xmark';
  }

  // 2. Check Agent Sync (Files exist)
  let agentSyncStatus = 'Synced';
  let agentSyncColor = 'blue-500';
  let agentSyncIcon = 'fa-rotate';
  const geminiPath = path.join(process.cwd(), 'GEMINI.md');
  const logPath = path.join(process.cwd(), 'dev-activity.json');
  if (!fs.existsSync(geminiPath) || !fs.existsSync(logPath)) {
    agentSyncStatus = 'Unsynced';
    agentSyncColor = 'amber-500';
    agentSyncIcon = 'fa-triangle-exclamation';
  }

  // 3. Check ENV Variables
  let envStatus = 'Ready';
  let envColor = 'emerald-500';
  let envIcon = 'fa-shield-halved';
  if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET) {
    envStatus = 'Missing Keys';
    envColor = 'amber-500';
    envIcon = 'fa-key';
  }

  // 4. Codebase Status (Placeholder for build/lint passing)
  let codeStatus = 'Stable';
  let codeColor = 'emerald-500';
  let codeIcon = 'fa-code-commit';

  return NextResponse.json({
    metrics: [
      { id: 'db', label: 'Database Status', status: dbStatus, color: dbColor, icon: dbIcon },
      { id: 'env', label: 'ENV Setup', status: envStatus, color: envColor, icon: envIcon },
      { id: 'agent', label: 'Agent Sync', status: agentSyncStatus, color: agentSyncColor, icon: agentSyncIcon },
      { id: 'code', label: 'Codebase', status: codeStatus, color: codeColor, icon: codeIcon },
    ]
  });
}
