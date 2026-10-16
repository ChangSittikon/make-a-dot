'use client';

import React from 'react';
import { MicroOpportunity, SupplyChainNode, STRATEGY_META, STAGE_META } from './types';

export type ActionKind = 'CAPITAL' | 'LOCAL' | 'CONNECT';

const ScoreBar: React.FC<{ label: string; v: number }> = ({ label, v }) => (
  <div className="flex items-center gap-2">
    <span className="w-14 shrink-0 text-[9.5px] text-gray-500 dark:text-gray-400">{label}</span>
    <div className="flex gap-0.5 flex-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i <= v ? 'bg-[#E53935]' : 'bg-gray-200 dark:bg-gray-700'}`}
        />
      ))}
    </div>
    <span className="w-6 text-right text-[10px] font-mono font-bold text-gray-700 dark:text-gray-300">{v}/5</span>
  </div>
);

interface Props {
  opp: MicroOpportunity;
  node?: SupplyChainNode;
  selected?: boolean;
  onSelect?: () => void;
  onAction?: (k: ActionKind, opp: MicroOpportunity, node?: SupplyChainNode) => void;
}

export const OppCard: React.FC<Props> = ({ opp, node, selected, onSelect, onAction }) => {
  const sm = STRATEGY_META[opp.strategy_type];
  const fs = opp.feasibility_score;
  return (
    <div
      className={`rounded-2xl border p-3 space-y-2.5 transition-colors ${
        selected
          ? 'border-[#E53935] bg-red-50/40 dark:bg-red-950/20'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[9.5px] font-bold">
            {sm.emoji} {sm.label}
          </span>
          <h4 className="mt-1.5 text-[13px] font-extrabold text-gray-900 dark:text-white leading-snug">{opp.model_name}</h4>
          {node && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              {STAGE_META[node.stage_type].emoji} โหนด {node.node_order}: {node.node_title}
            </p>
          )}
        </div>
        <div className="shrink-0 text-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1">
          <div className="text-base font-black font-mono leading-none">{fs.total_score}</div>
          <div className="text-[8px] opacity-70">/20</div>
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
        <span className="font-bold text-gray-800 dark:text-gray-100">เริ่มต้น: </span>
        {opp.how_to_start}
      </p>

      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
        <div className="rounded-xl bg-gray-50 dark:bg-[#14161b] p-2">
          <div className="text-[9px] text-gray-400">งบลงทุนตั้งต้น (บาท)</div>
          <div className="font-bold text-gray-900 dark:text-white">{opp.capital_required_thb}</div>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-[#14161b] p-2">
          <div className="text-[9px] text-gray-400">กำไรคาดหวัง</div>
          <div className="font-bold text-emerald-600">{opp.expected_margin_percent}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {opp.target_persona_tags.map((t) => (
          <span key={t} className="px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-[9px] text-gray-500 dark:text-gray-400">
            {t}
          </span>
        ))}
      </div>

      <div className="space-y-1">
        <ScoreBar label="ทุนต่ำ" v={fs.low_capital} />
        <ScoreBar label="กำไรดี" v={fs.profit_margin} />
        <ScoreBar label="เข้าง่าย" v={fs.ease_of_entry} />
        <ScoreBar label="รวมกลุ่มได้" v={fs.aggregability} />
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-2 space-y-0.5 text-[10px] text-gray-600 dark:text-gray-300">
        <div className="font-bold text-gray-800 dark:text-gray-100 text-[10.5px]">🧰 อาวุธที่ต้องใช้</div>
        <div><b>อุปกรณ์:</b> {opp.required_weapons.tools_and_equipment}</div>
        <div><b>ทักษะ:</b> {opp.required_weapons.skills_needed}</div>
        <div><b>กฎหมาย:</b> {opp.required_weapons.legal_and_permits}</div>
      </div>

      {onSelect && (
        <button
          onClick={onSelect}
          className={`w-full py-2 rounded-xl text-[11px] font-bold border transition-colors ${
            selected
              ? 'bg-[#E53935] text-white border-[#E53935]'
              : 'bg-white dark:bg-transparent text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-[#E53935] hover:text-[#E53935]'
          }`}
        >
          {selected ? '✓ ใช้โมเดลนี้ในขั้น 04-06' : 'เลือกโมเดลนี้ไปคำนวณต่อ'}
        </button>
      )}

      {onAction && (
        <div className="space-y-1.5 pt-1 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onAction('CAPITAL', opp, node)}
              className="py-2 px-2.5 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-gray-900 text-[10.5px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-transform active:scale-95"
              title={`ส่งงบตั้งต้น ${opp.capital_required_thb} บาท ไปตั้งตารางหุ้นในแท็บ "ทำทุน"`}
            >
              <span>💰 [หาทุน] ตั้งตารางหุ้น</span>
            </button>
            <button
              onClick={() => onAction('LOCAL', opp, node)}
              className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-transform active:scale-95"
              title={`ปักหมุดโรงงานและคู่ค้าใกล้บ้านในแท็บ "ทำใกล้"`}
            >
              <span>📍 [หาคู่ค้า] ปักหมุดโรงงาน</span>
            </button>
          </div>
          <div className="text-[9.5px] text-gray-500 dark:text-gray-400 px-1 space-y-0.5">
            <div className="truncate">• <b>ทำทุน:</b> {opp.action_links.go_to_capital_tab}</div>
            <div className="truncate">• <b>ทำใกล้:</b> {opp.action_links.go_to_nearby_tab}</div>
          </div>
          <button
            onClick={() => onAction('CONNECT', opp, node)}
            className="w-full py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-[#D32F2F] text-[10px] font-bold text-center border border-red-200 dark:border-red-900 transition-colors"
          >
            🤝 ไปที่ &quot;เชื่อมดอท&quot; - {opp.action_links.go_to_connect_tab}
          </button>
        </div>
      )}
    </div>
  );
};
