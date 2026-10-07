"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IMPACT_SCALE_LIST, ScaleStats } from "@/config/taxonomy";

interface WorkType {
  id: string;
  name: string;
}

interface SkillTag {
  id: string;
  name: string;
  level?: string;
}

interface Occupation {
  id: string;
  name: string;
  icon?: string;
  skillTags: SkillTag[];
}

interface Industry {
  id: string;
  name: string;
  icon: string;
  order: number;
  occupations: Occupation[];
}

interface LearnedTag {
  tagName: string;
  frequency: number;
  bountyCount: number;
  sampleContext?: string;
  ai: {
    industryId: string;
    industryOrder: number;
    industryName: string;
    suggestedOccupation: string;
    tagType: "OCCUPATION" | "SKILL";
    confidence: number;
    reason: string;
  };
}

export default function TaxonomyAdminPage() {
  const [activeTab, setActiveTab] = useState<"PROBLEM_SCALE" | "TAXONOMY" | "AI_LEARNING">("PROBLEM_SCALE");
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [learnedTags, setLearnedTags] = useState<LearnedTag[]>([]);
  const [scaleStats, setScaleStats] = useState<Record<string, ScaleStats>>({});
  const [totalBounties, setTotalBounties] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [learningLoading, setLearningLoading] = useState(false);
  const [testTagInput, setTestTagInput] = useState("");
  const [isAnalyzingTest, setIsAnalyzingTest] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchTaxonomy = async () => {
    try {
      const res = await fetch("/api/taxonomy");
      const data = await res.json();
      if (data.success) {
        setWorkTypes(data.workTypes);
        setIndustries(data.industries);
        if (data.scaleStats) setScaleStats(data.scaleStats);
        if (typeof data.totalBounties === "number") setTotalBounties(data.totalBounties);
        if (typeof data.totalProjects === "number") setTotalProjects(data.totalProjects);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLearnedTags = async () => {
    try {
      setLearningLoading(true);
      const res = await fetch("/api/admin/taxonomy-learning");
      const data = await res.json();
      if (data.success) {
        setLearnedTags(data.tags || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLearningLoading(false);
    }
  };

  useEffect(() => {
    // Load official taxonomy first - opens page instantly (< 70ms)
    fetchTaxonomy().finally(() => setLoading(false));
    // Fetch AI learned tags in background
    fetchLearnedTags();
  }, []);

  // Handle Approve & Merge
  const handleApprove = async (tag: LearnedTag) => {
    try {
      const res = await fetch("/api/admin/taxonomy-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagName: tag.tagName,
          industryId: tag.ai.industryId,
          industryOrder: tag.ai.industryOrder,
          suggestedOccupation: tag.ai.suggestedOccupation,
          tagType: tag.ai.tagType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`✅ ${data.message}`);
        setLearnedTags((prev) => prev.filter((t) => t.tagName.toLowerCase() !== tag.tagName.toLowerCase()));
        await fetchTaxonomy(); // Refresh official taxonomy list
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  // Handle Dismiss
  const handleDismiss = async (tagName: string) => {
    try {
      await fetch(`/api/admin/taxonomy-learning?tag=${encodeURIComponent(tagName)}`, {
        method: "DELETE",
      });
      setLearnedTags((prev) => prev.filter((t) => t.tagName.toLowerCase() !== tagName.toLowerCase()));
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Test Custom Tag Simulation
  const handleTestAnalyze = async () => {
    if (!testTagInput.trim()) return;
    setIsAnalyzingTest(true);
    try {
      const tempTag = testTagInput.trim();
      const existing = learnedTags.find((t) => t.tagName.toLowerCase() === tempTag.toLowerCase());
      if (existing) {
        alert("คำนี้อยู่ในคิวการวิเคราะห์เรียบร้อยแล้ว");
        setIsAnalyzingTest(false);
        return;
      }

      setTestTagInput("");
      await fetchLearnedTags();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-brand-black flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-brand-red transition-colors">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-brand-red font-extrabold text-[10px] rounded-md tracking-wider">DOT017</span>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Taxonomy Center</h1>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">จัดการผัง 3 Layer และศูนย์เรียนรู้คำศัพท์ใหม่ AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/expert-monitoring"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              <i className="fa-solid fa-chart-line text-[11px] text-brand-red"></i>
              มอนิเตอร์ดีมานด์
            </Link>
            <Link
              href="/profile/settings/flow-builder"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <i className="fa-solid fa-code-branch text-[11px]"></i>
              ไปหน้า Flow Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
        
        {/* Success Banner */}
        {actionSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs transition-all animate-fadeIn">
            <span>{actionSuccessMsg}</span>
            <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* THREE TABS SELECTOR */}
        {/* ============================================================ */}
        <div className="border-b border-gray-200/80 pb-3">
          <div className="inline-flex items-center gap-1.5 bg-gray-100/90 p-1 rounded-2xl border border-gray-200/60 shadow-2xs overflow-x-auto max-w-full">
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab("PROBLEM_SCALE")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "PROBLEM_SCALE"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
              }`}
            >
              <i className="fa-solid fa-shapes text-brand-red"></i>
              <span>ระดับของปัญหา</span>
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-brand-red text-[10px] font-bold border border-red-200/60">
                6 ระดับ
              </span>
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => setActiveTab("TAXONOMY")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "TAXONOMY"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
              }`}
            >
              <i className="fa-solid fa-layer-group text-brand-red"></i>
              <span>สายงานและรูปแบบงาน</span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                L1-L3
              </span>
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => setActiveTab("AI_LEARNING")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activeTab === "AI_LEARNING"
                  ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
              }`}
            >
              <i className="fa-solid fa-brain text-brand-red"></i>
              <span>ศูนย์วิเคราะห์ AI</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  learnedTags.length > 0 ? "bg-brand-red text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {learnedTags.length}
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1 CONTENT: ระดับของปัญหา (PROBLEM SCALE HIERARCHY) */}
        {/* ============================================================ */}
        {activeTab === "PROBLEM_SCALE" && (
          <div className="space-y-6 animate-fadeIn">
            {/* ======================================================== */}
            {/* TIER 1: ระดับของปัญหา (PROBLEM SCALE & DUAL-TRACK MATRIX) */}
            {/* ======================================================== */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/90 relative overflow-hidden">
              {/* Header with platform-wide context */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-red to-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      <i className="fa-solid fa-shapes text-sm"></i>
                    </div>
                    <div>
                      <h2 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                        ระดับของปัญหา (Problem Scale Hierarchy)
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-brand-red border border-red-200">
                          6 ระดับครอบคลุมทั้งระบบ
                        </span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5 font-normal">
                        แกนหลักของ MAKE A DOT: ทุก <span className="font-bold text-brand-red">"ปัญหา" (Bounty Track)</span> และ <span className="font-bold text-sky-600">"โครงการ" (Project Track)</span> เป็นซับเซตย่อยภายใต้ระดับของปัญหาเหล่านี้
                      </p>
                    </div>
                  </div>
                </div>

                {/* Platform Summary Pill Badges */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50/80 border border-red-200 text-brand-red">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                    <span className="text-xs font-bold">{totalBounties} ปัญหา (Bounties)</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50/80 border border-sky-200 text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span className="text-xs font-bold">{totalProjects} โครงการ (Projects)</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 font-mono text-xs font-bold">
                    <span>รวม {totalBounties + totalProjects} รายการ</span>
                  </div>
                </div>
              </div>

              {/* 6 Problem Scale Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
                {IMPACT_SCALE_LIST.map((scale) => {
                  const isMoonshot = scale.key === "MOONSHOT";
                  const stats = scaleStats[scale.key] || { bounties: 0, projects: 0 };
                  const totalInScale = stats.bounties + stats.projects;
                  const bountyPercent = totalInScale > 0 ? Math.round((stats.bounties / totalInScale) * 100) : 50;

                  if (isMoonshot) {
                    return (
                      <div
                        key={scale.key}
                        className="rounded-2xl p-4 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white border border-amber-500/40 shadow-lg relative overflow-hidden group hover:border-amber-400/80 transition-all flex flex-col justify-between"
                      >
                        {/* Glow accent */}
                        <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />

                        {/* Top: Star + Name + Scope */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-gray-800 border border-amber-500/50 text-amber-300 flex items-center justify-center text-xs font-black shrink-0">
                                ★
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border border-amber-500/40 bg-gray-800/90">
                                <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent font-black tracking-widest">
                                  MOONSHOT
                                </span>
                              </span>
                            </div>
                            <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/30">
                              {scale.scope}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-gray-100 mt-1">
                            {scale.labelTh}
                          </div>
                          <p className="text-[11px] text-gray-300 mt-1 leading-snug line-clamp-2">
                            {scale.description}
                          </p>
                        </div>

                        {/* Middle: Dual-Track Subset Breakdown */}
                        <div className="mt-4 pt-3 border-t border-gray-800/80 space-y-2 relative z-10">
                          <div className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider flex items-center justify-between">
                            <span>ซับเซตในระดับนี้ (Dual-Track)</span>
                            <span className="font-mono text-gray-400">รวม {totalInScale} รายการ</span>
                          </div>

                          {/* Subsets Count Boxes */}
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-gray-800/80 rounded-xl p-2 border border-red-500/30">
                              <div className="flex items-center justify-center gap-1 text-[10px] text-red-300 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                                ปัญหา (Bounties)
                              </div>
                              <div className="text-lg font-black text-white mt-0.5">
                                {stats.bounties}
                              </div>
                            </div>
                            <div className="bg-gray-800/80 rounded-xl p-2 border border-sky-500/30">
                              <div className="flex items-center justify-center gap-1 text-[10px] text-sky-300 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                                โครงการ (Projects)
                              </div>
                              <div className="text-lg font-black text-white mt-0.5">
                                {stats.projects}
                              </div>
                            </div>
                          </div>

                          {/* Visual Ratio Bar */}
                          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden flex">
                            <div style={{ width: `${bountyPercent}%` }} className="bg-brand-red h-full" />
                            <div style={{ width: `${100 - bountyPercent}%` }} className="bg-sky-500 h-full" />
                          </div>

                          {/* Target Track */}
                          <div className="text-[10px] text-amber-300 font-medium flex items-center gap-1.5 pt-1">
                            <i className="fa-solid fa-arrow-right-arrow-left text-[8px] text-amber-400"></i>
                            <span>{scale.trackTarget}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={scale.key}
                      className="rounded-2xl p-4 bg-gray-50/70 border border-gray-200/80 hover:border-gray-300 hover:bg-white transition-all flex flex-col justify-between shadow-2xs group"
                    >
                      {/* Top: Level + Badge + Scope */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs group-hover:border-brand-red/30 group-hover:text-brand-red transition-colors">
                              0{scale.level}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scale.color}`}>
                              {scale.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded-md border border-gray-200/70">
                            {scale.scope}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-gray-800 mt-1">
                          {scale.labelTh}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug line-clamp-2">
                          {scale.description}
                        </p>
                      </div>

                      {/* Middle: Dual-Track Subset Breakdown */}
                      <div className="mt-4 pt-3 border-t border-gray-200/60 space-y-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                          <span>ซับเซตในระดับนี้ (Dual-Track)</span>
                          <span className="font-mono text-gray-500">รวม {totalInScale} รายการ</span>
                        </div>

                        {/* Subsets Count Boxes */}
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white rounded-xl p-2 border border-red-100 shadow-2xs">
                            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                              ปัญหา (Bounties)
                            </div>
                            <div className="text-lg font-black text-brand-red mt-0.5">
                              {stats.bounties}
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-2 border border-sky-100 shadow-2xs">
                            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                              โครงการ (Projects)
                            </div>
                            <div className="text-lg font-black text-sky-700 mt-0.5">
                              {stats.projects}
                            </div>
                          </div>
                        </div>

                        {/* Visual Ratio Bar */}
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden flex">
                          <div style={{ width: `${bountyPercent}%` }} className="bg-brand-red h-full" />
                          <div style={{ width: `${100 - bountyPercent}%` }} className="bg-sky-500 h-full" />
                        </div>

                        {/* Target Track */}
                        <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5 pt-1">
                          <i className="fa-solid fa-arrow-right-arrow-left text-[8px] text-brand-red"></i>
                          <span>{scale.trackTarget}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dual-Track Distribution Matrix Table */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-table-cells text-gray-500 text-sm"></i>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      ตารางสรุปเมทริกซ์การกระจายทรัพยากร (Dual-Track Distribution Matrix)
                    </h3>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    แสดงสัดส่วนการกระจายตัวของ &ldquo;ปัญหา&rdquo; และ &ldquo;โครงการ&rdquo; ในแต่ละระดับ
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50/90 text-gray-600 border-b border-gray-200/80 text-[11px] font-bold">
                        <th className="py-3 px-4">ระดับของปัญหา (Scale)</th>
                        <th className="py-3 px-4">ขอบเขต (Scope)</th>
                        <th className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-brand-red">
                            <span className="w-2 h-2 rounded-full bg-brand-red"></span>
                            ปัญหา (Bounties)
                          </span>
                        </th>
                        <th className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-sky-600">
                            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                            โครงการ (Projects)
                          </span>
                        </th>
                        <th className="py-3 px-4 text-center">รวม (Total)</th>
                        <th className="py-3 px-4">แนวทาง Dual-Track</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[11px]">
                      {IMPACT_SCALE_LIST.map((scale) => {
                        const stats = scaleStats[scale.key] || { bounties: 0, projects: 0 };
                        const totalInScale = stats.bounties + stats.projects;
                        const bountyShare = totalBounties > 0 ? Math.round((stats.bounties / totalBounties) * 100) : 0;
                        const projectShare = totalProjects > 0 ? Math.round((stats.projects / totalProjects) * 100) : 0;
                        const isMoonshot = scale.key === "MOONSHOT";

                        return (
                          <tr key={scale.key} className={isMoonshot ? "bg-amber-50/20 hover:bg-amber-50/40 font-medium" : "hover:bg-gray-50/50"}>
                            <td className="py-3 px-4 font-bold">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-gray-400">{isMoonshot ? "★" : `0${scale.level}`}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${scale.color}`}>
                                  {scale.label}
                                </span>
                                <span className="text-gray-700">{scale.labelTh}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-500">{scale.scope}</td>
                            <td className="py-3 px-4 text-center font-bold">
                              <span className="text-brand-red text-xs">{stats.bounties}</span>
                              <span className="text-[10px] text-gray-400 ml-1">({bountyShare}%)</span>
                            </td>
                            <td className="py-3 px-4 text-center font-bold">
                              <span className="text-sky-600 text-xs">{stats.projects}</span>
                              <span className="text-[10px] text-gray-400 ml-1">({projectShare}%)</span>
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-bold text-gray-800">
                              {totalInScale}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <i className="fa-solid fa-arrow-right-arrow-left text-[9px] text-brand-red"></i>
                                <span>{scale.trackTarget}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100/70 border-t border-gray-200 font-bold text-gray-800 text-[11px]">
                        <td className="py-2.5 px-4" colSpan={2}>รวมทั้งหมดในระบบ</td>
                        <td className="py-2.5 px-4 text-center text-brand-red font-black">{totalBounties} งาน</td>
                        <td className="py-2.5 px-4 text-center text-sky-700 font-black">{totalProjects} โครงการ</td>
                        <td className="py-2.5 px-4 text-center font-mono font-black">{totalBounties + totalProjects}</td>
                        <td className="py-2.5 px-4 text-gray-500 font-normal">ระบบกระจายงานแบบ Dual-Track</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2 CONTENT: 12 สายงาน และ 8 รูปแบบการทำงาน (TAXONOMY L1/L2/L3) */}
        {/* ============================================================ */}
        {activeTab === "TAXONOMY" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Layer 1: Work Types */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit md:col-span-1">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-brand-red text-white flex items-center justify-center text-[10px] font-bold">L1</span>
                      <h2 className="font-bold text-gray-800 text-sm">รูปแบบการทำงาน</h2>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">ประเภทการจ้างงาน/สัญญา (8 หมวด)</p>
                  </div>
                  <button className="w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:text-brand-red hover:border-brand-red transition-colors flex items-center justify-center">
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>
                <div className="space-y-2">
                  {workTypes.map((wt, index) => (
                    <div key={wt.id} className="p-2.5 bg-gray-50/80 rounded-xl flex items-center gap-3 border border-transparent hover:border-gray-200 hover:bg-white transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 group-hover:border-brand-red/30 group-hover:bg-red-50/30 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-brand-red shrink-0 shadow-2xs transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <span className="text-sm font-medium text-gray-800 flex-1">{wt.name}</span>
                      <i className="fa-solid fa-ellipsis-vertical text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                  ))}
                </div>
              </section>

              {/* Layer 2: Industries & Layer 3: Occupations */}
              <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit md:col-span-2">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-brand-red text-white flex items-center justify-center text-[10px] font-bold">L2</span>
                    <h2 className="font-bold text-gray-800 text-sm">สายงานและอุตสาหกรรม (Layer 2) & ทักษะอาชีพ (Layer 3)</h2>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">12 สายงานมาตรฐาน DOT017 เรียงตามลำดับอย่างเป็นทางการ</p>
                </div>
                <button className="text-brand-red text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                  + เพิ่มสายงาน
                </button>
              </div>
              
              <div className="space-y-4">
                {industries.map((ind, indIdx) => {
                  const displayOrder = ind.order > 0 ? ind.order : indIdx + 1;
                  return (
                    <div key={ind.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/40">
                      <div className="p-3.5 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Separate distinct numbering badge */}
                          <div className="px-2.5 py-1 rounded-lg bg-red-50 border border-brand-red/20 text-brand-red text-xs font-black tracking-wide shrink-0 shadow-2xs">
                            ลำดับ {String(displayOrder).padStart(2, '0')}
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 text-xs">
                            <i className={ind.icon || "fa-solid fa-folder"}></i>
                          </div>
                          <span className="font-bold text-gray-800 text-sm">{ind.name}</span>
                        </div>
                        <button className="text-xs text-gray-500 hover:text-brand-black transition-colors px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 flex items-center gap-1">
                          <i className="fa-solid fa-plus text-[10px] text-brand-red"></i>
                          <span>เพิ่มอาชีพ (L3)</span>
                        </button>
                      </div>
                      
                      <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ind.occupations && ind.occupations.length > 0 ? (
                          ind.occupations.map((occ, occIdx) => (
                            <div key={occ.id} className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {displayOrder}.{occIdx + 1}
                                  </span>
                                  <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                    <i className="fa-solid fa-briefcase text-brand-red text-[11px]"></i>
                                    {occ.name}
                                  </span>
                                </div>
                                <i className="fa-solid fa-pen text-[10px] text-gray-300 hover:text-brand-red cursor-pointer"></i>
                              </div>
                              
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {occ.skillTags && occ.skillTags.length > 0 ? occ.skillTags.map(tag => (
                                  <span key={tag.id} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium border border-gray-200">
                                    {tag.name}
                                  </span>
                                )) : (
                                  <span className="text-[10px] text-gray-400 italic">ไม่มีแท็กทักษะย่อย</span>
                                )}
                                <span className="px-2 py-0.5 bg-red-50 text-brand-red rounded-md text-[10px] font-medium border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                                  + แท็ก
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-4 text-center bg-white/60 rounded-xl border border-dashed border-gray-200">
                            <span className="text-xs text-gray-400">ยังไม่มีอาชีพในสายงานนี้ (กด "+ เพิ่มอาชีพ (L3)" เพื่อเริ่มต้นสร้าง)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3 CONTENT: AI TAXONOMY LEARNING & EVOLUTION QUEUE */}
        {/* ============================================================ */}
        {activeTab === "AI_LEARNING" && (
          <section className="bg-gradient-to-br from-white via-red-50/15 to-rose-50/20 rounded-3xl p-6 shadow-sm border border-red-100/80 relative overflow-hidden animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-red-100/60">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-red text-white flex items-center justify-center shadow-xs">
                    <i className="fa-solid fa-brain text-base"></i>
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                      ศูนย์วิเคราะห์และเรียนรู้คำศัพท์ใหม่ AI (Taxonomy Evolution Queue)
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-brand-red text-white">
                        {learnedTags.length} คำรออนุมัติ
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ตรวจจับคำค้นหา/แท็กที่ผู้ใช้พิมพ์ใน Step 5 แล้ว AI จะวิเคราะห์ความหมาย (Semantic Matching) เพื่อแนะนำการจัดกลุ่มเข้า 12 สายงาน
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Test Input Bar */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="พิมพ์คำแปลกใหม่เพื่อทดสอบ AI..."
                    value={testTagInput}
                    onChange={(e) => setTestTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleTestAnalyze(); }}
                    className="w-64 px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-red text-gray-800 placeholder:text-gray-400 shadow-2xs"
                  />
                </div>
                <button
                  onClick={handleTestAnalyze}
                  disabled={isAnalyzingTest || !testTagInput.trim()}
                  className="px-3.5 py-2 bg-brand-red text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  {isAnalyzingTest ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-magnifying-glass"></i>}
                  <span>วิเคราะห์สด</span>
                </button>
              </div>
            </div>

            {/* List of Pending Learned Tags */}
            {learningLoading ? (
              <div className="py-12 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
                <span>กำลังประมวลผลคำศัพท์ใหม่และเรียกข้อมูล AI...</span>
              </div>
            ) : learnedTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learnedTags.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Header: Tag Name + Frequency */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-red-50 text-brand-red flex items-center justify-center text-xs font-bold shrink-0">
                            #
                          </span>
                          <h4 className="text-sm font-extrabold text-gray-900 tracking-tight">{item.tagName}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold shrink-0">
                          ใช้ {item.frequency} ครั้ง
                        </span>
                      </div>

                      {/* AI Prediction Result Box */}
                      <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100/80 mb-3 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 font-medium">AI แนะนำเข้าสายงาน:</span>
                          <span className="font-extrabold text-brand-red bg-red-50/80 px-2 py-0.5 rounded-md border border-red-100/50">
                            [{String(item.ai.industryOrder).padStart(2, "0")}] {item.ai.industryName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 font-medium">แนะนำบรรจุเป็น:</span>
                          <span className="font-bold text-gray-800">
                            {item.ai.tagType === "OCCUPATION" ? "อาชีพหลัก (Occupation)" : "ทักษะย่อย (Skill)"} ({item.ai.suggestedOccupation})
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 font-medium">ความมั่นใจของโมเดล:</span>
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <i className="fa-solid fa-circle-check text-[10px]"></i>
                            {item.ai.confidence}%
                          </span>
                        </div>

                        <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-200/50 italic leading-relaxed flex items-start gap-1">
                          <i className="fa-regular fa-comment-dots text-gray-400 text-[10px] mt-0.5 shrink-0"></i>
                          <span>เหตุผล: {item.ai.reason}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => handleApprove(item)}
                        className="flex-1 py-1.5 px-3 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <i className="fa-solid fa-check text-[11px]"></i>
                        อนุมัติเข้าฐานข้อมูล
                      </button>
                      <button
                        onClick={() => handleDismiss(item.tagName)}
                        className="py-1.5 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
                        title="เพิกเฉย/ลบคำนี้"
                      >
                        <i className="fa-solid fa-trash-can text-[11px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-white/70 rounded-2xl border border-dashed border-red-200/60 flex flex-col items-center justify-center">
                <i className="fa-solid fa-inbox text-3xl text-gray-300 mb-2"></i>
                <p className="text-xs font-bold text-gray-700">ยังไม่มีคำแปลกใหม่ค้างในคิวการตรวจสอบ</p>
                <p className="text-[11px] text-gray-400 mt-0.5 max-w-md">
                  เมื่อ Requester สร้างแท็กใหม่ใน Step 5 ระบบจะนำมาให้ AI วิเคราะห์และขึ้นแจ้งเตือนที่นี่โดยอัตโนมัติ (หรือทดลองพิมพ์ในกล่อง "วิเคราะห์สด" ด้านบนเพื่อทดสอบได้เลยครับ)
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
