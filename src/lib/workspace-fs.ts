import fs from 'fs/promises';
import path from 'path';

/**
 * Safe file access for the Workspace (Phase 0).
 *
 * Defence in depth:
 *   1. Lexical checks on the user supplied path (null bytes, "..", ADS colons, device names).
 *   2. Resolve against the project root, then realpath() both sides so symlinks and Windows 8.3
 *      short names (e.g. ENV~1 -> .env) cannot smuggle a blocked file past the name rules.
 *   3. Containment check with path.relative (NOT startsWith, which "root-evil" would pass).
 *   4. Block rules are applied again on the REAL relative path.
 */

export const MAX_READ_BYTES = 1024 * 1024; // 1 MB

const BLOCKED_EXTENSIONS = new Set([
  '.db', '.sqlite', '.sqlite3', '.db-journal', '.db-wal', '.db-shm',
  '.pem', '.key', '.p12', '.pfx', '.keystore',
]);

const BLOCKED_DIRECTORIES = new Set(['node_modules']);
const WINDOWS_DEVICE_NAME = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
const PRIVATE_KEY_NAME = /^id_(rsa|dsa|ecdsa|ed25519)/i;

export type PathCheck = { allowed: true } | { allowed: false; reason: string };

function toSegments(relativePath: string): string[] {
  return relativePath
    .replace(/\\/g, '/')
    .split('/')
    .filter((segment) => segment !== '' && segment !== '.');
}

/**
 * Pure name based policy for a path relative to the project root.
 * Hidden entries (.env*, .git, .next, .npmrc, ...) are blocked wholesale, which also keeps the
 * file tree consistent with what can be read.
 */
export function checkRelativePath(relativePath: string): PathCheck {
  if (relativePath.includes('\0')) return { allowed: false, reason: 'Invalid path' };

  const segments = toSegments(relativePath);
  if (segments.length === 0) return { allowed: false, reason: 'Path is required' };

  for (const segment of segments) {
    const lower = segment.toLowerCase();

    if (segment === '..') return { allowed: false, reason: 'Path escapes the project' };
    if (segment.includes(':')) return { allowed: false, reason: 'Invalid path' };
    if (lower.startsWith('.')) return { allowed: false, reason: 'Hidden files are not accessible' };
    if (BLOCKED_DIRECTORIES.has(lower)) return { allowed: false, reason: 'Directory is not accessible' };
    if (WINDOWS_DEVICE_NAME.test(segment)) return { allowed: false, reason: 'Invalid path' };
  }

  const fileName = segments[segments.length - 1];
  if (BLOCKED_EXTENSIONS.has(path.extname(fileName).toLowerCase())) {
    return { allowed: false, reason: 'This file type is not accessible' };
  }
  if (PRIVATE_KEY_NAME.test(fileName)) {
    return { allowed: false, reason: 'This file type is not accessible' };
  }

  return { allowed: true };
}

export type ResolveResult =
  | { ok: true; absolutePath: string; relativePath: string }
  | { ok: false; status: 400 | 403 | 404; error: string };

/** Resolve a user supplied path to a real file inside the project, or explain why not. */
export async function resolveSafePath(userPath: string, rootDir: string = process.cwd()): Promise<ResolveResult> {
  const lexical = checkRelativePath(userPath);
  if (!lexical.allowed) {
    return { ok: false, status: lexical.reason === 'Path is required' ? 400 : 403, error: lexical.reason };
  }

  const candidate = path.resolve(rootDir, userPath);

  let realRoot: string;
  let realTarget: string;
  try {
    realRoot = await fs.realpath(rootDir);
    realTarget = await fs.realpath(candidate);
  } catch {
    // Do not reveal whether a blocked or missing target exists
    return { ok: false, status: 404, error: 'File not found' };
  }

  const relative = path.relative(realRoot, realTarget);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
    return { ok: false, status: 403, error: 'Path escapes the project' };
  }

  const real = checkRelativePath(relative);
  if (!real.allowed) return { ok: false, status: 403, error: real.reason };

  return { ok: true, absolutePath: realTarget, relativePath: relative.replace(/\\/g, '/') };
}

/** True when the first KB contains a NUL byte (binary content). */
export function looksBinary(buffer: Buffer): boolean {
  const sample = buffer.subarray(0, 1024);
  return sample.includes(0);
}
