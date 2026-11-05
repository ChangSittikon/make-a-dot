"use client";

import { useState, useRef } from "react";

// Reward type values — must match ProblemNode.bountyType in schema.prisma
export type RewardType = "CASH" | "RESOURCE_SWAP" | "REV_SHARE" | "HYBRID" | "CONNECTION";

export interface DynamicRewardValue {
  bountyType: RewardType;
  bountyPrizeSatang: number;   // in satang (x100 from THB)
  bountyDescription: string;   // text detail for non-cash types
}

interface Props {
  value: DynamicRewardValue | null;
  onChange: (val: DynamicRewardValue) => void;
  onSubmit?: (valueOverride?: string) => void | Promise<void>;
}

interface RewardItem {
  id: string;
  tab: RewardType;
  label: string;       // ข้อความแสดงบนปุ่ม Pill (สั้นกระชับ ไม่มี 'มูลค่า ฿...')
  textName: string;    // ชื่อสั้นๆ สำหรับนำไปต่อในช่องพิมพ์
  value: number;       // มูลค่าประมาณการ (บาท)
}

// -----------------------------------------------------------------------------
// 1. แถบ 5 หมวดหมู่ ไม่มีอีโมจิซ้ำซ้อน และใช้ชื่อสั้นไม่ให้ถูกตัด (...) ตามข้อ 2
// -----------------------------------------------------------------------------
const REWARD_TYPES: { type: RewardType; icon: string; label: string }[] = [
  { type: "CASH",          icon: "fa-solid fa-money-bill-wave", label: "เงินสด" },
  { type: "RESOURCE_SWAP", icon: "fa-solid fa-boxes-stacked",   label: "สิ่งของ" },
  { type: "REV_SHARE",     icon: "fa-solid fa-chart-pie",        label: "ส่วนแบ่ง" },
  { type: "HYBRID",        icon: "fa-solid fa-handshake-angle",  label: "แลกงาน" },
  { type: "CONNECTION",    icon: "fa-solid fa-users",            label: "คนรู้จัก" },
];

// -----------------------------------------------------------------------------
// 2. รายการตัวเลือกแบบสั้นที่สุด (ห้ามมีคำว่า 'มูลค่า ฿...' บนปุ่ม) ตามข้อ 3
// -----------------------------------------------------------------------------
const REWARD_ITEMS: RewardItem[] = [
  // แท็บ เงินสด
  { id: "cash-100",    tab: "CASH", label: "฿100",      textName: "฿100",      value: 100 },
  { id: "cash-500",    tab: "CASH", label: "฿500",      textName: "฿500",      value: 500 },
  { id: "cash-1000",   tab: "CASH", label: "฿1,000",    textName: "฿1,000",    value: 1000 },
  { id: "cash-10000",  tab: "CASH", label: "฿10,000",   textName: "฿10,000",   value: 10000 },
  { id: "cash-50000",  tab: "CASH", label: "฿50,000",   textName: "฿50,000",   value: 50000 },
  { id: "cash-100000", tab: "CASH", label: "฿100,000",  textName: "฿100,000",  value: 100000 },
  { id: "cash-custom", tab: "CASH", label: "ระบุเอง",   textName: "",          value: 0 },

  // แท็บ สิ่งของ
  { id: "item-space",    tab: "RESOURCE_SWAP", label: "🏠 พื้นที่หน้าบ้าน",     textName: "พื้นที่หน้าบ้าน",     value: 5000 },
  { id: "item-location", tab: "RESOURCE_SWAP", label: "🏥 ใกล้ตลาด/รพ.",      textName: "ใกล้ตลาด/รพ.",      value: 3000 },
  { id: "item-truck",    tab: "RESOURCE_SWAP", label: "🛻 รถกระบะ/พ่วงข้าง",   textName: "รถกระบะ/พ่วงข้าง",   value: 3000 },
  { id: "item-scrap",    tab: "RESOURCE_SWAP", label: "🪵 วัสดุ/ของเหลือใช้",  textName: "วัสดุ/ของเหลือใช้",  value: 2000 },
  { id: "item-tools",    tab: "RESOURCE_SWAP", label: "🧰 เครื่องมือ/อุปกรณ์", textName: "เครื่องมือ/อุปกรณ์", value: 2000 },

  // แท็บ ส่วนแบ่ง
  { id: "rev-sales",  tab: "REV_SHARE", label: "📊 แบ่งกำไร 10-30%",  textName: "แบ่งกำไร 10-30%",  value: 10000 },
  { id: "rev-equity", tab: "REV_SHARE", label: "🤝 หุ้นส่วนโปรเจกต์", textName: "หุ้นส่วนโปรเจกต์", value: 20000 },
  { id: "rev-comm",   tab: "REV_SHARE", label: "💵 ค่าคอมมิชชัน",     textName: "ค่าคอมมิชชัน",     value: 5000 },
  { id: "rev-cost",   tab: "REV_SHARE", label: "🏷️ สินค้าราคาทุน",    textName: "สินค้าราคาทุน",    value: 3000 },

  // แท็บ แลกงาน
  { id: "work-night",      tab: "HYBRID", label: "🌙 ลุยงานกะดึก/เช้ามืด",     textName: "ลุยงานกะดึก/เช้ามืด",     value: 1500 },
  { id: "work-weekend",    tab: "HYBRID", label: "⏰ ช่วยงานวันหยุด",          textName: "ช่วยงานวันหยุด",          value: 1000 },
  { id: "work-heavy",      tab: "HYBRID", label: "💪 ลุยงานหนัก/เคลียร์พื้นที่", textName: "ลุยงานหนัก/เคลียร์พื้นที่", value: 2000 },
  { id: "work-negotiate",  tab: "HYBRID", label: "🗣️ ช่วยเจรจา/เดินเอกสาร",    textName: "ช่วยเจรจา/เดินเอกสาร",    value: 1500 },
  { id: "work-specialist", tab: "HYBRID", label: "🛠️ ช่วยงานช่าง/บัญชี/โค้ด",  textName: "ช่วยงานช่าง/บัญชี/โค้ด",  value: 3000 },

  // แท็บ คนรู้จัก
  { id: "conn-contractor", tab: "CONNECTION", label: "👷 แนะนำช่างในพื้นที่", textName: "แนะนำช่างในพื้นที่", value: 3000 },
  { id: "conn-wholesale",  tab: "CONNECTION", label: "🏪 แนะนำร้านค้าส่ง",     textName: "แนะนำร้านค้าส่ง",     value: 3000 },
  { id: "conn-team",       tab: "CONNECTION", label: "👥 ระดมคนช่วยแรง",       textName: "ระดมคนช่วยแรง",       value: 5000 },
  { id: "conn-promo",      tab: "CONNECTION", label: "📢 โพสต์กลุ่มชุมชน",     textName: "โพสต์กลุ่มชุมชน",     value: 1500 },
];

export function DynamicRewardInput({ value, onChange, onSubmit }: Props) {
  const [activeType, setActiveType] = useState<RewardType>(value?.bountyType ?? "CASH");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [descText, setDescText] = useState<string>(
    value
      ? value.bountyType === "CASH" && value.bountyPrizeSatang > 0
        ? `฿${Math.round(value.bountyPrizeSatang / 100).toLocaleString()}`
        : value.bountyDescription || ""
      : ""
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // คำนวณข้อความสั้นกระชับ ไม่เขียนภาษารายงานตามข้อ 4
  const buildFormulaText = (ids: string[]) => {
    if (ids.length === 0) return "";

    const selectedItems = REWARD_ITEMS.filter(item => ids.includes(item.id));
    if (selectedItems.length === 0) return "";

    const cashItems = selectedItems.filter(item => item.tab === "CASH" && item.id !== "cash-custom");
    const nonCashItems = selectedItems.filter(item => item.tab !== "CASH");

    const parts: string[] = [];

    // ถ้ามีเงินสด ให้บวกเลขรวมกันเป็นยอดเดียวเสมอ เช่น ฿1,100 (ห้ามเขียนแยก)
    if (cashItems.length > 0) {
      const totalCash = cashItems.reduce((acc, curr) => acc + curr.value, 0);
      parts.push(`฿${totalCash.toLocaleString()}`);
    }

    // ต่อด้วยชื่อหมวดอื่นๆ แบบสั้นๆ คั่นด้วย " + "
    nonCashItems.forEach(item => {
      parts.push(item.textName);
    });

    return parts.join(" + ");
  };

  // ส่งข้อมูลกลับไปยังฟอร์มหลัก
  const emitValue = (currentTab: RewardType, currentIds: string[], text: string) => {
    const trimmed = text.trim();
    const selectedItems = REWARD_ITEMS.filter(item => currentIds.includes(item.id));
    const cashItems = selectedItems.filter(i => i.tab === "CASH" && i.id !== "cash-custom");
    const nonCashItems = selectedItems.filter(i => i.tab !== "CASH");
    const hasCustomCash = currentIds.includes("cash-custom");

    // คำนวณมูลค่ารวม
    let totalThb = 0;
    const numMatch = trimmed.replace(/,/g, "").match(/\d+/);
    const parsedCustomNum = numMatch ? parseInt(numMatch[0], 10) : 0;

    if (hasCustomCash) {
      const presetThb = [...cashItems, ...nonCashItems].reduce((acc, curr) => acc + curr.value, 0);
      totalThb = presetThb + parsedCustomNum;
    } else if (selectedItems.length > 0) {
      totalThb = selectedItems.reduce((acc, curr) => acc + curr.value, 0);
    } else {
      totalThb = parsedCustomNum;
    }

    // กรณีเป็นเงินสดล้วน (เช่น "฿1,100", ตัวเลขล้วน หรือระบุเองในแท็บเงินสดโดยไม่มีสิ่งของ)
    const isPureCashPattern = /^[฿\s\d,]+(บาท)?$/.test(trimmed);
    const hasOnlyCashItems = (cashItems.length > 0 || hasCustomCash) && nonCashItems.length === 0;

    if ((hasOnlyCashItems || isPureCashPattern) && nonCashItems.length === 0) {
      const numeric = trimmed.replace(/[^0-9]/g, "");
      const finalCash = parseInt(numeric, 10) || totalThb || 0;
      onChange({
        bountyType: "CASH",
        bountyPrizeSatang: finalCash * 100,
        bountyDescription: trimmed || (finalCash > 0 ? `฿${finalCash.toLocaleString()}` : ""),
      });
    } else {
      // กรณีผสมหลายหมวด หรือเป็นสิ่งของ/ส่วนแบ่ง/แลกงาน/คนรู้จัก
      const resolvedType: RewardType = ((cashItems.length > 0 || hasCustomCash) && nonCashItems.length > 0) || selectedItems.length > 1
        ? "HYBRID"
        : (currentTab === "CASH" ? "RESOURCE_SWAP" : currentTab);
      onChange({
        bountyType: resolvedType,
        bountyPrizeSatang: totalThb * 100,
        bountyDescription: trimmed,
      });
    }
  };

  // แตะเลือก/ยกเลิกตัวเลือก (Multi-Select toggle)
  const handleToggleItem = (item: RewardItem) => {
    if (item.id === "cash-custom") {
      const isCurrentlySelected = selectedIds.includes("cash-custom");
      if (isCurrentlySelected) {
        const nextIds = selectedIds.filter(id => id !== "cash-custom");
        setSelectedIds(nextIds);
        const generated = buildFormulaText(nextIds);
        setDescText(generated);
        emitValue(activeType, nextIds, generated);
      } else {
        // เลือก "ระบุเอง": ล้างเงินสดคงที่ออก แล้วโฟกัสที่ช่องกรอกทันที
        const nextIds = [...selectedIds.filter(id => !id.startsWith("cash-")), "cash-custom"];
        setSelectedIds(nextIds);
        
        // ถ้าเป็นตัวเลขคงที่ ให้เคลียร์เพื่อให้พิมพ์ใหม่ได้สะดวก
        const isPureCashText = /^[฿\s\d,]+(บาท)?$/.test(descText.trim());
        const newText = isPureCashText ? "" : descText;
        setDescText(newText);
        emitValue(activeType, nextIds, newText);

        setTimeout(() => {
          textareaRef.current?.focus();
        }, 50);
      }
      return;
    }

    // กรณีเลือกตัวเลือกเงินสดคงที่ ให้ถอด "ระบุเอง" ออก
    let nextIds: string[];
    if (selectedIds.includes(item.id)) {
      nextIds = selectedIds.filter(id => id !== item.id);
    } else {
      const baseIds = item.tab === "CASH"
        ? selectedIds.filter(id => id !== "cash-custom")
        : selectedIds;
      nextIds = [...baseIds, item.id];
    }
    setSelectedIds(nextIds);

    const generated = buildFormulaText(nextIds);
    setDescText(generated);
    emitValue(activeType, nextIds, generated);
  };

  // ผู้ใช้พิมพ์แก้ไขข้อความหรือตัวเลขเองในช่องกรอก
  const handleManualTextChange = (newText: string) => {
    setDescText(newText);
    
    // ถ้าผู้ใช้พิมพ์เองในแท็บเงินสด โดยไม่มีปุ่มเงินสดคงที่ถูกเลือก ให้เปิดสถานะ "ระบุเอง" อัตโนมัติ
    let currentIds = selectedIds;
    if (activeType === "CASH" && newText.trim()) {
      const hasFixedCash = selectedIds.some(id => id.startsWith("cash-") && id !== "cash-custom");
      if (!hasFixedCash && !selectedIds.includes("cash-custom")) {
        currentIds = [...selectedIds, "cash-custom"];
        setSelectedIds(currentIds);
      }
    } else if (activeType === "CASH" && !newText.trim() && selectedIds.includes("cash-custom")) {
      currentIds = selectedIds.filter(id => id !== "cash-custom");
      setSelectedIds(currentIds);
    }

    emitValue(activeType, currentIds, newText);
  };

  // ล้างข้อมูลทั้งหมด
  const handleClearAll = () => {
    setSelectedIds([]);
    setDescText("");
    emitValue(activeType, [], "");
  };

  // รายการของแท็บปัจจุบัน
  const currentTabItems = REWARD_ITEMS.filter(item => item.tab === activeType);

  return (
    <div className="w-full flex flex-col gap-3 font-prompt">
      {/* --------------------------------------------------------------------- */}
      {/* 1. แถบเมนู 5 แท็บ: ไม่มีอีโมจิซ้ำซ้อน ชื่อสั้นไม่ถูกตัด (...) (ข้อ 2)   */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-5 p-1 bg-[#F5F5F7] rounded-[22px] gap-1">
        {REWARD_TYPES.map(rt => {
          const isActive = activeType === rt.type;
          const tabSelectedCount = REWARD_ITEMS.filter(
            item => item.tab === rt.type && selectedIds.includes(item.id)
          ).length;

          return (
            <button
              key={rt.type}
              type="button"
              onClick={() => setActiveType(rt.type)}
              className={`relative flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-[18px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white text-gray-900 shadow-xs font-bold"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/60 font-medium"
              }`}
            >
              <i
                className={`${rt.icon} text-[15px] sm:text-[16px] ${
                  isActive ? "text-brand-red" : "text-gray-400"
                }`}
              />
              <span className="text-[11px] sm:text-xs leading-tight text-center">
                {rt.label}
              </span>

              {/* ป้ายนับจำนวนที่เลือกในหมวดนี้ */}
              {tabSelectedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {tabSelectedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. รายการปุ่มตัวเลือก (Pills) สั้นกระชับ ไม่มี 'มูลค่า ฿...' (ข้อ 3)     */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-wrap gap-2 justify-center py-1">
        {currentTabItems.map(item => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleToggleItem(item)}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-200 active:scale-95 cursor-pointer border ${
                isSelected
                  ? "bg-red-50 border-brand-red text-brand-red ring-1 ring-brand-red shadow-2xs"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 shadow-2xs"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 3. ช่องกรอกข้อมูลสะอาดตา ไร้ข้อความสอนใช้งาน (Zero Helper Text) (ข้อ 1)  */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          value={descText}
          onChange={e => handleManualTextChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder={selectedIds.includes("cash-custom") ? "พิมพ์จำนวนเงิน หรือข้อเสนอที่คุณต้องการระบุเอง..." : "ระบุค่าตอบแทน หรือเลือกตัวเลือกด้านบน..."}
          className="w-full bg-[#F5F5F7] border border-transparent rounded-[20px] px-4 py-3.5 pr-14 text-brand-black text-[13px] sm:text-[14px] focus:outline-none focus:bg-white focus:border-brand-red/40 focus:ring-1 focus:ring-brand-red/40 focus:shadow-xs transition-all duration-200 min-h-[90px] resize-none leading-relaxed placeholder:text-gray-400"
        />

        {/* ปุ่มกากบาท ✕ ล้างข้อมูลเล็กๆ มุมขวาบนในช่องกรอก (ข้อ 1) */}
        {(descText.trim() || selectedIds.length > 0) && (
          <button
            type="button"
            onClick={handleClearAll}
            className="absolute top-2.5 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-all cursor-pointer text-xs"
            title="ล้างข้อมูล"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}

        {/* ปุ่มลูกศรสีแดงไปขั้นตอนถัดไป */}
        {onSubmit && (
          <button
            type="button"
            onClick={() => onSubmit()}
            disabled={!descText.trim()}
            className={`absolute right-3 bottom-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
              descText.trim()
                ? "bg-brand-red text-white hover:bg-red-700 hover:scale-105 shadow-md cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="ไปขั้นตอนถัดไป"
          >
            <i className="fa-solid fa-arrow-up text-sm" />
          </button>
        )}
      </div>
    </div>
  );
}
