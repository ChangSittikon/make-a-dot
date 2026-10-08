'use client';

import React from 'react';
import { CapTableItem } from '../types';
import { INDUSTRIES_LIST } from '../constants';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';

interface StepValuationViewProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  capTableData: CapTableItem[];
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepValuationView: React.FC<StepValuationViewProps> = ({
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  capTableData,
  onPrevStep,
  onNextStep,
}) => {
  const currentIndustry = INDUSTRIES_LIST.find((i) => i.id === selectedIndustryId) || INDUSTRIES_LIST[0];
  const currentSubIndustries = ALL_SUB_INDUSTRIES[selectedIndustryId] || [];
  const activeSubIndustry = currentSubIndustries.find((s) => s.id === selectedSubIndustryId) || currentSubIndustries[0];
  const activeSegment = activeSubIndustry?.segments?.find((s) => s.id === selectedSegmentId) || activeSubIndustry?.segments?.[0];

  const totalValuation = capTableData.reduce((acc, cur) => acc + cur.value, 0);

  const formatCompact = (val: number) => {
    if (val >= 1000000) {
      const m = (val / 1000000).toFixed(2);
      return `${m.replace(/\.00$/, '')} ล้านบาท (M THB)`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)} พันบาท (K THB)`;
    }
    return `${val.toLocaleString()} THB`;
  };

  const cardCls = 'bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 @2xl:p-5 shadow-xs space-y-4';

  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent p-4 rounded-2xl border border-blue-500/20">
        <span className="text-[10px] font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
          ขั้นตอนที่ 2 จาก 12
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          มูลค่าระดมทุนรวม (Total Valuation)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ประเมินมูลค่าสินทรัพย์และเป้าหมายระดมทุนรวมของโครงการ โดยแปลงทรัพยากรทุกประเภทรวมเข้าด้วยกัน
        </p>
      </div>

      {/* Main Valuation Display Card */}
      <div className={cardCls}>
        <div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            เป้าหมายมูลค่าระดมทุนสุทธิ
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-mono tracking-tight leading-none">
              {totalValuation.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-gray-400">THB</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-sky-400 font-medium mt-1">
            ≈ {formatCompact(totalValuation)}
          </p>
        </div>

        {/* Stacked proportion bar */}
        <div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1.5 font-medium">
            <span>สัดส่วน 5 ประเภทสินทรัพย์</span>
            <span>100%</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5 bg-gray-100 dark:bg-gray-800">
            {totalValuation > 0 && capTableData.map((item) =>
              item.value > 0 ? (
                <span
                  key={item.id}
                  className="h-full transition-all duration-300 relative group"
                  style={{ width: `${(item.value / totalValuation) * 100}%`, backgroundColor: item.color }}
                  title={`${item.name}: ${((item.value / totalValuation) * 100).toFixed(1)}%`}
                />
              ) : null
            )}
          </div>
        </div>

        {/* Quick Legend Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          {capTableData.map((item) => {
            const pct = totalValuation > 0 ? ((item.value / totalValuation) * 100).toFixed(1) : '0.0';
            return (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/70 dark:bg-[#13151a]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div className="min-w-0">
                  <span className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate">
                    {item.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-gray-900 dark:text-gray-100">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Breadcrumb Path */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-[10px] text-gray-400 block mb-1.5 font-medium">เส้นทางโครงการ:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#20232b] text-gray-700 dark:text-gray-300 text-[10px] font-semibold">
              {currentIndustry.code} {currentIndustry.name}
            </span>
            {activeSubIndustry && (
              <>
                <i className="fa-solid fa-chevron-right text-[8px] text-gray-300 dark:text-gray-600"></i>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-[10px] font-semibold border border-blue-200/60 dark:border-blue-900/40">
                  {activeSubIndustry.name}
                </span>
              </>
            )}
            {activeSegment && (
              <>
                <i className="fa-solid fa-chevron-right text-[8px] text-gray-300 dark:text-gray-600"></i>
                <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-semibold border border-purple-200/60 dark:border-purple-900/40">
                  {activeSegment.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onPrevStep}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#20232b] dark:hover:bg-[#282c36] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all"
        >
          <i className="fa-solid fa-arrow-left text-[11px] mr-1.5"></i>
          ย้อนกลับ
        </button>
        <button
          onClick={onNextStep}
          className="flex-1 py-3 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <span>ถัดไป: สัดส่วนหุ้นส่วน (Cap Table)</span>
          <i className="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
