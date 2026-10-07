"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NegotiationModal from "./NegotiationModal";
import UpgradeBountyButton from "@/app/profile/bounty/[id]/UpgradeBountyButton";

interface SolverActionSectionProps {
  bountyId: string;
  initialPrizeTHB: number;
  currentUserRole?: string;
  isRequester: boolean;
  bountyStatus: string;
  myNegotiationStatus?: string | null;
}

export default function SolverActionSection({
  bountyId,
  initialPrizeTHB,
  currentUserRole = "USER",
  isRequester,
  bountyStatus,
  myNegotiationStatus,
}: SolverActionSectionProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCompleted = bountyStatus === "COMPLETED";
  const isActive = bountyStatus === "ACTIVE";

  return (
    <div className="mt-4 bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            พื้นที่รับงานและเสนอเงื่อนไข
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {isRequester
              ? "คุณสามารถยื่นข้อเสนอ KPI หรือรับงานที่ตนเองสร้างได้เช่นกัน"
              : "รับงานแก้ปัญหานี้ หรือยื่นข้อเสนอขอเป็นโครงการระยะยาว"}
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-bold">
          {isRequester ? "OWNER & SOLVER" : "SOLVER VIEW"}
        </span>
      </div>

      {/* Already Submitted Status Banner */}
      {myNegotiationStatus === "PENDING" && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="font-bold">คุณได้ยื่นข้อเสนอ KPI แล้ว (รอเจ้าของงานพิจารณา)</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-bold text-amber-900 underline hover:no-underline cursor-pointer"
          >
            ยื่นข้อเสนอใหม่
          </button>
        </div>
      )}

      {myNegotiationStatus === "ACCEPTED" && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-bold">ข้อเสนอของคุณได้รับการตอบรับแล้ว! เริ่มดำเนินการได้ทันที</span>
        </div>
      )}

      {/* Primary Action Button: รับงาน (เจรจา) */}
      {!isCompleted && !isActive && (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3.5 px-6 bg-brand-red text-white text-sm font-bold rounded-2xl hover:bg-red-600 transition shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>รับงาน (เจรจา)</span>
        </button>
      )}

      {isActive && (
        <div className="py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500 font-medium">
          งานนี้กำลังอยู่ระหว่างดำเนินการโดยผู้รับงาน
        </div>
      )}

      {isCompleted && (
        <div className="py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-xs text-gray-500 font-medium">
          ภารกิจนี้สำเร็จเสร็จสิ้นแล้ว
        </div>
      )}

      {/* Alternative Option: Upgrade to Project */}
      {!isCompleted && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-center text-[11px] text-gray-400 mb-2.5">
            หรือมองว่าปัญหานี้ควรขับเคลื่อนในระดับโปรเจกต์ระยะยาว?
          </p>
          <UpgradeBountyButton bountyId={bountyId} />
        </div>
      )}

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
    </div>
  );
}
