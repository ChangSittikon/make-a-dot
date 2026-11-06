import { D1State } from './types';

export const D1_STATES: D1State[] = [
  {
    code: 'D1.1',
    label: 'พนักงานประจำ',
    role: 'Corporate Employee',
    subNodes: [
      { code: 'D1.1.1', title: 'ปฏิบัติการ', description: 'เน้นเลื่อนตำแหน่งและลดเวลาทำงานเอกสาร' },
      { code: 'D1.1.2', title: 'ผู้จัดการ', description: 'เน้นบริหารทีม เจรจาราคากลาง และคุม KPI' },
      { code: 'D1.1.3', title: 'เตรียมเปิดธุรกิจ', description: 'เน้นสะสมทุนชีวิตและสำรองสภาพคล่องก่อนลาออก' },
    ],
  },
  {
    code: 'D1.2',
    label: 'ฟรีแลนซ์',
    role: 'Independent Contractor',
    subNodes: [
      { code: 'D1.2.1', title: 'ควบงานประจำ', description: 'แบ่งเวลาหลังเลิกงาน ระวังข้อกำหนด Non-Compete กับนายจ้างหลัก', note: 'ข้อควรระวัง: ตรวจสอบสัญญาจ้างงานประจำเรื่องการรับงานนอก' },
      { code: 'D1.2.2', title: 'ฟรีแลนซ์เต็มตัว', description: 'บริหารกระแสเงินสดรายงวดและล็อกงวดเงินตามความคืบหน้าจริง' },
    ],
  },
  {
    code: 'D1.3',
    label: 'เจ้าของกิจการ',
    role: 'Business Owner & SME',
    subNodes: [
      { code: 'D1.3.1', title: 'ผู้รับเหมา SME', description: 'คุมต้นทุนแรงงาน ป้องกันเงินรั่วไหล และคุมเครดิตเทอมซัพพลายเออร์' },
      { code: 'D1.3.2', title: 'Developer', description: 'วางระบบตรวจสอบถ่วงดุลป้องกันการทุจริตและคุมงบ TDC', note: 'เน้น: ระบบอนุมัติ 3 ทาง แยกจัดซื้อ วิศวกร และบัญชี' },
    ],
  },
  {
    code: 'D1.4',
    label: 'คนว่างงาน',
    role: 'Career Transitioner',
    subNodes: [
      { code: 'D1.4.1', title: 'เพิ่งถูกเลิกจ้าง', description: 'ตรวจสอบสิทธิ์ค่าชดเชยตามกฎหมายแรงงานและคำนวณ Survival Burn Rate', note: 'ด่วน: ยื่นประกันสังคมภายใน 30 วัน' },
      { code: 'D1.4.2', title: 'ย้ายสายงานด่วน', description: 'สกัดทักษะแก่น 20% สร้างพอร์ตชิ้นงานจริงเข้าสู่ตลาดแรงงานใน 30 วัน' },
    ],
  },
];
