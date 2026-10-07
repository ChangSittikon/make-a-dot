"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingDot } from "@/components/flow/BreathingDot";
import { CardOption } from "@/components/flow/CardOption";
import { DynamicRewardInput, DynamicRewardValue } from "@/components/flow/inputs/DynamicRewardInput";
import { CascadingOptionsInput, CascadingValue } from "@/components/flow/inputs/CascadingOptionsInput";
import BountySummaryCard from "@/components/bounty/BountySummaryCard";
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
  const [createdBountyId, setCreatedBountyId] = useState<string | null>(null);
  const [userProfileId, setUserProfileId] = useState<string>("");

  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [industrySuggestions, setIndustrySuggestions] = useState<string[]>([]);
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);
  const [aiImpactScale, setAiImpactScale] = useState<string>("LOCAL");

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const currentStep = flowSteps[currentStepIndex];

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) setUserProfileId(data.user.id);
      })
      .catch(() => {});
  }, []);

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
    if (currentStep?.type === "MAGIC_SEARCH") {
      // 1. Layer 2 (Taxonomy): Derive suggestions synchronously from local taxonomy
      let instantList: string[] = [];
      
      const userIndustry = cascadeValue?.requesterIndustryName;
      if (userIndustry) {
        const matchedInd = taxonomyIndustries.find((ind) => 
          ind.name.toLowerCase().includes(userIndustry.toLowerCase()) || 
          userIndustry.toLowerCase().includes(ind.name.toLowerCase())
        );
        if (matchedInd && matchedInd.occupations && matchedInd.occupations.length > 0) {
          instantList = matchedInd.occupations.map((o) => o.name).slice(0, 6);
        }
      }

      if (instantList.length === 0 && answers.problemCategory) {
        const catMap: Record<string, string[]> = {
          "เงิน/ธุรกิจ": ["นักบัญชี", "ที่ปรึกษาธุรกิจ", "นักวิเคราะห์การเงิน", "นักการตลาด"],
          "งาน/อาชีพ": ["HR", "โค้ชพัฒนาตนเอง", "ที่ปรึกษาการงาน", "วิศวกร"],
          "สุขภาพ": ["แพทย์ทั่วไป", "นักกายภาพบำบัด", "พยาบาลวิชาชีพ", "นักโภชนาการ"],
          "ความสัมพันธ์": ["นักจิตวิทยาการปรึกษา", "ไลฟ์โค้ช", "ที่ปรึกษาครอบครัว"],
          "โปรเจกต์/ไอเดีย": ["Software Engineer", "UX/UI Designer", "Project Manager", "นักการตลาด"],
          "กฎหมาย": ["ทนายความ", "ที่ปรึกษากฎหมาย", "นิติกร"],
        };
        instantList = catMap[answers.problemCategory] || [];
      }

      if (instantList.length === 0) {
        instantList = ["ช่างเทคนิค/ซ่อมบำรุง", "ที่ปรึกษาธุรกิจ", "นักบัญชี", "ทนายความ", "Software Engineer", "นักการตลาด"];
      }

      setIndustrySuggestions(instantList);

      // 2. Layer 1 (AI): Fetch enriched suggestions in background
      const desc = answers.rawDescription || "";
      if (desc.trim().length >= 5) {
        setLoadingAiSuggestions(true);
        fetch("/api/flow/suggest-experts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rawDescription: desc,
            problemCategory: answers.problemCategory || null,
            requesterIndustryName: cascadeValue?.requesterIndustryName || null,
            requesterWorkTypeName: cascadeValue?.requesterWorkTypeName || null,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
              setAiSuggestions(data.suggestions);
            }
            if (data.impactScale) {
              setAiImpactScale(data.impactScale);
            }
          })
          .catch((err) => {
            console.warn("[suggest-experts] Background AI fetch error:", err);
          })
          .finally(() => {
            setLoadingAiSuggestions(false);
          });
      }
    }
  }, [currentStep?.type, cascadeValue?.requesterIndustryName, cascadeValue?.requesterWorkTypeName, answers.rawDescription, answers.problemCategory, taxonomyIndustries]);

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
      payload.requesterWorkTypeName = cascadeValue.requesterWorkTypeName;
      payload.requesterIndustryName = cascadeValue.requesterIndustryName;
    }

    if (selectedOccupations.length > 0) {
      payload.occupationId = selectedOccupations[0].id;
      payload.selectedOccupations = selectedOccupations;
    }
    if (selectedSkills.length > 0) {
      payload.skillTags = selectedSkills.map((s) => s.id);
      payload.selectedSkills = selectedSkills;
    }

    // Include AI-assessed impact scale
    payload.impactScale = aiImpactScale;

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
          if (data.problemNodeId) {
            setCreatedBountyId(data.problemNodeId);
          }
          if (data.userProfileId) {
            setUserProfileId(data.userProfileId);
          }
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

  const handleEdit = () => {
    setIsSubmitting(false);
    setShowSummary(false);
    setUniverseDots((prev) => prev.map((dot) => ({ ...dot, opacity: Math.random() * 0.3 + 0.1 })));
    setCurrentStepIndex(flowSteps.length > 0 ? flowSteps.length - 1 : 0);
    setShowInput(true);
  };

  const handleBack = () => {
    if (isSubmitting) {
      handleEdit();
      return;
    }
    if (currentStepIndex > 0) {
      setShowInput(false);
      setCurrentStepIndex((prev) => prev - 1);
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const onPopState = () => {
      if (isSubmitting) {
        handleEdit();
      } else if (currentStepIndex > 0) {
        setShowInput(false);
        setCurrentStepIndex((prev) => prev - 1);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isSubmitting, currentStepIndex]);

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
              
              {(filteredMatches.length > 0 || (searchTerm.trim() && filteredMatches.length === 0)) && (
                <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 max-h-56 overflow-y-auto">
                  {filteredMatches.length > 0 ? (
                    <>
                      <div className="p-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">ผลการค้นหาจากฐานข้อมูล</div>
                      {filteredMatches.map((m, idx) => (
                        <div key={idx} onClick={() => selectMatch(m)} className="px-4 py-3 hover:bg-red-50/50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-b-0 transition-colors">
                          <div className="flex items-center gap-2">
                            <i className={`fa-solid ${m.type === "occupation" ? "fa-briefcase text-brand-red" : "fa-bolt text-brand-red"} text-xs w-4 text-center`} />
                            <span className="text-sm font-medium text-gray-800">{m.item.name}</span>
                            <span className="text-xs text-gray-400 font-light">({m.parentName})</span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div 
                      onClick={() => {
                        const customSkill = { id: `custom-${Date.now()}`, name: searchTerm.trim() };
                        setSelectedSkills((prev) => [...prev, customSkill]);
                        setSearchTerm("");
                      }}
                      className="px-4 py-3 hover:bg-red-50/50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <i className="fa-solid fa-plus text-brand-red text-xs w-4 text-center" />
                        <span className="text-sm font-medium text-gray-800">เพิ่ม "{searchTerm.trim()}" เป็นแท็กใหม่</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 2-Layer Suggestions: Layer 1 (AI Specific) + Layer 2 (Industry Taxonomy) */}
            <div className="mt-2.5 w-full space-y-3.5">
              
              {/* ชั้นที่ 1: วิเคราะห์ตรงกับปัญหาที่คุณระบุ (AI Specific) */}
              {(aiSuggestions.length > 0 || loadingAiSuggestions) && (
                <div className="bg-red-50/20 border border-red-100/60 rounded-2xl p-3">
                  <div className="text-[11px] font-semibold text-gray-500 flex items-center justify-between mb-2 select-none px-1">
                    <span className="flex items-center gap-1.5 text-gray-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse inline-block" />
                      วิเคราะห์ตรงกับปัญหาที่คุณระบุ
                    </span>
                    {loadingAiSuggestions && (
                      <span className="text-[10px] text-gray-400 font-normal">กำลังวิเคราะห์...</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {aiSuggestions.map((sug, idx) => {
                      const isSelected =
                        selectedOccupations.some((o) => o.name.toLowerCase() === sug.toLowerCase()) ||
                        selectedSkills.some((s) => s.name.toLowerCase() === sug.toLowerCase());

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleSuggestion(sug)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium active:scale-95 transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-brand-red text-white shadow-xs font-semibold"
                              : "bg-white border border-gray-200/80 text-gray-700 hover:border-brand-red hover:text-brand-red shadow-2xs"
                          }`}
                        >
                          {isSelected ? (
                            <i className="fa-solid fa-check text-[10px] text-white" />
                          ) : (
                            <i className="fa-solid fa-plus text-[9px] text-gray-400" />
                          )}
                          <span>{sug}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ชั้นที่ 2: อาชีพแนะนำตามสายงาน (Industry / Taxonomy) */}
              {industrySuggestions.length > 0 && (
                <div className="bg-gray-50/70 border border-gray-200/60 rounded-2xl p-3">
                  <div className="text-[11px] font-semibold text-gray-500 flex items-center justify-between mb-2 select-none px-1">
                    <span className="flex items-center gap-1.5 text-gray-800">
                      <i className="fa-solid fa-briefcase text-[10px] text-gray-400" />
                      {cascadeValue?.requesterIndustryName 
                        ? `อาชีพในสายงาน${cascadeValue.requesterIndustryName}` 
                        : "อาชีพแนะนำตามหมวดหมู่"}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono">TAXONOMY</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {industrySuggestions.map((sug, idx) => {
                      const isSelected =
                        selectedOccupations.some((o) => o.name.toLowerCase() === sug.toLowerCase()) ||
                        selectedSkills.some((s) => s.name.toLowerCase() === sug.toLowerCase());

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleSuggestion(sug)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium active:scale-95 transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-gray-900 text-white shadow-xs font-semibold"
                              : "bg-white border border-gray-200/80 text-gray-700 hover:border-gray-900 hover:text-gray-900 shadow-2xs"
                          }`}
                        >
                          {isSelected ? (
                            <i className="fa-solid fa-check text-[10px] text-white" />
                          ) : (
                            <i className="fa-solid fa-plus text-[9px] text-gray-400" />
                          )}
                          <span>{sug}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
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
          <button 
            type="button"
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 active:scale-95 transition-all cursor-pointer shadow-2xs"
            title="ย้อนกลับ"
          >
            <i className="fa-solid fa-arrow-left text-gray-500 text-sm" />
          </button>
          <div className="text-xs font-bold text-gray-400">
            {showSummary ? "ใบสรุปงาน" : isSubmitting ? "กำลังเชื่อมโยง..." : `STEP ${currentStepIndex + 1} OF ${flowSteps.length}`}
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
                <div className={`mb-6 mt-4 w-full transition-all duration-500 ${showSummary ? 'text-left' : 'text-center flex flex-col items-center'}`}>
                  <div className={`h-8 mb-3 flex items-end ${showSummary ? 'justify-start' : 'justify-center'}`}>
                    <motion.div 
                      layoutId="nong-dot" 
                      transition={{ layout: { type: "spring", stiffness: 60, damping: 11, mass: 1.2 } }} 
                      className="inline-flex items-center justify-center z-50"
                    >
                      <BreathingDot size={showSummary ? 18 : 28} />
                    </motion.div>
                  </div>
                  <h2 className={`font-bold text-gray-900 leading-snug transition-all duration-500 ${showSummary ? 'text-xl' : 'text-2xl'}`}>
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-5 bg-brand-red ml-1 animate-[blink_1s_infinite]" />}
                  </h2>
                </div>

                {showSummary && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                    className="w-full text-left"
                  >
                    <BountySummaryCard
                      bountyId={createdBountyId}
                      statusLabel="พร้อมส่งตัว"
                      rawDescription={answers.rawDescription}
                      requesterProfileId={userProfileId || createdBountyId || "USER-01"}
                      requesterWorkTypeName={cascadeValue?.requesterWorkTypeName}
                      requesterIndustryName={cascadeValue?.requesterIndustryName}
                      targetOccupations={selectedOccupations}
                      targetSkills={selectedSkills}
                      rewardText={
                        rewardValue?.bountyType === "CASH" 
                          ? `฿${(rewardValue.bountyPrizeSatang / 100).toLocaleString()}` 
                          : rewardValue?.bountyDescription || "ตามตกลง"
                      }
                      impactScale={aiImpactScale}
                      isRequester={true}
                      actions={
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={handleEdit}
                            className="inline-flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-[13px] font-bold px-4 py-3.5 rounded-2xl hover:bg-gray-200 transition-all active:scale-95 cursor-pointer shrink-0"
                          >
                            <i className="fa-solid fa-pen-to-square text-[11px] text-gray-500" />
                            <span>แก้ไข</span>
                          </button>

                          <Link 
                            href={createdBountyId ? `/profile/bounty/${createdBountyId}` : "/profile/bounty/manage"} 
                            className="inline-flex items-center justify-center gap-1.5 bg-brand-red text-white text-[13px] font-bold px-4 py-3.5 rounded-2xl hover:bg-red-600 transition-all flex-1 shadow-lg shadow-red-500/25 active:scale-95 cursor-pointer text-center whitespace-nowrap"
                          >
                            <span>ยืนยันข้อมูลเข้าระบบ</span>
                            <i className="fa-solid fa-arrow-right text-[11px]" />
                          </Link>
                        </div>
                      }
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
