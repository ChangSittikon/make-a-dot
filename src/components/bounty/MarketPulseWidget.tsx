"use client";

import React, { useEffect, useState } from "react";

interface SuggestedPrice {
  min: number;
  max: number;
  avg: number;
}

interface MarketPulseData {
  marketState: "SELLER" | "BUYER" | "BALANCED";
  ratio: number;
  suggestedPrice: SuggestedPrice;
  message: string;
  demandCount?: number;
  supplyCount?: number;
}

interface MarketPulseWidgetProps {
  bountyId?: string;
  className?: string;
}

export default function MarketPulseWidget({
  bountyId,
  className = "",
}: MarketPulseWidgetProps) {
  const [pulseData, setPulseData] = useState<MarketPulseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchMarketPulse() {
      setIsLoading(true);
      setFetchError(false);
      try {
        const url = bountyId
          ? `/api/bounties/market-pulse?bountyId=${encodeURIComponent(bountyId)}`
          : "/api/bounties/market-pulse";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch market pulse");
        const data = await res.json();
        if (isMounted && data) {
          setPulseData({
            marketState: data.marketState || "BALANCED",
            ratio: typeof data.ratio === "number" ? data.ratio : 0.5,
            suggestedPrice: data.suggestedPrice || { min: 30000, max: 70000, avg: 50000 },
            message: data.message || "ตลาดอยู่ในภาวะสมดุล สะท้อนราคามาตรฐาน",
            demandCount: data.demandCount,
            supplyCount: data.supplyCount,
          });
        }
      } catch (err) {
        console.error("MarketPulseWidget fetch error:", err);
        if (isMounted) setFetchError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchMarketPulse();
    return () => {
      isMounted = false;
    };
  }, [bountyId]);

  if (isLoading) {
    return (
      <div className={`p-3 bg-gray-50/80 rounded-2xl border border-gray-100 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="h-3.5 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-full h-[1px] bg-gray-200 my-2"></div>
        <div className="h-3 w-48 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (fetchError || !pulseData) {
    return (
      <div className={`p-3 bg-gray-50/50 rounded-2xl border border-gray-100 text-xs text-gray-400 ${className}`}>
        <span className="font-mono text-[10px] uppercase tracking-wider block mb-1">MARKET PULSE</span>
        <span>ระบบแนะนำราคากำลังคำนวณข้อมูลสถิติตลาด</span>
      </div>
    );
  }

  const { marketState, ratio, suggestedPrice, message } = pulseData;
  const clampedRatio = Math.max(0.08, Math.min(0.92, ratio));
  const percentagePos = (clampedRatio * 100).toFixed(1);

  const stateBadgeText =
    marketState === "SELLER"
      ? "SELLER'S MARKET"
      : marketState === "BUYER"
      ? "BUYER'S MARKET"
      : "BALANCED MARKET";

  return (
    <div className={`p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100/90 shadow-2xs space-y-2 ${className}`}>
      {/* Top Line: Short explanation & suggested price */}
      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          <span className="text-[11px] font-bold text-gray-800 tracking-tight">Market Pulse</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-500 font-bold uppercase">
            {stateBadgeText}
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-600 font-bold">
          ฿{suggestedPrice.min.toLocaleString()} - ฿{suggestedPrice.max.toLocaleString()}
        </span>
      </div>

      {/* Description Message */}
      <p className="text-[11px] text-gray-500 leading-snug font-normal">
        {message}
      </p>

      {/* Bottom Line: Equilibrium Indicator (Hairline + Circle Dot) */}
      <div className="pt-1">
        <div className="relative w-full h-[1px] bg-gray-200 my-1.5">
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-red shadow-xs transition-all duration-500"
            style={{ left: `${percentagePos}%` }}
            title={`Market Equilibrium Ratio: ${(ratio * 100).toFixed(0)}%`}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 uppercase tracking-wider">
          <span>ผู้ว่าจ้างได้เปรียบ (Buyer)</span>
          <span>สมดุล (Equilibrium)</span>
          <span>ผู้รับงานได้เปรียบ (Seller)</span>
        </div>
      </div>
    </div>
  );
}
