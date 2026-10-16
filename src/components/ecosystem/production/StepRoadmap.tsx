'use client';

import React, { useState } from 'react';
import { ProductChain } from './types';
import {
  Calendar,
  Truck,
  CheckCircle2,
  TrendingUp,
  Tag,
  Award,
  ArrowRight,
  ArrowLeft,
  Factory,
  ShieldCheck,
  Share2,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  step: number;
  chain: ProductChain;
  onNavigateStep: (step: number) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StepRoadmap: React.FC<Props> = ({
  step,
  chain,
  onNavigateStep,
  onNavigateTab,
}) => {
  const p = chain.product;
  const nodes = chain.supply_chain_nodes;
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // STEP 07: แผนปฏิบัติการ 30-60-90 วัน
  if (step === 7) {
    const plans = [
      {
        phase: 'ช่วง 1-30 วันแรก (เตรียมการ & รวมกลุ่ม)',
        color: 'border-red-500 bg-red-50/40 text-brand-red',
        tasks: [
          { id: '7-1', text: `เลือกโมเดลจุดแทรกตัวของ "${p.product_name}" ในขั้นตอน 03` },
          { id: '7-2', text: 'ทดลองจำลองต้นทุน-กำไรในขั้นตอน 04 ลองคำนวณ' },
          { id: '7-3', text: 'เปิดห้องหารล็อตผลิตในขั้นตอน 06 เพื่อรวมกลุ่มให้ครบ MOQ' },
        ],
      },
      {
        phase: 'ช่วง 31-60 วัน (เริ่มผลิต & ตรวจสอบคุณภาพ)',
        color: 'border-amber-500 bg-amber-50/40 text-amber-700',
        tasks: [
          { id: '7-4', text: 'ส่งใบสั่งซื้ออิเล็กทรอนิกส์ (PO) ให้โรงงาน OEM เป้าหมาย' },
          { id: '7-5', text: 'ระบบล็อกเงินมัดจำใน Safe Escrow Vault งวดที่ 1' },
          { id: '7-6', text: 'ตรวจรับตัวอย่างชิ้นงานและผลทดสอบ QC งวดที่ 2' },
        ],
      },
      {
        phase: 'ช่วง 61-90 วัน (ส่งมอบ & วางขาย)',
        color: 'border-emerald-500 bg-emerald-50/40 text-emerald-700',
        tasks: [
          { id: '7-7', text: 'กระจายสินค้าตามโควตาสู่สมาชิกทุกคนครบถ้วน' },
          { id: '7-8', text: 'ปล่อยสินค้าลงสู่ช่องทางขายทั้งออนไลน์และออฟไลน์' },
          { id: '7-9', text: 'วัดผลฟีดแบ็กจากผู้บริโภคและเตรียมขยายสเกลล็อตถัดไป' },
        ],
      },
    ];

    return (
      <div className="space-y-4 pb-8">
        <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-brand-red/10 text-brand-red flex items-center justify-center text-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                แผนปฏิบัติการ 30-60-90 วัน (Action Plan)
              </h2>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">ขั้นตอนที่ 07</span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            โรดแมปการลงมือทำจริงสำหรับสินค้า <b>{p.product_name}</b> ติ๊กรายการที่ทำสำเร็จเพื่อติดตามความคืบหน้า
          </p>

          <div className="space-y-3.5 pt-1">
            {plans.map((pGroup) => (
              <div key={pGroup.phase} className="rounded-2xl border border-gray-150 dark:border-gray-800 p-3.5 space-y-2.5">
                <div className={`px-2.5 py-1 rounded-xl text-xs font-bold inline-block border ${pGroup.color}`}>
                  {pGroup.phase}
                </div>
                <div className="space-y-2">
                  {pGroup.tasks.map((t) => {
                    const isDone = !!completedItems[t.id];
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleItem(t.id)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-300 text-gray-400 line-through'
                            : 'bg-white dark:bg-zinc-800 border-gray-200 text-gray-800 dark:text-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-600' : 'text-gray-300'}`} />
                        <span>{t.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigateStep(6)}
              className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับไปเชื่อมดอท (06)</span>
            </button>
            <button
              onClick={() => onNavigateStep(8)}
              className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold flex items-center gap-1.5"
            >
              <span>ไปจับคู่ซัพพลายเออร์ (08)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 08: จับคู่ซัพพลายเออร์ & วัตถุดิบ
  if (step === 8) {
    return (
      <div className="space-y-4 pb-8">
        <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                <Truck className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                จับคู่ซัพพลายเออร์ & โรงงาน OEM (Supplier Matching)
              </h2>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">ขั้นตอนที่ 08</span>
          </div>

          <p className="text-xs text-gray-500">
            ระบบจับคู่โรงงานแปรรูป บรรจุภัณฑ์ และแหล่งวัตถุดิบที่พร้อมรองรับใบสั่งผลิตของ <b>{p.product_name}</b>
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800 space-y-1">
              <div className="text-[10px] text-gray-400">โรงงานที่รองรับในระบบ</div>
              <div className="text-base font-extrabold text-brand-black dark:text-white">12+ แห่ง</div>
              <div className="text-[10px] text-emerald-600 font-semibold">✓ ผ่านมาตรฐาน GMP/อย.</div>
            </div>
            <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800 space-y-1">
              <div className="text-[10px] text-gray-400">รัศมีใกล้บ้านคุณ</div>
              <div className="text-base font-extrabold text-blue-600">5 - 30 กม.</div>
              <div className="text-[10px] text-gray-500">ลดค่าขนส่งโลจิสติกส์</div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {nodes.slice(0, 3).map((n) => (
              <div key={n.node_order} className="p-3 rounded-2xl border border-gray-150 dark:border-zinc-800 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-gray-400">โหนด {n.node_order} • {n.node_title}</div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                    โรงงานคู่ค้า OEM แนะนำสำหรับ {n.node_title}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab ? onNavigateTab('ทำใกล้') : onNavigateStep(6)}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[10.5px] font-bold"
                >
                  📍 ปักหมุดในทำใกล้
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigateStep(7)}
              className="px-3.5 py-2 rounded-xl bg-gray-100 text-xs font-bold"
            >
              ← ขั้นตอนที่ 07
            </button>
            <button
              onClick={() => onNavigateStep(9)}
              className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold"
            >
              ไปทดสอบตลาด (09) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 09: ทดสอบตลาด & ปล่อย MVP
  if (step === 9) {
    return (
      <div className="space-y-4 pb-8">
        <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                ทดสอบตลาด & ปล่อย MVP (Market Validation)
              </h2>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">ขั้นตอนที่ 09</span>
          </div>

          <p className="text-xs text-gray-500">
            วิธีทดสอบฟีดแบ็กลูกค้าตัวจริงด้วยต้นทุนต่ำสุดก่อนลงเงินก้อนใหญ่ในสายพาน <b>{p.product_name}</b>
          </p>

          <div className="space-y-2">
            {[
              {
                title: '1. ทดสอบเปิดพรีออเดอร์ล็อตเล็ก (Pre-Order Smoke Test)',
                desc: 'เปิดรับจองสินค้าล่วงหน้าผ่านช่องทางโซเชียลเพื่อวัดความต้องการจริง',
                target: 'เป้าหมาย: จองครบ 20-50 หน่วย',
              },
              {
                title: '2. ตรวจสอบคะแนนความพึงพอใจ (NPS / Taste Test)',
                desc: 'ส่งตัวอย่างให้กลุ่มเป้าหมาย 10-20 คนประเมิน รสชาติ/แพ็กเกจจิ้ง/ความคุ้มราคา',
                target: 'เป้าหมาย: คะแนนความพึงพอใจ 8.5/10 ขึ้นไป',
              },
              {
                title: '3. ปรับสเปกตามความคิดเห็น (Feedback Iteration)',
                desc: 'นำฟีดแบ็กจริงมาปรับแก้สูตร บรรจุภัณฑ์ หรือการตั้งราคาก่อนผลิตล็อตเต็ม',
                target: 'เป้าหมาย: ลดอัตราการซื้อซ้ำต่ำกว่าเกณฑ์',
              },
            ].map((item) => (
              <div key={item.title} className="p-3.5 rounded-2xl bg-brand-gray dark:bg-zinc-800 space-y-1">
                <h4 className="text-xs font-extrabold text-brand-black dark:text-white">{item.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                <div className="text-[10px] text-emerald-600 font-bold pt-0.5">{item.target}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button onClick={() => onNavigateStep(8)} className="px-3.5 py-2 rounded-xl bg-gray-100 text-xs font-bold">
              ← ขั้นตอนที่ 08
            </button>
            <button onClick={() => onNavigateStep(10)} className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold">
              ไปตั้งราคา & ขาย (10) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 10: ตั้งราคาและวางขาย
  if (step === 10) {
    return (
      <div className="space-y-4 pb-8">
        <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                <Tag className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                กลยุทธ์การตั้งราคา & ช่องทางกระจายสินค้า (Pricing & Channels)
              </h2>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">ขั้นตอนที่ 10</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800">
              <div className="text-[10px] text-gray-400">ราคาขายส่ง</div>
              <div className="text-xs font-extrabold font-mono text-gray-800 dark:text-gray-200 mt-1">
                ฿{Math.round(p.total_value_spread.final_retail_value_thb * 0.65).toLocaleString()}
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">มาร์จิ้น 20-30%</div>
            </div>
            <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800">
              <div className="text-[10px] text-gray-400">ราคาขายปลีก</div>
              <div className="text-xs font-extrabold font-mono text-brand-red mt-1">
                ฿{p.total_value_spread.final_retail_value_thb.toLocaleString()}
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">มาร์จิ้น 40-50%</div>
            </div>
            <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800">
              <div className="text-[10px] text-gray-400">ราคาพรีเมียม</div>
              <div className="text-xs font-extrabold font-mono text-emerald-600 mt-1">
                ฿{Math.round(p.total_value_spread.final_retail_value_thb * 1.35).toLocaleString()}
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">มาร์จิ้น 60%+</div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-brand-black dark:text-white">ช่องทางกระจายสินค้าแนะนำ</h4>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl border border-gray-150 flex items-center justify-between">
                <span>🛒 ขายตรงผู้บริโภค (DTC / Social Commerce)</span>
                <span className="font-bold text-emerald-600">กำไรสูงสุด</span>
              </div>
              <div className="p-2.5 rounded-xl border border-gray-150 flex items-center justify-between">
                <span>🏬 ตัวแทนจำหน่าย & ร้านค้าของฝาก</span>
                <span className="font-bold text-blue-600">สเกลวอลุ่มได้เร็ว</span>
              </div>
              <div className="p-2.5 rounded-xl border border-gray-150 flex items-center justify-between">
                <span>🏢 B2B โรงแรม ร้านอาหาร คาเฟ่ (HORECA)</span>
                <span className="font-bold text-amber-600">ออเดอร์ประจำสม่ำเสมอ</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button onClick={() => onNavigateStep(9)} className="px-3.5 py-2 rounded-xl bg-gray-100 text-xs font-bold">
              ← ขั้นตอนที่ 09
            </button>
            <button onClick={() => onNavigateStep(11)} className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold">
              ไปขยายสเกล & ส่งออก (11) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 11: ขยายสเกลและส่งออก
  if (step === 11) {
    return (
      <div className="space-y-4 pb-8">
        <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                ขยายกำลังผลิต & ตลาดต่างประเทศ (Scale & Export)
              </h2>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">ขั้นตอนที่ 11</span>
          </div>

          <p className="text-xs text-gray-500">
            ยกระดับมาตรฐานเพื่อรองรับการสั่งซื้อล็อตใหญ่ระดับตู้คอนเทนเนอร์และการส่งออกต่างประเทศ
          </p>

          <div className="space-y-2">
            {[
              {
                title: 'มาตรฐานโรงงานและส่งออกที่ต้องเตรียม',
                items: ['GMP Codex / HACCP สำหรับอาหารแปรรูป', 'ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate)', 'ฮาลาล (Halal) สำหรับตลาดตะวันออกกลางและอาเซียน'],
              },
              {
                title: 'การบริหารกำลังผลิตล็อตใหญ่',
                items: ['ทำสัญญารับซื้อผลผลิตล่วงหน้า (Contract Farming)', 'กระจายความเสี่ยงด้วยโรงงาน OEM สำรอง 2-3 แห่ง', 'ใช้ระบบคลังสินค้าทัณฑ์บนหรือควบคุมความเย็น (Cold Chain)'],
              },
            ].map((sec) => (
              <div key={sec.title} className="p-3.5 rounded-2xl bg-brand-gray dark:bg-zinc-800 space-y-1.5">
                <h4 className="text-xs font-bold text-brand-black dark:text-white">{sec.title}</h4>
                <div className="space-y-1 text-[11px] text-gray-600 dark:text-gray-300">
                  {sec.items.map((it) => (
                    <div key={it} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button onClick={() => onNavigateStep(10)} className="px-3.5 py-2 rounded-xl bg-gray-100 text-xs font-bold">
              ← ขั้นตอนที่ 10
            </button>
            <button onClick={() => onNavigateStep(12)} className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold">
              ไปสรุปผล & ต่อยอด (12) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 12: สรุปผลและต่อยอด (Executive Dashboard)
  return (
    <div className="space-y-4 pb-8">
      <div className="bg-white dark:bg-[#1e232a] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              สรุปภาพรวมห่วงโซ่ & แผนต่อยอด (Executive Summary)
            </h2>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">ขั้นตอนที่ 12</span>
        </div>

        <div className="p-4 rounded-2xl bg-brand-black text-white space-y-2">
          <div className="text-[10px] text-brand-red font-bold uppercase tracking-wider">ภาพรวมความสำเร็จ 12 ขั้นตอน</div>
          <h3 className="text-sm font-extrabold">{p.product_name}</h3>
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
            <div className="p-2 rounded-xl bg-white/10">
              <div className="text-[9px] text-gray-400">ต้นน้ำ</div>
              <div className="text-xs font-bold mt-0.5">฿{p.total_value_spread.origin_cost_thb.toLocaleString()}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/10">
              <div className="text-[9px] text-gray-400">ปลายน้ำ</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">฿{p.total_value_spread.final_retail_value_thb.toLocaleString()}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/10">
              <div className="text-[9px] text-gray-400">มูลค่าเพิ่ม</div>
              <div className="text-xs font-bold text-brand-red mt-0.5">+{p.total_value_spread.total_markup_percent}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-brand-black dark:text-white">ก้าวต่อไปของคุณในระบบนิเวศ</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigateStep(4)}
              className="p-3 rounded-2xl bg-brand-gray hover:bg-gray-200 text-left space-y-1 transition-colors"
            >
              <div className="font-bold text-brand-black">🧮 คำนวณกำไรจุดคุ้มทุน</div>
              <div className="text-[10px] text-gray-500">จำลองสัดส่วนต้นทุนแบบละเอียด</div>
            </button>
            <button
              onClick={() => onNavigateStep(6)}
              className="p-3 rounded-2xl bg-brand-gray hover:bg-gray-200 text-left space-y-1 transition-colors"
            >
              <div className="font-bold text-brand-black">🤝 เข้าห้องรวมล็อตผลิต</div>
              <div className="text-[10px] text-gray-500">วางมัดจำและออกใบสั่งซื้อ PO</div>
            </button>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button onClick={() => onNavigateStep(11)} className="px-3.5 py-2 rounded-xl bg-gray-100 text-xs font-bold">
            ← ขั้นตอนที่ 11
          </button>
          <button onClick={() => onNavigateStep(2)} className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold">
            กลับไปดูแดชบอร์ดบาร์ (02) →
          </button>
        </div>
      </div>
    </div>
  );
};
