'use client';

import React, { useState } from 'react';
import { ProblemToolItem } from '../types';
import { PROBLEM_TOOLS_LIST } from '../constants';

export const SolverTab: React.FC = () => {
  const [solverFilter, setSolverFilter] = useState<'ALL' | 'DISPUTE' | 'BUDGET' | 'WORKFORCE' | 'QUALITY'>('ALL');
  const [activeToolModal, setActiveToolModal] = useState<ProblemToolItem | null>(null);

  const filteredTools = solverFilter === 'ALL'
    ? PROBLEM_TOOLS_LIST
    : PROBLEM_TOOLS_LIST.filter(t => t.category === solverFilter);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollable-content pb-24 font-prompt">
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
