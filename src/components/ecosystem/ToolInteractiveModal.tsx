'use client';

import React, { useState } from 'react';
import { EcosystemTool, HumanStateContext } from '@/lib/ecosystem-tools/types';
import {
  HiddenNodesCalculator,
  Monetization6AxisCalculator,
  CognitiveBoardView,
  OntologyRouterCalculator,
  CapTableCalculator,
  PiiGuardrailMasker,
} from './calculators/HighlightCalculators';
import {
  TcoBatnaCalculator,
  FinanceTaxCalculator,
  ParetoTimeCalculator,
  ContractRedlineChecklist,
  PyramidPitchGenerator,
  AntiPhishingShield,
  UltradianBurnoutTimer,
  ReskillSprintTracker,
} from './calculators/UniversalCalculators';
import {
  FeasibilityGdvCalculator,
  BoqPriceLockCalculator,
  ProgressBillingCalculator,
  ForeignWorkerHrCalculator,
  LegalZoningVoCalculator,
  JitLogisticsCalculator,
  DefectTriageCalculator,
  ScurveExecutiveCalculator,
} from './calculators/ConstructionCalculators';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Flame,
  UserCheck,
  Award,
  Send,
  Sparkles,
} from 'lucide-react';

interface ToolInteractiveModalProps {
  tool: EcosystemTool | null;
  context: HumanStateContext;
  onClose: () => void;
}

export const ToolInteractiveModal: React.FC<ToolInteractiveModalProps> = ({
  tool,
  context,
  onClose,
}) => {
  const [tier2Input, setTier2Input] = useState('');
  const [showTier2Form, setShowTier2Form] = useState(false);
  const [tier2Submitted, setTier2Submitted] = useState(false);
  const [isDirectorApproved, setIsDirectorApproved] = useState(false);
  const [versionTag, setVersionTag] = useState(tool?.version || 'v1.0');

  if (!tool) return null;

  const handleApproveDirector = () => {
    setIsDirectorApproved(true);
    setVersionTag('v1.1 (DIRECTOR SIGNED)');
  };

  const handleTier2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tier2Input.trim()) return;
    setTier2Submitted(true);
    setTier2Input('');
    setTimeout(() => {
      setTier2Submitted(false);
      setShowTier2Form(false);
    }, 2500);
  };

  const renderCalculator = () => {
    switch (tool.calculatorType) {
      case 'HIDDEN_NODES': return <HiddenNodesCalculator />;
      case 'MONETIZATION_6AXIS': return <Monetization6AxisCalculator />;
      case 'COGNITIVE_BOARD': return <CognitiveBoardView />;
      case 'ONTOLOGY_ROUTER': return <OntologyRouterCalculator />;
      case 'CAP_TABLE': return <CapTableCalculator />;
      case 'PII_GUARDRAIL': return <PiiGuardrailMasker />;
      case 'TCO_BATNA': return <TcoBatnaCalculator />;
      case 'FINANCE_TAX_VAT': return <FinanceTaxCalculator />;
      case 'PARETO_TIME': return <ParetoTimeCalculator />;
      case 'CONTRACT_REDLINE': return <ContractRedlineChecklist />;
      case 'PYRAMID_PITCH': return <PyramidPitchGenerator />;
      case 'ANTI_PHISHING': return <AntiPhishingShield />;
      case 'ULTRADIAN_BURNOUT': return <UltradianBurnoutTimer />;
      case 'RESKILL_30DAY': return <ReskillSprintTracker />;
      case 'FEASIBILITY_GDV': return <FeasibilityGdvCalculator />;
      case 'BOQ_PRICE_LOCK': return <BoqPriceLockCalculator />;
      case 'PROGRESS_BILLING': return <ProgressBillingCalculator />;
      case 'FOREIGN_WORKER_HR': return <ForeignWorkerHrCalculator />;
      case 'LEGAL_ZONING_VO': return <LegalZoningVoCalculator />;
      case 'JIT_LOGISTICS_WASTE': return <JitLogisticsCalculator />;
      case 'DEFECT_TRIAGE': return <DefectTriageCalculator />;
      case 'SCURVE_EXECUTIVE': return <ScurveExecutiveCalculator />;
      default:
        return (
          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block">
              รายการเช็กลิสต์ปฏิบัติการหน้างาน
            </span>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
              {tool.actionChecklist.map((act, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        );
    }
  };

  const currentD1Advice = tool.adaptationD1[context.activeD1] || tool.adaptationD1['D1.1'] || '';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-prompt animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-800 rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Sticky Header */}
        <header className="px-5 py-4 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#0F172A] sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A]">
              {tool.code}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F172A] dark:text-white leading-tight">
                {tool.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-gray-400 font-mono">{versionTag}</span>
                <span className="text-[10px] text-gray-400">• {tool.categoryLabel}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Scrollable Modal Body */}
        <main className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* (A) Context-First Adaptation Box */}
          <section className="bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                กลยุทธ์เฉพาะบริบทชีวิต ({context.activeD1} / {context.activeSubD1})
              </span>
              {context.isStressAlert && (
                <span className="text-[9px] font-bold bg-[#E11D48] text-white px-2 py-0.2 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" /> D5/D6 FAST SPRINT
                </span>
              )}
            </div>
            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
              {currentD1Advice}
            </p>
            {context.isStressAlert && (
              <div className="pt-2 border-t border-red-100 dark:border-red-900/40 text-[11px] font-bold text-[#E11D48]">
                ⚡ SOP เร่งด่วน 90 นาที: {tool.stressAdvice}
              </div>
            )}
          </section>

          {/* (B) Interactive Calculator or Checklist Component */}
          <section className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              เครื่องยนต์ประมวลผลโต้ตอบ (Interactive Engine)
            </span>
            {renderCalculator()}
          </section>

          {/* (C) 6-Axis Monetization Hook */}
          <section className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E11D48]" />
              ทางเลือกทำเงิน 6 แกน &amp; ทุนชีวิตแฝง
            </span>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              นำความรู้และสเปกของโมดูลนี้ไปต่อยอดรับเหมาช่วง ตรวจสอบรับงาน หรือเป็นตัวแทนนายหน้าสร้างรายได้จริงภายใน 24 ชม.
            </p>
          </section>

          {/* (D) Tier 2 / Tier 4 HITL Governance Box (Section 5) */}
          <section className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-gray-100 dark:border-gray-800 text-[11px]">
              <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ระบบควบคุมและร่วมพัฒนาโดยผู้เชี่ยวชาญ (HITL Governance)
              </span>
              <span className="font-mono text-[10px] text-gray-400">
                {isDirectorApproved ? '✓ VERIFIED BY DOMAIN DIRECTOR' : 'มาตรฐานรับรอง: Tier 4 Director | ข้อมูล: Tier 2 Pro'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowTier2Form(!showTier2Form)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-[#E11D48]" />
                [+ ร่วมเทรนสมองกล / อัปเดตเกณฑ์หน้างาน (สิทธิ์ Tier 2: Pro)]
              </button>

              <button
                onClick={handleApproveDirector}
                disabled={isDirectorApproved}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isDirectorApproved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#0F172A] text-white hover:bg-black'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                {isDirectorApproved ? '✓ อนุมัติมาตรฐานเรียบร้อยแล้ว' : '[✓ ประทับตราอนุมัติมาตรฐานเครื่องมือ (สิทธิ์ Tier 4)]'}
              </button>
            </div>

            {showTier2Form && (
              <form onSubmit={handleTier2Submit} className="pt-2 space-y-2 animate-fade-in text-xs">
                <textarea
                  value={tier2Input}
                  onChange={(e) => setTier2Input(e.target.value)}
                  placeholder="ป้อนสูตรคำนวณ ราคากลางหน้างานจริง หรือเคสข้อพิพาทเพื่ออัปเดตโมดูลนี้..."
                  rows={2}
                  className="w-full bg-[#F8FAFC] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:border-[#E11D48] resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">ส่งข้อมูลเข้าสู่คลัง Sandbox เพื่อรอการ Audit จาก Tier 4</span>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#E11D48] text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-rose-700"
                  >
                    <Send className="w-3 h-3" /> ส่งข้อมูล Tier 2
                  </button>
                </div>
              </form>
            )}

            {tier2Submitted && (
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
                ✓ บันทึกข้อมูลเข้าสู่ฐานเรียนรู้หน้างาน (Tier 2 Pro Sandbox) เรียบร้อยแล้ว!
              </div>
            )}
          </section>

        </main>

        {/* Sticky Footer */}
        <footer className="p-4 border-t border-[#E2E8F0] dark:border-gray-800 bg-white dark:bg-[#0F172A] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] rounded-xl text-xs font-bold hover:bg-black dark:hover:bg-gray-100 transition-colors shadow-xs"
          >
            เข้าใจแล้ว ปิดหน้านี้
          </button>
        </footer>

      </div>
    </div>
  );
};
