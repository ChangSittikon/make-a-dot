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

  // Fetch WorkTypes from API
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

  // Fetch Industries from API (all top-level, dynamic — RULE: no hardcoded filter)
  useEffect(() => {
    fetch("/api/industries")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.industries)) {
          setIndustries(data.industries);
        } else {
          throw new Error("Invalid response shape");
        }
      })
      .catch(e => setErrorInd(`โหลด Industry ไม่ได้: ${e.message}`))
      .finally(() => setLoadingInd(false));
  }, []);

  const handleSelectWorkType = (wt: WorkTypeItem) => {
    setSelectedWorkType(wt);
    // Clear industry when switching work type
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
          <div className="grid grid-cols-2 gap-2">
            {workTypes.map(wt => (
              <button
                key={wt.id}
                type="button"
                onClick={() => handleSelectWorkType(wt)}
                className={`px-3 py-3 rounded-2xl border-2 text-sm font-medium text-left transition-all leading-snug ${
                  selectedWorkType?.id === wt.id
                    ? "border-brand-red bg-red-50 text-brand-red shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {wt.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* === Layer 2: Industry (animates in when WorkType selected) === */}
      <AnimatePresence>
        {selectedWorkType && (
          <motion.div
            key="industry-layer"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col gap-2"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <i className="fa-solid fa-building mr-1.5 text-brand-red" />
              อยู่ในวงการอะไร?
            </p>
            {loadingInd && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <i className="fa-solid fa-spinner fa-spin text-brand-red" /> กำลังโหลด...
              </div>
            )}
            {errorInd && (
              <div className="text-red-500 text-sm flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation" /> {errorInd}
              </div>
            )}
            {!loadingInd && !errorInd && (
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {industries.map(ind => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => handleSelectIndustry(ind)}
                    className={`px-3 py-2.5 rounded-2xl border-2 text-sm font-medium text-left transition-all leading-snug ${
                      selectedIndustry?.id === ind.id
                        ? "border-brand-red bg-red-50 text-brand-red shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection summary badge */}
      {selectedWorkType && selectedIndustry && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-brand-red/30 rounded-xl text-sm text-brand-red font-medium"
        >
          <i className="fa-solid fa-check-circle" />
          {selectedWorkType.name} · {selectedIndustry.name}
        </motion.div>
      )}
    </div>
  );
}
