import { CapTableItem } from '../types';
import {
  ProductChain,
  SupplyChainNode,
  MicroOpportunity,
  StageType,
  STAGE_META,
} from './types';
import { parseRange } from './schema';

export interface CrossTabBridgePayload {
  targetTab: 'CAPITAL' | 'LOCAL';
  timestamp: number;
  chain: ProductChain;
  node: SupplyChainNode;
  opp: MicroOpportunity;
  oppKey: string;
  /** Optional custom startup cash from simulator or factory MOQ */
  customCashThb?: number;
  /** Optional simulator context */
  simulatedUnitCost?: number;
  simulatedSellingPrice?: number;
  simulatedMonthlyVolume?: number;
}

export interface CapTableComputationResult {
  items: CapTableItem[];
  breakdownNotes: Record<'cash' | 'sweat' | 'equip' | 'venue' | 'ip', string>;
  minCapitalThb: number;
  maxCapitalThb: number;
  recommendedCashThb: number;
  totalValuationThb: number;
  founderSharePct: number;
  investorSharePct: number;
  sectorIndustryId: string;
}

export interface NearbyFactoryPin {
  id: string;
  name: string;
  facilityType: 'OEM_FACTORY' | 'RAW_MATERIAL' | 'PACKAGING_EQUIP' | 'LAB_CERT' | 'LOGISTICS_BYPRODUCT';
  facilityTypeLabel: string;
  stageType: StageType;
  matchedNodeOrder: number;
  matchedNodeTitle: string;
  distanceKm: number;
  driveMinutes: number;
  zoneName: string;
  addressHint: string;
  moqLabel: string;
  moqCostThb: number;
  unitPriceLabel: string;
  rating: number;
  reviewCount: number;
  verifiedPartner: boolean;
  specialties: string[];
  /** Radar coordinates (-100 to +100 from user center) */
  radarX: number;
  radarY: number;
  isPrimaryMatch: boolean;
}

export interface ThailandZoneOption {
  id: string;
  name: string;
  shortName: string;
  hubs: string[];
}

export const THAILAND_ZONES: ThailandZoneOption[] = [
  {
    id: 'bkk_metro',
    name: 'กรุงเทพฯ และปริมณฑล (บางนา / พระราม 2 / ปทุมธานี / นนทบุรี)',
    shortName: 'กรุงเทพฯ-ปริมณฑล',
    hubs: ['นิคมฯ บางชัน', 'เทพารักษ์-บางพลี', 'คลองหลวง-รังสิต', 'พุทธมณฑล-สามพราน', 'ลาดกระบัง'],
  },
  {
    id: 'north_cm',
    name: 'ภาคเหนือ (เชียงใหม่ / เชียงราย / ลำพูน)',
    shortName: 'เชียงใหม่-ภาคเหนือ',
    hubs: ['แม่ริม-สันทราย', 'นิคมฯ ลำพูน', 'แม่สรวย-ดอยช้าง', 'หางดง-สารภี', 'เมืองเชียงราย'],
  },
  {
    id: 'east_eec',
    name: 'ภาคตะวันออก EEC (ชลบุรี / ระยอง / จันทบุรี)',
    shortName: 'ชลบุรี-ระยอง-จันทบุรี',
    hubs: ['อมตะซิตี้ ชลบุรี', 'ศรีราชา-แหลมฉบัง', 'ปลวกแดง-ระยอง', 'ท่าใหม่-จันทบุรี', 'บ้านบึง'],
  },
  {
    id: 'isan_kk',
    name: 'ภาคอีสาน (ขอนแก่น / นครราชสีมา / อุดรธานี)',
    shortName: 'ขอนแก่น-โคราช',
    hubs: ['เมืองขอนแก่น-ท่าพระ', 'ปากช่อง-สีคิ้ว', 'นิคมฯ โรจนะโคราช', 'โนนสูง', 'เมืองอุดรธานี'],
  },
  {
    id: 'south_hy',
    name: 'ภาคใต้ (สงขลา-หาดใหญ่ / สุราษฎร์ธานี / ภูเก็ต)',
    shortName: 'หาดใหญ่-สุราษฎร์ฯ',
    hubs: ['หาดใหญ่-คลองแห', 'พุนพิน-สุราษฎร์ฯ', 'รัตภูมิ', 'ถลาง-ภูเก็ต', 'ทุ่งสง-นครศรีฯ'],
  },
];

/**
 * Convert sector_id ('01'..'12') to CapitalTab's industry ID ('ind_01'..'ind_12')
 */
export function mapSectorToIndustryId(sectorId?: string): string {
  if (!sectorId) return 'ind_01';
  const clean = sectorId.replace(/\D/g, '').padStart(2, '0');
  const num = parseInt(clean, 10);
  if (num >= 1 && num <= 12) {
    return `ind_${String(num).padStart(2, '0')}`;
  }
  return 'ind_01';
}

/**
 * Extract numeric capital range and recommended startup cash from MicroOpportunity
 */
export function extractCapitalNumbers(
  opp: MicroOpportunity,
  node: SupplyChainNode,
  customCashThb?: number
): { minCap: number; maxCap: number; recommendedCash: number } {
  const [minParsed, maxParsed] = parseRange(opp.capital_required_thb || '');

  // Also check if action_links.go_to_capital_tab mentions a specific amount
  let linkAmount = 0;
  const linkText = opp.action_links?.go_to_capital_tab || '';
  const matches = linkText.match(/\d[\d,]*/g);
  if (matches && matches.length > 0) {
    const nums = matches
      .map((s) => Number(s.replace(/,/g, '')))
      .filter((n) => !Number.isNaN(n) && n >= 500);
    if (nums.length > 0) {
      linkAmount = Math.max(...nums);
    }
  }

  const minCap = minParsed > 0 ? minParsed : 0;
  const maxCap =
    maxParsed > 0
      ? maxParsed
      : linkAmount > 0
      ? linkAmount
      : Math.max(5000, node.five_w_two_h.how_much_cost_thb * 20);

  let recommendedCash = customCashThb !== undefined
    ? customCashThb
    : linkAmount > 0
    ? linkAmount
    : maxParsed > 0
    ? maxParsed
    : minParsed > 0
    ? minParsed
    : 0;

  // Even for 0-baht broker models, provide a realistic working-capital baseline option if needed
  if (recommendedCash === 0 && maxCap === 0) {
    recommendedCash = 3000;
  }

  return {
    minCap,
    maxCap: Math.max(minCap, maxCap),
    recommendedCash,
  };
}

/**
 * Compute the 5-Asset Cap Table (Cash, Sweat, Equip, Venue, IP) directly from a Production Node & Opportunity
 */
export function computeCapTableFromProduction(
  payload: CrossTabBridgePayload
): CapTableComputationResult {
  const { chain, node, opp, customCashThb } = payload;
  const { minCap, maxCap, recommendedCash } = extractCapitalNumbers(opp, node, customCashThb);

  // Determine asset weights based on strategy_type
  // Cash = investor/startup capital
  // Sweat, Equip, Venue, IP = founder/partner non-cash contributions
  const cashVal = Math.max(0, Math.round(recommendedCash));

  // Base scale for non-cash assets so the project valuation is balanced and realistic
  const baseScale = Math.max(cashVal, maxCap, 15000);

  let sweatVal = 0;
  let equipVal = 0;
  let venueVal = 0;
  let ipVal = 0;

  switch (opp.strategy_type) {
    case 'DISINTERMEDIATION':
      // High sweat equity & customer network, minimal equipment/venue
      sweatVal = Math.round(baseScale * 1.4);
      equipVal = Math.round(baseScale * 0.25);
      venueVal = Math.round(baseScale * 0.15);
      ipVal = Math.round(baseScale * 0.45);
      break;
    case 'AGGREGATION_OEM':
      // Balanced cash for OEM MOQ + sweat for branding + IP for formula/FDA
      sweatVal = Math.round(baseScale * 0.55);
      equipVal = Math.round(baseScale * 0.3);
      venueVal = Math.round(baseScale * 0.2);
      ipVal = Math.round(baseScale * 0.45);
      break;
    case 'MICRO_VALUE_ADD':
      // High craftsmanship/sweat + specialized tools + strong brand IP
      sweatVal = Math.round(baseScale * 0.65);
      equipVal = Math.round(baseScale * 0.5);
      venueVal = Math.round(baseScale * 0.25);
      ipVal = Math.round(baseScale * 0.5);
      break;
    case 'UNBUNDLING':
    default:
      // Processing tools + collection logistics + specialized service IP
      sweatVal = Math.round(baseScale * 0.6);
      equipVal = Math.round(baseScale * 0.45);
      venueVal = Math.round(baseScale * 0.3);
      ipVal = Math.round(baseScale * 0.35);
      break;
  }

  const items: CapTableItem[] = [
    { id: 'cash', name: 'เงินสดตั้งต้น (Cash)', value: cashVal, color: '#56b6f7' },
    { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: sweatVal, color: '#9d9ff7' },
    { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: equipVal, color: '#3bd18e' },
    { id: 'venue', name: 'สถานที่/คลังสินค้า (Venue)', value: venueVal, color: '#a3e635' },
    { id: 'ip', name: 'สูตร/แบรนด์/ใบอนุญาต (IP)', value: ipVal, color: '#f3e8c8' },
  ];

  const totalValuationThb = items.reduce((sum, i) => sum + i.value, 0);
  const investorSharePct =
    totalValuationThb > 0 ? Number(((cashVal / totalValuationThb) * 100).toFixed(1)) : 0;
  const founderSharePct = Number((100 - investorSharePct).toFixed(1));

  const breakdownNotes = {
    cash: `เงินทุนตั้งต้นสำหรับ: ${opp.action_links.go_to_capital_tab || opp.model_name} (ช่วงทุนอ้างอิง ${opp.capital_required_thb} บาท)`,
    sweat: `ทักษะและการลงมือทำ: ${opp.required_weapons.skills_needed} (รอบเวลาทำจริง ${node.five_w_two_h.when_cycle_time})`,
    equip: `เครื่องมือและอุปกรณ์: ${opp.required_weapons.tools_and_equipment}`,
    venue: `สถานที่ปฏิบัติงาน: ${node.five_w_two_h.where}`,
    ip: `ทรัพย์สินทางปัญญาและใบอนุญาต: ${opp.required_weapons.legal_and_permits}`,
  };

  return {
    items,
    breakdownNotes,
    minCapitalThb: minCap,
    maxCapitalThb: maxCap,
    recommendedCashThb: cashVal,
    totalValuationThb,
    founderSharePct,
    investorSharePct,
    sectorIndustryId: mapSectorToIndustryId(chain.taxonomy.sector_id),
  };
}

/**
 * Generate realistic, context-aware nearby factory & supplier pins for LocalTab ("ทำใกล้")
 */
export function generateNearbyFactoriesForChain(
  chain: ProductChain,
  activeNode?: SupplyChainNode,
  activeOpp?: MicroOpportunity,
  zoneId: string = 'bkk_metro'
): NearbyFactoryPin[] {
  const zone = THAILAND_ZONES.find((z) => z.id === zoneId) || THAILAND_ZONES[0];
  const targetOrder = activeNode?.node_order || 3;
  const nodes = chain.supply_chain_nodes;

  const radarPositions: [number, number][] = [
    [-32, -28],
    [38, -22],
    [-24, 34],
    [42, 28],
    [-58, 8],
    [16, -54],
    [55, -45],
  ];

  const distances = [2.4, 4.8, 7.5, 11.2, 14.6, 18.9, 24.5];

  const pins: NearbyFactoryPin[] = [];

  nodes.forEach((node, idx) => {
    const firstOpp = node.micro_opportunities[0];
    const isTarget = node.node_order === targetOrder;
    const pos = radarPositions[idx % radarPositions.length];
    const dist = isTarget ? 2.4 : distances[(idx + 1) % distances.length];
    const hub = zone.hubs[idx % zone.hubs.length];

    let facilityType: NearbyFactoryPin['facilityType'] = 'OEM_FACTORY';
    let facilityTypeLabel = 'โรงงานรับผลิต (OEM/ODM)';
    let factoryPrefix = 'โรงงานมาตรฐาน';

    if (node.stage_type === 'UPSTREAM') {
      facilityType = 'RAW_MATERIAL';
      facilityTypeLabel = 'แหล่งวัตถุดิบต้นน้ำ / คลังวัตถุดิบ';
      factoryPrefix = 'ศูนย์รวบรวมวัตถุดิบ';
    } else if (node.stage_type === 'MIDSTREAM_EARLY') {
      facilityType = 'LAB_CERT';
      facilityTypeLabel = 'โรงแปรรูปขั้นต้น & แล็บพัฒนาสูตร';
      factoryPrefix = 'แล็บและโรงแปรรูป';
    } else if (node.stage_type === 'MIDSTREAM_LATE') {
      facilityType = 'OEM_FACTORY';
      facilityTypeLabel = 'โรงงานรับจ้างผลิต & บรรจุภัณฑ์ OEM';
      factoryPrefix = 'โรงงาน OEM';
    } else if (node.stage_type === 'DOWNSTREAM') {
      facilityType = 'PACKAGING_EQUIP';
      facilityTypeLabel = 'ศูนย์แพ็กสินค้า & ซัพพลายเออร์อุปกรณ์';
      factoryPrefix = 'ฮับแพ็กเกจจิ้งและกระจายสินค้า';
    } else {
      facilityType = 'LOGISTICS_BYPRODUCT';
      facilityTypeLabel = 'พาร์ตเนอร์ต่อยอดของพลอยได้ & บริการ B2B';
      factoryPrefix = 'ศูนย์นวัตกรรมแปรรูปต่อยอด';
    }

    const weapons = (isTarget && activeOpp ? activeOpp : firstOpp)?.required_weapons;
    const toolsList = (weapons?.tools_and_equipment || '')
      .split(/[,•]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    const [minCap, maxCap] = parseRange(
      (isTarget && activeOpp ? activeOpp : firstOpp)?.capital_required_thb || '5,000 - 15,000'
    );
    const moqCost = minCap > 0 ? minCap : Math.max(3500, node.five_w_two_h.how_much_cost_thb * 15);

    pins.push({
      id: `pin_${chain.product.product_id}_node_${node.node_order}`,
      name: `${factoryPrefix} ${node.node_title.replace(/\(.*?\)/g, '').trim()} (${hub})`,
      facilityType,
      facilityTypeLabel,
      stageType: node.stage_type,
      matchedNodeOrder: node.node_order,
      matchedNodeTitle: node.node_title,
      distanceKm: dist,
      driveMinutes: Math.max(6, Math.round(dist * 2.6)),
      zoneName: zone.shortName,
      addressHint: `โซน${hub} • ${node.five_w_two_h.where}`,
      moqLabel: `รับผลิต/ส่งขั้นต่ำเริ่มที่ ${node.equivalent_quantity}`,
      moqCostThb: moqCost,
      unitPriceLabel: `ราคาส่งเฉลี่ย ${node.five_w_two_h.how_much_cost_thb.toLocaleString()} - ${node.five_w_two_h.how_much_selling_thb.toLocaleString()} บ./หน่วย`,
      rating: isTarget ? 4.9 : Number((4.6 + (idx % 4) * 0.1).toFixed(1)),
      reviewCount: 38 + idx * 19,
      verifiedPartner: true,
      specialties:
        toolsList.length > 0
          ? toolsList
          : [STAGE_META[node.stage_type].label, 'รับล็อตเล็กสำหรับผู้เริ่มต้น', 'มีบริการส่งตัวอย่าง Sample'],
      radarX: pos[0],
      radarY: pos[1],
      isPrimaryMatch: isTarget,
    });
  });

  // Add an extra dedicated Packaging & Equipment Supplier pin near the user for convenience
  const activeWeapons = activeOpp?.required_weapons || nodes[targetOrder - 1]?.micro_opportunities[0]?.required_weapons;
  if (activeWeapons) {
    pins.push({
      id: `pin_${chain.product.product_id}_equip_hub`,
      name: `คลังซัพพลายเออร์อุปกรณ์ & บรรจุภัณฑ์ครบวงจร (${zone.hubs[1] || zone.shortName})`,
      facilityType: 'PACKAGING_EQUIP',
      facilityTypeLabel: 'ซัพพลายเออร์อุปกรณ์ & แพ็กเกจจิ้ง',
      stageType: activeNode?.stage_type || 'MIDSTREAM_LATE',
      matchedNodeOrder: targetOrder,
      matchedNodeTitle: activeNode?.node_title || nodes[0].node_title,
      distanceKm: 3.6,
      driveMinutes: 10,
      zoneName: zone.shortName,
      addressHint: `โซน${zone.hubs[1] || zone.shortName} • มีหน้าร้านให้ดูของจริง`,
      moqLabel: 'แบ่งขายปลีก-ส่ง ไม่มีขั้นต่ำ / สั่งสกรีนโลโก้เริ่ม 100 ชิ้น',
      moqCostThb: 2500,
      unitPriceLabel: `ชุดเริ่มต้นสำหรับ ${chain.product.product_name}`,
      rating: 4.8,
      reviewCount: 94,
      verifiedPartner: true,
      specialties: [
        activeWeapons.tools_and_equipment,
        'ให้คำปรึกษาการจดแจ้งฉลาก/อย.',
        'จัดส่งด่วนในพื้นที่ภายใน 3 ชม.',
      ],
      radarX: -14,
      radarY: -18,
      isPrimaryMatch: true,
    });
  }

  // Sort so primary matched pins appear first, then by distance
  return pins.sort((a, b) => {
    if (a.isPrimaryMatch !== b.isPrimaryMatch) return a.isPrimaryMatch ? -1 : 1;
    return a.distanceKm - b.distanceKm;
  });
}
