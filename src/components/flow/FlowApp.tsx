"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingDot } from "@/components/flow/BreathingDot";
import { CardOption } from "@/components/flow/CardOption";
import { ResultCard } from "@/components/flow/ResultCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomTabBar } from "@/components/shared/BottomTabBar";

interface Option {
  id: string;
  label: string;
  icon?: string | null;
  targetNodeId?: string | null;
  vectorWeight?: string | null;
}

interface Node {
  id: string;
  type: string;
  question: string;
  options: Option[];
}

interface Industry {
  id: string;
  name: string;
  domainDirector?: {
    displayName: string;
    avatarUrl: string | null;
  };
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

const dummyResults = [
  { name: "คุณเอ (Producer)", tags: "พร้อมรับงาน, มีสตูดิโอ", avatarUrl: "https://i.pravatar.cc/150?img=11", verified: true },
  { name: "ทีม ABC", tags: "รับจ้างผลิตวิดีโอ", avatarUrl: "https://i.pravatar.cc/150?img=47" },
];

export function FlowApp({ session, children }: { session: any, children?: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quantum Universe State
  const [universeDots, setUniverseDots] = useState<FloatingDot[]>([]);
  const [dotPosition, setDotPosition] = useState<'center' | 'text'>('center');

  // Initialize Universe
  useEffect(() => {
    const dots = Array.from({length: 60}).map((_, i) => ({
      id: `dot-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 3, // 3px to 8px
      opacity: Math.random() * 0.4 + 0.1,
      color: '#9CA3AF', // Gray-400
      active: true
    }));
    setUniverseDots(dots);
  }, []);

  // Fetch logic tree on mount
  useEffect(() => {
    fetch('/api/industries', { cache: 'no-store' })
      .then(res => res.json())
      .then(inds => {
        if (inds.length > 0) {
          setIndustry(inds[0]);
          return fetch(`/api/flow/${inds[0].id}`, { cache: 'no-store' });
        }
        throw new Error("No industries found");
      })
      .then(res => res.json())
      .then((data: Node[]) => {
        setNodes(data);
        const startNode = data.find(n => n.type === 'START') || data[0];
        if (startNode) {
          setCurrentNodeId(startNode.id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentNode = nodes.find(n => n.id === currentNodeId);

  // Typing effect
  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setShowOptions(false);
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setShowOptions(true);
        setDotPosition('text');
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Trigger typing when current node changes
  useEffect(() => {
    if (currentNode && !showResults) {
      const timer = setTimeout(() => {
        typeText(currentNode.question || "...");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentNode, showResults, typeText]);

  const router = useRouter();

  const handleSelect = useCallback(
    (option: Option) => {
      if (isTyping) return;

      let routeUrl: string | null = null;
      if (option.vectorWeight) {
        try {
          const parsed = JSON.parse(option.vectorWeight);
          if (parsed.url) routeUrl = parsed.url;
        } catch (e) {}
      }

      const targetNode = nodes.find(n => n.id === option.targetNodeId);
      const isEnd = routeUrl ? true : (!targetNode || targetNode.type === 'RESULT' || !option.targetNodeId);

      // QUANTUM COLLAPSE ANIMATION (Minimalist)
      setUniverseDots(prevDots => {
        const activeDots = prevDots.filter(d => d.active);
        const killCount = Math.floor(activeDots.length * 0.3); // Kill 30% smoothly
        let killed = 0;

        return prevDots.map((dot, index) => {
          if (!dot.active) return dot;
          
          if (!isEnd && killed < killCount && Math.random() > 0.5) {
            killed++;
            return { ...dot, active: false, opacity: 0 };
          }
          
          if (isEnd) {
            // FADE OUT UNIVERSE DOTS (Clean collapse)
            return {
              ...dot,
              opacity: 0,
              scale: 0,
            };
          } else {
            // GENTLE MOVE CLOSER
            const dx = 50 - dot.x;
            const dy = 25 - dot.y;
            return {
              ...dot,
              x: dot.x + dx * 0.25,
              y: dot.y + dy * 0.25,
              opacity: Math.min(0.6, dot.opacity + 0.1),
              color: Math.random() > 0.9 ? '#FF1A1A' : dot.color
            };
          }
        });
      });

      if (isEnd) {
        setShowOptions(false);
        setTimeout(() => {
          if (routeUrl) {
            router.push(routeUrl);
          } else {
            setDisplayedText("");
            setShowResults(true);
            typeText(targetNode?.question || "เราพบ 2 โอกาสที่ตรงกับทิศทางของคุณที่สุด");
          }
        }, 600);
      } else {
        setShowOptions(false);
        if (targetNode) setCurrentNodeId(targetNode.id);
      }
    },
    [isTyping, nodes, typeText]
  );

  const resetFlow = () => {
    const startNode = nodes.find(n => n.type === 'START') || nodes[0];
    setCurrentNodeId(startNode?.id || null);
    setShowResults(false);
    setShowOptions(false);
    
    // Reset Universe
    setUniverseDots(prev => prev.map((dot, i) => ({
      ...dot,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.1,
      color: '#9CA3AF',
      active: true
    })));
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 font-prompt">กำลังสร้างจักรวาล...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10 transition-colors duration-500">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <header className="px-5 py-4 flex items-center justify-between z-50 sticky top-0 bg-transparent">
          <div className="flex items-center gap-2">
            <span className="font-black text-gray-900 tracking-tighter text-xl">MAKE A DOT</span>
          </div>
          <div className="flex items-center gap-3">
            {children}
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
        <div className="flex-1 flex flex-col relative z-10 mt-[35%]">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentNode?.id || 'empty'}
                variants={panelVariants}
                initial="enter"
                animate="active"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 px-6 pb-24 flex flex-col justify-end"
              >
                {/* Question */}
                <div className="mb-8 min-h-[80px] relative">
                  <div className="h-8 mb-3 flex items-end">
                    {dotPosition === 'text' && (
                      <motion.div 
              layoutId="nong-dot"
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 60,
                  damping: 11,
                  mass: 1.2
                }
              }}
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

                {/* Options */}
                <div className="flex flex-col gap-3 min-h-[200px]">
                  <AnimatePresence>
                    {showOptions && currentNode?.options.map((opt, i) => (
                      <motion.div
                        key={opt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
                      >
                        <CardOption
                          label={opt.label}
                          icon={opt.icon || undefined}
                          onClick={() => handleSelect(opt)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                variants={panelVariants}
                initial="enter"
                animate="active"
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="flex-1 px-6 py-6 pb-24 overflow-y-auto"
              >
                <div className="mb-6 mt-8 text-center flex flex-col items-center">
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-5 bg-brand-red ml-1 animate-[blink_1s_infinite]" />}
                  </h2>
                  {!isTyping && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-gray-500 text-sm"
                    >
                      พร้อมให้คุณเริ่มต้นร่วมงาน
                    </motion.p>
                  )}
                </div>

                {!isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    
                    {dummyResults.map((res, i) => (
                      <ResultCard
                        key={i}
                        index={i}
                        name={res.name}
                        tags={res.tags}
                        avatarUrl={res.avatarUrl}
                        verified={res.verified}
                      />
                    ))}
                    <button 
                      onClick={resetFlow}
                      className="mt-6 text-sm text-gray-500 font-medium hover:text-brand-red transition flex justify-center w-full"
                    >
                      เริ่มค้นหาใหม่
                    </button>
                    
                    {/* The 3 Equal Founders (Smart & Minimal) */}
                    <div className="flex items-end justify-center gap-6 mt-10 mb-2 h-16 pointer-events-none">
                      
                      {/* Black Dot */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        className="inline-flex items-center justify-center z-40 mb-1"
                      >
                        <BreathingDot size={20} color="black" delay={0.15} />
                      </motion.div>
                      
                      {/* Nong Dot (Center - Red) */}
                      <motion.div 
              layoutId="nong-dot"
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 60,
                  damping: 11,
                  mass: 1.2
                }
              }}
                        className="inline-flex items-center justify-center z-50 mb-1"
                      >
                        <BreathingDot size={20} color="red" delay={0} />
                      </motion.div>

                      {/* Gray Dot */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="inline-flex items-center justify-center z-40 mb-1"
                      >
                        <BreathingDot size={20} color="gray" delay={0.3} />
                      </motion.div>

                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BottomTabBar />
      </div>
    </div>
  );
}
