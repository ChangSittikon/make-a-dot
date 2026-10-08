'use client';

import React from 'react';
import { CapTableItem } from '../types';
import { INDUSTRIES_LIST } from '../constants';
import { CapTableSimulation } from './CapTableSimulation';

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
  const { selectedIndustryId, onSelectIndustry } = props;

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* Left Sidebar (12 Industry Tabs) */}
      <div className="w-[84px] sm:w-[94px] shrink-0 bg-[#f8f9fa] dark:bg-[#16181f] overflow-y-auto pb-24 border-r border-gray-100 dark:border-gray-800/80 scrollbar-none flex flex-col">
        {INDUSTRIES_LIST.map((ind) => {
          const isActive = selectedIndustryId === ind.id;
          return (
            <button 
              key={ind.id}
              onClick={() => onSelectIndustry(ind.id)}
              className={`w-full flex flex-col items-center justify-center py-3 px-1 border-l-[3px] transition-all text-center relative ${
                isActive 
                  ? 'border-brand-red bg-white dark:bg-[#12141a] text-brand-red font-bold shadow-2xs' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-[#1e2129]'
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 text-xs transition-colors ${
                isActive 
                  ? 'bg-red-50 text-brand-red dark:bg-red-950/50' 
                  : 'bg-gray-200/60 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>
                <i className={ind.icon}></i>
              </span>
              <span className="text-[9px] font-mono leading-none text-gray-400 dark:text-gray-500 mb-0.5">
                {ind.code}
              </span>
              <span className={`text-[9px] leading-[1.2] px-0.5 line-clamp-2 ${isActive ? 'text-brand-red font-bold' : ''}`}>
                {ind.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Content Area: Deep-Dive Simulation tailored for the active industry */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        <CapTableSimulation {...props} />
      </div>
    </div>
  );
};
