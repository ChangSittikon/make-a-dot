'use client';

import React from 'react';
import { CapTableItem } from '../types';

interface StepBOQViewProps {
  capTableData: CapTableItem[];
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepBOQView: React.FC<StepBOQViewProps> = ({
  capTableData,
  onPrevStep,
  onNextStep,
}) => {
  const totalValuation = capTableData.reduce((acc, cur) => acc + cur.value, 0);

  const milestones = [
    { num: 1, title: 'งวดที่ 1: เตรียมการ & แบบแปลนสัญญา', pct: 20, desc: 'เซ็นสัญญามาตรฐาน, ตรวจแบบ อ.1, ปลดล็อกเงินมัดจำเบื้องต้น' },
    { num: 2, title: 'งวดที่ 2: งานโครงสร้างฐานราก / Core Engine', pct: 30, desc: 'ขึ้นเสาเข็ม/ฐานราก หรือสร้างสถาปัตยกรรมหลักของระบบ' },
    { num: 3, title: 'งวดที่ 3: งานระบบสถาปัตย์ & ฟังก์ชันหลัก', pct: 30, desc: 'ติดตั้ง M&E, งานผนัง/งานระบบ หรือฟีเจอร์ระดับ MVP' },
    { num: 4, title: 'งวดที่ 4: ตรวจรับ Defect & ส่งมอบสุดท้าย', pct: 20, desc: 'ผ่านการตรวจรับโดย Independent QC Tier 3 และโอนกรรมสิทธิ์' },
  ];

  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-4 rounded-2xl border border-amber-500/20">
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
          ขั้นตอนที่ 10 จาก 12
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          ถอดแบบ BOQ & งวดเบิกจ่าย (Milestones)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ผูกมูลค่าสินทรัพย์และกระแสเงินเข้ากับความคืบหน้างวดงานจริง ป้องกันงบบานปลาย
        </p>
      </div>

      {/* Milestone List Card */}
      <div className="space-y-3">
        {milestones.map((m) => {
          const milestoneAmount = (totalValuation * m.pct) / 100;
          return (
            <div
              key={m.num}
              className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  {m.title}
                </span>
                <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">
                  {m.pct}% ({milestoneAmount.toLocaleString()} THB)
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {m.desc}
              </p>
            </div>
          );
        })}
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
          <span>ถัดไป: เซฟล็อกเงิน & QC</span>
          <i className="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
