'use client';

import React from 'react';
import { CONSTRUCTION_SYNERGY_ROLES, TIER_LIGHT_THEME } from '../constants';

interface StepSynergyViewProps {
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepSynergyView: React.FC<StepSynergyViewProps> = ({
  onPrevStep,
  onNextStep,
}) => {
  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-transparent p-4 rounded-2xl border border-violet-500/20">
        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block mb-1">
          ขั้นตอนที่ 9 จาก 12
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          เครือข่ายความร่วมมือ (5-Tier Synergy Roles)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          โครงสร้างบทบาทผู้ร่วมโครงการ 5 ระดับชั้นเพื่อแปลงทรัพยากรไปสู่การลงมือทำจริงอย่างไร้ข้อขัดแย้ง
        </p>
      </div>

      {/* Role Cards List */}
      <div className="space-y-3">
        {CONSTRUCTION_SYNERGY_ROLES.slice(0, 6).map((role) => {
          const theme = TIER_LIGHT_THEME[role.tier] || TIER_LIGHT_THEME[1];
          return (
            <div
              key={role.id}
              className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                  {theme.label}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {role.originIndustry}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {role.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {role.summary}
              </p>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
                <span className="text-gray-400">KPI ส่งมอบ:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{role.kpiMetrics}</span>
              </div>
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
          <span>ถัดไป: ถอดแบบ BOQ & งวดงาน</span>
          <i className="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
