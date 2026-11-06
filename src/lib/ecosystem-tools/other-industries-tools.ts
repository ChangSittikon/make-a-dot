import { EcosystemTool } from './types';

interface IndustryMeta {
  key: string;
  codePrefix: string;
  label: string;
  mainIcon: string;
  mainTitle: string;
  mainDesc: string;
}

const INDUSTRIES: IndustryMeta[] = [
  {
    key: 'ind_02',
    codePrefix: 'D3.02',
    label: '02 การแพทย์และสาธารณสุข',
    mainIcon: 'Activity',
    mainTitle: 'คัดกรองคิว Triage & EMR',
    mainDesc: 'จัดลำดับความเร่งด่วนคนไข้ 5 ระดับ บริหารคลังยาแบบ FEFO และบันทึกเวชระเบียนสอดคล้องมาตรฐาน สปสช. และ PDPA',
  },
  {
    key: 'ind_03',
    codePrefix: 'D3.03',
    label: '03 เทคโนโลยีและไอที',
    mainIcon: 'Server',
    mainTitle: 'คำนวณ Cloud Cost & SLA',
    mainDesc: 'ปรับลดค่าใช้จ่าย AWS/GCP ด้วย Spot Instance & Caching บริหาร On-Call Alert และติดตามหนี้เทคนิค',
  },
  {
    key: 'ind_04',
    codePrefix: 'D3.04',
    label: '04 การศึกษา',
    mainIcon: 'BookOpen',
    mainTitle: 'วัดผลผู้เรียน & Rubric',
    mainDesc: 'วัดผลการเรียนรู้แบบ Rubric Score วิเคราะห์ Dropout Rate และออกแบบหลักสูตรย่นย่อเพิ่มการมีส่วนร่วม',
  },
  {
    key: 'ind_05',
    codePrefix: 'D3.05',
    label: '05 อาหารและเครื่องดื่ม',
    mainIcon: 'Utensils',
    mainTitle: 'Food Cost % & คุมครัว',
    mainDesc: 'คำนวณต้นทุนวัตถุดิบรายจานให้อยู่ในเกณฑ์ 28-35% ระบบจัดคิวออเดอร์ในครัว (KDS) และลดการสูญเสียวัตถุดิบ',
  },
  {
    key: 'ind_06',
    codePrefix: 'D3.06',
    label: '06 เกษตรกรรม',
    mainIcon: 'Leaf',
    mainTitle: 'รอบปลูก GAP & Cold Chain',
    mainDesc: 'บันทึกรอบการให้ปุ๋ย-ยาตามมาตรฐาน GAP วางแผนการเก็บเกี่ยวตรงรอบราคาตลาดสูงสุด และควบคุมอุณหภูมิห้องเย็นขนส่ง',
  },
  {
    key: 'ind_07',
    codePrefix: 'D3.07',
    label: '07 ขนส่ง',
    mainIcon: 'Truck',
    mainTitle: 'จัดเส้นทาง & คุมน้ำมัน',
    mainDesc: 'คำนวณจุดส่งของแบบประหยัดระยะทาง (Route Optimization) ติดตามพฤติกรรมการขับขี่ และควบคุมค่าน้ำมัน',
  },
  {
    key: 'ind_08',
    codePrefix: 'D3.08',
    label: '08 การเงิน/การธนาคาร/บัญชี',
    mainIcon: 'BadgeDollarSign',
    mainTitle: 'ประเมินเครดิต & AML/KYC',
    mainDesc: 'ประเมินคะแนนเครดิต (Credit Scoring) ตรวจสอบประวัติอาชญากรรมทางการเงิน และติดตามหนี้ค้างชำระตาม พ.ร.บ.ทวงถามหนี้',
  },
  {
    key: 'ind_09',
    codePrefix: 'D3.09',
    label: '09 การท่องเที่ยวและการบริการ',
    mainIcon: 'Hotel',
    mainTitle: 'ผลตอบแทนห้องพัก RevPAR',
    mainDesc: 'ปรับราคาห้องพักแบบไดนามิกตามฤดูกาล ลดค่าคอมมิชชันแพลตฟอร์ม OTA และบริหารรีวิวลูกค้าภายใน 24 ชม.',
  },
  {
    key: 'ind_10',
    codePrefix: 'D3.10',
    label: '10 โรงงานและการผลิต',
    mainIcon: 'Wrench',
    mainTitle: 'คำนวณ OEE & ซ่อมบำรุง',
    mainDesc: 'คำนวณประสิทธิผลเครื่องจักร (OEE) และจัดตารางเปลี่ยนอะไหล่เชิงป้องกัน (Preventive Maintenance)',
  },
  {
    key: 'ind_11',
    codePrefix: 'D3.11',
    label: '11 สื่อ/ความบันเทิง',
    mainIcon: 'Video',
    mainTitle: 'ลิขสิทธิ์ IP & คุมกองถ่าย',
    mainDesc: 'จัดทำสัญญาโอนสิทธิ์เพลง/ภาพ ควบคุมงบประมาณกองถ่ายไม่ให้บานปลาย และวิเคราะห์ Engagement รายได้ข้ามแพลตฟอร์ม',
  },
  {
    key: 'ind_12',
    codePrefix: 'D3.12',
    label: '12 กฎหมาย',
    mainIcon: 'BookCheck',
    mainTitle: 'Due Diligence & Retainer',
    mainDesc: 'ตรวจสอบความถูกต้องเอกสารสัญญา ทรัพย์สิน คดีความคงค้าง และคำนวณชั่วโมงการให้คำปรึกษาทางกฎหมายอย่างโปร่งใส',
  },
];

function buildIndustryTools(meta: IndustryMeta): EcosystemTool[] {
  const baseD1 = {
    'D1.1': `ปฏิบัติการและส่งมอบงานในสายงาน${meta.label}ตามมาตรฐานวิชาชีพ`,
    'D1.2': `รับงานอิสระและบริหารสัญญาบริการในสายงาน${meta.label}อย่างมืออาชีพ`,
    'D1.3': `บริหารต้นทุนและควบคุมความเสี่ยงธุรกิจ${meta.label}ให้อยู่รอดและเติบโต`,
    'D1.4': `สกัดทักษะแก่นของสายงาน${meta.label}เพื่อสร้างโอกาสย้ายสายงานใน 30 วัน`,
  };

  return [
    {
      id: `${meta.codePrefix}.01`,
      code: `${meta.codePrefix}.01`,
      title: meta.mainTitle,
      name: meta.mainTitle,
      category: 'INDUSTRY',
      categoryLabel: meta.label,
      iconName: meta.mainIcon,
      description: meta.mainDesc,
      tags: [meta.label.slice(3), 'แก่นวิชาชีพ', 'มาตรฐาน HITL'],
      status: 'VERIFIED',
      version: 'v1.0',
      verifiedBy: 'Tier 4 Domain Director',
      adaptationD1: baseD1,
      stressAdvice: 'โฟกัสเฉพาะขั้นตอนวิกฤตที่สร้างผลลัพธ์ทันทีภายใน 90 นาที',
      actionChecklist: ['ตรวจสอบข้อกำหนดมาตรฐาน', 'บันทึกข้อมูลสำคัญครบถ้วน', 'ส่งมอบตามขั้นตอนที่กำหนด'],
    },
    {
      id: `${meta.codePrefix}.02`,
      code: `${meta.codePrefix}.02`,
      title: 'ระบบ POS & ต้นทุนต่อหน่วย',
      name: `ระบบ POS & คำนวณต้นทุนต่อหน่วย (${meta.label})`,
      category: 'INDUSTRY',
      categoryLabel: meta.label,
      iconName: 'Receipt',
      description: `ระบบ POS & คำนวณต้นทุนต่อหน่วย: คำนวณกำไรต่อหน่วยและจุดคุ้มทุนรายวันประจำสายงาน${meta.label} ป้องกันเงินรั่วไหล`,
      tags: ['POS', 'ต้นทุนต่อหน่วย', 'จุดคุ้มทุน'],
      status: 'VERIFIED',
      version: 'v1.0',
      verifiedBy: 'Tier 4 Domain Director',
      adaptationD1: baseD1,
      stressAdvice: 'คำนวณต้นทุนผันแปรต่อหน่วยเพื่อตั้งราคาขั้นต่ำที่ไม่ขาดทุน',
      actionChecklist: ['บันทึกยอดขายและต้นทุนรายวัน', 'คำนวณจุดคุ้มทุนต่อหน่วย', 'สรุปรายงานยอดขายประจำวัน'],
    },
    {
      id: `${meta.codePrefix}.03`,
      code: `${meta.codePrefix}.03`,
      title: 'คุมสต็อก ERP & ของเสีย',
      name: `ระบบคุมสต็อก ERP & ลดของเสีย (${meta.label})`,
      category: 'INDUSTRY',
      categoryLabel: meta.label,
      iconName: 'Boxes',
      description: `ระบบคุมสต็อก ERP & ลดของเสีย: ตรวจเช็กวัตถุดิบคงคลังและลดอัตราสูญเสีย Waste ในสายงาน${meta.label} ด้วยระบบ FIFO/FEFO`,
      tags: ['ERP สต็อก', 'ลดของเสีย', 'FIFO/FEFO'],
      status: 'VERIFIED',
      version: 'v1.0',
      verifiedBy: 'Tier 4 Domain Director',
      adaptationD1: baseD1,
      stressAdvice: 'เช็กรายการของค้างสต็อกเกินกำหนดและระบายสินค้าด่วน',
      actionChecklist: ['นับสต็อกคงเหลือจริง', 'บันทึกอัตราของเสีย Waste %', 'ตั้งจุดสั่งซื้อซ้ำ Reorder Point'],
    },
    {
      id: `${meta.codePrefix}.04`,
      code: `${meta.codePrefix}.04`,
      title: 'เทียบซัพพลายเออร์ & SLA',
      name: `ระบบเทียบซัพพลายเออร์ & คุม SLA (${meta.label})`,
      category: 'INDUSTRY',
      categoryLabel: meta.label,
      iconName: 'Scale',
      description: `ระบบเทียบซัพพลายเออร์ & คุม SLA: เปรียบเทียบราคาคู่ค้า 3 เจ้าและมาตรฐานส่งมอบงาน (SLA) ประจำสายงาน${meta.label}`,
      tags: ['จัดซื้อ', '3 ซัพพลายเออร์', 'คุม SLA'],
      status: 'VERIFIED',
      version: 'v1.0',
      verifiedBy: 'Tier 4 Domain Director',
      adaptationD1: baseD1,
      stressAdvice: 'ล็อกคู่สัญญาที่มีข้อตกลงระดับบริการ (SLA) และส่งมอบตรงเวลาสูงสุด',
      actionChecklist: ['เทียบใบเสนอราคา 3 เจ้า', 'ตรวจข้อตกลง SLA และการรับประกัน', 'บันทึกประเมินผลคู่ค้าประจำงวด'],
    },
  ];
}

export const OTHER_INDUSTRIES_TOOLS: Record<string, EcosystemTool[]> = INDUSTRIES.reduce(
  (acc, ind) => {
    acc[ind.key] = buildIndustryTools(ind);
    return acc;
  },
  {} as Record<string, EcosystemTool[]>
);
