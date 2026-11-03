'use client';

import React, { useState } from 'react';
import { NongDot } from '@/components/flow/NongDot';
import { HiddenNodesScannerModal } from '@/components/ecosystem/production/HiddenNodesScannerModal';
import { SIX_AXES_METADATA } from '@/lib/career-core';
import Link from 'next/link';
import {
  Sparkles,
  Coins,
  Compass,
  MapPin,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface LifeCapitalProfileCardProps {
  userName?: string | null;
}

export const LifeCapitalProfileCard: React.FC<LifeCapitalProfileCardProps> = ({
  userName,
}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [currentValuation, setCurrentValuation] = useState<{
    totalValuationThb: number;
    sweatThb: number;
    equipThb: number;
    venueThb: number;
    ipThb: number;
    selectedCount: number;
  }>({
    totalValuationThb: 85000,
    sweatThb: 45000,
    equipThb: 25000,
    venueThb: 15000,
    ipThb: 0,
    selectedCount: 3,
  });

  return (
    <div className="w-full rounded-3xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/60 dark:from-amber-950/30 dark:via-zinc-900 dark:to-orange-950/20 p-4 sm:p-5 shadow-sm space-y-3.5 font-prompt">
      {/* Header */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="shrink-0 pt-0.5">
            <NongDot mood="wealth" size={40} color="gold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-amber-950 dark:text-amber-200 tracking-tight">
                💎 พอร์ตโฟลิโอทุนชีวิต & สมการ 6 แกน
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                0 บาทก็มีหุ้น
              </span>
            </div>
            <p className="text-[10.5px] text-gray-600 dark:text-gray-300">
              ประเมินมูลค่าหยาดเหงื่อ ทำเล เครื่องมือ และเวลาว่างของคุณ
            </p>
          </div>
        </div>
      </div>

      {/* Big Golden Valuation Box */}
      <div className="p-3 rounded-2xl bg-white/95 dark:bg-zinc-800/80 border border-amber-200/80 dark:border-zinc-700 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="text-[9.5px] text-gray-500 dark:text-gray-400 font-bold block">
            มูลค่าทุนชีวิตแฝงสะสมที่ประเมินได้
          </span>
          <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 tracking-tight">
            ฿{currentValuation.totalValuationThb.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 ml-1.5 font-medium">
            (พร้อมแปลงเป็น Founder Equity)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white text-[10.5px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          🔍 สแกนเพิ่ม / อัปเดตทุน
        </button>
      </div>

      {/* Asset Breakdown Chips */}
      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800">
          <div className="text-[9px] text-indigo-700 dark:text-indigo-300 font-bold">หยาดเหงื่อ/สกิล</div>
          <div className="text-xs font-black font-mono text-indigo-900 dark:text-indigo-200 mt-0.5">
            ฿{currentValuation.sweatThb.toLocaleString()}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800">
          <div className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold">เครื่องมือ/รถ</div>
          <div className="text-xs font-black font-mono text-emerald-900 dark:text-emerald-200 mt-0.5">
            ฿{currentValuation.equipThb.toLocaleString()}
          </div>
        </div>
        <div className="p-2 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800">
          <div className="text-[9px] text-amber-700 dark:text-amber-300 font-bold">ทำเล/พื้นที่</div>
          <div className="text-xs font-black font-mono text-amber-900 dark:text-amber-200 mt-0.5">
            ฿{currentValuation.venueThb.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 6-Axis Monetization Quick Deploy Shortcuts */}
      <div className="pt-2 border-t border-amber-200/60 dark:border-zinc-800 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span className="font-bold">นำทุนชีวิตนี้ไปสร้างรายได้ 6 แกน:</span>
          <span className="text-amber-600 font-bold">ปลดล็อกครบ 6 ช่องทาง</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Link
            href="/ecosystem?tab=CAPITAL"
            className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-amber-400 text-left flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold text-gray-900 dark:text-white flex items-center gap-1">
                <span>💰</span>
                <span>ส่งเข้าตารางหุ้น</span>
              </div>
              <div className="text-[9px] text-gray-400">แปลงเป็น Sweat Equity</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </Link>

          <Link
            href="/ecosystem?tab=LOCAL"
            className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-amber-400 text-left flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="min-w-0">
              <div className="text-[10.5px] font-bold text-gray-900 dark:text-white flex items-center gap-1">
                <span>⚡</span>
                <span>เควสต์ด่วนใกล้บ้าน</span>
              </div>
              <div className="text-[9px] text-gray-400">ทำเล & กะดึก 24 ชม.</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </Link>
        </div>
      </div>

      {/* Hidden Nodes Scanner Modal */}
      <HiddenNodesScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onApplyToCapTable={(valData) => {
          setCurrentValuation({
            totalValuationThb: valData.totalValuationThb,
            sweatThb: valData.sweatThb,
            equipThb: valData.equipThb,
            venueThb: valData.venueThb,
            ipThb: valData.ipThb,
            selectedCount: valData.selectedNodeIds.length,
          });
        }}
      />
    </div>
  );
};
