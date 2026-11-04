"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MarketPulseWidget from "./MarketPulseWidget";

interface NegotiationModalProps {
  bountyId: string;
  initialPrizeTHB: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentUserRole?: string;
  initialProposedKPI?: string;
  initialOfferPriceTHB?: number;
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
}: NegotiationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [proposedKPI, setProposedKPI] = useState(initialProposedKPI);
  const [timeframeDays, setTimeframeDays] = useState<number>(7);
  const [priceTHB, setPriceTHB] = useState<number>(
    initialOfferPriceTHB || initialPrizeTHB || 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const quickDays = [3, 7, 14, 30];

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
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งข้อเสนอ";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
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
      className="absolute inset-0 z-50 flex flex-col justify-end bg-slate-900/80 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Sheet - Expanded full-width frame like Image 2 (Software Evolution Control) */}
      <div
        className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10 border-t border-slate-200 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Styled identically to Image 2 */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-inner shrink-0">
              <i className="fa-solid fa-handshake text-sm"></i>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                <h3 className="font-bold text-slate-900 leading-none text-sm sm:text-base">
                  พื้นที่เจรจางานและตั้ง KPI
                </h3>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 leading-none">
                ยื่นข้อเสนอตัวชี้วัดความสำเร็จและระยะเวลาส่งมอบงาน (Negotiation Sandbox)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 overflow-y-auto flex-1 space-y-5 hide-scrollbar">
            {/* Solver Identity Banner */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shadow-2xs">
                  <i className="fa-regular fa-user text-[11px]"></i>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-medium">ระดับผู้รับงานของคุณ</span>
                  <span className="text-xs font-bold text-slate-800">{tierLabel}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                สถานะ: ได้รับสิทธิ์เสนอ KPI
              </span>
            </div>

            {/* Field 1: สิ่งที่จะส่งมอบ (KPI / Deliverables) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. สิ่งที่จะส่งมอบ (KPI / Deliverables) <span className="text-brand-red">*</span>
              </label>
              <p className="text-[10px] text-slate-400 mb-1.5">
                ระบุผลงานที่วัดผลได้จริง ว่าเมื่อทำสิ่งนี้เสร็จจะถือว่างวดงานสมบูรณ์
              </p>
              <textarea
                rows={3}
                required
                value={proposedKPI}
                onChange={(e) => setProposedKPI(e.target.value)}
                placeholder="เช่น จัดทำเอกสารสรุป 1 ชุด, ส่งมอบระบบตามขอบเขตข้อกำหนด พร้อมทดสอบการทำงาน 100%..."
                className="w-full text-xs p-3.5 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-red-500/10 transition leading-relaxed text-slate-800 placeholder:text-slate-400 min-h-[90px]"
              />
            </div>

            {/* Field 2: ระยะเวลาทำงาน (Timeframe) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  2. ระยะเวลาทำงาน (วัน) <span className="text-brand-red">*</span>
                </label>
                <span className="text-[11px] font-mono font-bold text-slate-600">
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
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
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
                onChange={(e) => setTimeframeDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-red focus:bg-white text-slate-800 font-mono font-bold"
                placeholder="จำนวนวันทำงาน"
              />
            </div>

            {/* Field 3: ราคาเสนอ (Proposed Price) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">
                  3. ราคาเสนอ (บาท) <span className="text-brand-red">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  งบประมาณตั้งต้น: ฿{initialPrizeTHB.toLocaleString()}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                  ฿
                </span>
                <input
                  type="number"
                  min={0}
                  required
                  value={priceTHB}
                  onChange={(e) => setPriceTHB(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full text-sm pl-8 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-red focus:bg-white font-mono font-black text-slate-900"
                  placeholder="ระบุราคาที่เสนอ"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                คุณสามารถคงราคาเดิมไว้ หรือเสนอราคาใหม่เพื่อเจรจากับเจ้าของปัญหาได้
              </p>

              {/* Market Pulse (Demand-Supply & Price Benchmark Widget) */}
              <MarketPulseWidget bountyId={bountyId} className="mt-3" />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-brand-red text-xs font-medium flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation shrink-0"></i>
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-end gap-3 shrink-0 shadow-sm">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
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
      </div>
    </div>
  );

  const targetEl = typeof document !== "undefined" ? document.getElementById("mobile-phone-frame") : null;
  if (targetEl) {
    return createPortal(modalContent, targetEl);
  }

  return modalContent;
}
