'use client';

import React from 'react';
import { HumanStateContext } from '@/lib/ecosystem-tools/types';
import { D1_STATES } from '@/lib/ecosystem-tools/nd-matrix-and-core-registry';
import { Flame, ShieldAlert, Sparkles } from 'lucide-react';

interface NdHumanStateBarProps {
  context: HumanStateContext;
  onChange: (newContext: HumanStateContext) => void;
}

export const NdHumanStateBar: React.FC<NdHumanStateBarProps> = ({
  context,
  onChange,
}) => {
  const currentD1 = D1_STATES.find((s) => s.code === context.activeD1) || D1_STATES[0];

  const handleSelectD1 = (code: string) => {
    const target = D1_STATES.find((s) => s.code === code) || D1_STATES[0];
    onChange({
      ...context,
      activeD1: code,
      activeSubD1: target.subNodes[0].code,
    });
  };

  const handleSelectSubD1 = (subCode: string) => {
    onChange({
      ...context,
      activeSubD1: subCode,
    });
  };

  const toggleStress = () => {
    onChange({
      ...context,
      isStressAlert: !context.isStressAlert,
    });
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-gray-800 p-2.5 sm:p-3 font-prompt transition-colors">
      {/* Row 1: Life Status Header + Stress Toggle (No Technical D-codes) */}
      <div className="flex items-center justify-between gap-2 w-full mb-2">
        <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#E11D48]" />
          พิกัดสถานะชีวิต:
        </span>
        <button
          onClick={toggleStress}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 border shrink-0 ${
            context.isStressAlert
              ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-xs animate-pulse'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-[#E2E8F0] dark:border-gray-700 hover:border-gray-400'
          }`}
        >
          {context.isStressAlert ? (
            <>
              <Flame className="w-3 h-3 text-white" />
              <span>โหมดเครียดสูง (งานด่วน)</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3 h-3 text-gray-400" />
              <span>โหมดปกติ</span>
            </>
          )}
        </button>
      </div>

      {/* Row 2: 4-Column Clean Grid (Only Thai Titles, No D1.x codes) */}
      <div className="grid grid-cols-4 gap-1 w-full bg-[#F8FAFC] dark:bg-gray-800 p-1 rounded-xl border border-[#E2E8F0] dark:border-gray-700">
        {D1_STATES.map((s) => {
          const isActive = context.activeD1 === s.code;
          return (
            <button
              key={s.code}
              onClick={() => handleSelectD1(s.code)}
              className={`text-[11px] font-bold py-1.5 px-1 text-center rounded-lg transition-all truncate ${
                isActive
                  ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                  : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <span className="truncate block">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Row 3: Sub-node Selector (Only Thai Sub-titles, No D1.x.x codes) */}
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-0.5 flex-1 min-w-0">
          <span className="text-[10px] text-gray-400 shrink-0 font-mono">มิติย่อย:</span>
          {currentD1.subNodes.map((sub) => {
            const isSubActive = context.activeSubD1 === sub.code;
            return (
              <button
                key={sub.code}
                onClick={() => handleSelectSubD1(sub.code)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] transition-all shrink-0 font-medium whitespace-nowrap ${
                  isSubActive
                    ? 'bg-red-50 dark:bg-red-950/40 text-[#E11D48] font-bold border border-red-200 dark:border-red-900/50'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={sub.description}
              >
                {sub.title}
              </button>
            );
          })}
        </div>

        {context.isStressAlert && (
          <span className="text-[9px] font-bold text-[#E11D48] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200 shrink-0">
            ย่อ SOP 90 นาที
          </span>
        )}
      </div>
    </div>
  );
};
