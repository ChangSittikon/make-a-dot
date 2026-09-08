import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to parse frontmatter
function parseFrontmatter(fileContent: string) {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { attributes: {}, body: fileContent };
  
  const frontmatter = match[1];
  const body = match[2];
  
  const attributes: any = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      attributes[key] = value;
    }
  });
  
  return { attributes, body: body.trim() };
}

function getItems(type: 'rules' | 'skills') {
  const dirPath = path.join(process.cwd(), '.agents', type);
  if (!fs.existsSync(dirPath)) return [];
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  return files.map(filename => {
    const content = fs.readFileSync(path.join(dirPath, filename), 'utf8');
    const parsed = parseFrontmatter(content);
    return {
      filename,
      name: parsed.attributes.name || filename.replace('.md', ''),
      description: parsed.attributes.description || '',
      trigger: parsed.attributes.trigger || '',
      content: parsed.body
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    const rules = getItems('rules');
    const skills = getItems('skills');
    return NextResponse.json({ rules, skills });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, name, description, trigger, content, oldFilename } = await req.json();
    if (!type || !name) return NextResponse.json({ error: 'Missing type or name' }, { status: 400 });
    
    const dirType = type === 'rule' ? 'rules' : 'skills';
    const dirPath = path.join(process.cwd(), '.agents', dirType);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    
    const cleanName = name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newFilename = `${cleanName}.md`;
    
    if (oldFilename && oldFilename !== newFilename) {
      const oldPath = path.join(dirPath, oldFilename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    
    let fileBody = `---\nname: ${name}\ndescription: "${description}"\n`;
    if (trigger) fileBody += `trigger: ${trigger}\n`;
    fileBody += `---\n\n${content}`;
    
    fs.writeFileSync(path.join(dirPath, newFilename), fileBody, 'utf8');
    return NextResponse.json({ success: true, filename: newFilename });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { type, filename } = await req.json();
    if (!type || !filename) return NextResponse.json({ error: 'Missing type or filename' }, { status: 400 });
    
    const dirType = type === 'rule' ? 'rules' : 'skills';
    const filePath = path.join(process.cwd(), '.agents', dirType, filename);
    
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
