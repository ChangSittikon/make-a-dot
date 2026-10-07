import {
  IndustryItem,
  BackOfficeEngineItem,
  SynergyRoleNode,
  ProblemToolItem,
  CapTableItem,
  IndustryCapPreset,
  SubIndustryItem,
} from './types';

export const INDUSTRIES_LIST: IndustryItem[] = [
  { id: 'ind_01', code: '01', name: 'ก่อสร้างและอสังหาริมทรัพย์', icon: 'fa-solid fa-building', description: 'งานโครงสร้าง ออกแบบ บริหารไซต์งาน และระบบอาคาร', activeBounties: 24 },
  { id: 'ind_02', code: '02', name: 'การแพทย์และสาธารณสุข', icon: 'fa-solid fa-user-doctor', description: 'เวชภัณฑ์ อุปกรณ์การแพทย์ และนวัตกรรมสุขภาพ', activeBounties: 18 },
  { id: 'ind_03', code: '03', name: 'เทคโนโลยีและไอที', icon: 'fa-solid fa-laptop-code', description: 'Software, AI, PropTech และ Cloud Architecture', activeBounties: 42 },
  { id: 'ind_04', code: '04', name: 'การศึกษา', icon: 'fa-solid fa-graduation-cap', description: 'EdTech หลักสูตรอบรม และการพัฒนาทักษะวิชาชีพ', activeBounties: 9 },
  { id: 'ind_05', code: '05', name: 'อาหารเครื่องดื่ม', icon: 'fa-solid fa-utensils', description: 'Food Science, ห่วงโซ่อาหาร และครัวคลาวด์', activeBounties: 15 },
  { id: 'ind_06', code: '06', name: 'เกษตรกรรม', icon: 'fa-solid fa-wheat-awn', description: 'Smart Farming และระบบชลประทานอัจฉริยะ', activeBounties: 11 },
  { id: 'ind_07', code: '07', name: 'ขนส่ง', icon: 'fa-solid fa-truck', description: 'Cold Chain, Fleet Management และการกระจายสินค้า', activeBounties: 16 },
  { id: 'ind_08', code: '08', name: 'การเงิน/การธนาคาร/บัญชี', icon: 'fa-solid fa-coins', description: 'สินเชื่อโครงการ, บัญชี BOQ และการบริหารภาษี', activeBounties: 31 },
  { id: 'ind_09', code: '09', name: 'การท่องเที่ยวและบริการ (โรงแรม)', icon: 'fa-solid fa-plane', description: 'บริหารโรงแรม อสังหาฯ เชิงท่องเที่ยว และอีเวนต์', activeBounties: 14 },
  { id: 'ind_10', code: '10', name: 'โรงงานและการผลิต', icon: 'fa-solid fa-industry', description: 'เครื่องจักรกล การผลิตชิ้นส่วน และมาตรฐาน ISO', activeBounties: 20 },
  { id: 'ind_11', code: '11', name: 'สื่อ/ความบันเทิง/ศิลปะ', icon: 'fa-solid fa-music', description: 'การถ่ายทำ 3D Modeling และมีเดียสถาปัตยกรรม', activeBounties: 22 },
  { id: 'ind_12', code: '12', name: 'กฎหมาย', icon: 'fa-solid fa-scale-balanced', description: 'ตรวจโฉนด สัญญาว่าจ้างก่อสร้าง และระงับข้อพิพาท', activeBounties: 28 },
];

export const BACK_OFFICE_ENGINES: BackOfficeEngineItem[] = [
  { id: 'eng_escrow', name: 'Escrow Vault Protocol', thName: 'ระบบตู้เซฟล็อกเงินงวด', icon: 'fa-solid fa-lock', description: 'ล็อกเงินค่างวดอัตโนมัติ และปล่อยตาม Milestone ที่ผ่านการตรวจรับ', tierResponsible: 5 },
  { id: 'eng_guarantor', name: 'Guarantor Pool & QC', thName: 'ระบบค้ำประกันความเสี่ยง', icon: 'fa-solid fa-shield-halved', description: 'วาง Performance Bond ป้องกันการทิ้งงาน 100% พร้อมทีมตรวจรับงานอิสระ', tierResponsible: 3 },
  { id: 'eng_negotiate', name: 'Smart Negotiation Sandbox', thName: 'ระบบเจรจาต่อรอง KPI & ราคา', icon: 'fa-solid fa-handshake', description: 'จับคู่ราคาอ้างอิงตาม Market Pulse เพื่อความเสมอภาคของทั้งสองฝ่าย', tierResponsible: 2 },
  { id: 'eng_arbitration', name: 'Arbitration Jury System', thName: 'ระบบศาลลูกขุนอนุญาโตตุลาการ', icon: 'fa-solid fa-gavel', description: 'กลไกโหวตตัดสินข้อพิพาทแบบกระจายศูนย์โดยผู้ทรงคุณวุฒิประจำวงการ', tierResponsible: 4 },
];

export const CONSTRUCTION_SYNERGY_ROLES: SynergyRoleNode[] = [
  // Tier 1: Idea Creator (USER)
  {
    id: 'dev_owner',
    tier: 1,
    roleCode: 'USER',
    title: 'เจ้าของที่ดิน & ผู้พัฒนาโครงการ',
    category: 'FIELD',
    originIndustry: '01 ก่อสร้างและอสังหาฯ',
    summary: 'ผู้ริเริ่มความต้องการ กำหนดงบประมาณ และตั้งเควสต์บนกระดาน',
    deliverables: [
      { targetId: 'gc_contractor', label: 'TOR และงบประมาณก่อสร้าง' },
      { targetId: 'architect', label: 'โจทย์ความต้องการ & แปลนเบื้องต้น' },
      { targetId: 'legal_advisor', label: 'เอกสารสิทธิ์โฉนดที่ดิน' },
      { targetId: 'finance_boq', label: 'แผนงบประมาณโครงการ' },
    ],
    dependsOn: [
      { sourceId: 'qc_auditor', label: 'รายงานตรวจรับงานเพื่ออนุมัติเงิน' },
      { sourceId: 'escrow_vault', label: 'ตู้เซฟล็อกเงินคุ้มครองเงินทุน' },
    ],
    kpiMetrics: 'งบประมาณ และความคุ้มค่าการลงทุน',
  },
  {
    id: 'homeowner',
    tier: 1,
    roleCode: 'USER',
    title: 'ผู้ว่าจ้างรายย่อย / เจ้าของบ้าน',
    category: 'FIELD',
    originIndustry: '01 ก่อสร้างและอสังหาฯ',
    summary: 'ตั้งโจทย์ปัญหาซ่อมแซม ต่อเติม ปรับปรุงอาคารและที่อยู่อาศัย',
    deliverables: [
      { targetId: 'gc_contractor', label: 'โจทย์ซ่อมแซม & ต่อเติม' },
      { targetId: 'me_tech', label: 'ปัญหาเฉพาะจุดระบบไฟฟ้า/ประปา' },
    ],
    dependsOn: [
      { sourceId: 'guarantor_bond', label: 'หนังสือค้ำประกันสัญญาไม่ทิ้งงาน' },
      { sourceId: 'qc_auditor', label: 'การรับรองมาตรฐานงานส่งมอบ' },
    ],
    kpiMetrics: 'ความพึงพอใจ และงานเสร็จตรงกำหนด',
  },

  // Tier 2: Professional (Field Operations)
  {
    id: 'gc_contractor',
    tier: 2,
    roleCode: 'PROFESSIONAL',
    title: 'ผู้รับเหมาก่อสร้างหลัก (General Contractor)',
    category: 'FIELD',
    originIndustry: '01 ก่อสร้างและอสังหาฯ',
    summary: 'บริหารทีมช่าง คุมไซต์งาน จัดหาวัสดุ และประกอบการสร้างตามแบบ',
    deliverables: [
      { targetId: 'dev_owner', label: 'ผลงานตามงวด Milestone' },
      { targetId: 'qc_auditor', label: 'ส่งตรวจรับมอบงานจริงหน้าไซต์' },
    ],
    dependsOn: [
      { sourceId: 'civil_eng', label: 'แบบคำนวณโครงสร้างวิศวกรรม' },
      { sourceId: 'architect', label: 'แบบสถาปัตยกรรม & Finishing' },
      { sourceId: 'guarantor_bond', label: 'การค้ำประกันสภาพคล่อง' },
      { sourceId: 'finance_boq', label: 'บัญชีจัดซื้อวัสดุและกระแสเงิน' },
    ],
    kpiMetrics: 'ส่งมอบงานตรงงวด ปลอดภัย ไร้งานแก้งวดหน้า',
  },
  {
    id: 'civil_eng',
    tier: 2,
    roleCode: 'PROFESSIONAL',
    title: 'วิศวกรโยธาและโครงสร้าง',
    category: 'FIELD',
    originIndustry: '01 ก่อสร้างและอสังหาฯ',
    summary: 'คำนวณกำลังรับน้ำหนัก ตรวจสอบเสาเข็ม และเซ็นรับรองความปลอดภัย',
    deliverables: [
      { targetId: 'gc_contractor', label: 'แบบก่อสร้างโครงสร้าง (As-Built)' },
      { targetId: 'legal_advisor', label: 'รายการคำนวณยื่นขออนุญาต อ.1' },
    ],
    dependsOn: [
      { sourceId: 'architect', label: 'แปลนรูปทรงอาคารและระดับพื้น' },
    ],
    kpiMetrics: 'ความแข็งแรงตามมาตรฐาน วสท. 100%',
  },
  {
    id: 'architect',
    tier: 2,
    roleCode: 'PROFESSIONAL',
    title: 'สถาปนิกและมัณฑนากร',
    category: 'FIELD',
    originIndustry: '01 ก่อสร้างและอสังหาฯ',
    summary: 'ออกแบบผังการใช้งาน ดีไซน์รูปด้านภายนอก และเลือกวัสดุตกแต่ง',
    deliverables: [
      { targetId: 'civil_eng', label: 'แบบร่างสถาปัตยกรรมและมิติห้อง' },
      { targetId: 'finance_boq', label: 'รายการวัสดุและ Spec งานตกแต่ง' },
    ],
    dependsOn: [
      { sourceId: 'dev_owner', label: 'แนวคิดการใช้งานและงบประมาณ' },
    ],
    kpiMetrics: 'ความสวยงาม ถูกสุขลักษณะ และฟังก์ชันตรงโจทย์',
  },
  {
    id: 'me_tech',
    tier: 2,
    roleCode: 'PROFESSIONAL',
    title: 'ช่างเทคนิคงานระบบ (M&E / HVAC / ไฟฟ้า / ประปา)',
    category: 'FIELD',
    originIndustry: '01 ก่อสร้างและอสังหาฯ',
    summary: 'เดินท่อประปา วางระบบตู้ไฟสวิตช์บอร์ด และระบบปรับอากาศ',
    deliverables: [
      { targetId: 'gc_contractor', label: 'ผังระบบไฟฟ้าประปาเสร็จสมบูรณ์' },
      { targetId: 'it_proptech', label: 'จุดเชื่อมต่อ IoT & Smart Meter' },
    ],
    dependsOn: [
      { sourceId: 'gc_contractor', label: 'โครงสร้างผนังและฝ้าเพดานที่พร้อมติดตั้ง' },
    ],
    kpiMetrics: 'ระบบผ่านการทดสอบแรงดันน้ำและโหลดไฟ 100%',
  },

  // Tier 2: Cross-Industry Back Office Supports
  {
    id: 'legal_advisor',
    tier: 2,
    roleCode: 'PROFESSIONAL',
    title: 'ที่ปรึกษากฎหมายอสังหาฯ (12 กฎหมาย)',
    category: 'BACK_OFFICE',
    originIndustry: '12 กฎหมาย',
    summary: 'ตรวจสอบสัญญาก่อสร้าง ร่างข้อตกลง KPI และยื่นขอใบอนุญาตก่อสร้าง อ.1',
    deliverables: [
      { targetId: 'dev_owner', label: 'ร่างสัญญาก่อสร้างมาตรฐานสากล' },
      { targetId: 'gc_contractor', label: 'ใบอนุญาตก่อสร้าง อ.1' },
      { targetId: 'domain_director', label: 'เอกสารข้อพิพาทเพื่อขอคำตัดสิน' },
    ],
    dependsOn: [
      { sourceId: 'civil_eng', label: 'แบบคำนวณโครงสร้างวิศวกร' },
      { sourceId: 'dev_owner', label: 'เอกสารสิทธิ์ที่ดินและผังเมือง' },
    ],
    kpiMetrics: 'สัญญาไร้ช่องโหว่ ได้รับอนุญาตก่อสร้างถูกต้อง',
  },
  {
    id: 'finance_boq',
    tier: 2,
    roleCode: 'PROFESSIONAL',
    title: 'ผู้เชี่ยวชาญถอดแบบ BOQ & บัญชีก่อสร้าง (08 การเงิน)',
    category: 'BACK_OFFICE',
    originIndustry: '08 การเงิน/บัญชี',
    summary: 'ถอดปริมาณงานและราคาวัสดุ วางงวดเบิกจ่าย และควบคุมงบไม่ให้บานปลาย',
    deliverables: [
      { targetId: 'escrow_vault', label: 'ตารางเบิกจ่ายงวด Milestone BOQ' },
      { targetId: 'gc_contractor', label: 'งบประมาณสั่งซื้อวัสดุที่อนุมัติ' },
    ],
    dependsOn: [
      { sourceId: 'architect', label: 'แบบแปลนและรายการสเปกวัสดุ' },
      { sourceId: 'dev_owner', label: 'งบประมาณรวมของโครงการ' },
    ],
    kpiMetrics: 'คุมงบไม่เกินกรอบ 0% และกระทบยอดตรงตามใบเสร็จ',
  },
  {
    id: 'it_proptech',
    tier: 2,
    roleCode: 'PROFESSIONAL',
    title: 'ผู้พัฒนาระบบ PropTech & IoT (03 เทคโนโลยี)',
    category: 'BACK_OFFICE',
    originIndustry: '03 เทคโนโลยีและไอที',
    summary: 'ติดตั้งกล้อง AI ติดตามความคืบหน้าไซต์ เซ็นเซอร์อัจฉริยะ และ Smart Home',
    deliverables: [
      { targetId: 'qc_auditor', label: 'Live Data สตรีมภาพและบันทึกเซ็นเซอร์' },
      { targetId: 'homeowner', label: 'แอปควบคุมระบบบ้านอัจฉริยะ' },
    ],
    dependsOn: [
      { sourceId: 'me_tech', label: 'สายสัญญาณและระบบไฟเลี้ยงอุปกรณ์' },
    ],
    kpiMetrics: 'Uptime ของระบบกล้องและเซ็นเซอร์ 99.9%',
  },

  // Tier 3: Guarantor & Risk Mitigation (GUARANTOR)
  {
    id: 'guarantor_bond',
    tier: 3,
    roleCode: 'GUARANTOR',
    title: 'กองทุนค้ำประกันความเสี่ยง (Guarantor Bond)',
    category: 'SAFETY',
    originIndustry: '08 การเงิน/บัญชี & ค้ำประกัน',
    summary: 'วางหลักทรัพย์ค้ำประกันสัญญาแทนผู้รับเหมา ป้องกันกรณีผู้รับเหมาทิ้งงาน 100%',
    deliverables: [
      { targetId: 'dev_owner', label: 'หนังสือค้ำประกันสัญญา (Performance Bond)' },
      { targetId: 'gc_contractor', label: 'เงินทุนหมุนเวียนงวดเร่งด่วน' },
    ],
    dependsOn: [
      { sourceId: 'qc_auditor', label: 'รายงานคะแนนความเสี่ยงไซต์งาน' },
      { sourceId: 'escrow_vault', label: 'หลักประกันในตู้เซฟ Escrow' },
    ],
    kpiMetrics: 'อัตราเคลม 0% คุ้มครองความเสียหายเต็มวงเงินสัญญา',
  },
  {
    id: 'qc_auditor',
    tier: 3,
    roleCode: 'GUARANTOR',
    title: 'ผู้ตรวจรับงานอิสระ (Independent QC Inspector)',
    category: 'SAFETY',
    originIndustry: '01 ก่อสร้างและอสังหาฯ',
    summary: 'ตรวจรับงานภาคสนามตาม Milestone เพื่อปล่อยเงินงวด ปราศจากส่วนได้ส่วนเสีย',
    deliverables: [
      { targetId: 'escrow_vault', label: 'หนังสืออนุมัติปลดล็อกเงินงวด Milestone' },
      { targetId: 'dev_owner', label: 'รายงาน Defect และคุณภาพงานก่อสร้าง' },
      { targetId: 'gc_contractor', label: 'รายการแก้ไขก่อนปิดงวด (Punch List)' },
    ],
    dependsOn: [
      { sourceId: 'gc_contractor', label: 'ใบแจ้งส่งมอบงานประจำงวด' },
      { sourceId: 'civil_eng', label: 'เกณฑ์ความคลาดเคลื่อนที่ยอมรับได้' },
    ],
    kpiMetrics: 'ความเที่ยงตรงในการตรวจสอบ 100% ตรวจสอบภายใน 24 ชม.',
  },

  // Tier 4: Governance & Director (DIRECTOR)
  {
    id: 'domain_director',
    tier: 4,
    roleCode: 'DIRECTOR',
    title: 'ผู้อำนวยการวงการก่อสร้าง & คณะกรรมการตรวจรับรอง',
    category: 'GOVERNANCE',
    originIndustry: 'MAKE A DOT Governance',
    summary: 'รับรองจริยธรรมวิชาชีพ ตัดสินข้อขัดแย้งเชิงเทคนิค และออกตรารับรองมาตรฐาน',
    deliverables: [
      { targetId: 'escrow_vault', label: 'คำสั่งชี้ขาดกรณีข้อพิพาทระงับเงินงวด' },
      { targetId: 'gc_contractor', label: 'ตรารับรองคุณวุฒิช่างระดับสูง' },
    ],
    dependsOn: [
      { sourceId: 'legal_advisor', label: 'สำนวนสรุปประเด็นข้อพิพาท' },
      { sourceId: 'qc_auditor', label: 'พยานหลักฐานผลการตรวจรับงานจริง' },
    ],
    kpiMetrics: 'ความโปร่งใสและยุติธรรมตามมาตรฐานวิชาชีพ 100%',
  },

  // Tier 5: System Admin (Core Platform & Protocol)
  {
    id: 'escrow_vault',
    tier: 5,
    roleCode: 'ADMIN',
    title: 'ระบบกลาง Escrow Vault & ศาลลูกขุนกลาง',
    category: 'GOVERNANCE',
    originIndustry: 'MAKE A DOT Core Protocol',
    summary: 'ควบคุมตู้เซฟล็อกเงินสัญญาอัตโนมัติ กลไกศาลลูกขุน และบัญชีธุรกรรมรวม',
    deliverables: [
      { targetId: 'gc_contractor', label: 'โอนเงินค่างวดเข้าบัญชีอัตโนมัติ' },
      { targetId: 'dev_owner', label: 'ความโปร่งใสของเงินในตู้เซฟ 100%' },
    ],
    dependsOn: [
      { sourceId: 'qc_auditor', label: 'คำสั่งอนุมัติปลดล็อกเงินตาม KPI' },
      { sourceId: 'domain_director', label: 'การตัดสินข้อพิพาทเมื่อเกิดการคัดค้าน' },
    ],
    kpiMetrics: 'ระบบพร้อมใช้งาน 99.99% ปลอดภัย ไร้การโกง',
  },
];

export const TIER_LIGHT_THEME: Record<number, {
  label: string;
  badge: string;
  textColor: string;
}> = {
  1: { label: 'Tier 1: ผู้เสนอ', badge: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200', textColor: 'text-slate-800 dark:text-slate-200' },
  2: { label: 'Tier 2: ผู้รับงาน & Back Office', badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300', textColor: 'text-blue-700 dark:text-blue-400' },
  3: { label: 'Tier 3: ผู้ค้ำประกัน & QC', badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300', textColor: 'text-purple-700 dark:text-purple-400' },
  4: { label: 'Tier 4: ผู้อำนวยการวงการ', badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300', textColor: 'text-amber-800 dark:text-amber-400' },
  5: { label: 'Tier 5: แอดมิน & Escrow', badge: 'bg-red-50 text-brand-red border-red-200 dark:bg-red-950/60 dark:text-red-300', textColor: 'text-brand-red dark:text-red-400' },
};

export const INDUSTRY_CAP_PRESETS: Record<string, IndustryCapPreset> = {
  ind_01: {
    cash: { val: 600000, hint: 'วัสดุก่อสร้าง, สุขภัณฑ์, งานระบบ' },
    sweat: { val: 700000, hint: 'ช่างก่อสร้าง, สถาปนิก, ช่างตกแต่ง' },
    equip: { val: 800000, hint: 'เครื่องจักรสร้างบ้าน, นั่งร้าน, รถปูน' },
    venue: { val: 400000, hint: 'แปลงที่ดินจัดสรร / ที่ดินส่วนบุคคล' },
    ip: { val: 300000, hint: 'แบบบ้านมาตรฐาน, ใบอนุญาต อ.1' },
  },
  ind_02: {
    cash: { val: 500000, hint: 'งบจัดซื้อเวชภัณฑ์และยา' },
    sweat: { val: 600000, hint: 'แพทย์เฉพาะทาง, เภสัชกร, ที่ปรึกษา' },
    equip: { val: 500000, hint: 'เครื่องมือแพทย์, แล็บตรวจวิเคราะห์' },
    venue: { val: 200000, hint: 'คลินิก, ห้องตรวจผู้ป่วย' },
    ip: { val: 200000, hint: 'ใบอนุญาต อย., มาตรฐาน ISO 13485' },
  },
  ind_03: {
    cash: { val: 200000, hint: 'งบยิงโฆษณา, ทุนสำรองหมุนเวียน' },
    sweat: { val: 650000, hint: 'Full-stack Dev, UI/UX, PM' },
    equip: { val: 200000, hint: 'Cloud Server, GPU, เวิร์กสเตชัน' },
    venue: { val: 50000, hint: 'Coworking space, Server Room' },
    ip: { val: 400000, hint: 'Source Code, AI Models, ลิขสิทธิ์ซอฟต์แวร์' },
  },
  ind_04: {
    cash: { val: 150000, hint: 'ค่าจัดทำสื่อและเอกสารอบรม' },
    sweat: { val: 350000, hint: 'วิทยากร, ครูผู้สอน, นักพัฒนาหลักสูตร' },
    equip: { val: 100000, hint: 'ระบบ LMS, อุปกรณ์อัดคลิปการสอน' },
    venue: { val: 80000, hint: 'ห้องบรรยาย, สตูดิโอคลาสสด' },
    ip: { val: 120000, hint: 'หลักสูตรลิขสิทธิ์, คู่มือการเรียน' },
  },
  ind_05: {
    cash: { val: 300000, hint: 'วัตถุดิบสด, แพ็กเกจจิ้ง' },
    sweat: { val: 300000, hint: 'เชฟ, บาริสต้า, พนักงานบริการ' },
    equip: { val: 300000, hint: 'เตาอบอุตสาหกรรม, เครื่องชงกาแฟ, ตู้แช่' },
    venue: { val: 200000, hint: 'ครัวกลาง (Cloud Kitchen), หน้าร้าน' },
    ip: { val: 100000, hint: 'สูตรอาหารลับ, แบรนด์, เครื่องหมายการค้า' },
  },
  ind_06: {
    cash: { val: 300000, hint: 'ปุ๋ยอินทรีย์, เมล็ดพันธุ์' },
    sweat: { val: 450000, hint: 'แรงงานเพาะปลูก, นักปฐพีวิทยา' },
    equip: { val: 400000, hint: 'โดรนการเกษตร, รถแทรกเตอร์, ระบบน้ำหยด' },
    venue: { val: 500000, hint: 'ที่ดินฟาร์ม 10 ไร่, โรงเรือนปิด' },
    ip: { val: 150000, hint: 'สายพันธุ์พืช, มาตรฐาน GAP/อินทรีย์' },
  },
  ind_07: {
    cash: { val: 400000, hint: 'ค่าน้ำมัน, ค่าผ่านทาง' },
    sweat: { val: 400000, hint: 'พนักงานขับรถ, ผู้จัดการ Fleet' },
    equip: { val: 900000, hint: 'รถบรรทุก 10 ล้อ, ตู้เย็น Cold Chain' },
    venue: { val: 350000, hint: 'คลังสินค้ากระจายของ (Hub/DC)' },
    ip: { val: 150000, hint: 'ซอฟต์แวร์ Route Optimization, สัมปทาน' },
  },
  ind_08: {
    cash: { val: 600000, hint: 'สภาพคล่องสำรองค้ำประกัน' },
    sweat: { val: 500000, hint: 'นักวิเคราะห์การเงิน, ผู้สอบบัญชี CPA' },
    equip: { val: 150000, hint: 'ระบบ ERP, ซอฟต์แวร์บัญชี BOQ' },
    venue: { val: 150000, hint: 'สำนักงานการเงิน' },
    ip: { val: 200000, hint: 'โมเดลคำนวณเครดิต, ระบบวางแผนภาษี' },
  },
  ind_09: {
    cash: { val: 400000, hint: 'งบของใช้หมุนเวียน, งบต้อนรับ' },
    sweat: { val: 500000, hint: 'ผู้จัดการโรงแรม, ฝ่ายบริการลูกค้า' },
    equip: { val: 400000, hint: 'เฟอร์นิเจอร์ตกแต่ง, เครื่องอำนวยความสะดวก' },
    venue: { val: 1000000, hint: 'อาคารโรงแรม, รีสอร์ตริมหาด' },
    ip: { val: 200000, hint: 'แบรนด์โรงแรม, ระบบบริหารการจอง OTA' },
  },
  ind_10: {
    cash: { val: 600000, hint: 'วัตถุดิบชิ้นส่วนอุตสาหกรรม' },
    sweat: { val: 700000, hint: 'วิศวกรโรงงาน, ช่างเทคนิคฝ่ายผลิต' },
    equip: { val: 1100000, hint: 'เครื่องจักร CNC, สายพานลำเลียง' },
    venue: { val: 450000, hint: 'โรงงานมาตรฐาน, คลังจัดเก็บสินค้า' },
    ip: { val: 150000, hint: 'พิมพ์เขียวชิ้นส่วน, มาตรฐาน ISO 9001' },
  },
  ind_11: {
    cash: { val: 300000, hint: 'งบการตลาดและโปรดักชัน' },
    sweat: { val: 500000, hint: 'ผู้กำกับ, ครีเอทีฟ, ช่างภาพ, นักตัดต่อ' },
    equip: { val: 350000, hint: 'กล้อง Cinema 8K, ไฟสตูดิโอ, ห้องตัดต่อ' },
    venue: { val: 100000, hint: 'สตูดิโอถ่ายทำ, ห้องบันทึกเสียง' },
    ip: { val: 150000, hint: 'ลิขสิทธิ์บทประพันธ์, เพลงประกอบ, ฟุตเทจ' },
  },
  ind_12: {
    cash: { val: 150000, hint: 'ค่าธรรมเนียมศาล, ค่าธรรมเนียมราชการ' },
    sweat: { val: 550000, hint: 'ทนายความว่าความ, นักร่างสัญญา' },
    equip: { val: 80000, hint: 'ฐานข้อมูลคำพิพากษาฎีกา, ระบบเก็บเอกสารลับ' },
    venue: { val: 100000, hint: 'สำนักงานกฎหมาย, ห้องเจรจาไกล่เกลี่ย' },
    ip: { val: 120000, hint: 'สัญญามาตรฐาน, ข้อตกลงอนุญาโตตุลาการ' },
  },
};

export const INDUSTRY_01_SUB_LIST: SubIndustryItem[] = [
  {
    id: 'sub_01_res',
    code: '01.1',
    name: 'อสังหาริมทรัพย์เพื่อการอยู่อาศัย',
    description: 'บ้านเดี่ยว ทาวน์โฮม คอนโดมิเนียม และที่พักอาศัยทุกรูปแบบ',
    preset: {
      cash: { val: 600000, hint: 'วัสดุก่อสร้าง, สุขภัณฑ์, งานระบบ' },
      sweat: { val: 700000, hint: 'ช่างก่อสร้าง, สถาปนิก, ช่างตกแต่ง' },
      equip: { val: 800000, hint: 'เครื่องจักรสร้างบ้าน, นั่งร้าน, รถปูน' },
      venue: { val: 400000, hint: 'แปลงที่ดินจัดสรร / ที่ดินส่วนบุคคล' },
      ip: { val: 300000, hint: 'แบบบ้านมาตรฐาน, ใบอนุญาต อ.1' },
    },
    segments: [
      { id: 'seg_res_1', name: 'บ้านเดี่ยว (Single House)', preset: { cash: { val: 800000, hint: 'ปูน, เหล็ก, สุขภัณฑ์พรีเมียม' }, sweat: { val: 900000, hint: 'ผู้รับเหมาหลัก, มัณฑนากร' }, equip: { val: 400000, hint: 'เครื่องมือช่าง, นั่งร้าน' }, venue: { val: 1500000, hint: 'ที่ดิน 50-100 ตร.ว.' }, ip: { val: 200000, hint: 'แบบสถาปัตยกรรม, ขออนุญาต' } } },
      { id: 'seg_res_2', name: 'ทาวน์โฮม (Townhome)', preset: { cash: { val: 600000, hint: 'วัสดุก่อสร้างมาตรฐาน' }, sweat: { val: 600000, hint: 'ช่างก่อสร้าง, วิศวกร' }, equip: { val: 300000, hint: 'เครื่องมือช่าง' }, venue: { val: 800000, hint: 'ที่ดิน 20-30 ตร.ว.' }, ip: { val: 150000, hint: 'แบบบ้านมาตรฐาน' } } },
      { id: 'seg_res_3', name: 'คอนโด Low-Rise', preset: { cash: { val: 15000000, hint: 'วัสดุตกแต่ง, ระบบลิฟต์, งานระบบ' }, sweat: { val: 12000000, hint: 'ผู้รับเหมาบริษัท, วิศวกรโครงการ' }, equip: { val: 8000000, hint: 'ทาวเวอร์เครน, เครื่องจักรใหญ่' }, venue: { val: 20000000, hint: 'ที่ดิน 1-2 ไร่' }, ip: { val: 3000000, hint: 'EIA, สถาปัตยกรรมโครงการ' } } },
      { id: 'seg_res_4', name: 'คอนโด High-Rise', preset: { cash: { val: 40000000, hint: 'โครงสร้างกระจก, ลิฟต์ความเร็วสูง' }, sweat: { val: 30000000, hint: 'ทีมวิศวกรผู้เชี่ยวชาญ, ที่ปรึกษา' }, equip: { val: 20000000, hint: 'เครนสูง, ระบบความปลอดภัย' }, venue: { val: 50000000, hint: 'ที่ดินทำเลศักยภาพ (CBD)' }, ip: { val: 8000000, hint: 'EIA, การประเมินผลกระทบสิ่งแวดล้อม' } } },
      { id: 'seg_res_5', name: 'รีโนเวท/ต่อเติม (Renovation)', preset: { cash: { val: 250000, hint: 'สี, กระเบื้อง, สุขภัณฑ์ใหม่' }, sweat: { val: 300000, hint: 'ช่างต่อเติม, ช่างสี' }, equip: { val: 100000, hint: 'เครื่องมือช่างพื้นฐาน' }, venue: { val: 0, hint: 'ใช้พื้นที่เดิม (ไม่ต้องประเมินที่ดิน)' }, ip: { val: 50000, hint: 'แบบร่างต่อเติม' } } }
    ]
  },
  {
    id: 'sub_01_com',
    code: '01.2',
    name: 'อสังหาริมทรัพย์เพื่อการพาณิชย์',
    description: 'อาคารสำนักงาน คอมมูนิตี้มอลล์ ตึกแถว และศูนย์การค้า',
    preset: {
      cash: { val: 1200000, hint: 'งบระบบลิฟต์, ระบบปรับอากาศกลาง, โครงสร้างเหล็ก' },
      sweat: { val: 1100000, hint: 'วิศวกรโยธาควบคุมงาน, ช่างระบบอาคารพาณิชย์' },
      equip: { val: 1200000, hint: 'ทาวเวอร์เครน, เครื่องจักรงานโครงสร้างขนาดใหญ่' },
      venue: { val: 600000, hint: 'ที่ดินทำเลพาณิชย์ / ตึกแถว / คอมมูนิตี้มอลล์' },
      ip: { val: 400000, hint: 'แบบสถาปัตยกรรมพาณิชย์, รายงาน EIA, ผังเมือง' },
    },
    segments: [
      { id: 'seg_com_1', name: 'อาคารสำนักงาน (Office Building)', preset: { cash: { val: 20000000, hint: 'กระจก Facade, ระบบแอร์ส่วนกลาง' }, sweat: { val: 15000000, hint: 'วิศวกรระบบอาคาร, ช่างเทคนิค' }, equip: { val: 10000000, hint: 'ระบบลิฟต์, เครนก่อสร้าง' }, venue: { val: 30000000, hint: 'ที่ดินริมถนนหลัก' }, ip: { val: 5000000, hint: 'มาตรฐาน LEED/WELL, EIA' } } },
      { id: 'seg_com_2', name: 'คอมมูนิตี้มอลล์ (Community Mall)', preset: { cash: { val: 15000000, hint: 'โครงสร้างเหล็ก, งานแลนด์สเคป' }, sweat: { val: 12000000, hint: 'ทีมก่อสร้าง, ภูมิสถาปนิก' }, equip: { val: 8000000, hint: 'เครื่องจักรงานดิน, เครื่องมือก่อสร้าง' }, venue: { val: 25000000, hint: 'ที่ดินแปลงใหญ่ใกล้ชุมชน' }, ip: { val: 3000000, hint: 'ใบอนุญาตพาณิชย์, แบรนดิ้ง' } } },
      { id: 'seg_com_3', name: 'ตึกแถว/โฮมออฟฟิศ (Shophouse)', preset: { cash: { val: 1500000, hint: 'คอนกรีตเสริมเหล็ก, วัสดุตกแต่ง' }, sweat: { val: 1200000, hint: 'ผู้รับเหมาทั่วไป, ช่างปูน' }, equip: { val: 800000, hint: 'นั่งร้าน, รถปูน' }, venue: { val: 3000000, hint: 'ที่ดินหน้ากว้างติดถนน' }, ip: { val: 300000, hint: 'แบบมาตรฐานอาคารพาณิชย์' } } },
      { id: 'seg_com_4', name: 'โชว์รูมสินค้า (Retail Showroom)', preset: { cash: { val: 5000000, hint: 'โครงสร้างเหล็กช่วงกว้าง, กระจกบานใหญ่' }, sweat: { val: 4000000, hint: 'ช่างโครงสร้างเหล็ก, ช่างตกแต่งภายใน' }, equip: { val: 3000000, hint: 'รถเครนเล็ก, อุปกรณ์ติดตั้งกระจก' }, venue: { val: 10000000, hint: 'ที่ดินทำเลถนนสายหลัก' }, ip: { val: 1000000, hint: 'แบบโชว์รูมมาตรฐาน' } } },
      { id: 'seg_com_5', name: 'โคเวิร์กกิ้งสเปซ (Co-Working Space)', preset: { cash: { val: 3000000, hint: 'เฟอร์นิเจอร์สำนักงาน, ระบบ Network' }, sweat: { val: 2000000, hint: 'มัณฑนากร, ช่างระบบ IT' }, equip: { val: 1000000, hint: 'Server, Smart Access Control' }, venue: { val: 0, hint: 'พื้นที่เช่าอาคารเดิม' }, ip: { val: 500000, hint: 'ซอฟต์แวร์ระบบจอง, แบรนดิ้ง' } } }
    ]
  },
  {
    id: 'sub_01_ind',
    code: '01.3',
    name: 'อสังหาริมทรัพย์เพื่ออุตสาหกรรม',
    description: 'โรงงานอุตสาหกรรม คลังสินค้า โกดัง และศูนย์กระจายสินค้า Logistics',
    preset: {
      cash: { val: 1000000, hint: 'โครงสร้างเหล็กโรงงาน, งานเทพื้นรับน้ำหนักสูง' },
      sweat: { val: 800000, hint: 'วิศวกรโรงงาน, ช่างกลโครงสร้าง, ช่างไฟโรงงาน' },
      equip: { val: 1200000, hint: 'รถเครนติดตั้งชิ้นส่วนพรีคาสต์, เครื่องจักรเทพื้น' },
      venue: { val: 700000, hint: 'ที่ดินนิคมอุตสาหกรรม / โกดัง Logistics' },
      ip: { val: 300000, hint: 'ใบอนุญาตประกอบกิจการ รง.4, มาตรฐานอัคคีภัย NFPA' },
    },
    segments: [
      { id: 'seg_ind_1', name: 'คลังสินค้าทั่วไป (General Warehouse)', preset: { cash: { val: 4000000, hint: 'โครงสร้างเหล็กสำเร็จรูป PEB' }, sweat: { val: 2500000, hint: 'ช่างติดตั้ง PEB, วิศวกรควบคุม' }, equip: { val: 2000000, hint: 'รถเครน, เครื่องขัดมันพื้น' }, venue: { val: 5000000, hint: 'ที่ดินใกล้จุดตัดทางหลวง' }, ip: { val: 500000, hint: 'แบบคลังสินค้ามาตรฐาน' } } },
      { id: 'seg_ind_2', name: 'คลังสินค้าห้องเย็น (Cold Storage)', preset: { cash: { val: 8000000, hint: 'ผนังฉนวน PU Foam, ระบบทำความเย็นอุตสาหกรรม' }, sweat: { val: 4000000, hint: 'วิศวกรระบบทำความเย็น, ช่างเทคนิค' }, equip: { val: 6000000, hint: 'คอมเพรสเซอร์ขนาดใหญ่, ท่อดักท์' }, venue: { val: 5000000, hint: 'ที่ดินในโซนโลจิสติกส์' }, ip: { val: 1000000, hint: 'มาตรฐาน GMP/HACCP สำหรับคลัง' } } },
      { id: 'seg_ind_3', name: 'โรงงานขนาดเล็ก (Mini Factory)', preset: { cash: { val: 3000000, hint: 'โครงสร้างคอนกรีต+เหล็ก, หลังคาเมทัลชีท' }, sweat: { val: 2000000, hint: 'ผู้รับเหมาทั่วไป, ช่างไฟโรงงาน' }, equip: { val: 1500000, hint: 'อุปกรณ์ตอกเสาเข็มสปัน, นั่งร้าน' }, venue: { val: 4000000, hint: 'ที่ดินในนิคมอุตสาหกรรมย่อย' }, ip: { val: 600000, hint: 'ใบอนุญาต รง.4 ขนาดย่อม' } } },
      { id: 'seg_ind_4', name: 'โรงงานอุตสาหกรรมหนัก (Heavy Industry)', preset: { cash: { val: 30000000, hint: 'ฐานรากรับน้ำหนักสูงพิเศษ, โครงสร้างทนสารเคมี' }, sweat: { val: 20000000, hint: 'วิศวกรเฉพาะทาง, ผู้เชี่ยวชาญเครื่องจักร' }, equip: { val: 25000000, hint: 'เครื่องจักรหนัก, ปั้นจั่นขนาดใหญ่' }, venue: { val: 40000000, hint: 'ที่ดินในนิคมอุตสาหกรรมหนัก' }, ip: { val: 5000000, hint: 'ใบอนุญาต รง.4 เฉพาะทาง, EIA' } } },
      { id: 'seg_ind_5', name: 'ศูนย์กระจายสินค้า (Logistics Hub)', preset: { cash: { val: 15000000, hint: 'ลานโหลดสินค้าคอนกรีตเสริมเหล็กหนาพิเศษ' }, sweat: { val: 10000000, hint: 'ทีมก่อสร้างลาน, วิศวกรโลจิสติกส์' }, equip: { val: 8000000, hint: 'ระบบ Dock Leveler, ออโตเมชันบางส่วน' }, venue: { val: 20000000, hint: 'ที่ดินแปลงใหญ่ติดถนนมอเตอร์เวย์' }, ip: { val: 2000000, hint: 'ซอฟต์แวร์ WMS เบื้องต้น' } } }
    ]
  },
  {
    id: 'sub_01_agr',
    code: '01.4',
    name: 'อสังหาริมทรัพย์เพื่อการเกษตรกรรม',
    description: 'ฟาร์มเกษตรกรรม โรงเรือนเพาะปลูก แหล่งกักเก็บน้ำ และโรงแปรรูป',
    preset: {
      cash: { val: 300000, hint: 'ระบบท่อส่งน้ำชลประทาน, ดิน/ปุ๋ยปรับสภาพ, บ่อน้ำ' },
      sweat: { val: 400000, hint: 'วิศวกรชลประทาน, ช่างสร้างโรงเรือน, ผู้เชี่ยวชาญดิน' },
      equip: { val: 500000, hint: 'รถแทรกเตอร์ปรับแปลง, โดรนเกษตร, ระบบ Smart Farm' },
      venue: { val: 600000, hint: 'ที่ดินเพื่อการเกษตร 10-20 ไร่, แหล่งน้ำธรรมชาติ' },
      ip: { val: 200000, hint: 'มาตรฐาน GAP, แบบโรงเรือนควบคุมอุณหภูมิ EVAP' },
    },
    segments: [
      { id: 'seg_agr_1', name: 'โรงเรือนระบบปิด (EVAP Green House)', preset: { cash: { val: 500000, hint: 'พลาสติกคลุมโรงเรือน, พัดลมระบายอากาศ, แผ่น Cooling Pad' }, sweat: { val: 300000, hint: 'ช่างประกอบโรงเรือน, วิศวกรเกษตร' }, equip: { val: 400000, hint: 'เซ็นเซอร์ IoT, ระบบควบคุมสภาพแวดล้อม' }, venue: { val: 800000, hint: 'ที่ดินเกษตร 1-2 ไร่' }, ip: { val: 100000, hint: 'แบบโรงเรือน EVAP มาตรฐาน' } } },
      { id: 'seg_agr_2', name: 'ฟาร์มปศุสัตว์/โรงเรือนเลี้ยงสัตว์ (Livestock Farm)', preset: { cash: { val: 1200000, hint: 'โครงสร้างโรงเรือนเหล็กชุบซิงค์, ไซโลอาหารสัตว์' }, sweat: { val: 800000, hint: 'ช่างก่อสร้างฟาร์ม, สัตวบาล' }, equip: { val: 100000, hint: 'ระบบให้อาหารอัตโนมัติ, ระบบบำบัดน้ำเสีย' }, venue: { val: 2000000, hint: 'ที่ดินห่างไกลชุมชน 10-20 ไร่' }, ip: { val: 300000, hint: 'มาตรฐานฟาร์มปศุสัตว์ (GAP/GMP)' } } },
      { id: 'seg_agr_3', name: 'ฟาร์มเพาะเลี้ยงสัตว์น้ำ (Aquaculture Farm)', preset: { cash: { val: 800000, hint: 'ผ้ายางปูบ่อ, ท่อ PE, เครื่องตีน้ำ' }, sweat: { val: 500000, hint: 'แรงงานขุดบ่อ, ผู้เชี่ยวชาญประมง' }, equip: { val: 700000, hint: 'รถแบคโฮ, ปั๊มน้ำ, เครื่องปั่นไฟสำรอง' }, venue: { val: 1500000, hint: 'ที่ดินใกล้แหล่งน้ำธรรมชาติ' }, ip: { val: 200000, hint: 'มาตรฐานฟาร์มเพาะเลี้ยงสัตว์น้ำ' } } },
      { id: 'seg_agr_4', name: 'ไซโล/ลานตากผลผลิต (Grain Silo & Drying Yard)', preset: { cash: { val: 3000000, hint: 'คอนกรีตลานตาก, โครงสร้างเหล็กไซโล' }, sweat: { val: 1500000, hint: 'ช่างติดตั้งไซโล, วิศวกรโยธา' }, equip: { val: 4000000, hint: 'เครื่องอบลดความชื้น, สายพานลำเลียง' }, venue: { val: 3000000, hint: 'ที่ดินใกล้แหล่งเพาะปลูกหลัก' }, ip: { val: 500000, hint: 'แบบวิศวกรรมโครงสร้างไซโล' } } },
      { id: 'seg_agr_5', name: 'สวนเกษตรผสมผสาน (Integrated Organic Farm)', preset: { cash: { val: 400000, hint: 'พันธุ์พืช, ปุ๋ยอินทรีย์, ระบบน้ำหยด' }, sweat: { val: 600000, hint: 'นักปฐพีวิทยา, แรงงานเกษตรกรรม' }, equip: { val: 500000, hint: 'รถไถเล็ก, อุปกรณ์ขุดเจาะน้ำบาดาล' }, venue: { val: 1500000, hint: 'ที่ดินเกษตร 10-30 ไร่' }, ip: { val: 200000, hint: 'มาตรฐานเกษตรอินทรีย์ (Organic)' } } }
    ]
  },
  {
    id: 'sub_01_hos',
    code: '01.5',
    name: 'อสังหาริมทรัพย์เพื่อการพักผ่อนและท่องเที่ยว',
    description: 'โรงแรม บูทีกรีสอร์ต พูลวิลล่า โฮมสเตย์ และสถานที่ท่องเที่ยว',
    preset: {
      cash: { val: 800000, hint: 'เฟอร์นิเจอร์ตกแต่งรีสอร์ต, สุขภัณฑ์พรีเมียม' },
      sweat: { val: 700000, hint: 'มัณฑนากรโรงแรม, ภูมิสถาปนิก, ช่างงานไม้ประณีต' },
      equip: { val: 800000, hint: 'สระว่ายน้ำระบบเกลือ, เครื่องกำเนิดไฟฟ้าสำรอง' },
      venue: { val: 1200000, hint: 'ที่ดินวิวธรรมชาติ / ติดชายหาด / ริมเขา' },
      ip: { val: 300000, hint: 'แบรนด์บูทีกรีสอร์ต, ใบอนุญาตประกอบธุรกิจโรงแรม' },
    },
    segments: [
      { id: 'seg_hos_1', name: 'บูทีกโฮเทล (Boutique Hotel)', preset: { cash: { val: 8000000, hint: 'วัสดุตกแต่งเกรดพรีเมียม, สุขภัณฑ์นำเข้า' }, sweat: { val: 6000000, hint: 'มัณฑนากร, ช่างฝีมือเฉพาะทาง' }, equip: { val: 4000000, hint: 'ระบบคีย์การ์ด, ลิฟต์โดยสารขนาดเล็ก' }, venue: { val: 15000000, hint: 'ที่ดินทำเลท่องเที่ยวในเมือง' }, ip: { val: 2000000, hint: 'แบรนดิ้ง, ใบอนุญาตโรงแรม' } } },
      { id: 'seg_hos_2', name: 'พูลวิลล่า (Luxury Pool Villa)', preset: { cash: { val: 3000000, hint: 'กระเบื้องสระว่ายน้ำ, เฟอร์นิเจอร์สั่งทำ' }, sweat: { val: 2000000, hint: 'ช่างรับเหมาสร้างบ้าน, ช่างระบบสระน้ำ' }, equip: { val: 1500000, hint: 'ระบบกรองสระ, ปั๊มน้ำ, แอร์' }, venue: { val: 5000000, hint: 'ที่ดินวิวทะเล/ภูเขา 100-200 ตร.ว.' }, ip: { val: 500000, hint: 'แบบบ้านพักตากอากาศพรีเมียม' } } },
      { id: 'seg_hos_3', name: 'รีสอร์ตเชิงนิเวศ (Eco Resort)', preset: { cash: { val: 2000000, hint: 'วัสดุธรรมชาติ (ไม้, ไม้ไผ่), ระบบโซลาร์' }, sweat: { val: 2500000, hint: 'ช่างท้องถิ่น, ภูมิสถาปนิก' }, equip: { val: 1500000, hint: 'ระบบบำบัดน้ำเสียธรรมชาติ, อินเวอร์เตอร์' }, venue: { val: 8000000, hint: 'ที่ดินท่ามกลางธรรมชาติป่าเขา' }, ip: { val: 1000000, hint: 'มาตรฐานการท่องเที่ยวเชิงนิเวศ (Eco)' } } },
      { id: 'seg_hos_4', name: 'โฮมสเตย์/เกษตรท่องเที่ยว (Agritourism)', preset: { cash: { val: 500000, hint: 'วัสดุก่อสร้างพื้นถิ่น, ของตกแต่งท้องถิ่น' }, sweat: { val: 500000, hint: 'แรงงานชุมชน, ช่างไม้' }, equip: { val: 300000, hint: 'เครื่องใช้ไฟฟ้าพื้นฐาน' }, venue: { val: 2000000, hint: 'พื้นที่เกษตรที่มีจุดเด่น' }, ip: { val: 100000, hint: 'ใบอนุญาตโฮมสเตย์มาตรฐาน' } } },
      { id: 'seg_hos_5', name: 'ลานกางเต็นท์ (Camping & RV Park)', preset: { cash: { val: 800000, hint: 'หินคลุกปรับลาน, งานห้องน้ำรวม, ระบบไฟส่องสว่าง' }, sweat: { val: 500000, hint: 'ช่างประปา, ช่างไฟ, คนงานปรับพื้นที่' }, equip: { val: 400000, hint: 'รถไถปรับเกรดดิน, ปั๊มน้ำบาดาล' }, venue: { val: 3000000, hint: 'ที่ดินวิวสวยริมน้ำ/หน้าผา' }, ip: { val: 150000, hint: 'แบบแปลนสุขาภิบาลและภูมิทัศน์' } } }
    ]
  },
];

export const SUB_INDUSTRIES_MAP: Record<string, SubIndustryItem[]> = {
  ind_01: INDUSTRY_01_SUB_LIST,
};

export const INITIAL_CAP_TABLE: CapTableItem[] = [
  { id: 'cash', name: 'เงินสด (Cash)', value: 600000, color: '#56b6f7' },
  { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: 700000, color: '#9d9ff7' },
  { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: 800000, color: '#3bd18e' },
  { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: 400000, color: '#a3e635' },
  { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: 300000, color: '#f3e8c8' },
];

export const PROBLEM_TOOLS_LIST: ProblemToolItem[] = [
  {
    id: 'tool_escrow_dispute',
    category: 'DISPUTE',
    categoryLabel: 'ข้อพิพาท/สัญญา',
    title: 'ระบบระงับข้อพิพาทเงินงวดเร่งด่วน',
    subtitle: 'Escrow Fast-Track Dispute Resolver',
    icon: 'fa-solid fa-scale-balanced',
    description: 'ปลดล็อกเงินงวดค้าง หรือจัดการกรณีผู้ว่าจ้างไม่เซ็นตรวจรับงาน โดยส่งผู้ตรวจรับอิสระ Tier 3 ตรวจสอบและรายงานผลภายใน 24 ชม.',
    tierSupport: 3,
    slaTime: '24 ชม.',
    steps: [
      'กรอกรหัสสัญญา Escrow และแนบภาพหลักฐานผลงานหน้าไซต์',
      'ระบบมอบหมายผู้ตรวจรับอิสระ (Tier 3 QC) เข้าพื้นที่โดยตรง',
      'หากผลงานได้มาตรฐาน วงเงินค่างวดจะถูกปลดล็อกให้ผู้รับเหมาทันที',
    ],
  },
  {
    id: 'tool_boq_balancer',
    category: 'BUDGET',
    categoryLabel: 'งบประมาณ/การเงิน',
    title: 'เครื่องมือเทียบราคากลาง BOQ & ป้องกันโกง',
    subtitle: 'Dynamic BOQ & Scope Balancer',
    icon: 'fa-solid fa-calculator',
    description: 'ตรวจสอบราคากลางวัสดุและค่าแรงตามดัชนีกระทรวงพาณิชย์และตลาดจริง ป้องกันการเสนอราคาสูงเกินจริงหรือการกดราคาจนทิ้งงาน',
    tierSupport: 2,
    slaTime: 'ทันที',
    steps: [
      'อัปโหลดไฟล์ BOQ หรือพิมพ์รายการวัสดุและปริมาณงาน',
      'ระบบคำนวณเปรียบเทียบกับฐานข้อมูลราคากลาง 12 สายงาน',
      'รับรายงานความเสี่ยง (Risk Score) และข้อแนะนำเกณฑ์ราคาที่ยุติธรรม',
    ],
  },
  {
    id: 'tool_standby_workforce',
    category: 'WORKFORCE',
    categoryLabel: 'แรงงาน/บุคลากร',
    title: 'ศูนย์ระดมทีมช่างสำรองฉุกเฉิน',
    subtitle: 'Instant Standby Workforce Pool',
    icon: 'fa-solid fa-people-carry-box',
    description: 'แก้ปัญหาทีมงานเดิมสะดุด ช่างป่วย หรือทิ้งงานกลางคัน ดึงผู้เชี่ยวชาญ Tier 2 ในเครือข่ายที่ผ่านการรับรองเข้าเสียบแทนได้ทันที',
    tierSupport: 2,
    slaTime: '2-4 ชม.',
    steps: [
      'ระบุตำแหน่งงานที่ขาดและไซต์งานที่ต้องการคนด่วน',
      'ระบบ Matching ช่างหรือวิศวกรที่ว่างงานในรัศมีใกล้เคียง',
      'ทำสัญญาเชื่อมต่อระยะสั้นคุ้มครองผ่าน Escrow ทันที',
    ],
  },
  {
    id: 'tool_bond_claim',
    category: 'QUALITY',
    categoryLabel: 'ความเสี่ยง/การันตี',
    title: 'ระบบเคลมกองทุนค้ำประกันความเสียหาย',
    subtitle: 'Performance Bond Claim Shield',
    icon: 'fa-solid fa-shield-halved',
    description: 'เมื่อเกิดความเสียหายหรือการผิดสัญญาชัดเจน สามารถเบิกจ่ายเงินชดเชยจากกองทุนค้ำประกัน Tier 3 ได้ทันทีโดยไม่ต้องรอผลฟ้องร้องศาล',
    tierSupport: 3,
    slaTime: '48 ชม.',
    steps: [
      'ยื่นคำร้องพร้อมบันทึกข้อตกลง KPI ที่ไม่เป็นไปตามเกณฑ์',
      'คณะกรรมการ Tier 4 พิจารณาตรวจสอบบันทึกธุรกรรมในระบบ',
      'โอนเงินชดเชยตรงเข้าบัญชีผู้เสียหายจากตู้เซฟค้ำประกัน',
    ],
  },
  {
    id: 'tool_legal_screener',
    category: 'DISPUTE',
    categoryLabel: 'ข้อพิพาท/สัญญา',
    title: 'ระบบสแกนสัญญา & ใบอนุญาต อ.1 อัตโนมัติ',
    subtitle: 'Permit & Legal Compliance Screener',
    icon: 'fa-solid fa-file-shield',
    description: 'ตรวจสอบความถูกต้องของสัญญาว่าจ้าง ข้อกำหนดส่งมอบงาน และความสอดคล้องกับกฎหมายควบคุมอาคาร ผังเมือง และสิ่งแวดล้อม',
    tierSupport: 4,
    slaTime: '12 ชม.',
    steps: [
      'อัปโหลดเอกสารสัญญาหรือกรอกข้อความที่ต้องการตรวจสอบ',
      'AI Legal Engine สแกนหาข้อกำหนดที่เสียเปรียบและช่องโหว่ทางกฎหมาย',
      'ส่งให้ทนายความที่ปรึกษา Tier 2 ประทับตรารับรองความถูกต้อง',
    ],
  },
];
