'use client';

import React, { useMemo, useState } from 'react';
import { baht, parseRange } from './schema';

interface Props {
  costDefault: number;
  priceDefault: number;
  unitLabel: string;
  capital?: string;
  detailed?: boolean;
  onSendToCapital?: (simulatedCashThb: number, cost: number, price: number, volume: number) => void;
  onSendToLocal?: () => void;
}

const niceMax = (v: number) => {
  if (v <= 0) return 100;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / mag) * mag;
};

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step, suffix, onChange }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-[11px]">
      <span className="font-bold text-gray-700 dark:text-gray-200">{label}</span>
      <span className="font-mono font-black text-gray-900 dark:text-white">
        {baht(value)} <span className="text-[9px] font-medium text-gray-400">{suffix}</span>
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 accent-[#E53935] cursor-pointer"
    />
  </div>
);

/** Mini Profit Simulator — ปรับต้นทุน/ราคาขาย/ปริมาณต่อเดือน แล้วคำนวณกำไร Real-time */
export const ProfitSimulator: React.FC<Props> = ({
  costDefault,
  priceDefault,
  unitLabel,
  capital,
  detailed,
  onSendToCapital,
  onSendToLocal,
}) => {
  const maxCost = useMemo(() => niceMax(Math.max(costDefault, priceDefault) * 2), [costDefault, priceDefault]);
  const maxPrice = useMemo(() => niceMax(Math.max(costDefault, priceDefault) * 3), [costDefault, priceDefault]);
  const stepVal = maxPrice >= 10000 ? 100 : maxPrice >= 1000 ? 10 : 1;

  const [cost, setCost] = useState(costDefault);
  const [price, setPrice] = useState(priceDefault);
  const [volume, setVolume] = useState(20);
  const [fixed, setFixed] = useState(detailed ? 3000 : 0);

  const profitUnit = price - cost;
  const margin = price > 0 ? (profitUnit / price) * 100 : 0;
  const monthly = profitUnit * volume;
  const net = monthly - fixed;
  const breakEven = profitUnit > 0 ? Math.ceil(fixed / profitUnit) : null;
  const [, capMax] = parseRange(capital || '');
  const simulatedWorkingCapital = Math.max(capMax || 0, cost * volume + fixed);
  const payback = net > 0 && simulatedWorkingCapital > 0 ? simulatedWorkingCapital / net : null;
  const good = profitUnit > 0;

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-gray-400">คำนวณต่อ 1 หน่วยอ้างอิง: {unitLabel}</p>
      <Slider label="1) ต้นทุนต่อหน่วย" value={cost} min={0} max={maxCost} step={stepVal} suffix="บาท" onChange={setCost} />
      <Slider label="2) ราคาขายที่จะตั้ง" value={price} min={0} max={maxPrice} step={stepVal} suffix="บาท" onChange={setPrice} />
      <Slider label="3) ปริมาณต่อเดือน" value={volume} min={1} max={500} step={1} suffix="หน่วย" onChange={setVolume} />
      {detailed && (
        <Slider label="4) ค่าใช้จ่ายคงที่ต่อเดือน" value={fixed} min={0} max={50000} step={500} suffix="บาท" onChange={setFixed} />
      )}

      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className={`rounded-2xl p-3 border ${good ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900'}`}>
          <div className="text-[10px] text-gray-500">กำไรสุทธิต่อหน่วย</div>
          <div className={`text-lg font-black font-mono ${good ? 'text-emerald-600' : 'text-[#E53935]'}`}>
            {profitUnit < 0 ? '-' : ''}{baht(Math.abs(profitUnit))} <span className="text-[10px] font-medium">บ.</span>
          </div>
          <div className="text-[10px] text-gray-400">มาร์จิ้น {margin.toFixed(1)}%</div>
        </div>
        <div className={`rounded-2xl p-3 border ${net >= 0 ? 'bg-gray-50 border-gray-200 dark:bg-[#1b1e25] dark:border-gray-700' : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900'}`}>
          <div className="text-[10px] text-gray-500">{detailed ? 'กำไรรวมต่อเดือน (หักค่าคงที่)' : 'กำไรรวมต่อเดือน'}</div>
          <div className={`text-lg font-black font-mono ${net >= 0 ? 'text-gray-900 dark:text-white' : 'text-[#E53935]'}`}>
            {net < 0 ? '-' : ''}{baht(Math.abs(net))} <span className="text-[10px] font-medium">บ.</span>
          </div>
          <div className="text-[10px] text-gray-400">{volume} หน่วย/เดือน</div>
        </div>
      </div>

      {detailed && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181a20]">
            <div className="text-[10px] text-gray-500">จุดคุ้มทุน</div>
            <div className="text-base font-black font-mono text-gray-900 dark:text-white">
              {breakEven === null ? '—' : `${baht(breakEven)} หน่วย/เดือน`}
            </div>
          </div>
          <div className="rounded-2xl p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181a20]">
            <div className="text-[10px] text-gray-500">คืนทุน (งบหมุนเวียน ฿{baht(simulatedWorkingCapital)})</div>
            <div className="text-base font-black font-mono text-gray-900 dark:text-white">
              {payback === null ? '—' : `${payback.toFixed(1)} เดือน`}
            </div>
          </div>
        </div>
      )}

      {!good && <p className="text-[10px] text-[#E53935] font-medium">⚠️ ราคาขายต่ำกว่าต้นทุน — ลองปรับราคาหรือลดต้นทุน</p>}

      {(onSendToCapital || onSendToLocal) && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {onSendToCapital && (
            <button
              type="button"
              onClick={() => onSendToCapital(simulatedWorkingCapital, cost, price, volume)}
              className="py-2.5 px-3 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-gray-900 text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-transform active:scale-95"
            >
              <span>💰 [หาทุน] ส่งยอด ฿{baht(simulatedWorkingCapital)} ไปตั้งตารางหุ้น</span>
            </button>
          )}
          {onSendToLocal && (
            <button
              type="button"
              onClick={onSendToLocal}
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-transform active:scale-95"
            >
              <span>📍 [หาคู่ค้า] ปักหมุดโรงงานรับผลิต {volume} หน่วย/ด.</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
