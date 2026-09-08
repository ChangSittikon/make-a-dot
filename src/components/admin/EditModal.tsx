"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EditOption {
  id: string;
  label: string;
  target: string;
}

interface TargetOption {
  value: string;
  label: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionText?: string;
  options?: EditOption[];
  targetOptions?: TargetOption[];
  onSave?: (questionText: string, newOptions: EditOption[]) => void;
  onDelete?: () => void;
}

export function EditModal({
  isOpen,
  onClose,
  questionText = "",
  options = [],
  targetOptions = [],
  onSave,
  onDelete,
}: EditModalProps) {
  const [question, setQuestion] = useState(questionText);
  const [editOptions, setEditOptions] = useState(options);

  const addOption = () => {
    setEditOptions([
      ...editOptions,
      { id: crypto.randomUUID(), label: "", target: targetOptions.length > 0 ? targetOptions[0].value : "" },
    ]);
  };

  const removeOption = (id: string) => {
    setEditOptions(editOptions.filter((o) => o.id !== id));
  };

  const updateOption = (id: string, field: "label" | "target", value: string) => {
    setEditOptions(
      editOptions.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(question, editOptions);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[400px] max-h-[85vh] bg-white rounded-[32px] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-sm">แก้ไขคำถาม</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-auto">
              <div className="mb-5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                  ข้อความคำถาม
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none h-24"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                  ตัวเลือก (Options)
                </label>
                <div className="space-y-3">
                  {editOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="cursor-grab text-gray-300 mt-2">
                        <i className="fa-solid fa-grip-vertical" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => updateOption(opt.id, "label", e.target.value)}
                          className="w-full text-xs p-2 border border-gray-200 rounded"
                          placeholder="ชื่อตัวเลือก"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500">ไปที่:</span>
                          <select
                            value={opt.target}
                            onChange={(e) => updateOption(opt.id, "target", e.target.value)}
                            className="text-xs p-1.5 border border-gray-200 rounded flex-1 bg-white"
                          >
                            {targetOptions.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => removeOption(opt.id)}
                        className="text-red-400 hover:text-red-600 mt-2"
                      >
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addOption}
                  className="mt-4 w-full py-2 bg-white border border-gray-200 text-brand-red text-xs font-semibold rounded-lg hover:bg-brand-red-50 transition shadow-sm"
                >
                  + เพิ่มตัวเลือกใหม่
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
              >
                ยกเลิก
              </button>
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="flex-1 py-2.5 bg-red-100 text-red-600 text-xs font-bold rounded-xl hover:bg-red-200 transition"
                >
                  ลบ
                </button>
              )}
              <button
                onClick={handleSaveClick}
                className="flex-1 py-2.5 bg-brand-black text-white text-xs font-bold rounded-xl hover:bg-black transition shadow-md"
              >
                บันทึก
              </button>
            </div>
            </motion.div>
          </div>
        )}
    </AnimatePresence>
  );
}
