"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NegotiationModal from "./NegotiationModal";

interface StickySolverBarProps {
  bountyId: string;
  initialPrizeTHB: number;
  prizeText: string;
  bountyStatus: string;
  currentUserRole?: string;
  myNegotiationStatus?: string | null;
}

export default function StickySolverBar({
  bountyId,
  initialPrizeTHB,
  prizeText,
  bountyStatus,
  currentUserRole = "USER",
  myNegotiationStatus,
}: StickySolverBarProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCompleted = bountyStatus === "COMPLETED";
  const isActive = bountyStatus === "ACTIVE";

  return (
    <>
      {/* Sticky Bottom Bar - Quiet Luxury SaaS Aesthetic */}
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-5 py-3.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.04)] z-20 shrink-0">
        {/* Left: Reward Amount */}
        <div>
          <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider">
            ค่าตอบแทน
          </span>
          <span className="text-base sm:text-lg font-black text-gray-900 leading-tight font-mono tracking-tight block">
            {prizeText}
          </span>
        </div>

        {/* Right: Contextual Action Button */}
        <div>
          {isCompleted ? (
            <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold inline-block">
              ภารกิจเสร็จสิ้น
            </span>
          ) : isActive ? (
            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-block">
              กำลังดำเนินการ
            </span>
          ) : myNegotiationStatus === "PENDING" ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>รอพิจารณา (แก้ไขข้อเสนอ)</span>
            </button>
          ) : myNegotiationStatus === "ACCEPTED" ? (
            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-block">
              ได้รับเลือกให้รับงานนี้แล้ว
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-brand-red hover:bg-red-600 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-sm active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
            >
              <span>รับงาน (เจรจา)</span>
            </button>
          )}
        </div>
      </div>

      {/* The Negotiation Sandbox Modal */}
      <NegotiationModal
        bountyId={bountyId}
        initialPrizeTHB={initialPrizeTHB}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserRole={currentUserRole}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
