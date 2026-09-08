import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { logger } from '@/lib/logger';
import fs from 'fs';
import path from 'path';

function compareVersions(current: string, latest: string) {
  const c = current.replace(/[\^~v]/g, '').split('.');
  const l = latest.replace(/[\^~v]/g, '').split('.');
  
  const cMajor = parseInt(c[0]) || 0;
  const cMinor = parseInt(c[1]) || 0;
  const cPatch = parseInt(c[2]) || 0;
  
  const lMajor = parseInt(l[0]) || 0;
  const lMinor = parseInt(l[1]) || 0;
  const lPatch = parseInt(l[2]) || 0;

  if (lMajor > cMajor) return { level: 'Critical', label: '🔥 สำคัญมาก (Major)', class: 'text-red-700 bg-red-50 border-red-200', isNew: true };
  if (lMinor > cMinor) return { level: 'Medium', label: '⭐ ปานกลาง (Minor)', class: 'text-amber-700 bg-amber-50 border-amber-200', isNew: true };
  if (lPatch > cPatch) return { level: 'Low', label: '🟢 ทั่วไป (Patch)', class: 'text-emerald-700 bg-emerald-50 border-emerald-200', isNew: true };
  return { level: 'UpToDate', label: '✅ ล่าสุดแล้ว', class: 'text-blue-700 bg-blue-50 border-blue-200', isNew: false };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let pkg: any = {};
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  } catch(e) {}
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  const repos = [
    { name: 'Next.js', owner: 'vercel', repo: 'next.js', icon: 'fa-cube', pkgName: 'next' },
    { name: 'Prisma', owner: 'prisma', repo: 'prisma', icon: 'fa-database', pkgName: 'prisma' },
    { name: 'Tailwind CSS', owner: 'tailwindlabs', repo: 'tailwindcss', icon: 'fa-wind', pkgName: 'tailwindcss' }
  ];

  const techUpdates = [];
  let techUnread = 0;

  for (const r of repos) {
    try {
      const res = await fetch(`https://api.github.com/repos/${r.owner}/${r.repo}/releases/latest`, {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'MAKE-A-DOT-AgentHub' }
      });
      
      if (res.ok) {
        const data = await res.json();
        
        let releaseTitle = data.name;
        if (!releaseTitle || releaseTitle === data.tag_name || releaseTitle.length < 15) {
            const bodyLines = (data.body || '').split('\n').filter((l: string) => l.trim().length > 0 && !l.startsWith('#') && !l.startsWith('['));
            releaseTitle = bodyLines[0] ? bodyLines.slice(0, 3).join('\n').substring(0, 300) + '...' : 'อัปเดตประสิทธิภาพและแก้ไขบั๊ก (Performance & Bug fixes)';
        }

        const currentVer = deps[r.pkgName] || '0.0.0';
        const importance = compareVersions(currentVer, data.tag_name);

        if (importance.isNew) techUnread++;

        techUpdates.push({
          id: r.repo,
          name: r.name,
          version: data.tag_name,
          currentVersion: currentVer,
          date: data.published_at,
          url: data.html_url,
          icon: r.icon,
          summary: releaseTitle,
          importance: importance
        });
      }
    } catch (error) {
      logger.error({ err: error, repo: r.repo }, 'Failed to fetch tech update');
    }
  }

  // Mock AI News
  const aiUpdates = [
    {
      id: 'ai-1',
      name: 'OpenAI GPT-4o Mini',
      version: 'New Model',
      currentVersion: '-',
      url: 'https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/',
      icon: 'fa-brain',
      summary: 'โมเดล AI ขนาดเล็กที่เร็วและถูกกว่า เหมาะสำหรับงานทั่วไป เปิดตัวให้ใช้งานผ่าน API แล้ว',
      importance: { label: '🔥 ข่าวใหม่', class: 'text-purple-700 bg-purple-50 border-purple-200', isNew: true }
    },
    {
      id: 'ai-2',
      name: 'Claude 3.5 Sonnet',
      version: 'Update',
      currentVersion: '-',
      url: 'https://www.anthropic.com/news/claude-3-5-sonnet',
      icon: 'fa-robot',
      summary: 'Anthropic เปิดตัวโมเดลใหม่ ฉลาดขึ้น เขียนโค้ดเก่งขึ้น และมีความเร็วเพิ่มขึ้นอย่างมาก',
      importance: { label: '⭐ น่าสนใจ', class: 'text-blue-700 bg-blue-50 border-blue-200', isNew: false }
    }
  ];

  // Mock Others
  const otherUpdates = [
    {
      id: 'other-1',
      name: 'Node.js 22 LTS',
      version: 'v22.0.0',
      currentVersion: 'v20.x',
      url: 'https://nodejs.org/en/blog/announcements/v22-release-announce',
      icon: 'fa-server',
      summary: 'Node.js อัปเดตเวอร์ชันหลัก รองรับการรันสคริปต์ที่เร็วขึ้น และฟีเจอร์ V8 engine ตัวใหม่',
      importance: { label: '🔥 สำคัญมาก (Major)', class: 'text-red-700 bg-red-50 border-red-200', isNew: true }
    }
  ];

  return NextResponse.json({ 
    tabs: {
      tech: { label: 'Tech', updates: techUpdates, unread: techUnread },
      ai: { label: 'AI News', updates: aiUpdates, unread: aiUpdates.filter(u => u.importance.isNew).length },
      others: { label: 'Others', updates: otherUpdates, unread: otherUpdates.filter(u => u.importance.isNew).length }
    }
  });
}
