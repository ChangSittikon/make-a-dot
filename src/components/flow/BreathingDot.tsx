"use client";
import { motion } from "framer-motion";

interface BreathingDotProps {
  size?: number;
  color?: 'red' | 'black' | 'gray';
  className?: string;
  delay?: number;
}

export function BreathingDot({ size = 12, color = 'red', delay = 0, className = "" }: BreathingDotProps) {
  
  const colorMap = {
    red: {
      bg: 'bg-brand-red',
      shadow: 'rgba(255,26,26,0.3)'
    },
    black: {
      bg: 'bg-brand-black',
      shadow: 'rgba(0,0,0,0.3)'
    },
    gray: {
      bg: 'bg-gray-400',
      shadow: 'rgba(156,163,175,0.3)'
    }
  };

  const selectedColor = colorMap[color];

  // Smart & Stable Jump Physics (Slower, elegant)
  const jumpTimes = [0, 0.45, 0.85, 0.95, 1];
  const jumpDur = 2.4; // Slower, more majestic

  return (
    <div 
      className={`relative inline-flex flex-col items-center justify-end ${className}`} 
      style={{ width: size * 1.5, height: size + 40 }}
    >
      {/* The Jumping Dot */}
      <motion.div
        className={`${selectedColor.bg} rounded-full origin-bottom relative z-10`}
        style={{ 
          width: size, 
          height: size,
          boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.25), 0 4px 10px ${selectedColor.shadow}`
        }}
        animate={{
          y: [0, -35, 0, 0, 0],
          scaleX: [1, 0.95, 0.95, 1.15, 1],
          scaleY: [1, 1.05, 1.05, 0.85, 1],
        }}
        transition={{
          duration: jumpDur,
          repeat: Infinity,
          delay: delay,
          times: jumpTimes,
          ease: [
            "circOut",   // Fast launch, smooth heavy hang time at peak
            "circIn",    // Smooth start, fast fall
            "easeOut",   // Impact squash
            "easeInOut"  // Recover
          ]
        }}
      />
      
      {/* The Ground Shadow */}
      <motion.div
        className="absolute bottom-0 rounded-full"
        style={{ 
          width: size * 2.2, 
          height: size * 1.0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
          marginBottom: -size * 0.35
        }}
        animate={{
          scaleX: [1, 0.3, 1, 1.2, 1],
          opacity: [0.5, 0.1, 0.5, 0.8, 0.5],
        }}
        transition={{
          duration: jumpDur,
          repeat: Infinity,
          delay: delay,
          times: jumpTimes,
          ease: [
            "circOut",
            "circIn",
            "easeOut",
            "easeInOut"
          ]
        }}
      />
    </div>
  );
}
