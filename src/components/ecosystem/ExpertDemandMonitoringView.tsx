'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface RequesterInfo {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  trustScore: number;
  role: string;
}

interface TargetItem {
  id?: string;
  name: string;
}

interface ProblemBounty {
  id: string;
  rawDescription: string;
  problemCategory: string | null;
  status: string;
  urgencyState: string;
  bountyType: string;
  bountyPrizeSatang: number;
  bountyDescription: string | null;
  requester: RequesterInfo | null;
  requesterIndustryName: string;
  requesterWorkTypeName: string;
  targetOccupations: TargetItem[];
  targetSkills: TargetItem[];
  customTags: string[];
  isTagged: boolean;
  solver: { id: string; name: string | null; image: string | null; email: string | null } | null;
  upgradeProposalsCount: number;
  upgradeProposals: any[];
  resourcesCount: number;
  matchLogs: any[];
  createdAt: string;
}

interface AnalyticsSummary {
  totalBounties: number;
  taggedCount: number;
  taggedPercentage: number;
  totalPrizeSatang: number;
  totalPrizeTHB: number;
  statusCounts: Record<string, number>;
  urgencyCounts: Record<string, number>;
  rewardTypeCounts: Record<string, number>;
  requesterIndustryCounts: Record<string, number>;
}

interface RankedItem {
  name: string;
  count: number;
  percentage: number;
  industryName?: string;
}

interface ExpertDemandMonitoringViewProps {
  standalone?: boolean;
}

export const ExpertDemandMonitoringView: React.FC<ExpertDemandMonitoringViewProps> = ({
  standalone = false,
}) => {
  const [bounties, setBounties] = useState<ProblemBounty[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topOccupations, setTopOccupations] = useState<RankedItem[]>([]);
  const [topSkills, setTopSkills] = useState<RankedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DRILLDOWN'>('OVERVIEW');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOccupationFilter, setSelectedOccupationFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedUrgencyFilter, setSelectedUrgencyFilter] = useState('ALL');

  // Selected bounty for deep audit modal
  const [inspectBounty, setInspectBounty] = useState<ProblemBounty | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/expert-monitoring', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setBounties(data.bounties || []);
        setSummary(data.summary || null);
        setTopOccupations(data.topOccupations || []);
        setTopSkills(data.topSkills || []);
      }
    } catch (err) {
      console.error('Failed to fetch expert monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered bounties for drilldown
  const filteredBounties = useMemo(() => {
    return bounties.filter((b) => {
      // Keyword search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesDesc = b.rawDescription?.toLowerCase().includes(term);
        const matchesRequester =
          b.requester?.name?.toLowerCase().includes(term) ||
          b.requester?.email?.toLowerCase().includes(term);
        const matchesOcc = b.targetOccupations.some((o) => o.name.toLowerCase().includes(term));
        const matchesSkill = b.targetSkills.some((s) => s.name.toLowerCase().includes(term));
        const matchesIndustry = b.requesterIndustryName.toLowerCase().includes(term);
        if (!matchesDesc && !matchesRequester && !matchesOcc && !matchesSkill && !matchesIndustry) {
          return false;
        }
      }

      // Occupation filter
      if (selectedOccupationFilter !== 'ALL') {
        const hasOcc = b.targetOccupations.some((o) => o.name === selectedOccupationFilter);
        if (!hasOcc) return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'ALL') {
        if (b.status !== selectedStatusFilter) return false;
      }

      // Urgency filter
      if (selectedUrgencyFilter !== 'ALL') {
        if (b.urgencyState !== selectedUrgencyFilter) return false;
      }

      return true;
    });
  }, [bounties, searchTerm, selectedOccupationFilter, selectedStatusFilter, selectedUrgencyFilter]);

  // Unique occupations for filter dropdown
  const uniqueOccupations = useMemo(() => {
    const set = new Set<string>();
    bounties.forEach((b) => {
      b.targetOccupations.forEach((o) => set.add(o.name));
    });
    return Array.from(set);
  }, [bounties]);

  return (
    <div className="w-full space-y-4 font-prompt">
      {/* Header Banner - Swiss Style */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              <i className="fa-solid fa-chart-line text-[9px]"></i> ศูนย์ข้อมูลดีมานด์ผู้เชี่ยวชาญ
            </span>
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition text-xs"
              title="รีเฟรชข้อมูล"
            >
              <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
            </button>
          </div>
          <h2 className="text-base sm:text-lg font-black text-white leading-tight">
            มอนิเตอร์ดีมานด์ผู้เชี่ยวชาญ
          </h2>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            ดูความต้องการของ Requester (อาชีพ, ทักษะเฉพาะทาง Step 5) เพื่อปรับกลยุทธ์แพลตฟอร์มแบบเรียลไทม์
          </p>
        </div>
        <i className="fa-solid fa-user-gear absolute -right-3 -bottom-3 text-7xl text-white/10 pointer-events-none"></i>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl flex items-center shadow-inner">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'OVERVIEW'
              ? 'bg-white dark:bg-[#1e2329] text-gray-900 dark:text-white shadow-xs'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <i className="fa-solid fa-chart-pie text-[11px]"></i>
          ภาพรวม & สถิติ
        </button>
        <button
          onClick={() => setActiveTab('DRILLDOWN')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'DRILLDOWN'
              ? 'bg-white dark:bg-[#1e2329] text-gray-900 dark:text-white shadow-xs'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          <i className="fa-solid fa-list-check text-[11px]"></i>
          รายละเอียดยิบย่อย
          <span className="bg-brand-red text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
            {bounties.length}
          </span>
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white dark:bg-[#181a1f] rounded-2xl border border-gray-100 dark:border-gray-800">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-red mb-2"></i>
          <p className="text-xs font-medium">กำลังรวบรวมข้อมูลดีมานด์ผู้เชี่ยวชาญ...</p>
        </div>
      ) : activeTab === 'OVERVIEW' ? (
        <div className="space-y-4 animate-fade-in">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Total Quests */}
            <div className="bg-brand-black text-white p-3.5 rounded-2xl shadow-xs relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  เควสต์ทั้งหมด
                </p>
                <p className="text-xl font-black">
                  {summary?.totalBounties || 0}{' '}
                  <span className="text-xs font-normal text-gray-400">งาน</span>
                </p>
                <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                  <i className="fa-solid fa-check mr-1"></i>ในระบบทั้งหมด
                </p>
              </div>
              <i className="fa-solid fa-layer-group absolute -right-2 -bottom-2 text-4xl text-white/5"></i>
            </div>

            {/* Tagged Rate */}
            <div className="bg-red-50 dark:bg-brand-red/10 border border-red-100 dark:border-brand-red/20 p-3.5 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] text-brand-red font-bold uppercase tracking-wider mb-0.5">
                  ระบุผู้เชี่ยวชาญแล้ว
                </p>
                <p className="text-xl font-black text-brand-red">
                  {summary?.taggedPercentage || 0}%
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {summary?.taggedCount || 0} จาก {summary?.totalBounties || 0} งาน
                </p>
              </div>
              <i className="fa-solid fa-user-tag absolute -right-2 -bottom-2 text-4xl text-brand-red/10"></i>
            </div>

            {/* Total Prize Pool */}
            <div className="bg-gray-50 dark:bg-[#181a1f] border border-gray-100 dark:border-gray-800 p-3.5 rounded-2xl">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                งบค่าตอบแทนรวม
              </p>
              <p className="text-base font-black text-gray-900 dark:text-white font-mono">
                ฿{((summary?.totalPrizeSatang || 0) / 100).toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                สะสมในเควสต์เงินสด
              </p>
            </div>

            {/* Pending Matching */}
            <div className="bg-gray-50 dark:bg-[#181a1f] border border-gray-100 dark:border-gray-800 p-3.5 rounded-2xl">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                รอผู้เชี่ยวชาญ
              </p>
              <p className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                {summary?.statusCounts?.['OPEN'] || 0}{' '}
                <span className="text-xs font-normal text-gray-400">เควสต์</span>
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                พร้อมสำหรับการ Match
              </p>
            </div>
          </div>

          {/* Top Requested Occupations */}
          <section className="bg-white dark:bg-[#181a1f] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-red-50 dark:bg-brand-red/10 text-brand-red flex items-center justify-center text-[10px]">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  อาชีพที่ต้องการตัวมากที่สุด (Top Occupations)
                </h3>
              </div>
              <span className="text-[9px] text-gray-400 font-medium">Step 5</span>
            </div>

            {topOccupations.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">ยังไม่มีข้อมูลการระบุอาชีพในเควสต์</p>
            ) : (
              <div className="space-y-2.5">
                {topOccupations.slice(0, 5).map((item, idx) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5 truncate pr-2">
                        <span className="w-4 text-[10px] font-bold text-gray-400">#{idx + 1}</span>
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="text-brand-red shrink-0 font-mono text-[11px]">
                        {item.count} งาน{' '}
                        <span className="text-[9px] text-gray-400 font-normal">({item.percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(item.percentage, 8)}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                        className="bg-brand-red h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Top Requested Skills */}
          <section className="bg-white dark:bg-[#181a1f] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center text-[10px]">
                <i className="fa-solid fa-tags"></i>
              </div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                ทักษะเฉพาะทางที่ถูกแท็กสูงสุด (Top Skills)
              </h3>
            </div>

            {topSkills.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">ยังไม่มีข้อมูลการระบุทักษะ</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {topSkills.slice(0, 10).map((sk) => (
                  <span
                    key={sk.name}
                    className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 text-[11px] px-2.5 py-1 rounded-full font-medium"
                  >
                    <i className="fa-solid fa-check text-[8px] text-brand-red"></i>
                    {sk.name}
                    <span className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-gray-100 dark:border-gray-600">
                      {sk.count}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Reward Breakdown & Requester Industry */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Reward Type */}
            <div className="bg-white dark:bg-[#181a1f] rounded-2xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <i className="fa-solid fa-coins text-amber-500 text-xs"></i>
                <h4 className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">
                  รูปแบบผลตอบแทน
                </h4>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[11px]">เงินสด (Cash)</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                    {summary?.rewardTypeCounts?.['CASH'] || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[11px]">ส่วนแบ่ง (Rev-Share)</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                    {summary?.rewardTypeCounts?.['REV_SHARE'] || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-[11px]">แลกเปลี่ยนสิ่งของ</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                    {summary?.rewardTypeCounts?.['RESOURCE_SWAP'] || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Requester Industry */}
            <div className="bg-white dark:bg-[#181a1f] rounded-2xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-xs">
              <div className="flex items-center gap-1.5 mb-2">
                <i className="fa-solid fa-building text-indigo-500 text-xs"></i>
                <h4 className="text-[10px] font-bold text-gray-800 dark:text-gray-200 uppercase">
                  วงการผู้แจ้ง (Step 3)
                </h4>
              </div>
              <div className="space-y-1 text-xs">
                {Object.entries(summary?.requesterIndustryCounts || {})
                  .slice(0, 3)
                  .map(([ind, count]) => (
                    <div key={ind} className="flex justify-between">
                      <span className="text-gray-500 truncate max-w-[85px] text-[11px]" title={ind}>
                        {ind}
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px]">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: DETAILED DRILLDOWN */
        <div className="space-y-3 animate-fade-in">
          {/* Search & Filter Bar */}
          <div className="space-y-2">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-xs"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อผู้แจ้ง, ปัญหา, อาชีพ, ทักษะ..."
                className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800/80 rounded-xl text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-red transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
              <select
                value={selectedOccupationFilter}
                onChange={(e) => setSelectedOccupationFilter(e.target.value)}
                className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="ALL">อาชีพทั้งหมด ({bounties.length})</option>
                {uniqueOccupations.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="ALL">ทุกสถานะ</option>
                <option value="OPEN">รอผู้เชี่ยวชาญ (OPEN)</option>
                <option value="NEGOTIATING">กำลังเจรจา</option>
                <option value="ACTIVE">กำลังดำเนินการ</option>
                <option value="COMPLETED">สำเร็จแล้ว</option>
              </select>

              <select
                value={selectedUrgencyFilter}
                onChange={(e) => setSelectedUrgencyFilter(e.target.value)}
                className="bg-white dark:bg-[#181a1f] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="ALL">ทุกระดับความเร่งด่วน</option>
                <option value="HOT_MISSION">HOT_MISSION</option>
                <option value="NORMAL">NORMAL</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          {/* Bounties List */}
          <div className="space-y-2.5 pb-6">
            {filteredBounties.length === 0 ? (
              <div className="bg-white dark:bg-[#181a1f] rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
                <i className="fa-solid fa-filter-circle-xmark text-2xl text-gray-300 mb-1.5"></i>
                <p className="text-xs text-gray-500">ไม่พบเควสต์ที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            ) : (
              filteredBounties.map((bounty) => (
                <div
                  key={bounty.id}
                  className="bg-white dark:bg-[#181a1f] rounded-2xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition flex flex-col gap-2.5"
                >
                  {/* Card Header: Requester + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                        {bounty.requester?.image ? (
                          <img
                            src={bounty.requester.image}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fa-solid fa-user text-gray-400 text-[10px]"></i>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                            {bounty.requester?.name || 'ไม่ระบุชื่อ'}
                          </span>
                          <span className="text-[8px] px-1 py-0.2 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded font-medium">
                            {bounty.requester?.role || 'USER'}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-400 block">
                          {bounty.requesterIndustryName} •{' '}
                          {new Date(bounty.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {bounty.urgencyState === 'HOT_MISSION' && (
                        <span className="bg-red-50 dark:bg-brand-red/20 text-brand-red border border-red-100 dark:border-brand-red/30 text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                          HOT
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          bounty.status === 'OPEN'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : bounty.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {bounty.status}
                      </span>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-2 leading-relaxed font-medium">
                    {bounty.rawDescription}
                  </p>

                  {/* Step 5 Specification: Target Occupations & Skills */}
                  <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-2.5 border border-gray-100 dark:border-gray-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                        <i className="fa-solid fa-bullseye text-brand-red"></i>
                        สเปกผู้เชี่ยวชาญที่แท็กไว้ (Step 5)
                      </span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 font-mono">
                        {bounty.bountyPrizeSatang > 0
                          ? `฿${(bounty.bountyPrizeSatang / 100).toLocaleString()}`
                          : bounty.bountyType}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {bounty.targetOccupations.map((occ, idx) => (
                        <span
                          key={`occ-${idx}`}
                          className="inline-flex items-center gap-1 bg-red-50 dark:bg-brand-red/20 text-brand-red border border-red-200 dark:border-brand-red/30 text-[9px] font-bold px-2 py-0.5 rounded-full"
                        >
                          <i className="fa-solid fa-briefcase text-[7px]"></i>
                          {occ.name}
                        </span>
                      ))}

                      {bounty.targetSkills.map((sk, idx) => (
                        <span
                          key={`sk-${idx}`}
                          className="inline-flex items-center gap-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 text-[9px] font-medium px-2 py-0.5 rounded-full"
                        >
                          <i className="fa-solid fa-tag text-[7px] text-gray-400"></i>
                          {sk.name}
                        </span>
                      ))}

                      {!bounty.isTagged && (
                        <span className="text-[9px] text-gray-400 italic">
                          ไม่ได้ระบุอาชีพ/ทักษะเจาะจง
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="text-[9px] text-gray-400">
                      {bounty.upgradeProposalsCount > 0 ? (
                        <span className="text-indigo-600 font-bold">
                          <i className="fa-solid fa-lightbulb mr-1"></i>
                          {bounty.upgradeProposalsCount} ข้อเสนอ Upgrade
                        </span>
                      ) : bounty.solver ? (
                        <span className="text-emerald-600 font-bold">
                          <i className="fa-solid fa-handshake mr-1"></i>
                          มี Solver แล้ว
                        </span>
                      ) : (
                        <span>รอ Solver เข้ามารับงาน</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setInspectBounty(bounty)}
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition"
                      >
                        <i className="fa-solid fa-code mr-1"></i>JSON
                      </button>
                      <Link
                        href={`/profile/bounty/${bounty.id}`}
                        className="text-[9px] font-bold px-3 py-1 rounded-full bg-brand-black text-white hover:bg-brand-red transition shadow-xs flex items-center gap-1"
                      >
                        ดูเควสต์ <i className="fa-solid fa-chevron-right text-[7px]"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Deep Attribute JSON Modal */}
      <AnimatePresence>
        {inspectBounty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-md bg-white dark:bg-[#181a1f] rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    ข้อมูลเจาะลึกเควสต์ (Admin Audit Trail)
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {inspectBounty.id}</p>
                </div>
                <button
                  onClick={() => setInspectBounty(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>

              <div className="overflow-y-auto py-3 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Step 5 Target Payload
                  </span>
                  <pre className="bg-gray-900 text-emerald-400 p-3 rounded-xl overflow-x-auto text-[10px] leading-relaxed">
                    {JSON.stringify(
                      {
                        targetOccupations: inspectBounty.targetOccupations,
                        targetSkills: inspectBounty.targetSkills,
                        customTags: inspectBounty.customTags,
                        requesterIndustry: inspectBounty.requesterIndustryName,
                        requesterWorkType: inspectBounty.requesterWorkTypeName,
                        bountyType: inspectBounty.bountyType,
                        prizeSatang: inspectBounty.bountyPrizeSatang,
                        matchLogs: inspectBounty.matchLogs,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  onClick={() => setInspectBounty(null)}
                  className="px-5 py-2 bg-brand-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
