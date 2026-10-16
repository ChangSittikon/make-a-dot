'use client';

import React, { useState, useEffect } from 'react';
import { CapTableItem } from '../types';
import { PIPELINE_TABS } from '../pipelineConstants';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';
import { INDUSTRY_CAP_PRESETS } from '../constants';
import {
  CrossTabBridgePayload,
  computeCapTableFromProduction,
} from '../production/crossTabBridge';
import { STAGE_META } from '../production/types';

import { StepScopeView } from '../pipeline/StepScopeView';
import { StepValuationView } from '../pipeline/StepValuationView';
import { StepCapTableView } from '../pipeline/StepCapTableView';
import { StepAssetDetailView } from '../pipeline/StepAssetDetailView';
import { StepSynergyView } from '../pipeline/StepSynergyView';
import { StepBOQView } from '../pipeline/StepBOQView';
import { StepEscrowView } from '../pipeline/StepEscrowView';
import { StepSummaryView } from '../pipeline/StepSummaryView';

interface CapitalTabProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  capTableData: CapTableItem[];
  onSelectIndustry: (indId: string) => void;
  onSelectSubIndustry: (subId: string) => void;
  onSelectSegment: (segId: string) => void;
  onUpdateCapItem: (id: string, val: number) => void;
  onSetAllCapItems?: (items: CapTableItem[]) => void;
  onResetPreset: () => void;
  productionBridge?: CrossTabBridgePayload | null;
  onBackToProduction?: () => void;
  onNavigateToLocalWithBridge?: (payload: CrossTabBridgePayload) => void;
}

export const CapitalTab: React.FC<CapitalTabProps> = (props) => {
  const {
    selectedIndustryId,
    selectedSubIndustryId,
    selectedSegmentId,
    capTableData,
    onSelectIndustry,
    onSelectSubIndustry,
    onSelectSegment,
    onUpdateCapItem,
    onSetAllCapItems,
    productionBridge,
    onBackToProduction,
    onNavigateToLocalWithBridge,
  } = props;

  // Automatically jump to Step 3 (Cap Table) when arriving via [หาทุน] from ProductionTab
  const [activeStep, setActiveStep] = useState<number>(productionBridge ? 3 : 1);
  const [customCashInput, setCustomCashInput] = useState<string>('');
  const [showWeaponMapping, setShowWeaponMapping] = useState<boolean>(true);

  const computedBridge = productionBridge
    ? computeCapTableFromProduction(productionBridge)
    : null;

  useEffect(() => {
    if (productionBridge) {
      setActiveStep(3);
      const calc = computeCapTableFromProduction(productionBridge);
      setCustomCashInput(String(calc.recommendedCashThb));
    }
  }, [productionBridge?.timestamp]);

  const currentSubIndustries = ALL_SUB_INDUSTRIES[selectedIndustryId] || [];
  const activeSubIndustry =
    currentSubIndustries.find((s) => s.id === selectedSubIndustryId) ||
    currentSubIndustries[0];
  const activeSegment =
    activeSubIndustry?.segments?.find((s) => s.id === selectedSegmentId) ||
    activeSubIndustry?.segments?.[0];

  const currentPreset = activeSegment
    ? activeSegment.preset
    : activeSubIndustry
    ? activeSubIndustry.preset
    : INDUSTRY_CAP_PRESETS[selectedIndustryId] || INDUSTRY_CAP_PRESETS.ind_01;

  const goToNext = () => setActiveStep((prev) => Math.min(12, prev + 1));
  const goToPrev = () => setActiveStep((prev) => Math.max(1, prev - 1));
  const goToStep = (step: number) => setActiveStep(step);

  // Calculate live Founder vs Investor split from current capTableData
  const totalVal = capTableData.reduce((acc, c) => acc + c.value, 0);
  const cashItem = capTableData.find((c) => c.id === 'cash');
  const cashVal = cashItem?.value || 0;
  const founderVal = Math.max(0, totalVal - cashVal);
  const investorPct =
    totalVal > 0 ? ((cashVal / totalVal) * 100).toFixed(1) : '0.0';
  const founderPct =
    totalVal > 0 ? ((founderVal / totalVal) * 100).toFixed(1) : '0.0';

  const handleApplyCashPreset = (newCashAmount: number) => {
    setCustomCashInput(String(newCashAmount));
    if (productionBridge && onSetAllCapItems) {
      const recalc = computeCapTableFromProduction({
        ...productionBridge,
        customCashThb: newCashAmount,
      });
      onSetAllCapItems(recalc.items);
    } else {
      onUpdateCapItem('cash', newCashAmount);
    }
  };

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* Left Sidebar (12 Pipeline Steps) */}
      <div className="w-[56px] sm:w-[62px] shrink-0 bg-[#f8f9fa] dark:bg-[#16181f] overflow-y-auto pb-24 border-r border-gray-100 dark:border-gray-800/80 scrollbar-none flex flex-col">
        {PIPELINE_TABS.map((tab) => {
          const isActive = activeStep === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`w-full flex flex-col items-center justify-center py-2 px-0.5 border-l-[2.5px] transition-all text-center relative ${
                isActive
                  ? 'border-brand-red bg-white dark:bg-[#12141a] text-brand-red font-bold shadow-2xs'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-[#1e2129]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center mb-0.5 text-[10px] transition-colors ${
                  isActive
                    ? 'bg-red-50 text-brand-red dark:bg-red-950/50'
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
                  isActive ? 'text-brand-red font-bold' : ''
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Content Area: Active Step Deep-Dive */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        {/* ================================================================= */}
        {/* Cross-Tab Deep Integration Banner (When bridged from Production)  */}
        {/* ================================================================= */}
        {productionBridge && computedBridge && (
          <div className="mx-3 sm:mx-4 mt-3 rounded-2xl border-2 border-[#E53935] bg-gradient-to-br from-red-50/90 via-white to-amber-50/50 dark:from-red-950/30 dark:via-[#181a20] dark:to-amber-950/20 p-3.5 shadow-md space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                  <span>⚡ Auto-Cap Table</span>
                </span>
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
                  ส่งตัวเลขทุนตั้งต้นจากโหนดผลิตมาตั้งตารางหุ้นอัตโนมัติ
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {onBackToProduction && (
                  <button
                    type="button"
                    onClick={onBackToProduction}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#E53935] text-gray-700 dark:text-gray-200 text-[10.5px] font-bold transition-colors"
                  >
                    ← กลับไปโหนดผลิต
                  </button>
                )}
                {onNavigateToLocalWithBridge && (
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateToLocalWithBridge({
                        ...productionBridge,
                        targetTab: 'LOCAL',
                        customCashThb: cashVal,
                      })
                    }
                    className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold transition-colors"
                  >
                    📍 ปักหมุดโรงงานใกล้บ้าน (ทำใกล้)
                  </button>
                )}
              </div>
            </div>

            {/* Product & Node Summary */}
            <div className="rounded-xl bg-white/90 dark:bg-[#12141a]/90 border border-gray-200/80 dark:border-gray-800 p-2.5 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-400 font-semibold">
                    {productionBridge.chain.taxonomy.sector_id}{' '}
                    {productionBridge.chain.taxonomy.sector_name} • สินค้า:{' '}
                    <span className="text-gray-700 dark:text-gray-200 font-bold">
                      {productionBridge.chain.product.product_name}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-snug mt-0.5">
                    {STAGE_META[productionBridge.node.stage_type].emoji} โหนด{' '}
                    {productionBridge.node.node_order}:{' '}
                    {productionBridge.node.node_title}
                  </h3>
                  <p className="text-[11px] font-bold text-[#D32F2F] mt-0.5">
                    โมเดลที่เลือก: {productionBridge.opp.model_name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-gray-400 block">มาร์จิ้นคาดหวัง</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-black font-mono">
                    {productionBridge.opp.expected_margin_percent}
                  </span>
                </div>
              </div>

              {/* Founder vs Cash Investor Split Bar */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="font-bold text-indigo-700 dark:text-indigo-300">
                    👤 หุ้นฝั่งคุณ (ลงแรง/อุปกรณ์/สถานที่/สูตร): {founderPct}% (฿
                    {founderVal.toLocaleString()})
                  </span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    💰 หุ้นผู้ร่วมทุนเงินสด (Cash): {investorPct}% (฿
                    {cashVal.toLocaleString()})
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${founderPct}%` }}
                  />
                  <div
                    className="h-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${investorPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Capital Target Presets & Custom Input */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px]">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  🎛️ ปรับตัวเลขเงินทุนตั้งต้น (ช่วงแนะนำ: {productionBridge.opp.capital_required_thb} บ.):
                </span>
                <button
                  type="button"
                  onClick={() => setShowWeaponMapping((v) => !v)}
                  className="text-[10px] text-[#E53935] font-bold hover:underline"
                >
                  {showWeaponMapping
                    ? 'ซ่อนที่มาการแปลงอาวุธเป็นหุ้น ▲'
                    : 'ดูที่มาการแปลงอาวุธเป็นหุ้น 5 ด้าน ▼'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {computedBridge.minCapitalThb > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyCashPreset(computedBridge.minCapitalThb)
                    }
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      cashVal === computedBridge.minCapitalThb
                        ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    ทุนขั้นต่ำ ฿{computedBridge.minCapitalThb.toLocaleString()}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleApplyCashPreset(computedBridge.maxCapitalThb)
                  }
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    cashVal === computedBridge.maxCapitalThb
                      ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  ทุนมาตรฐาน ฿{computedBridge.maxCapitalThb.toLocaleString()}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyCashPreset(computedBridge.maxCapitalThb * 3)
                  }
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                    cashVal === computedBridge.maxCapitalThb * 3
                      ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  ขยายล็อตโรงงาน 3x (฿
                  {(computedBridge.maxCapitalThb * 3).toLocaleString()})
                </button>

                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="number"
                    value={customCashInput}
                    onChange={(e) => setCustomCashInput(e.target.value)}
                    placeholder="ระบุเงินสด..."
                    className="w-24 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono font-bold text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyCashPreset(
                        Math.max(0, Number(customCashInput) || 0)
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-[#E53935] hover:bg-red-700 text-white text-[10px] font-bold"
                  >
                    ตั้งตารางหุ้น
                  </button>
                </div>
              </div>
            </div>

            {/* 5-Asset Weapon-to-Equity Mapping Details */}
            {showWeaponMapping && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[10px]">
                <div className="p-2 rounded-xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40">
                  <b className="text-sky-700 dark:text-sky-300">💰 1. เงินสด (Cash):</b>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    {computedBridge.breakdownNotes.cash}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
                  <b className="text-indigo-700 dark:text-indigo-300">💪 2. แรงงาน/ทักษะ (Sweat):</b>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    {computedBridge.breakdownNotes.sweat}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <b className="text-emerald-700 dark:text-emerald-300">🛠️ 3. อุปกรณ์ (Equip):</b>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    {computedBridge.breakdownNotes.equip}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <b className="text-amber-700 dark:text-amber-300">📜 4. สถานที่ & 5. ใบอนุญาต (Venue & IP):</b>{' '}
                  <span className="text-gray-600 dark:text-gray-300">
                    {productionBridge.node.five_w_two_h.where} •{' '}
                    {productionBridge.opp.required_weapons.legal_and_permits}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeStep === 1 && (
          <StepScopeView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            onSelectIndustry={onSelectIndustry}
            onSelectSubIndustry={onSelectSubIndustry}
            onSelectSegment={onSelectSegment}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 2 && (
          <StepValuationView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            capTableData={capTableData}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 3 && (
          <StepCapTableView
            capTableData={capTableData}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 4 && (
          <StepAssetDetailView
            assetId="cash"
            stepNumber={4}
            stepTitle="สินทรัพย์เงินสด (Cash Assets)"
            stepDescription="งบประมาณเงินสด สภาพคล่องสำรอง และค่าใช้จ่ายงวดแรกของโครงการ"
            nextStepTitle="หยาดเหงื่อแรงงาน (Sweat Equity)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 5 && (
          <StepAssetDetailView
            assetId="sweat"
            stepNumber={5}
            stepTitle="หยาดเหงื่อแรงงาน (Sweat Equity)"
            stepDescription="การประเมินชั่วโมงทำงาน ทักษะวิชาชีพเฉพาะ และการลงแรงเป็นสัดส่วนหุ้น"
            nextStepTitle="เครื่องมือ & อุปกรณ์ (Equip Assets)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 6 && (
          <StepAssetDetailView
            assetId="equip"
            stepNumber={6}
            stepTitle="เครื่องมือ & อุปกรณ์ (Equip Assets)"
            stepDescription="อุปกรณ์ เครื่องจักร ฮาร์ดแวร์ และเซิร์ฟเวอร์ที่นำมาร่วมพัฒนาโครงการ"
            nextStepTitle="สถานที่ & อสังหาริมทรัพย์ (Venue Assets)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 7 && (
          <StepAssetDetailView
            assetId="venue"
            stepNumber={7}
            stepTitle="สถานที่ & อสังหาริมทรัพย์ (Venue Assets)"
            stepDescription="ที่ดิน อาคาร สำนักงาน หรือสิ่งปลูกสร้างที่นำมาตีมูลค่าเป็นสินทรัพย์ร่วมทุน"
            nextStepTitle="ทรัพย์สินทางปัญญา (IP & Licenses)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 8 && (
          <StepAssetDetailView
            assetId="ip"
            stepNumber={8}
            stepTitle="ทรัพย์สินทางปัญญา (IP & Licenses)"
            stepDescription="แบบแปลน พิมพ์เขียว ใบอนุญาต อ.1, อย., สิทธิบัตร และลิขสิทธิ์ซอฟต์แวร์"
            nextStepTitle="เครือข่ายความร่วมมือ (5-Tier Synergy)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 9 && (
          <StepSynergyView onPrevStep={goToPrev} onNextStep={goToNext} />
        )}

        {activeStep === 10 && (
          <StepBOQView
            capTableData={capTableData}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 11 && (
          <StepEscrowView onPrevStep={goToPrev} onNextStep={goToNext} />
        )}

        {activeStep === 12 && (
          <StepSummaryView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            capTableData={capTableData}
            onPrevStep={goToPrev}
            onGoToStep={goToStep}
          />
        )}
      </div>
    </div>
  );
};
