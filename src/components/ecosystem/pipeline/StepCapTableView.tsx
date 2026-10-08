'use client';

import React from 'react';
import { CapTableItem } from '../types';

interface StepCapTableViewProps {
  capTableData: CapTableItem[];
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepCapTableView: React.FC<StepCapTableViewProps> = ({
  capTableData,
  onPrevStep,
  onNextStep,
}) => {
  const totalValuation = capTableData.reduce((acc, cur) => acc + cur.value, 0);

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPct = 0;

  const cardCls = 'bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 @2xl:p-5 shadow-xs space-y-4';

  const splitName = (n: string) => {
    const m = n.match(/^(.*?)\s*\((.*)\)$/);
    return m ? { th: m[1], en: m[2] } : { th: n, en: '' };
  };

  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-4 rounded-2xl border border-emerald-500/20">
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
          ขั้นตอนที่ 3 จาก 12
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          โครงสร้างความเป็นเจ้าของ (Cap Table & Equity)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          แจกแจงสัดส่วนการถือหุ้นและความเป็นเจ้าของโครงการตามมูลค่าของทรัพยากรทั้ง 5 ด้าน
        </p>
      </div>

      {/* Donut Chart Card */}
      <div className={cardCls}>
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="24"
                className="text-gray-100 dark:text-[#23262d]"
              />
              {totalValuation > 0 && capTableData.map((item) => {
                if (item.value <= 0) return null;
                const pct = item.value / totalValuation;
                const sliceLen = pct * circumference;
                const dash = Math.max(0, sliceLen - 4);
                const angle = accumulatedPct * 360;
                accumulatedPct += pct;

                return (
                  <circle
                    key={item.id}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="24"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset="0"
                    style={{
                      transformOrigin: '80px 80px',
                      transform: `rotate(${angle}deg)`,
                      transition: 'stroke-dasharray 0.3s ease, transform 0.3s ease',
                    }}
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] text-gray-400 font-medium">รวม 5 สินทรัพย์</span>
              <span className="text-base font-black text-gray-900 dark:text-white font-mono mt-0.5 tracking-tight">
                {totalValuation > 0 ? '100.0%' : '0.0%'}
              </span>
              <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                {(totalValuation / 1000000).toFixed(2)}M THB
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="divide-y divide-gray-100 dark:divide-[#262930]/70 border-t border-gray-100 dark:border-[#262930]/70 pt-2">
          {capTableData.map((item) => {
            const pct = totalValuation > 0 ? ((item.value / totalValuation) * 100).toFixed(1) : '0.0';
            const nm = splitName(item.name);

            return (
              <div key={item.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 block truncate">
                      {nm.th}
                    </span>
                    {nm.en && (
                      <span className="text-[10px] text-gray-400 block truncate">
                        {nm.en}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-xs font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {item.value.toLocaleString()} THB
                  </span>
                  <span
                    className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold text-gray-800 dark:text-gray-100"
                    style={{ backgroundColor: `${item.color}33` }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
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
          <span>ถัดไป: ปรับเงินสด (Cash Assets)</span>
          <i className="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
