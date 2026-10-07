import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  try {
    const rootDir = process.cwd();
    // Resolve absolute path and ensure it's within the project directory (security)
    const absolutePath = path.resolve(rootDir, filePath);
    
    if (!absolutePath.startsWith(rootDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    const content = await fs.readFile(absolutePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    // Fallback to mock data for production/serverless environments
    return NextResponse.json({ 
      content: `// Fallback Mock Content for ${filePath}\n// Could not read from file system.\nexport default function Mock() {\n  return <div>Mock</div>;\n}`,
      fallback: true 
    });
  }
}
