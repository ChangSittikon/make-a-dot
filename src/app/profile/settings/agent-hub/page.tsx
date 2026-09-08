import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import AgentHubClient from '@/components/admin/AgentHubClient';

function parseFrontmatter(fileContent: string) {
  const contentToMatch = fileContent.replace(/^\uFEFF/, '');
  const match = contentToMatch.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { attributes: {}, body: fileContent };
  const frontmatter = match[1];
  const attributes: any = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (value.startsWith('\"') && value.endsWith('\"')) value = value.slice(1, -1);
      attributes[key] = value;
    }
  });
  return { attributes, body: match[2].trim() };
}

function getItems(type: 'rules' | 'skills' | 'docs') {
  let dirPath = path.join(process.cwd(), '.agents', type);
  // docs are kept at the root of the project instead of inside .agents
  if (type === 'docs') {
    dirPath = path.join(process.cwd(), 'docs');
  }
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const filePath = path.join(dirPath, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const stat = fs.statSync(filePath);
    const parsed = parseFrontmatter(content);
    return {
      filename,
      title: parsed.attributes.name || filename.replace('.md', ''),
      desc: parsed.attributes.description || '',
      trigger: parsed.attributes.trigger || 'model_decision',
      category: parsed.attributes.category || 'dna',
      content: parsed.body,
      createdAt: stat.birthtime.toISOString()
    };
  });
}

export default async function AgentHubPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/api/auth/signin?callbackUrl=/profile');
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') redirect('/');

  // 1. Read Agent Skills & Rules
  const initialRules = [];
  try {
    const geminiPath = require('path').join(process.cwd(), 'GEMINI.md');
    if (fs.existsSync(geminiPath)) {
      const content = fs.readFileSync(geminiPath, 'utf8');
      const sections = content.split('## ').slice(1);
      sections.forEach(sec => {
        const lines = sec.trim().split('\n');
        const title = lines[0].trim();
        const desc = lines.slice(1).join('\n').trim();
        initialRules.push({ title, desc });
      });
    }
  } catch (e) {}

  // Also include anything from .agents/rules
  initialRules.push(...getItems('rules'));
  const initialSkills = getItems('skills');
  const initialDocs = getItems('docs');

  // 2. Read Dev Activity Logs
  let devLogs: any[] = [];
  try {
    const logPath = path.join(process.cwd(), 'dev-activity.json');
    if (fs.existsSync(logPath)) {
      devLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      devLogs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  } catch (err) {
    console.error("Failed to read dev-activity.json", err);
  }

  // 3. Read Workflow Config
  let workflowPhases: any[] = [];
  try {
    const wfPath = path.join(process.cwd(), 'workflow-config.json');
    if (fs.existsSync(wfPath)) {
      const data = JSON.parse(fs.readFileSync(wfPath, 'utf8'));
      workflowPhases = data.phases || [];
    }
  } catch (err) {
    console.error("Failed to read workflow-config.json", err);
  }


  // 4. Read Repo Anatomy
  let repoAnatomy = null;
  try {
    const anatomyPath = path.join(process.cwd(), 'repo-anatomy.json');
    if (fs.existsSync(anatomyPath)) {
      repoAnatomy = JSON.parse(fs.readFileSync(anatomyPath, 'utf8'));
    }
  } catch (err) {
    console.error("Failed to read repo-anatomy.json", err);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <Link href="/profile/settings" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-600"></i>
            </Link>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Agent Hub</h1>
          </div>
        </header>

          <main className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50 pb-24 text-gray-900">
            <AgentHubClient 
              initialRules={initialRules}
              initialSkills={initialSkills} 
              initialDocs={initialDocs}
              initialLogs={devLogs} 
              workflowPhases={workflowPhases}
              repoAnatomy={repoAnatomy} 
            />
          </main>
      </div>
    </div>
  );
}
