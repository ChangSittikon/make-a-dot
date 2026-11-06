'use client';

import React, { useState } from 'react';
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
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>(initialSubTab);
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
              <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse"></span>
                    <h2 className="text-sm sm:text-base font-extrabold text-[#0F172A] dark:text-white">
                      {activeSidebarTab === 'highlight' && 'เครื่องยนต์เชื่อมดอท 6 แกนเอกลักษณ์'}
                      {activeSidebarTab === 'universal' && 'เครื่องมือสากลพื้นฐานมนุษยชาติ (D2.01 - D2.08)'}
                      {activeSidebarTab === 'construction' && '01 ก่อสร้างและอสังหาริมทรัพย์ (D3.01.00 - D3.01.07)'}
                      {activeSidebarTab.startsWith('ind_') && 'เครื่องมือเฉพาะทางประจำสายงานอุตสาหกรรม'}
                    </h2>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    มาตรฐานรับรองโดย: Tier 4 Domain Director | ข้อมูลหน้างานจริงโดย: Tier 2 Professional
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 inline mr-1" />
                    HITL VERIFIED
                  </span>
                </div>
              </div>

              {/* Tool Cards Grid - Pure Swiss Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTools.map((tool) => {
                  const Icon = ICON_MAP[tool.iconName] || Sparkles;
                  return (
                    <div
                      key={tool.id}
                      data-tool-id={tool.id}
                      onClick={() => setSelectedTool(tool)}
                      className="bg-white dark:bg-[#131926] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 hover:border-[#0F172A] dark:hover:border-gray-600 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0F172A] text-white">
                            {tool.code}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {tool.version}
                          </span>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#0F172A] dark:text-white shrink-0 group-hover:bg-[#E11D48] group-hover:text-white transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-tight group-hover:text-[#E11D48] transition-colors">
                              {tool.name}
                            </h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {tool.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Footer CTA */}
                      <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-gray-400 text-[10px]">คลิกเปิดเครื่องมือโต้ตอบ</span>
                        <span className="font-bold text-[#0F172A] dark:text-white flex items-center gap-0.5 group-hover:text-[#E11D48] transition-colors">
                          เปิดใช้งาน <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
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
