"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MarketPulseWidget from "./MarketPulseWidget";
import { AIWhisperWidget } from "./AIWhisperWidget";
import { resolveAISolution } from "@/lib/career-core";
import {
  Handshake,
  Rocket,
  X,
  User,
  Check,
  CheckCircle2,
  AlertCircle,
  Coins,
  GitMerge,
  Repeat,
  ShieldCheck,
  FileText,
  ArrowRight,
  Layers,
} from "lucide-react";

interface NegotiationModalProps {
  bountyId: string;
  initialPrizeTHB: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentUserRole?: string;
  initialProposedKPI?: string;
  initialOfferPriceTHB?: number;
  referrerId?: string | null;
  rawDescription?: string | null;
  targetOccupations?: Array<{ id?: string; name: string }>;
  targetSkills?: Array<{ id?: string; name: string }>;
}

export default function NegotiationModal({
  bountyId,
  initialPrizeTHB,
  isOpen,
  onClose,
  onSuccess,
  currentUserRole = "USER",
  initialProposedKPI = "",
  initialOfferPriceTHB,
  referrerId,
  rawDescription,
  targetOccupations,
  targetSkills,
}: NegotiationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"KPI" | "UPGRADE">("KPI");

  // State สำหรับข้อเสนอ KPI
  const [proposedKPI, setProposedKPI] = useState(initialProposedKPI);
  const [timeframeDays, setTimeframeDays] = useState<number>(7);
  const [priceTHB, setPriceTHB] = useState<number>(
    initialOfferPriceTHB || initialPrizeTHB || 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [autoFillSuccess, setAutoFillSuccess] = useState(false);

  // State สำหรับข้อเสนออัปเกรดเป็นโครงการ (Project Upgrade)
  const [vision, setVision] = useState("");
  const [proposedRole, setProposedRole] = useState("SWEAT_SHARE");
  const [isSubmittingUpgrade, setIsSubmittingUpgrade] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialProposedKPI) {
      setProposedKPI(initialProposedKPI);
    }
    if (initialOfferPriceTHB) {
      setPriceTHB(initialOfferPriceTHB);
    }
  }, [initialProposedKPI, initialOfferPriceTHB]);

  // Handle escape key and clicks outside mobile frame
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      const frame = document.getElementById("mobile-phone-frame");
      if (frame && !frame.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // ดึงสมองกล AI Solution & Quick-Fix SOP สำหรับโจทย์งานนี้
  const aiSolution = resolveAISolution(
    rawDescription,
    targetOccupations,
    targetSkills
  );

  const quickDays = [3, 7, 14, 30];

  // ฟังก์ชันดึงเกณฑ์ KPI แนะนำ 3 งวดลงช่องกรอกข้อเสนออัตโนมัติ
  const handleApplyAISolutionKPI = () => {
    const p1 = aiSolution.kpiPhases[0];
    const p2 = aiSolution.kpiPhases[1];
    const p3 = aiSolution.kpiPhases[2];
    const formatted = [
      `งวดที่ 1 (${p1.pct}): ${p1.title} - ${p1.desc}`,
      `งวดที่ 2 (${p2.pct}): ${p2.title} - ${p2.desc}`,
      `งวดที่ 3 (${p3.pct}): ${p3.title} - ${p3.desc}`,
      ``,
      `เกณฑ์การตรวจรับผลงาน:`,
      ...aiSolution.acceptanceCriteria.map((c) => `- ${c}`),
      ``,
      `ทางเลือกประหยัดทุน: ${aiSolution.resourceSwapOptions}`,
    ].join("\n");

    setProposedKPI(formatted);
    setAutoFillSuccess(true);
    setTimeout(() => setAutoFillSuccess(false), 2500);
  };

  // จัดการส่งข้อเสนอ KPI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!proposedKPI.trim()) {
      setErrorMsg("กรุณาระบุสิ่งที่จะส่งมอบ (KPI / Deliverables)");
      return;
    }

    if (timeframeDays <= 0) {
      setErrorMsg("กรุณาระบุระยะเวลาทำงานที่มากกว่า 0 วัน");
      return;
    }

    if (priceTHB < 0) {
      setErrorMsg("ราคาเสนอต้องไม่ติดลบ");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/bounties/${bountyId}/negotiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposedKPI: proposedKPI.trim(),
          timeframeDays: Number(timeframeDays),
          priceTHB: Number(priceTHB),
          priceSatang: Math.round(Number(priceTHB) * 100),
          referrerId: referrerId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการส่งข้อเสนอ");
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งข้อเสนอ";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // จัดการส่งข้อเสนออัปเกรดเป็นโครงการ (Project Upgrade)
  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpgradeMsg(null);

    if (!vision.trim()) {
      setUpgradeMsg("กรุณาระบุวิสัยทัศน์หรือแนวทางพัฒนาโครงการ");
      return;
    }

    setIsSubmittingUpgrade(true);
    try {
      const res = await fetch(`/api/bounties/${bountyId}/upgrade-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vision: vision.trim(),
          proposedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการส่งข้อเสนออัปเกรด");
      }

      setUpgradeMsg("ยื่นข้อเสนออัปเกรดโครงการสำเร็จ รอเจ้าของงานพิจารณา");
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งข้อเสนอ";
      setUpgradeMsg(message);
    } finally {
      setIsSubmittingUpgrade(false);
    }
  };

  const tierLabel =
    currentUserRole === "PROFESSIONAL"
      ? "TIER 2 (PROFESSIONAL)"
      : currentUserRole === "ADMIN"
      ? "ADMIN (TEST MODE)"
      : "TIER 1 (USER)";

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex flex-col justify-end bg-black/80 backdrop-blur-xs animate-fade-in font-prompt"
      onClick={onClose}
    >
      {/* Modal Sheet - Strict Swiss Style (ขาว-ดำ-แดง, คมชัด 100%) */}
      <div
        className="bg-white w-full max-w-[430px] mx-auto rounded-t-[32px] h-[92%] flex flex-col relative z-10 border-t-2 border-gray-900 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-[32px] z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0">
              {activeTab === "KPI" ? (
                <Handshake className="w-4 h-4 text-white" />
              ) : (
                <Rocket className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                <h3 className="font-black text-gray-900 leading-none text-sm sm:text-base">
                  {activeTab === "KPI"
                    ? "พื้นที่เจรจางานและตั้ง KPI"
                    : "ยื่นข้อเสนออัปเกรดโครงการ"}
                </h3>
              </div>
              <p className="text-[10.5px] text-gray-500 leading-none">
                {activeTab === "KPI"
                  ? "ยื่นข้อเสนอตัวชี้วัดความสำเร็จและระยะเวลาส่งมอบงาน (Negotiation Sandbox)"
                  : "ยกระดับจากเควสต์เดี่ยวเป็นโครงการระยะยาว พร้อมขอร่วมถือหุ้น"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-900 rounded-full hover:bg-gray-200 transition cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-900" />
          </button>
        </div>

        {/* Dual Tab Switcher (Swiss Style) */}
        <div className="px-5 pt-3 pb-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("KPI")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "KPI"
                ? "bg-gray-900 text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>เสนอรับงาน & KPI</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("UPGRADE")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "UPGRADE"
                ? "bg-brand-red text-white shadow-xs"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>ยื่นข้อเสนออัปเกรด</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ฟอร์มเจรจางานและตั้ง KPI (พร้อม AI KPI Guideline Helper)            */}
        {/* ========================================================================= */}
        {activeTab === "KPI" ? (
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 no-scrollbar">
              {/* Solver Identity Banner */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 shadow-2xs">
                    <User className="w-3.5 h-3.5 text-gray-700" />
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block font-medium">
                      ระดับผู้รับงานของคุณ
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {tierLabel}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-700 font-medium">
                  สถานะ: ได้รับสิทธิ์เสนอ KPI
                </span>
              </div>

              {/* ========================================================================= */}
              {/* จุดที่ 2: ไกด์ไลน์ผู้ช่วย (ค) เกณฑ์ KPI 3 งวด & แนวทางแลกเปลี่ยน             */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-2xl p-3.5 border-2 border-gray-900 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-red shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-gray-900 leading-tight">
                        (ค) เกณฑ์ KPI แนะนำ 3 งวด & แนวทางแลกเปลี่ยน
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        ระบบสมองกลคำนวณตามโมดูล: {aiSolution.categoryTag}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-brand-red bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
                    Smart Escrow
                  </span>
                </div>

                {/* แผนผังงวดงาน 3 งวด (20% / 40% / 40%) */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {aiSolution.kpiPhases.map((phase, pIdx) => (
                    <div
                      key={pIdx}
                      className="bg-gray-50 p-2 rounded-xl border border-gray-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[8.5px] font-bold text-gray-500 uppercase">
                          {phase.phase}
                        </div>
                        <div className="text-xs font-black text-gray-900 mt-0.5">
                          {phase.pct}
                        </div>
                      </div>
                      <div className="text-[8.5px] text-gray-600 mt-1 leading-tight font-medium">
                        {phase.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ทางเลือกแลกเปลี่ยนทรัพยากร (Resource / Sweat Swap) */}
                <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-200 space-y-0.5">
                  <div className="font-bold text-gray-900 text-[10.5px] flex items-center gap-1">
                    <Repeat className="w-3 h-3 text-brand-red shrink-0" />
                    <span>ทางเลือกประหยัดทุน (Resource / Sweat Swap):</span>
                  </div>
                  <p className="text-gray-600 text-[10px] leading-snug">
                    {aiSolution.resourceSwapOptions}
                  </p>
                </div>

                {/* ปุ่มคลิกเพื่อดึงข้อตกลง KPI นี้ลงช่องข้อเสนอทันที */}
                <button
                  type="button"
                  onClick={handleApplyAISolutionKPI}
                  className="w-full bg-red-50 hover:bg-red-100 text-brand-red border border-red-200 text-xs font-bold py-2.5 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  {autoFillSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-red" />
                      <span>ดึงข้อมูลข้อตกลงสำเร็จ!</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-brand-red" />
                      <span>ดึงข้อตกลง KPI 3 งวดนี้ลงช่องข้อเสนอ (Auto-fill)</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Whisper Widget (6-Axis Monetization Advisor) */}
              <AIWhisperWidget
                initialPrizeTHB={initialPrizeTHB}
                onApplyToNegotiation={(script, price) => {
                  setProposedKPI(script);
                  setPriceTHB(price);
                }}
              />

              {/* Field 1: สิ่งที่จะส่งมอบ (KPI / Deliverables) */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  1. สิ่งที่จะส่งมอบ (KPI / Deliverables){" "}
                  <span className="text-brand-red">*</span>
                </label>
                <p className="text-[10px] text-gray-400 mb-1.5">
                  ระบุผลงานที่วัดผลได้จริง ว่าเมื่อทำสิ่งนี้เสร็จจะถือว่างวดงานสมบูรณ์
                </p>
                <textarea
                  rows={4}
                  required
                  value={proposedKPI}
                  onChange={(e) => setProposedKPI(e.target.value)}
                  placeholder="เช่น งวดที่ 1 (20%): วางแผนและเริ่มจัดเตรียมของ..."
                  className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red transition leading-relaxed text-gray-900 placeholder:text-gray-400 min-h-[110px]"
                />
              </div>

              {/* Field 2: ระยะเวลาทำงาน (Timeframe) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-900">
                    2. ระยะเวลาทำงาน (วัน){" "}
                    <span className="text-brand-red">*</span>
                  </label>
                  <span className="text-[11px] font-mono font-bold text-gray-700">
                    {timeframeDays > 0 ? `${timeframeDays} วัน` : "ยังไม่กำหนด"}
                  </span>
                </div>

                {/* Quick Pills */}
                <div className="flex items-center gap-2 mb-2.5">
                  {quickDays.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setTimeframeDays(d)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                        timeframeDays === d
                          ? "bg-gray-900 text-white border-gray-900 shadow-2xs"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {d} วัน
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min={1}
                  required
                  value={timeframeDays}
                  onChange={(e) =>
                    setTimeframeDays(
                      Math.max(1, parseInt(e.target.value, 10) || 1)
                    )
                  }
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-red focus:bg-white text-gray-900 font-mono font-bold"
                  placeholder="จำนวนวันทำงาน"
                />
              </div>

              {/* Field 3: ราคาเสนอ (Proposed Price) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-900">
                    3. ราคาเสนอ (บาท) <span className="text-brand-red">*</span>
                  </label>
                  <span className="text-[10px] text-gray-500">
                    งบประมาณตั้งต้น: ฿{initialPrizeTHB.toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                    ฿
                  </span>
                  <input
                    type="number"
                    min={0}
                    required
                    value={priceTHB}
                    onChange={(e) =>
                      setPriceTHB(
                        Math.max(0, parseInt(e.target.value, 10) || 0)
                      )
                    }
                    className="w-full text-sm pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-red focus:bg-white font-mono font-black text-gray-900"
                    placeholder="ระบุราคาที่เสนอ"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  คุณสามารถคงราคาเดิมไว้ หรือเสนอราคาใหม่เพื่อเจรจากับเจ้าของปัญหาได้
                </p>

                {/* Market Pulse (Demand-Supply & Price Benchmark Widget) */}
                <MarketPulseWidget bountyId={bountyId} className="mt-3" />
              </div>

              {/* Banner ชวนอัปเกรดเป็นโครงการ (Swiss Style) */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <Rocket className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block leading-tight">
                      ต้องการขับเคลื่อนเป็นโครงการระยะยาว?
                    </span>
                    <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">
                      ยื่นข้อเสนอวิสัยทัศน์เพื่อขอร่วมถือหุ้น หรือเป็น Co-founder
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("UPGRADE")}
                  className="text-xs font-bold text-brand-red bg-white hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 transition shrink-0 cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <span>ยื่นข้อเสนอ</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-brand-red text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Sticky Bottom Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white flex items-center justify-end gap-3 shrink-0 shadow-sm">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-brand-red text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังส่ง...</span>
                  </>
                ) : (
                  <span>ส่งข้อเสนอรับงาน</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* TAB 2: ฟอร์มยื่นข้อเสนออัปเกรดเป็นโครงการ (Upgrade to Project)             */
          /* ========================================================================= */
          <form
            onSubmit={handleUpgradeSubmit}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 no-scrollbar">
              {/* Upgrade Info Card */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      ยกระดับเป็นโครงการ (Project Upgrade)
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      ปัญหานี้มีศักยภาพสูง ยื่นวิสัยทัศน์เพื่อขอร่วมสร้างโปรเจกต์ระยะยาว
                    </p>
                  </div>
                </div>
              </div>

              {/* Solver Identity Banner */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 shadow-2xs">
                    <User className="w-3.5 h-3.5 text-gray-700" />
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block font-medium">
                      ระดับของคุณ
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {tierLabel}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-700 font-medium">
                  สิทธิ์: ยื่นข้อเสนอโครงการ
                </span>
              </div>

              {/* Field 1: วิสัยทัศน์ (Vision) */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  1. วิสัยทัศน์และแนวทางพัฒนา (Vision){" "}
                  <span className="text-brand-red">*</span>
                </label>
                <p className="text-[10px] text-gray-400 mb-1.5">
                  อธิบายว่าทำไมงานนี้ถึงควรสเกลอัป และคุณจะนำความเชี่ยวชาญใดมาร่วมขับเคลื่อน
                </p>
                <textarea
                  required
                  rows={4}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="เช่น ผมมองว่าปัญหานี้สามารถต่อยอดเป็นแพลตฟอร์มที่แก้ปัญหาให้คนทั้งประเทศได้ ผมมีทีมพัฒนาพร้อมลงแรง (Sweat Equity) และขอเสนอแผนขยายผลดังนี้..."
                  className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-red focus:bg-white focus:ring-1 focus:ring-brand-red transition leading-relaxed text-gray-900 placeholder:text-gray-400 min-h-[110px]"
                />
              </div>

              {/* Field 2: บทบาทของคุณ (Proposed Role) */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">
                  2. บทบาทที่คุณเสนอตัวเข้าร่วม (Proposed Role){" "}
                  <span className="text-brand-red">*</span>
                </label>
                <p className="text-[10px] text-gray-400 mb-2">
                  เลือกรูปแบบที่คุณต้องการมีส่วนร่วมในโครงการ
                </p>
                <div className="space-y-2">
                  {[
                    {
                      id: "SWEAT_SHARE",
                      title: "ผู้ร่วมก่อตั้ง / ลงแรงแลกหุ้น (Sweat Share / Tech Lead)",
                      desc: "นำทักษะเฉพาะทางมาร่วมลงแรงเพื่อแลกกับส่วนแบ่งความสำเร็จของโครงการ",
                      Icon: GitMerge,
                    },
                    {
                      id: "INVESTOR",
                      title: "นักลงทุน / สปอนเซอร์ตั้งต้น (Seed Sponsor)",
                      desc: "สนับสนุนเงินทุนตั้งต้น อุปกรณ์ หรือทรัพยากรเพื่อเร่งการเติบโต",
                      Icon: Coins,
                    },
                    {
                      id: "PROJECT_MANAGER",
                      title: "สถาปนิกและผู้คุมโครงการ (Project Manager)",
                      desc: "วางโร้ดแมป บริหารจัดการทีม และควบคุมงบประมาณให้สำเร็จตามเป้า",
                      Icon: Layers,
                    },
                  ].map((r) => {
                    const isSelected = proposedRole === r.id;
                    const IconComponent = r.Icon;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setProposedRole(r.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? "bg-red-50/50 border-brand-red shadow-xs ring-1 ring-brand-red/30"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs mt-0.5 ${
                            isSelected
                              ? "bg-brand-red text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-xs font-bold block ${
                              isSelected ? "text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {r.title}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-0.5 leading-snug">
                            {r.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Switch back link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("KPI")}
                  className="text-xs font-bold text-gray-600 hover:text-gray-900 underline transition cursor-pointer"
                >
                  ← ต้องการรับงานแก้ปัญหาแบบเดี่ยว? (กลับไปหน้าเสนอ KPI)
                </button>
              </div>

              {/* Status Message */}
              {upgradeMsg && (
                <div
                  className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
                    upgradeMsg.includes("สำเร็จ")
                      ? "bg-gray-900 border-gray-900 text-white"
                      : "bg-red-50 border-red-200 text-brand-red"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>{upgradeMsg}</span>
                </div>
              )}
            </div>

            {/* Sticky Bottom Footer Actions for Upgrade */}
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white flex items-center justify-end gap-3 shrink-0 shadow-sm">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmittingUpgrade}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmittingUpgrade}
                className="px-6 py-2.5 bg-brand-red text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {isSubmittingUpgrade ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังส่งข้อเสนอ...</span>
                  </>
                ) : (
                  <span>ส่งข้อเสนออัปเกรดโครงการ</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
