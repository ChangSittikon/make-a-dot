'use client';

import React, { useState } from 'react';
import { NongDot } from '@/components/flow/NongDot';
import {
  Sparkles,
  TrendingUp,
  Coins,
  Clock,
  Copy,
  Check,
  Send,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface AIWhisperWidgetProps {
  initialPrizeTHB: number;
  bountyTitle?: string;
  onApplyToNegotiation?: (script: string, suggestedPriceTHB: number) => void;
  onOpenNegotiationModal?: () => void;
}

interface StrategyOption {
  id: 'vertical' | 'universal' | 'friction';
  axisNumber: number;
  title: string;
  badge: string;
  color: string;
  icon: string;
  suggestedMultiplier: number;
  bonusAmount: number;
  script: string;
  rationale: string;
}

export const AIWhisperWidget: React.FC<AIWhisperWidgetProps> = ({
  initialPrizeTHB,
  bountyTitle,
  onApplyToNegotiation,
  onOpenNegotiationModal,
}) => {
  const [activeStrategyIndex, setActiveStrategyIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const basePrize = Math.max(500, initialPrizeTHB || 3000);

  const strategies: StrategyOption[] = [
    {
      id: 'vertical',
      axisNumber: 1,
      title: 'แนวดิ่ง: เสนอรับจบเหมาสัญญาต่อเนื่อง',
      badge: '+60% Value',
      color: 'emerald',
      icon: '📈',
      suggestedMultiplier: 1.6,
      bonusAmount: Math.round(basePrize * 0.6),
      rationale: 'อย่าแก้ปัญหาแค่ครั้งเดียว เสนอแพ็กเกจการันตีผลงานและดูแลระบบต่อเนื่อง 3 เดือน',
      script: `สวัสดีครับคุณผู้ว่าจ้าง จากโจทย์ปัญหาข้อนี้ ผมมีความเชี่ยวชาญเฉพาะทางและพร้อมเข้าแก้ปัญหาให้จบเด็ดขาดทันที และขออนุญาตเสนอเพิ่มการรับประกันพร้อมดูแลระบบต่อเนื่อง 3 เดือน ในงบรวม ฿${Math.round(basePrize * 1.6).toLocaleString()} บาท เพื่อให้ระบบของพี่ใช้งานได้ราบรื่น ไม่สะดุดซ้ำซากครับ`,
    },
    {
      id: 'universal',
      axisNumber: 3,
      title: 'กองกลาง: กินหัวคิวจัดหาวัสดุ & เครื่องมือ',
      badge: '+15-25% Margin',
      color: 'sky',
      icon: '🌐',
      suggestedMultiplier: 1.25,
      bonusAmount: Math.round(basePrize * 0.25),
      rationale: 'ใช้คอนเนกชันร้านวัสดุหรืออุปกรณ์ราคาส่ง จัดส่งถึงหน้างาน ช่วยประหยัดงบผู้จ้างและเพิ่มรายได้ให้เรา',
      script: `พี่ครับ นอกจากค่าแรงแก้ปัญหา ฿${basePrize.toLocaleString()} บาทแล้ว ผมมีคอนเนกชันโรงงานและร้านวัสดุราคาส่งตรง สามารถช่วยจัดหาอุปกรณ์มาตรฐานสูงในราคาประหยัดกว่าท้องตลาด 20% พร้อมนำมาส่งถึงหน้างานรวมจบในที่เดียวครับ`,
    },
    {
      id: 'friction',
      axisNumber: 6,
      title: 'กะดึก 24 ชม.: รับจบงานด่วนเวลานอกทำการ',
      badge: 'ชาร์จเรทด่วน 24 ชม.',
      color: 'purple',
      icon: '⚡',
      suggestedMultiplier: 1.5,
      bonusAmount: Math.max(1500, Math.round(basePrize * 0.5)),
      rationale: 'หากลูกค้าเดือดร้อนต้องการให้เสร็จก่อนเช้าพรุ่งนี้ ชาร์จเรทฉุกเฉินแลกกับการสแตนด์บายทำงานกะดึก',
      script: `หากงานนี้เป็นเคสด่วนฉุกเฉินและต้องการให้จบก่อนเวลาเปิดทำการพรุ่งนี้ ผมและทีมพร้อมออกปฏิบัติการช่วงกลางคืน (22:00 - 05:00 น.) ทันทีครับ รับประกันส่งมอบงานเรียบร้อยพร้อมใช้งานในงบด่วนฉุกเฉิน ฿${Math.round(basePrize * 1.5).toLocaleString()} บาทครับ`,
    },
  ];

  const currentStrat = strategies[activeStrategyIndex];
  const targetTotal = Math.round(basePrize * currentStrat.suggestedMultiplier);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentStrat.script).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleApply = () => {
    if (onApplyToNegotiation) {
      onApplyToNegotiation(currentStrat.script, targetTotal);
    } else if (onOpenNegotiationModal) {
      onOpenNegotiationModal();
    }
  };

  return (
    <div className="w-full rounded-3xl border border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 dark:from-amber-950/30 dark:via-zinc-900 dark:to-orange-950/20 p-4 shadow-sm space-y-3 font-prompt transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 pt-0.5">
            <NongDot mood="wealth" size={36} color="gold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-amber-950 dark:text-amber-200 tracking-tight">
                💬 น้องดอทกระซิบชี้ช่องทำเงิน (AI Whisper 6-Axis)
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                กลยุทธ์อัพกำไร
              </span>
            </div>
            <p className="text-[10.5px] text-gray-600 dark:text-gray-300 leading-snug mt-0.5">
              รางวัลตั้งต้น <b className="font-mono text-gray-900 dark:text-white">฿{basePrize.toLocaleString()}</b> แต่อัพเกรดเป็น{' '}
              <b className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">฿{targetTotal.toLocaleString()}</b> ได้ด้วย 3 กลยุทธ์นี้:
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs p-1"
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Strategy Option Switcher */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {strategies.map((strat, idx) => {
              const isSelected = activeStrategyIndex === idx;
              return (
                <button
                  key={strat.id}
                  type="button"
                  onClick={() => setActiveStrategyIndex(idx)}
                  className={`p-2 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-800 border-amber-500 shadow-xs ring-1 ring-amber-500/30'
                      : 'bg-white/60 dark:bg-zinc-900/60 border-gray-200 dark:border-zinc-800 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-sm">{strat.icon}</span>
                    <span
                      className={`text-[10px] font-extrabold truncate ${
                        isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {strat.title.split(':')[0]}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    +{strat.badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Strategy Detail & Script Box */}
          <div className="p-3 rounded-2xl bg-white/95 dark:bg-zinc-800/80 border border-amber-200/80 dark:border-zinc-700 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-gray-200">
                <span>{currentStrat.icon}</span>
                <span>{currentStrat.title}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-extrabold border border-emerald-200/60 dark:border-emerald-800">
                เป้าหมาย: ฿{targetTotal.toLocaleString()} บ.
              </span>
            </div>

            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">
              💡 <b>คำแนะนำ:</b> {currentStrat.rationale}
            </p>

            {/* Script Text */}
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 text-[10.5px] text-gray-800 dark:text-gray-200 leading-relaxed font-sans select-all relative">
              &ldquo;{currentStrat.script}&rdquo;
            </div>

            {/* Actions: Copy & Inject to Negotiation */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-[10.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">คัดลอกสคริปต์แล้ว!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกสคริปต์</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:opacity-95 text-white text-[10.5px] font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>ส่งเข้าฟอร์มเจรจา (฿{targetTotal.toLocaleString()})</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
