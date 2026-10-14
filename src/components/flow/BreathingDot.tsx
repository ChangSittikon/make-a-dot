"use client";
import React from "react";
import { NongDot } from "./NongDot";

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
  return (
    <NongDot
      mood={cuteWobble ? 'greeting' : 'classic'}
      size={size}
      color={color}
      delay={delay}
      jumpHeight={jumpHeight}
      className={className}
    />
  );
}
