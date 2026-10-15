'use client';

import React from 'react';
import { ProductChain, STRATEGY_META } from './types';
import { flattenOpps } from './schema';

/** แถบเลือกโมเดลจุดแทรกตัว (ใช้ร่วมกันในขั้น 04-06) */
export const OppPicker: React.FC<{
  chain: ProductChain;
  value: string;
  onChange: (key: string) => void;
}> = ({ chain, value, onChange }) => {
  const flat = flattenOpps(chain);
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-bold text-gray-500">เลือกจุดแทรกตัวที่ต้องการวิเคราะห์</div>
      <div className="flex flex-wrap gap-1.5">
        {flat.map((f) => {
          const active = f.key === value;
          return (
            <button
              key={f.key}
              onClick={() => onChange(f.key)}
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border text-left leading-snug max-w-full ${
                active
                  ? 'bg-[#E53935] text-white border-[#E53935]'
                  : 'bg-white dark:bg-[#181a20] border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200'
              }`}
            >
              <span className="opacity-70 mr-1">
                โหนด {f.node.node_order} {STRATEGY_META[f.opp.strategy_type].emoji}
              </span>
              {f.opp.model_name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
