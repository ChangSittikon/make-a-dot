"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingDot } from "@/components/flow/BreathingDot";
import { CardOption } from "@/components/flow/CardOption";
import { DynamicRewardInput, DynamicRewardValue } from "@/components/flow/inputs/DynamicRewardInput";
import { CascadingOptionsInput, CascadingValue } from "@/components/flow/inputs/CascadingOptionsInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

type InputType = "TEXT" | "TEXTAREA" | "NUMBER" | "OPTIONS" | "MAGIC_SEARCH" | "DYNAMIC_REWARD" | "CASCADING_OPTIONS";

interface StepOption {
  label: string;
  value: string;
  icon?: string;
}

interface Step {
  id: string;
  type: InputType;
  question: string;
  options?: StepOption[];
  field: string;
  suggestions?: string[];
}

interface TaxonomyItem {
  id: string;
  name: string;
}

interface OccupationTaxonomy {
  id: string;
  name: string;
  industryId: string;
  skillTags: TaxonomyItem[];
}

interface IndustryTaxonomy {
  id: string;
  name: string;
  occupations: OccupationTaxonomy[];
}

interface SearchMatch {
  type: "occupation" | "skill";
  item: TaxonomyItem;
  parentName: string;
  occupationId?: string;
}

interface FloatingDot {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  active: boolean;
}

const panelVariants = {
  enter: { opacity: 0, y: 30, scale: 0.95 },
  active: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

export function BountyFlowApp() {
  const router = useRouter();

  const [flowSteps, setFlowSteps] = useState<Step[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rewardValue, setRewardValue] = useState<DynamicRewardValue | null>(null);
  const [cascadeValue, setCascadeValue] = useState<CascadingValue | null>(null);

  const [taxonomyIndustries, setTaxonomyIndustries] = useState<IndustryTaxonomy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOccupations, setSelectedOccupations] = useState<TaxonomyItem[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<TaxonomyItem[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<SearchMatch[]>([]);

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dotPosition, setDotPosition] = useState<"center" | "text">("center");
  const [universeDots, setUniverseDots] = useState<FloatingDot[]>([]);

  const [showSummary, setShowSummary] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const currentStep = flowSteps[currentStepIndex];

  useEffect(() => {
    fetch("/api/bounty-flow", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: Step[]) => {
        if (Array.isArray(data) && data.length > 0) setFlowSteps(data);
      })
      .catch(console.error)
      .finally(() => setLoadingSteps(false));
  }, []);

  useEffect(() => {
    fetch("/api/taxonomy")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.industries))
          setTaxonomyIndustries(data.industries);
      })
      .catch((e) => console.error("Failed to load taxonomy:", e));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) { setFilteredMatches([]); return; }
    const term = searchTerm.toLowerCase().trim();
    const matches: SearchMatch[] = [];
    taxonomyIndustries.forEach((ind) => {
      ind.occupations?.forEach((occ) => {
        if (occ.name.toLowerCase().includes(term))
          matches.push({ type: "occupation", item: { id: occ.id, name: occ.name }, parentName: ind.name, occupationId: occ.id });
        occ.skillTags?.forEach((skill) => {
          if (skill.name.toLowerCase().includes(term))
            matches.push({ type: "skill", item: { id: skill.id, name: skill.name }, parentName: occ.name, occupationId: occ.id });
        });
      });
    });
    setFilteredMatches(matches.slice(0, 8));
  }, [searchTerm, taxonomyIndustries]);

  useEffect(() => {
    const dots = Array.from({ length: 40 }).map((_, i) => ({
      id: `dot-${i}`,
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 5 + 3,
      opacity: Math.random() * 0.3 + 0.1,
      color: "#9CA3AF", active: true,
    }));
    setUniverseDots(dots);
  }, []);

  const typeText = useCallback((text: string) => {
    setIsTyping(true); setShowInput(false); setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayedText(text.slice(0, i + 1)); i++; }
      else { clearInterval(interval); setIsTyping(false); setShowInput(true); setDotPosition("text"); }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep && !isSubmitting && !loadingSteps) {
      let initialVal = answers[currentStep.field] || "";
      
      // Auto-fill template directly into the input if it's empty
      if (!initialVal && currentStep.type === "TEXTAREA" && currentStep.suggestions) {
        const template = currentStep.suggestions.find(s => s.includes("\n"));
        if (template) initialVal = template;
      }
      
      setInputValue(initialVal);
      const timer = setTimeout(() => typeText(currentStep.question), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isSubmitting, typeText, loadingSteps, answers, currentStep]);

  useEffect(() => {
    if (showInput && inputRef.current &&
        currentStep?.type !== "OPTIONS" &&
        currentStep?.type !== "DYNAMIC_REWARD" &&
        currentStep?.type !== "CASCADING_OPTIONS") {
      inputRef.current.focus();
    }
  }, [showInput, currentStep]);

  const collapseUniverse = () => {
    setUniverseDots((prev) => {
      const active = prev.filter((d) => d.active);
      const killCount = Math.floor(active.length * 0.2);
      let killed = 0;
      return prev.map((dot) => {
        if (!dot.active) return dot;
        if (killed < killCount && Math.random() > 0.5) { killed++; return { ...dot, active: false, opacity: 0 }; }
        const dx = 50 - dot.x; const dy = 25 - dot.y;
        return { ...dot, x: dot.x + dx * 0.15, y: dot.y + dy * 0.15, opacity: Math.min(0.6, dot.opacity + 0.1), color: Math.random() > 0.8 ? "#FF1A1A" : dot.color };
      });
    });
  };

  const validateCurrentStep = (): boolean => {
    if (!currentStep) return false;
    switch (currentStep.type) {
      case "DYNAMIC_REWARD":
        if (!rewardValue) { alert("กรุณาระบุค่าตอบแทน"); return false; }
        if (rewardValue.bountyType === "CASH" && rewardValue.bountyPrizeSatang <= 0) { alert("กรุณาระบุจำนวนเงิน"); return false; }
        if (rewardValue.bountyType !== "CASH" && !rewardValue.bountyDescription.trim()) { alert("กรุณาระบุรายละเอียดค่าตอบแทน"); return false; }
        return true;
      case "CASCADING_OPTIONS":
        if (!cascadeValue?.requesterWorkTypeId || !cascadeValue?.requesterIndustryId) { alert("กรุณาเลือกประเภทงานและวงการ"); return false; }
        return true;
      case "MAGIC_SEARCH":
        if (selectedOccupations.length === 0 && selectedSkills.length === 0 && !inputValue.trim()) { alert("กรุณาเลือกหรือค้นหาอาชีพ/ทักษะอย่างน้อย 1 รายการ"); return false; }
        return true;
      case "OPTIONS":
        return true;
      default:
        if (!inputValue.trim()) { alert("กรุณาระบุข้อมูล"); return false; }
        return true;
    }
  };

  const handleNext = async (valueOverride?: string) => {
    if (isTyping) return;
    if (!currentStep) return;

    let fieldKey = currentStep.field || "answer";
    let fieldValue = valueOverride ?? inputValue;

    switch (currentStep.type) {
      case "DYNAMIC_REWARD":
        if (!validateCurrentStep()) return;
        fieldValue = JSON.stringify(rewardValue);
        break;
      case "CASCADING_OPTIONS":
        if (!validateCurrentStep()) return;
        fieldValue = JSON.stringify(cascadeValue);
        break;
      case "MAGIC_SEARCH":
        if (!validateCurrentStep()) return;
        const allTags = [...selectedOccupations.map((o) => o.name), ...selectedSkills.map((s) => s.name)];
        fieldValue = allTags.join(", ") || fieldValue;
        break;
      case "OPTIONS":
        if (valueOverride === undefined && !inputValue.trim()) return;
        break;
      default:
        if (!validateCurrentStep()) return;
    }

    const newAnswers = { ...answers, [fieldKey]: fieldValue };
    setAnswers(newAnswers);
    collapseUniverse();

    if (currentStepIndex < flowSteps.length - 1) {
      setShowInput(false);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      submitBounty(newAnswers);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNext();
  };

  const selectMatch = (match: SearchMatch) => {
    if (match.type === "occupation") {
      if (!selectedOccupations.some((o) => o.id === match.item.id)) setSelectedOccupations((prev) => [...prev, match.item]);
    } else {
      if (!selectedSkills.some((s) => s.id === match.item.id)) setSelectedSkills((prev) => [...prev, match.item]);
    }
    setSearchTerm(""); setFilteredMatches([]);
  };

  const toggleSuggestion = (sug: string) => {
    const isSelected =
      selectedOccupations.some((o) => o.name.toLowerCase() === sug.toLowerCase()) ||
      selectedSkills.some((s) => s.name.toLowerCase() === sug.toLowerCase());

    if (isSelected) {
      setSelectedOccupations((prev) => prev.filter((o) => o.name.toLowerCase() !== sug.toLowerCase()));
      setSelectedSkills((prev) => prev.filter((s) => s.name.toLowerCase() !== sug.toLowerCase()));
    } else {
      const synonyms: Record<string, string> = {
        "โปรแกรมเมอร์": "Software Engineer",
        "นักออกแบบ": "UX/UI Designer",
      };
      const searchTarget = synonyms[sug]?.toLowerCase() || sug.toLowerCase();

      let matchedOcc: TaxonomyItem | null = null;
      let matchedSkill: TaxonomyItem | null = null;

      for (const ind of taxonomyIndustries) {
        for (const occ of ind.occupations || []) {
          const occNameLower = occ.name.toLowerCase();
          if (occNameLower === sug.toLowerCase() || occNameLower === searchTarget) {
            matchedOcc = { id: occ.id, name: occ.name };
            break;
          }
          for (const sk of occ.skillTags || []) {
            const skNameLower = sk.name.toLowerCase();
            if (skNameLower === sug.toLowerCase() || skNameLower === searchTarget) {
              matchedSkill = { id: sk.id, name: sk.name };
              break;
            }
          }
          if (matchedOcc || matchedSkill) break;
        }
        if (matchedOcc || matchedSkill) break;
      }

      if (matchedOcc) {
        setSelectedOccupations((prev) => [...prev, matchedOcc!]);
      } else if (matchedSkill) {
        setSelectedSkills((prev) => [...prev, matchedSkill!]);
      } else {
        setSelectedOccupations((prev) => [
          ...prev,
          { id: `custom-${Date.now()}-${sug}`, name: sug },
        ]);
      }
    }
  };

  const submitBounty = async (finalAnswers: Record<string, string>) => {
    setShowInput(false);
    setIsSubmitting(true);
    setDisplayedText("");
    typeText("กำลังเชื่อมโยงปัญหานี้เข้าสู่ระบบ");
    setUniverseDots((prev) => prev.map((dot) => ({ ...dot, opacity: 0 })));

    const payload: Record<string, unknown> = {
      rawDescription: finalAnswers.rawDescription || "ไม่ระบุรายละเอียด",
      problemCategory: finalAnswers.problemCategory || null,
    };

    if (rewardValue) {
      payload.bountyType = rewardValue.bountyType;
      payload.bountyPrizeSatang = rewardValue.bountyPrizeSatang;
      payload.bountyDescription = rewardValue.bountyDescription || null;
    }

    if (cascadeValue) {
      payload.requesterWorkTypeId = cascadeValue.requesterWorkTypeId;
      payload.requesterIndustryId = cascadeValue.requesterIndustryId;
    }

    if (selectedOccupations.length > 0) {
      payload.occupationId = selectedOccupations[0].id;
    }
    if (selectedSkills.length > 0) {
      payload.skillTags = selectedSkills.map((s) => s.id);
    }

    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      // Hold on the initial text for 4 seconds as requested
      setTimeout(() => {
        if (data.success) {
          runFinalSequence();
        } else {
          alert("เกิดข้อผิดพลาด: " + (data.error ?? "Unknown error"));
          setIsSubmitting(false);
        }
      }, 4000);
    } catch {
      alert("Network Error — กรุณาลองใหม่อีกครั้ง");
      setIsSubmitting(false);
    }
  };

  const runFinalSequence = () => {
    typeText("รับเข้าระบบแล้ว");
    setTimeout(() => {
      typeText("โปรดรออย่างมีความหวัง");
      setTimeout(() => {
        typeText("คุณจงทบทวนใบสรุปนี้อีกครั้ง ให้เราเข้าใจกันอย่างลึกซึ้ง แก้ไขได้ตรงจุดและรวดเร็ว");
        setTimeout(() => {
           setShowSummary(true);
        }, 4000);
      }, 2500);
    }, 2000);
  };

  const renderInput = () => {
    if (!showInput || !currentStep) return null;

    switch (currentStep.type) {
      case "OPTIONS":
        return (
          <div className="flex flex-col gap-4 w-full">
            {/* Render Options as Chips */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {currentStep.options?.map((opt, i) => (
                <motion.div key={opt.value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04, ease: [0.32, 0.72, 0, 1] }}>
                  <button
                    onClick={() => handleNext(opt.label)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5F5F7] border border-transparent text-gray-600 rounded-full text-[13px] font-medium hover:bg-white hover:border-gray-200 hover:shadow-sm hover:text-brand-black active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    {opt.icon && <i className={`${opt.icon} text-gray-400`} />}
                    {opt.label}
                  </button>
                </motion.div>
              ))}
            </div>
            
            {/* Minimalist Input Box for OTHER fallback (Below Chips) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: (currentStep.options?.length || 0) * 0.04 }}>
              <div className="relative w-full mt-1">
                <input
                  type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                  className="w-full bg-[#F5F5F7] border border-transparent rounded-[20px] px-5 pr-14 py-3.5 text-brand-black text-[14px] focus:outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all duration-300 placeholder:text-gray-400"
                  placeholder="หรือพิมพ์ระบุปัญหาด้วยตนเอง..."
                />
                <button onClick={() => handleNext()} className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${inputValue.trim() ? 'bg-brand-red text-white hover:bg-red-700 hover:scale-105 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  <i className="fa-solid fa-arrow-up text-sm" />
                </button>
              </div>
            </motion.div>
          </div>
        );

      case "DYNAMIC_REWARD":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col gap-3">
            <DynamicRewardInput value={rewardValue} onChange={setRewardValue} onSubmit={handleNext} />
          </motion.div>
        );

      case "CASCADING_OPTIONS":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col gap-3">
            <CascadingOptionsInput value={cascadeValue} onChange={(val) => {
              setCascadeValue(val);
            }} />
            <AnimatePresence>
              {cascadeValue?.requesterWorkTypeId && cascadeValue?.requesterIndustryId && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex justify-end mt-1">
                  <button onClick={() => handleNext()} className="w-11 h-11 flex items-center justify-center bg-brand-red text-white rounded-full hover:bg-red-700 transition-all shadow-md hover:scale-105">
                    <i className="fa-solid fa-arrow-right text-[15px]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );

      case "MAGIC_SEARCH":
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col gap-3">
            
            {/* The Cool Chips matching Image 3 (floating seamlessly) */}
            {(selectedOccupations.length > 0 || selectedSkills.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-1 justify-center">
                {selectedOccupations.map((occ) => (
                  <span key={occ.id} className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-brand-red/30 text-brand-red rounded-full text-sm font-medium">
                    <i className="fa-solid fa-briefcase text-[11px]" />{occ.name}
                    <button type="button" onClick={() => setSelectedOccupations((prev) => prev.filter((o) => o.id !== occ.id))} className="text-brand-red/70 hover:text-brand-red ml-1">
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </span>
                ))}
                {selectedSkills.map((skill) => (
                  <span key={skill.id} className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-brand-red/30 text-brand-red rounded-full text-sm font-medium">
                    <i className="fa-solid fa-bolt text-[11px]" />{skill.name}
                    <button type="button" onClick={() => setSelectedSkills((prev) => prev.filter((s) => s.id !== skill.id))} className="text-brand-red/70 hover:text-brand-red ml-1">
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="relative w-full mb-1">
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { if (filteredMatches.length > 0) selectMatch(filteredMatches[0]); else handleNext(searchTerm); } }}
                className="w-full bg-[#F5F5F7] border border-transparent rounded-[20px] px-5 pr-14 py-3.5 text-brand-black text-[14px] focus:outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all duration-300 placeholder:text-gray-400"
                placeholder="ค้นหาอาชีพ ทักษะ หรือพิมพ์ระบุเอง..."
              />
              <button onClick={() => handleNext()} className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${(selectedOccupations.length > 0 || selectedSkills.length > 0 || searchTerm.trim()) ? 'bg-brand-red text-white hover:bg-red-700 hover:scale-105 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                <i className="fa-solid fa-arrow-up text-sm" />
              </button>
              
              {filteredMatches.length > 0 && (
                <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 max-h-56 overflow-y-auto">
                  <div className="p-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">ผลการค้นหาข้อมูลจากฐานข้อมูล</div>
                  {filteredMatches.map((m, idx) => (
                    <div key={idx} onClick={() => selectMatch(m)} className="px-4 py-3 hover:bg-red-50/50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-b-0 transition-colors">
                      <div className="flex items-center gap-2">
                        <i className={`fa-solid ${m.type === "occupation" ? "fa-briefcase text-brand-red" : "fa-bolt text-brand-red"} text-xs w-4 text-center`} />
                        <span className="text-sm font-medium text-gray-800">{m.item.name}</span>
                        <span className="text-xs text-gray-400 font-light">({m.parentName})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {currentStep.suggestions && currentStep.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {currentStep.suggestions.map((sug, idx) => {
                  const isSelected =
                    selectedOccupations.some((o) => o.name.toLowerCase() === sug.toLowerCase()) ||
                    selectedSkills.some((s) => s.name.toLowerCase() === sug.toLowerCase());

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleSuggestion(sug)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium active:scale-95 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-red-50 border border-brand-red text-brand-red shadow-sm"
                          : "bg-[#F5F5F7] border border-transparent text-gray-600 hover:bg-white hover:border-gray-200 hover:shadow-sm hover:text-brand-black"
                      }`}
                    >
                      {isSelected ? (
                        <i className="fa-solid fa-check text-[11px] text-brand-red" />
                      ) : (
                        <i className="fa-solid fa-plus text-[10px] text-gray-400" />
                      )}
                      {sug}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        );

      default:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col gap-3">
            <div className="relative w-full">
              {currentStep.type === "NUMBER" && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base pointer-events-none select-none">฿</span>
              )}
              {currentStep.type === "TEXTAREA" ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-transparent rounded-[20px] p-5 pr-14 text-brand-black text-[14px] focus:outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all duration-300 min-h-[140px] resize-none leading-relaxed placeholder:text-gray-400"
                  placeholder="พิมพ์อธิบายปัญหาที่ต้องการให้เราช่วยแก้ไข..."
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  value={inputValue} 
                  onChange={(e) => {
                    if (currentStep.type === "NUMBER") setInputValue(e.target.value.replace(/[^0-9]/g, ""));
                    else setInputValue(e.target.value);
                  }} 
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-[#F5F5F7] border border-transparent rounded-[20px] px-5 ${currentStep.type === "NUMBER" ? "pl-9" : ""} pr-14 py-3.5 text-brand-black text-[14px] focus:outline-none focus:bg-white focus:border-gray-200 focus:shadow-sm transition-all duration-300 placeholder:text-gray-400`}
                  placeholder={currentStep.type === "NUMBER" ? "ระบุตัวเลข..." : "พิมพ์คำตอบที่นี่..."}
                />
              )}
              <button onClick={() => handleNext()} className={`absolute right-2 ${currentStep.type === "TEXTAREA" ? "bottom-2" : "top-1/2 -translate-y-1/2"} w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${inputValue.trim() ? 'bg-brand-red text-white hover:bg-red-700 hover:scale-105 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                <i className="fa-solid fa-arrow-up text-sm" />
              </button>
            </div>
            {currentStep.suggestions && currentStep.suggestions.filter(s => !s.includes("\n")).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1 justify-center">
                {currentStep.suggestions.filter(s => !s.includes("\n")).map((sug, idx) => (
                    <button key={idx} onClick={() => {
                      if (currentStep.type === "TEXTAREA") {
                        setInputValue((prev) => prev ? prev + "\n" + sug : sug);
                      } else {
                        setInputValue(sug);
                      }
                    }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5F5F7] border border-transparent text-gray-600 rounded-full text-[13px] font-medium hover:bg-white hover:border-gray-200 hover:shadow-sm hover:text-brand-black active:scale-95 transition-all duration-300 cursor-pointer text-left whitespace-nowrap">
                      {sug.length > 30 ? sug.substring(0, 30) + "..." : sug}
                    </button>
                ))}
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10 transition-colors duration-500">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        <header className="px-5 py-4 flex items-center justify-between z-50 sticky top-0 bg-transparent">
          {currentStepIndex > 0 ? (
            <button onClick={() => {
              setCurrentStepIndex(currentStepIndex - 1);
              setShowInput(true);
            }} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-500 text-sm" />
            </button>
          ) : (
            <Link href="/" className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-500 text-sm" />
            </Link>
          )}
          <div className="text-xs font-bold text-gray-400">
            {isSubmitting ? "FINALIZING..." : `STEP ${currentStepIndex + 1} OF ${flowSteps.length}`}
          </div>
        </header>

        {flowSteps.length > 0 && !isSubmitting && (
          <div className="absolute top-16 left-5 right-5 h-1 bg-gray-100 rounded-full z-40 overflow-hidden">
            <motion.div
              className="h-full bg-brand-red rounded-full"
              animate={{ width: `${((currentStepIndex + 1) / flowSteps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            />
          </div>
        )}

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {universeDots.map((dot) => (
            <motion.div
              key={dot.id} initial={false}
              animate={{ left: `${dot.x}%`, top: `${dot.y}%`, opacity: dot.opacity, scale: dot.active ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
              className="absolute rounded-full"
              style={{ width: dot.size, height: dot.size, backgroundColor: dot.color, transform: "translate(-50%, -50%)", boxShadow: dot.color === "#FF1A1A" ? "0 0 12px rgba(255,26,26,0.15)" : "none" }}
            />
          ))}
          {dotPosition === "center" && (
            <motion.div layoutId="nong-dot" className="absolute left-[50%] top-[25%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50">
              <BreathingDot size={24} />
            </motion.div>
          )}
        </div>

        <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!isSubmitting ? (
              <motion.div
                key={currentStep?.id ?? "empty"}
                variants={panelVariants} initial="enter" animate="active" exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 px-6 flex flex-col justify-center pb-20"
              >
                <div className="mb-6 min-h-[80px] relative">
                  <div className="h-8 mb-3 flex items-end">
                    {dotPosition === "text" && (
                      <motion.div layoutId="nong-dot" transition={{ layout: { type: "spring", stiffness: 60, damping: 11, mass: 1.2 } }} className="inline-flex items-center justify-center z-50">
                        <BreathingDot size={18} />
                      </motion.div>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-5 bg-brand-red ml-1 animate-[blink_1s_infinite]" />}
                  </h1>
                </div>
                <div className="flex flex-col gap-3 min-h-[160px]">
                  {renderInput()}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="submitting"
                variants={panelVariants} initial="enter" animate="active"
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 px-6 py-6 pb-24 flex flex-col justify-center items-center w-full"
              >
                <div className="mb-6 mt-8 text-center flex flex-col items-center w-full">
                  {!showSummary && (
                    <motion.div layoutId="nong-dot" className="inline-flex items-center justify-center z-50 mb-8">
                      <BreathingDot size={32} color="red" />
                    </motion.div>
                  )}
                  <h2 className={`font-bold text-gray-900 leading-snug mb-6 transition-all duration-500 ${showSummary ? 'text-lg text-left w-full' : 'text-2xl text-center'}`}>
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-5 bg-brand-red ml-1 animate-[blink_1s_infinite]" />}
                  </h2>

                  {showSummary && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
                      className="w-full text-left"
                    >
                      <div className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-xl relative overflow-hidden group">
                        
                        {/* Aesthetic Header */}
                        <div className="flex items-start justify-between mb-5 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                              <i className="fa-solid fa-certificate text-xl text-brand-black" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">ใบการ์ดแก้ปัญหา</h3>
                              <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: {answers.problemCategory?.substring(0,3).toUpperCase() || 'SYS'}-{Math.floor(Math.random()*9000)+1000}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                              <i className="fa-solid fa-spinner fa-spin mr-1" /> อยู่ระหว่างดำเนินการ
                            </span>
                            <span className="text-[9px] text-gray-400 mt-1">กรองข้อมูลเบื้องต้นสำเร็จ</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">สรุปปัญหา / ความต้องการ</div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-[13px] text-gray-700 leading-relaxed font-medium">
                              "{answers.rawDescription?.substring(0, 120) || "ไม่ระบุรายละเอียด"}{answers.rawDescription?.length > 120 ? '...' : ''}"
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ผู้เชี่ยวชาญเป้าหมาย</div>
                               <div className="text-[12px] font-bold text-brand-black truncate">
                                 {selectedOccupations.length > 0 ? selectedOccupations[0].name : (cascadeValue?.requesterIndustryId ? "คัดกรองจากวงการ" : "ไม่ระบุ")}
                               </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">รางวัลตอบแทน</div>
                               <div className="text-[12px] font-bold text-brand-red truncate">
                                 {rewardValue?.bountyType === "CASH" ? `฿${(rewardValue.bountyPrizeSatang / 100).toLocaleString()}` : rewardValue?.bountyDescription || "-"}
                               </div>
                            </div>
                          </div>
                          
                          {/* Checklist Guideline */}
                          <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/50 mt-2">
                             <div className="text-[11px] font-bold text-brand-red mb-2 flex items-center gap-1.5">
                               <i className="fa-solid fa-list-check" /> เช็คลิสต์แนวทาง / เตรียมพร้อมก่อนพบผู้เชี่ยวชาญ
                             </div>
                             <ul className="space-y-2">
                               <li className="flex items-start gap-2 text-[12px] text-gray-700">
                                 <i className="fa-regular fa-square text-gray-400 mt-0.5" /> ทบทวนใบสรุปนี้เพื่อความเข้าใจที่ตรงกัน
                               </li>
                               <li className="flex items-start gap-2 text-[12px] text-gray-700">
                                 <i className="fa-regular fa-square text-gray-400 mt-0.5" /> เตรียมไฟล์ข้อมูลเพิ่มเติม (ถ้ามี)
                               </li>
                               <li className="flex items-start gap-2 text-[12px] text-gray-700">
                                 <i className="fa-regular fa-square text-gray-400 mt-0.5" /> รอการตอบรับจากผู้เชี่ยวชาญผ่านระบบ
                               </li>
                             </ul>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-col items-center gap-3">
                           <Link href="/profile/bounty" className="inline-flex items-center justify-center gap-2 bg-brand-black text-white text-[13px] font-bold px-6 py-3.5 rounded-full hover:bg-brand-red transition-all w-full shadow-lg shadow-black/10 active:scale-95">
                             เก็บใบการ์ด & ดูสถานะปัญหานี้ <i className="fa-solid fa-arrow-right text-[11px]" />
                           </Link>
                           <p className="text-[10px] text-gray-400 font-medium text-center">
                             *ใบการ์ดนี้ใช้เสมือนใบเชิญผู้เชี่ยวชาญสำหรับการแก้ปัญหาลำดับถัดไป
                           </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
