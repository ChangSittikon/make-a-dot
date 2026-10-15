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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              ขั้นตอนที่ 05: เช็กอาวุธและความพร้อม
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>🎒</span> เช็กลิสต์ความพร้อมก่อนลงมือปฏิบัติจริง
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              สำรวจอุปกรณ์ ทักษะ และใบอนุญาตที่จำเป็น ติ๊กรายการที่คุณมีอยู่แล้วเพื่อประเมินความพร้อม
            </p>
          </div>

          {/* Progress widget */}
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 min-w-[220px]">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-zinc-600 dark:text-zinc-300">ความพร้อม</span>
                <span className="text-red-600 dark:text-red-400">
                  {checkedCount}/{totalCount} รายการ ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            {checkedCount > 0 && (
              <button
                onClick={resetChecks}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded"
                title="รีเซ็ตการติ๊ก"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Opportunity Picker */}
        <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 block">
            เลือกโมเดลจุดแทรกตัวที่ต้องการเช็กอาวุธ:
          </label>
          <OppPicker
            chain={chain}
            value={activeKey}
            onChange={handleSelectKey}
          />
        </div>
      </div>

      {/* Active Opp Brief Card */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-5 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300 mb-1">
              <span>{strategyMeta.emoji}</span>
              <span>{strategyMeta.label}</span>
              <span>•</span>
              <span>โหนด: {active.node.node_title}</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {active.opp.model_name}
            </h3>
            <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
              {active.opp.how_to_start}
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs">
            <div className="bg-zinc-700/60 px-3 py-1.5 rounded-lg">
              <span className="text-zinc-400 mr-1">ทุนตั้งต้น:</span>
              <span className="font-bold text-amber-400">
                {active.opp.capital_required_thb}
              </span>
            </div>
            <div className="bg-zinc-700/60 px-3 py-1.5 rounded-lg">
              <span className="text-zinc-400 mr-1">กำไรคาดหวัง:</span>
              <span className="font-bold text-emerald-400">
                {active.opp.expected_margin_percent}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Sections (3 Pillars) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pillar 1: Tools & Equipment */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                เครื่องมือและอุปกรณ์
              </h4>
              <p className="text-[11px] text-zinc-500">
                ฮาร์ดแวร์ / เครื่องจักร / ซอฟต์แวร์
              </p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {checklistItems
              .filter((i) => i.category === 'tools')
              .map((item) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <div className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-xs font-semibold ${
                          isChecked
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {item.actionHint}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => onAction?.(active.opp.action_links.go_to_nearby_tab)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>หาซัพพลายเออร์ใกล้คุณ (ทำใกล้)</span>
            </button>
          </div>
        </div>

        {/* Pillar 2: Skills Needed */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                ทักษะและความรู้
              </h4>
              <p className="text-[11px] text-zinc-500">
                สกิลเฉพาะทาง / การบริหารจัดการ
              </p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {checklistItems
              .filter((i) => i.category === 'skills')
              .map((item) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <div className="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-xs font-semibold ${
                          isChecked
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {item.actionHint}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => onAction?.(active.opp.action_links.go_to_capital_tab)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-600" />
              <span>หาทุนอัปสกิล/จัดจ้าง (ทำทุน)</span>
            </button>
          </div>
        </div>

        {/* Pillar 3: Legal & Permits */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                ใบอนุญาตและกฎหมาย
              </h4>
              <p className="text-[11px] text-zinc-500">
                อย. / ทะเบียนพาณิชย์ / มาตรฐาน
              </p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {checklistItems
              .filter((i) => i.category === 'legal')
              .map((item) => {
                const isChecked = !!checkedIds[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <div className="mt-0.5 text-purple-600 dark:text-purple-400 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`text-xs font-semibold ${
                          isChecked
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {item.actionHint}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => onNavigateStep?.(6)}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>หาเพื่อนแชร์ค่า OEM/ใบอนุญาต (เชื่อมดอท)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Next Step Callout */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            ก้าวต่อไป
          </div>
          <h3 className="text-base font-bold">
            ขาดอาวุธชิ้นไหน? ไม่ต้องลงทุนคนเดียว!
          </h3>
          <p className="text-xs text-white/90 mt-0.5">
            ก้าวไปสู่ขั้นตอน "06 เชื่อมดอท" รวมกลุ่มแชร์ล็อตผลิต หารค่าโมลด์ หรือรวมตัวสั่งซื้อขั้นต่ำ (MOQ)
          </p>
        </div>

        <button
          onClick={() => onNavigateStep?.(6)}
          className="px-5 py-2.5 rounded-xl bg-white text-red-600 font-bold text-sm hover:bg-zinc-100 shadow-sm shrink-0 flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          <span>ไปที่ขั้น 06 เชื่อมดอท</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
