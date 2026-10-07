'use client';

import React, { useState, Suspense } from 'react';
import { BottomTabBar } from '@/components/shared/BottomTabBar';
import { MainTabType, CapTableItem } from '@/components/ecosystem/types';
import {
  INITIAL_CAP_TABLE,
  INDUSTRY_01_SUB_LIST,
  SUB_INDUSTRIES_MAP,
  INDUSTRY_CAP_PRESETS,
} from '@/components/ecosystem/constants';
import { ProcessingTab } from '@/components/ecosystem/tabs/ProcessingTab';
import { CapitalTab } from '@/components/ecosystem/tabs/CapitalTab';
import { SolverTab } from '@/components/ecosystem/tabs/SolverTab';
import { SynergyMatrixTab } from '@/components/ecosystem/tabs/SynergyMatrixTab';

/* Tab Header Bar Items */
const MAIN_TABS = [
  { id: 'PROCESS', label: 'ประมวลผล', icon: 'fa-solid fa-microchip', badge: 'AI' },
  { id: 'CAPITAL', label: 'แปลงทรัพยากรให้เป็นทุน', icon: 'fa-solid fa-coins', badge: 'Cap Table' },
  { id: 'SOLVER', label: 'เครื่องมือแก้ปัญหา', icon: 'fa-solid fa-toolbox', badge: '5 Tools' },
  { id: 'ECOSYSTEM', label: 'ผังระบบนิเวศ', icon: 'fa-solid fa-network-wired', badge: 'Matrix' },
];

function EcosystemContent() {
  const [viewMode, setViewMode] = useState<'MOBILE' | 'PC'>('MOBILE');
  const [mainTab, setMainTab] = useState<MainTabType>('PROCESS');

  /* Tab 1 State: AI Processing Pipeline */
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<number>(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  /* Tab 2 State: Cap Table Simulation */
  const [selectedIndustryId, setSelectedIndustryId] = useState('ind_01');
  const [selectedSubIndustryId, setSelectedSubIndustryId] = useState('sub_01_res');
  const [selectedSegmentId, setSelectedSegmentId] = useState('seg_res_1');
  const [capTableData, setCapTableData] = useState<CapTableItem[]>(INITIAL_CAP_TABLE);

  /* Tab 4 State: Synergy Matrix */
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);

  /* Trigger Pipeline Simulation */
  const handleRunProcessing = () => {
    if (!promptInput.trim()) {
      setPromptInput('ต้องการสร้างอาคารพาณิชย์ 3 ชั้นแต่งบจำกัด ต้องการผู้รับเหมาหลักและผู้ค้ำประกันป้องกันทิ้งงาน');
    }
    setIsProcessing(true);
    setProcessingPhase(1);
    setHasAnalyzed(false);

    setTimeout(() => setProcessingPhase(2), 700);
    setTimeout(() => setProcessingPhase(3), 1400);
    setTimeout(() => setProcessingPhase(4), 2100);
    setTimeout(() => {
      setIsProcessing(false);
      setHasAnalyzed(true);
    }, 2800);
  };

  /* Cap Table Event Handlers */
  const handleUpdateCapItem = (id: string, val: number) => {
    setCapTableData(prev => prev.map(item => item.id === id ? { ...item, value: val } : item));
  };

  const handleSelectIndustryForCapTable = (indId: string) => {
    setSelectedIndustryId(indId);
    if (indId === 'ind_01') {
      setSelectedSubIndustryId('sub_01_res');
      setSelectedSegmentId('seg_res_1');
      const sub = INDUSTRY_01_SUB_LIST.find(s => s.id === 'sub_01_res')!;
      const seg = sub.segments?.find(s => s.id === 'seg_res_1');
      const preset = seg ? seg.preset : sub.preset;
      setCapTableData([
        { id: 'cash', name: 'เงินสด (Cash)', value: preset.cash.val, color: '#56b6f7' },
        { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: preset.sweat.val, color: '#9d9ff7' },
        { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: preset.equip.val, color: '#3bd18e' },
        { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: preset.venue.val, color: '#a3e635' },
        { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: preset.ip.val, color: '#f3e8c8' },
      ]);
    } else {
      setSelectedSubIndustryId('');
      setSelectedSegmentId('');
      const preset = INDUSTRY_CAP_PRESETS[indId] || INDUSTRY_CAP_PRESETS.ind_01;
      setCapTableData([
        { id: 'cash', name: 'เงินสด (Cash)', value: preset.cash.val, color: '#56b6f7' },
        { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: preset.sweat.val, color: '#9d9ff7' },
        { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: preset.equip.val, color: '#3bd18e' },
        { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: preset.venue.val, color: '#a3e635' },
        { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: preset.ip.val, color: '#f3e8c8' },
      ]);
    }
  };

  const handleSelectSubIndustry = (subId: string) => {
    setSelectedSubIndustryId(subId);
    const subList = SUB_INDUSTRIES_MAP[selectedIndustryId] || [];
    const sub = subList.find(s => s.id === subId);
    if (sub) {
      const firstSeg = sub.segments && sub.segments.length > 0 ? sub.segments[0] : null;
      setSelectedSegmentId(firstSeg ? firstSeg.id : '');
      const preset = firstSeg ? firstSeg.preset : sub.preset;
      setCapTableData([
        { id: 'cash', name: 'เงินสด (Cash)', value: preset.cash.val, color: '#56b6f7' },
        { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: preset.sweat.val, color: '#9d9ff7' },
        { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: preset.equip.val, color: '#3bd18e' },
        { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: preset.venue.val, color: '#a3e635' },
        { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: preset.ip.val, color: '#f3e8c8' },
      ]);
    }
  };

  const handleSelectSegment = (segId: string) => {
    setSelectedSegmentId(segId);
    const subList = SUB_INDUSTRIES_MAP[selectedIndustryId] || [];
    const sub = subList.find(s => s.id === selectedSubIndustryId);
    if (sub && sub.segments) {
      const seg = sub.segments.find(s => s.id === segId);
      if (seg) {
        setCapTableData([
          { id: 'cash', name: 'เงินสด (Cash)', value: seg.preset.cash.val, color: '#56b6f7' },
          { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: seg.preset.sweat.val, color: '#9d9ff7' },
          { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: seg.preset.equip.val, color: '#3bd18e' },
          { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: seg.preset.venue.val, color: '#a3e635' },
          { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: seg.preset.ip.val, color: '#f3e8c8' },
        ]);
      }
    }
  };

  const handleResetPreset = () => {
    const subList = SUB_INDUSTRIES_MAP[selectedIndustryId] || [];
    const activeSub = subList.find(s => s.id === selectedSubIndustryId);
    const activeSeg = activeSub?.segments?.find(s => s.id === selectedSegmentId);
    const currentPreset = activeSeg 
      ? activeSeg.preset 
      : (activeSub ? activeSub.preset : (INDUSTRY_CAP_PRESETS[selectedIndustryId] || INDUSTRY_CAP_PRESETS.ind_01));
    
    setCapTableData([
      { id: 'cash', name: 'เงินสด (Cash)', value: currentPreset.cash.val, color: '#56b6f7' },
      { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: currentPreset.sweat.val, color: '#9d9ff7' },
      { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: currentPreset.equip.val, color: '#3bd18e' },
      { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: currentPreset.venue.val, color: '#a3e635' },
      { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: currentPreset.ip.val, color: '#f3e8c8' },
    ]);
  };

  /* ---------------------------------------------------------------- */
  /*  VIEW 1: MOBILE FIRST (DEFAULT INSIDE PHONE FRAME)                */
  /* ---------------------------------------------------------------- */
  if (viewMode === 'MOBILE') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-8 transition-colors duration-300">
        {/* Mobile Device Container Frame (430px x 900px) */}
        <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-[#fdfdfd] dark:bg-[#111315] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
          
          {/* Top Header Bar */}
          <header className="px-4 py-2.5 bg-white dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0 z-30">
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">
                MAKE A DOT Solutions
              </span>
              <h1 className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight mt-0.5">
                เชื่อมดอท
              </h1>
            </div>

            {/* Top Right Actions: PC Mode Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('PC')}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full text-[10px] font-bold transition-all shadow-xs"
                title="สลับเป็นโหมดจอ PC"
              >
                <i className="fa-solid fa-display text-[9px]"></i>
                <span>จอ PC</span>
              </button>
            </div>
          </header>

          {/* Subheader: 4 Main Tabs Bar */}
          <div className="px-2 py-1.5 bg-gray-50/90 dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex gap-1 overflow-x-auto hide-scrollbar shrink-0 z-20">
            {MAIN_TABS.map((tab) => {
              const isActive = mainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMainTab(tab.id as MainTabType)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] whitespace-nowrap transition-all shrink-0
                    ${isActive
                      ? 'bg-gray-900 text-white font-bold shadow-xs dark:bg-white dark:text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-[#20252e]'
                    }
                  `}
                >
                  <i className={`${tab.icon} text-[9px] ${isActive ? 'text-brand-red' : ''}`}></i>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content Container */}
          <div className="flex-1 flex overflow-hidden relative">
            {mainTab === 'PROCESS' && (
              <ProcessingTab
                promptInput={promptInput}
                setPromptInput={setPromptInput}
                isProcessing={isProcessing}
                processingPhase={processingPhase}
                hasAnalyzed={hasAnalyzed}
                onRunProcessing={handleRunProcessing}
                onNavigateToEcosystem={() => setMainTab('ECOSYSTEM')}
              />
            )}

            {mainTab === 'CAPITAL' && (
              <CapitalTab
                selectedIndustryId={selectedIndustryId}
                selectedSubIndustryId={selectedSubIndustryId}
                selectedSegmentId={selectedSegmentId}
                capTableData={capTableData}
                onSelectIndustry={handleSelectIndustryForCapTable}
                onSelectSubIndustry={handleSelectSubIndustry}
                onSelectSegment={handleSelectSegment}
                onUpdateCapItem={handleUpdateCapItem}
                onResetPreset={handleResetPreset}
              />
            )}

            {mainTab === 'SOLVER' && <SolverTab />}

            {mainTab === 'ECOSYSTEM' && (
              <SynergyMatrixTab
                isPcMode={false}
                selectedIndustryId={selectedIndustryId}
                selectedEngineId={selectedEngineId}
                onSelectIndustry={(id) => {
                  setSelectedIndustryId(id);
                  setSelectedEngineId(null);
                }}
                onSelectEngine={(id) => setSelectedEngineId(id)}
              />
            )}
          </div>

          {/* Bottom Tab Bar of Phone Frame */}
          <BottomTabBar />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  VIEW 2: PC CONSOLE (EXPANSIVE MASTER-DETAIL LAYOUT)             */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt flex flex-col items-center p-4 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-7xl h-[92vh] min-h-[760px] bg-[#fdfdfd] dark:bg-[#111315] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top PC Master Header */}
        <header className="px-6 py-3.5 bg-white dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse"></span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">
                Executive Ecosystem & Solution Console
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                MAKE A DOT • เชื่อมดอท (ศูนย์รวมเครื่องมือแก้ปัญหา & สร้างโปรเจกต์)
              </span>
            </div>
          </div>

          {/* Top Right: Switch Back to Mobile Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('MOBILE')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#22272f] dark:hover:bg-[#2a303a] text-gray-800 dark:text-white rounded-full text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 shadow-2xs"
              title="สลับกลับไปยังจอมือถือ"
            >
              <i className="fa-solid fa-mobile-screen text-xs"></i>
              <span>กลับจอมือถือ</span>
            </button>
          </div>
        </header>

        {/* PC Subheader: 4 Main Tabs Bar */}
        <div className="px-6 py-2 bg-gray-50 dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            {MAIN_TABS.map((tab) => {
              const isActive = mainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMainTab(tab.id as MainTabType)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all
                    ${isActive
                      ? 'bg-gray-900 text-white font-bold shadow-xs dark:bg-white dark:text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#20252e]'
                    }
                  `}
                >
                  <i className={`${tab.icon} text-xs ${isActive ? 'text-brand-red' : ''}`}></i>
                  <span>{tab.label}</span>
                  <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-gray-400 font-mono hidden md:inline-block">
            5-Tier Architecture • Escrow Guaranteed
          </span>
        </div>

        {/* Master-Detail Body for PC */}
        <div className="flex-1 flex overflow-hidden">
          {mainTab === 'PROCESS' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto">
              <ProcessingTab
                promptInput={promptInput}
                setPromptInput={setPromptInput}
                isProcessing={isProcessing}
                processingPhase={processingPhase}
                hasAnalyzed={hasAnalyzed}
                onRunProcessing={handleRunProcessing}
                onNavigateToEcosystem={() => setMainTab('ECOSYSTEM')}
              />
            </div>
          )}

          {mainTab === 'CAPITAL' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto">
              <CapitalTab
                selectedIndustryId={selectedIndustryId}
                selectedSubIndustryId={selectedSubIndustryId}
                selectedSegmentId={selectedSegmentId}
                capTableData={capTableData}
                onSelectIndustry={handleSelectIndustryForCapTable}
                onSelectSubIndustry={handleSelectSubIndustry}
                onSelectSegment={handleSelectSegment}
                onUpdateCapItem={handleUpdateCapItem}
                onResetPreset={handleResetPreset}
              />
            </div>
          )}

          {mainTab === 'SOLVER' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto">
              <SolverTab />
            </div>
          )}

          {mainTab === 'ECOSYSTEM' && (
            <SynergyMatrixTab
              isPcMode={true}
              selectedIndustryId={selectedIndustryId}
              selectedEngineId={selectedEngineId}
              onSelectIndustry={(id) => {
                setSelectedIndustryId(id);
                setSelectedEngineId(null);
              }}
              onSelectEngine={(id) => setSelectedEngineId(id)}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default function EcosystemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-prompt">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-mono">กำลังเปิดหน้าเชื่อมดอท...</span>
          </div>
        </div>
      }
    >
      <EcosystemContent />
    </Suspense>
  );
}
