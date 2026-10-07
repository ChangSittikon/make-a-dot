import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { checkWorkspaceAccess } from '@/lib/workspace-guard';

export const metadata: Metadata = {
  title: 'Workspace - Make a dot',
  description: 'Builder interface for Make a dot ecosystem',
  robots: { index: false, follow: false },
};

// Always evaluate access per request; never serve a cached shell to someone else.
export const dynamic = 'force-dynamic';

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await checkWorkspaceAccess();

  // Disabled flag or non-admin: behave as if the page does not exist.
  if (access.status === 'disabled' || access.status === 'forbidden') notFound();
  if (access.status === 'unauthenticated') {
    redirect('/api/auth/signin?callbackUrl=%2Fworkspace');
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 font-sans">
      {children}
    </div>
  );
}
