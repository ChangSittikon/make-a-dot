"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface AdminOpportunityItem {
  id: string;
  strategyType: string;
  modelName: string;
  howToStart: string;
  capitalRequiredThb: string;
  expectedMarginPercent: string;
  toolsAndEquipment: string;
  skillsNeeded: string;
  legalAndPermits: string;
  occupation?: { id: string; name: string } | null;
  workType?: { id: string; name: string } | null;
}

export interface AdminLinkedProblem {
  id: string;
  rawDescription: string;
  impactScale: string;
  status: string;
  bountyPrizeSatang: number;
}

export interface AdminSupplyNode {
  id: string;
  nodeOrder: number;
  stageType: string;
  nodeTitle: string;
  equivalentQuantity: string;
  whatHow: string;
  whoIncumbent: string;
  costThb: number;
  sellingThb: number;
  painPoint: string;
  marginJumpPercent: number;
  isHighMarginBottleneck: boolean;
  trafficLight: string;
  opportunities: AdminOpportunityItem[];
  linkedProblems: AdminLinkedProblem[];
}

export interface AdminProductChain {
  id: string;
  slug: string;
  productName: string;
  subCategoryName: string;
  archetypeName: string;
  sectorOrder: number;
  baseUnitReference: string;
  conversionSummary: string;
  originCostThb: number;
  finalRetailValueThb: number;
  totalMarkupPercent: number;
  source: string;
  status: string;
  searchCount: number;
  industry: {
    id: string;
    name: string;
    order: number;
    icon?: string | null;
  };
  archetype?: {
    id: string;
    code: string;
    name: string;
  } | null;
  nodes: AdminSupplyNode[];
}

export interface ProductionStats {
  totalChains: number;
  verifiedCount: number;
  pendingCount: number;
  totalArchetypes: number;
  totalNodes: number;
  totalOpportunities: number;
  totalLinkedProblems: number;
}

interface TaxonomySupplyChainTabProps {
  chains: AdminProductChain[];
  stats: ProductionStats;
  loading: boolean;
  onRefreshAll: () => Promise<void>;
  onShowMessage: (msg: string) => void;
}

const STAGE_BADGE: Record<string, { label: string; color: string }> = {
  UPSTREAM: { label: "01 ต้นน้ำ", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  MIDSTREAM_EARLY: { label: "02 กลางน้ำขั้นต้น", color: "bg-sky-50 text-sky-700 border-sky-200" },
  MIDSTREAM_LATE: { label: "03 กลางน้ำขั้นปลาย", color: "bg-amber-50 text-amber-700 border-amber-200" },
  DOWNSTREAM: { label: "04 ปลายน้ำ", color: "bg-purple-50 text-purple-700 border-purple-200" },
  BYPRODUCT_SERVICE: { label: "05 นอกสายพาน/บริการเสริม", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

const OFFICIAL_SECTORS = [
  { order: 0, name: "ทุกสายงาน (12 อุตสาหกรรม)" },
  { order: 1, name: "01 ก่อสร้างและอสังหาฯ" },
  { order: 2, name: "02 การแพทย์และสาธารณสุข" },
  { order: 3, name: "03 เทคโนโลยีและไอที" },
  { order: 4, name: "04 การศึกษา" },
  { order: 5, name: "05 อาหารและเครื่องดื่ม" },
  { order: 6, name: "06 เกษตรกรรม" },
  { order: 7, name: "07 ขนส่งและโลจิสติกส์" },
  { order: 8, name: "08 การเงินและบัญชี" },
  { order: 9, name: "09 ท่องเที่ยวและโรงแรม" },
  { order: 10, name: "10 โรงงานและการผลิต" },
  { order: 11, name: "11 สื่อและความบันเทิง" },
  { order: 12, name: "12 กฎหมาย" },
];

export const TaxonomySupplyChainTab: React.FC<TaxonomySupplyChainTabProps> = ({
  chains,
  stats,
  loading,
  onRefreshAll,
  onShowMessage,
}) => {
  const [selectedSector, setSelectedSector] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING_REVIEW" | "VERIFIED">("ALL");
  const [expandedChainIds, setExpandedChainIds] = useState<Record<string, boolean>>({});
  const [newProductInput, setNewProductInput] = useState("");
  const [newProductSector, setNewProductSector] = useState<number>(5);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedChainIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredChains = chains.filter((c) => {
    if (selectedSector !== 0 && c.sectorOrder !== selectedSector) return false;
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    return true;
  });

  const handleVerifyAndSync = async (chainId: string) => {
    setBusyId(chainId);
    try {
      const res = await fetch("/api/admin/taxonomy-production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY_AND_SYNC", productChainId: chainId }),
      });
      const data = await res.json();
      if (data.success) {
        onShowMessage(`✅ ${data.message}`);
        await onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  const handleCreateBountyFromNode = async (nodeId: string) => {
    setBusyId(nodeId);
    try {
      const res = await fetch("/api/admin/taxonomy-production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CREATE_BOUNTY", nodeRecordId: nodeId }),
      });
      const data = await res.json();
      if (data.success) {
        onShowMessage(`⚡ ${data.message}`);
        await onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  const handleGenerateNewProduct = async () => {
    if (!newProductInput.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/taxonomy-production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GENERATE_CHAIN",
          productName: newProductInput.trim(),
          sectorOrder: newProductSector,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewProductInput("");
        onShowMessage(`✨ ${data.message}`);
        if (data.productChainId) {
          setExpandedChainIds((prev) => ({ ...prev, [data.productChainId]: true }));
        }
        await onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteChain = async (id: string, name: string) => {
    if (!confirm(`ยืนยันการลบผังสินค้า "${name}" ออกจากฐานข้อมูล?`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/taxonomy-production?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onShowMessage(`🗑️ ${data.message}`);
        await onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ======================================================== */}
      {/* TOP OVERVIEW & ARCHITECTURE BRIDGE BANNER */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-red to-red-700 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
              <i className="fa-solid fa-sitemap"></i>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-black text-gray-900">
                  ศูนย์ฐานข้อมูลผังห่วงโซ่สินค้า (Production Supply Chain Registry)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-brand-red border border-red-200">
                  เชื่อมตรง 12 อุตสาหกรรม (DOT017)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                เชื่อมโยงผังการผลิต 5 ขั้นตอน (ต้นน้ำ → ปลายน้ำ) เข้ากับ{" "}
                <span className="font-bold text-gray-800">Layer 1 (WorkType)</span>,{" "}
                <span className="font-bold text-gray-800">Layer 2 (12 อุตสาหกรรม)</span>,{" "}
                <span className="font-bold text-gray-800">Layer 3 (อาชีพ & ทักษะ)</span> และ{" "}
                <span className="font-bold text-brand-red">ภารกิจแก้คอขวด (ProblemNode Bounty)</span> ในฐานข้อมูลเดียว
              </p>
            </div>
          </div>

          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors shrink-0 self-start lg:self-center"
          >
            <i className="fa-solid fa-industry text-brand-red"></i>
            <span>เปิดหน้าผู้ใช้งาน &ldquo;ทำผลิต&rdquo;</span>
          </Link>
        </div>

        {/* 5 Database Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div className="text-[11px] font-bold text-gray-500">ผังสินค้าทั้งหมด (ProductChain)</div>
            <div className="text-xl font-black text-gray-900 mt-1">{stats.totalChains}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              อนุมัติแล้ว {stats.verifiedCount} • รอตรวจ {stats.pendingCount}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div className="text-[11px] font-bold text-gray-500">แม่พิมพ์ห่วงโซ่ (Archetypes)</div>
            <div className="text-xl font-black text-gray-900 mt-1">{stats.totalArchetypes}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">ผูกใต้ 12 อุตสาหกรรมหลัก</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/70">
            <div className="text-[11px] font-bold text-gray-500">โหนดการผลิต (5 Stages)</div>
            <div className="text-xl font-black text-gray-900 mt-1">{stats.totalNodes}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">ต้นน้ำ → กลางน้ำ → ปลายน้ำ</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-100">
            <div className="text-[11px] font-bold text-brand-red">จุดแทรกตัวอาชีพ (Micro-Opps)</div>
            <div className="text-xl font-black text-brand-red mt-1">{stats.totalOpportunities}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">เชื่อมตรง Layer 3 (Occupation/Skill)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="text-[11px] font-bold text-amber-800">ภารกิจแก้คอขวด (Linked Bounties)</div>
            <div className="text-xl font-black text-amber-700 mt-1">{stats.totalLinkedProblems}</div>
            <div className="text-[10px] text-amber-700 mt-0.5">แปลงจาก Pain Point โหนดการผลิต</div>
          </div>
        </div>

        {/* Live AI Product Unbundler Bar for Admin */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center text-white shrink-0">
              <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
            </span>
            <div>
              <div className="text-xs font-extrabold">
                เพิ่มผังสินค้าใหม่ลงฐานข้อมูล Prisma ทันที (AI Supply Chain Unbundler)
              </div>
              <div className="text-[11px] text-gray-300">
                พิมพ์ชื่อสินค้าใดก็ได้ ระบบจะผ่าตัด 5 โหนดต้นน้ำ-ปลายน้ำ พร้อมผูกเข้ากับ 12 อุตสาหกรรมอัตโนมัติ
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={newProductSector}
              onChange={(e) => setNewProductSector(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-xs text-white font-semibold focus:outline-none focus:border-brand-red"
            >
              {OFFICIAL_SECTORS.filter((s) => s.order > 0).map((s) => (
                <option key={s.order} value={s.order}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="เช่น มัทฉะพรีเมียม, อาหารแมวออร์แกนิก..."
              value={newProductInput}
              onChange={(e) => setNewProductInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerateNewProduct();
              }}
              className="w-60 px-3.5 py-2 rounded-xl bg-white text-gray-900 text-xs font-medium focus:outline-none"
            />
            <button
              onClick={handleGenerateNewProduct}
              disabled={isGenerating || !newProductInput.trim()}
              className="px-4 py-2 rounded-xl bg-brand-red hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isGenerating ? (
                <i className="fa-solid fa-spinner animate-spin"></i>
              ) : (
                <i className="fa-solid fa-plus"></i>
              )}
              <span>สร้างผังเข้า DB</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FILTER BAR BY 12 INDUSTRIES & VERIFICATION STATUS */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/90 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ทั้งหมด ({chains.length})
            </button>
            <button
              onClick={() => setStatusFilter("VERIFIED")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "VERIFIED"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              ✓ อนุมัติเป็นมาตรฐานแล้ว ({stats.verifiedCount})
            </button>
            <button
              onClick={() => setStatusFilter("PENDING_REVIEW")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === "PENDING_REVIEW"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              ⏳ รอตรวจสอบจาก AI ({stats.pendingCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">กรองตาม 12 สายงาน:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-brand-red"
            >
              {OFFICIAL_SECTORS.map((sec) => (
                <option key={sec.order} value={sec.order}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Chain List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">กำลังโหลดฐานข้อมูลผังห่วงโซ่สินค้า...</div>
        ) : filteredChains.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-600">ไม่พบผังสินค้าในตัวกรองที่เลือก</p>
            <p className="text-[11px] text-gray-400 mt-1">
              สามารถพิมพ์ชื่อสินค้าในแถบด้านบนเพื่อให้ AI ผ่าตัดห่วงโซ่เข้าสู่ฐานข้อมูลได้ทันที
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChains.map((chain) => {
              const isExpanded = !!expandedChainIds[chain.id];
              const isBusy = busyId === chain.id;

              return (
                <div
                  key={chain.id}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs hover:shadow-xs transition-all"
                >
                  {/* Card Top Bar */}
                  <div className="p-4 bg-gray-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-red text-white text-[11px] font-black">
                          [{String(chain.sectorOrder).padStart(2, "0")}] {chain.industry?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 text-[11px] font-bold">
                          หมวดย่อย: {chain.subCategoryName}
                        </span>
                        {chain.status === "VERIFIED" ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            ✓ VERIFIED Маตรฐานกลาง
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                            ⏳ AI สร้างใหม่ (รอซิงก์เข้า L3)
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 font-semibold">
                          Source: {chain.source} • ค้นหา {chain.searchCount} ครั้ง
                        </span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-3 pt-1">
                        <h3 className="text-base font-black text-gray-900">{chain.productName}</h3>
                        <span className="text-xs text-gray-500">
                          ({chain.baseUnitReference} • ต้นน้ำ{" "}
                          <strong className="text-gray-800">฿{chain.originCostThb.toLocaleString()}</strong> →
                          ปลายน้ำ{" "}
                          <strong className="text-brand-red">฿{chain.finalRetailValueThb.toLocaleString()}</strong>{" "}
                          | Markup +{chain.totalMarkupPercent}%)
                        </span>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleVerifyAndSync(chain.id)}
                        disabled={isBusy}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-2xs"
                        title="อนุมัติผังสินค้าและซิงก์อาชีพ/ทักษะในโหนดทั้งหมดเข้าสู่ตาราง Occupation และ SkillTag (Layer 3)"
                      >
                        <i className="fa-solid fa-check-double text-[11px]"></i>
                        <span>
                          {chain.status === "VERIFIED"
                            ? "ซิงก์อาชีพ/ทักษะเข้า L3 ซ้ำ"
                            : "อนุมัติ + ซิงก์อาชีพเข้า L3"}
                        </span>
                      </button>

                      <button
                        onClick={() => toggleExpand(chain.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <i
                          className={`fa-solid ${
                            isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                          } text-[10px] text-brand-red`}
                        ></i>
                        <span>
                          {isExpanded ? "ซ่อนผัง 5 โหนด" : `ดูผัง 5 โหนด (${chain.nodes.length})`}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteChain(chain.id, chain.productName)}
                        disabled={isBusy}
                        className="p-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-brand-red text-xs transition-colors cursor-pointer"
                        title="ลบผังสินค้านี้"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>

                  {/* Expanded 5-Node Vertical Supply Chain Details */}
                  {isExpanded && (
                    <div className="p-4 border-t border-gray-100 space-y-3 bg-white">
                      {chain.nodes.map((node) => {
                        const stageMeta = STAGE_BADGE[node.stageType] || {
                          label: `0${node.nodeOrder} โหนด`,
                          color: "bg-gray-100 text-gray-700 border-gray-200",
                        };
                        return (
                          <div
                            key={node.id}
                            className="rounded-2xl border border-gray-200/80 p-4 bg-gray-50/40 space-y-3"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border ${stageMeta.color}`}
                                >
                                  {stageMeta.label}
                                </span>
                                <h4 className="text-sm font-black text-gray-900">{node.nodeTitle}</h4>
                                <span className="text-xs text-gray-500">
                                  (ต้นทุน ฿{node.costThb.toLocaleString()} → ขายส่ง ฿
                                  {node.sellingThb.toLocaleString()} | กระโดด +{node.marginJumpPercent}%)
                                </span>
                              </div>

                              <button
                                onClick={() => handleCreateBountyFromNode(node.id)}
                                disabled={busyId === node.id}
                                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors flex items-center gap-1.5 self-start md:self-center cursor-pointer"
                              >
                                <i className="fa-solid fa-bolt text-[10px]"></i>
                                <span>เปิดภารกิจแก้คอขวดโหนดนี้ (Bounty)</span>
                              </button>
                            </div>

                            {/* Pain Point Box */}
                            <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100 text-xs text-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="font-extrabold text-brand-red">
                                  ⚠️ Pain Point / คอขวดเจ้าตลาด ({node.whoIncumbent}):{" "}
                                </span>
                                <span>{node.painPoint}</span>
                              </div>
                              {node.linkedProblems.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-brand-red text-white text-[10px] font-extrabold shrink-0">
                                  เชื่อม {node.linkedProblems.length} ProblemNode แล้ว
                                </span>
                              )}
                            </div>

                            {/* Micro-Opportunities Linked to L1 WorkType & L3 Occupation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {node.opportunities.map((opp) => (
                                <div
                                  key={opp.id}
                                  className="p-3 rounded-xl bg-white border border-gray-200/80 space-y-1.5"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                                      <i className="fa-solid fa-bullseye text-brand-red text-[11px]"></i>
                                      {opp.modelName}
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                      ทุน {opp.capitalRequiredThb} บาท • กำไร {opp.expectedMarginPercent}%
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-600">{opp.howToStart}</p>
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-gray-100 text-[10px]">
                                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold">
                                      L1: {opp.workType?.name || "ผู้ประกอบการ/ฟรีแลนซ์"}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-red-50 text-brand-red font-bold border border-red-100">
                                      L3 อาชีพ: {opp.occupation?.name || "กดปุ่มซิงก์เพื่อบรรจุเข้า L3"}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-medium">
                                      อาวุธทักษะ: {opp.skillsNeeded}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
