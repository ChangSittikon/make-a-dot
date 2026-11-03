"use client";

import { useState } from "react";

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
  label: string;
  shortLabel: string;
  value: number;
}

// -----------------------------------------------------------------------------
// 1. หมวดหมู่ทั้ง 5 แท็บตามโจทย์ (ข้อ 2)
// -----------------------------------------------------------------------------
const REWARD_TYPES: { type: RewardType; icon: string; label: string; tabName: string }[] = [
  { type: "CASH",          icon: "fa-solid fa-money-bill-wave", label: "💰 เงินสด",        tabName: "เงินสด" },
  { type: "RESOURCE_SWAP", icon: "fa-solid fa-boxes-stacked",   label: "📦 สิ่งของ",        tabName: "สิ่งของ" },
  { type: "REV_SHARE",     icon: "fa-solid fa-chart-pie",        label: "📈 ส่วนแบ่ง/หุ้น",  tabName: "ส่วนแบ่ง" },
  { type: "HYBRID",        icon: "fa-solid fa-handshake-angle",  label: "💪 ทำงานแลก",      tabName: "ทำงานแลก" },
  { type: "CONNECTION",    icon: "fa-solid fa-network-wired",    label: "🌐 คอนเนคชัน",     tabName: "คอนเนคชัน" },
];

// -----------------------------------------------------------------------------
// 2. รายการตัวเลือกมากกว่า 10 รายการ กระจายลงแต่ละแท็บตามโจทย์ (ข้อ 3)
// -----------------------------------------------------------------------------
const REWARD_ITEMS: RewardItem[] = [
  // แท็บ 💰 เงินสด
  { id: "cash-100",    tab: "CASH", label: "฿100",      shortLabel: "เงินสด ฿100",      value: 100 },
  { id: "cash-500",    tab: "CASH", label: "฿500",      shortLabel: "เงินสด ฿500",      value: 500 },
  { id: "cash-1000",   tab: "CASH", label: "฿1,000",    shortLabel: "เงินสด ฿1,000",    value: 1000 },
  { id: "cash-5000",   tab: "CASH", label: "฿5,000",    shortLabel: "เงินสด ฿5,000",    value: 5000 },
  { id: "cash-10000",  tab: "CASH", label: "฿10,000",   shortLabel: "เงินสด ฿10,000",   value: 10000 },
  { id: "cash-50000",  tab: "CASH", label: "฿50,000",   shortLabel: "เงินสด ฿50,000",   value: 50000 },
  { id: "cash-100000", tab: "CASH", label: "฿100,000",  shortLabel: "เงินสด ฿100,000",  value: 100000 },

  // แท็บ 📦 สิ่งของ
  {
    id: "item-space",
    tab: "RESOURCE_SWAP",
    label: "🏠 มีพื้นที่ว่างหน้าบ้าน / ลานจอดรถให้ใช้ (มูลค่า ฿5,000)",
    shortLabel: "มีพื้นที่ว่างหน้าบ้าน (฿5,000)",
    value: 5000,
  },
  {
    id: "item-location",
    tab: "RESOURCE_SWAP",
    label: "🏥 บ้านใกล้ตลาดสด / รพ. / ศูนย์ราชการ (มูลค่า ฿3,000)",
    shortLabel: "บ้านใกล้ตลาดสด/รพ. (฿3,000)",
    value: 3000,
  },
  {
    id: "item-truck",
    tab: "RESOURCE_SWAP",
    label: "🛻 มีรถกระบะ / มอเตอร์ไซค์พ่วงข้างให้ยืมขนของ (มูลค่า ฿3,000)",
    shortLabel: "มีรถกระบะ/พ่วงข้างให้ยืมขนของ (฿3,000)",
    value: 3000,
  },
  {
    id: "item-scrap",
    tab: "RESOURCE_SWAP",
    label: "🪵 มีเศษเหล็ก / ไม้เก่า / วัสดุเหลือใช้ยกให้ (มูลค่า ฿2,000)",
    shortLabel: "มีเศษเหล็ก/ไม้เก่า/วัสดุเหลือใช้ (฿2,000)",
    value: 2000,
  },
  {
    id: "item-tools",
    tab: "RESOURCE_SWAP",
    label: "🧰 มีเครื่องมือช่าง / อุปกรณ์ / คอมพิวเตอร์ให้ใช้ (มูลค่า ฿2,000)",
    shortLabel: "มีเครื่องมือช่าง/คอมพิวเตอร์ให้ใช้ (฿2,000)",
    value: 2000,
  },

  // แท็บ 📈 ส่วนแบ่ง/ให้หุ้น
  {
    id: "rev-sales",
    tab: "REV_SHARE",
    label: "📊 แบ่งกำไรจากยอดขาย 10-30% (มูลค่า ฿10,000)",
    shortLabel: "แบ่งกำไรจากยอดขาย 10-30% (฿10,000)",
    value: 10000,
  },
  {
    id: "rev-equity",
    tab: "REV_SHARE",
    label: "🤝 ให้หุ้นส่วนร่วมสร้างโปรเจกต์ / RevShare (มูลค่า ฿20,000)",
    shortLabel: "ให้หุ้นส่วนร่วมสร้างโปรเจกต์ (฿20,000)",
    value: 20000,
  },
  {
    id: "rev-comm",
    tab: "REV_SHARE",
    label: "💵 ให้ค่าคอมมิชชันตามงานที่ปิดได้จริง (มูลค่า ฿5,000)",
    shortLabel: "ให้ค่าคอมมิชชันตามงานที่ปิดได้จริง (฿5,000)",
    value: 5000,
  },
  {
    id: "rev-cost",
    tab: "REV_SHARE",
    label: "🏷️ ให้สิทธิ์ซื้อสินค้า/บริการในราคาทุน (มูลค่า ฿3,000)",
    shortLabel: "ให้สิทธิ์ซื้อสินค้าในราคาทุน (฿3,000)",
    value: 3000,
  },

  // แท็บ 💪 ทำงานแลก
  {
    id: "work-night",
    tab: "HYBRID",
    label: "🌙 พร้อมลุยงานกะดึก ตี 1-5 / ตื่นเช้ามืดตี 3-4 แทนให้ (มูลค่า ฿1,500)",
    shortLabel: "พร้อมลุยงานกะดึก/เช้ามืด (฿1,500)",
    value: 1500,
  },
  {
    id: "work-weekend",
    tab: "HYBRID",
    label: "⏰ มีเวลาว่างวันอาทิตย์ / วันหยุดช่วยงาน 4-8 ชม. (มูลค่า ฿1,000)",
    shortLabel: "มีเวลาว่างวันหยุดช่วยงาน 4-8 ชม. (฿1,000)",
    value: 1000,
  },
  {
    id: "work-heavy",
    tab: "HYBRID",
    label: "💪 กล้าลุยงานหนัก / งานเลอะเทอะ / เคลียร์พื้นที่ให้ (มูลค่า ฿2,000)",
    shortLabel: "กล้าลุยงานหนัก/เคลียร์พื้นที่ (฿2,000)",
    value: 2000,
  },
  {
    id: "work-negotiate",
    tab: "HYBRID",
    label: "🗣️ ช่วยเจรจาต่อรอง / เฝ้าร้าน / เดินเอกสารแทนให้ (มูลค่า ฿1,500)",
    shortLabel: "ช่วยเจรจา/เฝ้าร้าน/เดินเอกสาร (฿1,500)",
    value: 1500,
  },
  {
    id: "work-specialist",
    tab: "HYBRID",
    label: "🛠️ ช่วยงานทักษะเฉพาะทาง (ช่าง/เขียนแบบ/บัญชี/โค้ด) (มูลค่า ฿3,000)",
    shortLabel: "ช่วยงานทักษะเฉพาะทาง (฿3,000)",
    value: 3000,
  },

  // แท็บ 🌐 คอนเนคชัน
  {
    id: "conn-contractor",
    tab: "CONNECTION",
    label: "👷 แนะนำช่างฝีมือ / ผู้รับเหมาที่ไว้ใจได้ในพื้นที่ (มูลค่า ฿3,000)",
    shortLabel: "แนะนำช่างฝีมือในพื้นที่ (฿3,000)",
    value: 3000,
  },
  {
    id: "conn-wholesale",
    tab: "CONNECTION",
    label: "🏪 แนะนำเจ้าของร้านค้า / แหล่งซื้อของราคาส่ง (มูลค่า ฿3,000)",
    shortLabel: "แนะนำเจ้าของร้านค้า/ราคาส่ง (฿3,000)",
    value: 3000,
  },
  {
    id: "conn-team",
    tab: "CONNECTION",
    label: "👥 มีทีมญาติ / วัยรุ่นในหมู่บ้านพร้อมระดมพลช่วยแรง (มูลค่า ฿5,000)",
    shortLabel: "มีทีมญาติ/วัยรุ่นพร้อมช่วยแรง (฿5,000)",
    value: 5000,
  },
  {
    id: "conn-promo",
    tab: "CONNECTION",
    label: "📢 ช่วยโพสต์โปรโมทในกลุ่มชุมชน / เพจท้องถิ่น (มูลค่า ฿1,500)",
    shortLabel: "ช่วยโพสต์ในกลุ่มชุมชน/เพจท้องถิ่น (฿1,500)",
    value: 1500,
  },
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

  // คำนวณข้อความสังเคราะห์จากรายการที่เลือก (Synthesize formula string)
  const buildFormulaText = (ids: string[]) => {
    if (ids.length === 0) return "";

    const selectedItems = REWARD_ITEMS.filter(item => ids.includes(item.id));
    if (selectedItems.length === 0) return "";

    // ถ้าเลือกแค่ 1 รายการ
    if (selectedItems.length === 1) {
      const single = selectedItems[0];
      if (single.tab === "CASH") {
        return `฿${single.value.toLocaleString()}`;
      }
      return `${single.shortLabel} (มูลค่า ฿${single.value.toLocaleString()} บาท)`;
    }

    // ถ้าเลือกหลายรายการ: ต่อด้วย " + " และลงท้ายด้วย (รวมมูลค่า ฿X,XXX บาท) ตามข้อ 4
    const parts = selectedItems.map(item => item.shortLabel);
    const totalValue = selectedItems.reduce((acc, curr) => acc + curr.value, 0);
    return `${parts.join(" + ")} (รวมมูลค่า ฿${totalValue.toLocaleString()} บาท)`;
  };

  // ส่งข้อมูลกลับไปยังฟอร์มหลัก
  const emitValue = (currentTab: RewardType, currentIds: string[], text: string) => {
    const trimmed = text.trim();
    const selectedItems = REWARD_ITEMS.filter(item => currentIds.includes(item.id));
    const hasCashOnly = selectedItems.length > 0 && selectedItems.every(i => i.tab === "CASH");

    // คำนวณมูลค่ารวม
    let totalThb = 0;
    if (selectedItems.length > 0) {
      totalThb = selectedItems.reduce((acc, curr) => acc + curr.value, 0);
    } else {
      // ดึงตัวเลขจากข้อความถ้าผู้ใช้พิมพ์เอง
      const numMatch = trimmed.replace(/,/g, "").match(/\d+/);
      if (numMatch) {
        totalThb = parseInt(numMatch[0], 10);
      }
    }

    // กรณีเป็นเงินสดล้วน (เช่น "฿1,000" หรือตัวเลขล้วน)
    const isPureCashPattern = /^[฿\s\d,]+(บาท)?$/.test(trimmed);
    if ((hasCashOnly || isPureCashPattern) && currentTab === "CASH" && !selectedItems.some(i => i.tab !== "CASH")) {
      const numeric = trimmed.replace(/[^0-9]/g, "");
      const finalCash = parseInt(numeric, 10) || totalThb || 0;
      onChange({
        bountyType: "CASH",
        bountyPrizeSatang: finalCash * 100,
        bountyDescription: trimmed || (finalCash > 0 ? `฿${finalCash.toLocaleString()}` : ""),
      });
    } else {
      // กรณีเป็นสิ่งของ/ส่วนแบ่ง/ทำงานแลก/คอนเนคชัน หรือหลายรายการผสมกัน
      const resolvedType: RewardType = selectedItems.length > 1 ? "HYBRID" : currentTab;
      onChange({
        bountyType: resolvedType,
        bountyPrizeSatang: totalThb * 100,
        bountyDescription: trimmed,
      });
    }
  };

  // แตะเพื่อเลือก/ยกเลิกตัวเลือก (Multi-Select toggle ตามข้อ 4)
  const handleToggleItem = (item: RewardItem) => {
    let nextIds: string[];
    if (selectedIds.includes(item.id)) {
      nextIds = selectedIds.filter(id => id !== item.id);
    } else {
      nextIds = [...selectedIds, item.id];
    }
    setSelectedIds(nextIds);

    const generated = buildFormulaText(nextIds);
    setDescText(generated);
    emitValue(activeType, nextIds, generated);
  };

  // ผู้ใช้พิมพ์แก้ไขข้อความหรือตัวเลขเองในช่องกรอก (ตามข้อ 4)
  const handleManualTextChange = (newText: string) => {
    setDescText(newText);
    emitValue(activeType, selectedIds, newText);
  };

  // ล้างการเลือกทั้งหมด
  const handleClearAll = () => {
    setSelectedIds([]);
    setDescText("");
    emitValue(activeType, [], "");
  };

  // รายการของแท็บที่กำลังเปิดอยู่
  const currentTabItems = REWARD_ITEMS.filter(item => item.tab === activeType);

  return (
    <div className="w-full flex flex-col gap-3.5 font-prompt">
      {/* --------------------------------------------------------------------- */}
      {/* แถบเมนู 5 แท็บ สะอาดตา ทันสมัย (ข้อ 2 ตามโจทย์)                        */}
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
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/60"
              }`}
            >
              <i
                className={`${rt.icon} text-[15px] sm:text-[16px] ${
                  isActive ? "text-brand-red" : "text-gray-400"
                }`}
              />
              <span className="text-[10px] sm:text-[11px] leading-tight text-center truncate w-full">
                {rt.label}
              </span>

              {/* ป้ายนับจำนวนรายการที่เลือกในหมวดนี้ */}
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
      {/* รายการตัวเลือกในแท็บปัจจุบัน (ข้อ 3 & ข้อ 4 Multi-Select)               */}
      {/* --------------------------------------------------------------------- */}
      <div className="w-full">
        {/* แท็บเงินสด: แสดงเป็น Selectable Pills แนวนอน */}
        {activeType === "CASH" ? (
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
        ) : (
          /* แท็บสิ่งของ / ส่วนแบ่ง / ทำงานแลก / คอนเนคชัน: แสดงเป็น Selectable Cards */
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-0.5 scrollbar-thin">
            {currentTabItems.map(item => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleItem(item)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-2xl text-xs sm:text-[13px] transition-all duration-200 active:scale-[0.99] cursor-pointer border flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? "bg-red-50/90 border-brand-red text-gray-900 ring-1 ring-brand-red shadow-2xs font-semibold"
                      : "bg-white border-gray-200/90 text-gray-700 hover:border-gray-300 hover:bg-gray-50/70 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? "bg-brand-red border-brand-red text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <i className="fa-solid fa-check text-[9px]" />}
                    </span>
                    <span className="truncate leading-snug">{item.label}</span>
                  </div>
                  <span
                    className={`text-[11px] font-bold shrink-0 px-2.5 py-0.5 rounded-full transition-all ${
                      isSelected
                        ? "bg-brand-red text-white"
                        : "bg-gray-100 text-gray-600 border border-gray-200/60"
                    }`}
                  >
                    ฿{item.value.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 4. ช่องกรอกข้อมูล (Editable Textarea/Input) ปรับแก้ข้อความ/มูลค่าได้จริง */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <i className="fa-solid fa-pen-to-square text-brand-red text-[11px]" />
            <span>สรุปข้อเสนอค่าตอบแทน (แก้ไขข้อความ/ตัวเลขเองได้):</span>
          </label>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-gray-400 hover:text-brand-red transition-colors cursor-pointer"
            >
              ล้างที่เลือก ({selectedIds.length})
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            value={descText}
            onChange={e => handleManualTextChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey && onSubmit) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="เลือกตัวเลือกด้านบน หรือพิมพ์ระบุค่าตอบแทน/สิ่งแลกเปลี่ยนด้วยตนเอง..."
            className="w-full bg-[#F5F5F7] border border-transparent rounded-[20px] px-4 py-3.5 pr-14 text-brand-black text-[13px] sm:text-[14px] focus:outline-none focus:bg-white focus:border-brand-red/40 focus:ring-1 focus:ring-brand-red/40 focus:shadow-xs transition-all duration-200 min-h-[92px] resize-none leading-relaxed placeholder:text-gray-400"
          />

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

        <p className="text-[11px] text-gray-400 px-1">
          💡 สามารถเลือกได้หลายรายการพร้อมกัน และพิมพ์แก้ไขข้อความหรือปรับเปลี่ยนตัวเลขได้อิสระ
        </p>
      </div>
    </div>
  );
}
