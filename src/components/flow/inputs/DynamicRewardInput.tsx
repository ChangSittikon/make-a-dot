"use client";

import { useState } from "react";

// Reward type values — must match ProblemNode.bountyType in schema.prisma
export type RewardType = "CASH" | "RESOURCE_SWAP" | "EQUITY" | "HYBRID";

export interface DynamicRewardValue {
  bountyType: RewardType;
  bountyPrizeSatang: number;   // in satang (x100 from THB)
  bountyDescription: string;   // text detail for non-cash types
}

interface Props {
  value: DynamicRewardValue | null;
  onChange: (val: DynamicRewardValue) => void;
}

const QUICK_PICKS_THB = [100, 1_000, 10_000, 100_000, 500_000];

const REWARD_TYPES: { type: RewardType; icon: string; label: string; placeholder: string }[] = [
  { type: "CASH",          icon: "fa-solid fa-money-bill-wave", label: "💰 เงินสด",          placeholder: "ระบุจำนวนเงิน (บาท)" },
  { type: "RESOURCE_SWAP", icon: "fa-solid fa-boxes-stacked",   label: "📦 สิ่งของ/ทรัพยากร", placeholder: "เช่น แล็ปท็อป, ห้องอัดเสียง 3 วัน..." },
  { type: "EQUITY",        icon: "fa-solid fa-chart-pie",        label: "📈 หุ้น/ส่วนแบ่งกำไร", placeholder: "เช่น 5% equity ของบริษัท..." },
  { type: "HYBRID",        icon: "fa-solid fa-handshake-angle",  label: "🤝 ทำงานแลกเปลี่ยน",  placeholder: "เช่น ช่วยเขียนโค้ด แลกกับ คอร์สอบรม..." },
];

export function DynamicRewardInput({ value, onChange }: Props) {
  const [activeType, setActiveType] = useState<RewardType>(value?.bountyType ?? "CASH");
  const [amountText, setAmountText] = useState<string>(
    value && value.bountyType === "CASH" && value.bountyPrizeSatang > 0
      ? String(Math.round(value.bountyPrizeSatang / 100))
      : ""
  );
  const [descText, setDescText] = useState<string>(value?.bountyDescription ?? "");

  const activeConfig = REWARD_TYPES.find(r => r.type === activeType)!;

  const emit = (type: RewardType, amtTHB: string, desc: string) => {
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
    setAmountText(numeric);
    emit(activeType, numeric, descText);
  };

  const handleQuickPick = (thb: number) => {
    const s = String(thb);
    setAmountText(s);
    emit(activeType, s, descText);
  };

  const handleDescChange = (text: string) => {
    setDescText(text);
    emit(activeType, amountText, text);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Reward Type Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {REWARD_TYPES.map(rt => (
          <button
            key={rt.type}
            type="button"
            onClick={() => handleTypeSwitch(rt.type)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 text-sm font-medium transition-all ${
              activeType === rt.type
                ? "border-brand-red bg-red-50 text-brand-red shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <i className={`${rt.icon} text-xs`} />
            {rt.label}
          </button>
        ))}
      </div>

      {/* CASH: Quick Picks + numeric input */}
      {activeType === "CASH" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_PICKS_THB.map(thb => (
              <button
                key={thb}
                type="button"
                onClick={() => handleQuickPick(thb)}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                  amountText === String(thb)
                    ? "bg-brand-red text-white border-brand-red shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-brand-red hover:text-brand-red"
                }`}
              >
                ฿{thb.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg pointer-events-none select-none">
              ฿
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amountText}
              onChange={e => handleAmountChange(e.target.value)}
              placeholder="หรือพิมพ์จำนวนเงินเอง..."
              className="w-full border-2 border-gray-200 rounded-2xl pl-9 pr-4 py-4 text-gray-800 text-lg font-semibold focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Non-cash: text description input */}
      {activeType !== "CASH" && (
        <textarea
          value={descText}
          onChange={e => handleDescChange(e.target.value)}
          placeholder={activeConfig.placeholder}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-base focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm min-h-[100px] resize-none leading-relaxed"
        />
      )}

      {/* Value preview badge */}
      {(amountText || descText) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600">
          <i className={`${activeConfig.icon} text-brand-red text-xs`} />
          <span className="font-medium">
            {activeType === "CASH" && amountText
              ? `฿${parseInt(amountText).toLocaleString()}`
              : descText || "—"}
          </span>
        </div>
      )}
    </div>
  );
}
