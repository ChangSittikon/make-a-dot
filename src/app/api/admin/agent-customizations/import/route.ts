import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.rules && !data.skills) {
      return NextResponse.json({ error: 'Invalid import format' }, { status: 400 });
    }
    
    const writeDir = (dir: string, items: any[]) => {
      const fullPath = path.join(process.cwd(), '.agents', dir);
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      
      items.forEach(item => {
        if (item.filename && item.content) {
          fs.writeFileSync(path.join(fullPath, item.filename), item.content, 'utf8');
        }
      });
    };

    if (data.rules && Array.isArray(data.rules)) writeDir('rules', data.rules);
    if (data.skills && Array.isArray(data.skills)) writeDir('skills', data.skills);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
