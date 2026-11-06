'use client';

import React, { useState } from 'react';
import {
  Scale,
  Calculator,
  Clock,
  FileCheck,
  MessageSquareText,
  ShieldCheck,
  Activity,
  GraduationCap,
} from 'lucide-react';

export const TcoBatnaCalculator: React.FC = () => {
  const [q1, setQ1] = useState(100000);
  const [q2, setQ2] = useState(95000);
  const [q3, setQ3] = useState(105000);
  const [hiddenCost2, setHiddenCost2] = useState(12000);

  const tco1 = q1 + 2000;
  const tco2 = q2 + hiddenCost2;
  const tco3 = q3 + 1000;
  const lowest = Math.min(tco1, tco2, tco3);
  const winner = lowest === tco1 ? 'เจ้าที่ 1' : lowest === tco2 ? 'เจ้าที่ 2' : 'เจ้าที่ 3';

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-[#E11D48]" />
          ตารางเทียบราคา 3 เจ้า & หา TCO ต่ำสุด
        </span>
        <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
          คุ้มค่าสุด: {winner} (฿{lowest.toLocaleString()})
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-700">
          <span className="text-[10px] text-gray-500 block mb-1 font-bold">เจ้าที่ 1</span>
          <input type="number" value={q1} onChange={(e) => setQ1(Number(e.target.value))} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-1 font-mono text-xs focus:outline-none" />
          <span className="text-[10px] text-gray-400 block mt-1">TCO: ฿{tco1.toLocaleString()}</span>
        </div>
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-700">
          <span className="text-[10px] text-gray-500 block mb-1 font-bold">เจ้าที่ 2</span>
          <input type="number" value={q2} onChange={(e) => setQ2(Number(e.target.value))} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-1 font-mono text-xs focus:outline-none" />
          <span className="text-[10px] text-gray-400 block mt-1">TCO: ฿{tco2.toLocaleString()}</span>
        </div>
        <div className="p-2.5 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-700">
          <span className="text-[10px] text-gray-500 block mb-1 font-bold">เจ้าที่ 3</span>
          <input type="number" value={q3} onChange={(e) => setQ3(Number(e.target.value))} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-1 font-mono text-xs focus:outline-none" />
          <span className="text-[10px] text-gray-400 block mt-1">TCO: ฿{tco3.toLocaleString()}</span>
        </div>
      </div>
      <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-[11px] space-y-1">
        <span className="font-bold text-[#0F172A] dark:text-white block">สคริปต์ขอเครดิตเทอม 30-60 วัน:</span>
        <p className="text-gray-600 dark:text-gray-400 italic">
          "ทางเราสั่งซื้อตามปริมาณงานโครงการต่อเนื่อง ขออนุมัติเปิดวงเงินเครดิต 45 วัน วางบิลทุกสิ้นเดือน ชำระตรงเวลา 100%"
        </p>
      </div>
    </div>
  );
};

export const FinanceTaxCalculator: React.FC = () => {
  const [annualRev, setAnnualRev] = useState(1650000);
  const [monthlyExpense, setMonthlyExpense] = useState(45000);
  const [cashReserve, setCashReserve] = useState(270000);

  const runwayMonths = monthlyExpense > 0 ? (cashReserve / monthlyExpense).toFixed(1) : '0';
  const withholdingTax3 = (annualRev * 0.03).toLocaleString();
  const isVatAlert = annualRev >= 1800000;
  const isVatWarning = annualRev >= 1500000 && !isVatAlert;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <Calculator className="w-4 h-4 text-[#E11D48]" />
        เครื่องคำนวณสายป่าน & เตือนเพดาน VAT 1.8 ล้าน
      </span>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">รายได้สะสมทั้งปี (บาท)</label>
          <input type="number" value={annualRev} onChange={(e) => setAnnualRev(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">ค่าใช้จ่าย/เดือน (บาท)</label>
          <input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="text-[10px] text-gray-400 block">สายป่านเงินสด (Runway)</span>
          <span className="text-lg font-mono font-bold text-emerald-600">{runwayMonths} เดือน</span>
          <span className="text-[9px] text-gray-400 block mt-0.5">เกณฑ์ปลอดภัย &gt;= 6 เดือน</span>
        </div>
        <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800">
          <span className="text-[10px] text-gray-400 block">หัก ณ ที่จ่าย 3% สะสม</span>
          <span className="text-lg font-mono font-bold text-[#0F172A] dark:text-white">฿{withholdingTax3}</span>
          <span className="text-[9px] text-gray-400 block mt-0.5">ขอคืนหรือเครดิตภาษีสิ้นปี</span>
        </div>
      </div>
      {isVatWarning && (
        <div className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
          ⚠️ ระวัง: รายได้แตะ 1.5 ล้านแล้ว! ใกล้เพดานจด VAT 1.8 ล้าน แนะนำเตรียมเปิดนิติบุคคลแยกรายรับ
        </div>
      )}
      {isVatAlert && (
        <div className="p-2.5 bg-red-50 text-[#E11D48] border border-red-200 rounded-xl text-xs font-bold">
          🚨 เตือนสีแดง: รายได้เกิน 1,800,000 บาท ต้องจดทะเบียนภาษีมูลค่าเพิ่ม (VAT 7%) ภายใน 30 วัน
        </div>
      )}
    </div>
  );
};

export const ParetoTimeCalculator: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-[#E11D48]" />
        เครื่องมือจัดตารางพาเรโต 20/80 & รหัสชื่อไฟล์
      </span>
      <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-xs space-y-1">
        <span className="font-bold text-[#E11D48] block">กฎล็อกบล็อกเวลา (Deep Work 90 นาที):</span>
        <p className="text-[11px] text-gray-600 dark:text-gray-300">ทำงานหลักที่สร้างผลลัพธ์ 80% ในช่วง 09:00 - 10:30 น. ปิดแจ้งเตือน 100% เผื่อเวลาฉุกเฉิน 20%</p>
      </div>
      <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-xs space-y-1 font-mono">
        <span className="font-bold text-[#0F172A] dark:text-white block text-[10px]">รูปแบบชื่อไฟล์ค้นเจอใน 10 วินาที:</span>
        <code className="text-[11px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[#E11D48] block">YYYYMMDD_CLIENT_PROJECT_VERSION</code>
      </div>
    </div>
  );
};

export const ContractRedlineChecklist: React.FC = () => {
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({ c1: true, c2: true });
  const toggle = (k: string) => setChecks({ ...checks, [k]: !checks[k] });

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <FileCheck className="w-4 h-4 text-[#E11D48]" />
        ด่านตรวจ 5 จุดตายในสัญญาก่อนลงนาม
      </span>
      <div className="space-y-1.5 text-xs">
        {[
          { k: 'c1', label: 'จำกัดโควตาแก้งาน (Revision Cap ไม่เกิน 2-3 ครั้ง)' },
          { k: 'c2', label: 'เงื่อนไขมัดจำ 20-30% ก่อนเริ่มงาน ห้ามทำงานฟรี' },
          { k: 'c3', label: 'เพดานค่าปรับส่งล่าช้าสูงสุดไม่เกิน 10% ของมูลค่างาน' },
          { k: 'c4', label: 'Liability Cap: จำกัดความรับผิดชอบสูงสุดไม่เกินมูลค่างาน' },
          { k: 'c5', label: 'Paper Trail: ส่งสรุปข้อตกลงและบันทึกหลังประชุมทางอีเมล' },
        ].map((item) => (
          <label key={item.k} onClick={() => toggle(item.k)} className="flex items-center gap-2 p-2 bg-white dark:bg-[#0F172A] rounded-xl border border-[#E2E8F0] dark:border-gray-800 cursor-pointer hover:border-gray-400">
            <input type="checkbox" checked={!!checks[item.k]} readOnly className="rounded text-[#E11D48] focus:ring-[#E11D48]" />
            <span className={checks[item.k] ? 'font-medium text-[#0F172A] dark:text-white' : 'text-gray-400'}>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export const PyramidPitchGenerator: React.FC = () => {
  const [problem, setProblem] = useState('ผู้รับเหมาทิ้งงาน โครงสร้างล่าช้า 2 สัปดาห์');
  const [action, setAction] = useState('จัดทีมช่างทดแทน 5 คน พร้อมผู้ควบคุมงานมีใบ กว.');
  const [result, setResult] = useState('เร่งงานคืนทันตามกำหนด ประหยัดค่าปรับวันละ 5,000 บาท');

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <MessageSquareText className="w-4 h-4 text-[#E11D48]" />
        โครงสร้างสื่อสารแบบปิรามิด (Problem-Action-Result)
      </span>
      <div className="bg-white dark:bg-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] dark:border-gray-800 text-xs space-y-2">
        <span className="font-mono text-[10px] text-[#E11D48] font-bold block">บทสรุปผู้บริหาร (One-Liner):</span>
        <p className="font-bold text-[#0F172A] dark:text-white leading-relaxed">
          "เพื่อแก้ไขปัญหา {problem} ทางเราได้ดำเนินการ {action} ส่งผลให้ {result}"
        </p>
      </div>
    </div>
  );
};

export const AntiPhishingShield: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#E11D48]" />
        กฎตรวจสอบการโอนเงิน & สูตรสำรองข้อมูล 3-2-1
      </span>
      <div className="p-2.5 bg-red-50 text-[#E11D48] rounded-xl text-xs font-bold border border-red-200">
        🚨 กฎเหล็ก: เมื่อคู่ค้าแจ้งเปลี่ยนเลขบัญชี บังคับโทรศัพท์ยืนยันที่เบอร์เดิมทันที ห้ามตอบกลับอีเมลใหม่
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-mono">
        <div className="bg-white dark:bg-[#0F172A] p-2 rounded-lg border border-[#E2E8F0] dark:border-gray-800"><span className="text-gray-500 block text-[10px]">3 ชุด</span><span className="font-bold text-[#0F172A] dark:text-white">ข้อมูล</span></div>
        <div className="bg-white dark:bg-[#0F172A] p-2 rounded-lg border border-[#E2E8F0] dark:border-gray-800"><span className="text-gray-500 block text-[10px]">2 สื่อ</span><span className="font-bold text-[#0F172A] dark:text-white">Cloud+SSD</span></div>
        <div className="bg-white dark:bg-[#0F172A] p-2 rounded-lg border border-[#E2E8F0] dark:border-gray-800"><span className="text-gray-500 block text-[10px]">1 ออฟไลน์</span><span className="font-bold text-emerald-600">ตัดเน็ต</span></div>
      </div>
    </div>
  );
};

export const UltradianBurnoutTimer: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <Activity className="w-4 h-4 text-[#E11D48]" />
        จังหวะสมอง 90 นาที & โภชนาการกันง่วงบ่าย
      </span>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 space-y-1">
          <span className="text-[10px] font-bold text-[#E11D48] block">Ultradian Sprint:</span>
          <p className="text-[11px] text-gray-700 dark:text-gray-300">ทำงานต่อเนื่อง 90 นาที แล้วลุกพัก 15 นาที เพื่อให้สมองรีเซ็ตระดับโฟกัส</p>
        </div>
        <div className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 space-y-1">
          <span className="text-[10px] font-bold text-gray-500 block">มื้อเที่ยงพลังสูง:</span>
          <p className="text-[11px] text-gray-700 dark:text-gray-300">ลดข้าวขัดสีและน้ำหวาน เพิ่มโปรตีนและผัก ป้องกัน Post-Lunch Crash</p>
        </div>
      </div>
    </div>
  );
};

export const ReskillSprintTracker: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800 flex items-center gap-1.5">
        <GraduationCap className="w-4 h-4 text-[#E11D48]" />
        ผ่าแก่นทักษะ 20% & สร้างพอร์ตใน 30 วัน
      </span>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-white dark:bg-[#0F172A] p-2 rounded-xl border border-[#E2E8F0] dark:border-gray-800"><span className="text-[9px] text-gray-400 block">สัปดาห์ 1-2</span><span className="font-bold text-[#0F172A] dark:text-white block mt-0.5">แก่น 20%</span></div>
        <div className="bg-white dark:bg-[#0F172A] p-2 rounded-xl border border-[#E2E8F0] dark:border-gray-800"><span className="text-[9px] text-gray-400 block">สัปดาห์ 3</span><span className="font-bold text-[#0F172A] dark:text-white block mt-0.5">Feynman</span></div>
        <div className="bg-white dark:bg-[#0F172A] p-2 rounded-xl border border-[#E2E8F0] dark:border-gray-800"><span className="text-[9px] text-gray-400 block">สัปดาห์ 4</span><span className="font-bold text-[#E11D48] block mt-0.5">พอร์ต 3 ชิ้น</span></div>
      </div>
    </div>
  );
};
