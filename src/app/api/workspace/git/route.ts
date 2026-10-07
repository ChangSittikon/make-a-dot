import { NextResponse } from 'next/server';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function GET() {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response;

  try {
    const rootDir = process.cwd();
    
    // Check if git is initialized
    try {
      await execAsync('git rev-parse --is-inside-work-tree', { cwd: rootDir });
    } catch {
      return NextResponse.json({ error: 'Not a git repository' }, { status: 400 });
    }

    const [{ stdout: statusOut }, { stdout: logOut }, { stdout: branchOut }, { stdout: remoteOut }] = await Promise.all([
      execAsync('git status --porcelain', { cwd: rootDir }),
      execAsync('git log -n 5 --pretty=format:"%h|%s|%ar|%an"', { cwd: rootDir }),
      execAsync('git branch --show-current', { cwd: rootDir }),
      execAsync('git remote -v', { cwd: rootDir }),
    ]);

    // Parse status
    const changes = statusOut.split('\n').filter(Boolean).map(line => {
      const status = line.substring(0, 2);
      const file = line.substring(3);
      return { status, file };
    });

    // Parse log
    const commits = logOut.split('\n').filter(Boolean).map(line => {
      const [hash, message, time, author] = line.split('|');
      return { hash, message, time, author };
    });

    return NextResponse.json({
      branch: branchOut.trim(),
      changes,
      commits,
      remotes: remoteOut.split('\n').filter(Boolean).map(r => r.split('\t')[0]).filter((v, i, a) => a.indexOf(v) === i),
    });
  } catch (err) {
    console.error('Git API error:', err);
    return NextResponse.json({ error: 'Failed to fetch git status' }, { status: 500 });
  }
}
