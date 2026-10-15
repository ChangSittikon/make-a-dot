'use client';

import React, { useState } from 'react';
import { PIPELINE_TABS } from '../pipelineConstants';
import { StepScopeView } from '../pipeline/StepScopeView';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';
import { INDUSTRIES_LIST } from '../constants';
import { NongDot } from '@/components/flow/NongDot';

interface LocalTabProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  onSelectIndustry: (indId: string) => void;
  onSelectSubIndustry: (subId: string) => void;
  onSelectSegment: (segId: string) => void;
}

export const LocalTab: React.FC<LocalTabProps> = ({
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  onSelectIndustry,
  onSelectSubIndustry,
  onSelectSegment,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const currentIndustry = INDUSTRIES_LIST.find((i) => i.id === selectedIndustryId);
  const currentSubIndustries = ALL_SUB_INDUSTRIES[selectedIndustryId] || [];
  const activeSubIndustry = currentSubIndustries.find((s) => s.id === selectedSubIndustryId);
  const activeSegment = activeSubIndustry?.segments?.find((s) => s.id === selectedSegmentId);

  const currentTab = PIPELINE_TABS.find((t) => t.id === activeStep) || PIPELINE_TABS[0];

  const goToNext = () => setActiveStep((prev) => Math.min(12, prev + 1));
  const goToPrev = () => setActiveStep((prev) => Math.max(1, prev - 1));
  const goToStep = (step: number) => setActiveStep(step);

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* Left Sidebar (12 Pipeline Steps) - Step 01 has Logo & Name, Steps 02-12 have only numbers */}
      <div className="w-[56px] sm:w-[62px] shrink-0 bg-[#f8f9fa] dark:bg-[#16181f] overflow-y-auto pb-24 border-r border-gray-100 dark:border-gray-800/80 scrollbar-none flex flex-col">
        {PIPELINE_TABS.map((tab) => {
          const isActive = activeStep === tab.id;
          const isStep1 = tab.id === 1;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`w-full flex flex-col items-center justify-center border-l-[2.5px] transition-all text-center relative ${
                isStep1 ? 'py-2 px-0.5 min-h-[58px]' : 'py-3 px-0.5 min-h-[44px]'
              } ${
                isActive
                  ? 'border-brand-red bg-white dark:bg-[#12141a] text-brand-red font-bold shadow-2xs'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-[#1e2129] hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title={isStep1 ? `${tab.code} หาตัวตน` : `ขั้นตอน ${tab.code}`}
            >
              {isStep1 ? (
                <>
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center mb-0.5 text-[10px] transition-colors ${
                      isActive
                        ? 'bg-red-50 text-brand-red dark:bg-red-950/50'
                        : 'bg-gray-200/60 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <i className={tab.icon}></i>
                  </span>
                  <span className="text-[8px] font-mono leading-none text-gray-400 dark:text-gray-500 mb-0.5">
                    {tab.code}
                  </span>
                  <span
                    className={`text-[8px] sm:text-[8.5px] leading-[1.15] px-0.5 line-clamp-2 ${
                      isActive ? 'text-brand-red font-bold' : ''
                    }`}
                  >
                    หาตัวตน
                  </span>
                </>
              ) : (
                /* Steps 02-12: Only show number without logo and name */
                <span
                  className={`font-mono transition-all ${
                    isActive
                      ? 'text-xs sm:text-[13px] font-black text-brand-red scale-110'
                      : 'text-xs sm:text-[11.5px] font-bold text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {tab.code}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Content Area: Active Step Deep-Dive */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        {activeStep === 1 ? (
          <StepScopeView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            onSelectIndustry={onSelectIndustry}
            onSelectSubIndustry={onSelectSubIndustry}
            onSelectSegment={onSelectSegment}
            onNextStep={goToNext}
            nextButtonLabel="ถัดไป: เข้าสู่ขั้นตอนที่ 02 (ทำใกล้)"
            step1PromptLine1="ต้นน้ำ-ปลายน้ำ คุณเป็นใครได้บ้าง ฉันจะแสดงให้คุณดู"
            step1PromptLine2="โปรดเลือกวงการที่คุณจะทำ"
          />
        ) : (
          /* Steps 02-12: Workspace Placeholder for Local & Community Pipeline */
          <div className="p-4 sm:p-6 space-y-4 animate-fadeIn max-w-2xl mx-auto">
            {/* Step Breadcrumb Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-red/10 text-brand-red text-[11px] font-mono font-bold">
                  ขั้นตอน {currentTab.code}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  สายงานทำใกล้ (Local & Community Ecosystem)
                </span>
              </div>

              <button
                onClick={() => goToStep(1)}
                className="text-xs text-gray-500 hover:text-brand-red transition-colors flex items-center gap-1 font-medium"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
                <span>กลับไป 01 หาตัวตน</span>
              </button>
            </div>

            {/* Current Project Blueprint Banner */}
            {currentIndustry && (
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#181a20] border border-gray-150 dark:border-gray-800 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-gray-400">ตัวตนและสายงานจาก 01:</div>
                  <div className="font-bold text-gray-800 dark:text-gray-200 truncate mt-0.5">
                    {currentIndustry.name} {activeSubIndustry ? `• ${activeSubIndustry.name}` : ''} {activeSegment ? `• ${activeSegment.name}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => goToStep(1)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#121418] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-brand-red text-[11px] font-medium shrink-0 transition-colors"
                >
                  แก้ไข
                </button>
              </div>
            )}

            {/* Step Workspace Card */}
            <div className="bg-white dark:bg-[#181a20] rounded-3xl border border-gray-150 dark:border-gray-800 p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="h-14 flex items-center justify-center">
                <NongDot mood="synergy" size={18} />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  ขั้นตอนที่ {currentTab.code}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  ระบบขั้นตอนการทำใกล้ลำดับที่ {currentTab.code} อยู่ระหว่างการเชื่อมโยงระบบเครือข่ายชุมชนและระบบเศรษฐกิจหมุนเวียนใกล้ตัว
                </p>
              </div>

              {/* Quick Stepper Navigation */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={goToPrev}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#20232b] hover:bg-gray-200 dark:hover:bg-[#272b35] text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-chevron-left text-[10px]"></i>
                  <span>ก่อนหน้า</span>
                </button>

                {activeStep < 12 && (
                  <button
                    onClick={goToNext}
                    className="px-4 py-2 rounded-xl bg-brand-red hover:bg-red-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>ถัดไป</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
