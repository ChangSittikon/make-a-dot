'use client';

import React, { useState } from 'react';
import { CapTableItem } from '../types';
import { PIPELINE_TABS } from '../pipelineConstants';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';
import { INDUSTRY_CAP_PRESETS } from '../constants';

import { StepScopeView } from '../pipeline/StepScopeView';
import { StepValuationView } from '../pipeline/StepValuationView';
import { StepCapTableView } from '../pipeline/StepCapTableView';
import { StepAssetDetailView } from '../pipeline/StepAssetDetailView';
import { StepSynergyView } from '../pipeline/StepSynergyView';
import { StepBOQView } from '../pipeline/StepBOQView';
import { StepEscrowView } from '../pipeline/StepEscrowView';
import { StepSummaryView } from '../pipeline/StepSummaryView';

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

export const CapitalTab: React.FC<CapitalTabProps> = (props) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const {
    selectedIndustryId,
    selectedSubIndustryId,
    selectedSegmentId,
    capTableData,
    onSelectIndustry,
    onSelectSubIndustry,
    onSelectSegment,
    onUpdateCapItem,
  } = props;

  const currentSubIndustries = ALL_SUB_INDUSTRIES[selectedIndustryId] || [];
  const activeSubIndustry = currentSubIndustries.find((s) => s.id === selectedSubIndustryId) || currentSubIndustries[0];
  const activeSegment = activeSubIndustry?.segments?.find((s) => s.id === selectedSegmentId) || activeSubIndustry?.segments?.[0];

  const currentPreset = activeSegment
    ? activeSegment.preset
    : activeSubIndustry
    ? activeSubIndustry.preset
    : INDUSTRY_CAP_PRESETS[selectedIndustryId] || INDUSTRY_CAP_PRESETS.ind_01;

  const goToNext = () => setActiveStep((prev) => Math.min(12, prev + 1));
  const goToPrev = () => setActiveStep((prev) => Math.max(1, prev - 1));
  const goToStep = (step: number) => setActiveStep(step);

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* Left Sidebar (12 Pipeline Steps) - Compact 2/3 width */}
      <div className="w-[56px] sm:w-[62px] shrink-0 bg-[#f8f9fa] dark:bg-[#16181f] overflow-y-auto pb-24 border-r border-gray-100 dark:border-gray-800/80 scrollbar-none flex flex-col">
        {PIPELINE_TABS.map((tab) => {
          const isActive = activeStep === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`w-full flex flex-col items-center justify-center py-2 px-0.5 border-l-[2.5px] transition-all text-center relative ${
                isActive
                  ? 'border-brand-red bg-white dark:bg-[#12141a] text-brand-red font-bold shadow-2xs'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-[#1e2129]'
              }`}
            >
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
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Content Area: Active Step Deep-Dive */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        {activeStep === 1 && (
          <StepScopeView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            onSelectIndustry={onSelectIndustry}
            onSelectSubIndustry={onSelectSubIndustry}
            onSelectSegment={onSelectSegment}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 2 && (
          <StepValuationView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            capTableData={capTableData}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 3 && (
          <StepCapTableView
            capTableData={capTableData}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 4 && (
          <StepAssetDetailView
            assetId="cash"
            stepNumber={4}
            stepTitle="สินทรัพย์เงินสด (Cash Assets)"
            stepDescription="งบประมาณเงินสด สภาพคล่องสำรอง และค่าใช้จ่ายงวดแรกของโครงการ"
            nextStepTitle="หยาดเหงื่อแรงงาน (Sweat Equity)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 5 && (
          <StepAssetDetailView
            assetId="sweat"
            stepNumber={5}
            stepTitle="หยาดเหงื่อแรงงาน (Sweat Equity)"
            stepDescription="การประเมินชั่วโมงทำงาน ทักษะวิชาชีพเฉพาะ และการลงแรงเป็นสัดส่วนหุ้น"
            nextStepTitle="เครื่องมือ & อุปกรณ์ (Equip Assets)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 6 && (
          <StepAssetDetailView
            assetId="equip"
            stepNumber={6}
            stepTitle="เครื่องมือ & อุปกรณ์ (Equip Assets)"
            stepDescription="อุปกรณ์ เครื่องจักร ฮาร์ดแวร์ และเซิร์ฟเวอร์ที่นำมาร่วมพัฒนาโครงการ"
            nextStepTitle="สถานที่ & อสังหาริมทรัพย์ (Venue Assets)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 7 && (
          <StepAssetDetailView
            assetId="venue"
            stepNumber={7}
            stepTitle="สถานที่ & อสังหาริมทรัพย์ (Venue Assets)"
            stepDescription="ที่ดิน อาคาร สำนักงาน หรือสิ่งปลูกสร้างที่นำมาตีมูลค่าเป็นสินทรัพย์ร่วมทุน"
            nextStepTitle="ทรัพย์สินทางปัญญา (IP & Licenses)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 8 && (
          <StepAssetDetailView
            assetId="ip"
            stepNumber={8}
            stepTitle="ทรัพย์สินทางปัญญา (IP & Licenses)"
            stepDescription="แบบแปลน พิมพ์เขียว ใบอนุญาต อ.1, อย., สิทธิบัตร และลิขสิทธิ์ซอฟต์แวร์"
            nextStepTitle="เครือข่ายความร่วมมือ (5-Tier Synergy)"
            capTableData={capTableData}
            currentPreset={currentPreset}
            onUpdateCapItem={onUpdateCapItem}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 9 && (
          <StepSynergyView
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 10 && (
          <StepBOQView
            capTableData={capTableData}
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 11 && (
          <StepEscrowView
            onPrevStep={goToPrev}
            onNextStep={goToNext}
          />
        )}

        {activeStep === 12 && (
          <StepSummaryView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            capTableData={capTableData}
            onPrevStep={goToPrev}
            onGoToStep={goToStep}
          />
        )}
      </div>
    </div>
  );
};
