'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { BottomTabBar } from '@/components/shared/BottomTabBar';

/* ================================================================== */
/*  Types & Interfaces                                                 */
/* ================================================================== */

type MainTabType = 'PROCESS' | 'CAPITAL' | 'SOLVER' | 'ECOSYSTEM';

interface IndustryItem {
  id: string;
  code: string;
  name: string;
  icon: string;
  description: string;
  activeBounties: number;
}

interface BackOfficeEngineItem {
  id: string;
  name: string;
  thName: string;
  icon: string;
  description: string;
  tierResponsible: number;
}

interface SynergyRoleNode {
  id: string;
  tier: 1 | 2 | 3 | 4 | 5;
  roleCode: 'USER' | 'PROFESSIONAL' | 'GUARANTOR' | 'DIRECTOR' | 'ADMIN';
  title: string;
  category: 'FIELD' | 'BACK_OFFICE' | 'SAFETY' | 'GOVERNANCE';
  originIndustry: string;
  summary: string;
  deliverables: { targetId: string; label: string }[];
  dependsOn: { sourceId: string; label: string }[];
  kpiMetrics: string;
}

interface ProblemToolItem {
  id: string;
  category: 'DISPUTE' | 'BUDGET' | 'WORKFORCE' | 'QUALITY';
  categoryLabel: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  tierSupport: number;
  slaTime: string;
  steps: string[];
}

interface CapTableItem {
  id: string;
  name: string;
  value: number;
  color: string;
}

/* ================================================================== */
/*  Master Data: 12 Industries & 4 Back Office Engines (Tab 4)         */
/* ================================================================== */

const INDUSTRIES_LIST: IndustryItem[] = [
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

const BACK_OFFICE_ENGINES: BackOfficeEngineItem[] = [
  { id: 'eng_escrow', name: 'Escrow Vault Protocol', thName: 'ระบบตู้เซฟล็อกเงินงวด', icon: 'fa-solid fa-lock', description: 'ล็อกเงินค่างวดอัตโนมัติ และปล่อยตาม Milestone ที่ผ่านการตรวจรับ', tierResponsible: 5 },
  { id: 'eng_guarantor', name: 'Guarantor Pool & QC', thName: 'ระบบค้ำประกันความเสี่ยง', icon: 'fa-solid fa-shield-halved', description: 'วาง Performance Bond ป้องกันการทิ้งงาน 100% พร้อมทีมตรวจรับงานอิสระ', tierResponsible: 3 },
  { id: 'eng_negotiate', name: 'Smart Negotiation Sandbox', thName: 'ระบบเจรจาต่อรอง KPI & ราคา', icon: 'fa-solid fa-handshake', description: 'จับคู่ราคาอ้างอิงตาม Market Pulse เพื่อความเสมอภาคของทั้งสองฝ่าย', tierResponsible: 2 },
  { id: 'eng_arbitration', name: 'Arbitration Jury System', thName: 'ระบบศาลลูกขุนอนุญาโตตุลาการ', icon: 'fa-solid fa-gavel', description: 'กลไกโหวตตัดสินข้อพิพาทแบบกระจายศูนย์โดยผู้ทรงคุณวุฒิประจำวงการ', tierResponsible: 4 },
];

const CONSTRUCTION_SYNERGY_ROLES: SynergyRoleNode[] = [
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

const TIER_LIGHT_THEME: Record<number, {
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

/* ================================================================== */
/*  Master Data: Cap Table Simulation Initial Data & Presets (Tab 2)  */
/* ================================================================== */

interface IndustryCapPreset {
  cash: { val: number; hint: string };
  sweat: { val: number; hint: string };
  equip: { val: number; hint: string };
  venue: { val: number; hint: string };
  ip: { val: number; hint: string };
}

const INDUSTRY_CAP_PRESETS: Record<string, IndustryCapPreset> = {
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
interface ProjectSegmentItem {
  id: string;
  name: string;
  preset: IndustryCapPreset;
}

interface SubIndustryItem {
  id: string;
  code: string;
  name: string;
  description: string;
  preset: IndustryCapPreset;
  segments?: ProjectSegmentItem[];
}

const INDUSTRY_01_SUB_LIST: SubIndustryItem[] = [
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
      { id: 'seg_agr_2', name: 'ฟาร์มปศุสัตว์/โรงเรือนเลี้ยงสัตว์ (Livestock Farm)', preset: { cash: { val: 1200000, hint: 'โครงสร้างโรงเรือนเหล็กชุบซิงค์, ไซโลอาหารสัตว์' }, sweat: { val: 800000, hint: 'ช่างก่อสร้างฟาร์ม, สัตวบาล' }, equip: { val: 1000000, hint: 'ระบบให้อาหารอัตโนมัติ, ระบบบำบัดน้ำเสีย' }, venue: { val: 2000000, hint: 'ที่ดินห่างไกลชุมชน 10-20 ไร่' }, ip: { val: 300000, hint: 'มาตรฐานฟาร์มปศุสัตว์ (GAP/GMP)' } } },
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

const SUB_INDUSTRIES_MAP: Record<string, SubIndustryItem[]> = {
  ind_01: INDUSTRY_01_SUB_LIST,
};

const INITIAL_CAP_TABLE: CapTableItem[] = [
  { id: 'cash', name: 'เงินสด (Cash)', value: 600000, color: '#56b6f7' },
  { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: 700000, color: '#9d9ff7' },
  { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: 800000, color: '#3bd18e' },
  { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: 400000, color: '#a3e635' },
  { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: 300000, color: '#f3e8c8' },
];

/* ================================================================== */
/*  Master Data: Problem Solving Tools (Tab 3)                         */
/* ================================================================== */

const PROBLEM_TOOLS_LIST: ProblemToolItem[] = [
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

/* ================================================================== */
/*  Main Component with 4 Tabs                                         */
/* ================================================================== */

function EcosystemContent() {
  const [viewMode, setViewMode] = useState<'MOBILE' | 'PC'>('MOBILE');
  const [mainTab, setMainTab] = useState<MainTabType>('PROCESS');

  /* Tab 1 State: AI Processing Pipeline */
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<number>(0);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  /* Tab 2 State: Cap Table Simulation Dashboard */
  const [capTableData, setCapTableData] = useState<CapTableItem[]>(INITIAL_CAP_TABLE);
  const [selectedSubIndustryId, setSelectedSubIndustryId] = useState('sub_01_res');
  const [selectedSegmentId, setSelectedSegmentId] = useState('seg_res_1');

  const handleUpdateCapItem = (id: string, val: number) => {
    setCapTableData(prev => prev.map(item => item.id === id ? { ...item, value: val } : item));
  };

  const handleSelectIndustryForCapTable = (indId: string) => {
    setSelectedIndustryId(indId);
    if (indId === 'ind_01') {
      setSelectedSubIndustryId('sub_01_res');
      setSelectedSegmentId('seg_res_1');
      const sub = INDUSTRY_01_SUB_LIST.find(s => s.id === 'sub_01_res')!;
      const seg = sub.segments?.find(s => s.id === 'seg_res_1');
      const preset = seg ? seg.preset : sub.preset;
      setCapTableData([
        { id: 'cash', name: 'เงินสด (Cash)', value: preset.cash.val, color: '#56b6f7' },
        { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: preset.sweat.val, color: '#9d9ff7' },
        { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: preset.equip.val, color: '#3bd18e' },
        { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: preset.venue.val, color: '#a3e635' },
        { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: preset.ip.val, color: '#f3e8c8' },
      ]);
    } else {
      setSelectedSubIndustryId('');
      setSelectedSegmentId('');
      const preset = INDUSTRY_CAP_PRESETS[indId] || INDUSTRY_CAP_PRESETS.ind_01;
      setCapTableData([
        { id: 'cash', name: 'เงินสด (Cash)', value: preset.cash.val, color: '#56b6f7' },
        { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: preset.sweat.val, color: '#9d9ff7' },
        { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: preset.equip.val, color: '#3bd18e' },
        { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: preset.venue.val, color: '#a3e635' },
        { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: preset.ip.val, color: '#f3e8c8' },
      ]);
    }
  };

  const handleSelectSubIndustry = (subId: string) => {
    setSelectedSubIndustryId(subId);
    const subList = SUB_INDUSTRIES_MAP[selectedIndustryId] || [];
    const sub = subList.find(s => s.id === subId);
    if (sub) {
      const firstSeg = sub.segments && sub.segments.length > 0 ? sub.segments[0] : null;
      setSelectedSegmentId(firstSeg ? firstSeg.id : '');
      const preset = firstSeg ? firstSeg.preset : sub.preset;
      setCapTableData([
        { id: 'cash', name: 'เงินสด (Cash)', value: preset.cash.val, color: '#56b6f7' },
        { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: preset.sweat.val, color: '#9d9ff7' },
        { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: preset.equip.val, color: '#3bd18e' },
        { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: preset.venue.val, color: '#a3e635' },
        { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: preset.ip.val, color: '#f3e8c8' },
      ]);
    }
  };

  const handleSelectSegment = (segId: string) => {
    setSelectedSegmentId(segId);
    const subList = SUB_INDUSTRIES_MAP[selectedIndustryId] || [];
    const sub = subList.find(s => s.id === selectedSubIndustryId);
    if (sub && sub.segments) {
      const seg = sub.segments.find(s => s.id === segId);
      if (seg) {
        setCapTableData([
          { id: 'cash', name: 'เงินสด (Cash)', value: seg.preset.cash.val, color: '#56b6f7' },
          { id: 'sweat', name: 'หยาดเหงื่อแรงงาน (Sweat)', value: seg.preset.sweat.val, color: '#9d9ff7' },
          { id: 'equip', name: 'เครื่องมือ/อุปกรณ์ (Equip)', value: seg.preset.equip.val, color: '#3bd18e' },
          { id: 'venue', name: 'สถานที่/ออฟฟิศ (Venue)', value: seg.preset.venue.val, color: '#a3e635' },
          { id: 'ip', name: 'ทรัพย์สินทางปัญญา (IP)', value: seg.preset.ip.val, color: '#f3e8c8' },
        ]);
      }
    }
  };

  /* Tab 3 State: Problem Solving Tools */
  const [solverFilter, setSolverFilter] = useState<'ALL' | 'DISPUTE' | 'BUDGET' | 'WORKFORCE' | 'QUALITY'>('ALL');
  const [activeToolModal, setActiveToolModal] = useState<ProblemToolItem | null>(null);

  /* Tab 4 State: Existing Ecosystem Synergy Matrix */
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [selectedIndustryId, setSelectedIndustryId] = useState('ind_01');
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<number | 'ALL'>('ALL');
  const [activeRole, setActiveRole] = useState<SynergyRoleNode | null>(null);

  const currentIndustry = INDUSTRIES_LIST.find(i => i.id === selectedIndustryId) || INDUSTRIES_LIST[0];
  const currentEngine = BACK_OFFICE_ENGINES.find(e => e.id === selectedEngineId);

  const displayedRoles = filterTier === 'ALL'
    ? CONSTRUCTION_SYNERGY_ROLES
    : CONSTRUCTION_SYNERGY_ROLES.filter(r => r.tier === filterTier);

  const activeDeliverableTargetIds = new Set(activeRole?.deliverables.map(d => d.targetId) || []);
  const activeDependsOnSourceIds = new Set(activeRole?.dependsOn.map(d => d.sourceId) || []);

  const handleSelectIndustry = (id: string) => {
    setSelectedIndustryId(id);
    setSelectedEngineId(null);
    setIsSidebarExpanded(false);
    setActiveRole(null);
  };

  const handleSelectEngine = (id: string) => {
    setSelectedEngineId(id);
    setIsSidebarExpanded(false);
    setActiveRole(null);
  };

  /* Trigger Pipeline Simulation */
  const handleRunProcessing = () => {
    if (!promptInput.trim()) {
      setPromptInput('ต้องการสร้างอาคารพาณิชย์ 3 ชั้นแต่งบจำกัด ต้องการผู้รับเหมาหลักและผู้ค้ำประกันป้องกันทิ้งงาน');
    }
    setIsProcessing(true);
    setProcessingPhase(1);
    setHasAnalyzed(false);

    setTimeout(() => setProcessingPhase(2), 700);
    setTimeout(() => setProcessingPhase(3), 1400);
    setTimeout(() => setProcessingPhase(4), 2100);
    setTimeout(() => {
      setIsProcessing(false);
      setHasAnalyzed(true);
    }, 2800);
  };

  /* ---------------------------------------------------------------- */
  /*  RENDER TAB 1: ประมวลผล (Processing & Project Generation Engine)    */
  /* ---------------------------------------------------------------- */
  const renderProcessingTab = () => (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollable-content pb-24">
      {/* Intro Header Card */}
      <div className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-brand-red uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
            AI Project Deconstruction Engine
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono">
            Pipeline v2.4
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
          เครื่องมือประมวลผลโจทย์และสร้างโปรเจกต์
        </h2>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          พิมพ์ความต้องการหรือปัญหาของคุณ ระบบจะถอดโจทย์ออกเป็นชิ้นส่วนงาน ประเมินงบประมาณ จับคู่บทบาท Tier 1 - Tier 5 และร่างโครงสร้างสัญญา Escrow อัตโนมัติ
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <i className="fa-solid fa-terminal text-blue-600 dark:text-blue-400 text-xs"></i>
            ระบุโจทย์ปัญหาหรือไอเดียโปรเจกต์
          </span>
          <span className="text-[10px] text-gray-400 font-mono">ภาษาไทย / English</span>
        </div>

        <div className="relative">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="ตัวอย่าง: ต้องการสร้างอาคารพาณิชย์ 3 ชั้นแต่งบจำกัด ต้องการผู้รับเหมาและคนค้ำประกันสัญญาป้องกันทิ้งงาน..."
            className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#121518] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red transition-all min-h-[90px] resize-none"
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">โจทย์ตัวอย่างยอดนิยม:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'สร้างอาคารพาณิชย์ 3 ชั้น งบ 2.5 ล้าน',
              'ทำระบบ Cold Chain ส่งผลไม้สด',
              'เปิดร้านอาหารสาขา 2 ต้องการระบบ BOQ',
              'ติดตั้งโซลาร์เซลล์ฟาร์มเกษตรอัจฉริยะ',
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptInput(preset)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-[#20252d] dark:hover:bg-[#282f3a] text-gray-600 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/60 transition-colors text-left"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleRunProcessing}
          disabled={isProcessing}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
            isProcessing
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-brand-red hover:bg-red-700 text-white shadow-brand-red/20 active:scale-[0.99]'
          }`}
        >
          {isProcessing ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
              <span>กำลังประมวลผลขั้นตอนที่ {processingPhase}/4...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-microchip text-xs"></i>
              <span>เริ่มประมวลผลโครงสร้าง (Run Processing)</span>
            </>
          )}
        </button>

        {/* Live Progress Indicator */}
        {isProcessing && (
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1a1e24] border border-gray-100 dark:border-gray-800 space-y-2 text-[10px] animate-in fade-in">
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
              <span className="font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-gear fa-spin text-blue-600"></i>
                {processingPhase === 1 && 'ขั้นที่ 1: ถอดโจทย์ความต้องการ & แยกประเภทย่อย...'}
                {processingPhase === 2 && 'ขั้นที่ 2: วิเคราะห์ทรัพยากรและช่องว่าง (Gap Analysis)...'}
                {processingPhase === 3 && 'ขั้นที่ 3: จับคู่บทบาท Tier 1 - Tier 5 ที่ต้องใช้งาน...'}
                {processingPhase === 4 && 'ขั้นที่ 4: สังเคราะห์งวดงาน Milestone และสัญญา Escrow...'}
              </span>
              <span className="font-mono text-gray-400 font-bold">{processingPhase * 25}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                style={{ width: `${processingPhase * 25}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Synthesized Output Result (when analyzed) */}
      {hasAnalyzed && (
        <div className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-blue-200 dark:border-blue-500/40 shadow-md space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                ผลการสังเคราะห์โครงสร้างสำเร็จ
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                โครงการก่อสร้างอาคารพาณิชย์ 3 ชั้น (Smart Commercial Hub)
              </h3>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-200/60">
              Match 98.4%
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1f242c] border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block text-[8px]">งบประมาณประเมิน</span>
              <span className="font-bold text-gray-900 dark:text-white text-xs">2,450,000 ฿</span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1f242c] border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block text-[8px]">การแบ่งงวดงาน</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">4 งวด Milestone</span>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1f242c] border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block text-[8px]">ระบบคุ้มครอง</span>
              <span className="font-bold text-purple-600 dark:text-purple-400 text-xs">100% Escrow</span>
            </div>
          </div>

          {/* 5-Tier Allocation Matrix */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
              การจัดสรรบทบาทตามมาตรฐาน 5 Tiers:
            </span>
            <div className="space-y-1.5 text-[10px]">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#1c2128] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">Tier 1: ผู้ริเริ่ม (Idea Creator)</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">คุณ (เจ้าของโครงการ) กำหนด TOR & งบประมาณ</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">READY</span>
              </div>

              <div className="p-2 rounded-xl bg-blue-50/60 dark:bg-[#182330] border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-800 dark:text-blue-300 block text-[11px]">Tier 2: ผู้รับงานสนาม & Back Office</span>
                  <span className="text-[9px] text-blue-600 dark:text-blue-400">ผู้รับเหมาหลัก (01) + ทนายความสัญญา (12) + บัญชี BOQ (08)</span>
                </div>
                <span className="text-[9px] font-bold text-blue-600">3 บทบาท</span>
              </div>

              <div className="p-2 rounded-xl bg-purple-50/60 dark:bg-[#221c2c] border border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-purple-800 dark:text-purple-300 block text-[11px]">Tier 3: ผู้ค้ำประกัน & QC ตรวจรับ</span>
                  <span className="text-[9px] text-purple-600 dark:text-purple-400">วาง Performance Bond 15% + ผู้ตรวจรับอิสระส่งงวดงาน</span>
                </div>
                <span className="text-[9px] font-bold text-purple-600">REQUIRED</span>
              </div>

              <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-[#282218] border border-amber-100 dark:border-amber-900/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-800 dark:text-amber-300 block text-[11px]">Tier 4: ผู้อำนวยการวงการ (Endorsement)</span>
                  <span className="text-[9px] text-amber-700 dark:text-amber-400">ตรวจรับรองความปลอดภัยตามแบบ วสท.</span>
                </div>
                <span className="text-[9px] font-bold text-amber-700">VERIFIED</span>
              </div>

              <div className="p-2 rounded-xl bg-red-50/60 dark:bg-[#2a1a1e] border border-red-100 dark:border-red-900/50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-red dark:text-red-400 block text-[11px]">Tier 5: ตู้เซฟล็อกเงิน Escrow Vault</span>
                  <span className="text-[9px] text-red-600 dark:text-red-300">ล็อกเงินงวด 2.45M ฿ ทยอยปล่อยตามผลตรวจรับจริง</span>
                </div>
                <span className="text-[9px] font-bold text-brand-red">PROTECTED</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex gap-2">
            <Link
              href="/project/new"
              className="flex-1 py-2 px-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              <span>ส่งขึ้นกระดานบอร์ด (Publish to Board)</span>
            </Link>
            <button
              onClick={() => setMainTab('ECOSYSTEM')}
              className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#22272f] dark:hover:bg-[#2c333e] text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <span>ดูผังนิเวศ</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </button>
          </div>
        </div>
      )}

      {/* Live Pipeline Projects List */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            <i className="fa-solid fa-clock-rotate-left text-gray-400 text-xs"></i>
            โครงการที่กำลังประมวลผลขณะนี้ (Active Pipelines)
          </span>
          <span className="text-[10px] text-gray-400">3 โครงการ</span>
        </div>

        <div className="space-y-2">
          {[
            {
              title: 'ต่อเติมโกดังสินค้าเกษตรอัจฉริยะ (Smart Agro Cold Chain)',
              industry: '01 ก่อสร้าง & 06 เกษตร',
              status: 'กำลังจับคู่ Tier 3 Guarantor',
              progress: 80,
              budget: '1.8M ฿',
            },
            {
              title: 'แอปพลิเคชันเทเลเมดิซีนส่งยาถึงบ้านสำหรับผู้สูงอายุ',
              industry: '02 การแพทย์ & 03 ไอที',
              status: 'ร่างสัญญาทางกฎหมาย Tier 4 กฎหมาย',
              progress: 65,
              budget: '850K ฿',
            },
            {
              title: 'ระบบบำบัดน้ำเสียหมุนเวียนโรงงานแปรรูปอาหาร',
              industry: '10 โรงงาน & 05 อาหาร',
              status: 'อนุมัติงวด Escrow สำเร็จ พร้อมเริ่มงาน',
              progress: 100,
              budget: '3.2M ฿',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#181b20] p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                  {item.industry}
                </span>
                <span className="text-[9px] font-mono text-gray-400">{item.budget}</span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[9px] text-gray-500 pt-1">
                <span>{item.status}</span>
                <span className="font-mono font-bold">{item.progress}%</span>
              </div>
              <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  RENDER TAB 2: แปลงทรัพยากรให้เป็นทุน (Cap Table Simulation Dashboard) */
  /* ---------------------------------------------------------------- */
  const renderCapitalTab = () => {
    const totalValuation = capTableData.reduce((acc, cur) => acc + cur.value, 0);
    const currentSubIndustries = SUB_INDUSTRIES_MAP[selectedIndustryId] || [];
    const activeSubIndustry = currentSubIndustries.find(s => s.id === selectedSubIndustryId);
    const activeSegment = activeSubIndustry?.segments?.find(s => s.id === selectedSegmentId);
    const currentPreset = activeSegment ? activeSegment.preset : (activeSubIndustry ? activeSubIndustry.preset : (INDUSTRY_CAP_PRESETS[selectedIndustryId] || INDUSTRY_CAP_PRESETS.ind_01));

    const formatCompact = (val: number) => {
      if (val >= 1000000) {
        const m = (val / 1000000).toFixed(2);
        return `${m.replace(/\.00$/, '')}M THB`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(0)}K THB`;
      }
      return `${val.toLocaleString()} THB`;
    };

    // SVG Donut calculation
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPct = 0;

    // Dynamic slider scale: benchmarks differ by orders of magnitude between project types
    const presetValues = Object.values(currentPreset).map((p: any) => p.val as number);
    const niceCeil = (v: number) => {
      const mag = Math.pow(10, Math.floor(Math.log10(v)));
      return Math.ceil(v / mag) * mag;
    };
    const sliderMax = niceCeil(Math.max(Math.max(...presetValues) * 2, 1000000));
    const sliderStep = Math.max(10000, Math.pow(10, Math.floor(Math.log10(sliderMax)) - 2));

    const splitName = (n: string) => {
      const m = n.match(/^(.*?)\s*\((.*)\)$/);
      return m ? { th: m[1], en: m[2] } : { th: n, en: '' };
    };

    const hasSub = currentSubIndustries.length > 0;
    const hasSeg = !!(activeSubIndustry && activeSubIndustry.segments && activeSubIndustry.segments.length > 0);
    const fieldCount = 1 + (hasSub ? 1 : 0) + (hasSeg ? 1 : 0);
    const gridColsCls = ['', '@2xl:grid-cols-1', '@2xl:grid-cols-2', '@2xl:grid-cols-3'][fieldCount];

    const cardCls = 'bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] shadow-xs';
    const selectCls = 'w-full h-11 rounded-xl border border-gray-200 dark:border-[#2c313a] bg-white dark:bg-[#12141a] pl-3.5 pr-9 text-[13px] font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 appearance-none cursor-pointer text-ellipsis transition-colors';
    const labelCls = 'flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400';
    const chipCls = 'w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center';

    return (
      <div className="@container flex-1 overflow-y-auto px-4 @2xl:px-6 py-4 space-y-4 scrollable-content pb-24 font-prompt">
        <style jsx>{`
          .cap-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #ffffff;
            border: 3px solid var(--thumb, #3b82f6);
            border-radius: 9999px;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          }
          .cap-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: #ffffff;
            border: 3px solid var(--thumb, #3b82f6);
            border-radius: 9999px;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          }
        `}</style>

        {/* 1. Selector + Total Valuation */}
        <section className={`${cardCls} p-4 @2xl:p-5`}>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#102a4e] text-blue-600 dark:text-sky-400 flex items-center justify-center text-sm shrink-0">
              <i className="fa-solid fa-chart-pie"></i>
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">จำลองโครงสร้างทุน</h2>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">Cap Table Simulation</p>
            </div>
          </div>

          <div className={`grid grid-cols-1 gap-3 ${gridColsCls}`}>
            {/* Level 1 */}
            <label className="block min-w-0">
              <span className={labelCls}>
                <span className={`${chipCls} bg-gray-800 dark:bg-gray-500`}>1</span>
                สายงาน
              </span>
              <div className="relative">
                <select
                  value={selectedIndustryId}
                  onChange={(e) => handleSelectIndustryForCapTable(e.target.value)}
                  className={selectCls}
                >
                  {INDUSTRIES_LIST.map((ind) => (
                    <option key={ind.id} value={ind.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
                      {ind.code} {ind.name}
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
              </div>
            </label>

            {/* Level 2 */}
            {hasSub && (
              <label className="block min-w-0">
                <span className={labelCls}>
                  <span className={`${chipCls} bg-blue-600`}>2</span>
                  หมวดหลัก
                </span>
                <div className="relative">
                  <select
                    value={selectedSubIndustryId}
                    onChange={(e) => handleSelectSubIndustry(e.target.value)}
                    className={selectCls}
                  >
                    {currentSubIndustries.map((sub) => (
                      <option key={sub.id} value={sub.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
                        {sub.code} {sub.name}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
                </div>
              </label>
            )}

            {/* Level 3 */}
            {hasSeg && activeSubIndustry && activeSubIndustry.segments && (
              <label className="block min-w-0">
                <span className={labelCls}>
                  <span className={`${chipCls} bg-purple-600`}>3</span>
                  เจาะจงรูปแบบโครงการ
                </span>
                <div className="relative">
                  <select
                    value={selectedSegmentId}
                    onChange={(e) => handleSelectSegment(e.target.value)}
                    className={selectCls}
                  >
                    {activeSubIndustry.segments.map((seg) => (
                      <option key={seg.id} value={seg.id} className="bg-white dark:bg-[#181a1f] text-gray-900 dark:text-white">
                        {seg.name}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
                </div>
              </label>
            )}
          </div>

          {/* Total valuation panel */}
          <div className="mt-4 rounded-xl bg-gray-50 dark:bg-[#12141a] border border-gray-100 dark:border-[#262930] p-4">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              มูลค่าระดมทุนรวม (Total Valuation)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl @2xl:text-4xl font-black text-gray-900 dark:text-white font-mono tracking-tight leading-none">
                {totalValuation.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-gray-400">THB</span>
            </div>

            {/* Stacked proportion bar */}
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mt-3.5">
              {totalValuation > 0 && capTableData.map((item) =>
                item.value > 0 ? (
                  <span
                    key={item.id}
                    className="h-full transition-all duration-300"
                    style={{ width: `${(item.value / totalValuation) * 100}%`, backgroundColor: item.color }}
                  />
                ) : null
              )}
            </div>

            {/* Breadcrumb chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-200/70 dark:bg-[#23262d] text-gray-700 dark:text-gray-300 text-[10px] font-semibold">
                {currentIndustry.code} {currentIndustry.name}
              </span>
              {activeSubIndustry && (
                <>
                  <i className="fa-solid fa-chevron-right text-[8px] text-gray-300 dark:text-gray-600"></i>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-[#102a4e] text-blue-700 dark:text-sky-300 border border-blue-200/70 dark:border-[#1e4976]/60 text-[10px] font-semibold">
                    {activeSubIndustry.name}
                  </span>
                </>
              )}
              {activeSegment && (
                <>
                  <i className="fa-solid fa-chevron-right text-[8px] text-gray-300 dark:text-gray-600"></i>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 dark:bg-[#231a33] text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-500/30 text-[10px] font-semibold">
                    {activeSegment.name}
                  </span>
                </>
              )}
            </div>
            {activeSubIndustry && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mt-2.5">
                {activeSubIndustry.description}
              </p>
            )}
          </div>
        </section>

        {/* 2. Donut + Detail Table */}
        <div className="grid grid-cols-1 @2xl:grid-cols-5 gap-4">
          {/* Donut */}
          <section className={`${cardCls} p-4 @2xl:p-5 @2xl:col-span-2 flex flex-col`}>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              สัดส่วนความเป็นเจ้าของ
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Equity Distribution</p>

            <div className="flex-1 flex items-center justify-center py-5">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="24"
                    className="text-gray-100 dark:text-[#23262d]"
                  />
                  {totalValuation > 0 && capTableData.map((item) => {
                    if (item.value <= 0) return null;
                    const pct = item.value / totalValuation;
                    const sliceLen = pct * circumference;
                    const dash = Math.max(0, sliceLen - 4);
                    const angle = accumulatedPct * 360;
                    accumulatedPct += pct;

                    return (
                      <circle
                        key={item.id}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="24"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset="0"
                        style={{
                          transformOrigin: '80px 80px',
                          transform: `rotate(${angle}deg)`,
                          transition: 'stroke-dasharray 0.3s ease, transform 0.3s ease',
                        }}
                      />
                    );
                  })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[11px] text-gray-400 font-medium">รวมทั้งหมด</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white font-mono mt-0.5 tracking-tight">
                    {formatCompact(totalValuation)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Detail table */}
          <section className={`${cardCls} p-4 @2xl:p-5 @2xl:col-span-3`}>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">รายละเอียดสัดส่วน</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Contribution Breakdown</p>
              </div>
              <span className="text-[10px] text-gray-400 text-right">มูลค่า (THB) / สัดส่วน</span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-[#262930]/70 border-t border-gray-100 dark:border-[#262930]/70">
              {capTableData.map((item) => {
                const pct = totalValuation > 0 ? ((item.value / totalValuation) * 100).toFixed(1) : '0.0';
                const itemHint = (currentPreset as any)[item.id]?.hint || '';
                const nm = splitName(item.name);

                return (
                  <div key={item.id} className="flex items-start gap-3 py-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{nm.th}</span>
                        {nm.en && <span className="text-[10px] text-gray-400">{nm.en}</span>}
                      </div>
                      {itemHint && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug mt-0.5">
                          {itemHint}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-mono font-semibold text-gray-900 dark:text-gray-100">
                        {item.value.toLocaleString()}
                      </span>
                      <span
                        className="inline-block mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold text-gray-800 dark:text-gray-100"
                        style={{ backgroundColor: `${item.color}33` }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 3. Sliders */}
        <section className={`${cardCls} p-4 @2xl:p-5`}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">ปรับแต่งมูลค่าทรัพยากร</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">เลื่อนเพื่อปรับเงินทุนสดและทรัพยากรแต่ละประเภท (THB)</p>
            </div>
            <button
              onClick={() =>
                setCapTableData(prev =>
                  prev.map(i => ({ ...i, value: (currentPreset as any)[i.id]?.val ?? i.value }))
                )
              }
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-[#102a4e] dark:hover:bg-[#143560] text-blue-700 dark:text-sky-300 text-[11px] font-semibold transition-colors"
            >
              <i className="fa-solid fa-rotate-left text-[10px]"></i>
              ค่ามาตรฐาน
            </button>
          </div>

          <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-x-8 gap-y-5">
            {capTableData.map((item) => {
              const sliderPct = Math.min(100, Math.max(0, (item.value / sliderMax) * 100));
              const itemHint = (currentPreset as any)[item.id]?.hint || '';
              const nm = splitName(item.name);

              return (
                <div key={item.id} className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1.5"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-gray-900 dark:text-gray-100">{nm.th}</span>
                        {itemHint && (
                          <span className="block text-[10px] text-gray-400 dark:text-gray-500 leading-snug mt-0.5">
                            {itemHint}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-900 dark:text-gray-100 shrink-0">
                      {item.value.toLocaleString()}
                      <span className="text-gray-400 font-medium ml-1">THB</span>
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={sliderMax}
                    step={sliderStep}
                    value={item.value}
                    onChange={(e) => handleUpdateCapItem(item.id, Number(e.target.value))}
                    className="cap-slider w-full h-1.5 appearance-none cursor-pointer rounded-full outline-none [--track:#e5e7eb] dark:[--track:#2a2e36]"
                    style={{
                      background: `linear-gradient(to right, ${item.color} 0%, ${item.color} ${sliderPct}%, var(--track) ${sliderPct}%, var(--track) 100%)`,
                      ['--thumb' as string]: item.color,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  RENDER TAB 3: เครื่องมือแก้ปัญหา (Problem-Solving Toolkit)           */
  /* ---------------------------------------------------------------- */
  const renderSolverTab = () => {
    const filteredTools = solverFilter === 'ALL'
      ? PROBLEM_TOOLS_LIST
      : PROBLEM_TOOLS_LIST.filter(t => t.category === solverFilter);

    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollable-content pb-24">
        {/* Banner */}
        <div className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <i className="fa-solid fa-toolbox text-xs"></i>
              Project Solver Toolkit
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/50">
              5 Fast Tools
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
            คลังเครื่องมือแก้ปัญหาและปลดล็อกอุปสรรค
          </h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
            รวมเครื่องมือปฏิบัติการสำหรับแก้ปัญหาหน้างานจริง ไม่ว่าจะเป็นเงินงวดสะดุด ผู้ว่าจ้างไม่เซ็นตรวจรับ ช่างทิ้งงาน หรือข้อพิพาทสัญญา โดยมีกลไก 5 Tiers คอยคุ้มครอง
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
          {[
            { id: 'ALL', label: 'ทั้งหมด' },
            { id: 'DISPUTE', label: 'ข้อพิพาท/สัญญา' },
            { id: 'BUDGET', label: 'งบประมาณ/การเงิน' },
            { id: 'WORKFORCE', label: 'แรงงาน/บุคลากร' },
            { id: 'QUALITY', label: 'ความเสี่ยง/การันตี' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSolverFilter(tab.id as any)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${
                solverFilter === tab.id
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black'
                  : 'bg-white text-gray-600 border-gray-200 dark:bg-[#1a1e24] dark:text-gray-300 dark:border-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Problem Tool Cards List */}
        <div className="space-y-2.5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-[#181b20] rounded-2xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-2xs space-y-2.5 hover:border-gray-200 dark:hover:border-gray-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm shrink-0 border border-amber-200/50">
                    <i className={tool.icon}></i>
                  </span>
                  <div>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">
                      {tool.categoryLabel} • Tier {tool.tierSupport} Support
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {tool.title}
                    </h3>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono font-bold shrink-0">
                  {tool.slaTime}
                </span>
              </div>

              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {tool.description}
              </p>

              {/* Steps overview */}
              <div className="p-2 rounded-xl bg-gray-50/80 dark:bg-[#13161a] border border-gray-100 dark:border-gray-800 space-y-1 text-[9px]">
                <span className="font-bold text-gray-700 dark:text-gray-300 block">ขั้นตอนการแก้ไข:</span>
                {tool.steps.map((st, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center text-[7px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate">{st}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveToolModal(tool)}
                className="w-full py-2 px-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <i className="fa-solid fa-play text-[8px]"></i>
                <span>เปิดใช้งานเครื่องมือนี้ (Launch Tool)</span>
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Hotline Assistance Card */}
        <div className="bg-red-50/60 dark:bg-[#22161a] rounded-2xl p-3.5 border border-red-200 dark:border-red-900/50 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-ping"></span>
            <span className="text-[10px] font-bold text-brand-red uppercase tracking-wider">
              สายด่วนไกล่เกลี่ยฉุกเฉิน (Emergency Mediation)
            </span>
          </div>
          <p className="text-[10px] text-gray-600 dark:text-gray-300 leading-relaxed">
            กรณีเกิดการละเมิดสัญญาอย่างร้ายแรง หรือไซต์งานหยุดชะงักเกิน 48 ชม. ติดต่อศาลลูกขุนกลาง Tier 5 เพื่อระงับเงินและลงพื้นที่ตรวจสอบทันที
          </p>
          <button
            onClick={() => alert('ส่งสัญญาณแจ้งเหตุฉุกเฉินไปยังคณะกรรมการ Tier 4 & Tier 5 แล้ว')}
            className="mt-1 py-1.5 px-3 rounded-lg bg-brand-red text-white text-[10px] font-bold flex items-center gap-1.5 hover:bg-red-700 transition-colors"
          >
            <i className="fa-solid fa-bell text-[9px]"></i>
            <span>แจ้งเหตุฉุกเฉินต่อกรรมการ</span>
          </button>
        </div>

        {/* Tool Modal (Detail & Action Dialog) */}
        {activeToolModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
            <div className="w-full max-w-sm bg-white dark:bg-[#181b20] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs">
                    <i className={activeToolModal.icon}></i>
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                      {activeToolModal.title}
                    </h3>
                    <span className="text-[9px] text-gray-400 font-mono">
                      SLA: {activeToolModal.slaTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveToolModal(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm p-1"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                {activeToolModal.description}
              </p>

              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                  กรอกข้อมูลสัญญาที่ต้องการแก้ไข:
                </span>
                <input
                  type="text"
                  placeholder="รหัสสัญญา Escrow เช่น ESC-2026-0891"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121518] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <textarea
                  placeholder="ระบุรายละเอียดปัญหาที่ต้องการให้ระบบช่วย..."
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#121518] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none h-16"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    alert(`ส่งคำขอใช้งาน ${activeToolModal.title} เรียบร้อยแล้ว ระบบจะประสานงานผู้เชี่ยวชาญ Tier ${activeToolModal.tierSupport} ทันที`);
                    setActiveToolModal(null);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <i className="fa-solid fa-paper-plane text-[9px]"></i>
                  <span>ส่งคำร้องเริ่มดำเนินการ</span>
                </button>
                <button
                  onClick={() => setActiveToolModal(null)}
                  className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  RENDER TAB 4: ผังระบบนิเวศ (หน้าเดิม - Ecosystem Synergy Matrix)  */
  /* ---------------------------------------------------------------- */
  const renderSidebarRail = (isPcMode = false) => (
    <aside className={`
      h-full bg-white dark:bg-[#16191e] border-r border-gray-100 dark:border-gray-800/80 flex flex-col shrink-0 transition-all duration-300 z-30
      ${isSidebarExpanded ? (isPcMode ? 'w-64 relative shadow-none' : 'w-64 absolute inset-y-0 left-0 shadow-2xl') : 'w-13 relative'}
    `}>
      {/* Top Toggle Row */}
      <div className={`p-2 border-b border-gray-100 dark:border-gray-800/80 flex items-center ${isSidebarExpanded ? 'justify-between px-3' : 'justify-center'}`}>
        {isSidebarExpanded ? (
          <>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
              <span className="text-[11px] font-bold text-gray-900 dark:text-white truncate">12 สายงานมาตรฐาน</span>
            </div>
            <button 
              onClick={() => setIsSidebarExpanded(false)}
              className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#22272f] text-gray-500 dark:text-gray-300 flex items-center justify-center text-[10px]"
              title="ย่อเมนู (แสดงเฉพาะเลข/ไอคอน)"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsSidebarExpanded(true)}
            className="w-8 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-[#22272f] text-gray-500 dark:text-gray-300 flex items-center justify-center text-[10px] transition-colors"
            title="กางดูชื่อเต็ม"
          >
            <i className="fa-solid fa-chevron-right text-[9px]"></i>
          </button>
        )}
      </div>

      {/* Scrollable Items inside Rail */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 scrollable-content text-xs">
        {isSidebarExpanded && (
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2 pt-1 mb-1">
            12 สายงาน (DOT017)
          </div>
        )}

        {INDUSTRIES_LIST.map((ind) => {
          const isActive = selectedIndustryId === ind.id && !selectedEngineId;
          return (
            <button
              key={ind.id}
              onClick={() => handleSelectIndustry(ind.id)}
              className={`
                w-full rounded-xl transition-all flex items-center text-left
                ${isSidebarExpanded ? 'px-2.5 py-1.5 gap-2.5' : 'p-1.5 justify-center'}
                ${isActive
                  ? 'bg-red-50 text-brand-red font-bold border border-brand-red/30 shadow-2xs dark:bg-[#222832] dark:text-white dark:border-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#1a1e24]'
                }
              `}
              title={ind.name}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                isActive 
                  ? 'bg-brand-red text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-600 dark:bg-[#1e2329] dark:text-gray-400'
              }`}>
                {ind.code}
              </span>

              {isSidebarExpanded && (
                <span className="truncate flex-1 text-xs">{ind.name}</span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-1"></div>

        {isSidebarExpanded && (
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
            กลไกหลังบ้าน (ENGINES)
          </div>
        )}

        {BACK_OFFICE_ENGINES.map((eng) => {
          const isActive = selectedEngineId === eng.id;
          return (
            <button
              key={eng.id}
              onClick={() => handleSelectEngine(eng.id)}
              className={`
                w-full rounded-xl transition-all flex items-center text-left
                ${isSidebarExpanded ? 'px-2.5 py-1.5 gap-2.5' : 'p-1.5 justify-center'}
                ${isActive
                  ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-2xs dark:bg-[#2a1d20] dark:text-white dark:border-red-500/40'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#1a1e24]'
                }
              `}
              title={eng.thName}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-500 dark:bg-[#1e2329] dark:text-gray-400'
              }`}>
                <i className={eng.icon}></i>
              </span>

              {isSidebarExpanded && (
                <div className="min-w-0 flex-1">
                  <span className="truncate block text-xs leading-none">{eng.thName}</span>
                  <span className="text-[8px] text-gray-400 font-mono mt-0.5 block">T{eng.tierResponsible}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );

  const renderEcosystemCanvas = () => (
    <main className="flex-1 h-full overflow-y-auto px-3.5 py-3.5 space-y-4 scrollable-content pb-24">
      {/* Banner */}
      <div className="bg-white dark:bg-[#181b20] rounded-2xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Total Back Office Solution
          </span>
          <span className="text-[9px] text-gray-400">
            {selectedEngineId ? 'Engine View' : 'DOT017'}
          </span>
        </div>
        
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
          {selectedEngineId ? currentEngine?.name : currentIndustry.name}
        </h2>
        
        <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
          {selectedEngineId 
            ? currentEngine?.description 
            : 'ผสานงานหน้าสนามกับการสนับสนุนทางกฎหมาย การเงิน ไอที และการค้ำประกัน'}
        </p>

        {/* Tier Filter Pills */}
        <div className="flex gap-1 overflow-x-auto hide-scrollbar pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setFilterTier('ALL')}
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all border ${
              filterTier === 'ALL'
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black'
                : 'bg-white text-gray-600 border-gray-200 dark:bg-[#1e2329] dark:text-gray-400'
            }`}
          >
            ทุก Tier
          </button>
          {[1, 2, 3, 4, 5].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all border ${
                filterTier === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 dark:bg-[#1e2329] dark:text-gray-400'
              }`}
            >
              T{t}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-white dark:bg-[#181b20] p-2 rounded-xl border border-gray-100 dark:border-gray-800 text-center shadow-xs">
          <span className="text-[8px] text-gray-400 block font-medium">ภารกิจ</span>
          <span className="text-xs font-bold text-gray-900 dark:text-white block">{currentIndustry.activeBounties} งาน</span>
        </div>
        <div className="bg-white dark:bg-[#181b20] p-2 rounded-xl border border-gray-100 dark:border-gray-800 text-center shadow-xs">
          <span className="text-[8px] text-gray-400 block font-medium">มูลค่ารวม</span>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">2.5M ฿</span>
        </div>
        <div className="bg-white dark:bg-[#181b20] p-2 rounded-xl border border-gray-100 dark:border-gray-800 text-center shadow-xs">
          <span className="text-[8px] text-gray-400 block font-medium">การันตี</span>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">100% Escrow</span>
        </div>
      </div>

      {/* Interactive Role Cards (Tier 1-5 Bento Grid) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
              ผังความสัมพันธ์ (Synergy Nodes)
            </span>
          </div>
          <span className="text-[9px] text-gray-400">
            {displayedRoles.length} บทบาท
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {displayedRoles.map((role) => {
            const isCurrent = activeRole?.id === role.id;
            const isDeliverableTarget = activeDeliverableTargetIds.has(role.id);
            const isDependencySource = activeDependsOnSourceIds.has(role.id);
            const isDimmed = activeRole !== null && !isCurrent && !isDeliverableTarget && !isDependencySource;

            const meta = TIER_LIGHT_THEME[role.tier];

            return (
              <div
                key={role.id}
                onClick={() => setActiveRole(isCurrent ? null : role)}
                className={`
                  p-3 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-[#181b20] flex flex-col justify-between shadow-2xs
                  ${isCurrent ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-50/20 dark:bg-[#1c222b]' : ''}
                  ${isDeliverableTarget ? 'ring-1 ring-emerald-500 border-emerald-400 bg-emerald-50/20 dark:bg-[#17221d]' : ''}
                  ${isDependencySource ? 'ring-1 ring-purple-500 border-purple-400 bg-purple-50/20 dark:bg-[#1f1925]' : ''}
                  ${!activeRole ? 'border-gray-100 dark:border-gray-800 hover:border-gray-200' : ''}
                  ${isDimmed ? 'opacity-35 scale-[0.98]' : 'opacity-100 scale-100'}
                `}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold border ${meta.badge}`}>
                      {meta.label}
                    </span>
                    <span className="text-[8px] text-gray-400 truncate max-w-[100px]">
                      {role.originIndustry}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                    {role.title}
                  </h3>

                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {role.summary}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-50 dark:border-gray-800/80 flex items-center justify-between text-[9px]">
                  {isCurrent && (
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                      <i className="fa-solid fa-circle-dot text-[7px]"></i> กำลังตรวจดู
                    </span>
                  )}
                  {isDeliverableTarget && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <i className="fa-solid fa-arrow-down text-[7px]"></i> ผู้รับมอบงาน
                    </span>
                  )}
                  {isDependencySource && (
                    <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                      <i className="fa-solid fa-arrow-up text-[7px]"></i> ผู้ป้อนข้อมูล
                    </span>
                  )}
                  {!isCurrent && !isDeliverableTarget && !isDependencySource && (
                    <span className="text-gray-400">
                      ส่ง {role.deliverables.length} • รับ {role.dependsOn.length}
                    </span>
                  )}

                  <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    ดูสายสัมพันธ์ <i className="fa-solid fa-chevron-right text-[7px] ml-0.5"></i>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synergy Bridge Inspector */}
      {activeRole && (
        <div className="bg-white dark:bg-[#181b20] rounded-2xl p-3.5 border border-blue-300 dark:border-blue-500/40 shadow-md space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Synergy Inspector
                </span>
                <span className="text-[8px] px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded font-bold">
                  Tier {activeRole.tier}
                </span>
              </div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{activeRole.title}</h4>
            </div>
            <button
              onClick={() => setActiveRole(null)}
              className="text-gray-400 hover:text-gray-600 text-xs p-1"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-500/20 space-y-1">
              <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide block">
                ส่งมอบผลงานให้:
              </span>
              {activeRole.deliverables.map((item, idx) => {
                const target = CONSTRUCTION_SYNERGY_ROLES.find(n => n.id === item.targetId);
                return (
                  <div key={idx} className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span className="truncate">• {target?.title || item.targetId}</span>
                    <span className="text-[8px] text-emerald-700 dark:text-emerald-400 font-medium shrink-0 ml-1">({item.label})</span>
                  </div>
                );
              })}
            </div>

            <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-500/20 space-y-1">
              <span className="text-[9px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wide block">
                พึ่งพาข้อมูลจาก:
              </span>
              {activeRole.dependsOn.map((item, idx) => {
                const source = CONSTRUCTION_SYNERGY_ROLES.find(n => n.id === item.sourceId);
                return (
                  <div key={idx} className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span className="truncate">• {source?.title || item.sourceId}</span>
                    <span className="text-[8px] text-purple-700 dark:text-purple-400 font-medium shrink-0 ml-1">({item.label})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4 Pillars Card */}
      <div className="bg-white dark:bg-[#181b20] rounded-2xl p-3 border border-gray-100 dark:border-gray-800 shadow-xs space-y-2">
        <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
          Total Back Office Solution
        </span>
        <h3 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
          4 เสาหลักสนับสนุนงานก่อสร้าง (01)
        </h3>

        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
            <span className="text-[8px] font-bold text-blue-700 dark:text-blue-400 block">12 กฎหมาย</span>
            <span className="font-bold text-gray-900 dark:text-white block text-[11px]">ตรวจโฉนด & สัญญา</span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">ยื่นขออนุญาต อ.1</span>
          </div>

          <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
            <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-400 block">08 การเงิน/บัญชี</span>
            <span className="font-bold text-gray-900 dark:text-white block text-[11px]">ถอดแบบ BOQ & ทุน</span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">คุมงบ ยื่นกู้โครงการ</span>
          </div>

          <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
            <span className="text-[8px] font-bold text-purple-700 dark:text-purple-400 block">03 ไอที/เทคโนโลยี</span>
            <span className="font-bold text-gray-900 dark:text-white block text-[11px]">Smart Building IoT</span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">เซ็นเซอร์ประหยัดพลังงาน</span>
          </div>

          <div className="p-2 rounded-xl bg-gray-50 dark:bg-[#1c2128] border border-gray-100 dark:border-gray-800 space-y-0.5">
            <span className="text-[8px] font-bold text-amber-700 dark:text-amber-400 block">Tier 3 ค้ำประกัน</span>
            <span className="font-bold text-gray-900 dark:text-white block text-[11px]">การันตีสัญญา & QC</span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight block">ไม่ทิ้งงาน 100% ปลดล็อก</span>
          </div>
        </div>
      </div>
    </main>
  );

  /* Tab Header Bar Items */
  const MAIN_TABS = [
    { id: 'PROCESS', label: 'ประมวลผล', icon: 'fa-solid fa-microchip', badge: 'AI' },
    { id: 'CAPITAL', label: 'แปลงทรัพยากรให้เป็นทุน', icon: 'fa-solid fa-coins', badge: 'Cap Table' },
    { id: 'SOLVER', label: 'เครื่องมือแก้ปัญหา', icon: 'fa-solid fa-toolbox', badge: '5 Tools' },
    { id: 'ECOSYSTEM', label: 'ผังระบบนิเวศ', icon: 'fa-solid fa-network-wired', badge: 'Matrix' },
  ];

  /* ---------------------------------------------------------------- */
  /*  VIEW 1: MOBILE FIRST (DEFAULT INSIDE PHONE FRAME)                */
  /* ---------------------------------------------------------------- */
  if (viewMode === 'MOBILE') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-8 transition-colors duration-300">
        
        {/* Mobile Device Container Frame (430px x 900px) */}
        <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-[#fdfdfd] dark:bg-[#111315] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
          
          {/* Top Header Bar */}
          <header className="px-4 py-2.5 bg-white dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-2">
              {mainTab === 'ECOSYSTEM' && (
                <button
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                  className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-[#22272f] dark:hover:bg-[#2a303a] flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors shadow-2xs"
                  title={isSidebarExpanded ? "ย่อเมนูสายงาน" : "ขยายดูชื่อสายงานเต็ม"}
                >
                  <i className={`fa-solid ${isSidebarExpanded ? 'fa-chevron-left text-[11px]' : 'fa-bars text-xs'}`}></i>
                </button>
              )}
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">
                  MAKE A DOT Solutions
                </span>
                <h1 className="text-xs font-bold text-gray-900 dark:text-white truncate leading-tight mt-0.5">
                  เชื่อมดอท
                </h1>
              </div>
            </div>

            {/* Top Right Actions: PC Mode Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('PC')}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full text-[10px] font-bold transition-all shadow-xs"
                title="สลับเป็นโหมดจอ PC"
              >
                <i className="fa-solid fa-display text-[9px]"></i>
                <span>จอ PC</span>
              </button>
            </div>
          </header>

          {/* Subheader: 4 Main Tabs Bar */}
          <div className="px-2 py-1.5 bg-gray-50/90 dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex gap-1 overflow-x-auto hide-scrollbar shrink-0 z-20">
            {MAIN_TABS.map((tab) => {
              const isActive = mainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMainTab(tab.id as MainTabType);
                    setIsSidebarExpanded(false);
                  }}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] whitespace-nowrap transition-all shrink-0
                    ${isActive
                      ? 'bg-gray-900 text-white font-bold shadow-xs dark:bg-white dark:text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-[#20252e]'
                    }
                  `}
                >
                  <i className={`${tab.icon} text-[9px] ${isActive ? 'text-brand-red' : ''}`}></i>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Body Content Container */}
          <div className="flex-1 flex overflow-hidden relative">
            {mainTab === 'PROCESS' && renderProcessingTab()}
            {mainTab === 'CAPITAL' && renderCapitalTab()}
            {mainTab === 'SOLVER' && renderSolverTab()}

            {mainTab === 'ECOSYSTEM' && (
              <>
                {/* Collapsible Left Rail */}
                {renderSidebarRail(false)}

                {/* Backdrop when drawer is expanded in mobile */}
                {isSidebarExpanded && (
                  <div
                    onClick={() => setIsSidebarExpanded(false)}
                    className="absolute inset-0 bg-black/30 z-20 backdrop-blur-2xs cursor-pointer"
                  />
                )}

                {/* Right Interactive Detail Canvas */}
                {renderEcosystemCanvas()}
              </>
            )}
          </div>

          {/* Bottom Tab Bar of Phone Frame */}
          <BottomTabBar />

        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  VIEW 2: PC CONSOLE (EXPANSIVE MASTER-DETAIL LAYOUT)             */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt flex flex-col items-center p-4 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-7xl h-[92vh] min-h-[760px] bg-[#fdfdfd] dark:bg-[#111315] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top PC Master Header */}
        <header className="px-6 py-3.5 bg-white dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse"></span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">
                Executive Ecosystem & Solution Console
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                MAKE A DOT • เชื่อมดอท (ศูนย์รวมเครื่องมือแก้ปัญหา & สร้างโปรเจกต์)
              </span>
            </div>
          </div>

          {/* Top Right: Switch Back to Mobile Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('MOBILE')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#22272f] dark:hover:bg-[#2a303a] text-gray-800 dark:text-white rounded-full text-xs font-bold transition-all border border-gray-200 dark:border-gray-700 shadow-2xs"
              title="สลับกลับไปยังจอมือถือ"
            >
              <i className="fa-solid fa-mobile-screen text-xs"></i>
              <span>กลับจอมือถือ</span>
            </button>
          </div>
        </header>

        {/* PC Subheader: 4 Main Tabs Bar */}
        <div className="px-6 py-2 bg-gray-50 dark:bg-[#16191e] border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            {MAIN_TABS.map((tab) => {
              const isActive = mainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMainTab(tab.id as MainTabType)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all
                    ${isActive
                      ? 'bg-gray-900 text-white font-bold shadow-xs dark:bg-white dark:text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-[#20252e]'
                    }
                  `}
                >
                  <i className={`${tab.icon} text-xs ${isActive ? 'text-brand-red' : ''}`}></i>
                  <span>{tab.label}</span>
                  <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-gray-400 font-mono hidden md:inline-block">
            5-Tier Architecture • Escrow Guaranteed
          </span>
        </div>

        {/* Master-Detail 2-Column Body for PC */}
        <div className="flex-1 flex overflow-hidden">
          {mainTab === 'PROCESS' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto">
              {renderProcessingTab()}
            </div>
          )}

          {mainTab === 'CAPITAL' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto">
              {renderCapitalTab()}
            </div>
          )}

          {mainTab === 'SOLVER' && (
            <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto">
              {renderSolverTab()}
            </div>
          )}

          {mainTab === 'ECOSYSTEM' && (
            <>
              {renderSidebarRail(true)}
              {renderEcosystemCanvas()}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

/* ================================================================== */
/*  Export Root Page with Suspense                                     */
/* ================================================================== */

export default function EcosystemPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-prompt">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-mono">กำลังเปิดหน้าเชื่อมดอท...</span>
          </div>
        </div>
      }
    >
      <EcosystemContent />
    </Suspense>
  );
}
