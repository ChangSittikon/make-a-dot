"use client";
import { motion } from "framer-motion";

interface CardOptionProps {
  label: string;
  icon?: string; // FontAwesome class name
  onClick: () => void;
  layout?: "full" | "grid"; // full = single column, grid = 2-col
  showArrow?: boolean;
}

export function CardOption({ label, icon, onClick, layout = "full", showArrow = false }: CardOptionProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`bg-white dark:bg-[#1e2329] rounded-[14px] flex items-center gap-3 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors ${
        layout === "full" ? "w-full p-3.5" : "p-3"
      } ${showArrow ? "justify-between px-4 py-3" : ""}`}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className={`${layout === "full" ? "w-8 h-8" : "w-auto"} rounded-lg ${layout === "full" ? "bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center" : ""} text-gray-400 dark:text-gray-500 text-sm`}>
            <i className={`${icon} ${layout === "grid" ? "text-xs w-4" : ""}`} />
          </div>
        )}
        <span className={`${layout === "full" ? "text-sm" : "text-[13px]"} font-medium text-gray-800 dark:text-gray-200 text-left`}>{label}</span>
      </div>
      {showArrow && <i className="fa-solid fa-arrow-right text-gray-300 dark:text-gray-600 text-[10px]" />}
    </motion.button>
  );
}
