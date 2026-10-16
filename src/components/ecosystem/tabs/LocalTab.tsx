'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PIPELINE_TABS } from '../pipelineConstants';
import { StepScopeView } from '../pipeline/StepScopeView';
import { ALL_SUB_INDUSTRIES } from '../allSubIndustries';
import { INDUSTRIES_LIST } from '../constants';
import { SEED_CHAINS } from '../production/seed';
import { STAGE_META } from '../production/types';
import {
  CrossTabBridgePayload,
  NearbyFactoryPin,
  THAILAND_ZONES,
  generateNearbyFactoriesForChain,
} from '../production/crossTabBridge';
import {
  MapPin,
  Navigation,
  Factory,
  Package,
  Sprout,
  FlaskConical,
  Recycle,
  CheckCircle2,
  Star,
  Bookmark,
  Send,
  Plus,
  ArrowLeft,
  Wallet,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

interface LocalTabProps {
  selectedIndustryId: string;
  selectedSubIndustryId: string;
  selectedSegmentId: string;
  onSelectIndustry: (indId: string) => void;
  onSelectSubIndustry: (subId: string) => void;
  onSelectSegment: (segId: string) => void;
  productionBridge?: CrossTabBridgePayload | null;
  onBackToProduction?: () => void;
  onSendFactoryMoqToCapital?: (payload: CrossTabBridgePayload) => void;
}

export const LocalTab: React.FC<LocalTabProps> = ({
  selectedIndustryId,
  selectedSubIndustryId,
  selectedSegmentId,
  onSelectIndustry,
  onSelectSubIndustry,
  onSelectSegment,
  productionBridge,
  onBackToProduction,
  onSendFactoryMoqToCapital,
}) => {
  // Jump straight to Step 2 (Geo-Radar Factory Pin Map) when arriving from [หาคู่ค้า]
  const [activeStep, setActiveStep] = useState<number>(productionBridge ? 2 : 2);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('bkk_metro');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(30);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [activePinId, setActivePinId] = useState<string>('');
  const [pinnedIds, setPinnedIds] = useState<Record<string, boolean>>({});
  const [customPins, setCustomPins] = useState<NearbyFactoryPin[]>([]);

  // Modal states
  const [rfqTarget, setRfqTarget] = useState<NearbyFactoryPin | null>(null);
  const [rfqNote, setRfqNote] = useState<string>('');
  const [rfqQty, setRfqQty] = useState<string>('100');
  const [rfqSubmittedId, setRfqSubmittedId] = useState<string | null>(null);

  const [showAddPinModal, setShowAddPinModal] = useState<boolean>(false);
  const [newPinName, setNewPinName] = useState<string>('');
  const [newPinArea, setNewPinArea] = useState<string>('');
  const [newPinMoq, setNewPinMoq] = useState<string>('5000');

  const activeChain = productionBridge?.chain || SEED_CHAINS.coffee;
  const activeNode =
    productionBridge?.node || activeChain.supply_chain_nodes[2];
  const activeOpp =
    productionBridge?.opp || activeNode.micro_opportunities[0];

  // Generate context-aware factory pins
  const generatedPins = useMemo(() => {
    const base = generateNearbyFactoriesForChain(
      activeChain,
      activeNode,
      activeOpp,
      selectedZoneId
    );
    return [...customPins, ...base];
  }, [activeChain, activeNode, activeOpp, selectedZoneId, customPins]);

  // Auto-pin the primary matched factories when bridged from ProductionTab
  useEffect(() => {
    if (productionBridge) {
      setActiveStep(2);
    }
    const initialPinned: Record<string, boolean> = {};
    generatedPins.forEach((p) => {
      if (p.isPrimaryMatch) {
        initialPinned[p.id] = true;
      }
    });
    setPinnedIds((prev) => ({ ...initialPinned, ...prev }));
    if (generatedPins.length > 0) {
      setActivePinId(generatedPins[0].id);
    }
  }, [productionBridge?.timestamp, activeChain.product.product_id, selectedZoneId]);

  const filteredPins = useMemo(() => {
    return generatedPins.filter((p) => {
      if (p.distanceKm > maxRadiusKm) return false;
      if (filterType === 'PRIMARY') return p.isPrimaryMatch;
      if (filterType === 'PINNED') return !!pinnedIds[p.id];
      if (filterType !== 'ALL' && p.facilityType !== filterType) return false;
      return true;
    });
  }, [generatedPins, maxRadiusKm, filterType, pinnedIds]);

  const selectedPin =
    filteredPins.find((p) => p.id === activePinId) ||
    filteredPins[0] ||
    generatedPins[0];

  const pinnedCount = Object.values(pinnedIds).filter(Boolean).length;

  const togglePinPartner = (id: string) => {
    setPinnedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCustomPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinName.trim()) return;
    const customPin: NearbyFactoryPin = {
      id: `custom_pin_${Date.now()}`,
      name: newPinName.trim(),
      facilityType: 'OEM_FACTORY',
      facilityTypeLabel: 'คู่ค้า/โรงงานที่ปักหมุดเพิ่มเอง',
      stageType: activeNode.stage_type,
      matchedNodeOrder: activeNode.node_order,
      matchedNodeTitle: activeNode.node_title,
      distanceKm: 1.8,
      driveMinutes: 5,
      zoneName:
        THAILAND_ZONES.find((z) => z.id === selectedZoneId)?.shortName ||
        'ใกล้บ้าน',
      addressHint: newPinArea.trim() || 'พิกัดใกล้บ้านที่คุณระบุเอง',
      moqLabel: 'ตามตกลงหน้างาน / รับงานด่วนใกล้บ้าน',
      moqCostThb: Number(newPinMoq) || 5000,
      unitPriceLabel: 'ราคาตกลงโดยตรงไม่ผ่านคนกลาง',
      rating: 5.0,
      reviewCount: 1,
      verifiedPartner: true,
      specialties: ['คู่ค้าท้องถิ่นใกล้บ้าน', activeChain.product.product_name],
      radarX: 18,
      radarY: -12,
      isPrimaryMatch: true,
    };
    setCustomPins((prev) => [customPin, ...prev]);
    setPinnedIds((prev) => ({ ...prev, [customPin.id]: true }));
    setActivePinId(customPin.id);
    setNewPinName('');
    setNewPinArea('');
    setShowAddPinModal(false);
  };

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqTarget) return;
    setRfqSubmittedId(rfqTarget.id);
    setPinnedIds((prev) => ({ ...prev, [rfqTarget.id]: true }));
    setTimeout(() => {
      setRfqTarget(null);
    }, 900);
  };

  const getFacilityIcon = (type: NearbyFactoryPin['facilityType']) => {
    switch (type) {
      case 'RAW_MATERIAL':
        return <Sprout className="w-3.5 h-3.5 text-emerald-500" />;
      case 'LAB_CERT':
        return <FlaskConical className="w-3.5 h-3.5 text-purple-500" />;
      case 'PACKAGING_EQUIP':
        return <Package className="w-3.5 h-3.5 text-amber-500" />;
      case 'LOGISTICS_BYPRODUCT':
        return <Recycle className="w-3.5 h-3.5 text-teal-500" />;
      default:
        return <Factory className="w-3.5 h-3.5 text-[#E53935]" />;
    }
  };

  const currentIndustry = INDUSTRIES_LIST.find((i) => i.id === selectedIndustryId);
  const currentSubIndustries = ALL_SUB_INDUSTRIES[selectedIndustryId] || [];
  const activeSubIndustry = currentSubIndustries.find(
    (s) => s.id === selectedSubIndustryId
  );

  return (
    <div className="flex-1 flex w-full h-full font-prompt bg-white dark:bg-[#12141a] overflow-hidden">
      {/* Left Sidebar (12 Pipeline Steps) */}
      <div className="w-[56px] sm:w-[62px] shrink-0 bg-[#f8f9fa] dark:bg-[#16181f] overflow-y-auto pb-24 border-r border-gray-100 dark:border-gray-800/80 scrollbar-none flex flex-col">
        {PIPELINE_TABS.map((tab) => {
          const isActive = activeStep === tab.id;
          const isStep1 = tab.id === 1;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveStep(tab.id)}
              className={`w-full flex flex-col items-center justify-center border-l-[2.5px] transition-all text-center relative ${
                isStep1 ? 'py-2 px-0.5 min-h-[58px]' : 'py-3 px-0.5 min-h-[44px]'
              } ${
                isActive
                  ? 'border-brand-red bg-white dark:bg-[#12141a] text-brand-red font-bold shadow-2xs'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-[#1e2129]'
              }`}
              title={isStep1 ? `${tab.code} หาตัวตน` : `ขั้นตอน ${tab.code}`}
            >
              {isStep1 ? (
                <>
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center mb-0.5 text-[10px] transition-colors ${
                      isActive
                        ? 'bg-red-50 text-brand-red dark:bg-red-950/50'
                        : 'bg-gray-200/60 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <i className={tab.icon}></i>
                  </span>
                  <span className="text-[8px] font-mono leading-none text-gray-400 dark:text-gray-500 mb-0.5">
                    {tab.code}
                  </span>
                  <span
                    className={`text-[8px] sm:text-[8.5px] leading-[1.15] px-0.5 line-clamp-2 ${
                      isActive ? 'text-brand-red font-bold' : ''
                    }`}
                  >
                    หาตัวตน
                  </span>
                </>
              ) : (
                <span
                  className={`font-mono transition-all ${
                    isActive
                      ? 'text-xs sm:text-[13px] font-black text-brand-red scale-110'
                      : 'text-xs sm:text-[11.5px] font-bold text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {tab.code}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto pb-24 bg-white dark:bg-[#12141a]">
        {activeStep === 1 ? (
          <StepScopeView
            selectedIndustryId={selectedIndustryId}
            selectedSubIndustryId={selectedSubIndustryId}
            selectedSegmentId={selectedSegmentId}
            onSelectIndustry={onSelectIndustry}
            onSelectSubIndustry={onSelectSubIndustry}
            onSelectSegment={onSelectSegment}
            onNextStep={() => setActiveStep(2)}
            nextButtonLabel="ถัดไป: เปิดเรดาร์ปักหมุดโรงงานใกล้บ้าน (02)"
            step1PromptLine1="ต้นน้ำ-ปลายน้ำ คุณเป็นใครได้บ้าง ฉันจะแสดงให้คุณดู"
            step1PromptLine2="เลือกวงการเพื่อค้นหาโรงงานและคู่ค้าใกล้ตัว"
          />
        ) : (
          <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-4 animate-fadeIn">
            {/* =============================================================== */}
            {/* Cross-Tab Context Header Banner                                 */}
            {/* =============================================================== */}
            <div className="rounded-2xl border-2 border-blue-600/80 bg-gradient-to-br from-blue-50/90 via-white to-emerald-50/40 dark:from-blue-950/30 dark:via-[#181a20] dark:to-emerald-950/20 p-3.5 shadow-sm space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                    <MapPin className="w-3 h-3" />
                    <span>Geo-Radar ปักหมุดคู่ค้าใกล้บ้าน</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    📌 ปักหมุดแล้ว {pinnedCount} แห่ง
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {onBackToProduction && (
                    <button
                      type="button"
                      onClick={onBackToProduction}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#E53935] text-gray-700 dark:text-gray-200 text-[10.5px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>กลับไปโหนดผลิต</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowAddPinModal(true)}
                    className="px-2.5 py-1 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-gray-900 text-[10.5px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>ปักหมุดโรงงานเพิ่มเอง</span>
                  </button>
                </div>
              </div>

              {/* Active Product & Node Mission Info */}
              <div className="rounded-xl bg-white/95 dark:bg-[#12141a]/95 border border-gray-200/80 dark:border-gray-800 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-400 font-semibold">
                    สินค้าเป้าหมาย:{' '}
                    <span className="text-gray-800 dark:text-white font-bold">
                      {activeChain.product.product_name}
                    </span>
                    {currentIndustry ? ` • ${currentIndustry.name}` : ''}
                    {activeSubIndustry ? ` (${activeSubIndustry.name})` : ''}
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white mt-0.5">
                    {STAGE_META[activeNode.stage_type].emoji} โหนด{' '}
                    {activeNode.node_order}: {activeNode.node_title}
                  </h3>
                  <p className="text-[11px] font-bold text-blue-600 dark:text-sky-400 mt-0.5">
                    🎯 ภารกิจหาคู่ค้า: {activeOpp.action_links.go_to_nearby_tab}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right bg-gray-50 dark:bg-gray-800/70 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="text-[9.5px] text-gray-400">สถานที่ตามผัง 5W2H</div>
                  <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200">
                    {activeNode.five_w_two_h.where}
                  </div>
                </div>
              </div>

              {/* Zone & Radius Filter Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                    📍 โซนพื้นที่ของคุณ:
                  </span>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#14161b] text-gray-900 dark:text-white"
                  >
                    {THAILAND_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-500 mr-1">
                    รัศมี:
                  </span>
                  {[5, 15, 30].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMaxRadiusKm(r)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                        maxRadiusKm === r
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      ≤ {r} กม.
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =============================================================== */}
            {/* Interactive Geo-Radar Pin Map                                   */}
            {/* =============================================================== */}
            <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-[#0f172a] text-white overflow-hidden shadow-lg relative">
              {/* Map Top Overlay Bar */}
              <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-slate-200">
                    เรดาร์พิกัดโรงงานและซัพพลายเออร์รอบบ้าน ({filteredPins.length} แห่งในรัศมี {maxRadiusKm} กม.)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] inline-block" />{' '}
                    ตรงกับโหนดที่เลือก
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />{' '}
                    โหนดข้างเคียงในสายพาน
                  </span>
                </div>
              </div>

              {/* Radar Canvas Area */}
              <div className="relative h-[270px] sm:h-[310px] w-full flex items-center justify-center overflow-hidden select-none bg-[radial-gradient(circle_at_center,#1e293b_0%,#0f172a_75%)]">
                {/* Concentric Radar Rings */}
                <div className="w-[110px] h-[110px] rounded-full border border-emerald-500/25 absolute pointer-events-none flex items-start justify-center pt-1">
                  <span className="text-[8px] font-mono text-emerald-400/70">5 กม.</span>
                </div>
                <div className="w-[210px] h-[210px] rounded-full border border-sky-500/20 absolute pointer-events-none flex items-start justify-center pt-1">
                  <span className="text-[8px] font-mono text-sky-400/60">15 กม.</span>
                </div>
                <div className="w-[310px] h-[310px] rounded-full border border-slate-600/30 border-dashed absolute pointer-events-none flex items-start justify-center pt-1">
                  <span className="text-[8px] font-mono text-slate-500">30 กม.</span>
                </div>

                {/* Crosshair Grid Lines */}
                <div className="w-full h-[1px] bg-slate-800/80 absolute pointer-events-none" />
                <div className="h-full w-[1px] bg-slate-800/80 absolute pointer-events-none" />

                {/* Center User Home Pin */}
                <div className="z-20 flex flex-col items-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 border-white">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-black/80 text-[9px] font-bold text-emerald-300 border border-emerald-500/40">
                    🏠 บ้านของคุณ ({THAILAND_ZONES.find((z) => z.id === selectedZoneId)?.shortName})
                  </span>
                </div>

                {/* Factory Pins on Radar */}
                {filteredPins.map((pin) => {
                  const isSelected = selectedPin?.id === pin.id;
                  const isPinned = !!pinnedIds[pin.id];
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => setActivePinId(pin.id)}
                      style={{
                        left: `calc(50% + ${pin.radarX * 1.35}px)`,
                        top: `calc(50% + ${pin.radarY * 1.15}px)`,
                      }}
                      className={` -translate-x-1/2 -translate-y-1/2 absolute transition-all duration-200 group ${
                        isSelected ? 'z-30 scale-115' : 'z-10 hover:scale-110'
                      }`}
                    >
                      {pin.isPrimaryMatch && (
                        <span className="w-9 h-9 rounded-full bg-[#E53935]/40 animate-ping absolute -inset-1 pointer-events-none" />
                      )}
                      <div
                        className={`relative flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold shadow-lg whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#E53935] text-white border-white ring-2 ring-red-400'
                            : pin.isPrimaryMatch
                            ? 'bg-red-950/95 text-red-200 border-[#E53935]'
                            : 'bg-slate-900/95 text-sky-200 border-sky-500/60'
                        }`}
                      >
                        <span>{isPinned ? '📌' : '📍'}</span>
                        <span className="max-w-[115px] truncate">
                          โหนด {pin.matchedNodeOrder} • {pin.distanceKm} กม.
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Pin Quick Spotlight Footer inside Map */}
              {selectedPin && (
                <div className="px-4 py-3 bg-slate-900/95 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold">
                      <span>
                        {selectedPin.isPrimaryMatch
                          ? '🎯 โรงงานเป้าหมายตรงกับโหนดที่เลือก'
                          : '📍 คู่ค้าในห่วงโซ่เดียวกัน'}
                      </span>
                      <span>•</span>
                      <span>
                        ห่าง {selectedPin.distanceKm} กม. (ขับรถประมาณ{' '}
                        {selectedPin.driveMinutes} นาที)
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
                      {selectedPin.name}
                    </div>
                    <div className="text-[10.5px] text-slate-400 truncate">
                      {selectedPin.addressHint} • {selectedPin.moqLabel}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => togglePinPartner(selectedPin.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                        pinnedIds[selectedPin.id]
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>
                        {pinnedIds[selectedPin.id]
                          ? 'ปักหมุดไว้แล้ว ✓'
                          : 'ปักหมุดคู่ค้านี้'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRfqTarget(selectedPin);
                        setRfqNote(
                          `สนใจสั่งผลิต/ขอตัวอย่างสำหรับ "${activeChain.product.product_name}" (${activeOpp.model_name})`
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>ขอใบเสนอราคา/Sample</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* =============================================================== */}
            {/* Filter Pills & Factory Directory List                           */}
            {/* =============================================================== */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {[
                { id: 'ALL', label: `ทั้งหมด (${generatedPins.length})` },
                { id: 'PRIMARY', label: `🎯 ตรงกับโหนด ${activeNode.node_order}` },
                { id: 'PINNED', label: `📌 ที่ปักหมุดไว้ (${pinnedCount})` },
                { id: 'OEM_FACTORY', label: '🏭 โรงงาน OEM' },
                { id: 'PACKAGING_EQUIP', label: '📦 แพ็กเกจจิ้ง/อุปกรณ์' },
                { id: 'RAW_MATERIAL', label: '🌱 วัตถุดิบต้นน้ำ' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                    filterType === f.id
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-2xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Pinned Factory Cards */}
            <div className="space-y-3">
              {filteredPins.map((pin) => {
                const isPinned = !!pinnedIds[pin.id];
                const isSelected = selectedPin?.id === pin.id;
                const isRfqSent = rfqSubmittedId === pin.id;

                return (
                  <div
                    key={pin.id}
                    onClick={() => setActivePinId(pin.id)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-[#E53935] bg-red-50/20 dark:bg-red-950/15 shadow-md'
                        : isPinned
                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-[#181a20]'
                        : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181a20] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-[10px] font-bold">
                            {getFacilityIcon(pin.facilityType)}
                            <span>{pin.facilityTypeLabel}</span>
                          </span>

                          {pin.isPrimaryMatch && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E53935] text-white text-[9.5px] font-bold">
                              🎯 ตรงกับโหนด {pin.matchedNodeOrder} ที่เลือก
                            </span>
                          )}

                          {isPinned && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[9.5px] font-bold">
                              📌 ปักหมุดเป็นคู่ค้าใกล้บ้านแล้ว
                            </span>
                          )}

                          {pin.verifiedPartner && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-sky-400">
                              <CheckCircle2 className="w-3 h-3" /> ยืนยันตัวตน DOT
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                          {pin.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          📍 {pin.addressHint}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                        <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-sky-300 text-xs font-black font-mono">
                          ห่าง {pin.distanceKm} กม.
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {pin.rating} ({pin.reviewCount} รีวิว)
                        </span>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-gray-50 dark:bg-[#14161b] p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <span className="text-[9.5px] text-gray-400 block">
                          ขั้นต่ำการสั่งผลิต/ซื้อ (MOQ):
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {pin.moqLabel} (งบเริ่ม ~฿{pin.moqCostThb.toLocaleString()})
                        </span>
                      </div>
                      <div>
                        <span className="text-[9.5px] text-gray-400 block">
                          ช่วงราคาประเมิน:
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {pin.unitPriceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Specialties Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {pin.specialties.map((sp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-300"
                        >
                          ✓ {sp}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinPartner(pin.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                            isPinned
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>
                            {isPinned ? 'ปักหมุดไว้แล้ว ✓' : '📌 ปักหมุดโรงงานนี้'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRfqTarget(pin);
                            setRfqNote(
                              `สนใจสั่งผลิต/ขอตัวอย่างสำหรับ "${activeChain.product.product_name}" (${activeOpp.model_name})`
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>
                            {isRfqSent
                              ? 'ส่งคำขอ Sample แล้ว ✓'
                              : 'ขอใบเสนอราคา / สั่ง Sample'}
                          </span>
                        </button>
                      </div>

                      {onSendFactoryMoqToCapital && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSendFactoryMoqToCapital({
                              targetTab: 'CAPITAL',
                              timestamp: Date.now(),
                              chain: activeChain,
                              node: activeNode,
                              opp: activeOpp,
                              oppKey:
                                productionBridge?.oppKey ||
                                `${activeNode.node_order}-0`,
                              customCashThb: pin.moqCostThb,
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-gray-900 text-[10.5px] font-bold flex items-center gap-1.5"
                          title="ส่งยอดขั้นต่ำของโรงงานนี้ไปตั้งตารางหุ้นในแท็บ ทำทุน"
                        >
                          <Wallet className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                          <span>
                            ส่งงบขั้นต่ำ ฿{pin.moqCostThb.toLocaleString()} ไปตั้งตารางหุ้น (ทำทุน)
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* Modal: Request Quotation / Sample Order                             */}
      {/* =================================================================== */}
      {rfqTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>ส่งคำขอใบเสนอราคา / ทดลองสั่ง Sample</span>
              </h3>
              <button
                onClick={() => setRfqTarget(null)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRfq} className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
                <div className="font-bold text-blue-800 dark:text-sky-300">
                  {rfqTarget.name}
                </div>
                <div className="text-[10.5px] text-gray-500 dark:text-gray-400 mt-0.5">
                  ระยะทาง {rfqTarget.distanceKm} กม. • {rfqTarget.moqLabel}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  รายละเอียดสเปกสินค้าที่ต้องการให้โรงงานเสนอราคา
                </label>
                <textarea
                  rows={3}
                  value={rfqNote}
                  onChange={(e) => setRfqNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  จำนวนล็อตแรกที่สนใจสั่งทดลอง (หน่วย)
                </label>
                <input
                  type="number"
                  value={rfqQty}
                  onChange={(e) => setRfqQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRfqTarget(null)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  ส่งคำขอและปักหมุดคู่ค้า ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* Modal: Add Custom Factory Pin                                       */}
      {/* =================================================================== */}
      {showAddPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E53935]" />
                <span>ปักหมุดโรงงาน/ซัพพลายเออร์ใกล้บ้านเพิ่มเอง</span>
              </h3>
              <button
                onClick={() => setShowAddPinModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomPin} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  ชื่อโรงงาน / ร้านค้าส่ง / ซัพพลายเออร์ใกล้บ้าน
                </label>
                <input
                  type="text"
                  required
                  placeholder={`เช่น โรงงานรับผลิต ${activeChain.product.product_name} ซอยใกล้บ้าน`}
                  value={newPinName}
                  onChange={(e) => setNewPinName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  พิกัด / ย่าน / ถนน
                </label>
                <input
                  type="text"
                  placeholder="เช่น ถนนบางนา-ตราด กม.12 ห่างจากบ้าน 2 กม."
                  value={newPinArea}
                  onChange={(e) => setNewPinArea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  งบสั่งซื้อขั้นต่ำโดยประมาณ (บาท)
                </label>
                <input
                  type="number"
                  value={newPinMoq}
                  onChange={(e) => setNewPinMoq(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPinModal(false)}
                  className="px-4 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold shadow-sm"
                >
                  📌 ปักหมุดลงเรดาร์ทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
