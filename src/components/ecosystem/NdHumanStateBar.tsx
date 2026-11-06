'use client';

import React from 'react';
import { HumanStateContext } from '@/lib/ecosystem-tools/types';
import { D1_STATES } from '@/lib/ecosystem-tools/nd-matrix-and-core-registry';
import { Flame, ShieldAlert, Sparkles, ChevronDown } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left: D1 Life Status Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#E11D48]" />
            พิกัดสถานะชีวิต (D1):
          </span>
          <div className="flex gap-1 bg-[#F8FAFC] dark:bg-gray-800 p-0.5 rounded-xl border border-[#E2E8F0] dark:border-gray-700">
            {D1_STATES.map((s) => {
              const isActive = context.activeD1 === s.code;
              return (
                <button
                  key={s.code}
                  onClick={() => handleSelectD1(s.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] shadow-xs'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span className="font-mono text-[10px] mr-1 opacity-70">{s.code}</span>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Stress/Runway Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={toggleStress}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              context.isStressAlert
                ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-xs animate-pulse'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-[#E2E8F0] dark:border-gray-700 hover:border-gray-400'
            }`}
          >
            {context.isStressAlert ? (
              <>
                <Flame className="w-3.5 h-3.5 text-white" />
                <span>สายป่านสั้น/เครียดสูง (D5/D6 Alert)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-gray-400" />
                <span>โหมดปกติ (สลับ D5/D6)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-node Selector & Active Alert Info */}
      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
          <span className="text-[10px] text-gray-400 shrink-0 font-mono">มิติย่อย:</span>
          {currentD1.subNodes.map((sub) => {
            const isSubActive = context.activeSubD1 === sub.code;
            return (
              <button
                key={sub.code}
                onClick={() => handleSelectSubD1(sub.code)}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-all shrink-0 font-medium ${
                  isSubActive
                    ? 'bg-red-50 dark:bg-red-950/40 text-[#E11D48] font-bold border border-red-200 dark:border-red-900/50'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={sub.description}
              >
                <span className="font-mono text-[9px] mr-1">{sub.code}</span>
                {sub.title}
              </button>
            );
          })}
        </div>

        {context.isStressAlert && (
          <span className="text-[10px] font-bold text-[#E11D48] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200">
            ย่อขั้นตอน SOP เหลือ 90 นาที (D2.07 Sprint)
          </span>
        )}
      </div>
    </div>
  );
};
