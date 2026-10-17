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

/* Signature City Tab Mobile-First 3-Shot Kinetic Typography Story */
export const CityFadeStoryPrompt: React.FC<{
  line1: string;
}> = ({ line1 }) => {
  const [disp1, setDisp1] = useState('');
  const [typing1, setTyping1] = useState(true);
  const [line1Done, setLine1Done] = useState(false);

  // 3 Shots: 1 = สองขั้วสุดโต่ง, 2 = ความร่วมมือของผู้คน, 3 = ทำเมืองผสม
  const [shot, setShot] = useState<1 | 2 | 3>(1);

  // Shot 1 state
  const [s1L1, setS1L1] = useState('');
  const [s1L2, setS1L2] = useState('');
  const [typingS1L1, setTypingS1L1] = useState(false);
  const [typingS1L2, setTypingS1L2] = useState(false);

  // Shot 2 state
  const [s2Text, setS2Text] = useState('');
  const [typingS2, setTypingS2] = useState(false);

  // Shot 3 state
  const [s3L1, setS3L1] = useState('');
  const [s3L2, setS3L2] = useState('');
  const [typingS3L1, setTypingS3L1] = useState(false);
  const [typingS3L2, setTypingS3L2] = useState(false);

  // Step 1: Type Anchor Title (line1) first so only ONE cursor is active at a time
  useEffect(() => {
    setDisp1('');
    setTyping1(true);
    setLine1Done(false);
    let i = 0;
    let pauseTimer: ReturnType<typeof setTimeout> | null = null;

    const t = setInterval(() => {
      if (i < line1.length) {
        setDisp1(line1.slice(0, i + 1));
        i++;
      } else {
        clearInterval(t);
        setTyping1(false);
        pauseTimer = setTimeout(() => {
          setLine1Done(true);
        }, 250);
      }
    }, 45);

    return () => {
      clearInterval(t);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [line1]);

  // Step 2: Run 3-Shot Mobile Story Sequence after line1 finishes
  useEffect(() => {
    if (!line1Done) return;

    const intervals: ReturnType<typeof setInterval>[] = [];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const clearAll = () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    };

    if (shot === 1) {
      const textA = '"ทุนนิยมสุดโต่ง" (เน้นกำไรจนลืมคน)';
      const textB = '"สังคมนิยมสุดโต่ง" (คุมทุกอย่างจนขาดนวัตกรรม)';
      setS1L1('');
      setS1L2('');
      setTypingS1L1(true);
      setTypingS1L2(false);

      let a = 0;
      const intA = setInterval(() => {
        if (a < textA.length) {
          setS1L1(textA.slice(0, a + 1));
          a++;
        } else {
          clearInterval(intA);
          setTypingS1L1(false);

          const waitB = setTimeout(() => {
            setTypingS1L2(true);
            let b = 0;
            const intB = setInterval(() => {
              if (b < textB.length) {
                setS1L2(textB.slice(0, b + 1));
                b++;
              } else {
                clearInterval(intB);
                setTypingS1L2(false);

                const nextShot = setTimeout(() => {
                  setShot(2);
                }, 2200);
                timeouts.push(nextShot);
              }
            }, 40);
            intervals.push(intB);
          }, 300);
          timeouts.push(waitB);
        }
      }, 40);
      intervals.push(intA);
    } else if (shot === 2) {
      const manifesto =
        'การขับเคลื่อนที่เปลี่ยนโครงสร้างคุณภาพชีวิตได้จริงมักเริ่มจาก "ความร่วมมือของผู้คน" ซึ่งไม่ต้องรอแก้กฎหมายใหญ่ แต่ใช้สิทธิ์ทางแพ่ง กฎหมายสหกรณ์ หรือข้อตกลงร่วมของชุมชนสร้างระบบเศรษฐกิจใหม่ขึ้นมาเอง';
      setS2Text('');
      setTypingS2(true);

      let m = 0;
      const intM = setInterval(() => {
        if (m < manifesto.length) {
          setS2Text(manifesto.slice(0, m + 1));
          m++;
        } else {
          clearInterval(intM);
          setTypingS2(false);

          const nextShot = setTimeout(() => {
            setShot(3);
          }, 3000);
          timeouts.push(nextShot);
        }
      }, 40);
      intervals.push(intM);
    } else if (shot === 3) {
      const finalA = '"ทำเมืองผสม"';
      const finalB = '"เขตทดลองนวัตกรรมทางสังคมและเศรษฐกิจผสม"';
      setS3L1('');
      setS3L2('');
      setTypingS3L1(true);
      setTypingS3L2(false);

      let c = 0;
      const intC = setInterval(() => {
        if (c < finalA.length) {
          setS3L1(finalA.slice(0, c + 1));
          c++;
        } else {
          clearInterval(intC);
          setTypingS3L1(false);

          const waitD = setTimeout(() => {
            setTypingS3L2(true);
            let d = 0;
            const intD = setInterval(() => {
              if (d < finalB.length) {
                setS3L2(finalB.slice(0, d + 1));
                d++;
              } else {
                clearInterval(intD);
                setTypingS3L2(false);
              }
            }, 40);
            intervals.push(intD);
          }, 280);
          timeouts.push(waitD);
        }
      }, 48);
      intervals.push(intC);
    }

    return clearAll;
  }, [line1Done, shot]);

  return (
    <div className="space-y-1 mb-2.5 pt-2 relative">
      {/* Signature Breathing Red Dot - Original Left Position */}
      <div className="h-14 flex items-end pb-1 mb-2 relative z-10">
        <motion.div
          layoutId="nong-dot"
          transition={{
            layout: {
              type: 'spring',
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
        <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight leading-snug">
          {disp1}
          {typing1 && (
            <span className="inline-block w-1.5 h-4 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
          )}
        </h2>

        {/* Centered Mobile-First Kinetic Typography Stage (No clunky boxes) */}
        {line1Done && (
          <div className="pt-1 pb-0.5 text-center">
            <AnimatePresence mode="wait">
              {shot === 1 && (
                <motion.div
                  key="shot-1"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
                  transition={{ duration: 0.45 }}
                  onClick={() => setShot(2)}
                  className="space-y-1.5 py-1 cursor-pointer select-none"
                >
                  <p className="text-[14.5px] sm:text-[15.5px] font-semibold text-gray-600 dark:text-gray-300 leading-snug">
                    {s1L1}
                    {typingS1L1 && (
                      <span className="inline-block w-1.5 h-3.5 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
                    )}
                  </p>
                  {(s1L2 || typingS1L2) && (
                    <p className="text-[14.5px] sm:text-[15.5px] font-semibold text-gray-600 dark:text-gray-300 leading-snug">
                      {s1L2}
                      {typingS1L2 && (
                        <span className="inline-block w-1.5 h-3.5 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
                      )}
                    </p>
                  )}
                </motion.div>
              )}

              {shot === 2 && (
                <motion.div
                  key="shot-2"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
                  transition={{ duration: 0.45 }}
                  onClick={() => setShot(3)}
                  className="py-1 cursor-pointer select-none"
                >
                  <p className="text-[14.5px] sm:text-[15.5px] font-medium text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
                    {s2Text}
                    {typingS2 && (
                      <span className="inline-block w-1.5 h-3.5 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
                    )}
                  </p>
                </motion.div>
              )}

              {shot === 3 && (
                <motion.div
                  key="shot-3"
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => setShot(1)}
                  className="space-y-1 py-1 cursor-pointer select-none"
                >
                  <p className="text-[16px] sm:text-[17px] font-black text-brand-red tracking-tight leading-snug">
                    {s3L1}
                    {typingS3L1 && (
                      <span className="inline-block w-1.5 h-4 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
                    )}
                  </p>
                  {(s3L2 || typingS3L2) && (
                    <p className="text-[14px] sm:text-[15px] font-bold text-gray-700 dark:text-gray-200 leading-snug">
                      {s3L2}
                      {typingS3L2 && (
                        <span className="inline-block w-1.5 h-3.5 bg-brand-red ml-1 animate-[blink_1s_infinite] align-middle" />
                      )}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimal Mobile Story Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1.5">
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setShot(n)}
                  aria-label={`จังหวะที่ ${n}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    shot === n
                      ? 'w-4 bg-brand-red'
                      : 'w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
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
