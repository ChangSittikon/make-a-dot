'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  PieChart,
  Lock,
} from 'lucide-react';

export const HiddenNodesCalculator: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([0, 1]);

  const items = [
    { id: 0, label: 'ทำเลหน้าบ้าน / ใกล้ตลาด / ใกล้โรงพยาบาล', value: 45000, desc: 'เปิดจุดกระจายสินค้า คลังย่อย หรือให้เช่าชั่วคราว' },
    { id: 1, label: 'เครือข่ายคนรู้จัก / วัยรุ่นช่วยแรง / ช่างท้องถิ่น', value: 35000, desc: 'ระดมแรงงานฉุกเฉินได้ภายใน 2 ชั่วโมงโดยไม่ต้องจ้างประจำ' },
    { id: 2, label: 'รถกระบะ / ของเหลือใช้ / เศษเหล็ก-ไม้ล้ม', value: 30000, desc: 'แปลงเป็นเครื่องมือขนส่งหรือนำเศษวัสดุไปรีไซเคิล' },
    { id: 3, label: 'เวลาว่างกะดึก ตี 1-5 / วันอาทิตย์', value: 50000, desc: 'รับงานด่วน/ฉุกเฉิน คิดเรทพิเศษ 2-3 เท่า' },
    { id: 4, label: 'ความอึด / กล้าลุยงานเลอะเทอะ / กล้าต่อรองขอเครดิต 45 วัน', value: 40000, desc: 'ทักษะความกล้าต่อรองเพื่อรักษาสภาพคล่องทางการเงิน' },
  ];

  const total = selectedItems.reduce((sum, id) => sum + (items.find((i) => i.id === id)?.value || 0), 0);
  const toggle = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4 text-[#E11D48]" />
          เช็กลิสต์ประเมินมูลค่า 5 แกนทุนชีวิตแฝง
        </span>
        <span className="text-[11px] font-mono font-bold text-[#E11D48] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-100">
          ประเมินรวม: ฿{total.toLocaleString()}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const isChecked = selectedItems.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                isChecked ? 'bg-white dark:bg-[#0F172A] border-[#E11D48] shadow-xs' : 'bg-white/60 dark:bg-[#0F172A]/40 border-[#E2E8F0] dark:border-gray-800 hover:border-gray-300'
              }`}
            >
              {isChecked ? <CheckSquare className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isChecked ? 'text-[#0F172A] dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{item.label}</span>
                  <span className="text-[11px] font-mono font-bold text-[#E11D48]">+฿{item.value.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Monetization6AxisCalculator: React.FC = () => {
  const [skill, setSkill] = useState('ช่างไฟฟ้า / วางระบบสายไฟ');
  const axes = [
    { title: '1. Vertical (เฉพาะทาง)', plan: 'รับเหมาติดตั้งตู้ MDB และเดินสายไฟโรงงาน คิดค่าแรงรายชิ้นงานระดับโปร' },
    { title: '2. Horizontal (ผสมข้ามสาย)', plan: 'รวมทักษะช่างไฟ + Smart Home IoT ติดตั้งกล้องวงจรปิดและสวิตช์สั่งงานมือถือ' },
    { title: '3. Universal (อุดรอยรั่ว)', plan: 'สลับมาซื้อสายไฟยกม้วนตรงจากโรงงาน ประหยัดต้นทุนวัสดุได้ทันที 18%' },
    { title: '4. Hyper-Local (ทำเลรอบตัว)', plan: 'รับแก้งานไฟฟ้าลัดวงจรฉุกเฉินในรัศมี 3 กม. ถึงหน้างานใน 20 นาที' },
    { title: '5. Social Capital (นายหน้าชุมชน)', plan: 'แนะนำช่างสี-ช่างปูนให้เจ้าของบ้าน รับส่วนแบ่งนายหน้า 5-10% ต่อจ็อบ' },
    { title: '6. Temporal & Friction (กะดึก/งานหนัก)', plan: 'เปิดสแตนด์บายกู้ไฟดับช่วงฝนตกกะดึก คิดเรทฉุกเฉิน 2.5 เท่า' },
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#E11D48]" />
          สร้างแผนทำเงินใน 24 ชั่วโมง ครบ 6 แกน
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="ป้อนทักษะหรือทรัพยากรที่มี..."
          className="flex-1 bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#E11D48]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {axes.map((ax, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800 space-y-1">
            <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-wider block">{ax.title}</span>
            <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{ax.plan}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CognitiveBoardView: React.FC = () => {
  const cores = [
    { name: '1. Career Navigator', icon: Layers, text: 'ประเมินการเติบโต: เปลี่ยนจากช่างเดี่ยวเป็นหัวหน้าทีมคุม 3 โครงการพร้อมกัน' },
    { name: '2. Finance & Tax', icon: PieChart, text: 'กันสำรองภาษี 3% ทุกงวด และเก็บเงินสดสำรองให้พอกับ 6 เดือน' },
    { name: '3. Procurement/BATNA', icon: ArrowRight, text: 'ขอใบเสนอราคาเทียบ 3 เจ้า และตั้งราคาถอนตัวไว้ที่ส่วนลดไม่เกิน 10%' },
    { name: '4. Legal Shield', icon: Shield, text: 'ระบุขอบเขตแก้งานไม่เกิน 2 ครั้ง และเพดานรับผิดชอบสูงสุดไม่เกินมูลค่างาน' },
    { name: '5. Time/Ops', icon: CheckSquare, text: 'บล็อกเวลาทำหน้างาน 90 นาที และเผื่อเวลา Buffer 20% สำหรับตรวจรับ' },
    { name: '6. Personal Branding', icon: Sparkles, text: 'ใช้สูตร Problem-Action-Result สรุปผลงานส่งลูกค้าเพื่อสร้างความเชื่อมั่น' },
    { name: '7. Burnout & PDPA', icon: Lock, text: 'หยุดงานหลัง 19:00 น. และลบข้อมูลเบอร์โทรลูกค้าออกจากกลุ่มสาธารณะ' },
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        มุมมองสมองกล AI 7 แกนกลางพร้อมกัน (7-Core Board)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cores.map((c, i) => (
          <div key={i} className="bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-gray-800">
            <span className="text-[10px] font-bold text-[#E11D48] flex items-center gap-1 mb-1">
              <c.icon className="w-3 h-3 text-[#E11D48]" />
              {c.name}
            </span>
            <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OntologyRouterCalculator: React.FC = () => {
  const [keyword, setKeyword] = useState('ปูนแพง');
  const routerDb: Record<string, { d2: string; d3: string; label: string }> = {
    'ปูนแพง': { d2: 'D2.01 (เทียบ 3 เจ้า)', d3: 'D3.01.01 (BOQ & Price Lock)', label: 'วิกฤตราคาวัสดุจัดซื้อ' },
    'วางบิล': { d2: 'D2.02 (ภาษี & สายป่าน)', d3: 'D3.01.02 (Progress Billing)', label: 'ปัญหาวางบิลเบิกงวดงาน' },
    'แรงงานต่างด้าว': { d2: 'D2.03 (SOP & เวลา)', d3: 'D3.01.03 (HR ต่างด้าว 60 วัน)', label: 'การคุมแรงงานหน้าไซด์' },
    'สัญญาทิ้งงาน': { d2: 'D2.04 (ตรวจ 5 จุดสัญญา)', d3: 'D3.01.04 (VO & ค่าปรับล่าช้า)', label: 'ความเสี่ยงข้อพิพาทสัญญา' },
    'ตรวจรับบ้าน': { d2: 'D2.05 (สคริปต์เจรจา)', d3: 'D3.01.06 (Defect Triage 7-14 วัน)', label: 'ส่งมอบงานและเคลมบกพร่อง' },
    'หมดไฟ': { d2: 'D2.07 (รอบสมอง 90 นาที)', d3: 'D3.01.07 (ด่านตรวจเอกสาร CEO)', label: 'ภาวะเครียดสะสมและการตัดสินใจ' },
  };

  const matched = routerDb[keyword] || { d2: 'D2.01 (การจัดซื้อ)', d3: 'D3.01.00 (Feasibility)', label: 'การวิเคราะห์ปัญหาทั่วไป' };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        เรดาร์จับคู่พิกัดปัญหา O(1)
      </span>
      <div className="flex gap-1.5 flex-wrap">
        {Object.keys(routerDb).map((kw) => (
          <button
            key={kw}
            onClick={() => setKeyword(kw)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              keyword === kw ? 'bg-[#E11D48] text-white shadow-xs' : 'bg-white dark:bg-[#0F172A] text-gray-600 dark:text-gray-300 border border-[#E2E8F0] dark:border-gray-700 hover:border-gray-400'
            }`}
          >
            {kw}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] dark:border-gray-800 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] dark:text-white">
          <span>{matched.label}</span>
          <span className="text-[10px] text-[#E11D48] font-mono">MATCH STATUS: O(1) INSTANT</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono font-bold text-[#0F172A] dark:text-white">Universal: {matched.d2}</span>
          <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 font-mono font-bold text-[#E11D48]">Specialized: {matched.d3}</span>
        </div>
      </div>
    </div>
  );
};

export const CapTableCalculator: React.FC = () => {
  const [sweat, setSweat] = useState(150000);
  const [equip, setEquip] = useState(80000);
  const [venue, setVenue] = useState(50000);
  const [cash, setCash] = useState(200000);

  const nonCash = sweat + equip + venue;
  const totalValuation = nonCash + cash;
  const founderEquity = totalValuation > 0 ? Math.round((nonCash / totalValuation) * 100) : 0;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        แปลงหยาดเหงื่อเป็นหุ้น & ตาราง Escrow 3 งวด
      </span>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">ค่าแรง (Sweat Capital)</label>
          <input type="number" value={sweat} onChange={(e) => setSweat(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">เครื่องมือ (Equip Capital)</label>
          <input type="number" value={equip} onChange={(e) => setEquip(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">ทำเล/พื้นที่ (Venue)</label>
          <input type="number" value={venue} onChange={(e) => setVenue(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">เงินสดคู่ขนาน (Cash)</label>
          <input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))} className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-lg p-1.5 font-mono text-xs" />
        </div>
      </div>
      <div className="bg-white dark:bg-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] dark:border-gray-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-500 block">สัดส่วนหุ้นผู้ลงแรง (Founder Equity)</span>
          <span className="text-xl font-mono font-black text-[#E11D48]">{founderEquity}%</span>
        </div>
        <div className="text-right text-[11px] font-mono text-gray-600 dark:text-gray-300">
          <span>มูลค่ารวม: ฿{totalValuation.toLocaleString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"><span className="text-gray-500 block">งวดที่ 1 (มัดจำ)</span><span className="font-bold text-[#0F172A] dark:text-white">20% เริ่มงาน</span></div>
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"><span className="text-gray-500 block">งวดที่ 2 (กลางงาน)</span><span className="font-bold text-[#0F172A] dark:text-white">40% ตรวจรับ 60%</span></div>
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"><span className="text-gray-500 block">งวดที่ 3 (ตรวจรับ)</span><span className="font-bold text-[#0F172A] dark:text-white">40% Test Run</span></div>
      </div>
    </div>
  );
};

export const PiiGuardrailMasker: React.FC = () => {
  const [input, setInput] = useState('สัญญาจ้างทำของ นายสมชาย มั่นคง เลขบัตรประชาชน 1100400123456 และชำระผ่านบัตร 4123 4567 8901 2345 จำนวน 50,000 บาท');
  const [masked, setMasked] = useState('');

  const handleMask = () => {
    let res = input;
    res = res.replace(/\b[1-8]\d{12}\b/g, '[REDACTED_THAI_ID]');
    res = res.replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_CARD]');
    setMasked(res);
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-gray-800 rounded-2xl p-4 space-y-3 font-prompt">
      <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-2 border-b border-[#E2E8F0] dark:border-gray-800">
        เซ็นเซอร์ข้อมูลส่วนบุคคล PDPA (Dual-Layer PII Masker)
      </span>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="w-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-gray-700 rounded-xl p-2.5 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#E11D48] resize-none font-mono"
      />
      <button onClick={handleMask} className="px-4 py-2 bg-[#E11D48] text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs">
        เซ็นเซอร์ข้อมูลส่วนบุคคล (Mask PII)
      </button>
      {masked && (
        <div className="bg-white dark:bg-[#0F172A] p-3 rounded-xl border border-[#E2E8F0] dark:border-gray-800 space-y-1">
          <span className="text-[10px] font-mono text-emerald-600 font-bold block">MASKED PAYLOAD READY:</span>
          <p className="text-xs font-mono text-gray-800 dark:text-gray-200 leading-relaxed">{masked}</p>
        </div>
      )}
    </div>
  );
};
