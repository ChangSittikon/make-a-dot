"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NongDot } from "@/components/flow/NongDot";
import {
  resolveAISolution,
  AISolutionResult,
} from "@/lib/career-core";
import {
  X,
  Activity,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Clock,
  Repeat,
  FileCheck2,
  Check,
  Sparkles,
  Layers,
} from "lucide-react";

export interface QuickFixCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounty: {
    id?: string;
    bountyId?: string;
    rawDescription?: string | null;
    targetOccupations?: Array<{ name: string }>;
    targetSkills?: Array<{ name: string }>;
    rewardText?: string | null;
    originDotCode?: string | null;
    occupation?: { name: string } | null;
    problemCategory?: string | null;
  } | null;
}

type AISubTab = "all" | "diagnostic" | "sop" | "kpi";

export function QuickFixCardModal({
  isOpen,
  onClose,
  bounty,
}: QuickFixCardModalProps) {
  const [mounted, setMounted] = useState(false);
  // Default active tab is "(ก) AI วินิจฉัย" ('diagnostic') as strictly requested
  const [activeTab, setActiveTab] = useState<AISubTab>("diagnostic");

  // Step checklist state for interactive checking
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset tab to 'diagnostic' when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab("diagnostic");
    }
  }, [isOpen]);

  if (!isOpen || !bounty) return null;

  const toggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const displayCode =
    bounty.originDotCode ||
    (bounty.id ? `#${bounty.id.slice(-6).toUpperCase()}` : "#DOT-QUEST");
  const rawDesc =
    bounty.rawDescription?.replace(/^["'“]|["'”]$/g, "").trim() ||
    "ตามรายละเอียดที่แจ้งในระบบ";

  // Compute AI Solution from career-core engine
  const solution: AISolutionResult = resolveAISolution(
    bounty.rawDescription,
    bounty.targetOccupations,
    bounty.targetSkills
  );

  const modalContent = (
    /* Z-Index Fix: fixed inset-0 z-[99999] overlays Bottom Navigation Bar cleanly */
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-prompt animate-fade-in">
      {/* Background overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog: Strict Swiss Style (ขาว-ดำ-แดง, คมชัด 100%) */}
      <div className="bg-white border-2 border-gray-900 rounded-[28px] p-4 sm:p-5 shadow-2xl max-w-[430px] w-full max-h-[92vh] flex flex-col relative z-10 overflow-hidden">
        {/* Close Button at top-right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 flex items-center justify-center transition-colors cursor-pointer z-20"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4 text-gray-900" />
        </button>

        {/* ---------------- หัวการ์ด: น้องดอท + SMART AI CARD + Title ---------------- */}
        <div className="flex flex-col items-center text-center pt-1 pb-3 border-b border-gray-200 shrink-0">
          <div className="mb-2">
            <NongDot mood="classic" size={36} color="red" />
          </div>

          <div className="flex items-center gap-2 mb-1.5 flex-wrap justify-center">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-900 text-white rounded-full">
              SMART AI CARD
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-900 rounded-full">
              {displayCode}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-brand-red border border-red-200 rounded-full flex items-center gap-1">
              <Activity className="w-3 h-3 text-brand-red" />
              <span>ระบบวินิจฉัยสด 24 ชม.</span>
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-1.5">
            <span>AI Solution & Quick-Fix SOP</span>
          </h2>
          <p className="text-[10.5px] text-gray-500 font-medium">
            ดึงข้อมูลจาก Universal 8 โมดูล & Specialized 7 ตำแหน่ง
          </p>
        </div>

        {/* ---------------- Horizontal Sub-tabs (Swiss Style, no-scrollbar) ---------------- */}
        <div className="pt-2.5 pb-2 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              ดูทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("diagnostic")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "diagnostic"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span>(ก) AI วินิจฉัย</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sop")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "sop"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>(ข) SOP 24 ชม.</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("kpi")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "kpi"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>(ค) เกณฑ์ KPI</span>
            </button>
          </div>
        </div>

        {/* ---------------- Scrollable Content Body ---------------- */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-0.5 no-scrollbar">
          {/* ปัญหาที่บันทึกไว้ในระบบ */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs">
            <div className="text-[10px] font-bold text-brand-red uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>โจทย์ปัญหาที่บันทึกไว้:</span>
              <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                {solution.categoryTag}
              </span>
            </div>
            <p className="text-gray-900 leading-snug line-clamp-2 font-medium">
              {rawDesc}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* SECTION (ก): AI วินิจฉัย: แมปปิ้งอาชีพและทักษะที่แท้จริง                     */}
          {/* ========================================================================= */}
          {(activeTab === "all" || activeTab === "diagnostic") && (
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <UserCheck className="w-4 h-4 text-brand-red shrink-0" />
                  <span>(ก) AI วินิจฉัย: แมปปิ้งอาชีพและทักษะที่แท้จริง</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                  {solution.matchedRole.coordinateId}
                </span>
              </div>

              {/* อาชีพเฉพาะทางที่ต้องใช้ */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                  อาชีพเฉพาะทางที่ต้องใช้ (Specialized Role):
                </div>
                <div className="text-xs sm:text-sm font-black text-gray-900 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
                  <span>{solution.matchedRole.roleName}</span>
                </div>
                <div className="text-[10.5px] text-gray-600 mt-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>
                    โมดูลกองกลางรองรับ:{" "}
                    <strong className="text-gray-900">
                      {solution.matchedModule.shortName}
                    </strong>{" "}
                    ({solution.matchedModule.coordinateId})
                  </span>
                </div>
              </div>

              {/* ปรัชญาแก้เกม */}
              <div className="bg-gray-50 rounded-xl p-3 border-l-4 border-l-brand-red border border-gray-200 text-xs">
                <div className="font-bold text-gray-900 mb-0.5 flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>ปรัชญาแก้เกม:</span>
                </div>
                <p className="text-gray-700 italic text-[11px] leading-relaxed">
                  &ldquo;{solution.philosophy}&rdquo;
                </p>
              </div>

              {/* ทักษะกุญแจสำคัญที่ต้องใช้หน้างาน */}
              <div className="space-y-1.5">
                <div className="text-[10.5px] font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>ทักษะกุญแจสำคัญที่ต้องใช้หน้างาน (KEY COMPETENCIES):</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-gray-800">
                  {solution.competencies.map((comp, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200"
                    >
                      <Check className="w-3.5 h-3.5 text-brand-red font-bold shrink-0 mt-0.5" />
                      <span className="leading-snug">{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION (ข): SOP 24 ชม.: 3 ขั้นตอนที่เจ้าของปัญหาทำได้ทันที                  */}
          {/* ========================================================================= */}
          {(activeTab === "all" || activeTab === "sop") && (
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Clock className="w-4 h-4 text-brand-red shrink-0" />
                  <span>(ข) SOP 24 ชม.: 3 ขั้นตอนที่เจ้าของปัญหาทำได้ทันที</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-brand-red bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    {completedCount}/3 ทำแล้ว
                  </span>
                  <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                    Action Checklist
                  </span>
                </div>
              </div>

              <p className="text-[10.5px] text-gray-500 font-medium">
                แตะที่ขั้นตอนเพื่อติ๊กบันทึกความคืบหน้า:
              </p>

              <div className="space-y-2">
                {solution.sopSteps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isChecked = checkedSteps[stepNum];
                  return (
                    <div
                      key={stepNum}
                      onClick={() => toggleStep(stepNum)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? "bg-red-50/50 border-brand-red text-gray-900 shadow-2xs"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 mt-0.5 rounded accent-brand-red cursor-pointer shrink-0"
                      />
                      <div className="flex-1 text-[11px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-brand-red">
                              {step.timeframe}
                            </span>
                            <span>{step.title}</span>
                          </span>
                          <span className="text-[9.5px] font-bold text-gray-700 bg-white border border-gray-200 px-1.5 py-0.2 rounded">
                            {step.tag}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION (ค): เกณฑ์ KPI แนะนำ: งวดงาน & การแลกเปลี่ยน                        */}
          {/* ========================================================================= */}
          {(activeTab === "all" || activeTab === "kpi") && (
            <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-2xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-brand-red shrink-0" />
                  <span>(ค) เกณฑ์ KPI แนะนำ: งวดงาน & การแลกเปลี่ยน</span>
                </span>
                <span className="text-[10px] font-bold text-brand-red bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  Smart Escrow
                </span>
              </div>

              {/* งวดงาน 3 เฟส (20% / 40% / 40%) */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {solution.kpiPhases.map((phase, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[9px] font-bold text-gray-500 uppercase">
                        {phase.phase}
                      </div>
                      <div className="text-xs font-black text-gray-900 mt-0.5">
                        {phase.pct}
                      </div>
                    </div>
                    <div className="text-[9px] text-gray-600 mt-1 leading-tight font-medium">
                      {phase.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* ทางเลือกประหยัดทุน (Resource / Sweat Swap) */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-1">
                <div className="font-bold text-gray-900 text-[11px] flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>ทางเลือกประหยัดทุน (Resource / Sweat Swap):</span>
                </div>
                <p className="text-gray-700 text-[10.5px] leading-snug">
                  {solution.resourceSwapOptions}
                </p>
              </div>

              {/* เกณฑ์การตรวจรับผลงาน (ACCEPTANCE CRITERIA) */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                  เกณฑ์การตรวจรับผลงาน (ACCEPTANCE CRITERIA):
                </div>
                <ul className="space-y-1 text-[11px] text-gray-700">
                  {solution.acceptanceCriteria.map((crit, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
                      <span className="leading-snug">{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Sticky Bottom Close Button ---------------- */}
        <div className="pt-3 pb-1 border-t border-gray-200 bg-white shrink-0 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer text-center shadow-md flex items-center justify-center gap-2"
          >
            <span>เข้าใจแล้ว ปิดหน้านี้</span>
          </button>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}

export default QuickFixCardModal;
