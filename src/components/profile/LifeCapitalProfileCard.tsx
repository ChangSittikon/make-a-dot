'use client';

import React, { useState } from 'react';
import { NongDot } from '@/components/flow/NongDot';
import { HiddenNodesScannerModal } from '@/components/ecosystem/production/HiddenNodesScannerModal';
import Link from 'next/link';
import {
  Search,
  PieChart,
  MapPin,
  ChevronRight,
} from 'lucide-react';

interface LifeCapitalProfileCardProps {
  userName?: string | null;
}

export const LifeCapitalProfileCard: React.FC<LifeCapitalProfileCardProps> = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [currentValuation] = useState<{
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
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs space-y-3.5 font-prompt">
      {/* Header: เรียบ คม สไตล์ Swiss Grid */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NongDot mood="classic" size={32} color="red" />
          <h3 className="text-base font-black text-gray-900 tracking-tight">
            พอร์ตโฟลิโอทุนชีวิต
          </h3>
        </div>
      </div>

      {/* กล่องตัวเลขมูลค่าทุนชีวิต: คมชัด ตัวเลขสีดำใหญ่เด่น ปุ่มสีดำสไตล์ Swiss */}
      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
            มูลค่าทุนชีวิตสะสม
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-gray-900 tracking-tight block">
            ฿{currentValuation.totalValuationThb.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowScanner(true)}
          className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-white" />
          <span>สแกนเพิ่ม / อัปเดตทุน</span>
        </button>
      </div>

      {/* ตารางย่อย 3 ช่อง: ขาว-เทา ขอบเส้นทึบเรียบๆ ตัวเลขสีดำคมชัด */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-white border border-gray-200">
          <div className="text-[10px] text-gray-500 font-bold">หยาดเหงื่อ/สกิล</div>
          <div className="text-xs sm:text-sm font-black font-mono text-gray-900 mt-0.5">
            ฿{currentValuation.sweatThb.toLocaleString()}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-gray-200">
          <div className="text-[10px] text-gray-500 font-bold">เครื่องมือ/รถ</div>
          <div className="text-xs sm:text-sm font-black font-mono text-gray-900 mt-0.5">
            ฿{currentValuation.equipThb.toLocaleString()}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-gray-200">
          <div className="text-[10px] text-gray-500 font-bold">ทำเล/พื้นที่</div>
          <div className="text-xs sm:text-sm font-black font-mono text-gray-900 mt-0.5">
            ฿{currentValuation.venueThb.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 2 ปุ่มลัดคลีนๆ (Zero Fluff): ส่งเข้าตารางหุ้น & เควสต์ด่วนใกล้บ้าน */}
      <div className="pt-1 grid grid-cols-2 gap-2">
        <Link
          href="/ecosystem?tab=CAPITAL"
          className="p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-900 text-left flex items-center justify-between transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <PieChart className="w-4 h-4 text-brand-red shrink-0" />
            <span className="text-xs font-bold text-gray-900 truncate">ส่งเข้าตารางหุ้น</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors shrink-0" />
        </Link>

        <Link
          href="/ecosystem?tab=LOCAL"
          className="p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-900 text-left flex items-center justify-between transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 text-brand-red shrink-0" />
            <span className="text-xs font-bold text-gray-900 truncate">เควสต์ด่วนใกล้บ้าน</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-colors shrink-0" />
        </Link>
      </div>

      {/* Hidden Nodes Scanner Modal */}
      <HiddenNodesScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};
