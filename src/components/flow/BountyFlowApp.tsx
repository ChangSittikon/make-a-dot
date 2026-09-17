"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingDot } from "@/components/flow/BreathingDot";
import { CardOption } from "@/components/flow/CardOption";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Step {
  id: string;
  type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'OPTIONS';
  question: string;
  options?: { label: string; value: string; icon?: string }[];
  field: string;
  suggestions?: string[];
}

const FLOW_STEPS: Step[] = [
  {
    id: 'step-1',
    type: 'TEXT',
    question: 'บอกเราหน่อย ปัญหาหรือเป้าหมายที่คุณต้องการคนช่วยคืออะไร?',
    field: 'title',
    suggestions: ['ตามหาโปรแกรมเมอร์ทำแอป React', 'หาคนช่วยทำบัญชีรายรับรายจ่าย', 'ตามหานักร้องนำวงอินดี้', 'หาคนตัดต่อวิดีโอ YouTube']
  },
  {
    id: 'step-2',
    type: 'TEXTAREA',
    question: 'ขอรายละเอียดเพิ่มเติมอีกนิด เพื่อให้เราหาฮีโร่ที่ใช่ที่สุด',
    field: 'description',
    suggestions: ['รายละเอียดงาน: \nเป้าหมาย: \nสิ่งที่คาดหวัง: ']
  },
  {
    id: 'step-magic',
    type: 'TEXT',
    question: 'คุณกำลังมองหาคนสายไหน? (เช่น โปรแกรมเมอร์, ช่างภาพ, กราฟิก)',
    field: 'magicSearch',
    suggestions: ['Programmer', 'Graphic Designer', 'Photographer', 'Marketer', 'Accountant', 'Singer', 'Producer']
  },
  {
    id: 'step-3',
    type: 'OPTIONS',
    question: 'คุณเตรียมค่าตอบแทนรูปแบบไหนไว้ให้?',
    field: 'resourceType',
    options: [
      { label: 'เงินสด (CASH)', value: 'CASH', icon: 'fa-solid fa-money-bill-wave' },
      { label: 'แลกเปลี่ยนแรง/สกิล (SWAP)', value: 'LABOR', icon: 'fa-solid fa-handshake-angle' },
      { label: 'ส่วนแบ่งรายได้ (EQUITY)', value: 'EQUITY', icon: 'fa-solid fa-chart-pie' }
    ]
  },
  {
    id: 'step-4',
    type: 'NUMBER',
    question: 'ประเมินมูลค่าเป็นตัวเลขกลมๆ (บาท) ประมาณเท่าไหร่ครับ?',
    field: 'bountyPrize',
    suggestions: ['1000', '5000', '10000', '30000', '50000']
  }
];

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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Quantum Universe State
  const [universeDots, setUniverseDots] = useState<FloatingDot[]>([]);
  const [dotPosition, setDotPosition] = useState<'center' | 'text'>('center');

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

  const currentStep = FLOW_STEPS[currentStepIndex];

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
    if (currentStep && !isSubmitting) {
      setInputValue("");
      const timer = setTimeout(() => {
        typeText(currentStep.question);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isSubmitting, typeText]);

  // Focus input automatically after typing finishes
  useEffect(() => {
    if (showInput && inputRef.current && currentStep?.type !== 'OPTIONS') {
      inputRef.current.focus();
    }
  }, [showInput, currentStep]);

  const handleNext = async (valueOverride?: string) => {
    if (isTyping) return;
    const val = valueOverride !== undefined ? valueOverride : inputValue;
    
    // Allow empty answers? Let's require them.
    if (!val.trim()) {
      alert("กรุณาระบุข้อมูล");
      return;
    }

    const newAnswers = { ...answers, [currentStep.field]: val };
    setAnswers(newAnswers);

    // QUANTUM COLLAPSE ANIMATION (Minimalist)
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

    if (currentStepIndex < FLOW_STEPS.length - 1) {
      setShowInput(false);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Final Step! Submit to API
      submitBounty(newAnswers);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep.type !== 'TEXTAREA') {
      handleNext();
    }
  };

  const submitBounty = async (finalAnswers: Record<string, string>) => {
    setShowInput(false);
    setIsSubmitting(true);
    setDisplayedText("");
    typeText("กำลังเชื่อมโยงปัญหานี้เข้าสู่ Quantum Network...");

    // Final collapse animation
    setUniverseDots(prev => prev.map(dot => ({ ...dot, opacity: 0, scale: 0 })));

    const payload = {
      title: finalAnswers.title,
      description: finalAnswers.description,
      bountyPrize: finalAnswers.bountyPrize,
      resourceType: finalAnswers.resourceType,
      resourceAmount: finalAnswers.bountyPrize, // Same for simplicity
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
            {isSubmitting ? 'FINALIZING...' : `STEP ${currentStepIndex + 1} OF ${FLOW_STEPS.length}`}
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
                className="flex-1 px-6 pb-12 flex flex-col justify-end"
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
                        <div className="relative w-full">
                          {currentStep.type === 'TEXTAREA' ? (
                            <textarea 
                              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-gray-800 text-lg focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm min-h-[120px] resize-none"
                              placeholder="พิมพ์ข้อความที่ต้องการ..."
                            />
                          ) : (
                            <input 
                              ref={inputRef as React.RefObject<HTMLInputElement>}
                              type={currentStep.type === 'NUMBER' ? 'number' : 'text'}
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-full bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-gray-800 text-lg focus:outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all shadow-sm"
                              placeholder={currentStep.type === 'NUMBER' ? "เช่น 50000" : "พิมพ์คำตอบที่นี่..."}
                            />
                          )}
                          <button 
                            onClick={() => handleNext()}
                            className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-xl hover:bg-red-700 transition"
                          >
                            <i className="fa-solid fa-arrow-up"></i>
                          </button>
                        </div>

                        {currentStep.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {currentStep.suggestions.map((sug, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (currentStep.type === 'TEXTAREA') {
                                    setInputValue((prev) => prev ? prev + '\n' + sug : sug);
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
