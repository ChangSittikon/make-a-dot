'use client';

import React, { useState } from 'react';
import { ProductChain, SupplyChainNode, STAGE_META, TRAFFIC_META } from './types';
import { baht } from './schema';
import { OppCard, ActionKind } from './OppCard';
import { ProfitSimulator } from './ProfitSimulator';

type DrawerTab = 'A' | 'B' | 'C';

interface Props {
  chain: ProductChain;
  selectedOppKey: string;
  onSelectOpp: (key: string) => void;
  onAction: (k: ActionKind) => void;
}

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="grid grid-cols-[88px_1fr] gap-2 py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div className="text-[10px] font-bold text-gray-400">{k}</div>
    <div className="text-[11px] text-gray-700 dark:text-gray-200 leading-relaxed">{v}</div>
  </div>
);

const NodeDrawer: React.FC<{
  node: SupplyChainNode;
  chain: ProductChain;
  selectedOppKey: string;
  onSelectOpp: (key: string) => void;
  onAction: (k: ActionKind) => void;
}> = ({ node, chain, selectedOppKey, onSelectOpp, onAction }) => {
  const [tab, setTab] = useState<DrawerTab>('A');
  const [simIdx, setSimIdx] = useState(0);
  const f = node.five_w_two_h;
  const simOpp = node.micro_opportunities[Math.min(simIdx, node.micro_opportunities.length - 1)];

  const tabs: { id: DrawerTab; label: string }[] = [
    { id: 'A', label: 'ผ่าตัด 5W2H' },
    { id: 'B', label: 'ช่องทางแบ่งเค้ก' },
    { id: 'C', label: 'ลองคำนวณกำไร' },
  ];

  return (
    <div className="mt-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] overflow-hidden animate-fadeIn">
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 text-[10.5px] font-bold transition-colors ${
              tab === t.id
                ? 'text-[#E53935] border-b-2 border-[#E53935] bg-red-50/40 dark:bg-red-950/20'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-3">
        {tab === 'A' && (
          <div>
            <Row k="เจ้าตลาดเดิม (Who)" v={f.who_incumbent} />
            <Row k="กิจกรรม/วิธีทำ (What/How)" v={f.what_how} />
            <Row k="สถานที่ (Where)" v={f.where} />
            <Row
              k="เวลา (When)"
              v={
                <span>
                  ทำจริง <b>{f.when_cycle_time}</b> · รอคอย <b className="text-[#E53935]">{f.when_wait_time}</b>
                </span>
              }
            />
            <Row
              k="ต้นทุน vs ขาย (How much)"
              v={
                <span className="font-mono">
                  {baht(f.how_much_cost_thb)} → <b>{baht(f.how_much_selling_thb)}</b> บาท
                </span>
              }
            />
            <Row k="จุดอ่อนเจ้าตลาด (Pain Point)" v={<span className="text-[#D32F2F] font-medium">{f.pain_point}</span>} />
          </div>
        )}

        {tab === 'B' && (
          <div className="space-y-3">
            {node.micro_opportunities.map((opp, i) => {
              const key = `${node.node_order}-${i}`;
              return (
                <OppCard
                  key={key}
                  opp={opp}
                  selected={selectedOppKey === key}
                  onSelect={() => onSelectOpp(key)}
                  onAction={onAction}
                />
              );
            })}
          </div>
        )}

        {tab === 'C' && (
          <div className="space-y-3">
            {node.micro_opportunities.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {node.micro_opportunities.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => setSimIdx(i)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      simIdx === i ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {o.model_name.length > 22 ? o.model_name.slice(0, 22) + '…' : o.model_name}
                  </button>
                ))}
              </div>
            )}
            <ProfitSimulator
              key={`${node.node_order}-${simIdx}`}
              costDefault={f.how_much_cost_thb}
              priceDefault={f.how_much_selling_thb}
              unitLabel={chain.product.base_unit_reference}
              capital={simOpp?.capital_required_thb}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const StepChain: React.FC<Props> = ({ chain, selectedOppKey, onSelectOpp, onAction }) => {
  const [openNode, setOpenNode] = useState<number | null>(null);
  const p = chain.product;
  const spread = p.total_value_spread;
  const nodes = chain.supply_chain_nodes;

  return (
    <div className="pb-6">
      {/* Sticky Unit Normalization Banner */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#12141a]/95 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-3 py-2.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight truncate">{p.product_name}</h3>
            <p className="text-[10px] text-gray-400 truncate">
              {chain.taxonomy.sector_id} {chain.taxonomy.sector_name} · {chain.taxonomy.sub_category_name}
            </p>
          </div>
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-[#D32F2F] text-[10px] font-black font-mono">
            +{spread.total_markup_percent.toLocaleString('th-TH')}%
          </span>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-[#181a20] p-2 text-[10px] leading-relaxed text-gray-600 dark:text-gray-300">
          <div><b>หน่วยอ้างอิง:</b> {p.base_unit_reference}</div>
          <div className="text-gray-500"><b>แปลงหน่วย:</b> {p.conversion_summary}</div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-[#20232b] text-gray-700 dark:text-gray-200">
            ต้นทุนต้นน้ำ {baht(spread.origin_cost_thb)} บ.
          </span>
          <span className="text-[#E53935]">───▶</span>
          <span className="px-2 py-1 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            มูลค่าปลายน้ำ {baht(spread.final_retail_value_thb)} บ.
          </span>
        </div>
      </div>

      {/* Vertical flowchart */}
      <div className="px-3 pt-3">
        {nodes.map((node, i) => {
          const meta = STAGE_META[node.stage_type];
          const tl = TRAFFIC_META[node.traffic_light];
          const f = node.five_w_two_h;
          const isOpen = openNode === node.node_order;
          const next = nodes[i + 1];
          const isMain = i < 3;
          return (
            <div key={node.node_order}>
              <button
                onClick={() => setOpenNode(isOpen ? null : node.node_order)}
                className={`w-full text-left rounded-2xl border p-3 transition-all ${
                  isOpen
                    ? 'border-[#E53935] shadow-md shadow-red-500/10 bg-white dark:bg-[#181a20]'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] hover:border-gray-400'
                } ${node.stage_type === 'BYPRODUCT_SERVICE' ? 'border-dashed' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-base">
                    {meta.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono font-bold text-gray-400">
                        โหนด {node.node_order} · {meta.label}
                      </span>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-bold ${tl.cls}`}>
                        {tl.emoji} {node.traffic_light}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-extrabold text-gray-900 dark:text-white leading-snug">{node.node_title}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">เทียบเท่า: {node.equivalent_quantity}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-gray-700 dark:text-gray-200">
                        {baht(f.how_much_cost_thb)} <span className="text-gray-400">→</span> {baht(f.how_much_selling_thb)} บ.
                      </span>
                      <span className="text-[9.5px] text-gray-400">
                        {isOpen ? 'ย่อ ▲' : `${node.micro_opportunities.length} จุดแทรกตัว ▼`}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 text-[9.5px] text-gray-400">{tl.label}</p>
              </button>

              {isOpen && (
                <NodeDrawer
                  node={node}
                  chain={chain}
                  selectedOppKey={selectedOppKey}
                  onSelectOpp={onSelectOpp}
                  onAction={onAction}
                />
              )}

              {/* Connector */}
              {next && (
                <div className="flex flex-col items-center py-1">
                  <div className={`w-0.5 h-3 ${isMain ? 'bg-gray-300 dark:bg-gray-700' : 'border-l-2 border-dashed border-gray-300 dark:border-gray-700'}`} />
                  {isMain ? (
                    <div className="flex flex-col items-center gap-1 my-0.5">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                        ⚡ ราคาพุ่งขึ้น +{node.margin_jump_to_next_node_percent}% (จาก {baht(f.how_much_selling_thb)} บ. → {baht(next.five_w_two_h.how_much_selling_thb)} บ.)
                      </span>
                      {node.is_high_margin_bottleneck && (
                        <span className="px-2.5 py-1 rounded-full bg-[#E53935] text-white text-[10px] font-black animate-pulse">
                          🔥 จุดส่วนต่างสูง! ช่องว่างตัดตอนคนกลาง
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full border border-dashed border-gray-300 dark:border-gray-700 text-[9.5px] text-gray-400 my-0.5">
                      ♻️ นอกสายพานหลัก
                    </span>
                  )}
                  <div className={`w-0.5 h-3 ${isMain ? 'bg-gray-300 dark:bg-gray-700' : 'border-l-2 border-dashed border-gray-300 dark:border-gray-700'}`} />
                  <div className={`text-[10px] leading-none ${isMain ? 'text-gray-300 dark:text-gray-600' : 'text-gray-300'}`}>▼</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
