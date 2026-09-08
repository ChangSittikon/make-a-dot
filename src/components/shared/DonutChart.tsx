'use client';
import { motion } from 'framer-motion';

export type DonutSegment = {
  label: string;
  percentage: number;
  color: string;
};

export default function DonutChart({ segments }: { segments: DonutSegment[] }) {
  let cumulativePercent = 0;

  const largestSegment = segments.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current
  , segments[0] || { label: '', percentage: 0 });

  return (
    <div className="relative w-full aspect-square max-w-[300px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {segments.map((seg, i) => {
          const startPercent = cumulativePercent;
          cumulativePercent += seg.percentage;
          const strokeDasharray = `${seg.percentage} ${100 - seg.percentage}`;
          const strokeDashoffset = -startPercent;

          return (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r="15.915"
              fill="transparent"
              stroke={seg.color}
              strokeWidth="5"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center font-prompt pointer-events-none">
        <span className="text-3xl font-bold text-gray-900">{largestSegment.percentage}%</span>
        <span className="text-sm text-gray-500">{largestSegment.label}</span>
      </div>
    </div>
  );
}
