'use client';

import React, { useState, useMemo } from 'react';
import {
  HIDDEN_NODES_CATALOG,
  calculateHiddenNodesValuation,
  HiddenNodeCategoryId,
  HiddenNodeItem,
} from '@/lib/career-core';
import { NongDot } from '@/components/flow/NongDot';
import {
  X,
  Sparkles,
  Coins,
  MapPin,
  Check,
} from 'lucide-react';

interface HiddenNodesScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToCapTable?: (valuationData: {
    totalValuationThb: number;
    sweatThb: number;
    equipThb: number;
    venueThb: number;
    ipThb: number;
    selectedNodeIds: string[];
  }) => void;
  onFindLocalPartners?: (selectedNodeIds: string[]) => void;
  initialSelectedIds?: string[];
}

const CATEGORY_TABS: { id: HiddenNodeCategoryId | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'ทั้งหมด (10 รายการ)', emoji: '✨' },
  { id: 'location', label: 'ทำเล', emoji: '🏥' },
  { id: 'people', label: 'คนรู้จัก', emoji: '👥' },
  { id: 'assets', label: 'เครื่องมือ', emoji: '🚚' },
  { id: 'time', label: 'เวลาว่าง', emoji: '⏰' },
  { id: 'grit', label: 'ความอึด', emoji: '🥊' },
];

export const HiddenNodesScannerModal: React.FC<HiddenNodesScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyToCapTable,
  onFindLocalPartners,
  initialSelectedIds = ['time_early_morning', 'grit_negotiate'],
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [activeTab, setActiveTab] = useState<HiddenNodeCategoryId | 'all'>('all');

  const toggleItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const valuationResult = useMemo(
    () => calculateHiddenNodesValuation(selectedIds),
    [selectedIds]
  );

  const totalValuation = valuationResult.totalEstimatedValuationThb;

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return HIDDEN_NODES_CATALOG;
    return HIDDEN_NODES_CATALOG.filter((item) => item.category === activeTab);
  }, [activeTab]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (onApplyToCapTable) {
      onApplyToCapTable({
        totalValuationThb: totalValuation,
        sweatThb: valuationResult.breakdown.sweatThb,
        equipThb: valuationResult.breakdown.equipThb,
        venueThb: valuationResult.breakdown.venueThb,
        ipThb: valuationResult.breakdown.ipThb,
        selectedNodeIds: selectedIds,
      });
    }
    onClose();
  };

  const handleLocal = () => {
    if (onFindLocalPartners) {
      onFindLocalPartners(selectedIds);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-prompt">
      <div className="w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  เรดาร์สแกนหาทุนชีวิตแฝง (Hidden Nodes)
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/25 text-white font-bold">
                  0 บาทก็เริ่มได้
                </span>
              </div>
              <p className="text-[10.5px] text-white/90 line-clamp-1">
                ติ๊กทรัพยากรที่คุณมีรอบตัว เพื่อแปลงเป็นมูลค่าหุ้นผู้ก่อตั้ง (Sweat/Equip Equity)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NongDot Mascot Speech & Live Valuation Box */}
        <div className="p-3 sm:p-4 bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white dark:from-amber-950/20 dark:via-zinc-900 dark:to-zinc-900 border-b border-amber-200/50 dark:border-zinc-800 shrink-0">
          <div className="flex items-start gap-3">
            <div className="shrink-0 pt-1">
              <NongDot
                mood={totalValuation > 0 ? 'wealth' : 'searching'}
                size={44}
                color={totalValuation > 0 ? 'gold' : 'red'}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                {totalValuation > 0 ? (
                  <span>
                    <b className="text-amber-600 dark:text-amber-400 font-extrabold">
                      ยอดเยี่ยมมากครับ!
                    </b>{' '}
                    ทุนชีวิตที่คุณเลือก สามารถตีมูลค่าเป็นหุ้นลงแรง/อุปกรณ์ได้สูงถึง
                  </span>
                ) : (
                  <span>
                    &quot;คนเรามักคิดว่าตัวเองไม่มีทุน แต่จริง ๆ แล้ว ทำเล, เวลา, คนรู้จัก
                    และความอึด คือ <b className="text-brand-red font-bold">ทุนที่มีมูลค่ามหาศาล</b> ลองติ๊กดูครับ!&quot;
                  </span>
                )}
              </div>

              {/* Big Golden Tally */}
              <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400 tracking-tight">
                  ฿{totalValuation.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                  (เลือก {selectedIds.length} รายการจาก 10 ช่องทาง)
                </span>
              </div>

              {/* Breakdown Tags */}
              {totalValuation > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 text-[9.5px]">
                  {valuationResult.breakdown.sweatThb > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800 font-bold">
                      หยาดเหงื่อ/ทักษะ: ฿{valuationResult.breakdown.sweatThb.toLocaleString()}
                    </span>
                  )}
                  {valuationResult.breakdown.equipThb > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800 font-bold">
                      เครื่องมือ/รถ: ฿{valuationResult.breakdown.equipThb.toLocaleString()}
                    </span>
                  )}
                  {valuationResult.breakdown.venueThb > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800 font-bold">
                      ทำเล/พื้นที่: ฿{valuationResult.breakdown.venueThb.toLocaleString()}
                    </span>
                  )}
                  {valuationResult.breakdown.ipThb > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800 font-bold">
                      เครือข่าย/คอนเนกชัน: ฿{valuationResult.breakdown.ipThb.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="px-3 pt-2 pb-1.5 bg-gray-50/70 dark:bg-zinc-800/40 border-b border-gray-200/60 dark:border-zinc-800 shrink-0 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold shrink-0 transition-all flex items-center gap-1 ${
                activeTab === cat.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                  : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 border border-gray-200/60 dark:border-zinc-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Items Checklist Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredItems.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                  isChecked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600/60 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 shrink-0">
                    {isChecked ? (
                      <div className="w-5 h-5 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-gray-300 dark:border-zinc-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{item.emoji}</span>
                        <span className="text-xs sm:text-sm font-extrabold text-brand-black dark:text-white">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800">
                        +฿{item.baseEstimatedValuationThb.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-snug">
                      {item.subLabel}
                    </p>

                    <div className="mt-1.5 p-2 rounded-xl bg-gray-50 dark:bg-zinc-800/60 text-[10px] text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold shrink-0">💡 แนวทางทำเงิน:</span>
                      <span className="line-clamp-2">{item.suggestedAction}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-zinc-800/80 border-t border-gray-200 dark:border-zinc-800 shrink-0 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[10.5px] text-gray-500 dark:text-gray-400">
            มูลค่ารวมที่ได้จะถูกส่งไปเพิ่มในตารางหุ้นโดยอัตโนมัติ
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleLocal}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 hover:bg-gray-100 text-gray-700 dark:text-gray-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>หาคู่ค้าท้องถิ่น</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={totalValuation === 0}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                totalValuation > 0
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:opacity-95 active:scale-95'
                  : 'bg-gray-400 dark:bg-zinc-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>นำทุนชีวิตนี้ไปตั้งตารางหุ้น (Cap Table)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
