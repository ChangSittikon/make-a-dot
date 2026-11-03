"use client";

import React, { useState } from 'react';
import { NongDot } from '@/components/flow/NongDot';

export interface QuickFixCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  bounty: {
    id?: string;
    bountyId?: string;
    rawDescription?: string | null;
    targetOccupations?: Array<{ name: string }>;
    targetSkills?: Array<{ name: string }>;
    rewardText?: string | null;
    originDotCode?: string | null;
    occupation?: { name: string } | null;
    problemCategory?: string | null;
  } | null;
}

/**
 * ฟังก์ชันช่วยวิเคราะห์อาชีพและคนช่วยที่ตรงจุดจากปัญหา (ภาษาคนทั่วไป)
 */
function resolveRecommendedHelper(bounty: QuickFixCardModalProps['bounty']) {
  if (bounty?.occupation?.name) return bounty.occupation.name;
  if (bounty?.targetOccupations && bounty.targetOccupations.length > 0 && bounty.targetOccupations[0]?.name) {
    return bounty.targetOccupations[0].name;
  }

  const text = (bounty?.rawDescription || '').toLowerCase();
  if (text.includes('จัดซื้อ') || text.includes('ราคา') || text.includes('วัสดุ') || text.includes('ของ')) {
    return 'นักจัดซื้อและประสานงานไซต์งาน (เชี่ยวชาญเทียบราคากลาง)';
  }
  if (text.includes('บัญชี') || text.includes('เงิน') || text.includes('ภาษี') || text.includes('บิล')) {
    return 'นักบัญชีและที่ปรึกษากระแสเงินสด';
  }
  if (text.includes('คน') || text.includes('แรงงาน') || text.includes('หาคน') || text.includes('ช่าง')) {
    return 'หัวหน้าทีมช่างและผู้จัดการแรงงาน';
  }
  if (text.includes('สัญญา') || text.includes('สิทธิ์') || text.includes('โกง') || text.includes('เทศบาล')) {
    return 'ที่ปรึกษาสัญญาและรักษาสิทธิ์';
  }
  if (text.includes('ซ่อม') || text.includes('ไฟ') || text.includes('น้ำ') || text.includes('ท่อ') || text.includes('แอร์')) {
    return 'ช่างซ่อมบำรุงและดูแลงานระบบอาคาร';
  }
  return 'ช่างหรือผู้เชี่ยวชาญเฉพาะทางหน้างาน';
}

export function QuickFixCardModal({
  isOpen,
  onClose,
  bounty,
}: QuickFixCardModalProps) {
  // Accordion พับเก็บเป็นค่าเริ่มต้น (Collapsed by default)
  const [openSection, setOpenSection] = useState<number | null>(null);

  // เช็กลิสต์ติ๊กถูกได้ 3 ขั้นตอน
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  if (!isOpen || !bounty) return null;

  const toggleSection = (sectionIndex: number) => {
    setOpenSection(openSection === sectionIndex ? null : sectionIndex);
  };

  const toggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const displayCode = bounty.originDotCode || (bounty.id ? `#${bounty.id.slice(-6).toUpperCase()}` : '#DOT-QUEST');
  const descriptionSnippet = bounty.rawDescription?.trim() || "ตามรายละเอียดที่แจ้งในระบบ";
  const recommendedHelper = resolveRecommendedHelper(bounty);

  return (
    /* Z-Index Fix: ปรับ z-[9999] ให้สูงกว่า BottomTabBar (z-50) เสมอ เพื่อไม่ให้แถบเมนูด้านล่างบังปุ่ม */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs font-prompt animate-fade-in">
      {/* คลิกพื้นหลังเพื่อปิด */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Width Fix: จำกัดความกว้าง max-w-[390px] sm:max-w-[400px] ไม่ให้ล้นกรอบจอมือถือ และจัด flex-col ให้ปุ่มปิดอยู่ล่างสุดเสมอ */}
      <div className="bg-white border-2 border-gray-900 rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-2xl max-w-[390px] sm:max-w-[400px] w-full max-h-[88vh] flex flex-col relative z-10 overflow-hidden">
        
        {/* ปุ่มกากบาทปิดมุมบนขวา */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors cursor-pointer z-20"
          aria-label="ปิดหน้าต่าง"
        >
          ✕
        </button>

        {/* ---------------- หัวการ์ด: น้องดอท thinking + ชื่อการ์ดแก้ไขเบื้องต้น (คงที่ด้านบน) ---------------- */}
        <div className="flex flex-col items-center text-center pt-1 pb-2 border-b border-gray-200 shrink-0">
          <div className="mb-1.5">
            <NongDot mood="thinking" size={36} color="red" />
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-800 rounded-full mb-1">
            {displayCode}
          </span>
          <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
            การ์ดแก้ไขเบื้องต้น
          </h2>
          <p className="text-[11px] text-gray-500 font-medium">
            แนวทางแก้ปัญหาและจับคู่คนช่วยฉบับเข้าใจง่าย โดย MAKE A DOT
          </p>
        </div>

        {/* ---------------- ส่วนเนื้อหาภายใน (เลื่อน Scroll ได้อิสระ ไม่ดันปุ่มปิดหลุดจอ) ---------------- */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-0.5 no-scrollbar">
          
          {/* กล่องสรุปปัญหาเบื้องต้น */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs">
            <div className="text-[10px] font-bold text-brand-red uppercase mb-0.5">
              ปัญหาที่แจ้งไว้:
            </div>
            <p className="text-gray-800 leading-snug line-clamp-2 font-normal">
              &ldquo;{descriptionSnippet}&rdquo;
            </p>
          </div>

          {/* 3 ส่วน ACCORDION พับเก็บเป็นค่าเริ่มต้น (Collapsed by default) */}
          <div className="space-y-2">
            
            {/* ========================================================================= */}
            {/* หัวข้อที่ 1: 🎯 อาชีพและคนช่วยที่ตรงจุดกับปัญหานี้                         */}
            {/* ========================================================================= */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection(1)}
                className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer select-none"
              >
                <span className="flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>หัวข้อที่ 1: อาชีพและคนช่วยที่ตรงจุด</span>
                </span>
                <i
                  className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${
                    openSection === 1 ? 'rotate-180 text-brand-red' : ''
                  }`}
                />
              </button>

              {openSection === 1 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50/70 space-y-2.5 text-xs text-gray-800 animate-fade-in">
                  {/* อาชีพที่แนะนำ */}
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200">
                    <div className="text-[10px] text-gray-500 font-medium">คนช่วยที่ควรหาเป็นอันดับแรก:</div>
                    <div className="text-xs sm:text-sm font-bold text-brand-red mt-0.5 flex items-center gap-1.5">
                      <i className="fa-solid fa-user-check text-xs shrink-0" />
                      <span>{recommendedHelper}</span>
                    </div>
                  </div>

                  {/* 3 สิ่งสำคัญที่ต้องดู */}
                  <div className="space-y-1">
                    <div className="font-bold text-gray-900 text-[11px]">
                      สิ่งที่ต้องถามและตรวจดูก่อนตกลงจ้าง:
                    </div>
                    <ul className="space-y-1.5 text-gray-700 text-[11px] pl-1">
                      <li className="flex items-start gap-1.5">
                        <span className="text-brand-red font-bold shrink-0">1.</span>
                        <span><strong>มีผลงานเก่าให้ดู:</strong> ขอดูรูปถ่ายงานที่เคยแก้เสร็จจริงเพื่อดูความเรียบร้อย</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-brand-red font-bold shrink-0">2.</span>
                        <span><strong>มีเครื่องมือพร้อมหน้างาน:</strong> ไม่ต้องรอสั่งของนาน และสามารถเริ่มแก้ได้ทันที</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-brand-red font-bold shrink-0">3.</span>
                        <span><strong>แจกแจงค่าของและค่าแรงชัดเจน:</strong> แยกราคาให้เห็นชัด จะได้ไม่โดนบวกเพิ่มระหว่างทำ</span>
                      </li>
                    </ul>
                  </div>

                  {/* ข้อคิดเตือนใจ */}
                  <div className="bg-red-50 text-brand-red border border-red-200 rounded-lg p-2 text-[10px] font-medium leading-relaxed">
                    💡 <strong>ข้อแนะนำ:</strong> อย่าเลือกแค่คนที่ราคาถูกที่สุด ให้เลือกคนที่คุยเข้าใจตรงกันและกล้ารับประกันผลงาน
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* หัวข้อที่ 2: ⚡ 3 ขั้นตอนแก้ปัญหาเบื้องต้นด้วยตัวเอง (เช็กลิสต์ติ๊กถูกได้) */}
            {/* ========================================================================= */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection(2)}
                className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>หัวข้อที่ 2: 3 ขั้นตอนแก้ปัญหาด้วยตัวเอง</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-50 text-brand-red border border-red-200">
                    {completedCount}/3
                  </span>
                  <i
                    className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${
                      openSection === 2 ? 'rotate-180 text-brand-red' : ''
                    }`}
                  />
                </div>
              </button>

              {openSection === 2 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50/70 space-y-2 text-xs text-gray-800 animate-fade-in">
                  <p className="text-[10px] text-gray-500 font-medium">
                    แตะที่กล่องเพื่อติ๊กถูกเมื่อทำแต่ละข้อเสร็จ:
                  </p>

                  {/* ข้อ 1 */}
                  <div
                    onClick={() => toggleStep(1)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
                      checkedSteps[1]
                        ? 'bg-red-50/70 border-brand-red/50 text-gray-900'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedSteps[1]}
                      onChange={() => {}}
                      className="w-4 h-4 mt-0.5 rounded accent-brand-red cursor-pointer shrink-0"
                    />
                    <div className="flex-1 text-[11px]">
                      <div className="font-bold text-gray-900 flex items-center justify-between">
                        <span>ขั้นที่ 1: ถ่ายรูปบันทึกจุดเสีย & สกัดเงินรั่วไหล</span>
                        {checkedSteps[1] && <span className="text-[10px] text-brand-red font-bold">✓ ทำแล้ว</span>}
                      </div>
                      <p className="text-gray-600 mt-0.5 leading-snug">
                        ถ่ายรูปและคลิปวิดีโอจุดเสียทุกมุม จดรายการของลงสมุด <strong>ห้ามโอนเงินมัดจำก้อนโตเด็ดขาด</strong>
                      </p>
                    </div>
                  </div>

                  {/* ข้อ 2 */}
                  <div
                    onClick={() => toggleStep(2)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
                      checkedSteps[2]
                        ? 'bg-red-50/70 border-brand-red/50 text-gray-900'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedSteps[2]}
                      onChange={() => {}}
                      className="w-4 h-4 mt-0.5 rounded accent-brand-red cursor-pointer shrink-0"
                    />
                    <div className="flex-1 text-[11px]">
                      <div className="font-bold text-gray-900 flex items-center justify-between">
                        <span>ขั้นที่ 2: สอบถามและเปรียบเทียบคนช่วย 2-3 เจ้า</span>
                        {checkedSteps[2] && <span className="text-[10px] text-brand-red font-bold">✓ ทำแล้ว</span>}
                      </div>
                      <p className="text-gray-600 mt-0.5 leading-snug">
                        ส่งรูปปัญหาไปถามราคาและวิธีแก้จากช่างอย่างน้อย 2-3 คน เพื่อเทียบราคากลางและไม่โดนโก่งราคา
                      </p>
                    </div>
                  </div>

                  {/* ข้อ 3 */}
                  <div
                    onClick={() => toggleStep(3)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
                      checkedSteps[3]
                        ? 'bg-red-50/70 border-brand-red/50 text-gray-900'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedSteps[3]}
                      onChange={() => {}}
                      className="w-4 h-4 mt-0.5 rounded accent-brand-red cursor-pointer shrink-0"
                    />
                    <div className="flex-1 text-[11px]">
                      <div className="font-bold text-gray-900 flex items-center justify-between">
                        <span>ขั้นที่ 3: ตกลงวันส่งมอบและการรับประกันให้ชัดเจน</span>
                        {checkedSteps[3] && <span className="text-[10px] text-brand-red font-bold">✓ ทำแล้ว</span>}
                      </div>
                      <p className="text-gray-600 mt-0.5 leading-snug">
                        นัดวันเริ่ม วันเสร็จ และตกลงรับประกันงานซ่อมขั้นต่ำ 30 วัน หากมีปัญหาซ้ำต้องกลับมาแก้ไขฟรี
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* หัวข้อที่ 3: 🛡️ แนะนำการแบ่งจ่ายงวดงาน / การใช้สิ่งของแลกเปลี่ยน          */}
            {/* ========================================================================= */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleSection(3)}
                className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer select-none"
              >
                <span className="flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>หัวข้อที่ 3: แนะนำการแบ่งจ่ายงวดงาน</span>
                </span>
                <i
                  className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 ${
                    openSection === 3 ? 'rotate-180 text-brand-red' : ''
                  }`}
                />
              </button>

              {openSection === 3 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50/70 space-y-2.5 text-xs text-gray-800 animate-fade-in">
                  {/* แผนผังการแบ่งจ่ายเงิน 3 งวด */}
                  <div className="space-y-1">
                    <div className="font-bold text-gray-900 text-[11px]">
                      การแบ่งจ่ายเงินแบบปลอดภัย (ไม่โดนทิ้งงาน):
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <div className="text-[9px] font-bold text-gray-500">งวดที่ 1</div>
                        <div className="text-xs font-black text-gray-900 mt-0.5">20%</div>
                        <div className="text-[8px] text-gray-500">มัดจำ/เตรียมของ</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <div className="text-[9px] font-bold text-gray-500">งวดที่ 2</div>
                        <div className="text-xs font-black text-gray-900 mt-0.5">40%</div>
                        <div className="text-[8px] text-gray-500">งานเกินครึ่ง</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <div className="text-[9px] font-bold text-gray-500">งวดที่ 3</div>
                        <div className="text-xs font-black text-brand-red mt-0.5">40%</div>
                        <div className="text-[8px] text-gray-500">ตรวจรับ 100%</div>
                      </div>
                    </div>
                  </div>

                  {/* การใช้สิ่งของแลกเปลี่ยน */}
                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 space-y-0.5">
                    <div className="font-bold text-brand-red text-[11px] flex items-center gap-1">
                      <i className="fa-solid fa-recycle text-xs" />
                      <span>ถ้าอยากประหยัดเงินสด:</span>
                    </div>
                    <p className="text-gray-700 leading-snug text-[10px]">
                      สามารถเจรจาขอนำ <strong>&ldquo;ของเหลือใช้, เศษวัสดุ, พื้นที่จอดรถ/พักของ, หรือช่วยงานอื่น&rdquo;</strong> มาหักลดค่าจ้างเงินสดลงได้ 20-50%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- ปุ่มปิดด้านล่าง (Fixed at bottom of modal, มองเห็นและกดได้เสมอ) ---------------- */}
        <div className="pt-2.5 pb-0.5 border-t border-gray-200 bg-white shrink-0 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5"
          >
            <span>เข้าใจแล้ว ปิดหน้านี้</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickFixCardModal;