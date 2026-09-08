"use client";
import { motion } from "framer-motion";

interface ResultCardProps {
  name: string;
  tags: string;
  avatarUrl?: string;
  verified?: boolean;
  index: number; // for cascade delay
}

export function ResultCard({ name, tags, avatarUrl, verified = false, index }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
        delay: index * 0.1,
      }}
      className="bg-white dark:bg-[#1e2329] border border-gray-100 dark:border-gray-800 rounded-[12px] p-2 flex items-center justify-between hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' }}
    >
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} className="w-9 h-9 rounded-full object-cover" alt={name} />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
            <i className="fa-regular fa-user" />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-brand-black dark:text-white leading-tight flex items-center gap-1">
            {name}
            {verified && <i className="fa-solid fa-circle-check text-blue-500 text-[10px]" />}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{tags}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <button className="w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center text-[10px] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <i className="fa-solid fa-play" />
        </button>
        <button className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors">
          <i className="fa-solid fa-plus" />
        </button>
      </div>
    </motion.div>
  );
}
