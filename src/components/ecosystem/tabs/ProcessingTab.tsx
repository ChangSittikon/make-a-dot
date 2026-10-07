'use client';

import React from 'react';
import Link from 'next/link';

interface ProcessingTabProps {
  promptInput: string;
  setPromptInput: (val: string) => void;
  isProcessing: boolean;
  processingPhase: number;
  hasAnalyzed: boolean;
  onRunProcessing: () => void;
  onNavigateToEcosystem: () => void;
}

export const ProcessingTab: React.FC<ProcessingTabProps> = ({
  promptInput,
  setPromptInput,
  isProcessing,
  processingPhase,
  hasAnalyzed,
  onRunProcessing,
  onNavigateToEcosystem,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollable-content pb-24 font-prompt">
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
          onClick={onRunProcessing}
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
              onClick={onNavigateToEcosystem}
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
};
