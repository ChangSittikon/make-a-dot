"use client";

import { useState } from "react";

// Reward type values — must match ProblemNode.bountyType in schema.prisma
export type RewardType = "CASH" | "RESOURCE_SWAP" | "REV_SHARE" | "HYBRID";

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

const QUICK_PICKS_THB = [100, 1_000, 10_000, 100_000, 500_000];

const REWARD_TYPES: { type: RewardType; icon: string; label: string; placeholder: string }[] = [
  { type: "CASH",          icon: "fa-solid fa-money-bill-wave", label: "💰 เงินสด",          placeholder: "ระบุจำนวนเงิน (บาท)" },
  { type: "RESOURCE_SWAP", icon: "fa-solid fa-boxes-stacked",   label: "📦 สิ่งของ/ทรัพยากร", placeholder: "เช่น แล็ปท็อป, ห้องอัดเสียง 3 วัน..." },
  { type: "REV_SHARE",        icon: "fa-solid fa-chart-pie",        label: "📈 ส่วนแบ่ง/ส่วนแบ่งกำไร", placeholder: "เช่น 5% revShare ของบริษัท..." },
  { type: "HYBRID",        icon: "fa-solid fa-handshake-angle",  label: "🤝 ทำงานแลกเปลี่ยน",  placeholder: "เช่น ช่วยเขียนโค้ด แลกกับ คอร์สอบรม..." },
];

export function DynamicRewardInput({ value, onChange, onSubmit }: Props) {
  const [activeType, setActiveType] = useState<RewardType | null>(value?.bountyType ?? null);
  const [amountText, setAmountText] = useState<string>(
    value && value.bountyType === "CASH" && value.bountyPrizeSatang > 0
      ? String(Math.round(value.bountyPrizeSatang / 100))
      : ""
  );
  const [descText, setDescText] = useState<string>(value?.bountyDescription ?? "");

  const activeConfig = activeType ? REWARD_TYPES.find(r => r.type === activeType) : null;

  const emit = (type: RewardType | null, amtTHB: string, desc: string) => {
    if (!type) return;
    const satang = Math.round((parseFloat(amtTHB.replace(/,/g, "")) || 0) * 100);
    onChange({
      bountyType: type,
      bountyPrizeSatang: satang,
      bountyDescription: desc || (type === "CASH" ? `${amtTHB} บาท` : desc),
    });
  };

  const handleTypeSwitch = (type: RewardType) => {
    setActiveType(type);
    emit(type, amountText, descText);
  };

  const handleAmountChange = (raw: string) => {
    const numeric = raw.replace(/[^0-9]/g, "");
    const formatted = numeric ? parseInt(numeric).toLocaleString() : "";
    setAmountText(formatted);
    emit(activeType, numeric, descText);
  };

  const handleQuickPick = (val: number) => {
    const formatted = val.toLocaleString();
    setAmountText(formatted);
    emit(activeType, String(val), descText);
  };

  const handleDescChange = (text: string) => {
    setDescText(text);
    emit(activeType, amountText, text);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Reward Type Tabs (Segmented Control style) */}
      <div className="flex p-1 bg-[#F5F5F7] rounded-[24px]">
        {REWARD_TYPES.map(rt => (
          <button
            key={rt.type}
            type="button"
            onClick={() => handleTypeSwitch(rt.type)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-[20px] transition-all duration-300 ${
              activeType === rt.type
                ? "bg-white text-brand-black shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
            }`}
          >
            <i className={`${rt.icon} text-[16px] ${activeType === rt.type ? 'text-gray-800' : 'text-gray-400'}`} />
            <span className="text-[11px] font-medium text-center leading-tight whitespace-pre-line">
              {rt.label.replace("/", "/\n")}
            </span>
          </button>
        ))}
      </div>

      {/* CASH: Quick Picks + numeric input */}
      {activeType === "CASH" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2.5 justify-center">
            {QUICK_PICKS_THB.map(thb => (
              <button
                key={thb}
                type="button"
                onClick={() => handleQuickPick(thb)}
                className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 active:scale-95 cursor-pointer border border-transparent ${
                  amountText === thb.toLocaleString()
                    ? "bg-brand-black text-white shadow-sm"
                    : "bg-[#F5F5F7] text-gray-600 hover:bg-white hover:border-gray-200 hover:text-brand-black hover:shadow-sm"
                }`}
              >
                ฿{thb.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[14px] pointer-events-none select-none">
              ฿
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amountText}
              onChange={e => handleAmountChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && onSubmit) onSubmit(); }}
              placeholder="กรอกจำนวนเงินที่คุณต้องการ..."
              className="w-full bg-[#F5F5F7] border border-transparent rounded-[20px] px-5 pl-10 pr-14 py-3.5 text-brand-black text-[14px] font-semibold focus:outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all duration-300 placeholder:text-gray-400 placeholder:font-normal"
            />
            {onSubmit && (
              <button onClick={() => onSubmit()} className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${amountText ? 'bg-brand-red text-white hover:bg-red-700 hover:scale-105 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                <i className="fa-solid fa-arrow-up text-sm" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Non-cash: text description input */}
      {activeType && activeType !== "CASH" && activeConfig && (
        <div className="relative">
          <textarea
            value={descText}
            onChange={e => handleDescChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && onSubmit) { e.preventDefault(); onSubmit(); } }}
            placeholder={activeConfig.placeholder}
            className="w-full bg-[#F5F5F7] border border-transparent rounded-[20px] px-5 py-4 pr-14 text-brand-black text-[14px] focus:outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all duration-300 min-h-[120px] resize-none leading-relaxed placeholder:text-gray-400"
          />
          {onSubmit && (
            <button onClick={() => onSubmit()} className={`absolute right-3 bottom-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${descText.trim() ? 'bg-brand-red text-white hover:bg-red-700 hover:scale-105 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              <i className="fa-solid fa-arrow-up text-sm" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
