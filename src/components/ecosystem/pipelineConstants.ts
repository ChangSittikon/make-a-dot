export interface PipelineTabItem {
  id: number;
  code: string;
  label: string;
  fullLabel: string;
  icon: string;
  desc: string;
  badge?: string;
}

export const PIPELINE_TABS: PipelineTabItem[] = [
  {
    id: 1,
    code: '01',
    label: 'หมวดโครงการ',
    fullLabel: 'เลือกอุตสาหกรรม & สเปกโครงการ',
    icon: 'fa-solid fa-sitemap',
    desc: 'กำหนดสายงานและหมวดหมู่โครงการ',
  },
  {
    id: 2,
    code: '02',
    label: 'มูลค่าระดมทุน',
    fullLabel: 'มูลค่าระดมทุนรวม (Total Valuation)',
    icon: 'fa-solid fa-coins',
    desc: 'เป้าหมายเงินทุนและสเกลผลกระทบ',
  },
  {
    id: 3,
    code: '03',
    label: 'สัดส่วนหุ้น',
    fullLabel: 'โครงสร้างความเป็นเจ้าของ (Cap Table)',
    icon: 'fa-solid fa-chart-pie',
    desc: 'สัดส่วนการถือครองหุ้นของแต่ละฝ่าย',
  },
  {
    id: 4,
    code: '04',
    label: 'เงินสด',
    fullLabel: 'สินทรัพย์เงินสด (Cash Assets)',
    icon: 'fa-solid fa-money-bill-wave',
    desc: 'งบประมาณเงินสดและสภาพคล่องหมุนเวียน',
  },
  {
    id: 5,
    code: '05',
    label: 'หยาดเหงื่อ',
    fullLabel: 'หยาดเหงื่อแรงงาน (Sweat Equity)',
    icon: 'fa-solid fa-user-gear',
    desc: 'การตีมูลค่าทักษะและเวลาทำงานเป็นทุน',
  },
  {
    id: 6,
    code: '06',
    label: 'เครื่องมือ',
    fullLabel: 'เครื่องมือ & อุปกรณ์ (Equip Assets)',
    icon: 'fa-solid fa-screwdriver-wrench',
    desc: 'อุปกรณ์ เครื่องจักร และเทคโนโลยีที่นำมาแชร์',
  },
  {
    id: 7,
    code: '07',
    label: 'สถานที่',
    fullLabel: 'สถานที่ & อสังหาริมทรัพย์ (Venue Assets)',
    icon: 'fa-solid fa-building',
    desc: 'ที่ดิน ออฟฟิศ และสิ่งปลูกสร้างเพื่อการผลิต',
  },
  {
    id: 8,
    code: '08',
    label: 'IP / แปลน',
    fullLabel: 'ทรัพย์สินทางปัญญา (IP & Licenses)',
    icon: 'fa-solid fa-lightbulb',
    desc: 'แบบแปลน พิมพ์เขียว ใบอนุญาต และลิขสิทธิ์',
  },
  {
    id: 9,
    code: '09',
    label: 'บทบาททีม',
    fullLabel: 'เครือข่ายความร่วมมือ (5-Tier Synergy)',
    icon: 'fa-solid fa-users-gear',
    desc: 'บทบาทผู้เกี่ยวข้องตั้งแต่ผู้ริเริ่มจนถึงผู้ตรวจ',
  },
  {
    id: 10,
    code: '10',
    label: 'งวดงาน BOQ',
    fullLabel: 'ถอดแบบ BOQ & งวดเบิกจ่าย (Milestones)',
    icon: 'fa-solid fa-receipt',
    desc: 'การผูกงวดงานกับการส่งมอบชิ้นงานจริง',
  },
  {
    id: 11,
    code: '11',
    label: 'เซฟล็อกเงิน',
    fullLabel: 'ตู้เซฟล็อกเงินงวด & ค้ำประกัน (Escrow Vault)',
    icon: 'fa-solid fa-shield-halved',
    desc: 'ระบบตู้เซฟล็อกเงินงวดและกองทุนค้ำประกันความเสี่ยง',
  },
  {
    id: 12,
    code: '12',
    label: 'สรุปปล่อยงาน',
    fullLabel: 'สรุปผล & ปล่อยเควสต์ (Launch Quest)',
    icon: 'fa-solid fa-rocket',
    desc: 'สรุปโครงสร้างทั้งหมดและเชื่อมต่อกระดานเควสต์',
    badge: 'Launch',
  },
];
