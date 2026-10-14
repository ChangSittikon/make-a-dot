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

/* Short tile labels (fit 2 lines inside a 3-column tile without truncation) */
const TILE_LABELS: Record<string, string> = {
  ind_01: 'ก่อสร้างและ อสังหาฯ',
  ind_02: 'การแพทย์และ สาธารณสุข',
  ind_03: 'เทคโนโลยี และไอที',
  ind_04: 'การศึกษา',
  ind_05: 'อาหารและ เครื่องดื่ม',
  ind_06: 'เกษตรกรรม',
  ind_07: 'ขนส่งและ โลจิสติกส์',
  ind_08: 'การเงินและ บัญชี',
  ind_09: 'ท่องเที่ยว และโรงแรม',
  ind_10: 'โรงงานและ การผลิต',
  ind_11: 'สื่อและ ความบันเทิง',
  ind_12: 'กฎหมาย',
};

const industryImg = (id: string) => `/images/industries/${id}.jpg`;

/* Section label (Attachment 3/4 style) */
const SectionLabel: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
    <i className={`${icon} text-brand-red text-[11px]`}></i>
    <span>{text}</span>
  </div>
);

/* Selected item collapsed into a dark pill with red check + pencil (Attachment 4 style) */
const SelectedPill: React.FC<{ label: string; imgSrc?: string; onEdit: () => void }> = ({ label, imgSrc, onEdit }) => (
  <button
    onClick={onEdit}
    className="w-full pl-3 pr-4 py-2.5 min-h-[52px] rounded-2xl bg-gray-900 dark:bg-[#1f232b] text-white flex items-center justify-between gap-2 shadow-sm hover:bg-black transition-all"
  >
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="w-[18px] h-[18px] rounded-full bg-brand-red flex items-center justify-center text-[9px] shrink-0">
        <i className="fa-solid fa-check"></i>
      </span>
      {imgSrc && (
        <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt="" className="w-7 h-7 object-contain" />
        </span>
      )}
      <span className="text-[13px] font-bold text-left leading-snug">{label}</span>
    </div>
    <i className="fa-solid fa-pen text-[11px] text-gray-400 shrink-0"></i>
  </button>
);

/* 2-column capsule options (Attachment 3 style) */
const CapsuleGrid: React.FC<{ items: { id: string; label: string }[]; onPick: (id: string) => void }> = ({ items, onPick }) => (
  <div className="grid grid-cols-2 gap-2">
    {items.map((it) => (
      <button
        key={it.id}
        onClick={() => onPick(it.id)}
        className="px-3 py-3 min-h-[52px] rounded-2xl bg-gray-100 hover:bg-gray-200/80 dark:bg-[#1a1d24] dark:hover:bg-[#242832] text-[12px] text-gray-700 dark:text-gray-200 text-center leading-snug flex items-center justify-center transition-all active:scale-[0.98]"
      >
        {it.label}
      </button>
    ))}
  </div>
);

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
  const [brokenImgs, setBrokenImgs] = useState<Record<string, boolean>>({});

  const currentIndustry = INDUSTRIES_LIST.find((i) => i.id === selectedIndustryId);
  const currentSubIndustries: SubIndustryItem[] = selectedIndustryId ? ALL_SUB_INDUSTRIES[selectedIndustryId] || [] : [];
  const activeSubIndustry = currentSubIndustries.find((s) => s.id === selectedSubIndustryId);
  const segmentsList = activeSubIndustry?.segments || [];
  const activeSegment = segmentsList.find((s) => s.id === selectedSegmentId);

  const hasL1 = Boolean(currentIndustry);
  const hasL2 = Boolean(activeSubIndustry);
  const hasL3 = Boolean(activeSegment);

  const showL1Grid = !hasL1 || isEditingL1;
  const showL2 = hasL1 && !isEditingL1 && currentSubIndustries.length > 0;
  const showL2Grid = showL2 && (!hasL2 || isEditingL2);
  const showL3 = showL2 && hasL2 && !isEditingL2 && segmentsList.length > 0;
  const showL3Grid = showL3 && (!hasL3 || isEditingL3);
  const isComplete = showL2 && hasL2 && !isEditingL2 && (segmentsList.length === 0 || (hasL3 && !isEditingL3));

  const pickIndustry = (id: string) => {
    onSelectIndustry(id);
    setIsEditingL1(false);
    setIsEditingL2(false);
    setIsEditingL3(false);
  };
  const pickSub = (id: string) => {
    onSelectSubIndustry(id);
    setIsEditingL2(false);
    setIsEditingL3(false);
  };
  const pickSeg = (id: string) => {
    onSelectSegment(id);
    setIsEditingL3(false);
  };

  return (
    <div className="p-3 sm:p-4 space-y-5 font-prompt">
      {/* ================= LAYER 1: 12 สายงานอุตสาหกรรม ================= */}
      <div className="space-y-2.5">
        <SectionLabel icon="fa-solid fa-layer-group" text="สายงานอุตสาหกรรม" />

        {showL1Grid ? (
          <div className="grid grid-cols-3 gap-2">
            {INDUSTRIES_LIST.map((ind) => {
              const isSelected = selectedIndustryId === ind.id;
              const imgOk = !brokenImgs[ind.id];
              return (
                <button
                  key={ind.id}
                  onClick={() => pickIndustry(ind.id)}
                  className={`relative flex flex-col justify-between rounded-2xl p-2 pb-1.5 h-[112px] text-left overflow-hidden transition-all active:scale-[0.97] ${
                    isSelected
                      ? 'bg-red-50 ring-2 ring-brand-red dark:bg-red-950/30'
                      : 'bg-[#eceef2] hover:bg-[#e3e6eb] dark:bg-[#1c1f26] dark:hover:bg-[#232731]'
                  }`}
                >
                  <span className="text-[11.5px] font-semibold leading-[1.3] text-gray-800 dark:text-gray-100 break-words">
                    {TILE_LABELS[ind.id] || ind.name}
                  </span>

                  <div className="flex items-end justify-center h-[58px]">
                    {imgOk ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={industryImg(ind.id)}
                        alt={ind.name}
                        loading="lazy"
                        onError={() => setBrokenImgs((p) => ({ ...p, [ind.id]: true }))}
                        className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal dark:rounded-lg drop-shadow-sm"
                      />
                    ) : (
                      <i className={`${ind.icon} text-2xl text-gray-500`}></i>
                    )}
                  </div>

                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-red text-white flex items-center justify-center text-[8px]">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          currentIndustry && (
            <SelectedPill
              label={currentIndustry.name}
              imgSrc={brokenImgs[currentIndustry.id] ? undefined : industryImg(currentIndustry.id)}
              onEdit={() => setIsEditingL1(true)}
            />
          )
        )}
      </div>

      {/* ================= LAYER 2: หมวดหลัก ================= */}
      {showL2 && (
        <div className="space-y-2.5 animate-fadeIn">
          <SectionLabel icon="fa-solid fa-folder-tree" text="หมวดหลักในสายงาน" />
          {showL2Grid ? (
            <CapsuleGrid
              items={currentSubIndustries.map((s) => ({ id: s.id, label: s.name }))}
              onPick={pickSub}
            />
          ) : (
            activeSubIndustry && <SelectedPill label={activeSubIndustry.name} onEdit={() => setIsEditingL2(true)} />
          )}
        </div>
      )}

      {/* ================= LAYER 3: รูปแบบโครงการ ================= */}
      {showL3 && (
        <div className="space-y-2.5 animate-fadeIn">
          <SectionLabel icon="fa-solid fa-bullseye" text="เจาะจงรูปแบบโครงการ" />
          {showL3Grid ? (
            <CapsuleGrid items={segmentsList.map((s) => ({ id: s.id, label: s.name }))} onPick={pickSeg} />
          ) : (
            activeSegment && <SelectedPill label={activeSegment.name} onEdit={() => setIsEditingL3(true)} />
          )}
        </div>
      )}

      {/* ================= SUMMARY & NEXT ================= */}
      {isComplete && (
        <div className="pt-1 space-y-3 animate-fadeIn">
          {activeSubIndustry?.description && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed px-1">
              {activeSubIndustry.description}
            </p>
          )}
          <button
            onClick={onNextStep}
            className="w-full py-3.5 bg-brand-red hover:brightness-110 text-white rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>ถัดไป: คำนวณมูลค่าระดมทุน</span>
            <i className="fa-solid fa-arrow-right text-[11px]"></i>
          </button>
        </div>
      )}
    </div>
  );
};
