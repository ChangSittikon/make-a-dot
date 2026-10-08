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

  const renderMockGrid = () => {
    // Generate mock items for the grid
    return (
      <div className="p-3">
        <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">
          {INDUSTRIES_LIST.find(i => i.id === selectedIndustryId)?.name}
        </h3>
        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div key={i} className="flex flex-col items-center">
              <div className="relative w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-1.5 shadow-sm">
                <img 
                  src={`https://picsum.photos/seed/${selectedIndustryId}${i}/100/100`} 
                  alt="item" 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
                {i % 4 === 0 && (
                  <span className="absolute top-0 right-0 bg-[#ff4a4a] text-white text-[8px] font-bold px-1 rounded-bl shadow-sm">
                    HOT
                  </span>
                )}
              </div>
              <span className="text-[10px] text-center text-gray-700 dark:text-gray-300 leading-tight">
                ไอเทมตัวอย่าง {i}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full font-prompt bg-white dark:bg-[#12141a]">
      {/* Left Sidebar (12 Tabs) */}
      <div className="w-[85px] shrink-0 bg-[#f5f5f5] dark:bg-[#1a1c23] overflow-y-auto pb-24 border-r border-gray-100 dark:border-[#262930] scrollbar-none">
        {INDUSTRIES_LIST.map((ind) => (
          <button 
            key={ind.id}
            onClick={() => onSelectIndustry(ind.id)}
            className={`w-full flex flex-col items-center justify-center py-4 px-1 border-l-[3px] transition-colors ${
              selectedIndustryId === ind.id 
                ? 'border-[#ff4a4a] bg-white dark:bg-[#12141a] text-[#ff4a4a]' 
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#20232a]'
            }`}
          >
            <span className="text-[10px] font-medium text-center leading-[1.2] px-1 line-clamp-3">
              {ind.name}
            </span>
          </button>
        ))}
      </div>

      {/* Right Content */}
      <div className="flex-1 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        {selectedIndustryId === 'ind_01' ? (
          <div className="h-full">
             <CapTableSimulation {...props} />
          </div>
        ) : (
          renderMockGrid()
        )}
      </div>
    </div>
  );
};
