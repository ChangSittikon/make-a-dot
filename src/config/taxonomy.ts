/**
 * MAKE A DOT — Centralized Taxonomy Configuration
 * 5-Scale Impact Taxonomy + Moonshot Protocol
 */

export type ImpactScale =
  | "MICRO"
  | "LOCAL"
  | "MACRO"
  | "STRUCTURAL"
  | "GLOBAL"
  | "MOONSHOT";

export interface ImpactScaleInfo {
  key: ImpactScale;
  level: number | string;
  emoji: string;
  label: string;
  labelTh: string;
  scope: string;
  description: string;
  examples: string[];
  color: string; // Tailwind badge classes for light backgrounds
  bgLight: string;
  borderColor: string;
  textColor: string;
  trackTarget: string; // Target in Dual-Track (Bounty to Project)
}

export interface ScaleStats {
  bounties: number;
  projects: number;
}

export const VALID_IMPACT_SCALES: ImpactScale[] = [
  "MICRO",
  "LOCAL",
  "MACRO",
  "STRUCTURAL",
  "GLOBAL",
  "MOONSHOT",
];

export const IMPACT_SCALE_CONFIG: Record<ImpactScale, ImpactScaleInfo> = {
  MICRO: {
    key: "MICRO",
    level: 1,
    emoji: "",
    label: "MICRO",
    labelTh: "ส่วนตัว / ครัวเรือน",
    scope: "บุคคล & ครอบครัว",
    description: "ปัญหาเฉพาะตัว ชีวิตประจำวัน งานช่างพื้นฐาน หรือปัญหาเฉพาะบุคคลที่ต้องการคนช่วยแก้ไขเร่งด่วน",
    examples: ["ซ่อมหลังคาบ้านรั่ว", "ปวดหลังจากออฟฟิศซินโดรม", "หาคนช่วยขนย้ายสิ่งของ"],
    color: "bg-sky-50 text-sky-700 border-sky-200",
    bgLight: "bg-sky-50/70",
    borderColor: "border-sky-200",
    textColor: "text-sky-700",
    trackTarget: "Bounty Track (งานแก้ปัญหาเฉพาะจุด)",
  },
  LOCAL: {
    key: "LOCAL",
    level: 2,
    emoji: "",
    label: "LOCAL",
    labelTh: "ชุมชน / ท้องถิ่น",
    scope: "ชุมชน & ร้านค้า & วิสาหกิจชุมชน",
    description: "ปัญหาเชิงพื้นที่ ธุรกิจร้านค้ารายย่อย การค้าขายในย่าน หรือระบบสาธารณูปโภคระดับชุมชน",
    examples: ["ร้านค้ายอดขายตก หาคนช่วยยิงแอด", "ชุมชนขาดระบบจัดการขยะ", "พัฒนาแบรนด์สินค้า OTOP"],
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bgLight: "bg-emerald-50/70",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    trackTarget: "Bounty Track → Local Project",
  },
  MACRO: {
    key: "MACRO",
    level: 3,
    emoji: "",
    label: "MACRO",
    labelTh: "อุตสาหกรรม / ประเทศ",
    scope: "ภาคอุตสาหกรรม & Supply Chain ประเทศ",
    description: "ปัญหาของห่วงโซ่อุปทานระดับอุตสาหกรรม การขาดแคลนแรงงานทักษะสูง หรือระบบขนส่ง",
    examples: ["ลดต้นทุน Cold-Chain Logistics เกษตร", "ปัญหาขาดแคลนช่างเครื่องกลโรงงาน", "แพลตฟอร์ม Matching วัตถุดิบ"],
    color: "bg-amber-50 text-amber-700 border-amber-200",
    bgLight: "bg-amber-50/70",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    trackTarget: "Project Track (ระดมทุน & สร้างทีม)",
  },
  STRUCTURAL: {
    key: "STRUCTURAL",
    level: 4,
    emoji: "",
    label: "STRUCTURAL",
    labelTh: "โครงสร้างระบบ / สถาบัน",
    scope: "กฎหมาย & นโยบาย & ความเหลื่อมล้ำ",
    description: "ปัญหาเชิงโครงสร้างของระบบ กฎหมาย นโยบายสาธารณะ หรือกลไกตลาดที่สร้างความเหลื่อมล้ำ",
    examples: ["การเข้าถึงแหล่งเงินทุนดอกเบี้ยต่ำของผู้ประกอบการ", "การปฏิรูปกฎหมายลิขสิทธิ์สร้างสรรค์", "ความโปร่งใสในระบบจัดซื้อ"],
    color: "bg-violet-50 text-violet-700 border-violet-200",
    bgLight: "bg-violet-50/70",
    borderColor: "border-violet-200",
    textColor: "text-violet-700",
    trackTarget: "Project Track (Co-creation & Policy)",
  },
  GLOBAL: {
    key: "GLOBAL",
    level: 5,
    emoji: "",
    label: "GLOBAL",
    labelTh: "ระดับโลก / ข้ามพรมแดน",
    scope: "มนุษยชาติ & ความยั่งยืนระดับโลก",
    description: "วิกฤตที่ส่งผลกระทบข้ามพรมแดน การเปลี่ยนแปลงสภาพภูมิอากาศ ความมั่นคงทางอาหารและพลังงาน",
    examples: ["วิกฤต Climate Change & Carbon Credit", "ระบบกรองน้ำทะเลราคาประหยัด", "การกระจายวัคซีนและยาจำเป็น"],
    color: "bg-blue-50 text-blue-700 border-blue-200",
    bgLight: "bg-blue-50/70",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    trackTarget: "Moonshot / Global Consortium",
  },
  MOONSHOT: {
    key: "MOONSHOT",
    level: "★",
    emoji: "",
    label: "MOONSHOT",
    labelTh: "อนาคตมนุษยชาติ (Deep Tech)",
    scope: "Frontier Science & Long-term Future",
    description: "ภารกิจท้าทายขีดจำกัดทางฟิสิกส์ ชีววิทยา และเทคโนโลยีขั้นสูง เพื่อยกระดับอารยธรรมมนุษย์ไปสู่อนาคต",
    examples: ["การตั้งถิ่นฐานบนดาวอังคาร", "Artificial General Intelligence (AGI)", "เทคโนโลยีฟื้นฟูเซลล์ยืดอายุขัย 200 ปี"],
    color: "bg-gray-900 text-yellow-300 border-gray-700",
    bgLight: "bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white",
    borderColor: "border-amber-500/40",
    textColor: "text-amber-300",
    trackTarget: "Moonshot Track (Tier 4-5 Solvers & Deep Tech)",
  },
};

export const IMPACT_SCALE_LIST: ImpactScaleInfo[] = Object.values(IMPACT_SCALE_CONFIG);
