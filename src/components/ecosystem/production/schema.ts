import {
  ProductChain,
  SupplyChainNode,
  MicroOpportunity,
  StageType,
  StrategyType,
  TrafficLight,
  STAGE_ORDER,
} from './types';

/* ---------- helpers ---------- */
export const hashStr = (s: string): number => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
};

export const normalizeName = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, '');

export const parseRange = (s: string): [number, number] => {
  const nums = (s.match(/[\d,]+(\.\d+)?/g) || [])
    .map((x) => parseFloat(x.replace(/,/g, '')))
    .filter((x) => isFinite(x));
  if (nums.length === 0) return [0, 0];
  if (nums.length === 1) return [nums[0], nums[0]];
  return [Math.min(nums[0], nums[1]), Math.max(nums[0], nums[1])];
};

const num = (v: unknown, d = 0): number => {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/,/g, ''));
    if (isFinite(n)) return n;
  }
  return d;
};
const str = (v: unknown, d = ''): string => (typeof v === 'string' && v.trim() ? v : d);
const score = (v: unknown): number => Math.min(5, Math.max(1, Math.round(num(v, 3))));
const STRATS: StrategyType[] = ['DISINTERMEDIATION', 'UNBUNDLING', 'AGGREGATION_OEM', 'MICRO_VALUE_ADD'];
const LIGHTS: TrafficLight[] = ['GREEN', 'YELLOW', 'RED'];

type Obj = Record<string, unknown>;
const asObj = (v: unknown): Obj => (v && typeof v === 'object' ? (v as Obj) : {});

export function makeOpp(raw: unknown, fallbackName: string): MicroOpportunity {
  const o = asObj(raw);
  const fs = asObj(o.feasibility_score);
  const rw = asObj(o.required_weapons);
  const al = asObj(o.action_links);
  const low = score(fs.low_capital);
  const pm = score(fs.profit_margin);
  const ee = score(fs.ease_of_entry);
  const ag = score(fs.aggregability);
  const strat = STRATS.includes(o.strategy_type as StrategyType)
    ? (o.strategy_type as StrategyType)
    : 'MICRO_VALUE_ADD';
  return {
    strategy_type: strat,
    model_name: str(o.model_name, fallbackName),
    how_to_start: str(o.how_to_start, 'เริ่มจากทดลองในปริมาณน้อยและเก็บข้อมูลลูกค้า'),
    capital_required_thb: str(String(o.capital_required_thb ?? ''), '1,000 - 10,000'),
    expected_margin_percent: str(String(o.expected_margin_percent ?? ''), '20 - 40%'),
    target_persona_tags: Array.isArray(o.target_persona_tags)
      ? (o.target_persona_tags as unknown[]).filter((t): t is string => typeof t === 'string')
      : [],
    feasibility_score: {
      low_capital: low,
      profit_margin: pm,
      ease_of_entry: ee,
      aggregability: ag,
      total_score: low + pm + ee + ag,
    },
    required_weapons: {
      tools_and_equipment: str(rw.tools_and_equipment, 'โทรศัพท์มือถือและอุปกรณ์พื้นฐาน'),
      skills_needed: str(rw.skills_needed, 'การสื่อสารและการเจรจา'),
      legal_and_permits: str(rw.legal_and_permits, 'ตรวจสอบใบอนุญาตตามประเภทสินค้า'),
    },
    action_links: {
      go_to_capital_tab: str(al.go_to_capital_tab, 'วางแผนทุนสำหรับโมเดลนี้'),
      go_to_nearby_tab: str(al.go_to_nearby_tab, 'หาซัพพลายเออร์และลูกค้าใกล้คุณ'),
      go_to_connect_tab: str(al.go_to_connect_tab, 'ตั้งห้องรวมกลุ่มกับคนที่สนใจ'),
    },
  };
}

/**
 * Normalize + คำนวณค่าที่ derive ได้ (ส่วนต่างราคา, คอขวด, คะแนนรวม, total spread)
 * ใช้กับทั้ง Seed / Gemini / Fallback เพื่อให้ตัวเลขสอดคล้องกันเสมอ
 * คืน null หากโครงสร้างไม่ครบ 5 โหนด
 */
export function normalizeChain(raw: unknown): ProductChain | null {
  try {
    const r = asObj(raw);
    const tx = asObj(r.taxonomy);
    const pr = asObj(r.product);
    const rawNodes = Array.isArray(r.supply_chain_nodes) ? (r.supply_chain_nodes as unknown[]) : [];
    if (rawNodes.length < 5) return null;

    const sorted = [...rawNodes]
      .map(asObj)
      .sort((a, b) => num(a.node_order, 0) - num(b.node_order, 0))
      .slice(0, 5);

    const nodes: SupplyChainNode[] = sorted.map((n, i) => {
      const f = asObj(n.five_w_two_h);
      const opps = Array.isArray(n.micro_opportunities) ? (n.micro_opportunities as unknown[]) : [];
      const stage: StageType = STAGE_ORDER[i];
      return {
        node_order: i + 1,
        stage_type: stage,
        node_title: str(n.node_title, `ขั้นตอนที่ ${i + 1}`),
        equivalent_quantity: str(n.equivalent_quantity, '-'),
        five_w_two_h: {
          what_how: str(f.what_how, '-'),
          who_incumbent: str(f.who_incumbent, '-'),
          where: str(f.where, '-'),
          when_cycle_time: str(f.when_cycle_time, '-'),
          when_wait_time: str(f.when_wait_time, '-'),
          how_much_cost_thb: Math.max(0, Math.round(num(f.how_much_cost_thb, 0))),
          how_much_selling_thb: Math.max(0, Math.round(num(f.how_much_selling_thb, 0))),
          pain_point: str(f.pain_point, '-'),
        },
        margin_jump_to_next_node_percent: 0,
        is_high_margin_bottleneck: false,
        traffic_light: LIGHTS.includes(n.traffic_light as TrafficLight)
          ? (n.traffic_light as TrafficLight)
          : 'YELLOW',
        micro_opportunities: opps.map((o, k) => makeOpp(o, `โมเดลที่ ${k + 1}`)),
      };
    });

    if (nodes.some((n) => n.micro_opportunities.length === 0)) return null;

    // derive jumps (โหนด 1->2, 2->3, 3->4)
    for (let i = 0; i < 3; i++) {
      const cur = nodes[i].five_w_two_h.how_much_selling_thb;
      const nxt = nodes[i + 1].five_w_two_h.how_much_selling_thb;
      const jump = cur > 0 ? Math.round(((nxt - cur) / cur) * 100) : 0;
      nodes[i].margin_jump_to_next_node_percent = jump;
      nodes[i].is_high_margin_bottleneck = jump > 100;
    }

    const origin = nodes[0].five_w_two_h.how_much_selling_thb;
    const final = nodes[3].five_w_two_h.how_much_selling_thb;
    const name = str(pr.product_name, 'สินค้าใหม่');
    const sectorId = str(String(tx.sector_id ?? ''), '10').padStart(2, '0');

    return {
      taxonomy: {
        sector_id: sectorId,
        sector_name: str(tx.sector_name, ''),
        sub_category_name: str(tx.sub_category_name, 'สินค้าทั่วไป'),
        archetype_name: str(tx.archetype_name, 'ห่วงโซ่มูลค่ามาตรฐาน'),
      },
      product: {
        product_id: str(pr.product_id, `PROD-${hashStr(name).toString(36).toUpperCase().slice(0, 5)}`),
        product_name: name,
        search_keywords: Array.isArray(pr.search_keywords)
          ? (pr.search_keywords as unknown[]).filter((k): k is string => typeof k === 'string')
          : [name],
        base_unit_reference: str(pr.base_unit_reference, 'หน่วยมาตรฐาน 1 หน่วย'),
        conversion_summary: str(pr.conversion_summary, '-'),
        total_value_spread: {
          origin_cost_thb: origin,
          final_retail_value_thb: final,
          total_markup_percent: origin > 0 ? Math.round(((final - origin) / origin) * 100) : 0,
        },
      },
      supply_chain_nodes: nodes,
    };
  } catch {
    return null;
  }
}

export const flattenOpps = (chain: ProductChain) =>
  chain.supply_chain_nodes.flatMap((node) =>
    node.micro_opportunities.map((opp, i) => ({ key: `${node.node_order}-${i}`, node, opp }))
  );

export const baht = (n: number): string =>
  `${Math.round(n).toLocaleString('th-TH')}`;
