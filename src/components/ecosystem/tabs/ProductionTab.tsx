'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PIPELINE_TABS } from '../pipelineConstants';
import { NongDot } from '@/components/flow/NongDot';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Users,
  Key,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { ProductChain, ChainSource } from '../production/types';
import { SEED_CHAINS } from '../production/seed';
import { ActionKind } from '../production/OppCard';
import { generateProductChain } from '../production/aiGenerator';
import { getCachedChain, loadApiKey, saveApiKey } from '../production/storage';
import { StepIdentity } from '../production/StepIdentity';
import { StepChain } from '../production/StepChain';
import { StepOpportunities } from '../production/StepOpportunities';
import { StepSimulator } from '../production/StepSimulator';
import { StepWeapons } from '../production/StepWeapons';
import { StepConnect } from '../production/StepConnect';

interface ProductionTabProps {
  selectedIndustryId?: string;
  selectedSubIndustryId?: string;
  selectedSegmentId?: string;
  onSelectIndustry?: (indId: string) => void;
  onSelectSubIndustry?: (subId: string) => void;
  onSelectSegment?: (segId: string) => void;
  onNavigateMainTab?: (tab: string) => void;
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
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  onSelectIndustry,
  onSelectSubIndustry,
  onSelectSegment,
  onNavigateMainTab,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedChain, setSelectedChain] = useState<ProductChain>(SEED_CHAINS.coffee);
  const [chainSource, setChainSource] = useState<ChainSource>('SEED');
  const [selectedOppKey, setSelectedOppKey] = useState<string>('');

  // AI Generation Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingName, setGeneratingName] = useState('');
  const [generatingPhase, setGeneratingPhase] = useState(1);

  // API Key modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    setApiKeyInput(loadApiKey());
  }, []);

  const handleSaveApiKey = () => {
    saveApiKey(apiKeyInput);
    setShowKeyModal(false);
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
    return null;
  };

  // Triggered when a product is selected anywhere in Step 01
  const handleSelectProduct = async (
    productName: string,
    sectorId?: string,
    subCategoryName?: string
  ) => {
    // 1. Check local seed
    const seed = findSeed(productName);
    if (seed) {
      setSelectedChain(seed);
      setChainSource('SEED');
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Check local storage cache
    const cached = getCachedChain(productName);
    if (cached) {
      setSelectedChain(cached);
      setChainSource('CACHE');
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Run AI Product JSON Generator Engine
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
    if (url.includes('tab=capital') || url.includes('ทำทุน')) {
      onNavigateMainTab?.('CAPITAL');
    } else if (url.includes('tab=nearby') || url.includes('tab=local') || url.includes('ทำใกล้')) {
      onNavigateMainTab?.('LOCAL');
    } else if (url.includes('step=4') || url.includes('คำนวณ')) {
      setActiveStep(4);
    } else if (url.includes('step=5') || url.includes('อาวุธ')) {
      setActiveStep(5);
    } else if (url.includes('step=6') || url.includes('เชื่อมดอท')) {
      setActiveStep(6);
    } else {
      window.open(url, '_blank');
    }
  };

  const handleActionKind = (k: ActionKind) => {
    if (k === 'CAPITAL') onNavigateMainTab?.('CAPITAL');
    else if (k === 'LOCAL') onNavigateMainTab?.('LOCAL');
    else if (k === 'CONNECT') setActiveStep(6);
  };

  const handleNavigateTabString = (tabName: string) => {
    if (tabName === 'ทำทุน') onNavigateMainTab?.('CAPITAL');
    else if (tabName === 'ทำใกล้') onNavigateMainTab?.('LOCAL');
    else if (tabName === 'ทำเมือง') onNavigateMainTab?.('CITY');
    else if (tabName === 'ประมวลผล') onNavigateMainTab?.('PROCESS');
  };

  const currentTab = PIPELINE_TABS.find((t) => t.id === activeStep) || PIPELINE_TABS[0];
  const stepMeta = STEP_META[activeStep] || STEP_META[1];

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* ==================================================================== */}
      {/* Left Sidebar (12 Pipeline Steps)                                     */}
      {/* 01: Has Logo & Name "หาตัวตน"                                        */}
      {/* 02-12: Clean numeric badges with hover tooltip & red active state   */}
      {/* ==================================================================== */}
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
                /* Steps 02-12: Display only number, bold and styled */
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
      </div>

      {/* ==================================================================== */}
      {/* Right Content Area: Active Step Deep-Dive                            */}
      {/* ==================================================================== */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        {/* Top Product Switcher & Stepper Pill Navigation (Only visible on steps 02..06) */}
        {activeStep >= 2 && activeStep <= 6 && (
          <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#12141a]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Back to 01 + Product name */}
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 hover:scale-105"
                  title="ย้อนกลับไปเลือกสินค้าใหม่ที่ขั้นตอน 01 หาตัวตน"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>เปลี่ยนสินค้า (01)</span>
                </button>

                <div className="min-w-0 flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-zinc-900 dark:text-white truncate">
                    {selectedChain.product.product_name}
                  </span>
                  <span className="text-zinc-400 hidden md:inline">•</span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate hidden md:inline">
                    {selectedChain.taxonomy.sector_name}
                  </span>
                </div>
              </div>

              {/* Steps 02-06 quick pills */}
              <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar shrink-0">
                {[
                  { step: 2, label: '02 ผ่าสายพาน' },
                  { step: 3, label: '03 ชี้จุดแทรก' },
                  { step: 4, label: '04 ลองคำนวณ' },
                  { step: 5, label: '05 เช็กอาวุธ' },
                  { step: 6, label: '06 เชื่อมดอท' },
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(s.step)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeStep === s.step
                        ? 'bg-[#E53935] text-white shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}

                {/* AI / Seed indicator badge */}
                <div
                  className="px-2 py-1 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1 shrink-0 ml-1"
                  title={`แหล่งที่มา: ${chainSource}`}
                >
                  <Sparkles className="w-3 h-3 text-[#E53935]" />
                  <span className="hidden sm:inline">
                    {chainSource === 'SEED'
                      ? 'Seed Data'
                      : chainSource === 'GEMINI'
                      ? 'Gemini AI'
                      : chainSource === 'CACHE'
                      ? 'แคช'
                      : 'Archetype'}
                  </span>
                </div>

                {/* Gemini API Key config button */}
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  title="ตั้งค่า Gemini API Key"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* Step Views Router                                                 */}
        {/* ================================================================= */}
        <div className="p-3 sm:p-5 max-w-5xl mx-auto">
          {activeStep === 1 && (
            <div className="space-y-4">
              {selectedChain && (
                <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    <span className="text-zinc-500 dark:text-zinc-400">สินค้าที่เปิดล่าสุด:</span>
                    <span className="font-bold text-zinc-900 dark:text-white truncate">
                      {selectedChain.product.product_name}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-3 py-1 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 font-bold text-xs shrink-0 flex items-center gap-1 transition-colors"
                  >
                    <span>ดูผังสายพาน (02)</span>
                    <span>→</span>
                  </button>
                </div>
              )}
              <StepIdentity
                onPick={(name, ctx) => handleSelectProduct(name, ctx.sectorId, ctx.subName)}
              />
            </div>
          )}

          {activeStep === 2 && (
            <StepChain
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOpp={(oppKey) => {
                setSelectedOppKey(oppKey);
                setActiveStep(3);
              }}
              onAction={handleActionKind}
              onBackToStep1={() => setActiveStep(1)}
            />
          )}

          {activeStep === 3 && (
            <StepOpportunities
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOpp={setSelectedOppKey}
              onAction={handleActionKind}
            />
          )}

          {activeStep === 4 && (
            <StepSimulator
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOpp={setSelectedOppKey}
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

          {activeStep === 6 && (
            <StepConnect
              chain={selectedChain}
              selectedOppKey={selectedOppKey}
              onSelectOppKey={setSelectedOppKey}
              onAction={handleAction}
              onNavigateTab={handleNavigateTabString}
            />
          )}

          {/* Steps 07 - 12: Workspaces */}
          {activeStep >= 7 && activeStep <= 12 && (
            <div className="py-8 max-w-xl mx-auto text-center space-y-5 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#E53935] dark:bg-red-950/40 dark:text-red-300">
                <i className={stepMeta.icon}></i>
                ขั้นตอนที่ {stepMeta.code}: {stepMeta.title}
              </div>

              <div className="h-16 flex items-center justify-center">
                <NongDot mood="thinking" size={20} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                  {stepMeta.title} ({stepMeta.subtitle})
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  ระบบขั้นตอนการทำผลิตลำดับที่ {stepMeta.code} ({stepMeta.title})
                  สำหรับสินค้า "{selectedChain.product.product_name}" อยู่ระหว่างเชื่อมโยงข้อมูลภาคสนาม
                  คุณสามารถย้อนกลับไปผ่าสายพานหรือคำนวณกำไรในขั้นตอน 02-06 ได้ตลอดเวลา
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>ขั้นตอนก่อนหน้า</span>
                </button>

                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold transition-all"
                >
                  กลับไปผ่าสายพาน (02)
                </button>

                {activeStep < 12 && (
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(12, prev + 1))}
                    className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>ถัดไป</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* AI Analysis Loading Modal Overlay                                    */}
      {/* ==================================================================== */}
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
                "{generatingName}"
              </p>
            </div>

            {/* 4 Steps Checklist Animation */}
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

      {/* ==================================================================== */}
      {/* Gemini API Key Modal                                                 */}
      {/* ==================================================================== */}
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
