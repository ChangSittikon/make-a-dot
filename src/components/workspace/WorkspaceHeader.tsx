"use client";

import { 
  PanelLeft, 
  Globe, 
  FileText, 
  Code2, 
  Layers, 
  Monitor, 
  RotateCw, 
  ChevronDown, 
  ExternalLink, 
  Zap, 
  X 
} from 'lucide-react';
import { WorkspaceTab } from './types';

interface WorkspaceHeaderProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onToggleSidebar?: () => void;
}

export function WorkspaceHeader({ activeTab, onTabChange, onToggleSidebar }: WorkspaceHeaderProps) {
  const tabs = [
    { id: 'preview', label: 'Preview', icon: Globe },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'more', label: 'More', icon: Layers },
  ] as const;

  const getTabTitle = (tab: WorkspaceTab) => {
    switch (tab) {
      case 'more': return 'More';
      case 'files': return 'Files';
      case 'code': return 'Code';
      default: return '';
    }
  };

  return (
    <header className="h-12 bg-[#0e0e0e] border-b border-zinc-800/80 flex items-center justify-between px-3.5 shrink-0 text-zinc-100 z-20 relative">
      {/* Left: Sidebar Toggle + Tab Switcher */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Tab Switcher Pills */}
        <div className="flex items-center bg-[#181818] border border-zinc-800/80 p-0.5 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as WorkspaceTab)}
                className={`transition-all duration-150 flex items-center ${
                  isActive
                    ? 'bg-blue-600 text-white rounded-lg px-2.5 py-1 text-xs font-medium shadow-sm space-x-1.5'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg p-1.5'
                }`}
                title={tab.label}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {isActive && <span>{tab.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Center: Preview controls OR Tab Title */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        {activeTab === 'preview' ? (
          <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
            <button className="p-1 hover:text-white transition-colors" title="Device">
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:text-white transition-colors" title="Reload">
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center space-x-1 px-2.5 py-1 rounded-md hover:bg-zinc-800/70 text-zinc-200 font-medium transition-colors">
              <span>Homepage</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 hover:text-white transition-colors" 
              title="Open in new window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <span className="text-sm font-semibold text-white tracking-wide">
            {getTabTitle(activeTab)}
          </span>
        )}
      </div>

      {/* Right: Preview Actions OR Close Button */}
      <div className="flex items-center">
        {activeTab === 'preview' ? (
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-lg border border-zinc-700/80 bg-transparent hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-colors">
              Share
            </button>
            <button className="flex items-center px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors shadow-sm">
              <Zap className="w-3 h-3 mr-1 fill-white" />
              Upgrade
            </button>
            <button className="px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm">
              Publish
            </button>
          </div>
        ) : (
          <button
            onClick={() => onTabChange('preview')}
            className="w-7 h-7 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
