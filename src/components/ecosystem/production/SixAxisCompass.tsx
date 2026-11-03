'use client';

import React, { useState } from 'react';
import {
  MonetizationAxisId,
  AxisPlanData,
  SIX_AXES_METADATA,
  getOpportunityMonetization,
} from '@/lib/career-core';
import { MicroOpportunity, SupplyChainNode } from './types';
import { ActionKind } from './OppCard';
import {
  Compass,
  Check,
  Copy,
  Clock,
  Sparkles,
  TrendingUp,
  Share2,
  MapPin,
  Coins,
  ChevronRight,
  ShieldAlert,
  Search,
} from 'lucide-react';

interface SixAxisCompassProps {
  opp: MicroOpportunity;
  node?: SupplyChainNode;
  sectorId?: string;
  onAction?: (
    k: ActionKind,
    opp: MicroOpportunity,
    node?: SupplyChainNode,
    customCashThb?: number
  ) => void;
  onOpenScanner?: () => void;
  onSelectAxisForBridge?: (axisId: MonetizationAxisId, plan: AxisPlanData) => void;
}

export const SixAxisCompass: React.FC<SixAxisCompassProps> = ({
  opp,
  node,
  sectorId = '01',
  onAction,
  onOpenScanner,
  onSelectAxisForBridge,
}) => {
  const [selectedAxisId, setSelectedAxisId] = useState<MonetizationAxisId>('vertical');
  const [selectedTone, setSelectedTone] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate plans for this specific opportunity
  const plans = getOpportunityMonetization(
    opp.model_name,
    sectorId,
    node?.node_order || 1
  );

  const currentMeta = SIX_AXES_METADATA[selectedAxisId];
  const currentPlan = plans[selectedAxisId];

  const handleCopyScript = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleSendToCapital = () => {
    if (onSelectAxisForBridge) {
      onSelectAxisForBridge(selectedAxisId, currentPlan);
    } else if (onAction) {
      onAction('CAPITAL', opp, node);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200/90 dark:border-zinc-700/80 bg-white/95 dark:bg-zinc-900/95 shadow-md overflow-hidden font-prompt">
      {/* Header Banner */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-zinc-900 via-gray-900 to-zinc-800 text-white flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold tracking-tight">
                สมการทำเงิน 6 แกน (6-Axis Monetization)
              </h4>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-500/40 font-bold">
                v7.5 Engine
              </span>
            </div>
            <p className="text-[10px] text-gray-300 line-clamp-1">
              แปลงตำแหน่งงาน &quot;{opp.model_name}&quot; ให้เป็นกระแสเงินสดรอบทิศทาง
            </p>
          </div>
        </div>

        {onOpenScanner && (
          <button
            type="button"
            onClick={onOpenScanner}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>สแกนทุนชีวิตแฝง (0 บ.)</span>
          </button>
        )}
      </div>

      {/* 6 Axis Chips Selection Bar */}
      <div className="p-2 sm:p-3 bg-gray-50/80 dark:bg-zinc-800/40 border-b border-gray-200/60 dark:border-zinc-800">
        <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 flex items-center justify-between">
          <span>เลือกแกนทำเงินที่ต้องการโฟกัส (แตะเพื่อสลับ):</span>
          <span className="text-brand-red font-mono">6 ช่องทางปลดล็อก</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {(Object.keys(SIX_AXES_METADATA) as MonetizationAxisId[]).map((axisId) => {
            const meta = SIX_AXES_METADATA[axisId];
            const plan = plans[axisId];
            const isSelected = selectedAxisId === axisId;

            return (
              <button
                key={axisId}
                type="button"
                onClick={() => {
                  setSelectedAxisId(axisId);
                  setSelectedTone(0);
                }}
                className={`text-left p-2 rounded-xl transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-800 border-brand-red shadow-sm ring-1 ring-brand-red/30'
                    : 'bg-white/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{meta.emoji}</span>
                  <span
                    className={`text-[10.5px] font-extrabold truncate ${
                      isSelected ? 'text-brand-red' : 'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    แกนที่ {meta.axisNumber}: {meta.labelTh.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                    {meta.subLabelTh.split('/')[0]}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0 font-mono">
                    {plan.estimatedDailyThb > 0
                      ? `+฿${plan.estimatedDailyThb.toLocaleString()}/ว.`
                      : plan.estimatedEarningLabel.split('-')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Axis Deep Dive Content */}
      <div className="p-3 sm:p-4 space-y-4">
        {/* Active Axis Headline */}
        <div className="rounded-xl p-3 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800/80 dark:to-zinc-800/30 border border-gray-200/80 dark:border-zinc-700/80 flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{currentMeta.emoji}</span>
              <h5 className="text-xs sm:text-sm font-extrabold text-brand-black dark:text-white">
                {currentPlan.title}
              </h5>
            </div>
            <p className="text-[10.5px] text-gray-600 dark:text-gray-300 leading-snug">
              {currentMeta.coreConcept}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[9px] text-gray-400">ประมาณการรายได้เสริม</div>
              <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {currentPlan.estimatedEarningLabel}
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hour Quick Strike Action Plan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
              <Clock className="w-3.5 h-3.5 text-brand-red" />
              <span>แผนปฏิบัติการสายฟ้าแลบ 24 ชม. (Quick Strike)</span>
            </div>
            <span className="text-[9px] text-gray-400 font-mono">4 เฟสจบใน 1 วัน</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentPlan.timeline24h.map((phase, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200/60 dark:border-zinc-800 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-brand-black dark:text-white font-mono flex items-center gap-1">
                    <span>{phase.hours}</span>
                  </div>
                  <p className="text-[10.5px] text-gray-600 dark:text-gray-300 leading-relaxed mt-0.5">
                    {phase.task}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Tone Negotiation & Closing Scripts */}
        <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>สคริปต์เจรจาต่อรอง & เปิดการขายทันที</span>
            </div>
            <div className="flex items-center gap-1">
              {currentPlan.scripts.map((sc, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setSelectedTone(sIdx)}
                  className={`px-2 py-0.5 text-[9.5px] rounded-lg font-bold transition-all ${
                    selectedTone === sIdx
                      ? 'bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {sc.toneLabel.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Current Script Box */}
          {currentPlan.scripts[selectedTone] && (
            <div className="relative rounded-xl p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9.5px] font-bold text-gray-500 dark:text-gray-400">
                  โทน: {currentPlan.scripts[selectedTone].toneLabel}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyScript(currentPlan.scripts[selectedTone].scriptText)
                  }
                  className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-700 hover:bg-gray-100 text-gray-700 dark:text-gray-200 text-[10px] font-bold flex items-center gap-1 border border-gray-200 dark:border-zinc-600 transition-all shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        คัดลอกแล้ว!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>คัดลอกข้อความ</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-800 dark:text-gray-200 leading-relaxed font-sans select-all bg-white/70 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700">
                &ldquo;{currentPlan.scripts[selectedTone].scriptText}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons: Bridge to Cap Table or Local Partners */}
        <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[10px] text-gray-500 dark:text-gray-400">
            แผนแกนนี้พร้อมนำไปคิดสัดส่วนผู้ถือหุ้น หรือปักหมุดหาพาร์ทเนอร์ทันที
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSendToCapital}
              className="flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-[10.5px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>ส่งเข้าตารางหุ้น (Cap Table)</span>
            </button>

            {onAction && (
              <button
                type="button"
                onClick={() => onAction('LOCAL', opp, node)}
                className="flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 text-[10.5px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>ปักหมุดหาคู่ค้า</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
