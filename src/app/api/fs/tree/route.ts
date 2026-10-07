import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
}

// Function to recursively read directory
async function buildTree(dirPath: string, basePath: string): Promise<FileNode[]> {
  const nodes: FileNode[] = [];
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    // Ignore hidden files and node_modules
    if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === '.next') {
      continue;
    }

    const fullPath = path.join(dirPath, item.name);
    const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');

    if (item.isDirectory()) {
      const children = await buildTree(fullPath, basePath);
      nodes.push({
        name: item.name,
        type: 'directory',
        path: relativePath,
        children: children.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'directory' ? -1 : 1;
        }),
      });
    } else {
      nodes.push({
        name: item.name,
        type: 'file',
        path: relativePath,
      });
    }
  }

  return nodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

const mockTree: FileNode[] = [
  {
    name: 'src',
    type: 'directory',
    path: 'src',
    children: [
      { name: 'app', type: 'directory', path: 'src/app' },
      { name: 'components', type: 'directory', path: 'src/components' },
    ]
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
  { name: 'README.md', type: 'file', path: 'README.md' }
];

export async function GET() {
  try {
    // Check if we can read the file system (development only, or valid server env)
    const rootDir = process.cwd();
    const tree = await buildTree(rootDir, rootDir);
    return NextResponse.json({ tree });
  } catch (error) {
    console.error('Error reading directory tree:', error);
    // Fallback to mock data for production/serverless environments
    return NextResponse.json({ tree: mockTree, fallback: true });
  }
}
