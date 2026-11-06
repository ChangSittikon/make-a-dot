'use client';

import React, { useState } from 'react';
import { INDUSTRIES_LIST } from '../constants';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';
import { HiddenNodesScannerModal } from '../production/HiddenNodesScannerModal';
import { ExpertDemandMonitoringView } from '../ExpertDemandMonitoringView';

interface ProcessingTabProps {
  promptInput?: string;
  setPromptInput?: (val: string) => void;
  isProcessing?: boolean;
  processingPhase?: number;
  hasAnalyzed?: boolean;
  onRunProcessing?: () => void;
  onNavigateToEcosystem?: () => void;
  initialSubTab?: string;
}

interface ProcessTabItem {
  id: string;
  code: string;
  label: string;
  icon: string;
  desc: string;
  color?: string;
  badge?: string;
}

export const ProcessingTab: React.FC<ProcessingTabProps> = ({
  onNavigateToEcosystem,
  initialSubTab,
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(initialSubTab || 'demand');
  const [localPrompt, setLocalPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  // 14 Tabs: 1 รวม + 12 หมวดอุตสาหกรรม + 1 ดอทปริศนา
  const TABS_14: ProcessTabItem[] = [
    {
      id: 'demand',
      code: 'ดีมานด์',
      label: 'มอนิเตอร์ดีมานด์',
      icon: 'fa-solid fa-chart-line',
      desc: 'มอนิเตอร์ดีมานด์ผู้เชี่ยวชาญ ดูความต้องการของ Requester (อาชีพ, ทักษะ Step 5) เพื่อปรับกลยุทธ์แพลตฟอร์ม',
      color: '#ef4444',
      badge: 'Demand',
    },
    {
      id: 'all',
      code: 'รวม',
      label: 'รวม',
      icon: 'fa-solid fa-shapes',
      desc: 'ศูนย์กลางประมวลผลรวมทุกกลุ่มอุตสาหกรรม และภาพรวมระบบนิเวศ Make a dot',
      color: '#ef4444',
    },
    ...INDUSTRIES_LIST.map((ind) => ({
      id: ind.id,
      code: ind.code,
      label: ind.name,
      icon: ind.icon,
      desc: ind.description,
    })),
    {
      id: 'mystery',
      code: '??',
      label: 'ดอทปริศนา',
      icon: 'fa-solid fa-wand-magic-sparkles',
      desc: 'โจทย์ข้ามสายงาน นวัตกรรมนอกกรอบ ธุรกิจไฮบริด หรือโปรเจกต์ลับที่ยังจัดหมวดหมู่ไม่ได้',
      color: '#a855f7',
      badge: 'Secret',
    },
  ];

  const activeTab = TABS_14.find((t) => t.id === activeTabId) || TABS_14[0];
  const activeSubIndustries = ALL_SUB_INDUSTRIES[activeTabId] || [];

  const handleProcessSubmit = () => {
    if (!localPrompt.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(
        `ประมวลผลสำเร็จสำหรับ [${activeTab.label}]: ระบบวิเคราะห์โครงสร้างพบ 4 มิติสำคัญ สามารถแปลงเป็นเควสต์และกำหนดงบประมาณ Escrow ได้ทันที`
      );
    }, 1200);
  };

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* Left Sidebar (14 Tabs) - Compact 2/3 width */}
      <div className="w-[56px] sm:w-[62px] shrink-0 bg-[#f8f9fa] dark:bg-[#16181f] overflow-y-auto pb-24 border-r border-gray-100 dark:border-gray-800/80 scrollbar-none flex flex-col">
        {TABS_14.map((tab) => {
          const isActive = activeTabId === tab.id;
          const isMystery = tab.id === 'mystery';
          const isAll = tab.id === 'all';
          const isDemand = tab.id === 'demand';

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setAnalysisResult(null);
              }}
              className={`w-full flex flex-col items-center justify-center py-2 px-0.5 border-l-[2.5px] transition-all text-center relative ${
                isActive
                  ? isMystery
                    ? 'border-purple-500 bg-white dark:bg-[#12141a] text-purple-600 dark:text-purple-400 font-bold shadow-2xs'
                    : isAll
                    ? 'border-brand-red bg-white dark:bg-[#12141a] text-brand-red font-bold shadow-2xs'
                    : 'border-brand-red bg-white dark:bg-[#12141a] text-brand-red font-bold shadow-2xs'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-[#1e2129]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center mb-0.5 text-[10px] transition-colors ${
                  isActive
                    ? isMystery
                      ? 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300'
                      : 'bg-red-50 text-brand-red dark:bg-red-950/50'
                    : isMystery
                    ? 'bg-purple-100/70 dark:bg-purple-950/40 text-purple-500 dark:text-purple-400'
                    : 'bg-gray-200/60 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                <i className={tab.icon}></i>
              </span>
              <span
                className={`text-[8px] font-mono leading-none mb-0.5 ${
                  isMystery ? 'text-purple-500 font-bold' : isAll ? 'text-brand-red font-bold' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.code}
              </span>
              <span
                className={`text-[8px] sm:text-[8.5px] leading-[1.15] px-0.5 line-clamp-2 ${
                  isActive
                    ? isMystery
                      ? 'text-purple-600 dark:text-purple-400 font-bold'
                      : 'text-brand-red font-bold'
                    : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a] p-3 sm:p-4 space-y-4">
        {/* TAB 0: มอนิเตอร์ดีมานด์ผู้เชี่ยวชาญ (EXPERT DEMAND MONITORING) */}
        {activeTabId === 'demand' && (
          <ExpertDemandMonitoringView />
        )}

        {/* TAB 1: รวม (ALL OVERVIEW) */}
        {activeTabId === 'all' && (
          <div className="space-y-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-transparent p-4 rounded-2xl border border-red-500/20">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-950/60 text-brand-red flex items-center justify-center text-xs">
                  <i className="fa-solid fa-shapes"></i>
                </span>
                <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">
                  ศูนย์รวมการประมวลผล (Unified Processing Hub)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                ประมวลผลรวมทุกกลุ่มอุตสาหกรรม
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ภาพรวมโจทย์ ปัญหา และระบบนิเวศน์ทั้ง 12 กลุ่มอุตสาหกรรม พร้อมพื้นที่ทดลองสำหรับดอทปริศนา
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-gray-50 dark:bg-[#181a1f] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 block">อุตสาหกรรม</span>
                <span className="text-lg font-black text-gray-900 dark:text-white font-mono">12+1</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">รวมดอทปริศนา</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#181a1f] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 block">เควสต์ในระบบ</span>
                <span className="text-lg font-black text-blue-600 dark:text-sky-400 font-mono">240+</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Active Tasks</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#181a1f] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 block">สถานะระบบ</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                  Online
                </span>
                <span className="text-[9px] text-gray-400 block mt-0.5">AI Engine</span>
              </div>
            </div>

            {/* Industry Directory Navigation Cards */}
            <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-list-check text-brand-red text-xs"></i>
                  เลือกเจาะลึกรายกลุ่มอุตสาหกรรม
                </h3>
                <span className="text-[10px] text-gray-400">คลิกเพื่อสลับแท็บ</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES_LIST.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setActiveTabId(ind.id)}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:border-brand-red/40 dark:hover:border-red-500/40 bg-gray-50/50 dark:bg-[#13151b] hover:bg-red-50/20 dark:hover:bg-red-950/20 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-gray-200/60 dark:bg-gray-800 group-hover:bg-red-50 group-hover:text-brand-red dark:group-hover:bg-red-950/60 text-gray-600 dark:text-gray-300 flex items-center justify-center text-[10px] transition-colors">
                        <i className={ind.icon}></i>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-mono text-gray-400 font-bold">{ind.code}</span>
                          <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate block">
                            {ind.name}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-400 block truncate">
                          {ind.activeBounties} เควสต์
                        </span>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Mystery Dot Tile */}
                <button
                  onClick={() => setActiveTabId('mystery')}
                  className="col-span-2 p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent hover:border-purple-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center text-[10px]">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                      </span>
                      <div>
                        <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">
                          ดอทปริศนา (Mystery Dot)
                        </span>
                        <span className="text-[10px] text-gray-400">
                          นวัตกรรมและโจทย์ไฮบริดข้ามสายงาน
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                      Secret
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABS 2-13: 12 หมวดอุตสาหกรรม (INDUSTRY DETAILS) */}
        {activeTabId !== 'all' && activeTabId !== 'mystery' && activeTabId !== 'demand' && (
          <div className="space-y-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-orange-500/10 via-brand-red/10 to-transparent p-4 rounded-2xl border border-orange-500/20">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-brand-red flex items-center justify-center text-sm shrink-0">
                    <i className={activeTab.icon}></i>
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {activeTab.code}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                        {activeTab.label}
                      </h2>
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shrink-0">
                  สายงานที่ {activeTab.code}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                {activeTab.desc}
              </p>
            </div>

            {/* Sub-categories in this Industry */}
            {activeSubIndustries.length > 0 && (
              <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-2.5">
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 block">
                  หมวดหมู่หลักในสายงานนี้ ({activeSubIndustries.length} หมวด):
                </span>
                <div className="space-y-2">
                  {activeSubIndustries.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#13151b] border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                          {sub.code} {sub.name}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">
                          {sub.segments?.length || 0} รูปแบบ
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Input Card */}
            <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  ระบุโจทย์ปัญหาหรือไอเดียเพื่อประมวลผล:
                </span>
                <button
                  type="button"
                  onClick={() => setShowScannerModal(true)}
                  className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[10.5px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>🔍 สแกนทุนชีวิตแฝง (0 บ.)</span>
                </button>
              </div>
              <textarea
                value={localPrompt}
                onChange={(e) => setLocalPrompt(e.target.value)}
                placeholder={`พิมพ์โจทย์ที่เกี่ยวข้องกับ ${activeTab.label} เช่น ต้องการทีมงาน, ปัญหามาตรฐาน, หรือการต่อยอดธุรกิจ...`}
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12141a] p-3 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-red/40 resize-none"
              />

              <button
                onClick={handleProcessSubmit}
                disabled={isAnalyzing}
                className="w-full py-3 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {isAnalyzing ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                    <span>กำลังประมวลผลวิเคราะห์โจทย์...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-bolt text-xs text-amber-400"></i>
                    <span>ประมวลผลโจทย์ในสายงานนี้</span>
                  </>
                )}
              </button>

              {analysisResult && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
                  <i className="fa-solid fa-check-circle mr-1.5 text-emerald-600"></i>
                  {analysisResult}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 14: ดอทปริศนา (MYSTERY DOT) */}
        {activeTabId === 'mystery' && (
          <div className="space-y-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-transparent p-4 rounded-2xl border border-purple-500/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 flex items-center justify-center text-sm shadow-xs">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </span>
                <div>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                    พื้นที่ทดลองพิเศษ (Frontier Sandbox)
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    ดอทปริศนา (Mystery Dot)
                  </h2>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                พื้นที่สำหรับโจทย์ปัญหาหลุดกรอบ โครงการข้ามสายงาน (Cross-disciplinary) ธุรกิจไฮบริด หรือเควสต์ลับที่ยังไม่มีชื่อเรียกใน 12 อุตสาหกรรมดั้งเดิม
              </p>
            </div>

            {/* Mystery Features */}
            <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-purple-100 dark:border-purple-900/40 p-4 shadow-xs space-y-3">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">
                ลักษณะของดอทปริศนา:
              </span>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/50 dark:bg-[#161421]">
                  <i className="fa-solid fa-atom text-purple-500 mt-0.5 text-xs"></i>
                  <span><strong>การผสมข้ามสายพันธุ์:</strong> เช่น เกษตรกรรม + Web3 + การแพทย์ หรือ ศิลปะ + วิศวกรรมเสียงลึก</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/50 dark:bg-[#161421]">
                  <i className="fa-solid fa-mask text-purple-500 mt-0.5 text-xs"></i>
                  <span><strong>Stealth & Frontier Quests:</strong> โปรเจกต์วิจัยลับที่ยังไม่อยากเปิดเผยหมวดหมู่อุตสาหกรรม</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-xl bg-purple-50/50 dark:bg-[#161421]">
                  <i className="fa-solid fa-compass-drafting text-purple-500 mt-0.5 text-xs"></i>
                  <span><strong>โมเดลธุรกิจไร้พรมแดน:</strong> ปัญหาที่ต้องการผู้แก้แบบ Unconventional Mindset</span>
                </div>
              </div>
            </div>

            {/* Mystery Input Card */}
            <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-purple-100 dark:border-purple-900/40 p-4 shadow-xs space-y-3">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                พิมพ์โจทย์ปริศนาเพื่อเริ่ม Deconstruction:
              </span>
              <textarea
                value={localPrompt}
                onChange={(e) => setLocalPrompt(e.target.value)}
                placeholder="อธิบายโจทย์ที่ไม่เข้าพวก หรือไอเดียสุดล้ำที่ยังไม่มีหมวดหมู่ตายตัว..."
                rows={3}
                className="w-full rounded-xl border border-purple-200 dark:border-purple-900/50 bg-white dark:bg-[#12141a] p-3 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
              />

              <button
                onClick={handleProcessSubmit}
                disabled={isAnalyzing}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isAnalyzing ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin text-xs"></i>
                    <span>กำลังประมวลผลดอทปริศนา...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                    <span>ปลดล็อก & ประมวลผลดอทปริศนา</span>
                  </>
                )}
              </button>

              {analysisResult && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-800 dark:text-purple-300">
                  <i className="fa-solid fa-sparkles mr-1.5 text-purple-500"></i>
                  {analysisResult}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <HiddenNodesScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onApplyToCapTable={(valData) => {
          const appendText = `[ข้อมูลทุนชีวิตแฝงที่สแกนพบ]: มูลค่าประเมินรวม ฿${valData.totalValuationThb.toLocaleString()} บาท (หยาดเหงื่อ: ฿${valData.sweatThb.toLocaleString()} / เครื่องมือ: ฿${valData.equipThb.toLocaleString()} / ทำเล: ฿${valData.venueThb.toLocaleString()})`;
          setLocalPrompt(prev => prev ? `${prev}
${appendText}` : appendText);
        }}
      />
    </div>
  );
};
