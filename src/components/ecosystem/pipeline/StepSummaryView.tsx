'use client';

import React, { useState } from 'react';
import { CapTableItem } from '../types';
import { INDUSTRIES_LIST } from '../constants';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';

interface StepSummaryViewProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  capTableData: CapTableItem[];
  onPrevStep: () => void;
  onGoToStep: (step: number) => void;
}

export const StepSummaryView: React.FC<StepSummaryViewProps> = ({
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  capTableData,
  onPrevStep,
  onGoToStep,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  const currentIndustry = INDUSTRIES_LIST.find((i) => i.id === selectedIndustryId) || INDUSTRIES_LIST[0];
  const currentSubIndustries = ALL_SUB_INDUSTRIES[selectedIndustryId] || [];
  const activeSubIndustry = currentSubIndustries.find((s) => s.id === selectedSubIndustryId) || currentSubIndustries[0];
  const activeSegment = activeSubIndustry?.segments?.find((s) => s.id === selectedSegmentId) || activeSubIndustry?.segments?.[0];

  const totalValuation = capTableData.reduce((acc, cur) => acc + cur.value, 0);

  const handleDeployQuest = () => {
    setIsDeployed(true);
    setTimeout(() => {
      alert('สร้างเควสต์สำเร็จ! โครงการถูกส่งเข้ากระดานเควสต์กลาง (Make a dot Board) เรียบร้อย');
    }, 300);
  };

  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-brand-red/10 to-transparent p-4 rounded-2xl border border-emerald-500/20">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
          ขั้นตอนที่ 12 จาก 12: พร้อมเปิดตัว
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          สรุปโครงสร้างทุน & ปล่อยเควสต์ (Launch Project)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ตรวจสอบความถูกต้องของสเปกและสัดส่วนสินทรัพย์ทั้งหมด พร้อมเปลี่ยนเป็นเควสต์เพื่อระดมพาร์ทเนอร์
        </p>
      </div>

      {/* Executive Summary Card */}
      <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 @2xl:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">ชื่อโครงการจำลอง</span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {activeSegment?.name || activeSubIndustry?.name || currentIndustry.name}
            </h3>
            <span className="text-[10px] text-gray-500">
              สายงาน {currentIndustry.name}
            </span>
          </div>
          <button
            onClick={() => onGoToStep(1)}
            className="text-[10px] font-bold text-brand-red hover:underline"
          >
            แก้ไขสเปก
          </button>
        </div>

        {/* Valuation Recap */}
        <div className="p-3 bg-gray-50 dark:bg-[#12141a] rounded-xl flex items-baseline justify-between">
          <span className="text-xs text-gray-500">มูลค่าระดมทุนสุทธิ:</span>
          <span className="text-lg font-black text-gray-900 dark:text-white font-mono">
            {totalValuation.toLocaleString()} THB
          </span>
        </div>

        {/* Asset Distribution Mini Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-gray-300">
            <span>สินทรัพย์ที่แปลงเป็นทุน</span>
            <button onClick={() => onGoToStep(3)} className="text-[10px] text-blue-600 dark:text-sky-400 font-normal hover:underline">
              ดู Cap Table
            </button>
          </div>
          <div className="space-y-1.5">
            {capTableData.map((c) => {
              const pct = totalValuation > 0 ? ((c.value / totalValuation) * 100).toFixed(1) : '0.0';
              return (
                <div key={c.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50/70 dark:bg-[#13151b]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-700 dark:text-gray-300 text-[11px]">{c.name.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-900 dark:text-white text-[11px]">{c.value.toLocaleString()} THB</span>
                    <span className="font-mono text-[10px] text-gray-400 font-bold">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleDeployQuest}
          disabled={isDeployed}
          className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
            isDeployed
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-brand-red hover:bg-red-700 text-white'
          }`}
        >
          <i className={isDeployed ? 'fa-solid fa-check' : 'fa-solid fa-rocket'}></i>
          <span>{isDeployed ? 'เควสต์เปิดตัวบนกระดานแล้ว' : 'เปิดตัวเควสต์ระดมทุน (Launch Bounty Quest)'}</span>
        </button>

        <button
          onClick={() => setIsSaved(true)}
          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#1e2129] dark:hover:bg-[#252933] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all"
        >
          {isSaved ? '✓ บันทึกร่างแบบจำลองสำเร็จ' : 'บันทึกร่างแบบจำลอง (Save Draft)'}
        </button>

        <button
          onClick={onPrevStep}
          className="w-full py-2 text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <i className="fa-solid fa-arrow-left text-[10px] mr-1"></i>
          ย้อนกลับไปแก้ไขขั้นตอนก่อนหน้า
        </button>
      </div>
    </div>
  );
};
