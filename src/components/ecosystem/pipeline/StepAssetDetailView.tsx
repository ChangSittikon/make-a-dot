'use client';

import React from 'react';
import { CapTableItem, IndustryCapPreset } from '../types';

interface StepAssetDetailViewProps {
  assetId: 'cash' | 'sweat' | 'equip' | 'venue' | 'ip';
  stepNumber: number;
  stepTitle: string;
  stepDescription: string;
  nextStepTitle: string;
  capTableData: CapTableItem[];
  currentPreset: IndustryCapPreset;
  onUpdateCapItem: (id: string, val: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const ASSET_META: Record<string, { icon: string; color: string; bgClass: string; textClass: string; checklist: string[] }> = {
  cash: {
    icon: 'fa-solid fa-money-bill-wave',
    color: '#56b6f7',
    bgClass: 'from-sky-500/10 to-blue-500/10 border-sky-500/20',
    textClass: 'text-sky-600 dark:text-sky-400',
    checklist: [
      'เงินสดสำรองสภาพคล่องล่วงหน้า 3-6 เดือน',
      'ค่าจัดซื้อวัสดุ อุปกรณ์ และค่าใช้จ่ายงวดแรก',
      'ค่าธรรมเนียมใบอนุญาต ประกันภัย และภาษี',
      'เงินกองทุนหมุนเวียนชำระตามรอบ Milestone',
    ],
  },
  sweat: {
    icon: 'fa-solid fa-user-gear',
    color: '#9d9ff7',
    bgClass: 'from-indigo-500/10 to-purple-500/10 border-indigo-500/20',
    textClass: 'text-indigo-600 dark:text-indigo-400',
    checklist: [
      'เวลาการทำงานของผู้ก่อตั้งและทีมงานหลัก (Founder Time)',
      'ค่าตอบแทนวิชาชีพเฉพาะทาง (สถาปนิก วิศวกร แพทย์ โปรแกรมเมอร์)',
      'การลงแรงปฏิบัติการหน้างาน (Operation & Field Sweat)',
      'การประเมินชั่วโมงทำงานคูณด้วยอัตราค่าจ้างตลาดแปลงเป็นหุ้น',
    ],
  },
  equip: {
    icon: 'fa-solid fa-screwdriver-wrench',
    color: '#3bd18e',
    bgClass: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    checklist: [
      'เครื่องจักรกล เครื่องมือเฉพาะทางที่นำมาร่วมใช้งาน',
      'เซิร์ฟเวอร์ คลาวด์คอมพิวติ้ง หรือฮาร์ดแวร์ไอที',
      'ยานพาหนะ หรือเครื่องมือทดสอบมาตรฐาน',
      'การประเมินค่าเสื่อมราคาและค่าเช่าตลาดเทียบเป็นทุน',
    ],
  },
  venue: {
    icon: 'fa-solid fa-building',
    color: '#a3e635',
    bgClass: 'from-lime-500/10 to-green-500/10 border-lime-500/20',
    textClass: 'text-lime-600 dark:text-lime-400',
    checklist: [
      'ที่ดินเปล่า แปลงจัดสรร หรือโฉนดเพื่อการพัฒนา',
      'อาคาร ออฟฟิศ โรงงาน หรือพื้นที่ครัวกลาง',
      'สิทธิ์การใช้พื้นที่ สัญญาเช่าระยะยาวที่นำมาเป็นสินทรัพย์',
      'การประเมินราคาประเมินราชการหรือราคาตลาดทำเล',
    ],
  },
  ip: {
    icon: 'fa-solid fa-lightbulb',
    color: '#f3e8c8',
    bgClass: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20',
    textClass: 'text-amber-600 dark:text-amber-400',
    checklist: [
      'แบบแปลนก่อสร้าง พิมพ์เขียว หรือโค้ดซอฟต์แวร์',
      'ใบอนุญาตก่อสร้าง อ.1, ใบอนุญาต อย., หรือสิทธิบัตร',
      'แบรนด์ เครื่องหมายการค้า และลิขสิทธิ์เนื้อหา',
      'สูตรการผลิต Know-How และโมเดลธุรกิจเฉพาะ',
    ],
  },
};

export const StepAssetDetailView: React.FC<StepAssetDetailViewProps> = ({
  assetId,
  stepNumber,
  stepTitle,
  stepDescription,
  nextStepTitle,
  capTableData,
  currentPreset,
  onUpdateCapItem,
  onPrevStep,
  onNextStep,
}) => {
  const meta = ASSET_META[assetId] || ASSET_META.cash;
  const item = capTableData.find((c) => c.id === assetId) || { id: assetId, name: stepTitle, value: 0, color: meta.color };
  const totalValuation = capTableData.reduce((acc, cur) => acc + cur.value, 0);
  const percentage = totalValuation > 0 ? ((item.value / totalValuation) * 100).toFixed(1) : '0.0';

  const benchmarkVal = (currentPreset as any)[assetId]?.val ?? 500000;
  const benchmarkHint = (currentPreset as any)[assetId]?.hint ?? '';

  // Dynamic slider scale
  const sliderMax = Math.max(benchmarkVal * 3, 2000000);
  const sliderStep = Math.max(10000, Math.pow(10, Math.floor(Math.log10(sliderMax)) - 2));
  const sliderPct = Math.min(100, Math.max(0, (item.value / sliderMax) * 100));

  return (
    <div className="p-3 sm:p-4 space-y-4 font-prompt">
      {/* Step Banner */}
      <div className={`bg-gradient-to-r ${meta.bgClass} p-4 rounded-2xl border`}>
        <span className={`text-[10px] font-bold ${meta.textClass} uppercase tracking-wider block mb-1`}>
          ขั้นตอนที่ {stepNumber} จาก 12
        </span>
        <div className="flex items-center gap-2">
          <i className={`${meta.icon} ${meta.textClass} text-sm`}></i>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {stepTitle}
          </h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {stepDescription}
        </p>
      </div>

      {/* Main Metric & Slider Card */}
      <div className="bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-[#262930] p-4 @2xl:p-5 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-medium">มูลค่าที่ประเมินเป็นทุน</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-mono">
                {item.value.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-gray-400">THB</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-gray-400 font-medium">สัดส่วนใน Cap Table</span>
            <span
              className="block mt-0.5 px-2 py-0.5 rounded-lg text-xs font-mono font-bold text-gray-900 dark:text-white"
              style={{ backgroundColor: `${item.color}33`, color: item.color }}
            >
              {percentage}%
            </span>
          </div>
        </div>

        {/* Slider Input */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span>0 THB</span>
            <span className="font-semibold text-gray-500">เลื่อนเพื่อปรับสัดส่วน</span>
            <span>{sliderMax.toLocaleString()} THB</span>
          </div>
          <input
            type="range"
            min={0}
            max={sliderMax}
            step={sliderStep}
            value={item.value}
            onChange={(e) => onUpdateCapItem(item.id, Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none bg-gray-200 dark:bg-gray-800"
            style={{
              background: `linear-gradient(to right, ${item.color} 0%, ${item.color} ${sliderPct}%, #e5e7eb ${sliderPct}%, #e5e7eb 100%)`,
            }}
          />
        </div>

        {/* Benchmark Hint & Reset */}
        <div className="p-3 bg-gray-50 dark:bg-[#13151b] rounded-xl flex items-start justify-between gap-3 border border-gray-100 dark:border-gray-800">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              คำแนะนำมาตรฐานเฉพาะโครงการ:
            </span>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mt-0.5 leading-snug">
              {benchmarkHint || 'อิงตามเกณฑ์มาตรฐานของอุตสาหกรรม'}
            </p>
            <span className="text-[10px] text-gray-400 mt-1 block">
              ค่าแนะนำเริ่มต้น: {benchmarkVal.toLocaleString()} THB
            </span>
          </div>
          <button
            onClick={() => onUpdateCapItem(item.id, benchmarkVal)}
            className="shrink-0 text-[10px] font-bold text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <i className="fa-solid fa-rotate-left text-[9px]"></i>
            รีเซ็ต
          </button>
        </div>

        {/* Asset Checklist Criteria */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <span className="text-[11px] font-bold text-gray-900 dark:text-white block">
            เกณฑ์การแปลงทรัพยากรส่วนนี้เป็นทุน:
          </span>
          <div className="space-y-1.5">
            {meta.checklist.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                <i className="fa-solid fa-check text-[10px] text-emerald-500 mt-0.5 shrink-0"></i>
                <span className="leading-tight">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onPrevStep}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#20232b] dark:hover:bg-[#282c36] text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all"
        >
          <i className="fa-solid fa-arrow-left text-[11px] mr-1.5"></i>
          ย้อนกลับ
        </button>
        <button
          onClick={onNextStep}
          className="flex-1 py-3 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <span>ถัดไป: {nextStepTitle}</span>
          <i className="fa-solid fa-arrow-right text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
