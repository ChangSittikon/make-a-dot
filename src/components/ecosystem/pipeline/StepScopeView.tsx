'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INDUSTRIES_LIST } from '../constants';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';
import { SubIndustryItem } from '../types';
import { NongDot } from '@/components/flow/NongDot';

interface StepScopeViewProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  onSelectIndustry: (indId: string) => void;
  onSelectSubIndustry: (subId: string) => void;
  onSelectSegment: (segId: string) => void;
  onNextStep: () => void;
  nextButtonLabel?: string;
  step1PromptLine1?: string;
  step1PromptLine2?: string;
  step1PromptLine2Align?: 'left' | 'center';
  step1PromptLine2Size?: 'normal' | 'large';
  cityStoryMode?: boolean;
}

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

/* Signature Make A Dot Typewriter Header with Breathing Dot */
export const TypewriterPrompt: React.FC<{
  line1: string;
  line2?: string;
  line2Align?: 'left' | 'center';
  line2Size?: 'normal' | 'large';
}> = ({
  line1,
  line2,
  line2Align = 'left',
  line2Size = 'normal',
}) => {
  const isLine2Center = line2Align === 'center';
  const isLine2Large = line2Size === 'large';
  const [disp1, setDisp1] = useState('');
  const [disp2, setDisp2] = useState('');
  const [typing1, setTyping1] = useState(true);
  const [typing2, setTyping2] = useState(false);

  useEffect(() => {
    setDisp1('');
    setDisp2('');
    setTyping1(true);
    setTyping2(false);

    let i = 0;
    const t1 = setInterval(() => {
      if (i < line1.length) {
        setDisp1(line1.slice(0, i + 1));
        i++;
      } else {
        clearInterval(t1);
        setTyping1(false);
        if (line2) {
          setTyping2(true);
          let j = 0;
          const t2 = setInterval(() => {
            if (j < line2.length) {
              setDisp2(line2.slice(0, j + 1));
              j++;
            } else {
              clearInterval(t2);
              setTyping2(false);
            }
          }, 38);
        }
      }
    }, 50);

    return () => clearInterval(t1);
  }, [line1, line2]);

  return (
    <div className="space-y-1 mb-3 pt-2 relative">
      {/* Signature Breathing Red Dot with Cute Ground Wobble & Fresh Leap - Original Left Position */}
      <div className="h-14 flex items-end pb-1 mb-2 relative z-10">
        <motion.div
          layoutId="nong-dot"
          transition={{
            layout: {
              type: "spring",
              stiffness: 60,
              damping: 11,
              mass: 1.2
            }
          }}
          className="inline-flex items-center justify-center"
        >
          <NongDot mood="greeting" size={15} />
        </motion.div>
      </div>

      <div className="relative z-10 space-y-1">
        {/* Line 1 Heading: Original size & left-aligned */}
        <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight leading-snug">
          {disp1}
          {typing1 && (
            <span className="inline-block w-1.5 h-4 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
          )}
        </h2>

        {Boolean(line2) && (disp2 || typing2 || !typing1) && (
          <p
            className={`font-medium leading-relaxed text-gray-600 dark:text-gray-400 ${
              isLine2Large ? 'text-[14.5px] sm:text-[16px]' : 'text-xs sm:text-[13px]'
            } ${isLine2Center ? 'text-center mx-auto max-w-2xl pt-1' : 'text-left'}`}
          >
            {disp2}
            {typing2 && (
              <span className="inline-block w-1.5 h-3.5 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
            )}
          </p>
        )}
      </div>
    </div>
  );
};

/* Signature City Tab Two-Stage Fade Story */
export const CityFadeStoryPrompt: React.FC<{
  line1: string;
}> = ({ line1 }) => {
  const [stage, setStage] = useState<1 | 2>(1);
  const [disp1, setDisp1] = useState('');
  const [typing1, setTyping1] = useState(true);

  // Stage 1 typewriter text states
  const [extreme1, setExtreme1] = useState('');
  const [extreme2, setExtreme2] = useState('');

  // Stage 2 manifesto typewriter
  const manifesto = 'การขับเคลื่อนที่เปลี่ยนโครงสร้างคุณภาพชีวิตได้จริงมักเริ่มจาก "ความร่วมมือของผู้คน"  ซึ่งไม่ต้องรอแก้กฎหมายใหญ่ แต่ใช้สิทธิ์ทางแพ่ง กฎหมายสหกรณ์ หรือข้อตกลงร่วมของชุมชนสร้างระบบเศรษฐกิจใหม่ขึ้นมาเอง';
  const [dispManifesto, setDispManifesto] = useState('');
  const [typingManifesto, setTypingManifesto] = useState(false);

  // Type line 1 (Anchor title)
  useEffect(() => {
    setDisp1('');
    setTyping1(true);
    let i = 0;
    const t = setInterval(() => {
      if (i < line1.length) {
        setDisp1(line1.slice(0, i + 1));
        i++;
      } else {
        clearInterval(t);
        setTyping1(false);
      }
    }, 45);
    return () => clearInterval(t);
  }, [line1]);

  // Stage 1 typing & auto-advance timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === 1) {
      setExtreme1('');
      setExtreme2('');
      const text1 = '"ทุนนิยมสุดโต่ง" (เน้นกำไรจนลืมคน)';
      const text2 = '"สังคมนิยมสุดโต่ง" (คุมทุกอย่างจนขาดนวัตกรรม)';

      let idx1 = 0;
      let idx2 = 0;
      const t1 = setInterval(() => {
        if (idx1 < text1.length) {
          setExtreme1(text1.slice(0, idx1 + 1));
          idx1++;
        } else {
          clearInterval(t1);
          const t2 = setInterval(() => {
            if (idx2 < text2.length) {
              setExtreme2(text2.slice(0, idx2 + 1));
              idx2++;
            } else {
              clearInterval(t2);
              // Auto fade to stage 2 after 3.2 seconds
              timer = setTimeout(() => {
                setStage(2);
              }, 3200);
            }
          }, 30);
        }
      }, 30);

      return () => {
        clearInterval(t1);
        if (timer) clearTimeout(timer);
      };
    } else {
      // Stage 2 typing
      setDispManifesto('');
      setTypingManifesto(true);
      let m = 0;
      const tm = setInterval(() => {
        if (m < manifesto.length) {
          setDispManifesto(manifesto.slice(0, m + 1));
          m++;
        } else {
          clearInterval(tm);
          setTypingManifesto(false);
        }
      }, 35);
      return () => clearInterval(tm);
    }
  }, [stage]);

  return (
    <div className="space-y-1 mb-3 pt-2 relative">
      {/* Signature Breathing Red Dot with Cute Ground Wobble & Fresh Leap - Original Left Position */}
      <div className="h-14 flex items-end pb-1 mb-2 relative z-10">
        <motion.div
          layoutId="nong-dot"
          transition={{
            layout: {
              type: "spring",
              stiffness: 60,
              damping: 11,
              mass: 1.2,
            },
          }}
          className="inline-flex items-center justify-center"
        >
          <NongDot mood="greeting" size={15} />
        </motion.div>
      </div>

      <div className="relative z-10 space-y-2">
        {/* Line 1 Heading: Original size & left-aligned */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight leading-snug">
            {disp1}
            {typing1 && (
              <span className="inline-block w-1.5 h-4 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
            )}
          </h2>

          {/* Minimal Stage Controls */}
          <div className="flex items-center gap-1 shrink-0 bg-gray-100/90 dark:bg-gray-800/90 p-0.5 rounded-full border border-gray-200/60 dark:border-gray-700/60 text-[9.5px]">
            <button
              type="button"
              onClick={() => setStage(1)}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                stage === 1
                  ? 'bg-white dark:bg-gray-900 text-brand-red shadow-2xs'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="1. สองขั้วสุดโต่ง"
            >
              1. สองขั้ว
            </button>
            <button
              type="button"
              onClick={() => setStage(2)}
              className={`px-2 py-0.5 rounded-full font-bold transition-all ${
                stage === 2
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="2. ทำเมืองผสม"
            >
              2. ทำเมืองผสม
            </button>
          </div>
        </div>

        {/* Dynamic Multi-Stage Narrative Card with Smooth Fade */}
        <div className="relative min-h-[96px] rounded-2xl bg-gradient-to-br from-gray-50/95 via-white to-gray-50/60 dark:from-[#181a20] dark:via-[#16181e] dark:to-[#1a1c24] border border-gray-200/80 dark:border-gray-800 p-3 sm:p-3.5 shadow-2xs overflow-hidden flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {stage === 1 ? (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium pb-0.5 border-b border-gray-150/60 dark:border-gray-800/80">
                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                    <i className="fa-solid fa-scale-unbalanced text-[9.5px]"></i>
                    <span>ทางแยกของสองขั้วสุดโต่ง</span>
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">1/2 • กำลังนำสู่ทางออก...</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Extreme 1 */}
                  <div className="p-2.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                      ✕
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-red-700 dark:text-red-300 text-xs sm:text-[12.5px]">
                        {extreme1 || '...'}
                        {extreme1 && !extreme2 && (
                          <span className="inline-block w-1 h-3 bg-red-500 ml-0.5 animate-[blink_1s_infinite] align-middle" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Extreme 2 */}
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                      ✕
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-[12.5px]">
                        {extreme2 || (extreme1 ? '...' : '')}
                        {extreme2 && (
                          <span className="inline-block w-1 h-3 bg-slate-500 ml-0.5 animate-[blink_1s_infinite] align-middle" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45 }}
                className="space-y-2 text-center"
              >
                {/* Badges for ทำเมืองผสม and เขตทดลองนวัตกรรมทางสังคมและเศรษฐกิจผสม */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-extrabold shadow-2xs">
                    <span>🏙️</span>
                    <span>&ldquo;ทำเมืองผสม&rdquo;</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/40 dark:to-amber-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-900/40 text-[10.5px] font-bold shadow-2xs">
                    <span>⚡</span>
                    <span>&ldquo;เขตทดลองนวัตกรรมทางสังคมและเศรษฐกิจผสม&rdquo;</span>
                  </span>
                </div>

                {/* Manifesto Text */}
                <p className="text-[14px] sm:text-[15.5px] text-gray-700 dark:text-gray-200 font-medium leading-relaxed max-w-2xl mx-auto pt-0.5">
                  &ldquo;{dispManifesto}&rdquo;
                  {typingManifesto && (
                    <span className="inline-block w-1.5 h-3.5 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* Milestone Card during intermediate step completion */
const StepMilestone: React.FC<{
  title: string;
  onEdit: () => void;
}> = ({ title, onEdit }) => (
  <div
    onClick={onEdit}
    className="bg-white dark:bg-[#181a20] rounded-2xl border border-gray-200/80 dark:border-gray-800 p-2.5 sm:p-3 shadow-2xs flex items-center justify-between gap-3 transition-all cursor-pointer hover:border-brand-red"
  >
    <div className="flex items-center gap-2.5 min-w-0 flex-1">
      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 shadow-2xs">
        <i className="fa-solid fa-check"></i>
      </span>
      <span className="text-xs sm:text-[13px] font-bold text-gray-900 dark:text-white leading-normal break-words">
        {title}
      </span>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
      title="แก้ไข"
      className="w-7 h-7 rounded-xl text-gray-400 hover:text-brand-red bg-gray-50 hover:bg-red-50 dark:bg-gray-800/80 dark:hover:bg-red-950/40 shrink-0 transition-all flex items-center justify-center border border-gray-150 dark:border-gray-700/60 shadow-2xs"
    >
      <i className="fa-solid fa-pen text-[9px]"></i>
    </button>
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
  nextButtonLabel,
  step1PromptLine1,
  step1PromptLine2,
  step1PromptLine2Align = 'left',
  step1PromptLine2Size = 'normal',
  cityStoryMode = false,
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

  const isComplete = hasL1 && !isEditingL1 && hasL2 && !isEditingL2 && (segmentsList.length === 0 || (hasL3 && !isEditingL3));

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
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* ================= HERO BLUEPRINT WHEN COMPLETED ================= */}
      {isComplete && currentIndustry && activeSubIndustry ? (
        <div className="space-y-3 animate-fadeIn">
          {/* Header Status */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-red-50 dark:bg-red-950/60 text-brand-red flex items-center justify-center text-[10px]">
                <i className="fa-solid fa-check"></i>
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
                พิมพ์เขียวโครงการพร้อมทำทุน
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold">
              ขั้นตอน 3/3 สำเร็จ
            </span>
          </div>

          <div className="bg-gradient-to-br from-white via-white to-amber-50/50 dark:from-[#181a20] dark:via-[#181a20] dark:to-[#221c17] rounded-3xl border border-amber-100/90 dark:border-amber-950/50 p-4 shadow-sm relative overflow-hidden space-y-4">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>พิมพ์เขียวโครงการ (Project Blueprint)</span>
              </span>
              <button
                onClick={() => setIsEditingL1(true)}
                className="text-[11px] font-bold text-gray-500 hover:text-brand-red flex items-center gap-1 transition-colors"
              >
                <i className="fa-solid fa-pen text-[9px]"></i>
                <span>แก้ไขสเปก</span>
              </button>
            </div>

            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-[72px] h-[72px] rounded-2xl bg-white dark:bg-[#121418] border border-gray-100 dark:border-gray-800/80 p-1 flex items-center justify-center shrink-0 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={industryImg(currentIndustry.id)}
                  alt=""
                  className="w-full h-full object-contain drop-shadow-sm"
                  onError={() => setBrokenImgs((p) => ({ ...p, [currentIndustry.id]: true }))}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium truncate mb-0.5">
                  <span>{currentIndustry.name}</span>
                  <i className="fa-solid fa-chevron-right text-[8px] text-gray-300"></i>
                  <span className="text-gray-600 dark:text-gray-300">{activeSubIndustry.name}</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white leading-tight truncate">
                  {activeSegment ? activeSegment.name : activeSubIndustry.name}
                </h3>
                {activeSubIndustry.description && (
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {activeSubIndustry.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-800/80 text-[10px]">
              <button
                onClick={() => setIsEditingL1(true)}
                className="p-1.5 rounded-xl bg-gray-50 dark:bg-[#14161b] hover:bg-gray-100 text-left transition-colors truncate"
              >
                <span className="text-gray-400 block text-[8.5px] leading-none mb-0.5">1. สายงาน</span>
                <span className="font-bold text-gray-700 dark:text-gray-300 truncate block">{currentIndustry.name}</span>
              </button>
              <button
                onClick={() => setIsEditingL2(true)}
                className="p-1.5 rounded-xl bg-gray-50 dark:bg-[#14161b] hover:bg-gray-100 text-left transition-colors truncate"
              >
                <span className="text-gray-400 block text-[8.5px] leading-none mb-0.5">2. หมวดหลัก</span>
                <span className="font-bold text-gray-700 dark:text-gray-300 truncate block">{activeSubIndustry.name}</span>
              </button>
              <button
                onClick={() => setIsEditingL3(true)}
                className="p-1.5 rounded-xl bg-gray-50 dark:bg-[#14161b] hover:bg-gray-100 text-left transition-colors truncate"
              >
                <span className="text-gray-400 block text-[8.5px] leading-none mb-0.5">3. รูปแบบ</span>
                <span className="font-bold text-gray-700 dark:text-gray-300 truncate block">
                  {activeSegment ? activeSegment.name : 'มาตรฐาน'}
                </span>
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-[10.5px] text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-[9px] shrink-0">
                  <i className="fa-solid fa-coins"></i>
                </span>
                <span>เกณฑ์มาตรฐานสินทรัพย์ 5 หมวด (เงินสด/แรงงาน/เครื่องมือ/สถานที่/IP)</span>
              </div>
              <div className="flex items-center gap-2 text-[10.5px] text-gray-600 dark:text-gray-300">
                <span className="w-4 h-4 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center text-[9px] shrink-0">
                  <i className="fa-solid fa-shield-halved"></i>
                </span>
                <span>รองรับระบบค้ำประกัน & Escrow งวดงาน พร้อมเชื่อมต่อ {currentIndustry.activeBounties} เควสต์</span>
              </div>
            </div>
          </div>

          <button
            onClick={onNextStep}
            className="w-full py-3.5 bg-gradient-to-r from-brand-red via-red-600 to-rose-600 hover:brightness-110 text-white rounded-2xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/25 active:scale-[0.99]"
          >
            <span>{nextButtonLabel || "ถัดไป: คำนวณมูลค่าระดมทุน (Total Valuation)"}</span>
            <i className="fa-solid fa-arrow-right text-[11px]"></i>
          </button>
        </div>
      ) : (
        /* ================= PROGRESSIVE SELECTION WITH SIGNATURE PROMPT ================= */
        <div className="space-y-3">
          {/* STEP 1: สายงานอุตสาหกรรม */}
          <div className="space-y-2">
            {showL1Grid ? (
              <div className="space-y-2.5">
                {/* Signature Make A Dot Typewriter Header */}
                {cityStoryMode ? (
                  <CityFadeStoryPrompt
                    line1={step1PromptLine1 || "เมื่อรัฐเคลื่อนตัวช้า และกฎหมายติดหล่ม"}
                  />
                ) : (
                  <TypewriterPrompt
                    line1={step1PromptLine1 || "ให้เรารู้จักคุณหน่อย"}
                    line2={step1PromptLine2 !== undefined ? step1PromptLine2 : "โปรดเลือกวงการที่คุณจะทำ"}
                    line2Align={step1PromptLine2Align}
                    line2Size={step1PromptLine2Size}
                  />
                )}

                <div className="grid grid-cols-3 gap-2">
                  {INDUSTRIES_LIST.map((ind) => {
                    const isSelected = selectedIndustryId === ind.id;
                    const imgOk = !brokenImgs[ind.id];
                    return (
                      <button
                        key={ind.id}
                        onClick={() => pickIndustry(ind.id)}
                        className={`group relative flex flex-col justify-between rounded-2xl p-2 pb-1.5 h-[116px] text-left overflow-hidden transition-all active:scale-[0.97] border ${
                          isSelected
                            ? 'bg-red-50/70 border-brand-red ring-2 ring-brand-red/30 dark:bg-red-950/30'
                            : 'bg-white hover:bg-gray-50/80 dark:bg-[#181a20] dark:hover:bg-[#1f2229] border-gray-150 dark:border-gray-800 shadow-2xs hover:shadow-xs hover:border-gray-300'
                        }`}
                      >
                        <span className="text-[11.5px] font-bold leading-[1.3] text-gray-800 dark:text-gray-100 break-words group-hover:text-brand-red transition-colors">
                          {TILE_LABELS[ind.id] || ind.name}
                        </span>

                        <div className="flex items-end justify-center h-[62px]">
                          {imgOk ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={industryImg(ind.id)}
                              alt={ind.name}
                              loading="lazy"
                              onError={() => setBrokenImgs((p) => ({ ...p, [ind.id]: true }))}
                              className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <i className={`${ind.icon} text-2xl text-gray-400 group-hover:text-brand-red`}></i>
                          )}
                        </div>

                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-red text-white flex items-center justify-center text-[8px] shadow-2xs">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              currentIndustry && (
                <StepMilestone
                  title={currentIndustry.name}
                  onEdit={() => setIsEditingL1(true)}
                />
              )
            )}
          </div>

          {/* STEP 2: หมวดหลักในสายงาน */}
          {showL2 && (
            <div className="space-y-2 animate-fadeIn">
              {showL2Grid ? (
                <div className="space-y-2.5">
                  <TypewriterPrompt
                    line1="เจาะลึกลงไป"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {currentSubIndustries.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => pickSub(sub.id)}
                        className="group p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#181a20] border border-gray-150 dark:border-gray-800 hover:border-brand-red hover:shadow-xs min-h-[54px] text-left transition-all active:scale-[0.98] flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-red leading-snug break-words flex-1">
                          {sub.name}
                        </span>
                        <i className="fa-solid fa-arrow-right text-[8px] text-gray-300 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all shrink-0"></i>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                activeSubIndustry && (
                  <StepMilestone
                    title={activeSubIndustry.name}
                    onEdit={() => setIsEditingL2(true)}
                  />
                )
              )}
            </div>
          )}

          {/* STEP 3: รูปแบบโครงการ */}
          {showL3 && (
            <div className="space-y-2 animate-fadeIn">
              {showL3Grid ? (
                <div className="space-y-2.5">
                  <TypewriterPrompt
                    line1="ขอชัดขึ้นอีกนิด"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {segmentsList.map((seg) => (
                      <button
                        key={seg.id}
                        onClick={() => pickSeg(seg.id)}
                        className="group p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#181a20] border border-gray-150 dark:border-gray-800 hover:border-brand-red hover:shadow-xs min-h-[54px] text-left transition-all active:scale-[0.98] flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-red leading-snug break-words flex-1">
                          {seg.name}
                        </span>
                        <i className="fa-solid fa-circle-dot text-[8px] text-gray-300 group-hover:text-brand-red transition-colors shrink-0"></i>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                activeSegment && (
                  <StepMilestone
                    title={activeSegment.name}
                    onEdit={() => setIsEditingL3(true)}
                  />
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
