"use client";

import { useState } from 'react';
import { Database, Activity, Component, Bot, CreditCard, Network, FileSpreadsheet, Target, ChevronDown, Cable, Search, Settings, ShieldCheck } from 'lucide-react';
import { DatabaseView } from '../views/DatabaseView';
import { OverviewView } from '../views/OverviewView';
import { AnalyticsView } from '../views/AnalyticsView';
import { UsersView } from '../views/UsersView';
import { StorageView } from '../views/StorageView';
import { EmailsView } from '../views/EmailsView';
import { SecretsView } from '../views/SecretsView';
import { JobsView } from '../views/JobsView';
import { EdgeFunctionsView } from '../views/EdgeFunctionsView';
import { SQLEditorView } from '../views/SQLEditorView';
import { LogsView } from '../views/LogsView';
import { UsageView } from '../views/UsageView';
import { AIView } from '../views/AIView';
import { AgentIntegrationsView } from '../views/AgentIntegrationsView';
import { PaymentsView } from '../views/PaymentsView';
import { ConnectorsView } from '../views/ConnectorsView';
import { SecurityView } from '../views/SecurityView';
import { SeoSearchView } from '../views/SeoSearchView';
import { SettingsGeneralView } from '../views/SettingsGeneralView';
import { SettingsKnowledgeView } from '../views/SettingsKnowledgeView';
import { SettingsDomainsView } from '../views/SettingsDomainsView';
import { SettingsGitView } from '../views/SettingsGitView';

type ActiveView = 'Database' | 'Overview' | 'Analytics' | 'Users' | 'Storage' | 'Emails' | 'Secrets' | 'Jobs' | 'Edge functions' | 'SQL editor' | 'Logs' | 'Usage' | 'AI' | 'Taxonomy' | 'Cap Table Engine' | 'Bounty Quests' | string;

export function MoreTab() {
  const [activeView, setActiveView] = useState<ActiveView>('Analytics');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Cloud: true, AppModules: true, Settings: true });

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sidebarMenus = [
    { id: 'Analytics', icon: <Activity className="w-4 h-4" />, label: 'Analytics' },
    { id: 'Cloud', icon: <Database className="w-4 h-4" />, label: 'Cloud', items: ['Overview', 'Database', 'Users', 'Storage', 'Emails', 'Secrets', 'Jobs', 'Edge functions', 'SQL editor', 'Logs', 'Usage'] },
    { id: 'AppModules', icon: <Component className="w-4 h-4" />, label: 'App Modules', items: ['Taxonomy', 'Cap Table Engine', 'Bounty Quests'] },
    { id: 'AI', icon: <Bot className="w-4 h-4" />, label: 'AI' },
    { id: 'AgentIntegrations', icon: <Bot className="w-4 h-4" />, label: 'Agent integrations' },
    { id: 'Payments', icon: <CreditCard className="w-4 h-4" />, label: 'Payments' },
    { id: 'Connectors', icon: <Cable className="w-4 h-4" />, label: 'Connectors' },
    { id: 'Security', icon: <ShieldCheck className="w-4 h-4" />, label: 'Security' },
    { id: 'SeoSearch', icon: <Search className="w-4 h-4" />, label: 'SEO & AI search' },
    { id: 'Settings', icon: <Settings className="w-4 h-4" />, label: 'Settings', items: ['General', 'Knowledge', 'Domains', 'Git'] },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'Database': return <DatabaseView />;
      case 'Overview': return <OverviewView />;
      case 'Analytics': return <AnalyticsView />;
      case 'Users': return <UsersView />;
      case 'Storage': return <StorageView />;
      case 'Emails': return <EmailsView />;
      case 'Secrets': return <SecretsView />;
      case 'Jobs': return <JobsView />;
      case 'Edge functions': return <EdgeFunctionsView />;
      case 'SQL editor': return <SQLEditorView />;
      case 'Logs': return <LogsView />;
      case 'Usage': return <UsageView />;
      case 'AI': return <AIView />;
      case 'Agent integrations': return <AgentIntegrationsView />;
      case 'Payments': return <PaymentsView />;
      case 'Connectors': return <ConnectorsView />;
      case 'Security': return <SecurityView />;
      case 'SEO & AI search': return <SeoSearchView />;
      case 'General': return <SettingsGeneralView />;
      case 'Knowledge': return <SettingsKnowledgeView />;
      case 'Domains': return <SettingsDomainsView />;
      case 'Git': return <SettingsGitView />;
      case 'Settings': return <SettingsGeneralView />;
      case 'Taxonomy':
        return (
          <div className="max-w-4xl mx-auto">
             <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-1">Taxonomy Manager</h1>
                <p className="text-sm text-zinc-400">Manage 12 industry sectors, tags, and AI classification rules.</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20">
               <Network className="w-10 h-10 text-zinc-600 mb-3" />
               <p className="text-zinc-400 text-sm">Taxonomy Manager UI will be implemented here.</p>
               <button className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm transition-colors border border-zinc-700 shadow-sm">
                 Sync with Prisma Seed
               </button>
            </div>
          </div>
        );

      case 'Cap Table Engine':
        return (
          <div className="max-w-4xl mx-auto">
             <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-1">Cap Table Engine</h1>
                <p className="text-sm text-zinc-400">Configure equity split rules and simulation variables.</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20">
               <FileSpreadsheet className="w-10 h-10 text-zinc-600 mb-3" />
               <p className="text-zinc-400 text-sm">Cap Table Engine UI will be implemented here.</p>
            </div>
          </div>
        );

      case 'Bounty Quests':
        return (
          <div className="max-w-4xl mx-auto">
             <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-1">Bounty Command Center</h1>
                <p className="text-sm text-zinc-400">Monitor active quests, solver negotiations, and bounty payouts.</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/20">
               <Target className="w-10 h-10 text-zinc-600 mb-3" />
               <p className="text-zinc-400 text-sm">Bounty Dashboard will be implemented here.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto">
             <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-1">{activeView}</h1>
                <p className="text-sm text-zinc-400">Manage settings and configurations for {activeView}.</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64 rounded-xl bg-zinc-900/20 border border-zinc-800/50">
              <p className="text-zinc-500 text-sm">This module is currently empty or under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#111111] text-zinc-300">
      <div className="w-56 border-r border-zinc-800/50 flex flex-col py-4 overflow-y-auto scrollbar-none bg-[#111111]">
        <div className="px-2 space-y-1">
          {sidebarMenus.map((menu) => {
            const hasItems = menu.items && menu.items.length > 0;
            const isExpanded = expanded[menu.id];
            
            return (
              <div key={menu.id} className="mb-0.5">
                 <button
                   onClick={() => {
                     if (hasItems) {
                       toggleExpand(menu.id);
                     } else {
                       setActiveView(menu.label);
                     }
                   }}
                   className={`w-full flex items-center px-3 py-1.5 rounded-lg text-[13px] transition-colors ${
                     (!hasItems && activeView === menu.label)
                        ? 'bg-zinc-800/80 text-white font-medium shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 font-medium'
                   }`}
                 >
                   <span className="w-5 h-5 mr-2 flex items-center justify-center text-zinc-400 shrink-0">{menu.icon}</span>
                   <span className="flex-1 text-left">{menu.label}</span>
                   {hasItems && (
                     <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`} />
                   )}
                 </button>

                 {hasItems && isExpanded && (
                   <div className="mt-1 flex flex-col space-y-0.5 mb-2">
                     {menu.items!.map((item) => (
                       <button
                          key={item}
                          onClick={() => setActiveView(item)}
                          className={`w-full text-left pl-[36px] pr-3 py-1.5 rounded-lg text-[13px] transition-colors ${
                            activeView === item 
                              ? 'bg-zinc-800/80 text-white font-medium shadow-sm' 
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                          }`}
                       >
                         {item}
                       </button>
                     ))}
                   </div>
                 )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a]">
        {renderContent()}
      </div>
    </div>
  );
}
