'use client';

import React from 'react';
import { BACK_OFFICE_ENGINES } from '../constants';

interface StepEscrowViewProps {
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepEscrowView: React.FC<StepEscrowViewProps> = ({
  onPrevStep,
  onNextStep,
}) => {
  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-500/10 via-red-500/10 to-transparent p-4 rounded-2xl border border-rose-500/20">
        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
          ขั้นตอนที่ 11 จาก 12
        </span>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          เซฟล็อกเงิน & กองทุนค้ำประกัน (Escrow & Risk)
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          กลไกความปลอดภัยระดับโปรโตคอล คุ้มครองเงินทุนและรับประกันส่งมอบงาน 100% ไร้การทิ้งงาน
        </p>
      </div>

      {/* Engines List */}
      <div className="space-y-3">
        {BACK_OFFICE_ENGINES.map((eng) => (
          <div
            key={eng.id}
            className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 shadow-xs space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 text-brand-red flex items-center justify-center text-xs">
                <i className={eng.icon}></i>
              </span>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                  {eng.thName}
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">
                  {eng.name}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {eng.description}
            </p>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[10px] text-gray-400">
              <span>ระดับความรับผิดชอบ:</span>
              <span className="font-bold text-brand-red">Tier {eng.tierResponsible} Protocol</span>
            </div>
          </div>
        ))}
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
          <span>ถัดไป: สรุปผล & ปล่อยเควสต์</span>
          <i className="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
