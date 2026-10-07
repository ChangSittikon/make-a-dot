'use client';

import React, { useState } from 'react';
import { SynergyRoleNode } from '../types';
import {
  INDUSTRIES_LIST,
  BACK_OFFICE_ENGINES,
  CONSTRUCTION_SYNERGY_ROLES,
  TIER_LIGHT_THEME,
} from '../constants';

interface SynergyMatrixTabProps {
  isPcMode?: boolean;
  selectedIndustryId: string;
  selectedEngineId: string | null;
  onSelectIndustry: (id: string) => void;
  onSelectEngine: (id: string) => void;
}

export const SynergyMatrixTab: React.FC<SynergyMatrixTabProps> = ({
  isPcMode = false,
  selectedIndustryId,
  selectedEngineId,
  onSelectIndustry,
  onSelectEngine,
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [filterTier, setFilterTier] = useState<number | 'ALL'>('ALL');
  const [activeRole, setActiveRole] = useState<SynergyRoleNode | null>(null);

  const currentIndustry = INDUSTRIES_LIST.find(i => i.id === selectedIndustryId) || INDUSTRIES_LIST[0];
  const currentEngine = BACK_OFFICE_ENGINES.find(e => e.id === selectedEngineId);

  const displayedRoles = filterTier === 'ALL'
    ? CONSTRUCTION_SYNERGY_ROLES
    : CONSTRUCTION_SYNERGY_ROLES.filter(r => r.tier === filterTier);

  const activeDeliverableTargetIds = new Set(activeRole?.deliverables.map(d => d.targetId) || []);
  const activeDependsOnSourceIds = new Set(activeRole?.dependsOn.map(d => d.sourceId) || []);

  const handleSelectIndustry = (id: string) => {
    onSelectIndustry(id);
    setIsSidebarExpanded(false);
    setActiveRole(null);
  };

  const handleSelectEngine = (id: string) => {
    onSelectEngine(id);
    setIsSidebarExpanded(false);
    setActiveRole(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden relative font-prompt">
      {/* Sidebar Rail */}
      <aside className={`
        h-full bg-white dark:bg-[#16191e] border-r border-gray-100 dark:border-gray-800/80 flex flex-col shrink-0 transition-all duration-300 z-30
        ${isSidebarExpanded ? (isPcMode ? 'w-64 relative shadow-none' : 'w-64 absolute inset-y-0 left-0 shadow-2xl') : 'w-13 relative'}
      `}>
        {/* Top Toggle Row */}
        <div className={`p-2 border-b border-gray-100 dark:border-gray-800/80 flex items-center ${isSidebarExpanded ? 'justify-between px-3' : 'justify-center'}`}>
          {isSidebarExpanded ? (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate">12 สายงานมาตรฐาน</span>
              </div>
              <button 
                onClick={() => setIsSidebarExpanded(false)}
                className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#22272f] text-gray-500 dark:text-gray-300 flex items-center justify-center text-[10px]"
                title="ย่อเมนู (แสดงเฉพาะเลข/ไอคอน)"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarExpanded(true)}
              className="w-8 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-[#22272f] text-gray-500 dark:text-gray-300 flex items-center justify-center text-[10px] transition-colors"
              title="กางดูชื่อเต็ม"
            >
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </button>
          )}
        </div>

        {/* Scrollable Items inside Rail */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1 scrollable-content text-xs">
          {isSidebarExpanded && (
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2 pt-1 mb-1">
              12 สายงาน (DOT017)
            </div>
          )}

          {INDUSTRIES_LIST.map((ind) => {
            const isActive = selectedIndustryId === ind.id && !selectedEngineId;
            return (
              <button
                key={ind.id}
                onClick={() => handleSelectIndustry(ind.id)}
                className={`
                  w-full rounded-xl transition-all flex items-center text-left
                  ${isSidebarExpanded ? 'px-2.5 py-1.5 gap-2.5' : 'p-1.5 justify-center'}
                  ${isActive
                    ? 'bg-red-50 text-brand-red font-bold border border-brand-red/30 shadow-2xs dark:bg-[#222832] dark:text-white dark:border-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#1a1e24]'
                  }
                `}
                title={ind.name}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                  isActive 
                    ? 'bg-brand-red text-white shadow-xs' 
                    : 'bg-gray-100 text-gray-600 dark:bg-[#1e2329] dark:text-gray-400'
                }`}>
                  {ind.code}
                </span>

                {isSidebarExpanded && (
                  <span className="truncate flex-1 text-xs">{ind.name}</span>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-1"></div>

          {isSidebarExpanded && (
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
              กลไกหลังบ้าน (ENGINES)
            </div>
          )}

          {BACK_OFFICE_ENGINES.map((eng) => {
            const isActive = selectedEngineId === eng.id;
            return (
              <button
                key={eng.id}
                onClick={() => handleSelectEngine(eng.id)}
                className={`
                  w-full rounded-xl transition-all flex items-center text-left
                  ${isSidebarExpanded ? 'px-2.5 py-1.5 gap-2.5' : 'p-1.5 justify-center'}
                  ${isActive
                    ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-2xs dark:bg-[#2a1d20] dark:text-white dark:border-red-500/40'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#1a1e24]'
                  }
                `}
                title={eng.thName}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-xs' 
                    : 'bg-gray-100 text-gray-500 dark:bg-[#1e2329] dark:text-gray-400'
                }`}>
                  <i className={eng.icon}></i>
                </span>

                {isSidebarExpanded && (
                  <div className="min-w-0 flex-1">
                    <span className="truncate block text-xs leading-none">{eng.thName}</span>
                    <span className="text-[8px] text-gray-400 font-mono mt-0.5 block">T{eng.tierResponsible}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 h-full overflow-y-auto px-3.5 py-3.5 space-y-4 scrollable-content pb-24">
        {/* Banner */}
        <div className="bg-white dark:bg-[#181b20] rounded-2xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Total Back Office Solution
            </span>
            <span className="text-[9px] text-gray-400">
              {selectedEngineId ? 'Engine View' : 'DOT017'}
            </span>
          </div>
          
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
            {selectedEngineId ? currentEngine?.name : currentIndustry.name}
          </h2>
          
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            {selectedEngineId 
              ? currentEngine?.description 
              : 'ผสานงานหน้าสนามกับการสนับสนุนทางกฎหมาย การเงิน ไอที และการค้ำประกัน'}
          </p>

          {/* Tier Filter Pills */}
          <div className="flex gap-1 overflow-x-auto hide-scrollbar pt-2 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setFilterTier('ALL')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all border ${
                filterTier === 'ALL'
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black'
                  : 'bg-white text-gray-600 border-gray-200 dark:bg-[#1e2329] dark:text-gray-400'
              }`}
            >
              ทุก Tier
            </button>
            {[1, 2, 3, 4, 5].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTier(t)}
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all border ${
                  filterTier === t
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 dark:bg-[#1e2329] dark:text-gray-400'
                }`}
              >
                T{t}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-white dark:bg-[#181b20] p-2 rounded-xl border border-gray-100 dark:border-gray-800 text-center shadow-xs">
            <span className="text-[8px] text-gray-400 block font-medium">ภารกิจ</span>
            <span className="text-xs font-bold text-gray-900 dark:text-white block">{currentIndustry.activeBounties} งาน</span>
          </div>
          <div className="bg-white dark:bg-[#181b20] p-2 rounded-xl border border-gray-100 dark:border-gray-800 text-center shadow-xs">
            <span className="text-[8px] text-gray-400 block font-medium">มูลค่ารวม</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">2.5M ฿</span>
          </div>
          <div className="bg-white dark:bg-[#181b20] p-2 rounded-xl border border-gray-100 dark:border-gray-800 text-center shadow-xs">
            <span className="text-[8px] text-gray-400 block font-medium">การันตี</span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">100% Escrow</span>
          </div>
        </div>

        {/* Interactive Role Cards (Tier 1-5 Bento Grid) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
                ผังความสัมพันธ์ (Synergy Nodes)
              </span>
            </div>
            <span className="text-[9px] text-gray-400">
              {displayedRoles.length} บทบาท
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayedRoles.map((role) => {
              const isCurrent = activeRole?.id === role.id;
              const isDeliverableTarget = activeDeliverableTargetIds.has(role.id);
              const isDependencySource = activeDependsOnSourceIds.has(role.id);
              const isDimmed = activeRole !== null && !isCurrent && !isDeliverableTarget && !isDependencySource;

              const meta = TIER_LIGHT_THEME[role.tier];

              return (
                <div
                  key={role.id}
                  onClick={() => setActiveRole(isCurrent ? null : role)}
                  className={`
                    p-3 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-[#181b20] flex flex-col justify-between shadow-2xs
                    ${isCurrent ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-50/20 dark:bg-[#1c222b]' : ''}
                    ${isDeliverableTarget ? 'ring-1 ring-emerald-500 border-emerald-400 bg-emerald-50/20 dark:bg-[#17221d]' : ''}
                    ${isDependencySource ? 'ring-1 ring-purple-500 border-purple-400 bg-purple-50/20 dark:bg-[#1f1925]' : ''}
                    ${!activeRole ? 'border-gray-100 dark:border-gray-800 hover:border-gray-200' : ''}
                    ${isDimmed ? 'opacity-35 scale-[0.98]' : 'opacity-100 scale-100'}
                  `}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold border ${meta.badge}`}>
                        {meta.label}
                      </span>
                      <span className="text-[8px] text-gray-400 truncate max-w-[100px]">
                        {role.originIndustry}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {role.title}
                    </h3>

                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {role.summary}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between text-[9px]">
                    {isCurrent && (
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                        <i className="fa-solid fa-circle-dot text-[7px]"></i> กำลังตรวจดู
                      </span>
                    )}
                    {isDeliverableTarget && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <i className="fa-solid fa-arrow-down text-[7px]"></i> ผู้รับมอบงาน
                      </span>
                    )}
                    {isDependencySource && (
                      <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                        <i className="fa-solid fa-arrow-up text-[7px]"></i> ผู้ป้อนข้อมูล
                      </span>
                    )}
                    {!isCurrent && !isDeliverableTarget && !isDependencySource && (
                      <span className="text-gray-400">
                        ส่ง {role.deliverables.length} • รับ {role.dependsOn.length}
                      </span>
                    )}

                    <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      ดูสายสัมพันธ์ <i className="fa-solid fa-chevron-right text-[7px] ml-0.5"></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Synergy Bridge Inspector */}
        {activeRole && (
          <div className="bg-white dark:bg-[#181b20] rounded-2xl p-3.5 border border-blue-300 dark:border-blue-500/40 shadow-md space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Synergy Inspector
                  </span>
                  <span className="text-[8px] px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded font-bold">
                    Tier {activeRole.tier}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{activeRole.title}</h4>
              </div>
              <button
                onClick={() => setActiveRole(null)}
                className="text-gray-400 hover:text-gray-600 text-xs p-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 space-y-1">
                <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide block">
                  ส่งมอบผลงานให้:
                </span>
                {activeRole.deliverables.map((item, idx) => {
                  const target = CONSTRUCTION_SYNERGY_ROLES.find(n => n.id === item.targetId);
                  return (
                    <div key={idx} className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span className="truncate">• {target?.title || item.targetId}</span>
                      <span className="text-[8px] text-emerald-700 dark:text-emerald-400 font-medium shrink-0 ml-1">({item.label})</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-500/20 space-y-1">
                <span className="text-[9px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wide block">
                  พึ่งพาข้อมูลจาก:
                </span>
                {activeRole.dependsOn.map((item, idx) => {
                  const source = CONSTRUCTION_SYNERGY_ROLES.find(n => n.id === item.sourceId);
                  return (
                    <div key={idx} className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                      <span className="truncate">• {source?.title || item.sourceId}</span>
                      <span className="text-[8px] text-purple-700 dark:text-purple-400 font-medium shrink-0 ml-1">({item.label})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4 Pillars Card */}
        <div className="bg-white dark:bg-[#181b20] rounded-2xl p-3 border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
            Total Back Office Solution
          </span>
          <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
            4 เสาหลักสนับสนุนงานก่อสร้าง (01)
          </h3>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
              <span className="text-[8px] font-bold text-blue-700 dark:text-blue-400 block">12 กฎหมาย</span>
              <span className="font-bold text-gray-900 dark:text-white block text-[11px]">ตรวจโฉนด & สัญญา</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">ยื่นขออนุญาต อ.1</span>
            </div>

            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
              <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-400 block">08 การเงิน/บัญชี</span>
              <span className="font-bold text-gray-900 dark:text-white block text-[11px]">ถอดแบบ BOQ & ทุน</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">คุมงบ ยื่นกู้โครงการ</span>
            </div>

            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
              <span className="text-[8px] font-bold text-purple-700 dark:text-purple-400 block">03 ไอที/เทคโนโลยี</span>
              <span className="font-bold text-gray-900 dark:text-white block text-[11px]">Smart Building IoT</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">เซ็นเซอร์ประหยัดพลังงาน</span>
            </div>

            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
              <span className="text-[8px] font-bold text-amber-700 dark:text-amber-400 block">Tier 3 ค้ำประกัน</span>
              <span className="font-bold text-gray-900 dark:text-white block text-[11px]">การันตีสัญญา & QC</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">ไม่ทิ้งงาน 100% ปลดล็อก</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
