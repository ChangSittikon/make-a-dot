"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import BountyNegotiationInbox, {
  NegotiationItem,
  UpgradeProposalItem,
} from "@/components/bounty/BountyNegotiationInbox";
import { Bell, X } from "lucide-react";

export interface BountyProposalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounty: {
    id: string;
    originDotCode?: string | null;
    rawDescription?: string | null;
    negotiations?: NegotiationItem[];
    upgradeProposals?: UpgradeProposalItem[];
  } | null;
}

export function BountyProposalsModal({
  isOpen,
  onClose,
  bounty,
}: BountyProposalsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !bounty) return null;

  const displayCode =
    bounty.originDotCode || `#DOT-${bounty.id.slice(-6).toUpperCase()}`;

  const cleanDescription = (bounty.rawDescription || "เควสต์ของคุณ")
    .replace(/^["'“]|["'”]$/g, "")
    .trim();

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-prompt animate-fade-in">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Box */}
      <div className="bg-white border-2 border-gray-900 rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-2xl max-w-[400px] w-full max-h-[88vh] flex flex-col relative z-10 overflow-hidden">
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold flex items-center justify-center transition-colors cursor-pointer z-20"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4 text-gray-900" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center pt-1 pb-3 border-b border-gray-200 shrink-0">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-900 rounded-full mb-1">
            {displayCode}
          </span>
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-red" />
            <span>ข้อเสนอจากผู้เชี่ยวชาญ</span>
          </h2>
          <p className="text-[11px] text-gray-500 font-medium line-clamp-1 max-w-[280px] mt-0.5">
            {cleanDescription}
          </p>
        </div>

        {/* Scrollable Proposals Inbox */}
        <div className="flex-1 overflow-y-auto py-2 pr-0.5 no-scrollbar">
          <BountyNegotiationInbox
            bountyId={bounty.id}
            initialNegotiations={bounty.negotiations || []}
            initialUpgradeProposals={bounty.upgradeProposals || []}
          />
        </div>

        {/* Bottom Close Button */}
        <div className="pt-3 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm text-center"
          >
            ปิดหน้าต่างนี้
          </button>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}

export default BountyProposalsModal;
