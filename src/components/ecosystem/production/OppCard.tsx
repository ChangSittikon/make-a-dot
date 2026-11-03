'use client';

import React, { useState } from 'react';
import {
  MicroOpportunity,
  SupplyChainNode,
  STRATEGY_META,
  STAGE_META,
} from './types';
import { SixAxisCompass } from './SixAxisCompass';
import { MonetizationAxisId, AxisPlanData } from '@/lib/career-core';

export type ActionKind =
  | 'CAPITAL'
  | 'LOCAL'
  | 'CONNECT'
  | 'SIMULATE'
  | 'WEAPONS'
  | 'SCANNER';

interface Props {
  opp: MicroOpportunity;
  node?: SupplyChainNode;
  selected?: boolean;
  onSelect?: () => void;
  onAction?: (
    k: ActionKind,
    opp: MicroOpportunity,
    node?: SupplyChainNode
  ) => void;
  onOpenScanner?: () => void;
  onSelectAxisForBridge?: (axisId: MonetizationAxisId, plan: AxisPlanData) => void;
}

export const OppCard: React.FC<Props> = ({
  opp,
  node,
  selected,
  onSelect,
  onAction,
  onOpenScanner,
  onSelectAxisForBridge,
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showCompass, setShowCompass] = useState(false);
  const sm = STRATEGY_META[opp.strategy_type];
  const fs = opp.feasibility_score;

  return (
    <div
      className={`rounded-3xl border p-3.5 space-y-3 transition-all ${
        selected
          ? 'border-brand-red bg-red-50/30 dark:bg-red-950/20 shadow-xs'
          : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#181a20]'
      }`}
    >
      {/* 1. Header: Strategy Badge + Model Title + Score */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-black text-white dark:bg-white dark:text-brand-black text-[9.5px] font-bold">
              <span>{sm.emoji}</span>
              <span>{sm.label}</span>
            </span>
            {node && (
              <span className="text-[10px] font-bold text-gray-400">
                {STAGE_META[node.stage_type].emoji} โหนด {node.node_order}
              </span>
            )}
          </div>
          <h4 className="mt-1.5 text-xs font-extrabold text-brand-black dark:text-white leading-snug">
            {opp.model_name}
          </h4>
        </div>

        <div className="shrink-0 text-center rounded-2xl bg-brand-red text-white px-2.5 py-1.5 shadow-2xs">
          <div className="text-sm font-black font-mono leading-none">
            {fs.total_score}
          </div>
          <div className="text-[8px] font-bold opacity-85 mt-0.5">เต็ม 20</div>
        </div>
      </div>

      {/* 2. Result-First Visual Metrics (Capital & Expected Profit) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-brand-gray dark:bg-zinc-800/80 p-2.5">
          <div className="text-[9.5px] text-gray-500 dark:text-gray-400">
            💰 ทุนเริ่มต้น
          </div>
          <div className="text-xs font-extrabold font-mono text-brand-black dark:text-white mt-0.5">
            {opp.capital_required_thb} บ.
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 p-2.5">
          <div className="text-[9.5px] text-emerald-700 dark:text-emerald-300 font-medium">
            📈 กำไรคาดหวัง
          </div>
          <div className="text-xs font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            {opp.expected_margin_percent}
          </div>
        </div>
      </div>

      {/* 3. Visual 4-Pillar Mini Meter (Compact Single Row) */}
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {[
          { label: 'ทุนต่ำ', val: fs.low_capital },
          { label: 'กำไรดี', val: fs.profit_margin },
          { label: 'เข้าง่าย', val: fs.ease_of_entry },
          { label: 'รวมกลุ่ม', val: fs.aggregability },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-brand-gray/70 dark:bg-zinc-800/50 py-1.5 px-1"
          >
            <div className="text-[9px] text-gray-500">{item.label}</div>
            <div className="text-[10.5px] font-extrabold font-mono text-brand-black dark:text-white mt-0.5">
              {item.val}/5
            </div>
            <div className="w-full h-1 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-brand-red rounded-full"
                style={{ width: `${(item.val / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Direct Action Pointers (Jump to Other Tabs/Steps Immediately) */}
      {onAction && (
        <div className="space-y-1.5 pt-0.5">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() =>
                onSelect ? onSelect() : onAction('SIMULATE', opp, node)
              }
              className="py-2 px-2.5 rounded-2xl bg-brand-red hover:opacity-95 text-white text-[10.5px] font-bold flex items-center justify-center gap-1 shadow-2xs transition-transform active:scale-95"
            >
              <span>🧮 ลองคำนวณกำไร</span>
            </button>
            <button
              type="button"
              onClick={() => onAction('CONNECT', opp, node)}
              className="py-2 px-2.5 rounded-2xl bg-brand-black hover:opacity-90 text-white dark:bg-white dark:text-brand-black text-[10.5px] font-bold flex items-center justify-center gap-1 shadow-2xs transition-transform active:scale-95"
            >
              <span>🤝 รวมล็อตผลิต</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onAction('CAPITAL', opp, node)}
              className="py-1.5 px-2.5 rounded-xl bg-brand-gray hover:bg-gray-200 dark:bg-zinc-800 text-brand-black dark:text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span>💰 หาทุนตั้งตารางหุ้น</span>
            </button>
            <button
              type="button"
              onClick={() => onAction('LOCAL', opp, node)}
              className="py-1.5 px-2.5 rounded-xl bg-brand-gray hover:bg-gray-200 dark:bg-zinc-800 text-brand-black dark:text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <span>📍 ปักหมุดหาคู่ค้า</span>
            </button>
          </div>

          {/* 6-Axis Monetization & Hidden Nodes CTAs (v7.5 Engine) */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={() => setShowCompass(!showCompass)}
              className={`py-1.5 px-2.5 rounded-xl text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all ${
                showCompass
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 border border-red-200 dark:border-red-800 text-brand-red dark:text-red-300 hover:opacity-90'
              }`}
            >
              <span>🧭 {showCompass ? 'ซ่อน 6 แกนทำเงิน ▲' : 'สมการทำเงิน 6 แกน ▼'}</span>
            </button>
            <button
              type="button"
              onClick={() => (onOpenScanner ? onOpenScanner() : onAction?.('SCANNER', opp, node))}
              className="py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1 hover:opacity-90 transition-all"
            >
              <span>🔍 สแกนทุนชีวิต (0 บ.)</span>
            </button>
          </div>
        </div>
      )}

      {/* Six Axis Compass Inline Accordion */}
      {showCompass && (
        <div className="pt-2 animate-fadeIn">
          <SixAxisCompass
            opp={opp}
            node={node}
            onAction={onAction}
            onOpenScanner={onOpenScanner ? onOpenScanner : () => onAction?.('SCANNER', opp, node)}
            onSelectAxisForBridge={onSelectAxisForBridge}
          />
        </div>
      )}

      {/* 5. On-Demand Explanation Toggle (Hidden by Default to Avoid Text Clutter) */}
      <div className="pt-1 border-t border-gray-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => setShowDetail(!showDetail)}
          className="w-full py-1 text-[10.5px] font-bold text-gray-500 hover:text-brand-black dark:hover:text-white flex items-center justify-between transition-colors"
        >
          <span>
            {showDetail
              ? 'ซ่อนคำอธิบายวิธีทำ ▲'
              : '📖 ดูวิธีเริ่มต้น & อาวุธที่ต้องใช้เพิ่มเติม ▼'}
          </span>
          {onAction && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onAction('WEAPONS', opp, node);
              }}
              className="text-brand-red underline cursor-pointer"
            >
              ไปหน้าเช็กอาวุธ →
            </span>
          )}
        </button>

        {showDetail && (
          <div className="mt-2 p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800/60 space-y-2 text-[10.5px] text-gray-600 dark:text-gray-300 leading-relaxed">
            <div>
              <b className="text-brand-black dark:text-white">🚀 วิธีเริ่มต้น: </b>
              {opp.how_to_start}
            </div>
            <div className="pt-1.5 border-t border-gray-200/70 dark:border-zinc-700 space-y-1">
              <div>
                <b className="text-brand-black dark:text-white">🛠️ อุปกรณ์: </b>
                {opp.required_weapons.tools_and_equipment}
              </div>
              <div>
                <b className="text-brand-black dark:text-white">🎓 ทักษะ: </b>
                {opp.required_weapons.skills_needed}
              </div>
              <div>
                <b className="text-brand-black dark:text-white">⚖️ กฎหมาย: </b>
                {opp.required_weapons.legal_and_permits}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
