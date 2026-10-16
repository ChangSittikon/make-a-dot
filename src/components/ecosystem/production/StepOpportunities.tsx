'use client';

import React from 'react';
import {
  ProductChain,
  SupplyChainNode,
  MicroOpportunity,
  TRAFFIC_META,
  STAGE_META,
} from './types';
import { baht, flattenOpps } from './schema';
import { OppCard, ActionKind } from './OppCard';

interface Props {
  chain: ProductChain;
  selectedOppKey: string;
  onSelectOpp: (key: string) => void;
  onAction: (
    k: ActionKind,
    opp?: MicroOpportunity,
    node?: SupplyChainNode,
    customCashThb?: number
  ) => void;
  onNavigateStep?: (step: number, oppKey?: string) => void;
}

/** 03 ชี้จุดแทรก — โหนดไฟเขียว (🟢) และจุดคอขวดที่ส่วนต่างราคาสูงสุด */
export const StepOpportunities: React.FC<Props> = ({
  chain,
  selectedOppKey,
  onSelectOpp,
  onAction,
  onNavigateStep,
}) => {
  const nodes = chain.supply_chain_nodes;
  const bottlenecks = nodes
    .filter((n) => n.node_order <= 3)
    .sort(
      (a, b) =>
        b.margin_jump_to_next_node_percent - a.margin_jump_to_next_node_percent
    );
  const hasReal = bottlenecks.some((n) => n.is_high_margin_bottleneck);
  const topBottlenecks = hasReal
    ? bottlenecks.filter((n) => n.is_high_margin_bottleneck)
    : bottlenecks.slice(0, 1);

  const greenNodes = nodes.filter((n) => n.traffic_light === 'GREEN');
  const flat = flattenOpps(chain);
  const bestOverall = [...flat]
    .sort(
      (a, b) =>
        b.opp.feasibility_score.total_score -
        a.opp.feasibility_score.total_score
    )
    .slice(0, 4);

  const handleCardAction = (
    k: ActionKind,
    opp: MicroOpportunity,
    node: SupplyChainNode | undefined,
    key: string
  ) => {
    onSelectOpp(key);
    if (k === 'SIMULATE') {
      onNavigateStep?.(4, key);
    } else if (k === 'WEAPONS') {
      onNavigateStep?.(5, key);
    } else {
      onAction(k, opp, node);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Bottleneck Spotlight Card */}
      <section className="rounded-3xl bg-brand-black text-white p-4 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 bg-brand-red rounded-full shrink-0"
            style={{
              animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite',
            }}
          />
          <h4 className="text-xs font-extrabold text-white">
            🔥 ช่วงที่ราคากระโดดแรงที่สุด (โอกาสตัดตอนคนกลาง)
          </h4>
        </div>

        {topBottlenecks.map((n) => {
          const next = nodes[n.node_order];
          return (
            <div
              key={n.node_order}
              className="rounded-2xl bg-white/10 border border-white/15 p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-white truncate">
                  {STAGE_META[n.stage_type].emoji} {n.node_title} ➔{' '}
                  {next?.node_title}
                </div>
                <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-brand-red text-white text-[10px] font-black font-mono">
                  +{n.margin_jump_to_next_node_percent}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono bg-white/10 rounded-xl px-3 py-2">
                <span className="text-gray-300">
                  ราคาต้นทาง <b>฿{baht(n.five_w_two_h.how_much_selling_thb)}</b>
                </span>
                <span className="text-brand-red font-black">━━▶</span>
                <span className="text-emerald-400 font-extrabold">
                  ปลายทาง ฿{baht(next?.five_w_two_h.how_much_selling_thb || 0)}
                </span>
              </div>

              {next && (
                <p className="text-[10.5px] text-gray-300 leading-snug">
                  💡 <b className="text-white">ช่องว่างทำเงิน:</b>{' '}
                  {next.five_w_two_h.pain_point}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* 2. Green Nodes & Top Ranked Opportunities */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-extrabold text-brand-black dark:text-white">
            {TRAFFIC_META.GREEN.emoji} จุดแทรกทำเงินที่น่าลุยที่สุด
          </h4>
          <span className="text-[10px] text-gray-500">
            เรียงตามคะแนนความคุ้มค่า
          </span>
        </div>

        {greenNodes.length > 0
          ? greenNodes.map((n) => (
              <div key={n.node_order} className="space-y-2.5">
                {n.micro_opportunities.map((opp, i) => {
                  const key = `${n.node_order}-${i}`;
                  return (
                    <OppCard
                      key={key}
                      opp={opp}
                      node={n}
                      selected={selectedOppKey === key}
                      onSelect={() => {
                        onSelectOpp(key);
                        onNavigateStep?.(4, key);
                      }}
                      onAction={(k, o) => handleCardAction(k, o, n, key)}
                    />
                  );
                })}
              </div>
            ))
          : bestOverall.map((f) => (
              <OppCard
                key={f.key}
                opp={f.opp}
                node={f.node}
                selected={selectedOppKey === f.key}
                onSelect={() => {
                  onSelectOpp(f.key);
                  onNavigateStep?.(4, f.key);
                }}
                onAction={(k, o) => handleCardAction(k, o, f.node, f.key)}
              />
            ))}
      </section>
    </div>
  );
};
