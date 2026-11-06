'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { HumanStateContext, EcosystemTool } from '@/lib/ecosystem-tools/types';
import { HIGHLIGHT_TOOLS, UNIVERSAL_CORE_TOOLS } from '@/lib/ecosystem-tools/nd-matrix-and-core-registry';
import { CONSTRUCTION_TOOLS, OTHER_INDUSTRIES_TOOLS } from '@/lib/ecosystem-tools/specialized-industry-registry';
import { NdHumanStateBar } from '../NdHumanStateBar';
import { ToolInteractiveModal } from '../ToolInteractiveModal';
import { ExpertDemandMonitoringView } from '../ExpertDemandMonitoringView';
import {
  Sparkles,
  Layers,
  Building,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  PieChart,
  Cpu,
  Coins,
  Radar,
  Scale,
  Calculator,
  Clock,
  FileCheck,
  MessageSquareText,
  ShieldAlert,
  Activity,
  GraduationCap,
  Boxes,
  Receipt,
  UserCheck,
  Truck,
  ClipboardCheck,
  FileSpreadsheet,
  Server,
  BookOpen,
  Utensils,
  Leaf,
  BadgeDollarSign,
  Hotel,
  Wrench,
  Video,
  BookCheck,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Radar, Coins, Cpu, Route: Sparkles, PieChart, ShieldAlert,
  Scale, Calculator, Clock, FileCheck, MessageSquareText, ShieldCheck, Activity, GraduationCap,
  Building, Boxes, Receipt, UserCheck, Truck, ClipboardCheck, FileSpreadsheet,
  Server, BookOpen, Utensils, Leaf, BadgeDollarSign, Hotel, Wrench, Video, BookCheck,
};

interface NdToolsTabProps {
  initialSubTab?: string;
}

export const NdToolsTab: React.FC<NdToolsTabProps> = ({ initialSubTab = 'highlight' }) => {
  const searchParams = useSearchParams();
  const urlSubTab = searchParams ? (searchParams.get('subtab') || initialSubTab) : initialSubTab;
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>(urlSubTab);
  const [selectedTool, setSelectedTool] = useState<EcosystemTool | null>(null);

  const [humanContext, setHumanContext] = useState<HumanStateContext>({
    activeD1: 'D1.1',
    activeSubD1: 'D1.1.1',
    isStressAlert: false,
  });

  const sidebarItems = [
    { id: 'demand', label: 'ดีมานด์', icon: TrendingUp, desc: 'มอนิเตอร์ดีมานด์ผู้เชี่ยวชาญ' },
    { id: 'highlight', label: 'เชื่อมดอท', icon: Sparkles, desc: '6 เครื่องยนต์เอกลักษณ์' },
    { id: 'universal', label: 'เครื่องมือสากล', icon: Layers, desc: 'D2.01 - D2.08' },
    { id: 'construction', label: '01 ก่อสร้าง/อสังหาฯ', icon: Building, desc: 'D3.01.00 - D3.01.07' },
    { id: 'ind_02', label: '02 การแพทย์', icon: Activity, desc: 'เวชระเบียน & FEFO' },
    { id: 'ind_03', label: '03 เทคโนโลยี/ไอที', icon: Server, desc: 'FinOps & Cloud' },
    { id: 'ind_04', label: '04 การศึกษา', icon: BookOpen, desc: 'EdTech & Rubric' },
    { id: 'ind_05', label: '05 อาหาร/เครื่องดื่ม', icon: Utensils, desc: 'Food Cost & KDS' },
    { id: 'ind_06', label: '06 เกษตรกรรม', icon: Leaf, desc: 'Smart Farm & GAP' },
    { id: 'ind_07', label: '07 ขนส่ง', icon: Truck, desc: 'Fleet & Route' },
    { id: 'ind_08', label: '08 การเงิน/บัญชี', icon: BadgeDollarSign, desc: 'AML/KYC & Credit' },
    { id: 'ind_09', label: '09 ท่องเที่ยว/บริการ', icon: Hotel, desc: 'RevPAR & OTA' },
    { id: 'ind_10', label: '10 โรงงาน/ผลิต', icon: Wrench, desc: 'OEE & TPM' },
    { id: 'ind_11', label: '11 สื่อ/บันเทิง', icon: Video, desc: 'IP & Production' },
    { id: 'ind_12', label: '12 กฎหมาย', icon: BookCheck, desc: 'Due Diligence' },
  ];

  const getActiveTools = (): EcosystemTool[] => {
    switch (activeSidebarTab) {
      case 'highlight': return HIGHLIGHT_TOOLS;
      case 'universal': return UNIVERSAL_CORE_TOOLS;
      case 'construction': return CONSTRUCTION_TOOLS;
      default:
        return OTHER_INDUSTRIES_TOOLS[activeSidebarTab] || [];
    }
  };

  const activeTools = getActiveTools();

  const categoryTitle =
    activeSidebarTab === 'highlight'
      ? 'เครื่องยนต์เชื่อมดอท 6 แกนเอกลักษณ์'
      : activeSidebarTab === 'universal'
      ? 'เครื่องมือสากลพื้นฐานมนุษยชาติ'
      : activeSidebarTab === 'construction'
      ? '01 ก่อสร้างและอสังหาริมทรัพย์'
      : activeTools[0]?.categoryLabel || 'เครื่องมือเฉพาะทางประจำสายงาน';

  return (
    <div className="flex-1 flex flex-col w-full h-full font-prompt bg-white dark:bg-[#0F172A] overflow-hidden">
      {/* Top Active N-D Human State Bar */}
      <NdHumanStateBar context={humanContext} onChange={setHumanContext} />

      {/* Main Split: Left Sidebar + Right Tool Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-[62px] sm:w-[70px] shrink-0 bg-[#F8FAFC] dark:bg-[#121620] overflow-y-auto pb-24 border-r border-[#E2E8F0] dark:border-gray-800 scrollbar-none flex flex-col">
          {sidebarItems.map((item) => {
            const isActive = activeSidebarTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSidebarTab(item.id)}
                className={`w-full flex flex-col items-center justify-center py-2.5 px-0.5 border-l-[3px] transition-all text-center ${
                  isActive
                    ? 'border-[#E11D48] bg-white dark:bg-[#0F172A] text-[#E11D48] font-bold shadow-2xs'
                    : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 text-xs transition-colors ${
                  isActive
                    ? 'bg-red-50 text-[#E11D48] dark:bg-red-950/40'
                    : 'bg-gray-200/60 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className={`text-[8.5px] leading-tight px-0.5 line-clamp-2 ${isActive ? 'text-[#E11D48] font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#0F172A] p-3 sm:p-5 space-y-4">
          
          {activeSidebarTab === 'demand' ? (
            <ExpertDemandMonitoringView />
          ) : (
            <div className="space-y-4 animate-fade-in">
              
              {/* Category Governance Header */}
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse"></span>
                    <h2 className="text-xs sm:text-sm font-extrabold text-[#0F172A] dark:text-white">
                      {categoryTitle}
                    </h2>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    รับรองโดย: Tier 4 Director • ข้อมูลโดย: Tier 2 Pro
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-900">
                    VERIFIED STANDARD
                  </span>
                </div>
              </div>

              {/* Tool Cards Grid - Clean Vertical App Icon Card (Swiss Style) */}
              <div className="grid grid-cols-2 gap-2.5">
                {activeTools.map((tool) => {
                  const Icon = ICON_MAP[tool.iconName] || Sparkles;
                  return (
                    <button
                      key={tool.id}
                      data-tool-id={tool.id}
                      onClick={() => setSelectedTool(tool)}
                      className="bg-white dark:bg-[#131926] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-3 hover:border-slate-900 dark:hover:border-gray-500 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col items-center justify-between group"
                    >
                      <div className="flex items-center justify-end w-full mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-rose-50 group-hover:border-rose-200 group-hover:text-rose-600 transition-colors mb-2">
                        <Icon className="w-5 h-5" />
                      </div>

                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 text-center w-full">
                        {tool.title || tool.name}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Interactive Tool Engine Modal */}
      <ToolInteractiveModal
        tool={selectedTool}
        context={humanContext}
        onClose={() => setSelectedTool(null)}
      />
    </div>
  );
};
