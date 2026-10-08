'use client';

import React from 'react';
import { INDUSTRIES_LIST } from '../constants';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';
import { SubIndustryItem } from '../types';

interface StepScopeViewProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  onSelectIndustry: (indId: string) => void;
  onSelectSubIndustry: (subId: string) => void;
  onSelectSegment: (segId: string) => void;
  onNextStep: () => void;
}

export const StepScopeView: React.FC<StepScopeViewProps> = ({
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  onSelectIndustry,
  onSelectSubIndustry,
  onSelectSegment,
  onNextStep,
}) => {
  const currentIndustry = INDUSTRIES_LIST.find((i) => i.id === selectedIndustryId) || INDUSTRIES_LIST[0];
  const currentSubIndustries: SubIndustryItem[] = ALL_SUB_INDUSTRIES[selectedIndustryId] || [];
  const activeSubIndustry = currentSubIndustries.find((s) => s.id === selectedSubIndustryId) || currentSubIndustries[0];
  const activeSegment = activeSubIndustry?.segments?.find((s) => s.id === selectedSegmentId) || activeSubIndustry?.segments?.[0];

  const cardCls = 'bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 @2xl:p-5 shadow-xs space-y-4';
  const selectCls = 'w-full h-11 rounded-xl border border-gray-200 dark:border-[#2c313a] bg-white dark:bg-[#12141a] pl-3.5 pr-9 text-[13px] font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:border-brand-red appearance-none cursor-pointer transition-colors';
  const labelCls = 'flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400';
  const chipCls = 'w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center';

  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-brand-red/10 to-transparent p-4 rounded-2xl border border-orange-500/20">
        <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider block mb-1">
          ขั้นตอนที่ 1 จาก 12
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          เลือกอุตสาหกรรม & สเปกโครงการ (Project Scope)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          กำหนดสายงาน หมวดหลัก และรูปแบบเฉพาะของโครงการ เพื่อดึงเกณฑ์มาตรฐานสินทรัพย์ที่ต้องแปลงเป็นทุน
        </p>
      </div>

      {/* Selectors Card */}
      <div className={cardCls}>
        <div className="space-y-4">
          {/* Level 1: สายงาน */}
          <div>
            <label className={labelCls}>
              <span className={`${chipCls} bg-gray-900 dark:bg-gray-100 dark:text-gray-900`}>1</span>
              สายงานอุตสาหกรรม (Industry Sector)
            </label>
            <div className="relative">
              <select
                value={selectedIndustryId}
                onChange={(e) => onSelectIndustry(e.target.value)}
                className={selectCls}
              >
                {INDUSTRIES_LIST.map((ind) => (
                  <option key={ind.id} value={ind.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
                    {ind.code} {ind.name}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          {/* Level 2: หมวดหลัก */}
          {currentSubIndustries.length > 0 && (
            <div>
              <label className={labelCls}>
                <span className={`${chipCls} bg-blue-600`}>2</span>
                หมวดหลักในสายงาน (Main Sub-Category)
              </label>
              <div className="relative">
                <select
                  value={selectedSubIndustryId || (currentSubIndustries[0]?.id ?? '')}
                  onChange={(e) => onSelectSubIndustry(e.target.value)}
                  className={selectCls}
                >
                  {currentSubIndustries.map((sub) => (
                    <option key={sub.id} value={sub.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
                      {sub.code} {sub.name}
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
              </div>
            </div>
          )}

          {/* Level 3: รูปแบบโครงการ */}
          {activeSubIndustry?.segments && activeSubIndustry.segments.length > 0 && (
            <div>
              <label className={labelCls}>
                <span className={`${chipCls} bg-purple-600`}>3</span>
                เจาะจงรูปแบบโครงการ (Project Segment)
              </label>
              <div className="relative">
                <select
                  value={selectedSegmentId || (activeSubIndustry.segments[0]?.id ?? '')}
                  onChange={(e) => onSelectSegment(e.target.value)}
                  className={selectCls}
                >
                  {activeSubIndustry.segments.map((seg) => (
                    <option key={seg.id} value={seg.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
                      {seg.name}
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Scope Summary Preview */}
      <div className="bg-[#fcfcfd] dark:bg-[#16181f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-brand-red flex items-center justify-center text-xs">
              <i className={currentIndustry.icon}></i>
            </span>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                {currentIndustry.code} {currentIndustry.name}
              </h4>
              <p className="text-[10px] text-gray-400">
                {activeSubIndustry?.name}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
            {currentIndustry.activeBounties} Active Quests
          </span>
        </div>

        {activeSegment && (
          <div className="p-3 bg-white dark:bg-[#1a1c24] rounded-xl border border-gray-100 dark:border-gray-800">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block mb-0.5">
              รูปแบบที่เลือก:
            </span>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {activeSegment.name}
            </p>
            {activeSubIndustry?.description && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {activeSubIndustry.description}
              </p>
            )}
          </div>
        )}

        {/* Next Step Button */}
        <button
          onClick={onNextStep}
          className="w-full mt-2 py-3 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <span>ถัดไป: คำนวณมูลค่าระดมทุน (Total Valuation)</span>
          <i className="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
