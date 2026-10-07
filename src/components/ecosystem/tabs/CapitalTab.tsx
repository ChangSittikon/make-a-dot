'use client';

import React from 'react';
import { CapTableItem } from '../types';
import {
  INDUSTRIES_LIST,
  SUB_INDUSTRIES_MAP,
  INDUSTRY_CAP_PRESETS,
} from '../constants';

interface CapitalTabProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  capTableData: CapTableItem[];
  onSelectIndustry: (indId: string) => void;
  onSelectSubIndustry: (subId: string) => void;
  onSelectSegment: (segId: string) => void;
  onUpdateCapItem: (id: string, val: number) => void;
  onResetPreset: () => void;
}

export const CapitalTab: React.FC<CapitalTabProps> = ({
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  capTableData,
  onSelectIndustry,
  onSelectSubIndustry,
  onSelectSegment,
  onUpdateCapItem,
  onResetPreset,
}) => {
  const currentIndustry = INDUSTRIES_LIST.find(i => i.id === selectedIndustryId) || INDUSTRIES_LIST[0];
  const totalValuation = capTableData.reduce((acc, cur) => acc + cur.value, 0);
  const currentSubIndustries = SUB_INDUSTRIES_MAP[selectedIndustryId] || [];
  const activeSubIndustry = currentSubIndustries.find(s => s.id === selectedSubIndustryId);
  const activeSegment = activeSubIndustry?.segments?.find(s => s.id === selectedSegmentId);
  const currentPreset = activeSegment
    ? activeSegment.preset
    : activeSubIndustry
    ? activeSubIndustry.preset
    : INDUSTRY_CAP_PRESETS[selectedIndustryId] || INDUSTRY_CAP_PRESETS.ind_01;

  const formatCompact = (val: number) => {
    if (val >= 1000000) {
      const m = (val / 1000000).toFixed(2);
      return `${m.replace(/\.00$/, '')}M THB`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}K THB`;
    }
    return `${val.toLocaleString()} THB`;
  };

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPct = 0;

  // Dynamic slider scale: benchmarks differ by orders of magnitude between project types
  const presetValues = Object.values(currentPreset).map((p: any) => p.val as number);
  const niceCeil = (v: number) => {
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    return Math.ceil(v / mag) * mag;
  };
  const sliderMax = niceCeil(Math.max(Math.max(...presetValues) * 2, 1000000));
  const sliderStep = Math.max(10000, Math.pow(10, Math.floor(Math.log10(sliderMax)) - 2));

  const splitName = (n: string) => {
    const m = n.match(/^(.*?)\s*\((.*)\)$/);
    return m ? { th: m[1], en: m[2] } : { th: n, en: '' };
  };

  const hasSub = currentSubIndustries.length > 0;
  const hasSeg = !!(activeSubIndustry && activeSubIndustry.segments && activeSubIndustry.segments.length > 0);
  const fieldCount = 1 + (hasSub ? 1 : 0) + (hasSeg ? 1 : 0);
  const gridColsCls = ['', '@2xl:grid-cols-1', '@2xl:grid-cols-2', '@2xl:grid-cols-3'][fieldCount];

  const cardCls = 'bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] shadow-xs';
  const selectCls = 'w-full h-11 rounded-xl border border-gray-200 dark:border-[#2c313a] bg-white dark:bg-[#12141a] pl-3.5 pr-9 text-[13px] font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 appearance-none cursor-pointer text-ellipsis transition-colors';
  const labelCls = 'flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400';
  const chipCls = 'w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center';

  return (
    <div className="@container flex-1 overflow-y-auto px-4 @2xl:px-6 py-4 space-y-4 scrollable-content pb-24 font-prompt">
      <style jsx>{`
        .cap-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #ffffff;
          border: 3px solid var(--thumb, #3b82f6);
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        }
        .cap-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #ffffff;
          border: 3px solid var(--thumb, #3b82f6);
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
        }
      `}</style>

      {/* 1. Selector + Total Valuation */}
      <section className={`${cardCls} p-4 @2xl:p-5`}>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#102a4e] text-blue-600 dark:text-sky-400 flex items-center justify-center text-sm shrink-0">
            <i className="fa-solid fa-chart-pie"></i>
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">จำลองโครงสร้างทุน</h2>
            <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Cap Table Simulation</p>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-3 ${gridColsCls}`}>
          {/* Level 1 */}
          <label className="block min-w-0">
            <span className={labelCls}>
              <span className={`${chipCls} bg-gray-800 dark:bg-gray-500`}>1</span>
              สายงาน
            </span>
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
          </label>

          {/* Level 2 */}
          {hasSub && (
            <label className="block min-w-0">
              <span className={labelCls}>
                <span className={`${chipCls} bg-blue-600`}>2</span>
                หมวดหลัก
              </span>
              <div className="relative">
                <select
                  value={selectedSubIndustryId}
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
            </label>
          )}

          {/* Level 3 */}
          {hasSeg && activeSubIndustry && activeSubIndustry.segments && (
            <label className="block min-w-0">
              <span className={labelCls}>
                <span className={`${chipCls} bg-purple-600`}>3</span>
                เจาะจงรูปแบบโครงการ
              </span>
              <div className="relative">
                <select
                  value={selectedSegmentId}
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
            </label>
          )}
        </div>

        {/* Total valuation panel */}
        <div className="mt-4 rounded-xl bg-gray-50 dark:bg-[#12141a] border border-gray-100 dark:border-[#262930] p-4">
          <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            มูลค่าระดมทุนรวม (Total Valuation)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl @2xl:text-4xl font-black text-gray-900 dark:text-white font-mono tracking-tight leading-none">
              {totalValuation.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-gray-400">THB</span>
          </div>

          {/* Stacked proportion bar */}
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mt-3.5">
            {totalValuation > 0 && capTableData.map((item) =>
              item.value > 0 ? (
                <span
                  key={item.id}
                  className="h-full transition-all duration-300"
                  style={{ width: `${(item.value / totalValuation) * 100}%`, backgroundColor: item.color }}
                />
              ) : null
            )}
          </div>

          {/* Breadcrumb chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-200/70 dark:bg-[#23262d] text-gray-700 dark:text-gray-300 text-[10px] font-semibold">
              {currentIndustry.code} {currentIndustry.name}
            </span>
            {activeSubIndustry && (
              <>
                <i className="fa-solid fa-chevron-right text-[8px] text-gray-300 dark:text-gray-600"></i>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-[#102a4e] text-blue-700 dark:text-sky-300 border border-blue-200/70 dark:border-[#1e4976]/60 text-[10px] font-semibold">
                  {activeSubIndustry.name}
                </span>
              </>
            )}
            {activeSegment && (
              <>
                <i className="fa-solid fa-chevron-right text-[8px] text-gray-300 dark:text-gray-600"></i>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 dark:bg-[#231a33] text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-500/30 text-[10px] font-semibold">
                  {activeSegment.name}
                </span>
              </>
            )}
          </div>
          {activeSubIndustry && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2.5">
              {activeSubIndustry.description}
            </p>
          )}
        </div>
      </section>

      {/* 2. Donut + Detail Table */}
      <div className="grid grid-cols-1 @2xl:grid-cols-5 gap-4">
        {/* Donut */}
        <section className={`${cardCls} p-4 @2xl:p-5 @2xl:col-span-2 flex flex-col`}>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            สัดส่วนความเป็นเจ้าของ
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Equity Distribution</p>

          <div className="flex-1 flex items-center justify-center py-5">
            <div className="relative w-48 h-48 flex items-center justify-center">
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
                <span className="text-[11px] text-gray-400 font-medium">รวมทั้งหมด</span>
                <span className="text-lg font-black text-gray-900 dark:text-white font-mono mt-0.5 tracking-tight">
                  {formatCompact(totalValuation)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Detail table */}
        <section className={`${cardCls} p-4 @2xl:p-5 @2xl:col-span-3`}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">รายละเอียดสัดส่วน</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Contribution Breakdown</p>
            </div>
            <span className="text-[10px] text-gray-400 text-right">มูลค่า (THB) / สัดส่วน</span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-[#262930]/70 border-t border-gray-100 dark:border-[#262930]/70">
            {capTableData.map((item) => {
              const pct = totalValuation > 0 ? ((item.value / totalValuation) * 100).toFixed(1) : '0.0';
              const itemHint = (currentPreset as any)[item.id]?.hint || '';
              const nm = splitName(item.name);

              return (
                <div key={item.id} className="flex items-start gap-3 py-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{nm.th}</span>
                      {nm.en && <span className="text-[10px] text-gray-400">{nm.en}</span>}
                    </div>
                    {itemHint && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug mt-0.5">
                        {itemHint}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {item.value.toLocaleString()}
                    </span>
                    <span
                      className="inline-block mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-gray-800 dark:text-gray-100"
                      style={{ backgroundColor: `${item.color}33` }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. Sliders */}
      <section className={`${cardCls} p-4 @2xl:p-5`}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">ปรับแต่งมูลค่าทรัพยากร</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">เลื่อนเพื่อปรับเงินทุนสดและทรัพยากรแต่ละประเภท (THB)</p>
          </div>
          <button
            onClick={onResetPreset}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-[#102a4e] dark:hover:bg-[#143560] text-blue-700 dark:text-sky-300 text-[11px] font-semibold transition-colors"
          >
            <i className="fa-solid fa-rotate-left text-[10px]"></i>
            ค่ามาตรฐาน
          </button>
        </div>

        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-x-8 gap-y-5">
          {capTableData.map((item) => {
            const sliderPct = Math.min(100, Math.max(0, (item.value / sliderMax) * 100));
            const itemHint = (currentPreset as any)[item.id]?.hint || '';
            const nm = splitName(item.name);

            return (
              <div key={item.id} className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100">{nm.th}</span>
                      {itemHint && (
                        <span className="block text-[10px] text-gray-400 dark:text-gray-500 leading-snug mt-0.5">
                          {itemHint}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100 shrink-0">
                    {item.value.toLocaleString()}
                    <span className="text-gray-400 font-medium ml-1">THB</span>
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={sliderMax}
                  step={sliderStep}
                  value={item.value}
                  onChange={(e) => onUpdateCapItem(item.id, Number(e.target.value))}
                  className="cap-slider w-full h-1.5 appearance-none cursor-pointer rounded-full outline-none [--track:#e5e7eb] dark:[--track:#2a2e36]"
                  style={{
                    background: `linear-gradient(to right, ${item.color} 0%, ${item.color} ${sliderPct}%, var(--track) ${sliderPct}%, var(--track) 100%)`,
                    ['--thumb' as string]: item.color,
                  }}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
