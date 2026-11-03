'use client';

import React, { useState, useEffect } from 'react';
import { PIPELINE_TABS } from '../pipelineConstants';
import { NongDot } from '@/components/flow/NongDot';
import {
  ArrowLeft,
  Sparkles,
  Key,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Compass,
  Search,
} from 'lucide-react';
import { SixAxisCompass } from '../production/SixAxisCompass';
import {
  ProductChain,
  SupplyChainNode,
  MicroOpportunity,
  ChainSource,
} from '../production/types';
import { SEED_CHAINS } from '../production/seed';
import { ActionKind } from '../production/OppCard';
import { generateProductChain } from '../production/aiGenerator';
import { getCachedChain, loadApiKey, saveApiKey } from '../production/storage';
import { flattenOpps } from '../production/schema';
import {
  CrossTabBridgePayload,
  mapSectorToIndustryId,
} from '../production/crossTabBridge';
import { StepIdentity } from '../production/StepIdentity';
import { StepChain } from '../production/StepChain';
import { StepOpportunities } from '../production/StepOpportunities';
import { StepSimulator } from '../production/StepSimulator';
import { StepWeapons } from '../production/StepWeapons';
import { StepConnect } from '../production/StepConnect';
import { StepRoadmap } from '../production/StepRoadmap';
import { HiddenNodesScannerModal } from '../production/HiddenNodesScannerModal';
import { AxisPlanData, MonetizationAxisId } from '@/lib/career-core';

interface ProductionTabProps {
  selectedIndustryId?: string;
  selectedSubIndustryId?: string;
  selectedSegmentId?: string;
  onSelectIndustry?: (indId: string) => void;
  onSelectSubIndustry?: (subId: string) => void;
  onSelectSegment?: (segId: string) => void;
  onNavigateMainTab?: (tab: string) => void;
  onCrossTabAction?: (payload: CrossTabBridgePayload) => void;
  initialChain?: ProductChain | null;
  initialStep?: number;
}

const STEP_META: Record<
  number,
  { code: string; title: string; subtitle: string; icon: string }
> = {
  1: { code: '01', title: 'หาตัวตน', subtitle: 'ค้นหาสินค้าและจุดยืน', icon: 'fa-solid fa-compass' },
  2: { code: '02', title: 'ผ่าสายพาน', subtitle: 'ผังห่วงโซ่คุณค่า 5 โหนด', icon: 'fa-solid fa-sitemap' },
  3: { code: '03', title: 'ชี้จุดแทรก', subtitle: 'ส่วนต่างสูง & จุดไฟเขียว', icon: 'fa-solid fa-bullseye' },
  4: { code: '04', title: 'ลองคำนวณ', subtitle: 'จำลองกำไร & จุดคุ้มทุน', icon: 'fa-solid fa-calculator' },
  5: { code: '05', title: 'เช็กอาวุธ', subtitle: 'อุปกรณ์ สกิล และใบอนุญาต', icon: 'fa-solid fa-shield-halved' },
  6: { code: '06', title: 'เชื่อมดอท', subtitle: 'รวมล็อตผลิต ทะลวงขั้นต่ำ', icon: 'fa-solid fa-handshake' },
  7: { code: '07', title: 'แผนปฏิบัติการ', subtitle: 'ตาราง Action Plan 30-60-90 วัน', icon: 'fa-solid fa-list-check' },
  8: { code: '08', title: 'จับคู่ซัพพลายเออร์', subtitle: 'ระบบแมตชิ่งโรงงานและวัตถุดิบ', icon: 'fa-solid fa-truck-ramp-box' },
  9: { code: '09', title: 'ทดสอบตลาด', subtitle: 'ปล่อย MVP และฟีดแบ็กลูกค้า', icon: 'fa-solid fa-vial' },
  10: { code: '10', title: 'ตั้งราคาและวางขาย', subtitle: 'กลยุทธ์ราคา & ช่องทางกระจาย', icon: 'fa-solid fa-tags' },
  11: { code: '11', title: 'ขยายสเกลและส่งออก', subtitle: 'ขยายกำลังผลิต & ตลาดต่างประเทศ', icon: 'fa-solid fa-chart-line' },
  12: { code: '12', title: 'สรุปผลและต่อยอด', subtitle: 'Dashboard ภาพรวม & แผนขั้นต่อไป', icon: 'fa-solid fa-award' },
};

export const ProductionTab: React.FC<ProductionTabProps> = ({
  onNavigateMainTab,
  onCrossTabAction,
  onSelectIndustry,
  onSelectSubIndustry,
  onSelectSegment,
  initialChain,
  initialStep,
}) => {
  const [activeStep, setActiveStep] = useState<number>(initialStep || 1);
  const [selectedChain, setSelectedChain] = useState<ProductChain>(
    initialChain || SEED_CHAINS.coffee
  );
  const [chainSource, setChainSource] = useState<ChainSource>('SEED');
  const [selectedOppKey, setSelectedOppKey] = useState<string>('');
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);
  const [showTopCompass, setShowTopCompass] = useState<boolean>(false);
  const [scannedLifeCapital, setScannedLifeCapital] = useState<{
    totalValuationThb: number;
    sweatThb: number;
    equipThb: number;
    venueThb: number;
    ipThb: number;
    selectedNodeIds: string[];
  } | null>(null);

  // AI Generation Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingName, setGeneratingName] = useState('');
  const [generatingPhase, setGeneratingPhase] = useState(1);

  // API Key modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    setApiKeyInput(loadApiKey());
    fetch('/api/production/chains').catch(() => {});
  }, []);

  useEffect(() => {
    if (initialChain) {
      setSelectedChain(initialChain);
    }
    if (initialStep && initialStep >= 1 && initialStep <= 12) {
      setActiveStep(initialStep);
    }
  }, [initialChain, initialStep]);


  const handleSaveApiKey = () => {
    saveApiKey(apiKeyInput);
    setShowKeyModal(false);
  };

  // Resolve active node & opportunity fallback
  const resolveContextNodeAndOpp = (
    oppOverride?: MicroOpportunity,
    nodeOverride?: SupplyChainNode
  ): { node: SupplyChainNode; opp: MicroOpportunity; key: string } => {
    const flat = flattenOpps(selectedChain);
    if (nodeOverride && oppOverride) {
      const found = flat.find(
        (f) =>
          f.node.node_order === nodeOverride.node_order &&
          f.opp.model_name === oppOverride.model_name
      );
      return {
        node: nodeOverride,
        opp: oppOverride,
        key: found?.key || `${nodeOverride.node_order}-0`,
      };
    }

    const matched =
      flat.find((f) => f.key === selectedOppKey) ||
      flat[0] || {
        node: selectedChain.supply_chain_nodes[0],
        opp: selectedChain.supply_chain_nodes[0].micro_opportunities[0],
        key: '1-0',
      };

    return {
      node: nodeOverride || matched.node,
      opp: oppOverride || matched.opp,
      key: matched.key,
    };
  };

  // Trigger Cross-Tab Deep Integration
  const triggerCrossTab = (
    targetTab: 'CAPITAL' | 'LOCAL',
    oppOverride?: MicroOpportunity,
    nodeOverride?: SupplyChainNode,
    customCashThb?: number,
    bridgeOverrides?: {
      scannerData?: {
        totalValuationThb: number;
        sweatThb: number;
        equipThb: number;
        venueThb: number;
        ipThb: number;
        selectedNodeIds: string[];
      } | null;
      selectedAxisId?: MonetizationAxisId;
      selectedAxisTitle?: string;
    }
  ) => {
    const { node, opp, key } = resolveContextNodeAndOpp(oppOverride, nodeOverride);
    setSelectedOppKey(key);

    const capData = bridgeOverrides?.scannerData !== undefined ? bridgeOverrides.scannerData : scannedLifeCapital;

    if (onCrossTabAction) {
      onCrossTabAction({
        targetTab,
        timestamp: Date.now(),
        chain: selectedChain,
        node,
        opp,
        oppKey: key,
        customCashThb,
        hiddenNodesValuationThb: capData?.totalValuationThb,
        hiddenNodesSweatThb: capData?.sweatThb,
        hiddenNodesEquipThb: capData?.equipThb,
        hiddenNodesVenueThb: capData?.venueThb,
        selectedNodeIds: capData?.selectedNodeIds,
        selectedAxisId: bridgeOverrides?.selectedAxisId,
        selectedAxisTitle: bridgeOverrides?.selectedAxisTitle,
      });
    } else {
      onNavigateMainTab?.(targetTab);
    }
  };

  // Helper to match known seed products
  const findSeed = (query: string): ProductChain | null => {
    const q = query.toLowerCase().trim();
    if (q.includes('กาแฟ') || q.includes('coffee') || q.includes('อาราบิก้า')) {
      return SEED_CHAINS.coffee;
    }
    if (q.includes('โซลาร์') || q.includes('solar') || q.includes('หลังคา')) {
      return SEED_CHAINS.solar;
    }
    if (
      q.includes('สกินแคร์') ||
      q.includes('ครีม') ||
      q.includes('เซรั่ม') ||
      q.includes('skincare')
    ) {
      return SEED_CHAINS.skincare;
    }
    if (q.includes('ทุเรียน') || q.includes('durian') || q.includes('ผลไม้')) {
      return SEED_CHAINS.durian;
    }
    if (
      q.includes('เครื่องหอม') ||
      q.includes('น้ำหอม') ||
      q.includes('ก้านไม้หอม') ||
      q.includes('diffuser') ||
      q.includes('เทียนหอม') ||
      q.includes('aroma')
    ) {
      return SEED_CHAINS.aroma;
    }
    return null;
  };

  // Triggered when a product is selected anywhere in Step 01
  const handleSelectProduct = async (
    productName: string,
    sectorId?: string,
    subCategoryName?: string
  ) => {
    const seed = findSeed(productName);
    if (seed) {
      setSelectedChain(seed);
      setChainSource('SEED');
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const cached = getCachedChain(productName);
    if (cached) {
      setSelectedChain(cached);
      setChainSource('CACHE');
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      void generateProductChain(productName, {
        sectorId,
        subName: subCategoryName,
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingName(productName);
    setGeneratingPhase(1);

    const timer1 = setTimeout(() => setGeneratingPhase(2), 700);
    const timer2 = setTimeout(() => setGeneratingPhase(3), 1400);
    const timer3 = setTimeout(() => setGeneratingPhase(4), 2100);

    try {
      const res = await generateProductChain(productName, {
        sectorId,
        subName: subCategoryName,
      });
      setSelectedChain(res.chain);
      setChainSource(res.source);
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to generate product chain:', err);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsGenerating(false);
    }
  };

  // Action link router
  const handleAction = (url: string) => {
    if (!url) return;
    if (url.includes('tab=capital') || url.includes('ทำทุน') || url.includes('ระดมทุน') || url.includes('ทุน')) {
      triggerCrossTab('CAPITAL');
    } else if (
      url.includes('tab=nearby') ||
      url.includes('tab=local') ||
      url.includes('ทำใกล้') ||
      url.includes('ใกล้บ้าน') ||
      url.includes('โรงงาน') ||
      url.includes('ซัพพลายเออร์')
    ) {
      triggerCrossTab('LOCAL');
    } else if (url.includes('step=4') || url.includes('คำนวณ')) {
      setActiveStep(4);
    } else if (url.includes('step=5') || url.includes('อาวุธ')) {
      setActiveStep(5);
    } else if (url.includes('step=6') || url.includes('เชื่อมดอท')) {
      setActiveStep(6);
    } else {
      triggerCrossTab('LOCAL');
    }
  };

  const handleActionKind = (
    k: ActionKind,
    opp?: MicroOpportunity,
    node?: SupplyChainNode,
    customCashThb?: number
  ) => {
    if (k === 'SCANNER') {
      setShowScannerModal(true);
      return;
    }
    if (k === 'CAPITAL') triggerCrossTab('CAPITAL', opp, node, customCashThb);
    else if (k === 'LOCAL') triggerCrossTab('LOCAL', opp, node, customCashThb);
    else if (k === 'CONNECT') setActiveStep(6);
    else if (k === 'SIMULATE') setActiveStep(4);
    else if (k === 'WEAPONS') setActiveStep(5);
  };

  const handleNavigateTabString = (tabName: string) => {
    if (tabName === 'ทำทุน') triggerCrossTab('CAPITAL');
    else if (tabName === 'ทำใกล้') triggerCrossTab('LOCAL');
    else if (tabName === 'ทำเมือง') onNavigateMainTab?.('CITY');
    else if (tabName === 'ประมวลผล') onNavigateMainTab?.('PROCESS');
  };

  const stepMeta = STEP_META[activeStep] || STEP_META[1];

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* Left Sidebar (12 Pipeline Steps) */}
      <div className="w-[56px] sm:w-[62px] shrink-0 bg-[#f8f9fa] dark:bg-[#16181f] overflow-y-auto pb-24 border-r border-gray-150 dark:border-gray-800/80 scrollbar-none flex flex-col">
        {PIPELINE_TABS.map((tab) => {
          const isActive = activeStep === tab.id;
          const isStep1 = tab.id === 1;
          const meta = STEP_META[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`w-full flex flex-col items-center justify-center border-l-[3px] transition-all text-center relative ${
                isStep1 ? 'py-2 px-0.5 min-h-[58px]' : 'py-3 px-0.5 min-h-[44px]'
              } ${
                isActive
                  ? 'border-[#E53935] bg-white dark:bg-[#12141a] text-[#E53935] font-bold shadow-2xs'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-[#1e2129] hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title={`${meta.code}: ${meta.title} (${meta.subtitle})`}
            >
              {isStep1 ? (
                <>
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center mb-0.5 text-[10px] transition-colors ${
                      isActive
                        ? 'bg-red-50 text-[#E53935] dark:bg-red-950/50'
                        : 'bg-gray-200/60 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <i className={tab.icon}></i>
                  </span>
                  <span className="text-[8px] font-mono leading-none text-gray-400 dark:text-gray-500 mb-0.5">
                    {tab.code}
                  </span>
                  <span
                    className={`text-[8px] sm:text-[8.5px] leading-[1.15] px-0.5 line-clamp-2 ${
                      isActive ? 'text-[#E53935] font-bold' : ''
                    }`}
                  >
                    หาตัวตน
                  </span>
                </>
              ) : (
                <span
                  className={`font-mono transition-all ${
                    isActive
                      ? 'text-xs sm:text-[13px] font-black text-[#E53935] scale-110'
                      : 'text-xs sm:text-[11.5px] font-bold text-gray-400 dark:text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.code}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Launchers for v7.5 Monetization Engine */}
        <div className="pt-2 mt-auto border-t border-gray-200 dark:border-zinc-800 space-y-1.5 px-1 pb-4 shrink-0">
          <button
            type="button"
            onClick={() => setShowScannerModal(true)}
            className="w-full py-1.5 px-0.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:opacity-90 flex flex-col items-center justify-center text-center transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="สแกนหาทุนชีวิตแฝง (0 บาท)"
          >
            <span className="text-[12px]">🔍</span>
            <span className="text-[7.5px] font-bold leading-tight mt-0.5">ทุนแฝง</span>
          </button>
          <button
            type="button"
            onClick={() => setShowTopCompass((v) => !v)}
            className="w-full py-1.5 px-0.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 flex flex-col items-center justify-center text-center transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="สมการทำเงิน 6 แกน"
          >
            <span className="text-[12px]">🧭</span>
            <span className="text-[7.5px] font-bold leading-tight mt-0.5">6 แกน</span>
          </button>
        </div>
      </div>

      {/* Right Content Area: Active Step Deep-Dive */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        <div className="p-3 max-w-5xl mx-auto space-y-3">
          {/* ========================================================= */}
          {/* ⚡ v7.5 Monetization Engine & Life Capital Quick Action Bar */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-gradient-to-r from-zinc-900 via-gray-900 to-zinc-800 text-white p-3 sm:p-3.5 shadow-md border border-zinc-700/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-extrabold tracking-tight truncate">
                    เครื่องยนต์สร้างกระแสเงินสด (Monetization Engine v7.5)
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-500/40 font-bold shrink-0">
                    ใหม่ล่าสุด
                  </span>
                </div>
                <p className="text-[10px] text-gray-300 truncate">
                  {scannedLifeCapital
                    ? `✨ มีมูลค่าทุนชีวิตแฝงสะสม: ฿${scannedLifeCapital.totalValuationThb.toLocaleString()} บาท (พร้อมแปลงเป็นหุ้น)`
                    : 'สแกนหาทุนชีวิตแฝง (0 บาท) หรือปลดล็อกช่องทางทำเงินครบทั้ง 6 แกน'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowScannerModal(true)}
                className="flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>🔍 สแกนทุนชีวิต (0 บ.)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTopCompass((v) => !v)}
                className={`flex-1 sm:flex-none py-1.5 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
                  showTopCompass
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-brand-red" />
                <span>🧭 {showTopCompass ? 'ซ่อน 6 แกนทำเงิน ▲' : 'สมการทำเงิน 6 แกน ▼'}</span>
              </button>
            </div>
          </div>

          {/* Top Level 6-Axis Compass Expanded View */}
          {showTopCompass && (
            <div className="animate-fadeIn">
              <SixAxisCompass
                opp={
                  selectedChain.supply_chain_nodes[0]?.micro_opportunities[0] || {
                    strategy_type: 'DISINTERMEDIATION',
                    model_name: `ผู้เชี่ยวชาญ & ตัวกลางสายการผลิต (${selectedChain.product.product_name})`,
                    target_persona_tags: ['บุคคลทั่วไป', 'งบ 0 บาท'],
                    how_to_start: 'ใช้เครือข่ายและทักษะจับคู่ผู้ซื้อกับผู้ผลิต',
                    capital_required_thb: '0 - 5,000',
                    expected_margin_percent: '25% - 40%',
                    feasibility_score: {
                      low_capital: 5,
                      profit_margin: 4,
                      ease_of_entry: 4,
                      aggregability: 4,
                      total_score: 17,
                    },
                    required_weapons: {
                      tools_and_equipment: 'สมาร์ทโฟน, LINE Official',
                      skills_needed: 'การเจรจาต่อรอง, การตลาดท้องถิ่น',
                      legal_and_permits: 'ทะเบียนพาณิชย์ (เมื่อเริ่มมีรายได้ประจำ)',
                    },
                    action_links: {
                      go_to_capital_tab: 'ตั้งตารางหุ้น 0 บาทด้วย Sweat Equity',
                      go_to_local_tab: 'จับคู่โรงงานแปรรูปใกล้บ้าน',
                    },
                  }
                }
                node={selectedChain.supply_chain_nodes[0]}
                sectorId={selectedChain.taxonomy.sector_id}
                onAction={handleActionKind}
                onOpenScanner={() => setShowScannerModal(true)}
              />
            </div>
          )}

          {activeStep === 1 && (
            <StepIdentity
              onPick={(name, ctx) => handleSelectProduct(name, ctx.sectorId, ctx.subName)}
              onOpenScanner={() => setShowScannerModal(true)}
              onOpenCompass={() => setShowTopCompass((v) => !v)}
            />
          )}

          {activeStep === 2 && (
            <StepChain
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOpp={setSelectedOppKey}
              onAction={handleActionKind}
              onBackToStep1={() => setActiveStep(1)}
              onNavigateStep={(step, oppKey) => {
                if (oppKey) setSelectedOppKey(oppKey);
                setActiveStep(step);
              }}
            />
          )}

          {activeStep === 3 && (
            <StepOpportunities
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOpp={setSelectedOppKey}
              onAction={handleActionKind}
              onNavigateStep={(step, oppKey) => {
                if (oppKey) setSelectedOppKey(oppKey);
                setActiveStep(step);
              }}
            />
          )}

          {activeStep === 4 && (
            <StepSimulator
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOpp={setSelectedOppKey}
              onAction={handleActionKind}
            />
          )}

          {activeStep === 5 && (
            <StepWeapons
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOppKey={setSelectedOppKey}
              onAction={handleAction}
              onNavigateStep={setActiveStep}
            />
          )}

          {activeStep === 6 && (
            <StepConnect
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOppKey={setSelectedOppKey}
              onAction={handleAction}
              onNavigateTab={handleNavigateTabString}
            />
          )}

          {activeStep >= 7 && activeStep <= 12 && (
            <StepRoadmap
              step={activeStep}
              chain={selectedChain}
              onNavigateStep={setActiveStep}
              onNavigateTab={handleNavigateTabString}
            />
          )}
        </div>
      </div>

      {/* AI Analysis Loading Modal Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl animate-scaleUp">
            <div className="h-14 flex items-center justify-center">
              <NongDot mood="launch" size={20} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#E53935] dark:bg-red-950/50 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                AI Product JSON Generator Engine
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                กำลังผ่าตัดห่วงโซ่อุปทาน
              </h3>
              <p className="text-xs font-semibold text-[#E53935] mt-0.5">
                &quot;{generatingName}&quot;
              </p>
            </div>

            <div className="space-y-2.5 text-left bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-xs">
              {[
                {
                  phase: 1,
                  label: 'แปลงหน่วยมาตรฐานและเทียบสัดส่วนมูลค่า (Unit Normalization)...',
                },
                {
                  phase: 2,
                  label: 'ผ่าตัดโครงสร้างต้นน้ำ-กลางน้ำ-ปลายน้ำ (5 Vertical Nodes)...',
                },
                {
                  phase: 3,
                  label: 'คำนวณจุดก้าวกระโดดของราคา & หาจุดแทรกตัว 4 กลยุทธ์...',
                },
                {
                  phase: 4,
                  label: 'ประเมินคะแนนความเป็นไปได้ (20 คะแนน) และเช็กอาวุธ...',
                },
              ].map((s) => {
                const isDone = generatingPhase > s.phase;
                const isCurrent = generatingPhase === s.phase;

                return (
                  <div
                    key={s.phase}
                    className={`flex items-center gap-2.5 transition-all ${
                      isDone
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-zinc-900 dark:text-white font-bold'
                        : 'text-zinc-400 dark:text-zinc-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#E53935] shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700 shrink-0" />
                    )}
                    <span className="leading-tight">{s.label}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-zinc-400">
              ใช้เวลาประมาณ 1-3 วินาที ระบบจะนำคุณเข้าสู่ผังแนวตั้งทันที
            </p>
          </div>
        </div>
      )}

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#E53935]" />
                ตั้งค่า Google Gemini API Key (ทางเลือก)
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              หากคุณมี Gemini API Key สามารถกรอกที่นี่เพื่อใช้งานโมเดล Gemini 2.5 Flash
              วิเคราะห์สินค้าใหม่แบบเรียลไทม์ (คีย์จะถูกบันทึกไว้ในเบราว์เซอร์ของคุณเท่านั้น)
              <br />
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                *หากไม่กรอก ระบบจะใช้ Smart Archetype Engine ทำงานได้ครบถ้วน 100% โดยไม่ต้องใช้อินเทอร์เน็ต
              </span>
            </p>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                Gemini API Key (AIzaSy...)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl bg-[#E53935] hover:bg-red-600 text-white text-xs font-bold"
              >
                บันทึกคีย์
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
