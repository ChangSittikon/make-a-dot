"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProposalActionButtons from "@/app/profile/bounty/[id]/ProposalActionButtons";

export interface SolverInfo {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  avatarUrl: string | null;
  trustScore?: number;
}

export interface NegotiationItem {
  id: string;
  bountyId: string;
  solverId: string;
  proposedKPI: string;
  timeframeDays: number;
  priceSatang: number;
  status: string; // PENDING | ACCEPTED | REJECTED
  createdAt: string | Date;
  solver: SolverInfo;
}

export interface UpgradeProposalItem {
  id: string;
  bountyId: string;
  proposerId: string;
  vision: string;
  proposedRole: string;
  status: string;
  createdAt: string | Date;
  proposer: {
    id: string;
    name: string | null;
    role: string;
    trustScore?: number;
  };
}

interface BountyNegotiationInboxProps {
  bountyId: string;
  initialNegotiations: NegotiationItem[];
  initialUpgradeProposals: UpgradeProposalItem[];
}

export default function BountyNegotiationInbox({
  bountyId,
  initialNegotiations = [],
  initialUpgradeProposals = [],
}: BountyNegotiationInboxProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"SOLVER_KPI" | "UPGRADE_PROPOSALS">("SOLVER_KPI");
  const [negotiations, setNegotiations] = useState<NegotiationItem[]>(initialNegotiations);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleAction = async (negotiationId: string, action: "ACCEPT" | "REJECT") => {
    setProcessingId(negotiationId);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/bounties/${bountyId}/negotiate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ negotiationId, action }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(data.message || (action === "ACCEPT" ? "ตกลงจ้างสำเร็จ" : "ปฏิเสธข้อเสนอแล้ว"));
        
        // Update local negotiations state
        setNegotiations((prev) =>
          prev.map((item) => {
            if (item.id === negotiationId) {
              return { ...item, status: action === "ACCEPT" ? "ACCEPTED" : "REJECTED" };
            }
            if (action === "ACCEPT" && item.status === "PENDING") {
              return { ...item, status: "REJECTED" };
            }
            return item;
          })
        );

        router.refresh();
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการประมวลผล");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย");
    } finally {
      setProcessingId(null);
    }
  };

  const getTierLabel = (role: string) => {
    switch (role) {
      case "PROFESSIONAL":
        return "TIER 2 (PROFESSIONAL)";
      case "GUARANTOR":
        return "TIER 3 (GUARANTOR)";
      case "DIRECTOR":
        return "TIER 4 (DIRECTOR)";
      case "ADMIN":
        return "TIER 5 (ADMIN)";
      case "USER":
      default:
        return "TIER 1 (USER)";
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Inbox Header with Two Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-gray-200/80 shadow-2xs">
        <div className="grid grid-cols-2 gap-1.5">
          {/* Tab 1: ผู้เสนอตัวรับงาน */}
          <button
            type="button"
            onClick={() => setActiveTab("SOLVER_KPI")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "SOLVER_KPI"
                ? "bg-gray-900 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <span>ผู้เสนอตัวรับงาน</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === "SOLVER_KPI"
                  ? "bg-brand-red text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {negotiations.length}
            </span>
          </button>

          {/* Tab 2: ข้อเสนออัปเกรด */}
          <button
            type="button"
            onClick={() => setActiveTab("UPGRADE_PROPOSALS")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "UPGRADE_PROPOSALS"
                ? "bg-gray-900 text-white shadow-xs"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <span>ข้อเสนออัปเกรด</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                activeTab === "UPGRADE_PROPOSALS"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {initialUpgradeProposals.length}
            </span>
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
            <span>{actionMessage}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-emerald-500 hover:text-emerald-800 text-xs cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* TAB 1 CONTENT: ผู้เสนอตัวรับงาน (Bounty Negotiations) */}
      {activeTab === "SOLVER_KPI" && (
        <div className="space-y-3">
          {negotiations.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl shadow-2xs border border-gray-100 text-center py-10">
              <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 mx-auto flex items-center justify-center mb-2.5">
                <i className="fa-regular fa-inbox text-base"></i>
              </div>
              <p className="text-gray-700 text-xs font-bold">ยังไม่มีผู้เสนอตัวรับงานในขณะนี้</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
                เมื่อผู้เชี่ยวชาญเข้ามากดรับงานและเสนอเงื่อนไข KPI ข้อมูลจะแสดงที่นี่เพื่อให้คุณพิจารณา
              </p>
            </div>
          ) : (
            negotiations.map((item) => {
              const isAccepted = item.status === "ACCEPTED";
              const isRejected = item.status === "REJECTED";
              const isPending = item.status === "PENDING";
              const isBusy = processingId === item.id;
              const formattedPrice = (item.priceSatang / 100).toLocaleString();

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 shadow-2xs border transition-all ${
                    isAccepted
                      ? "border-emerald-200 bg-emerald-50/15"
                      : isRejected
                      ? "border-gray-200/60 opacity-60"
                      : "border-gray-200/80 hover:border-gray-300"
                  }`}
                >
                  {/* Top: Solver Header */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        {item.solver.image ? (
                          <img
                            src={item.solver.image}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fa-regular fa-user text-gray-500 text-xs"></i>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900 leading-tight">
                            {item.solver.name || "ผู้ใช้งานนิรนาม"}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200/60">
                            {getTierLabel(item.solver.role)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          ตกลงจ้างแล้ว
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          ปฏิเสธแล้ว
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          รอการพิจารณา
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proposed Deliverables & Metrics (KPI) */}
                  <div className="bg-gray-50/80 rounded-xl p-3.5 mb-3.5 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wide">
                      สิ่งที่จะส่งมอบ (KPI / Deliverables)
                    </span>
                    <p className="text-xs text-gray-800 font-normal leading-relaxed whitespace-pre-line">
                      {item.proposedKPI}
                    </p>
                  </div>

                  {/* Terms Strip: Timeframe & Price */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs">
                      <span className="text-[10px] text-gray-400 font-medium block">ระยะเวลาทำงาน</span>
                      <span className="text-xs font-bold text-gray-800 font-mono mt-0.5 block">
                        {item.timeframeDays} วัน
                      </span>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-2xs">
                      <span className="text-[10px] text-gray-400 font-medium block">ราคาที่เสนอ</span>
                      <span className="text-xs font-bold text-brand-red font-mono mt-0.5 block">
                        ฿{formattedPrice}
                      </span>
                    </div>
                  </div>

                  {/* Actions for Requester (Only when PENDING) */}
                  {isPending && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleAction(item.id, "ACCEPT")}
                        className="flex-1 py-2 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isBusy ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span>ตกลงจ้าง</span>
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleAction(item.id, "REJECT")}
                        className="py-2 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition border border-gray-200 disabled:opacity-50 cursor-pointer"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2 CONTENT: ข้อเสนออัปเกรด (Project Upgrade Proposals) */}
      {activeTab === "UPGRADE_PROPOSALS" && (
        <div className="space-y-4">
          {initialUpgradeProposals.length === 0 ? (
            <div className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 text-center py-8">
              <p className="text-gray-400 text-xs font-medium">ยังไม่มีข้อเสนออัปเกรดในขณะนี้</p>
              <p className="text-[11px] text-gray-300 mt-1">รอผู้เชี่ยวชาญยื่นข้อเสนอโครงการ</p>
            </div>
          ) : (
            initialUpgradeProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white p-5 rounded-2xl shadow-2xs border border-gray-100 relative"
              >
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                    {proposal.proposer.name ? proposal.proposer.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-none mb-1">
                      {proposal.proposer.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md tracking-wider">
                        {getTierLabel(proposal.proposer.role)}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        ขอเป็น {proposal.proposedRole.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 mb-3.5 border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    &ldquo;{proposal.vision}&rdquo;
                  </p>
                </div>

                {proposal.status === "PENDING" ? (
                  <ProposalActionButtons bountyId={bountyId} proposalId={proposal.id} />
                ) : (
                  <div className="text-center py-2 text-xs font-bold text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                    {proposal.status}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
