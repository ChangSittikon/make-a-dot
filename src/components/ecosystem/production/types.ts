/**
 * โครงสร้างข้อมูลมาตรฐานเดียวกัน ใช้ทั้งใน Seed Data, AI Generator (Gemini)
 * และ Archetype Fallback Generator — ห้ามแยก schema
 */

export type StageType =
  | 'UPSTREAM'
  | 'MIDSTREAM_EARLY'
  | 'MIDSTREAM_LATE'
  | 'DOWNSTREAM'
  | 'BYPRODUCT_SERVICE';

export type StrategyType =
  | 'DISINTERMEDIATION'
  | 'UNBUNDLING'
  | 'AGGREGATION_OEM'
  | 'MICRO_VALUE_ADD';

export type TrafficLight = 'GREEN' | 'YELLOW' | 'RED';

export interface FeasibilityScore {
  low_capital: number;
  profit_margin: number;
  ease_of_entry: number;
  aggregability: number;
  total_score: number;
}

export interface RequiredWeapons {
  tools_and_equipment: string;
  skills_needed: string;
  legal_and_permits: string;
}

export interface ActionLinks {
  go_to_capital_tab: string;
  go_to_nearby_tab: string;
  go_to_connect_tab: string;
}

export interface MicroOpportunity {
  strategy_type: StrategyType;
  model_name: string;
  how_to_start: string;
  capital_required_thb: string;
  expected_margin_percent: string;
  target_persona_tags: string[];
  feasibility_score: FeasibilityScore;
  required_weapons: RequiredWeapons;
  action_links: ActionLinks;
}

export interface FiveWTwoH {
  what_how: string;
  who_incumbent: string;
  where: string;
  when_cycle_time: string;
  when_wait_time: string;
  how_much_cost_thb: number;
  how_much_selling_thb: number;
  pain_point: string;
}

export interface SupplyChainNode {
  node_order: number;
  stage_type: StageType;
  node_title: string;
  equivalent_quantity: string;
  five_w_two_h: FiveWTwoH;
  margin_jump_to_next_node_percent: number;
  is_high_margin_bottleneck: boolean;
  traffic_light: TrafficLight;
  micro_opportunities: MicroOpportunity[];
}

export interface ChainTaxonomy {
  sector_id: string;
  sector_name: string;
  sub_category_name: string;
  archetype_name: string;
}

export interface ChainProductInfo {
  product_id: string;
  product_name: string;
  search_keywords: string[];
  base_unit_reference: string;
  conversion_summary: string;
  total_value_spread: {
    origin_cost_thb: number;
    final_retail_value_thb: number;
    total_markup_percent: number;
  };
}

export interface ProductChain {
  taxonomy: ChainTaxonomy;
  product: ChainProductInfo;
  supply_chain_nodes: SupplyChainNode[];
}

export type ChainSource = 'SEED' | 'GEMINI' | 'FALLBACK' | 'CACHE';

export interface FlatOpportunity {
  key: string;
  node: SupplyChainNode;
  opp: MicroOpportunity;
}

export const STAGE_ORDER: StageType[] = [
  'UPSTREAM',
  'MIDSTREAM_EARLY',
  'MIDSTREAM_LATE',
  'DOWNSTREAM',
  'BYPRODUCT_SERVICE',
];

export const STAGE_META: Record<StageType, { emoji: string; label: string }> = {
  UPSTREAM: { emoji: '🌱', label: 'ต้นน้ำ' },
  MIDSTREAM_EARLY: { emoji: '⚙️', label: 'กลางน้ำขั้นต้น' },
  MIDSTREAM_LATE: { emoji: '🔥', label: 'กลางน้ำขั้นปลาย' },
  DOWNSTREAM: { emoji: '🥤', label: 'ปลายน้ำ' },
  BYPRODUCT_SERVICE: { emoji: '♻️', label: 'นอกสายพานหลัก' },
};

export const STRATEGY_META: Record<StrategyType, { emoji: string; label: string }> = {
  DISINTERMEDIATION: { emoji: '✂️', label: 'ตัดตอนคนกลาง' },
  UNBUNDLING: { emoji: '🧩', label: 'แยกส่วนรับเหมาช่วง' },
  AGGREGATION_OEM: { emoji: '🤝', label: 'รวมพลัง/OEM' },
  MICRO_VALUE_ADD: { emoji: '✨', label: 'ต่อยอดเพิ่มมูลค่า' },
};

export const TRAFFIC_META: Record<
  TrafficLight,
  { emoji: string; label: string; cls: string }
> = {
  GREEN: {
    emoji: '🟢',
    label: 'เข้าง่าย ทุนต่ำ เริ่มได้ทันที',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
  },
  YELLOW: {
    emoji: '🟡',
    label: 'ต้องมีทักษะเฉพาะ/รวมกลุ่มกันทำ',
    cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
  },
  RED: {
    emoji: '🔴',
    label: 'ทุนสูง หรือติดกฎหมาย/ใบอนุญาตเข้ม',
    cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
  },
};
