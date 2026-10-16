'use client';

import React, { useMemo, useState } from 'react';
import {
  ProductChain,
  SupplyChainNode,
  MicroOpportunity,
  STAGE_META,
  TRAFFIC_META,
  STRATEGY_META,
} from './types';
import { baht, flattenOpps } from './schema';
import { ActionKind } from './OppCard';
import {
  Briefcase,
  Tags,
  Coins,
  Building,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

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
  onBackToStep1,
  onNavigateStep,
}) => {
  const [selectedNodeDrawer, setSelectedNodeDrawer] = useState<number | null>(null);
  const p = chain.product;
  const spread = p.total_value_spread;
  const nodes = chain.supply_chain_nodes;

  // Flatten & Sort Opportunities
  const flatOpps = useMemo(() => flattenOpps(chain), [chain]);
  const rankedOpps = useMemo(
    () =>
      [...flatOpps].sort(
        (a, b) =>
          b.opp.feasibility_score.total_score -
          a.opp.feasibility_score.total_score
      ),
    [flatOpps]
  );

  // Proportional Stages Ranking
  const maxStageSellingPrice = useMemo(
    () =>
      Math.max(
        1,
        spread.final_retail_value_thb,
        ...nodes.map((n) => n.five_w_two_h.how_much_selling_thb)
      ),
    [nodes, spread.final_retail_value_thb]
  );

  const rankedStages = useMemo(() => {
    return [...nodes].sort(
      (a, b) =>
        b.five_w_two_h.how_much_selling_thb -
        a.five_w_two_h.how_much_selling_thb
    );
  }, [nodes]);

  // Aggregate Skills & Weapons Tags
  const topSkillsTags = useMemo(() => {
    const counts: Record<string, number> = {};
    flatOpps.forEach((f) => {
      const skills = f.opp.required_weapons.skills_needed || '';
      const tools = f.opp.required_weapons.tools_and_equipment || '';
      const permits = f.opp.required_weapons.legal_and_permits || '';

      [...skills.split(/[,/•·]/), ...tools.split(/[,/•·]/), ...permits.split(/[,/•·]/)]
        .map((s) => s.trim())
        .filter((s) => s.length > 2 && s.length < 30)
        .forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [flatOpps]);

  // Capital Distribution Breakdown
  const capitalBreakdown = useMemo(() => {
    let small = 0; // < 10,000
    let medium = 0; // 10,000 - 50,000
    let large = 0; // > 50,000

    flatOpps.forEach((f) => {
      const capStr = f.opp.capital_required_thb.replace(/[^0-9]/g, '');
      const capNum = parseInt(capStr, 10) || 15000;
      if (capNum <= 10000) small++;
      else if (capNum <= 50000) medium++;
      else large++;
    });

    return { small, medium, large, total: flatOpps.length };
  }, [flatOpps]);

  const handleJump = (step: number, oppKey?: string) => {
    if (oppKey) onSelectOpp(oppKey);
    onNavigateStep?.(step, oppKey);
  };

  return (
    <div className="space-y-4 pb-8 font-prompt">
      {/* =================================================================== */}
      {/* 0. หมวดหลัก & หมวดย่อย (Classification & Taxonomy Header Bar)       */}
      {/* =================================================================== */}
      <section className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-150 dark:border-gray-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-brand-red/10 text-brand-red flex items-center justify-center text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                หมวดหลัก {chain.taxonomy.sector_id} • {chain.taxonomy.sector_name}
              </span>
              <h1 className="text-sm font-extrabold text-brand-black dark:text-white leading-tight">
                {chain.taxonomy.sub_category_name} ➔ {p.product_name}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToStep1}
            className="px-2.5 py-1 rounded-xl bg-brand-gray dark:bg-zinc-800 text-[10.5px] font-bold text-gray-600 dark:text-gray-300 hover:text-brand-black"
          >
            ← เปลี่ยนสินค้า
          </button>
        </div>

        {/* Value Spread Bar (ต้นน้ำ -> ปลายน้ำ) */}
        <div className="rounded-2xl bg-brand-gray dark:bg-zinc-800/60 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-gray-500">ต้นทุนต้นน้ำ ฿{baht(spread.origin_cost_thb)}</span>
            <span className="text-brand-red font-extrabold font-mono">
              มูลค่าเพิ่ม +{spread.total_markup_percent.toLocaleString('th-TH')}%
            </span>
            <span className="text-brand-black dark:text-white">
              ขายปลายน้ำ ฿{baht(spread.final_retail_value_thb)}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-gray-400 h-full"
              style={{
                width: `${Math.round(
                  (spread.origin_cost_thb / Math.max(1, spread.final_retail_value_thb)) * 100
                )}%`,
              }}
            />
            <div className="bg-brand-red h-full flex-1" />
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 1. บาร์มิติที่ 1: ช่วงสายพานที่สร้างมูลค่าสูงสุด (VALUE ADDED)        */}
      {/* =================================================================== */}
      <section className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-150 dark:border-gray-800 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-50 dark:bg-brand-red/10 text-brand-red flex items-center justify-center text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              ช่วงสายพานที่สร้างมูลค่าสูงสุด (Value Added by Stage)
            </h2>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Step 2 ผ่าสายพาน</span>
        </div>

        <div className="space-y-3">
          {rankedStages.map((item, idx) => {
            const sell = item.five_w_two_h.how_much_selling_thb;
            const percentage = Math.min(
              100,
              Math.max(8, Math.round((sell / maxStageSellingPrice) * 100))
            );
            const isSelected = selectedNodeDrawer === item.node_order;

            return (
              <div
                key={item.node_order}
                onClick={() =>
                  setSelectedNodeDrawer(isSelected ? null : item.node_order)
                }
                className="space-y-1 cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5 min-w-0">
                    <span className="w-4 text-[10px] font-bold text-gray-400 shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="shrink-0">{STAGE_META[item.stage_type].emoji}</span>
                    <span className="truncate group-hover:text-brand-red transition-colors">
                      {item.node_title}
                    </span>
                    <span className="text-[9.5px] font-normal text-gray-400 hidden sm:inline">
                      ({STAGE_META[item.stage_type].label})
                    </span>
                  </span>
                  <span className="text-brand-red font-mono shrink-0">
                    ฿{baht(sell)}{' '}
                    <span className="text-[10px] text-gray-400 font-normal">
                      ({percentage}%)
                    </span>
                  </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="bg-brand-red h-full rounded-full transition-all duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
                  <span>
                    ส่วนต่างกระโดด: <b className="text-emerald-600">+{item.margin_jump_to_next_node_percent}%</b>
                  </span>
                  <span className="text-brand-red group-hover:underline">
                    {isSelected ? 'ย่อ 5W2H ▲' : 'แตะดู 5W2H & จุดแทรกตัว ▼'}
                  </span>
                </div>

                {/* Collapsible 5W2H detail box on-demand */}
                {isSelected && (
                  <div className="mt-2 p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800/70 border border-gray-150 space-y-1.5 text-[10.5px] text-gray-600 dark:text-gray-300">
                    <div><b>• เจ้าตลาดเดิม:</b> {item.five_w_two_h.who_incumbent}</div>
                    <div><b>• วิธีทำ:</b> {item.five_w_two_h.what_how}</div>
                    <div><b>• จุดอ่อนเจ้าตลาด:</b> <span className="text-brand-red font-bold">{item.five_w_two_h.pain_point}</span></div>
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJump(3, `${item.node_order}-0`);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-brand-black text-white text-[10px] font-bold"
                      >
                        ดู {item.micro_opportunities.length} โมเดลในโหนดนี้ →
                      </button>

                      {item.micro_opportunities[0] && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction('CAPITAL', item.micro_opportunities[0], item);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-brand-red text-white text-[9.5px] font-bold hover:bg-brand-red/90 shadow-2xs"
                            title="ส่งตัวเลขทุนตั้งต้นไปตั้งตารางหุ้นในแท็บทำทุน"
                          >
                            💰 หาทุน
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAction('LOCAL', item.micro_opportunities[0], item);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-blue-600 text-white text-[9.5px] font-bold hover:bg-blue-700 shadow-2xs"
                            title="ปักหมุดโรงงานและคู่ค้าใกล้บ้านในแท็บทำใกล้"
                          >
                            📍 หาคู่ค้า
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. บาร์มิติที่ 2: โมเดลธุรกิจที่น่าลงทุนที่สุด (TOP BUSINESS MODELS) */}
      {/* =================================================================== */}
      <section className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-150 dark:border-gray-800 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-50 dark:bg-brand-red/10 text-brand-red flex items-center justify-center text-xs">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              โมเดลธุรกิจที่น่าลงทุนที่สุด (Top Opportunities)
            </h2>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Step 3 ชี้จุดแทรก</span>
        </div>

        <div className="space-y-3">
          {rankedOpps.slice(0, 5).map((item, idx) => {
            const score = item.opp.feasibility_score.total_score;
            const percentage = Math.min(100, Math.round((score / 20) * 100));

            return (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5 min-w-0">
                    <span className="w-4 text-[10px] font-bold text-gray-400 shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="truncate">{item.opp.model_name}</span>
                  </span>
                  <span className="text-brand-red font-mono shrink-0">
                    {score}/20{' '}
                    <span className="text-[10px] text-gray-400 font-normal">
                      ({percentage}%)
                    </span>
                  </span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="bg-brand-red h-full rounded-full transition-all duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-0.5">
                  <span>
                    ทุนเริ่ม: <b>{item.opp.capital_required_thb} บ.</b> · กำไร{' '}
                    <b className="text-emerald-600">{item.opp.expected_margin_percent}</b>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleJump(4, item.key)}
                      className="text-brand-red font-bold hover:underline"
                    >
                      🧮 คำนวณกำไร
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => handleJump(6, item.key)}
                      className="text-brand-black dark:text-white font-bold hover:underline"
                    >
                      🤝 รวมล็อต
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. บาร์มิติที่ 3: ทักษะเฉพาะทางที่ถูกแท็กสูงสุด (TOP SKILLS)         */}
      {/* =================================================================== */}
      <section className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-150 dark:border-gray-800 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs">
              <Tags className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              ทักษะ & อาวุธที่ถูกแท็กสูงสุด (Top Skills & Weapons)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => handleJump(5)}
            className="text-[10px] text-brand-red font-bold hover:underline"
          >
            Step 5 เช็กอาวุธ →
          </button>
        </div>

        {topSkillsTags.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">ไม่มีข้อมูลการแท็ก</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topSkillsTags.map((sk) => (
              <span
                key={sk.name}
                onClick={() => handleJump(5)}
                className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-xs px-3 py-1.5 rounded-full font-medium hover:border-brand-red cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-check text-[9px] text-brand-red" />
                <span>{sk.name}</span>
                <span className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-100 dark:border-gray-600">
                  {sk.count}
                </span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* =================================================================== */}
      {/* 4. สัดส่วนผลตอบแทน & การรวมล็อต (2-Column Match Image 2)           */}
      {/* =================================================================== */}
      <div className="grid grid-cols-2 gap-3">
        {/* Column 1: สัดส่วนงบลงทุนตั้งต้น */}
        <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-4 border border-gray-150 dark:border-gray-800 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase">
              สัดส่วนงบลงทุน
            </h3>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ทุนจิ๋ว (&lt;10k)</span>
              <span className="font-bold font-mono text-emerald-600">{capitalBreakdown.small}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ทุนกลาง (10-50k)</span>
              <span className="font-bold font-mono text-blue-600">{capitalBreakdown.medium}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ทุนสเกล (&gt;50k)</span>
              <span className="font-bold font-mono text-gray-700 dark:text-gray-300">{capitalBreakdown.large}</span>
            </div>
          </div>
        </div>

        {/* Column 2: การรวมล็อต & ขั้นต่ำ */}
        <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-4 border border-gray-150 dark:border-gray-800 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Building className="w-3.5 h-3.5 text-blue-500" />
            <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase">
              รวมกลุ่ม & สั่งผลิต
            </h3>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">มัดจำ Escrow</span>
              <span className="font-bold font-mono text-brand-red">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">คนหารขั้นต่ำ (MOQ)</span>
              <span className="font-bold font-mono">3-5 คน</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ยิงใบสั่งซื้อ PO</span>
              <span className="font-bold font-mono text-emerald-600">อัตโนมัติ</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 5. แผนผังปฏิบัติการ 12 ขั้นตอน (12-STEP PRODUCTION ROADMAP)          */}
      {/* =================================================================== */}
      <section className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-150 dark:border-gray-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-list-check" />
            </div>
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              แผนผัง 12 ขั้นตอนการทำผลิต (Production Roadmap)
            </h2>
          </div>
          <span className="text-[10px] text-gray-400">คลิกเพื่อข้ามไปแต่ละแท็บ</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { step: 1, title: '01 หาตัวตน', desc: 'เลือกสินค้า', done: true },
            { step: 2, title: '02 ผ่าสายพาน', desc: 'แดชบอร์ดบาร์', active: true },
            { step: 3, title: '03 ชี้จุดแทรก', desc: 'เลือกโมเดลไฟเขียว' },
            { step: 4, title: '04 ลองคำนวณ', desc: 'จำลองกำไร-คืนทุน' },
            { step: 5, title: '05 เช็กอาวุธ', desc: 'เช็กลิสต์ความพร้อม' },
            { step: 6, title: '06 เชื่อมดอท', desc: 'รวมล็อต & ออก PO' },
            { step: 7, title: '07 แผนปฏิบัติการ', desc: 'Action Plan 30-60-90' },
            { step: 8, title: '08 จับคู่ซัพพลาย', desc: 'โรงงาน OEM ใกล้บ้าน' },
            { step: 9, title: '09 ทดสอบตลาด', desc: 'ปล่อย MVP ชิมลาง' },
            { step: 10, title: '10 ตั้งราคาขาย', desc: 'กลยุทธ์ราคา & ช่องทาง' },
            { step: 11, title: '11 ขยายสเกล', desc: 'มาตรฐานส่งออก' },
            { step: 12, title: '12 สรุปผลต่อยอด', desc: 'Executive Dashboard' },
          ].map((st) => (
            <button
              key={st.step}
              type="button"
              onClick={() => handleJump(st.step)}
              className={`p-2.5 rounded-2xl border text-left flex items-center justify-between gap-1.5 transition-all ${
                st.active
                  ? 'border-brand-red bg-red-50/40 dark:bg-red-950/20 shadow-2xs'
                  : 'border-gray-150 hover:border-gray-300 bg-white dark:bg-zinc-800'
              }`}
            >
              <div className="min-w-0">
                <div className={`text-[11px] font-bold ${st.active ? 'text-brand-red' : 'text-gray-800 dark:text-gray-200'}`}>
                  {st.title}
                </div>
                <div className="text-[9.5px] text-gray-400 truncate">{st.desc}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
