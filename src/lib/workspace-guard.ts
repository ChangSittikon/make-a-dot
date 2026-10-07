import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Workspace access control (Phase 0).
 *
 * Every /api/workspace/*, /api/fs/* and the /workspace page must go through this module.
 * Order of checks (deliberately leaks as little as possible to outsiders):
 *   1. WORKSPACE_ENABLED must be exactly "true"   -> otherwise behave as if the route does not exist (404)
 *   2. A valid Auth.js session must exist          -> 401
 *   3. session.user.role must be "ADMIN"           -> 403
 *   4. (optional) devOnly capabilities are refused in production -> 403 DEV_ONLY
 */

export type WorkspaceAccess =
  | { status: 'ok'; userId: string }
  | { status: 'disabled' }
  | { status: 'unauthenticated' }
  | { status: 'forbidden' };

export function isWorkspaceEnabled(): boolean {
  return process.env.WORKSPACE_ENABLED === 'true';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/** Core check shared by API routes and server components. Fails closed. */
export async function checkWorkspaceAccess(): Promise<WorkspaceAccess> {
  if (!isWorkspaceEnabled()) return { status: 'disabled' };

  let session;
  try {
    session = await auth();
  } catch (error) {
    console.warn('[workspace-guard] auth() failed, denying access:', error instanceof Error ? error.message : 'unknown');
    return { status: 'unauthenticated' };
  }

  const user = session?.user;
  if (!user?.id) return { status: 'unauthenticated' };
  if (user.role !== 'ADMIN') return { status: 'forbidden' };

  return { status: 'ok', userId: user.id };
}

export interface RequireOptions {
  /** Refuse in production even for admins (file system, git, SQL, secrets). */
  devOnly?: boolean;
}

export type GuardResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

function deny(status: number, error: string, code?: string): GuardResult {
  return { ok: false, response: NextResponse.json(code ? { error, code } : { error }, { status }) };
}

/** Use at the top of every workspace API handler. */
export async function requireWorkspaceAdmin(options: RequireOptions = {}): Promise<GuardResult> {
  const access = await checkWorkspaceAccess();

  switch (access.status) {
    case 'disabled':
      return deny(404, 'Not found');
    case 'unauthenticated':
      return deny(401, 'Authentication required', 'UNAUTHENTICATED');
    case 'forbidden':
      return deny(403, 'Admin role required', 'FORBIDDEN');
    case 'ok':
      if (options.devOnly && isProduction()) {
        return deny(403, 'This capability is only available in development', 'DEV_ONLY');
      }
      return { ok: true, userId: access.userId };
  }
}
