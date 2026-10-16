'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  GraduationCap,
  Scale,
  CheckCircle2,
  Circle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  Wallet,
  Users,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ProductChain, FlatOpportunity, STRATEGY_META } from './types';
import { OppPicker } from './OppPicker';

interface StepWeaponsProps {
  chain: ProductChain;
  selectedOppKey?: string;
  onSelectOppKey?: (key: string) => void;
  onAction?: (actionUrl: string) => void;
  onNavigateStep?: (step: number) => void;
}

interface ChecklistItem {
  id: string;
  category: 'tools' | 'skills' | 'legal';
  title: string;
  detail: string;
  actionHint?: string;
}

export function StepWeapons({
  chain,
  selectedOppKey,
  onSelectOppKey,
  onAction,
  onNavigateStep,
}: StepWeaponsProps) {
  // Flatten opportunities
  const opportunities = useMemo<FlatOpportunity[]>(() => {
    const list: FlatOpportunity[] = [];
    chain.supply_chain_nodes.forEach((node) => {
      node.micro_opportunities.forEach((opp, idx) => {
        list.push({
          key: `${node.stage_type}_${idx}`,
          node,
          opp,
        });
      });
    });
    return list;
  }, [chain]);

  const [activeKey, setActiveKey] = useState<string>(
    selectedOppKey && opportunities.some((o) => o.key === selectedOppKey)
      ? selectedOppKey
      : opportunities[0]?.key || ''
  );

  useEffect(() => {
    if (selectedOppKey && opportunities.some((o) => o.key === selectedOppKey)) {
      setActiveKey(selectedOppKey);
    }
  }, [selectedOppKey, opportunities]);

  const active = useMemo(() => {
    return (
      opportunities.find((o) => o.key === activeKey) || opportunities[0] || null
    );
  }, [opportunities, activeKey]);

  const handleSelectKey = (key: string) => {
    setActiveKey(key);
    onSelectOppKey?.(key);
  };

  // Convert raw text into items
  const checklistItems = useMemo<ChecklistItem[]>(() => {
    if (!active) return [];
    const { required_weapons } = active.opp;
    const items: ChecklistItem[] = [];

    // Parse tools
    const tools = (required_weapons.tools_and_equipment || '')
      .split(/[,;\n•]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (tools.length === 0 && required_weapons.tools_and_equipment) {
      tools.push(required_weapons.tools_and_equipment);
    }
    tools.forEach((t, i) => {
      items.push({
        id: `tool_${i}`,
        category: 'tools',
        title: t,
        detail: 'อุปกรณ์สำคัญในการดำเนินงาน',
        actionHint: 'เช็กราคา/จัดหาจากผู้จำหน่าย',
      });
    });

    // Parse skills
    const skills = (required_weapons.skills_needed || '')
      .split(/[,;\n•]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (skills.length === 0 && required_weapons.skills_needed) {
      skills.push(required_weapons.skills_needed);
    }
    skills.forEach((s, i) => {
      items.push({
        id: `skill_${i}`,
        category: 'skills',
        title: s,
        detail: 'ทักษะเชิงลึกหรือใบรับรองที่ต้องมี',
        actionHint: 'ฝึกฝนหรือหาพาร์ตเนอร์ช่วยทำ',
      });
    });

    // Parse legal
    const legals = (required_weapons.legal_and_permits || '')
      .split(/[,;\n•]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (legals.length === 0 && required_weapons.legal_and_permits) {
      legals.push(required_weapons.legal_and_permits);
    }
    legals.forEach((l, i) => {
      items.push({
        id: `legal_${i}`,
        category: 'legal',
        title: l,
        detail: 'ข้อกำหนดทางกฎหมาย มาตรฐานความปลอดภัย หรือใบอนุญาต',
        actionHint: 'ตรวจสอบหน่วยงานกำกับดูแลที่เกี่ยวข้อง',
      });
    });

    return items;
  }, [active]);

  // Persisted checked state per oppKey
  const storageKey = `weapons_checked_${chain.product.product_id}_${active?.key}`;
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      } else {
        setCheckedIds({});
      }
    } catch {
      setCheckedIds({});
    }
  }, [storageKey]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetChecks = () => {
    setCheckedIds({});
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  const totalCount = checklistItems.length;
  const checkedCount = checklistItems.filter((i) => checkedIds[i.id]).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (!active) {
    return (
      <div className="text-center py-12 text-zinc-500">
        ไม่พบจุดแทรกตัวในระบบ
      </div>
    );
  }

  const strategyMeta = STRATEGY_META[active.opp.strategy_type];

  return (
    <div className="space-y-4 pb-8">
      {/* =================================================================== */}
      {/* 1. Header Card: Brand-Black with Breathing Dot & Progress           */}
      {/* =================================================================== */}
      <div className="bg-brand-black text-white rounded-3xl p-4 shadow-md space-y-3.5">
        {/* Title row with Breathing Dot */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-3.5 h-3.5 bg-brand-red rounded-full shrink-0"
              style={{
                animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite',
              }}
            />
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold tracking-tight text-white leading-tight">
                ขั้นตอนที่ 05: เช็กอาวุธและความพร้อม
              </h2>
              <p className="text-[10.5px] text-gray-300 mt-0.5 leading-snug">
                สำรวจอุปกรณ์ ทักษะ และใบอนุญาต ติ๊กรายการที่คุณมีเพื่อประเมินความพร้อม
              </p>
            </div>
          </div>
        </div>

        {/* Full-Width Mobile-Friendly Progress Bar */}
        <div className="rounded-2xl bg-white/10 border border-white/10 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-300">ความพร้อมของคุณ</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-mono">
                {checkedCount}/{totalCount} รายการ ({progressPercent}%)
              </span>
              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={resetChecks}
                  className="text-gray-400 hover:text-white p-0.5 rounded transition-colors"
                  title="รีเซ็ตการติ๊ก"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-red to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Opportunity Picker inside Brand Card */}
        <div className="pt-1 border-t border-white/10 space-y-1.5">
          <label className="text-[11px] font-bold text-gray-300 block">
            เลือกโมเดลจุดแทรกตัวที่ต้องการเช็กอาวุธ:
          </label>
          <div className="bg-white/5 rounded-2xl p-1">
            <OppPicker
              chain={chain}
              value={activeKey}
              onChange={handleSelectKey}
            />
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. Active Opp Brief Card (Mobile Friendly, No Overflow)            */}
      {/* =================================================================== */}
      <div className="bg-brand-gray dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-[10.5px] font-bold text-brand-red">
          <span>{strategyMeta.emoji}</span>
          <span>{strategyMeta.label}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 dark:text-gray-400 truncate">
            โหนด: {active.node.node_title}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-extrabold text-brand-black dark:text-white leading-snug">
            {active.opp.model_name}
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 leading-relaxed">
            {active.opp.how_to_start}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700">
            <div className="text-[10px] text-gray-500">ทุนตั้งต้น</div>
            <div className="font-extrabold text-brand-black dark:text-white font-mono text-xs mt-0.5">
              {active.opp.capital_required_thb}
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700">
            <div className="text-[10px] text-gray-500">กำไรคาดหวัง</div>
            <div className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-xs mt-0.5">
              {active.opp.expected_margin_percent}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. Checklist Sections: 3 Pillars (Stacked Vertically for Mobile)    */}
      {/* =================================================================== */}
      <div className="space-y-3.5">
        {/* Pillar 1: Tools & Equipment */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-extrabold text-brand-black dark:text-white">
                1. เครื่องมือและอุปกรณ์
              </h4>
              <p className="text-[10.5px] text-gray-500 truncate">
                ฮาร์ดแวร์ / เครื่องจักร / ซอฟต์แวร์
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {checklistItems
              .filter((i) => i.category === 'tools')
              .map((item) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                        : 'bg-brand-gray dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-bold leading-snug ${
                          isChecked
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-brand-black dark:text-white'
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.actionHint && (
                        <div className="text-[10.5px] text-gray-500 mt-0.5 leading-snug">
                          {item.actionHint}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>

          <button
            type="button"
            onClick={() => onAction?.(active.opp.action_links.go_to_nearby_tab)}
            className="w-full py-2 px-3 text-xs font-bold rounded-2xl bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>หาซัพพลายเออร์ใกล้คุณ (ทำใกล้)</span>
          </button>
        </div>

        {/* Pillar 2: Skills Needed */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-extrabold text-brand-black dark:text-white">
                2. ทักษะและความรู้
              </h4>
              <p className="text-[10.5px] text-gray-500 truncate">
                สกิลเฉพาะทาง / การบริหารจัดการ
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {checklistItems
              .filter((i) => i.category === 'skills')
              .map((item) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                        : 'bg-brand-gray dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-bold leading-snug ${
                          isChecked
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-brand-black dark:text-white'
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.actionHint && (
                        <div className="text-[10.5px] text-gray-500 mt-0.5 leading-snug">
                          {item.actionHint}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>

          <button
            type="button"
            onClick={() => onAction?.(active.opp.action_links.go_to_capital_tab)}
            className="w-full py-2 px-3 text-xs font-bold rounded-2xl bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-600" />
            <span>หาทุนอัปสกิล / จัดจ้าง (ทำทุน)</span>
          </button>
        </div>

        {/* Pillar 3: Legal & Permits */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-100 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-extrabold text-brand-black dark:text-white">
                3. ใบอนุญาตและมาตรฐาน
              </h4>
              <p className="text-[10.5px] text-gray-500 truncate">
                อย. / ทะเบียนพาณิชย์ / มอก.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {checklistItems
              .filter((i) => i.category === 'legal')
              .map((item) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                      isChecked
                        ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60'
                        : 'bg-brand-gray dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-bold leading-snug ${
                          isChecked
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-brand-black dark:text-white'
                        }`}
                      >
                        {item.title}
                      </div>
                      {item.actionHint && (
                        <div className="text-[10.5px] text-gray-500 mt-0.5 leading-snug">
                          {item.actionHint}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>

          <button
            type="button"
            onClick={() => onNavigateStep?.(6)}
            className="w-full py-2 px-3 text-xs font-bold rounded-2xl bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white hover:bg-gray-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>หาเพื่อนแชร์ค่า OEM/ใบอนุญาต (เชื่อมดอท)</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. Next Step Callout: ไปขั้นตอน 06 เชื่อมดอท                         */}
      {/* =================================================================== */}
      <div className="rounded-3xl bg-brand-red text-white p-4 shadow-sm space-y-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>ก้าวต่อไปสู่ความสำเร็จ</span>
          </div>
          <h3 className="text-sm font-extrabold leading-snug">
            ขาดอาวุธชิ้นไหน? ไม่ต้องลงทุนคนเดียว!
          </h3>
          <p className="text-[11px] text-white/90 mt-1 leading-relaxed">
            ก้าวไปสู่ขั้นตอน &ldquo;06 เชื่อมดอท&rdquo; เพื่อรวมกลุ่มแชร์ล็อตผลิต หารค่าโมลด์ หรือทะลวงจำนวนสั่งซื้อขั้นต่ำ (MOQ)
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateStep?.(6)}
          className="w-full py-2.5 px-4 rounded-2xl bg-white text-brand-red font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
        >
          <span>ไปที่ขั้น 06 เชื่อมดอท</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
