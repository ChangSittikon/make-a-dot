import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { checkRelativePath } from '@/lib/workspace-fs';

export const dynamic = 'force-dynamic';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
}

const sortNodes = (a: FileNode, b: FileNode) => {
  if (a.type === b.type) return a.name.localeCompare(b.name);
  return a.type === 'directory' ? -1 : 1;
};

// Recursively read a directory. Anything the read API would refuse (hidden files, .env*, .git,
// node_modules, *.db, keys, ...) is hidden here too so the tree never advertises blocked files.
async function buildTree(dirPath: string, basePath: string): Promise<FileNode[]> {
  const nodes: FileNode[] = [];
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');

    if (!checkRelativePath(relativePath).allowed) continue;

    if (item.isDirectory()) {
      nodes.push({
        name: item.name,
        type: 'directory',
        path: relativePath,
        children: await buildTree(fullPath, basePath),
      });
    } else {
      nodes.push({ name: item.name, type: 'file', path: relativePath });
    }
  }

  return nodes.sort(sortNodes).map((node) =>
    node.children ? { ...node, children: node.children.sort(sortNodes) } : node
  );
}

export async function GET() {
  const guard = await requireWorkspaceAdmin({ devOnly: true });
  if (!guard.ok) return guard.response;

  try {
    const rootDir = process.cwd();
    const tree = await buildTree(rootDir, rootDir);
    return NextResponse.json({ tree });
  } catch (error) {
    console.error('[fs/tree] failed:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Unable to read project files' }, { status: 500 });
  }
}
