'use client';

import React, { useState } from 'react';
import {
  Building,
  Boxes,
  Receipt,
  UserCheck,
  Scale,
  Truck,
  ClipboardCheck,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export const FeasibilityGdvCalculator: React.FC = () => {
  const [gdv, setGdv] = useState(100000000); // 100M THB
  const [landCost, setLandCost] = useState(25000000); // 25%
  const [hardCost, setHardCost] = useState(40000000); // 40%
  const [softCost, setSoftCost] = useState(6000000); // 6%
  const [sgaCost, setSgaCost] = useState(12000000); // 12%
  const [financeCost, setFinanceCost] = useState(5000000); // 5%
  const [contingency, setContingency] = useState(5000000); // 5%

  const tdc = landCost + hardCost + softCost + sgaCost + financeCost + contingency;
  const netProfit = gdv - tdc;
  const netMargin = gdv > 0 ? (netProfit / gdv) * 100 : 0;
  const landRatio = gdv > 0 ? (landCost / gdv) * 100 : 0;
  const hardRatio = gdv > 0 ? (hardCost / gdv) * 100 : 0;
  const isMarginAlert = netMargin < 12;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Building className="w-4 h-4 text-[#E11D48]" />
          คำนวณ Feasibility & GDV เทียบเกณฑ์มาตรฐาน
        </span>
        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${isMarginAlert ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600'}`}>
          Net Margin: {netMargin.toFixed(1)}% {isMarginAlert ? '(ต่ำกว่า 12%)' : '(ผ่านเกณฑ์)'}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">มูลค่าขายรวม (GDV)</label>
          <input type="number" value={gdv} onChange={(e) => setGdv(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">ที่ดิน ({landRatio.toFixed(0)}% / &lt;=30%)</label>
          <input type="number" value={landCost} onChange={(e) => setLandCost(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">ค่าก่อสร้าง Hard ({hardRatio.toFixed(0)}%)</label>
          <input type="number" value={hardCost} onChange={(e) => setHardCost(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
      </div>
      <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-xs flex items-center justify-between font-mono">
        <div>
          <span className="text-[10px] text-gray-400 block">ต้นทุนรวมโครงการ (TDC)</span>
          <span className="font-bold text-[#0F172A] dark:text-white">฿{tdc.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 block">กำไรสุทธิคาดการณ์</span>
          <span className={`font-bold ${isMarginAlert ? 'text-[#E11D48]' : 'text-emerald-600'}`}>
            ฿{netProfit.toLocaleString()} ({netMargin.toFixed(1)}%)
          </span>
        </div>
      </div>
      {isMarginAlert && (
        <div className="p-2 bg-red-50 text-[#E11D48] rounded-xl text-[11px] font-bold flex items-center gap-1.5 border border-red-200">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>แจ้งเตือน: Net Margin ต่ำกว่า 12% ต้องเจรจาต่อรองลดราคาที่ดินหรือค่าก่อสร้าง Hard Cost ทันที</span>
        </div>
      )}
    </div>
  );
};

export const BoqPriceLockCalculator: React.FC = () => {
  const [supplyMode, setSupplyMode] = useState<'owner' | 'turnkey'>('owner');
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <Boxes className="w-4 h-4 text-[#E11D48]" />
        เปรียบเทียบจัดซื้อเอง vs เหมาของพร้อมแรง & มอก.
      </span>
      <div className="flex gap-2 text-xs">
        <button onClick={() => setSupplyMode('owner')} className={`flex-1 py-1.5 rounded-xl font-bold border transition-all ${supplyMode === 'owner' ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white dark:bg-[#0F172A] text-gray-600 border-gray-200'}`}>
          จัดซื้อวัสดุเอง (Owner-Supplied)
        </button>
        <button onClick={() => setSupplyMode('turnkey')} className={`flex-1 py-1.5 rounded-xl font-bold border transition-all ${supplyMode === 'turnkey' ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white dark:bg-[#0F172A] text-gray-600 border-gray-200'}`}>
          เหมาของพร้อมแรง (Turnkey)
        </button>
      </div>
      <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-xs space-y-1">
        <span className="font-bold text-[#0F172A] dark:text-white block">
          {supplyMode === 'owner' ? 'ข้อดีจัดซื้อเอง: ประหยัดต้นทุน 8-15% คุมสเปก มอก. SD40/SD50 ได้ตรง 100%' : 'ข้อดีเหมาของพร้อมแรง: ผู้รับเหมารับความเสี่ยงของขาดและราคาเหล็กผันผวน'}
        </span>
        <p className="text-[11px] text-gray-500">
          เงื่อนไข Price-Lock: ระบุในสัญญาว่าราคาคอนกรีตคงที่ 6 เดือน ค่าปรับส่งช้าเกินเวลาเทปูนคิดชั่วโมงละ 2,500 บาท
        </p>
      </div>
    </div>
  );
};

export const ProgressBillingCalculator: React.FC = () => {
  const [milestoneAmount, setMilestoneAmount] = useState(500000);
  const advanceDeduction = milestoneAmount * 0.1; // 10% advance deduction
  const retention = milestoneAmount * 0.05; // 5% retention
  const netBeforeTax = milestoneAmount - advanceDeduction - retention;
  const sbt33 = milestoneAmount * 0.033;
  const wht3 = netBeforeTax * 0.03;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <Receipt className="w-4 h-4 text-[#E11D48]" />
        คำนวณ Progress Billing หัก Advance & Retention 5%
      </span>
      <div className="text-xs space-y-1">
        <label className="text-[10px] text-gray-500 block">มูลค่างวดงานที่วางบิล (บาท)</label>
        <input type="number" value={milestoneAmount} onChange={(e) => setMilestoneAmount(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div className="p-2 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="text-gray-400 block text-[10px]">หักคืนเงินล่วงหน้า (10%)</span>
          <span className="font-bold text-[#0F172A] dark:text-white">-฿{advanceDeduction.toLocaleString()}</span>
        </div>
        <div className="p-2 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="text-gray-400 block text-[10px]">หักเงินประกันผลงาน (5%)</span>
          <span className="font-bold text-[#E11D48]">-฿{retention.toLocaleString()}</span>
        </div>
        <div className="p-2 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="text-gray-400 block text-[10px]">ภาษีเฉพาะธุรกิจ (3.3%)</span>
          <span className="font-bold">฿{sbt33.toLocaleString()}</span>
        </div>
        <div className="p-2 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="text-gray-400 block text-[10px]">หัก ณ ที่จ่าย 3%</span>
          <span className="font-bold text-emerald-600">฿{wht3.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-500 italic">
        ⚠️ กฎเหล็ก: ห้ามนำเงินมัดจำของโครงการใหม่ไปโปะค่าใช้จ่ายโครงการเก่าเด็ดขาด
      </p>
    </div>
  );
};

export const ForeignWorkerHrCalculator: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <UserCheck className="w-4 h-4 text-[#E11D48]" />
        ระบบเตือนต่ออายุต่างด้าว 60 วัน & กันผีคนงาน
      </span>
      <div className="space-y-1.5 text-xs">
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800 flex items-center justify-between">
          <span>พาสปอร์ต &amp; วีซ่า MOU (แจ้งเตือนล่วงหน้า 60 วัน)</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">ปกติ</span>
        </div>
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800 flex items-center justify-between">
          <span>ใบ กว. วิศวกรผู้ควบคุมงาน (ภาคี/สามัญ)</span>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">ตรวจสอบแล้ว</span>
        </div>
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800 flex items-center justify-between">
          <span>ระบบเช็กชื่อสแกนหน้า + พิกัด GPS หน้าไซด์</span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">ออนไลน์</span>
        </div>
      </div>
    </div>
  );
};

export const LegalZoningVoCalculator: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <Scale className="w-4 h-4 text-[#E11D48]" />
        เช็กผังเมือง FAR/OSR & กฎล็อกใบสั่งงานเพิ่ม-ลด VO
      </span>
      <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-xs space-y-1">
        <span className="font-bold text-[#0F172A] dark:text-white block">กฎหมายผังเมือง &amp; ทางสาธารณะ:</span>
        <p className="text-[11px] text-gray-600 dark:text-gray-300">
          ความกว้างถนนสาธารณะต้องได้เกณฑ์ตาม พ.ร.บ.ควบคุมอาคาร และคำนวณอัตราส่วน FAR / OSR ให้ผ่านก่อนมัดจำที่ดิน
        </p>
      </div>
      <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-xs space-y-1">
        <span className="font-bold text-[#E11D48] block">ล็อกงานเพิ่ม-ลด (Variation Order):</span>
        <p className="text-[11px] text-gray-600 dark:text-gray-300">
          งานเพิ่มต้องมีลายเซ็นอนุมัติเป็นลายลักษณ์อักษรและระบุราคาก่อนเริ่มงาน ห้ามสั่งงานด้วยวาจา
        </p>
      </div>
    </div>
  );
};

export const JitLogisticsCalculator: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <Truck className="w-4 h-4 text-[#E11D48]" />
        วางผัง Logistics แบบ Just-In-Time (JIT) กันกองวัสดุจมทุน
      </span>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="font-bold block text-[#0F172A] dark:text-white mb-1">หน้างานจำกัด:</span>
          <p className="text-[11px] text-gray-500">นัดส่งวัสดุก่อนใช้งานจริงไม่เกิน 48 ชม. ลดความเสียหายจากความชื้นและฝน</p>
        </div>
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="font-bold block text-[#0F172A] dark:text-white mb-1">กฎ Slump Test:</span>
          <p className="text-[11px] text-gray-500">รถปูนต้องเข้าเทภายใน 90-120 นาทีหลังจากออกจากแพลนต์ ห้ามเติมน้ำหน้างานเด็ดขาด</p>
        </div>
      </div>
    </div>
  );
};

export const DefectTriageCalculator: React.FC = () => {
  const [defects, setDefects] = useState<{ id: number; name: string; severity: 'structural' | 'aesthetic'; status: 'open' | 'resolved' }[]>([
    { id: 1, name: 'รอยร้าวคานชั้น 2 (รอยเฉียง 45 องศา)', severity: 'structural', status: 'open' },
    { id: 2, name: 'สีกำแพงห้องรับแขกไม่สม่ำเสมอ', severity: 'aesthetic', status: 'resolved' },
    { id: 3, name: 'กระเบื้องห้องน้ำมีรอยบิ่นมุม 2 แผ่น', severity: 'aesthetic', status: 'open' },
  ]);

  const toggleStatus = (id: number) => {
    setDefects(defects.map(d => d.id === id ? { ...d, status: d.status === 'open' ? 'resolved' : 'open' } : d));
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardCheck className="w-4 h-4 text-[#E11D48]" />
          ระบบคัดกรอง Defect Triage (โครงสร้าง vs ตกแต่ง)
        </span>
        <span className="text-[10px] text-gray-500">คลิกเพื่ออัปเดตสถานะ</span>
      </div>
      <div className="space-y-1.5 text-xs">
        {defects.map((d) => (
          <div key={d.id} onClick={() => toggleStatus(d.id)} className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800 flex items-center justify-between cursor-pointer hover:border-gray-400">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${d.severity === 'structural' ? 'bg-[#E11D48]' : 'bg-amber-400'}`} />
              <span className={d.status === 'resolved' ? 'line-through text-gray-400' : 'font-medium'}>{d.name}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : d.severity === 'structural' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
              {d.status === 'resolved' ? 'แก้ไขแล้ว' : d.severity === 'structural' ? 'โครงสร้าง (เร่งด่วน)' : 'ผิวสัมผัส'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ScurveExecutiveCalculator: React.FC = () => {
  const [planned, setPlanned] = useState(65);
  const [actual, setActual] = useState(58);
  const delay = planned - actual;
  const isDelayed = delay > 5;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <FileSpreadsheet className="w-4 h-4 text-[#E11D48]" />
        แปลผลกราฟ S-Curve &amp; ด่านตรวจเอกสาร CEO
      </span>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">% แผนงาน (Planned)</label>
          <input type="number" value={planned} onChange={(e) => setPlanned(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">% ทำได้จริง (Actual)</label>
          <input type="number" value={actual} onChange={(e) => setActual(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
      </div>
      <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${isDelayed ? 'bg-red-50 text-[#E11D48] border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
        <span>{isDelayed ? `🚨 โครงการล่าช้าสะสม ${delay}% (เกินเกณฑ์ 5%) ต้องสรุปรายงาน 1 หน้าส่ง CEO ด่วน` : `✓ ความคืบหน้าปกติ (ล่าช้า ${delay}%)`}</span>
      </div>
    </div>
  );
};
