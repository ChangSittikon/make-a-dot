'use client';

import React from 'react';
import { ProductChain, TRAFFIC_META, STAGE_META } from './types';
import { baht, flattenOpps } from './schema';
import { OppCard, ActionKind } from './OppCard';

interface Props {
  chain: ProductChain;
  selectedOppKey: string;
  onSelectOpp: (key: string) => void;
  onAction: (k: ActionKind) => void;
}

/** 03 ชี้จุดแทรก — โหนดไฟเขียว (🟢) และจุดคอขวดที่ส่วนต่างราคาสูงสุด */
export const StepOpportunities: React.FC<Props> = ({ chain, selectedOppKey, onSelectOpp, onAction }) => {
  const nodes = chain.supply_chain_nodes;
  const bottlenecks = nodes
    .filter((n) => n.node_order <= 3)
    .sort((a, b) => b.margin_jump_to_next_node_percent - a.margin_jump_to_next_node_percent);
  const hasReal = bottlenecks.some((n) => n.is_high_margin_bottleneck);
  const topBottlenecks = hasReal ? bottlenecks.filter((n) => n.is_high_margin_bottleneck) : bottlenecks.slice(0, 1);

  const greenNodes = nodes.filter((n) => n.traffic_light === 'GREEN');
  const flat = flattenOpps(chain);
  const bestOverall = [...flat].sort((a, b) => b.opp.feasibility_score.total_score - a.opp.feasibility_score.total_score).slice(0, 3);

  return (
    <div className="p-3 space-y-4 pb-8">
      <section className="space-y-2">
        <h4 className="text-[12px] font-black text-gray-900 dark:text-white">
          🔥 {hasReal ? 'จุดคอขวดส่วนต่างราคาสูงสุด' : 'ช่วงที่ราคากระโดดมากที่สุด'}
        </h4>
        {!hasReal && (
          <p className="text-[10px] text-gray-400">ห่วงโซ่นี้ไม่มีช่วงที่ส่วนต่างเกิน 100% แสดงช่วงที่กระโดดสูงสุดแทน</p>
        )}
        {topBottlenecks.map((n) => {
          const next = nodes[n.node_order];
          return (
            <div key={n.node_order} className="rounded-2xl border-2 border-[#E53935] bg-red-50/50 dark:bg-red-950/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11.5px] font-extrabold text-gray-900 dark:text-white">
                  {STAGE_META[n.stage_type].emoji} {n.node_title} → {next.node_title}
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-black font-mono">
                  +{n.margin_jump_to_next_node_percent}%
                </span>
              </div>
              <p className="text-[10.5px] text-gray-600 dark:text-gray-300 mt-1 font-mono">
                {baht(n.five_w_two_h.how_much_selling_thb)} บ. → {baht(next.five_w_two_h.how_much_selling_thb)} บ.
              </p>
              <p className="text-[10.5px] text-[#D32F2F] mt-1 font-medium">จุดอ่อนเจ้าตลาด: {next.five_w_two_h.pain_point}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-2">
        <h4 className="text-[12px] font-black text-gray-900 dark:text-white">
          {TRAFFIC_META.GREEN.emoji} โหนดไฟเขียว — {TRAFFIC_META.GREEN.label}
        </h4>
        {greenNodes.length === 0 && (
          <p className="text-[10.5px] text-gray-500">
            สายพานนี้ยังไม่มีโหนดไฟเขียวเต็มตัว แนะนำ 3 โมเดลที่คะแนนสูงสุดแทน
          </p>
        )}
        {greenNodes.map((n) => (
          <div key={n.node_order} className="space-y-2">
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              โหนด {n.node_order} · {n.node_title}
            </div>
            {n.micro_opportunities.map((opp, i) => {
              const key = `${n.node_order}-${i}`;
              return (
                <OppCard
                  key={key}
                  opp={opp}
                  node={n}
                  selected={selectedOppKey === key}
                  onSelect={() => onSelectOpp(key)}
                  onAction={onAction}
                />
              );
            })}
          </div>
        ))}
        {greenNodes.length === 0 &&
          bestOverall.map((f) => (
            <OppCard
              key={f.key}
              opp={f.opp}
              node={f.node}
              selected={selectedOppKey === f.key}
              onSelect={() => onSelectOpp(f.key)}
              onAction={onAction}
            />
          ))}
      </section>
    </div>
  );
};
