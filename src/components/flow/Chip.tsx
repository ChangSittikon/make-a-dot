"use client";
import { motion } from "framer-motion";

interface ChipProps {
  label: string;
  onRemove?: () => void;
}

export function Chip({ label, onRemove }: ChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="bg-gray-100 text-gray-600 text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-gray-200/60"
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="opacity-50 hover:opacity-100 transition-opacity">
          <i className="fa-solid fa-xmark text-[9px]" />
        </button>
      )}
    </motion.div>
  );
}
