import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { MAX_READ_BYTES, looksBinary, resolveSafePath } from '@/lib/workspace-fs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const guard = await requireWorkspaceAdmin({ devOnly: true });
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  const resolved = await resolveSafePath(filePath);
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: resolved.status });
  }

  try {
    const stat = await fs.stat(resolved.absolutePath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: 'Not a file' }, { status: 400 });
    }
    if (stat.size > MAX_READ_BYTES) {
      return NextResponse.json({ error: 'File is too large to preview' }, { status: 413 });
    }

    const buffer = await fs.readFile(resolved.absolutePath);
    if (looksBinary(buffer)) {
      return NextResponse.json({ error: 'Binary files cannot be previewed' }, { status: 415 });
    }

    return NextResponse.json({
      path: resolved.relativePath,
      size: stat.size,
      content: buffer.toString('utf-8'),
    });
  } catch (error) {
    console.error('[fs/read] failed:', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ error: 'Unable to read file' }, { status: 500 });
  }
}
