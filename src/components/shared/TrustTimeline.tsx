'use client';
import { motion } from 'framer-motion';

export type Milestone = {
  title: string;
  amountSatang: number;
  status: string;
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'PENDING_REVIEW': return { color: 'text-orange-500', icon: '🕒', bg: 'bg-orange-100' };
    case 'RELEASED':
    case 'APPROVED': return { color: 'text-green-500', icon: '✓', bg: 'bg-green-100' };
    case 'DISPUTED': return { color: 'text-red-500', icon: '⚠', bg: 'bg-red-100' };
    default: return { color: 'text-gray-500', icon: '🔒', bg: 'bg-gray-100' };
  }
};

export default function TrustTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="relative border-l-2 border-gray-100 ml-4 py-2 font-prompt space-y-6">
      {milestones.map((ms, i) => {
        const config = getStatusConfig(ms.status);
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="relative pl-6"
          >
            <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center ${config.bg} ${config.color} border-4 border-white`}>
              {config.icon}
            </div>
            <div className="bg-white p-3 rounded-[14px] shadow-sm border border-gray-50">
              <h4 className="font-medium text-gray-800">{ms.title}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold text-[#FF1A1A]">
                  ฿{(ms.amountSatang / 100).toLocaleString('th-TH')}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color} font-medium`}>
                  {ms.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
