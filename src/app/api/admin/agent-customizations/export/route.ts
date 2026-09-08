import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const agentsDir = path.join(process.cwd(), '.agents');
    
    const readDir = (dir: string) => {
      const fullPath = path.join(agentsDir, dir);
      if (!fs.existsSync(fullPath)) return [];
      
      return fs.readdirSync(fullPath).filter(f => f.endsWith('.md')).map(file => {
        return {
          filename: file,
          content: fs.readFileSync(path.join(fullPath, file), 'utf8')
        };
      });
    };

    const rules = readDir('rules');
    const skills = readDir('skills');
    
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      rules,
      skills
    };
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="agent-customizations-export.json"'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
