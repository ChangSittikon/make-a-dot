"use client";
import { motion } from "framer-motion";

interface BreathingDotProps {
  size?: number;
  color?: 'red' | 'black' | 'gray';
  className?: string;
  delay?: number;
  jumpHeight?: number;
  cuteWobble?: boolean;
}

export function BreathingDot({ 
  size = 12, 
  color = 'red', 
  delay = 0, 
  className = "", 
  jumpHeight = 35,
  cuteWobble = false 
}: BreathingDotProps) {
  
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

  // Standard jump or Cute wobble jump
  const jumpTimes = cuteWobble 
    ? [0, 0.12, 0.24, 0.36, 0.46, 0.68, 0.86, 0.94, 1]
    : [0, 0.45, 0.85, 0.95, 1];

  const jumpDur = cuteWobble ? 2.6 : 2.4;

  const dotAnimate = cuteWobble ? {
    y: [0, 0, 0, 0, -jumpHeight * 0.5, -jumpHeight, -jumpHeight * 0.15, 0, 0],
    rotate: [0, -14, 14, 0, 0, 0, 0, 0, 0],
    x: [0, -2, 2, 0, 0, 0, 0, 0, 0],
    scaleX: [1.2, 1.05, 1.05, 1.28, 0.86, 0.96, 0.9, 1.25, 1.2],
    scaleY: [0.8, 0.96, 0.96, 0.74, 1.18, 1.04, 1.12, 0.78, 0.8],
  } : {
    y: [0, -jumpHeight, 0, 0, 0],
    scaleX: [1, 0.95, 0.95, 1.15, 1],
    scaleY: [1, 1.05, 1.05, 0.85, 1],
  };

  const shadowAnimate = cuteWobble ? {
    scaleX: [1.2, 1.05, 1.05, 1.3, 0.6, 0.35, 0.7, 1.3, 1.2],
    opacity: [0.65, 0.6, 0.6, 0.8, 0.3, 0.15, 0.4, 0.8, 0.65],
    x: [0, -2, 2, 0, 0, 0, 0, 0, 0],
  } : {
    scaleX: [1, 0.3, 1, 1.2, 1],
    opacity: [0.5, 0.1, 0.5, 0.8, 0.5],
  };

  return (
    <div 
      className={`relative inline-flex flex-col items-center justify-end ${className}`} 
      style={{ width: size * 1.5, height: size + jumpHeight + 5 }}
    >
      {/* The Jumping Dot */}
      <motion.div
        className={`${selectedColor.bg} rounded-full origin-bottom relative z-10`}
        style={{ 
          width: size, 
          height: size,
          boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.25), 0 4px 10px ${selectedColor.shadow}`
        }}
        animate={dotAnimate}
        transition={{
          duration: jumpDur,
          repeat: Infinity,
          delay: delay,
          times: jumpTimes,
          ease: "easeInOut"
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
        animate={shadowAnimate}
        transition={{
          duration: jumpDur,
          repeat: Infinity,
          delay: delay,
          times: jumpTimes,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
