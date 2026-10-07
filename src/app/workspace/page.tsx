"use client";

import { useState } from 'react';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { PreviewTab } from '@/components/workspace/tabs/PreviewTab';
import { FilesTab } from '@/components/workspace/tabs/FilesTab';
import { CodeTab } from '@/components/workspace/tabs/CodeTab';
import { MoreTab } from '@/components/workspace/tabs/MoreTab';
import { WorkspaceTab } from '@/components/workspace/types';

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('preview');

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950">
      <WorkspaceHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'preview' && <PreviewTab />}
        {activeTab === 'files' && <FilesTab />}
        {activeTab === 'code' && <CodeTab />}
        {activeTab === 'more' && <MoreTab />}
      </main>
    </div>
  );
}
