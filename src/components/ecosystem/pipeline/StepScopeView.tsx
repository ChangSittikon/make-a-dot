'use client';

import React, { useState } from 'react';
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

const INDUSTRY_THEMES: Record<string, { bg: string; text: string }> = {
  ind_01: { bg: 'bg-amber-100/80 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400' },
  ind_02: { bg: 'bg-rose-100/80 dark:bg-rose-950/60', text: 'text-rose-600 dark:text-rose-400' },
  ind_03: { bg: 'bg-blue-100/80 dark:bg-blue-950/60', text: 'text-blue-600 dark:text-sky-400' },
  ind_04: { bg: 'bg-indigo-100/80 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400' },
  ind_05: { bg: 'bg-orange-100/80 dark:bg-orange-950/60', text: 'text-orange-600 dark:text-orange-400' },
  ind_06: { bg: 'bg-emerald-100/80 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400' },
  ind_07: { bg: 'bg-cyan-100/80 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-400' },
  ind_08: { bg: 'bg-yellow-100/80 dark:bg-yellow-950/60', text: 'text-yellow-600 dark:text-yellow-400' },
  ind_09: { bg: 'bg-sky-100/80 dark:bg-sky-950/60', text: 'text-sky-600 dark:text-sky-400' },
  ind_10: { bg: 'bg-slate-200/80 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
  ind_11: { bg: 'bg-purple-100/80 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400' },
  ind_12: { bg: 'bg-blue-200/70 dark:bg-blue-950/60', text: 'text-blue-800 dark:text-blue-300' },
};

export const StepScopeView: React.FC<StepScopeViewProps> = ({
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  onSelectIndustry,
  onSelectSubIndustry,
  onSelectSegment,
  onNextStep,
}) => {
  const [isEditingL1, setIsEditingL1] = useState(false);
  const [isEditingL2, setIsEditingL2] = useState(false);
  const [isEditingL3, setIsEditingL3] = useState(false);

  const currentIndustry = INDUSTRIES_LIST.find((i) => i.id === selectedIndustryId);
  const currentSubIndustries: SubIndustryItem[] = selectedIndustryId ? ALL_SUB_INDUSTRIES[selectedIndustryId] || [] : [];
  const activeSubIndustry = currentSubIndustries.find((s) => s.id === selectedSubIndustryId);
  const segmentsList = activeSubIndustry?.segments || [];
  const activeSegment = segmentsList.find((s) => s.id === selectedSegmentId);

  const hasSelectedL1 = Boolean(selectedIndustryId && currentIndustry);
  const showL1Grid = !hasSelectedL1 || isEditingL1;

  const hasSelectedL2 = Boolean(selectedSubIndustryId && activeSubIndustry);
  const showL2Section = hasSelectedL1 && !isEditingL1;
  const showL2Grid = showL2Section && (!hasSelectedL2 || isEditingL2);

  const hasSelectedL3 = Boolean(selectedSegmentId && activeSegment);
  const showL3Section = showL2Section && hasSelectedL2 && !isEditingL2 && segmentsList.length > 0;
  const showL3Grid = showL3Section && (!hasSelectedL3 || isEditingL3);

  const isScopeComplete = hasSelectedL1 && !isEditingL1 && hasSelectedL2 && !isEditingL2 && (segmentsList.length === 0 || (hasSelectedL3 && !isEditingL3));

  const chipCls = 'w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0';

  const handlePickIndustry = (indId: string) => {
    onSelectIndustry(indId);
    setIsEditingL1(false);
    setIsEditingL2(false);
    setIsEditingL3(false);
  };

  const handlePickSubIndustry = (subId: string) => {
    onSelectSubIndustry(subId);
    setIsEditingL2(false);
    setIsEditingL3(false);
  };

  const handlePickSegment = (segId: string) => {
    onSelectSegment(segId);
    setIsEditingL3(false);
  };

  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* ================= LAYER 1: 12 สายงานอุตสาหกรรม ================= */}
      <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`${chipCls} bg-gray-900 dark:bg-gray-100 dark:text-gray-900`}>1</span>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              สายงานอุตสาหกรรม (Industry Sector)
            </h3>
          </div>
          {showL1Grid && (
            <span className="text-[10px] text-gray-400 font-medium">
              เลือก 1 ใน 12 สายงาน
            </span>
          )}
        </div>

        {/* When L1 is NOT confirmed / editing -> Show 12 cards grid */}
        {showL1Grid ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {INDUSTRIES_LIST.map((ind) => {
              const isSelected = selectedIndustryId === ind.id;
              const theme = INDUSTRY_THEMES[ind.id] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700' };

              return (
                <button
                  key={ind.id}
                  onClick={() => handlePickIndustry(ind.id)}
                  className={`group relative flex flex-col justify-between p-2.5 rounded-2xl border transition-all text-left min-h-[92px] ${
                    isSelected
                      ? 'border-brand-red bg-red-50/60 dark:bg-red-950/20 shadow-xs ring-1 ring-brand-red'
                      : 'border-gray-100 dark:border-gray-800/80 bg-gray-50/70 dark:bg-[#15171d] hover:bg-gray-100/90 dark:hover:bg-[#1e2129]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[9px] font-mono font-bold text-gray-400 block leading-none mb-1">
                      {ind.code}
                    </span>
                    <span
                      className={`text-[11px] font-bold leading-tight line-clamp-2 ${
                        isSelected ? 'text-brand-red' : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {ind.name}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-red text-white flex items-center justify-center text-[9px] shadow-xs">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}

                  <div className="flex justify-end mt-2">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-transform group-hover:scale-105 ${theme.bg} ${theme.text}`}
                    >
                      <i className={ind.icon}></i>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* When L1 selected -> other options disappear, show collapsed pill with checkmark & edit */
          <button
            onClick={() => setIsEditingL1(true)}
            className="w-full p-3 rounded-2xl bg-gray-900 text-white dark:bg-[#1f232b] flex items-center justify-between shadow-xs transition-all hover:bg-gray-800 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] shrink-0">
                <i className="fa-solid fa-check"></i>
              </span>
              <div className="text-left min-w-0">
                <span className="text-[9px] text-gray-400 font-mono block leading-none">
                  {currentIndustry?.code}
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {currentIndustry?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white text-xs shrink-0 pl-2">
              <span className="text-[10px]">เปลี่ยน</span>
              <i className="fa-solid fa-pen text-[10px]"></i>
            </div>
          </button>
        )}
      </div>

      {/* ================= LAYER 2: หมวดหลักในสายงาน ================= */}
      {showL2Section && currentSubIndustries.length > 0 && (
        <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`${chipCls} bg-blue-600`}>2</span>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                หมวดหลักในสายงาน (Main Sub-Category)
              </h3>
            </div>
            {showL2Grid && (
              <span className="text-[10px] text-gray-400 font-medium">
                {currentSubIndustries.length} หมวดหลัก
              </span>
            )}
          </div>

          {/* When L2 is NOT confirmed / editing -> Show 2-col capsule buttons */}
          {showL2Grid ? (
            <div className="grid grid-cols-2 gap-2">
              {currentSubIndustries.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handlePickSubIndustry(sub.id)}
                  className="p-3 rounded-2xl text-xs transition-all flex items-center justify-between text-left min-h-[52px] bg-gray-100/90 hover:bg-gray-200/80 dark:bg-[#15171d] dark:hover:bg-[#20232a] text-gray-800 dark:text-gray-200"
                >
                  <span className="leading-snug truncate">
                    {sub.code} {sub.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* When L2 selected -> other options disappear, show collapsed pill */
            <button
              onClick={() => setIsEditingL2(true)}
              className="w-full p-3 rounded-2xl bg-gray-900 text-white dark:bg-[#1f232b] flex items-center justify-between shadow-xs transition-all hover:bg-gray-800 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] shrink-0">
                  <i className="fa-solid fa-check"></i>
                </span>
                <div className="text-left min-w-0">
                  <span className="text-[9px] text-gray-400 font-mono block leading-none">
                    {activeSubIndustry?.code}
                  </span>
                  <span className="text-xs font-bold text-white truncate block">
                    {activeSubIndustry?.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white text-xs shrink-0 pl-2">
                <span className="text-[10px]">เปลี่ยน</span>
                <i className="fa-solid fa-pen text-[10px]"></i>
              </div>
            </button>
          )}
        </div>
      )}

      {/* ================= LAYER 3: เจาะจงรูปแบบโครงการ ================= */}
      {showL3Section && (
        <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`${chipCls} bg-purple-600`}>3</span>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                เจาะจงรูปแบบโครงการ (Project Segment)
              </h3>
            </div>
            {showL3Grid && (
              <span className="text-[10px] text-gray-400 font-medium">
                {segmentsList.length} รูปแบบ
              </span>
            )}
          </div>

          {/* When L3 is NOT confirmed / editing -> Show 2-col capsule buttons */}
          {showL3Grid ? (
            <div className="grid grid-cols-2 gap-2">
              {segmentsList.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => handlePickSegment(seg.id)}
                  className="p-3 rounded-2xl text-xs transition-all flex items-center justify-between text-left min-h-[52px] bg-gray-100/90 hover:bg-gray-200/80 dark:bg-[#15171d] dark:hover:bg-[#20232a] text-gray-800 dark:text-gray-200"
                >
                  <span className="leading-snug truncate">
                    {seg.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* When L3 selected -> other options disappear, show collapsed pill */
            <button
              onClick={() => setIsEditingL3(true)}
              className="w-full p-3 rounded-2xl bg-gray-900 text-white dark:bg-[#1f232b] flex items-center justify-between shadow-xs transition-all hover:bg-gray-800 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] shrink-0">
                  <i className="fa-solid fa-check"></i>
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {activeSegment?.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white text-xs shrink-0 pl-2">
                <span className="text-[10px]">เปลี่ยน</span>
                <i className="fa-solid fa-pen text-[10px]"></i>
              </div>
            </button>
          )}
        </div>
      )}

      {/* ================= SUMMARY CARD & NEXT STEP BUTTON ================= */}
      {isScopeComplete && currentIndustry && (
        <div className="bg-[#fcfcfd] dark:bg-[#16181f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-brand-red flex items-center justify-center text-xs shrink-0">
                <i className={currentIndustry.icon}></i>
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {currentIndustry.code} {currentIndustry.name}
                </h4>
                <p className="text-[10px] text-gray-400 truncate">
                  {activeSubIndustry?.name}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 shrink-0">
              {currentIndustry.activeBounties} Quests
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

          <button
            onClick={onNextStep}
            className="w-full mt-2 py-3 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>ถัดไป: คำนวณมูลค่าระดมทุน (Total Valuation)</span>
            <i className="fa-solid fa-arrow-right text-[11px]"></i>
          </button>
        </div>
      )}
    </div>
  );
};
