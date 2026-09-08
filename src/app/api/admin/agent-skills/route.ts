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
    logger.warn('Unauthorized attempt to add agent skill');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, desc, type } = await req.json();
    if (!title || !desc) {
      logger.warn('Missing title or description in agent skill payload');
      return NextResponse.json({ error: 'Missing title or description' }, { status: 400 });
    }

    if (type === 'skill') {
      const skillsDir = path.join(process.cwd(), '.agents', 'skills');
      if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });
      
      const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md';
      const filepath = path.join(skillsDir, filename);
      
      const content = `---
name: ${title}
description: ${desc}
trigger: model_decision
---

# ${title}
${desc}
`;
      fs.writeFileSync(filepath, content, 'utf8');
      logActivity("Agent Skill Added", `เพิ่มทักษะใหม่: ${title}`);
    } else {
      const geminiPath = path.join(process.cwd(), 'GEMINI.md');
      const newContent = `\n\n## ${title}\n${desc}\n`;
      fs.appendFileSync(geminiPath, newContent, 'utf8');
      logActivity("Agent Rule Added", `เพิ่มกฎใหม่: ${title}`);
    }

    logger.info({ ruleTitle: title }, 'Successfully added new agent rule');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to add agent skill');
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

  export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
      logger.warn('Unauthorized attempt to edit agent skills');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      
      // Legacy bulk edit for GEMINI.md
      if (body.skills && Array.isArray(body.skills)) {
        let fileContent = '# Agent Autonomy & Execution Rules\n\n';
        body.skills.forEach((s: any) => {
          if (!s.filename) { // Only rules without filename go into GEMINI.md
            fileContent += `## ${s.title}\n${s.desc}\n\n`;
          }
        });
        const geminiPath = path.join(process.cwd(), 'GEMINI.md');
        fs.writeFileSync(geminiPath, fileContent, 'utf8');
        logActivity("Agent Rules Updated", `อัปเดตแก้ไข Agent Rules`);
        return NextResponse.json({ success: true });
      }
      
      // New specific file edit
      const { title, desc, type, filename } = body;
      if (!filename || !title || !desc || !type) {
        return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
      }
      
      const dir = type === 'skill' ? 'skills' : 'rules';
      const filepath = path.join(process.cwd(), '.agents', dir, filename);
      
      if (!fs.existsSync(filepath)) {
         return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      const newContent = body.content || `# ${title}\n${desc}`;
      const content = `---
name: ${title}
description: ${desc}
trigger: model_decision
---

${newContent}
`; 
      fs.writeFileSync(filepath, content, 'utf8');
      
      const action = type === 'skill' ? "Agent Skill Updated" : "Agent Rule Updated";
      logActivity(action, `อัปเดต ${type}: ${title}`);
      
      return NextResponse.json({ success: true });
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to update agent skills/rules');
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  function logActivity(action: string, details: string) {
  const logPath = path.join(process.cwd(), 'dev-activity.json');
  if (fs.existsSync(logPath)) {
    const devLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    devLogs.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details
    });
    fs.writeFileSync(logPath, JSON.stringify(devLogs, null, 2), 'utf8');
  }
}
