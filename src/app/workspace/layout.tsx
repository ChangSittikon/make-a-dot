import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace - Make a dot',
  description: 'Builder interface for Make a dot ecosystem',
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 font-sans">
      {children}
    </div>
  );
}
