"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkTypeItem {
  id: string;
  name: string;
}

interface IndustryItem {
  id: string;
  name: string;
  icon?: string | null;
}

export interface CascadingValue {
  requesterWorkTypeId: string;
  requesterWorkTypeName: string;
  requesterIndustryId: string;
  requesterIndustryName: string;
}

interface Props {
  value: CascadingValue | null;
  onChange: (val: CascadingValue) => void;
}

export function CascadingOptionsInput({ value, onChange }: Props) {
  const [workTypes, setWorkTypes] = useState<WorkTypeItem[]>([]);
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [selectedWorkType, setSelectedWorkType] = useState<WorkTypeItem | null>(
    value ? { id: value.requesterWorkTypeId, name: value.requesterWorkTypeName } : null
  );
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryItem | null>(
    value ? { id: value.requesterIndustryId, name: value.requesterIndustryName } : null
  );
  const [loadingWT, setLoadingWT] = useState(true);
  const [loadingInd, setLoadingInd] = useState(true);
  const [errorWT, setErrorWT] = useState<string | null>(null);
  const [errorInd, setErrorInd] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/work-types")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.workTypes)) {
          setWorkTypes(data.workTypes);
        } else {
          throw new Error("Invalid response shape");
        }
      })
      .catch(e => setErrorWT(`โหลด WorkType ไม่ได้: ${e.message}`))
      .finally(() => setLoadingWT(false));
  }, []);

  useEffect(() => {
    fetch("/api/industries")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        let items: IndustryItem[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (Array.isArray(data.industries)) {
          items = data.industries;
        } else {
          throw new Error("Invalid response shape");
        }
        // Filter out system flows so they don't show up in the industry picker (accounts for emojis in the name)
        const filtered = items.filter(ind => 
          !ind.name.includes("หน้าหลัก") && 
          !ind.name.includes("แจ้งปัญหา Flow")
        );
        setIndustries(filtered);
      })
      .catch(e => setErrorInd(`โหลด Industry ไม่ได้: ${e.message}`))
      .finally(() => setLoadingInd(false));
  }, []);

  const handleSelectWorkType = (wt: WorkTypeItem) => {
    setSelectedWorkType(wt);
    setSelectedIndustry(null);
  };

  const handleSelectIndustry = (ind: IndustryItem) => {
    setSelectedIndustry(ind);
    if (selectedWorkType) {
      onChange({
        requesterWorkTypeId: selectedWorkType.id,
        requesterWorkTypeName: selectedWorkType.name,
        requesterIndustryId: ind.id,
        requesterIndustryName: ind.name,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* === Layer 1: WorkType === */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          <i className="fa-solid fa-id-badge mr-1.5 text-brand-red" />
          ประเภทงานของคุณ
        </p>
        {loadingWT && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <i className="fa-solid fa-spinner fa-spin text-brand-red" /> กำลังโหลด...
          </div>
        )}
        {errorWT && (
          <div className="text-red-500 text-sm flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation" /> {errorWT}
          </div>
        )}
        {!loadingWT && !errorWT && (
          <AnimatePresence mode="popLayout">
            {!selectedWorkType ? (
              <motion.div key="wt-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-2.5">
                {workTypes.map(wt => (
                  <button
                    key={wt.id}
                    type="button"
                    onClick={() => handleSelectWorkType(wt)}
                    className="px-4 py-3.5 rounded-[20px] text-[13px] font-medium text-center transition-all duration-300 border border-transparent bg-[#F5F5F7] text-gray-600 hover:bg-white hover:border-gray-200 hover:shadow-sm active:scale-95"
                  >
                    {wt.name}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div key="wt-selected" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
                <button
                  type="button"
                  onClick={() => { setSelectedWorkType(null); setSelectedIndustry(null); }}
                  className="w-full px-5 py-4 rounded-[20px] text-[14px] font-medium transition-all duration-300 bg-brand-black text-white shadow-md flex items-center justify-between active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-check-circle text-brand-red" />
                    {selectedWorkType.name}
                  </span>
                  <i className="fa-solid fa-pen text-gray-400 text-[12px]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* === Layer 2: Industry === */}
      <AnimatePresence>
        {selectedWorkType && (
          <motion.div
            key="industry-layer"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col gap-2 mt-2"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              <i className="fa-solid fa-building mr-1.5 text-gray-300" />
              หมวดหมู่อุตสาหกรรม
            </p>
            {loadingInd && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <i className="fa-solid fa-spinner fa-spin text-gray-300" /> กำลังโหลด...
              </div>
            )}
            {errorInd && (
              <div className="text-red-500 text-sm flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation" /> {errorInd}
              </div>
            )}
            {!loadingInd && !errorInd && (
              <AnimatePresence mode="popLayout">
                {!selectedIndustry ? (
                  <motion.div key="ind-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1 pb-1">
                    {industries.map(ind => (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => handleSelectIndustry(ind)}
                        className="px-4 py-3.5 rounded-[20px] text-[13px] font-medium text-center transition-all duration-300 border border-transparent bg-[#F5F5F7] text-gray-600 hover:bg-white hover:border-gray-200 hover:shadow-sm active:scale-95"
                      >
                        {ind.name}
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="ind-selected" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
                    <button
                      type="button"
                      onClick={() => setSelectedIndustry(null)}
                      className="w-full px-5 py-4 rounded-[20px] text-[14px] font-medium transition-all duration-300 bg-brand-black text-white shadow-md flex items-center justify-between active:scale-95"
                    >
                      <span className="flex items-center gap-2">
                        <i className="fa-solid fa-check-circle text-brand-red" />
                        {selectedIndustry.name}
                      </span>
                      <i className="fa-solid fa-pen text-gray-400 text-[12px]" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
