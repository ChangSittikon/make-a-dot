"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingDot } from "@/components/flow/BreathingDot";
import { CardOption } from "@/components/flow/CardOption";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Step {
  id: string;
  type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'OPTIONS' | 'MAGIC_SEARCH';
  question: string;
  options?: { label: string; value: string; icon?: string }[];
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
  type: 'occupation' | 'skill';
  item: TaxonomyItem;
  parentName: string;
  occupationId?: string;
}

const panelVariants = {
  enter: { opacity: 0, y: 30, scale: 0.95 },
  active: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

interface FloatingDot {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  active: boolean;
}

export function BountyFlowApp() {
  const router = useRouter();
  const [flowSteps, setFlowSteps] = useState<Step[]>([]);
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Magic Search State
  const [taxonomyIndustries, setTaxonomyIndustries] = useState<IndustryTaxonomy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOccupations, setSelectedOccupations] = useState<TaxonomyItem[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<TaxonomyItem[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<SearchMatch[]>([]);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Quantum Universe State
  const [universeDots, setUniverseDots] = useState<FloatingDot[]>([]);
  const [dotPosition, setDotPosition] = useState<'center' | 'text'>('center');

  // Fetch flow steps from API
  useEffect(() => {
    fetch('/api/bounty-flow', { cache: 'no-store' })
      .then(res => res.json())
      .then((data: Step[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setFlowSteps(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingSteps(false));
  }, []);

  // Fetch taxonomy for MAGIC_SEARCH
  useEffect(() => {
    fetch('/api/taxonomy')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.industries)) {
          setTaxonomyIndustries(data.industries);
        }
      })
      .catch(err => console.error("Failed to load taxonomy:", err));
  }, []);

  // Handle Magic Search Filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMatches([]);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const matches: SearchMatch[] = [];

    taxonomyIndustries.forEach(ind => {
      ind.occupations?.forEach(occ => {
        if (occ.name.toLowerCase().includes(term)) {
          matches.push({
            type: 'occupation',
            item: { id: occ.id, name: occ.name },
            parentName: ind.name,
            occupationId: occ.id
          });
        }
        occ.skillTags?.forEach(skill => {
          if (skill.name.toLowerCase().includes(term)) {
            matches.push({
              type: 'skill',
              item: { id: skill.id, name: skill.name },
              parentName: occ.name,
              occupationId: occ.id
            });
          }
        });
      });
    });

    setFilteredMatches(matches.slice(0, 8));
  }, [searchTerm, taxonomyIndustries]);

  // Initialize Universe
  useEffect(() => {
    const dots = Array.from({length: 40}).map((_, i) => ({
      id: `dot-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 3,
      opacity: Math.random() * 0.3 + 0.1,
      color: '#9CA3AF',
      active: true
    }));
    setUniverseDots(dots);
  }, []);

  const currentStep = flowSteps[currentStepIndex];

  // Typing effect
  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setShowInput(false);
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setShowInput(true);
        setDotPosition('text');
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Trigger typing when step changes
  useEffect(() => {
    if (currentStep && !isSubmitting && !loadingSteps) {
      setInputValue("");
      const timer = setTimeout(() => {
        typeText(currentStep.question);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isSubmitting, typeText, loadingSteps]);

  // Focus input automatically after typing finishes
  useEffect(() => {
    if (showInput && inputRef.current && currentStep?.type !== 'OPTIONS' && currentStep?.type !== 'MAGIC_SEARCH') {
      inputRef.current.focus();
    }
  }, [showInput, currentStep]);

  const handleNext = async (valueOverride?: string) => {
    if (isTyping) return;

    let val = valueOverride !== undefined ? valueOverride : inputValue;
    
    // For MAGIC_SEARCH, check if tags selected or input typed
    if (currentStep.type === 'MAGIC_SEARCH') {
      if (selectedOccupations.length === 0 && selectedSkills.length === 0 && !val.trim()) {
        alert("กรุณาเลือกหรือค้นหาอาชีพ/ทักษะอย่างน้อย 1 รายการ");
        return;
      }
      if (!val.trim()) {
        const allTags = [...selectedOccupations.map(o => o.name), ...selectedSkills.map(s => s.name)];
        val = allTags.join(', ');
      }
    } else {
      if (!val.trim()) {
        alert("กรุณาระบุข้อมูล");
        return;
      }
    }

    const fieldKey = currentStep.field || 'answer';
    const newAnswers = { ...answers, [fieldKey]: val };
    setAnswers(newAnswers);

    // QUANTUM COLLAPSE ANIMATION
    setUniverseDots(prevDots => {
      const activeDots = prevDots.filter(d => d.active);
      const killCount = Math.floor(activeDots.length * 0.2); 
      let killed = 0;
      return prevDots.map((dot) => {
        if (!dot.active) return dot;
        if (killed < killCount && Math.random() > 0.5) {
          killed++;
          return { ...dot, active: false, opacity: 0 };
        }
        const dx = 50 - dot.x;
        const dy = 25 - dot.y;
        return {
          ...dot,
          x: dot.x + dx * 0.15,
          y: dot.y + dy * 0.15,
          opacity: Math.min(0.6, dot.opacity + 0.1),
          color: Math.random() > 0.8 ? '#FF1A1A' : dot.color
        };
      });
    });

    if (currentStepIndex < flowSteps.length - 1) {
      setShowInput(false);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      submitBounty(newAnswers);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep.type !== 'TEXTAREA') {
      handleNext();
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericVal = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(numericVal);
  };

  const selectMatch = (match: SearchMatch) => {
    if (match.type === 'occupation') {
      if (!selectedOccupations.some(o => o.id === match.item.id)) {
        setSelectedOccupations(prev => [...prev, match.item]);
      }
    } else {
      if (!selectedSkills.some(s => s.id === match.item.id)) {
        setSelectedSkills(prev => [...prev, match.item]);
      }
    }
    setSearchTerm("");
    setFilteredMatches([]);
  };

  const removeOccupation = (id: string) => {
    setSelectedOccupations(prev => prev.filter(o => o.id !== id));
  };

  const removeSkill = (id: string) => {
    setSelectedSkills(prev => prev.filter(s => s.id !== id));
  };

  const submitBounty = async (finalAnswers: Record<string, string>) => {
    setShowInput(false);
    setIsSubmitting(true);
    setDisplayedText("");
    typeText("กำลังเชื่อมโยงปัญหานี้เข้าสู่ Quantum Network...");

    // Final collapse animation
    setUniverseDots(prev => prev.map(dot => ({ ...dot, opacity: 0, scale: 0 })));

    const title = finalAnswers.title || finalAnswers.questTitle || finalAnswers.rawDescription?.substring(0, 50) || 'Untitled Quest';
    const description = finalAnswers.rawDescription || finalAnswers.description || '';
    const bountyPrize = finalAnswers.bountyPrize || '0';
    const resourceType = finalAnswers.resourceType || 'CASH';

    const payload = {
      title,
      description,
      rawDescription: finalAnswers.rawDescription,
      bountyPrize,
      resourceType,
      resourceAmount: bountyPrize,
      occupationId: selectedOccupations[0]?.id || undefined,
      skillTags: selectedSkills.map(s => s.id),
      entityType: finalAnswers.entityType || undefined,
      primaryGap: finalAnswers.primaryGap || undefined,
      urgencyState: finalAnswers.urgencyState || undefined
    };

    try {
      const res = await fetch('/api/bounties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setTimeout(() => {
          router.push('/profile/bounty');
        }, 1500);
      } else {
        alert("เกิดข้อผิดพลาด: " + data.error);
        setIsSubmitting(false);
      }
    } catch (e) {
      alert("Network Error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10 transition-colors duration-500">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <header className="px-5 py-4 flex items-center justify-between z-50 sticky top-0 bg-transparent">
          <Link href="/" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <i className="fa-solid fa-arrow-left text-gray-600"></i>
          </Link>
          <div className="text-sm font-bold text-gray-500">
            {isSubmitting ? 'FINALIZING...' : `STEP ${currentStepIndex + 1} OF ${flowSteps.length}`}
          </div>
        </header>

        {/* QUANTUM UNIVERSE CANVAS */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {universeDots.map(dot => (
            <motion.div
              key={dot.id}
              initial={false}
              animate={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                opacity: dot.opacity,
                scale: dot.active ? 1 : 0
              }}
              transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
              className="absolute rounded-full"
              style={{
                width: dot.size,
                height: dot.size,
                backgroundColor: dot.color,
                transform: 'translate(-50%, -50%)',
                boxShadow: dot.color === '#FF1A1A' ? '0 0 12px rgba(255,26,26,0.15)' : 'none'
              }}
            />
          ))}
          
          {/* Central User Dot */}
          {dotPosition === 'center' && (
            <motion.div 
              layoutId="nong-dot"
              className="absolute left-[50%] top-[25%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50"
            >
              <BreathingDot size={24} />
            </motion.div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 mt-[20%]">
          <AnimatePresence mode="wait">
            {!isSubmitting ? (
              <motion.div
                key={currentStep?.id || 'empty'}
                variants={panelVariants}
                initial="enter"
                animate="active"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 px-6 pb-24 flex flex-col justify-end"
              >
                {/* Question */}
                <div className="mb-6 min-h-[80px] relative">
                  <div className="h-8 mb-3 flex items-end">
                    {dotPosition === 'text' && (
                      <motion.div 
                        layoutId="nong-dot"
                        transition={{ layout: { type: "spring", stiffness: 60, damping: 11, mass: 1.2 } }}
                        className="inline-flex items-center justify-center z-50"
                      >
                        <BreathingDot size={18} />
                      </motion.div>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                    {displayedText}
                    {isTyping && (
                      <span className="inline-block w-2 h-5 bg-brand-red ml-1 animate-[blink_1s_infinite]" />
                    )}
                  </h1>
                </div>

                {/* Input Elements */}
                <div className="flex flex-col gap-3 min-h-[160px]">
                  <AnimatePresence>
                    {showInput && currentStep?.type === 'OPTIONS' && currentStep.options?.map((opt, i) => (
                      <motion.div
                        key={opt.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
                      >
                        <CardOption
                          label={opt.label}
                          icon={opt.icon || undefined}
                          onClick={() => handleNext(opt.value)}
                        />
                      </motion.div>
                    ))}
                    
                    {showInput && currentStep?.type !== 'OPTIONS' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="w-full flex flex-col gap-2"
                      >
                        {/* MAGIC SEARCH (DOT017 Taxonomy Component) */}
                        {currentStep.type === 'MAGIC_SEARCH' ? (
                          <div className="w-full flex flex-col gap-2">
                            {/* Selected Chips */}
                            {(selectedOccupations.length > 0 || selectedSkills.length > 0) && (
                              <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-2xl max-h-28 overflow-y-auto">
                                {selectedOccupations.map(occ => (
                                  <span
                                    key={occ.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-brand-red/30 text-brand-red rounded-full text-xs font-medium shadow-xs"
                                  >
                                    <i className="fa-solid fa-briefcase text-[10px]"></i>
                                    {occ.name}
                                    <button
                                      type="button"
                                      onClick={() => removeOccupation(occ.id)}
                                      className="text-brand-red/60 hover:text-brand-red ml-0.5"
                                    >
                                      <i className="fa-solid fa-xmark text-[10px]"></i>
                                    </button>
                                  </span>
                                ))}
                                {selectedSkills.map(skill => (
                                  <span
                                    key={skill.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-xs font-medium shadow-xs"
                                  >
                                    <i className="fa-solid fa-bolt text-[10px] text-amber-500"></i>
                                    {skill.name}
                                    <button
                                      type="button"
                                      onClick={() => removeSkill(skill.id)}
                                      className="text-gray-400 hover:text-gray-700 ml-0.5"
                                    >
                                      <i className="fa-solid fa-xmark text-[10px]"></i>
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Search Input Box */}
                            <div className="relative w-full">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <i className="fa-solid fa-wand-magic-sparkles text-sm text-brand-red"></i>
                              </div>
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (filteredMatches.length > 0) {
                                      selectMatch(filteredMatches[0]);
                                    } else {
                                      handleNext(searchTerm);
                                    }
                                  }
                                }}
                                className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-11 pr-14 py-4 text-gray-800 text-base focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm"
                                placeholder="ค้นหาอาชีพ หรือทักษะที่ต้องการ..."
                              />
                              <button
                                onClick={() => handleNext()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-xl hover:bg-red-700 transition shadow-sm"
                              >
                                <i className="fa-solid fa-arrow-up"></i>
                              </button>

                              {/* Search Results Dropdown */}
                              {filteredMatches.length > 0 && (
                                <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-56 overflow-y-auto">
                                  <div className="p-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/70">
                                    ผลการค้นหา Taxonomy (DOT017)
                                  </div>
                                  {filteredMatches.map((m, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => selectMatch(m)}
                                      className="px-4 py-2.5 hover:bg-red-50/50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-b-0 transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        <i className={`fa-solid ${m.type === 'occupation' ? 'fa-briefcase text-brand-red' : 'fa-bolt text-amber-500'} text-xs w-4 text-center`}></i>
                                        <span className="text-sm font-medium text-gray-800">{m.item.name}</span>
                                        <span className="text-xs text-gray-400">({m.parentName})</span>
                                      </div>
                                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${m.type === 'occupation' ? 'bg-red-100 text-brand-red' : 'bg-amber-100 text-amber-800'}`}>
                                        {m.type === 'occupation' ? 'อาชีพ' : 'ทักษะ'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* STANDARD INPUTS: TEXTAREA, NUMBER, TEXT */
                          <div className="relative w-full">
                            {currentStep.type === 'TEXTAREA' ? (
                              <textarea 
                                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 pr-14 text-gray-800 text-base focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm min-h-[140px] resize-none leading-relaxed"
                                placeholder="พิมพ์ข้อความที่ต้องการอย่างละเอียด..."
                              />
                            ) : currentStep.type === 'NUMBER' ? (
                              <div className="relative w-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 pointer-events-none font-bold text-lg select-none">
                                  <span>฿</span>
                                </div>
                                <input 
                                  ref={inputRef as React.RefObject<HTMLInputElement>}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  value={inputValue}
                                  onChange={handleNumberChange}
                                  onKeyDown={handleKeyDown}
                                  className="w-full bg-white border-2 border-gray-200 rounded-2xl pl-10 pr-14 py-4 text-gray-800 text-lg font-semibold focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm"
                                  placeholder="ระบุตัวเลขงบประมาณ เช่น 50000"
                                />
                              </div>
                            ) : (
                              <input 
                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 pr-14 py-4 text-gray-800 text-lg focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm"
                                placeholder="พิมพ์คำตอบที่นี่..."
                              />
                            )}
                            <button 
                              onClick={() => handleNext()}
                              className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-xl hover:bg-red-700 transition shadow-sm"
                            >
                              <i className="fa-solid fa-arrow-up"></i>
                            </button>
                          </div>
                        )}

                        {/* Suggestion Chips */}
                        {currentStep.suggestions && currentStep.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {currentStep.suggestions.map((sug, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (currentStep.type === 'TEXTAREA') {
                                    setInputValue((prev) => prev ? prev + '\n' + sug : sug);
                                  } else if (currentStep.type === 'MAGIC_SEARCH') {
                                    setSearchTerm(sug);
                                  } else {
                                    setInputValue(sug);
                                  }
                                }}
                                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="submitting"
                variants={panelVariants}
                initial="enter"
                animate="active"
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 px-6 py-6 pb-24 flex flex-col justify-center items-center"
              >
                <div className="mb-6 mt-8 text-center flex flex-col items-center">
                  <motion.div 
                    layoutId="nong-dot"
                    className="inline-flex items-center justify-center z-50 mb-8"
                  >
                    <BreathingDot size={32} color="red" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-5 bg-brand-red ml-1 animate-[blink_1s_infinite]" />}
                  </h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
