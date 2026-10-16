'use client';

import React, { useState, useMemo } from 'react';
import {
  ProductChain,
  SupplyChainNode,
  MicroOpportunity,
  STAGE_META,
  TRAFFIC_META,
  STRATEGY_META,
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
  onBackToStep1?: () => void;
  onNavigateStep?: (step: number, oppKey?: string) => void;
}

export const StepChain: React.FC<Props> = ({
  chain,
  selectedOppKey,
  onSelectOpp,
  onAction,
  onNavigateStep,
}) => {
  // All nodes collapsed by default! User sees visual final results first.
  const [inspectNodeOrder, setInspectNodeOrder] = useState<number | null>(null);
  const [inspectMode, setInspectMode] = useState<'OPPS' | '5W2H'>('OPPS');
  const [showUnitInfo, setShowUnitInfo] = useState(false);

  const p = chain.product;
  const spread = p.total_value_spread;
  const nodes = chain.supply_chain_nodes;

  // Find #1 Best Opportunity & Biggest Price Jump Node
  const flatOpps = useMemo(() => flattenOpps(chain), [chain]);
  const sortedOpps = useMemo(
    () =>
      [...flatOpps].sort(
        (a, b) =>
          b.opp.feasibility_score.total_score -
          a.opp.feasibility_score.total_score
      ),
    [flatOpps]
  );

  const bestEntry = sortedOpps[0] || flatOpps[0];
  const top3Entries = sortedOpps.slice(0, 3);

  const biggestJumpNode = useMemo(() => {
    const mainNodes = nodes.filter((n) => n.node_order <= 3);
    return (
      [...mainNodes].sort(
        (a, b) =>
          b.margin_jump_to_next_node_percent -
          a.margin_jump_to_next_node_percent
      )[0] || nodes[0]
    );
  }, [nodes]);

  // Max price across nodes for proportional visual bar chart
  const maxSellingPrice = useMemo(() => {
    return Math.max(
      1,
      spread.final_retail_value_thb,
      ...nodes.map((n) => n.five_w_two_h.how_much_selling_thb)
    );
  }, [nodes, spread.final_retail_value_thb]);

  const handleJumpToStep = (step: number, oppKey?: string) => {
    if (oppKey) {
      onSelectOpp(oppKey);
    }
    if (onNavigateStep) {
      onNavigateStep(step, oppKey);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* =================================================================== */}
      {/* 1. FINAL VERDICT HERO: ฟันธงผลลัพธ์ไฟนอลทันทีที่เลือกสินค้า          */}
      {/* =================================================================== */}
      <div className="rounded-3xl bg-brand-black text-white p-4 shadow-md space-y-3.5">
        {/* Top Row: Breathing Red Dot + Product Final Spread */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-3.5 h-3.5 bg-brand-red rounded-full shrink-0"
              style={{
                animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite',
              }}
            />
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-brand-red uppercase tracking-wider">
                สรุปผลลัพธ์ไฟนอล • จุดทำเงินที่ดีที่สุด
              </div>
              <h2 className="text-sm font-extrabold text-white truncate">
                {p.product_name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowUnitInfo(!showUnitInfo)}
            className="shrink-0 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-bold text-gray-200 transition-colors"
          >
            {showUnitInfo ? 'ซ่อนหน่วยนับ ▲' : 'ℹ️ หน่วยอ้างอิง'}
          </button>
        </div>

        {/* Optional Collapsible Unit Info (Hidden by default!) */}
        {showUnitInfo && (
          <div className="rounded-2xl bg-white/10 border border-white/10 p-3 text-[10.5px] text-gray-200 space-y-1">
            <div>
              <b className="text-white">หน่วยอ้างอิง:</b> {p.base_unit_reference}
            </div>
            <div>
              <b className="text-white">การแปรรูป:</b> {p.conversion_summary}
            </div>
          </div>
        )}

        {/* Visual Price Transformation Ladder (Origin -> Final Retail) */}
        <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
          <div className="flex items-center justify-between text-[10px] text-gray-300 mb-1.5">
            <span>🌱 ต้นทุนหน้าสวน/โรงงาน</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-red text-white font-black font-mono">
              มูลค่าพุ่ง +{spread.total_markup_percent.toLocaleString('th-TH')}%
            </span>
            <span>🏪 ราคาขายถึงมือผู้บริโภค</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-base font-extrabold font-mono text-gray-200">
              ฿{baht(spread.origin_cost_thb)}
            </div>
            <div className="flex-1 h-2.5 rounded-full bg-white/15 overflow-hidden flex items-center p-0.5">
              <div className="h-full w-1/4 bg-gray-400 rounded-l-full" />
              <div className="h-full flex-1 bg-gradient-to-r from-brand-red to-emerald-400 rounded-r-full" />
            </div>
            <div className="text-lg font-black font-mono text-emerald-400">
              ฿{baht(spread.final_retail_value_thb)}
            </div>
          </div>
        </div>

        {/* #1 Best Entry Point Spotlight */}
        {bestEntry && (
          <div className="rounded-2xl bg-white text-brand-black p-3.5 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-brand-red text-[10px] font-extrabold border border-red-200">
                  🏆 ฟันธงจุดน่าทำอันดับ 1 ({STAGE_META[bestEntry.node.stage_type].label})
                </span>
                <h3 className="text-xs font-extrabold text-brand-black mt-1.5 leading-snug">
                  {bestEntry.opp.model_name}
                </h3>
              </div>
              <div className="shrink-0 rounded-2xl bg-brand-black text-white px-2.5 py-1 text-center">
                <div className="text-xs font-black font-mono">
                  {bestEntry.opp.feasibility_score.total_score}/20
                </div>
                <div className="text-[8px] text-gray-300">คะแนนคุ้มค่า</div>
              </div>
            </div>

            {/* 3 Visual Result Numbers */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200/70 p-2">
                <div className="text-[9px] text-emerald-700 font-bold">
                  กำไรคาดหวัง
                </div>
                <div className="text-xs font-extrabold font-mono text-emerald-700 mt-0.5">
                  {bestEntry.opp.expected_margin_percent}
                </div>
              </div>

              <div className="rounded-xl bg-brand-gray p-2">
                <div className="text-[9px] text-gray-500 font-bold">
                  งบเริ่มต้น
                </div>
                <div className="text-[11px] font-extrabold font-mono text-brand-black mt-0.5 truncate">
                  {bestEntry.opp.capital_required_thb} บ.
                </div>
              </div>

              <div className="rounded-xl bg-red-50 border border-red-200/60 p-2">
                <div className="text-[9px] text-brand-red font-bold">
                  จุดราคากระโดด
                </div>
                <div className="text-xs font-extrabold font-mono text-brand-red mt-0.5">
                  +{biggestJumpNode.margin_jump_to_next_node_percent}%
                </div>
              </div>
            </div>

            {/* Direct Pointers to Other Steps & Tabs */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleJumpToStep(4, bestEntry.key)}
                className="py-2 px-3 rounded-xl bg-brand-red hover:opacity-95 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
              >
                <span>🧮 ลองคำนวณกำไร</span>
              </button>
              <button
                type="button"
                onClick={() => handleJumpToStep(6, bestEntry.key)}
                className="py-2 px-3 rounded-xl bg-brand-black hover:opacity-90 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-transform"
              >
                <span>🤝 รวมล็อตสั่งผลิต</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onAction('CAPITAL', bestEntry.opp, bestEntry.node)
                }
                className="py-1.5 px-2 rounded-xl bg-brand-gray hover:bg-gray-200 text-brand-black text-[10px] font-bold text-center transition-colors"
              >
                💰 หาทุน
              </button>
              <button
                type="button"
                onClick={() => onAction('LOCAL', bestEntry.opp, bestEntry.node)}
                className="py-1.5 px-2 rounded-xl bg-brand-gray hover:bg-gray-200 text-brand-black text-[10px] font-bold text-center transition-colors"
              >
                📍 หาคู่ค้า
              </button>
              <button
                type="button"
                onClick={() => handleJumpToStep(5, bestEntry.key)}
                className="py-1.5 px-2 rounded-xl bg-brand-gray hover:bg-gray-200 text-brand-black text-[10px] font-bold text-center transition-colors"
              >
                🎒 เช็กอาวุธ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 2. VISUAL PRICE JUMP CHART: ผังกราฟแท่งเปรียบเทียบราคา 5 โหนด        */}
      {/* =================================================================== */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-extrabold text-brand-black dark:text-white flex items-center gap-1.5">
              <span>📊</span>
              <span>ผังส่วนต่างราคา ต้นน้ำ → ปลายน้ำ (เห็นภาพใน 3 วินาที)</span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              แตะที่โหนดเพื่อดูช่องทางทำเงิน หรือกดดูคำอธิบายเพิ่มเติมเฉพาะจุดที่สนใจ
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {nodes.map((node) => {
            const meta = STAGE_META[node.stage_type];
            const tl = TRAFFIC_META[node.traffic_light];
            const f = node.five_w_two_h;
            const cost = f.how_much_cost_thb;
            const sell = f.how_much_selling_thb;
            const profitPerUnit = Math.max(0, sell - cost);
            const marginPct =
              cost > 0 ? Math.round((profitPerUnit / cost) * 100) : 0;

            const totalBarWidthPct = Math.min(
              100,
              Math.max(22, Math.round((sell / maxSellingPrice) * 100))
            );
            const costRatioPct =
              sell > 0 ? Math.min(85, Math.round((cost / sell) * 100)) : 50;

            const isInspected = inspectNodeOrder === node.node_order;
            const isBottleneck = node.is_high_margin_bottleneck;

            return (
              <div
                key={node.node_order}
                className={`rounded-2xl border p-3 transition-all space-y-2 ${
                  isInspected
                    ? 'border-brand-red bg-red-50/20 dark:bg-red-950/15 shadow-xs'
                    : isBottleneck
                    ? 'border-red-200 bg-brand-gray/50 dark:bg-zinc-800/50'
                    : 'border-gray-150 dark:border-zinc-800 bg-brand-gray/40 dark:bg-zinc-800/30'
                }`}
              >
                {/* Compact Visual Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-brand-black text-white flex items-center justify-center text-sm shrink-0">
                      {meta.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] font-bold text-gray-500">
                          โหนด {node.node_order} ({meta.label})
                        </span>
                        {isBottleneck && (
                          <span className="px-1.5 py-0.2 rounded-full bg-brand-red text-white text-[8.5px] font-bold">
                            🔥 ส่วนต่างสูงสุด
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-extrabold text-brand-black dark:text-white truncate">
                        {node.node_title}
                      </h4>
                    </div>
                  </div>

                  {/* Traffic Light Badge */}
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full border text-[9.5px] font-bold ${tl.cls}`}
                  >
                    {tl.emoji}{' '}
                    {node.traffic_light === 'GREEN'
                      ? 'น่าลุย'
                      : node.traffic_light === 'YELLOW'
                      ? 'รวมกลุ่ม'
                      : 'ทุนสูง'}
                  </span>
                </div>

                {/* Visual Price & Profit Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-gray-600 dark:text-gray-300">
                      ทุน <b>฿{baht(cost)}</b> → ขาย{' '}
                      <b className="text-brand-black dark:text-white">
                        ฿{baht(sell)}
                      </b>
                    </span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      ส่วนต่าง +฿{baht(profitPerUnit)} (+{marginPct}%)
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-200/80 dark:bg-zinc-700 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full overflow-hidden flex transition-all duration-500"
                      style={{ width: `${totalBarWidthPct}%` }}
                    >
                      <div
                        className="h-full bg-gray-500"
                        style={{ width: `${costRatioPct}%` }}
                        title={`ต้นทุน ฿${baht(cost)}`}
                      />
                      <div
                        className="h-full flex-1 bg-brand-red"
                        title={`ส่วนต่างกำไร +฿${baht(profitPerUnit)}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Compact On-Demand Pointers (Only open when clicked!) */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (isInspected && inspectMode === 'OPPS') {
                          setInspectNodeOrder(null);
                        } else {
                          setInspectNodeOrder(node.node_order);
                          setInspectMode('OPPS');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-colors ${
                        isInspected && inspectMode === 'OPPS'
                          ? 'bg-brand-red text-white'
                          : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-brand-black dark:text-white'
                      }`}
                    >
                      🎯 ช่องทางทำเงิน ({node.micro_opportunities.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (isInspected && inspectMode === '5W2H') {
                          setInspectNodeOrder(null);
                        } else {
                          setInspectNodeOrder(node.node_order);
                          setInspectMode('5W2H');
                        }
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-colors ${
                        isInspected && inspectMode === '5W2H'
                          ? 'bg-brand-black text-white'
                          : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      ℹ️ คำอธิบาย 5W2H
                    </button>
                  </div>

                  {/* Quick Cross-Tab Action */}
                  {node.micro_opportunities[0] && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          onAction('CAPITAL', node.micro_opportunities[0], node)
                        }
                        className="px-2 py-1 rounded-xl bg-brand-black text-white text-[9.5px] font-bold"
                        title="ส่งไปตั้งตารางหุ้นในแท็บ ทำทุน"
                      >
                        💰 หาทุน
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onAction('LOCAL', node.micro_opportunities[0], node)
                        }
                        className="px-2 py-1 rounded-xl bg-blue-600 text-white text-[9.5px] font-bold"
                        title="ปักหมุดโรงงานในแท็บ ทำใกล้"
                      >
                        📍 คู่ค้า
                      </button>
                    </div>
                  )}
                </div>

                {/* On-Demand Drawer Content (Hidden unless user asks for it!) */}
                {isInspected && (
                  <div className="pt-2 border-t border-gray-200/80 dark:border-zinc-700 space-y-2.5 animate-fadeIn">
                    {inspectMode === 'OPPS' ? (
                      <div className="space-y-2.5">
                        {node.micro_opportunities.map((opp, idx) => {
                          const key = `${node.node_order}-${idx}`;
                          return (
                            <OppCard
                              key={key}
                              opp={opp}
                              node={node}
                              selected={selectedOppKey === key}
                              onSelect={() => handleJumpToStep(4, key)}
                              onAction={(k, o) => {
                                if (k === 'SIMULATE') handleJumpToStep(4, key);
                                else if (k === 'WEAPONS')
                                  handleJumpToStep(5, key);
                                else onAction(k, o, node);
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-3 space-y-2 text-[10.5px]">
                        <div className="flex items-center justify-between font-bold text-brand-black dark:text-white border-b border-gray-100 pb-1.5">
                          <span>🔍 ข้อมูลเชิงลึก 5W2H ของโหนดที่ {node.node_order}</span>
                          <button
                            type="button"
                            onClick={() => setInspectNodeOrder(null)}
                            className="text-gray-400 hover:text-brand-black"
                          >
                            ✕ ปิด
                          </button>
                        </div>
                        <div className="space-y-1.5 text-gray-600 dark:text-gray-300 leading-relaxed">
                          <div>
                            <b className="text-brand-black dark:text-white">
                              • เจ้าตลาดเดิม:
                            </b>{' '}
                            {f.who_incumbent}
                          </div>
                          <div>
                            <b className="text-brand-black dark:text-white">
                              • วิธีทำ:
                            </b>{' '}
                            {f.what_how}
                          </div>
                          <div>
                            <b className="text-brand-black dark:text-white">
                              • สถานที่:
                            </b>{' '}
                            {f.where}
                          </div>
                          <div>
                            <b className="text-brand-black dark:text-white">
                              • รอบเวลา:
                            </b>{' '}
                            ทำจริง {f.when_cycle_time} (รอคอย {f.when_wait_time})
                          </div>
                          <div className="p-2 rounded-xl bg-red-50/70 text-brand-red font-medium">
                            <b>⚡ จุดอ่อนเจ้าตลาด (โอกาสของเรา):</b> {f.pain_point}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. TOP 3 SHORTCUTS: 3 โมเดลทำเงินที่น่าสนใจที่สุดของสินค้านี้           */}
      {/* =================================================================== */}
      <div className="rounded-3xl bg-brand-gray dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-brand-black dark:text-white">
              ✨ 3 อันดับช่องทางทำเงินที่น่าเริ่มที่สุด
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              คัดจากคะแนนความง่าย ทุนต่ำ และกำไรดี — กดไปลองคำนวณหรือรวมกลุ่มได้เลย
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleJumpToStep(3)}
            className="text-[10.5px] font-bold text-brand-red underline shrink-0"
          >
            ดูทั้งหมด →
          </button>
        </div>

        <div className="space-y-2.5">
          {top3Entries.map((entry, idx) => {
            const sm = STRATEGY_META[entry.opp.strategy_type];
            return (
              <div
                key={entry.key}
                className="rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200/80 dark:border-zinc-700 p-3 flex flex-col gap-2.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-brand-red text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[9.5px] font-bold text-gray-500 truncate">
                        {sm.emoji} {sm.label} • โหนด {entry.node.node_order}
                      </div>
                      <h4 className="text-xs font-extrabold text-brand-black dark:text-white leading-snug">
                        {entry.opp.model_name}
                      </h4>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold font-mono">
                    กำไร {entry.opp.expected_margin_percent}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 dark:border-zinc-700/70">
                  <span className="text-[10.5px] text-gray-500">
                    ทุนเริ่ม:{' '}
                    <b className="text-brand-black dark:text-white font-mono">
                      {entry.opp.capital_required_thb} บ.
                    </b>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleJumpToStep(4, entry.key)}
                      className="px-2.5 py-1 rounded-xl bg-brand-red text-white text-[10px] font-bold"
                    >
                      🧮 คำนวณกำไร
                    </button>
                    <button
                      type="button"
                      onClick={() => handleJumpToStep(6, entry.key)}
                      className="px-2.5 py-1 rounded-xl bg-brand-black text-white text-[10px] font-bold"
                    >
                      🤝 รวมล็อต
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
