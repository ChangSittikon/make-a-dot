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
}

export default function NegotiationModal({
  bountyId,
  initialPrizeTHB,
  isOpen,
  onClose,
  onSuccess,
  currentUserRole = "USER",
}: NegotiationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [proposedKPI, setProposedKPI] = useState("");
  const [timeframeDays, setTimeframeDays] = useState<number>(7);
  const [priceTHB, setPriceTHB] = useState<number>(initialPrizeTHB || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Card - Quiet Luxury Style, strictly inside the mobile phone frame */}
      <div
        className="w-full max-w-[390px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92%] relative z-10 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-brand-red"></span>
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
                พื้นที่เจรจางานและตั้ง KPI
              </h2>
            </div>
            <p className="text-[11px] text-gray-400">
              ยื่นข้อเสนอตัวชี้วัดความสำเร็จและระยะเวลาส่งมอบงาน (Negotiation Sandbox)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition flex items-center justify-center cursor-pointer shrink-0 ml-2"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto hide-scrollbar p-4 sm:p-5 space-y-4 flex-1">
          {/* Solver Identity Banner */}
          <div className="p-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shadow-2xs">
                <i className="fa-regular fa-user text-[10px]"></i>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block font-medium">ระดับผู้รับงานของคุณ</span>
                <span className="text-[11px] font-bold text-gray-800">{tierLabel}</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-500">
              สถานะ: ได้รับสิทธิ์เสนอ KPI
            </span>
          </div>

          {/* Field 1: สิ่งที่จะส่งมอบ (KPI / Deliverables) */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              1. สิ่งที่จะส่งมอบ (KPI / Deliverables) <span className="text-brand-red">*</span>
            </label>
            <p className="text-[10px] text-gray-400 mb-1.5">
              ระบุผลงานที่วัดผลได้จริง ว่าเมื่อทำสิ่งนี้เสร็จจะถือว่างวดงานสมบูรณ์
            </p>
            <textarea
              rows={3}
              required
              value={proposedKPI}
              onChange={(e) => setProposedKPI(e.target.value)}
              placeholder="เช่น จัดทำเอกสารสรุป 1 ชุด, ส่งมอบระบบตามขอบเขตข้อกำหนด พร้อมทดสอบการทำงาน 100%..."
              className="w-full text-xs p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white focus:ring-2 focus:ring-red-500/10 transition leading-relaxed text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Field 2: ระยะเวลาทำงาน (Timeframe) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-800">
                2. ระยะเวลาทำงาน (วัน) <span className="text-brand-red">*</span>
              </label>
              <span className="text-[10px] font-mono text-gray-500">
                {timeframeDays > 0 ? `${timeframeDays} วัน` : "ยังไม่กำหนด"}
              </span>
            </div>

            {/* Quick Pills */}
            <div className="flex items-center gap-1.5 mb-2">
              {quickDays.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setTimeframeDays(d)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    timeframeDays === d
                      ? "bg-gray-900 text-white border-gray-900 shadow-2xs"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
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
              className="w-full text-xs px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-gray-800"
              placeholder="จำนวนวันทำงาน"
            />
          </div>

          {/* Field 3: ราคาเสนอ (Proposed Price) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-800">
                3. ราคาเสนอ (บาท) <span className="text-brand-red">*</span>
              </label>
              <span className="text-[10px] text-gray-400">
                งบประมาณตั้งต้น: ฿{initialPrizeTHB.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                ฿
              </span>
              <input
                type="number"
                min={0}
                required
                value={priceTHB}
                onChange={(e) => setPriceTHB(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-xs pl-7 pr-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white font-mono font-bold text-gray-900"
                placeholder="ระบุราคาที่เสนอ"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              คุณสามารถคงราคาเดิมไว้ หรือเสนอราคาใหม่เพื่อเจรจากับเจ้าของปัญหาได้
            </p>

            {/* Market Pulse (Demand-Supply & Price Benchmark Widget) */}
            <MarketPulseWidget bountyId={bountyId} className="mt-2.5" />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-brand-red text-[11px] font-medium flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation shrink-0"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-red-600 transition shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
