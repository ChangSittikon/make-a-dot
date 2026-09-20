'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type TabFilter = 'ALL' | 'OPEN' | 'NEGOTIATING' | 'ACTIVE' | 'COMPLETED';

export default function MyQuestsManagementPage() {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('ALL');

  useEffect(() => {
    async function fetchMyBounties() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bounties/manage?filter=${activeTab}`);
        const data = await res.json();
        if (data.success) {
          setBounties(data.bounties);
        }
      } catch (error) {
        console.error('Failed to fetch bounties', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyBounties();
  }, [activeTab]);

  const tabs: { id: TabFilter; label: string }[] = [
    { id: 'ALL', label: 'ทั้งหมด' },
    { id: 'OPEN', label: 'รอผู้เชี่ยวชาญ' },
    { id: 'NEGOTIATING', label: 'กำลังเจรจา' },
    { id: 'ACTIVE', label: 'กำลังดำเนินการ' },
    { id: 'COMPLETED', label: 'สำเร็จ/ยกเลิก' },
  ];

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'MATCHING':
        return { text: 'รอผู้เชี่ยวชาญ', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: 'fa-hourglass-half' };
      case 'NEGOTIATING':
        return { text: 'กำลังเจรจา', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: 'fa-comments' };
      case 'ACTIVE':
      case 'PENDING_REVIEW':
        return { text: 'กำลังดำเนินการ', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: 'fa-spinner fa-spin' };
      case 'COMPLETED':
        return { text: 'สำเร็จ', color: 'text-green-600 bg-green-50 border-green-200', icon: 'fa-check' };
      case 'CANCELLED':
      case 'DISPUTED':
        return { text: 'ยกเลิก/มีข้อพิพาท', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: 'fa-xmark' };
      default:
        return { text: status, color: 'text-gray-600 bg-gray-50 border-gray-200', icon: 'fa-circle-info' };
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      {/* Sleek Mobile Frame without the thick black border */}
      <div className="w-full h-screen sm:max-w-[430px] sm:h-[900px] sm:rounded-[36px] bg-[#fdfdfd] relative flex flex-col overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/profile/bounty" className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-arrow-left text-gray-400"></i>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">การจัดการปัญหา</h1>
                <p className="text-xs text-gray-400 font-medium tracking-wide">My Quests Management</p>
              </div>
            </div>
          </div>
          
          {/* Scrollable Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar px-5 py-3 gap-6 items-center">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap pb-1 relative transition-all ${
                    isActive 
                      ? 'text-brand-red font-bold' 
                      : 'text-gray-400 font-medium hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-[-12px] left-0 w-full h-[3px] bg-brand-red rounded-t-lg"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar bg-[#F5F5F7] p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-3 text-brand-red"></i>
              <p className="text-sm font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          ) : bounties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <i className="fa-solid fa-folder-open text-3xl text-gray-300"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ไม่พบปัญหาในหมวดหมู่นี้</h3>
              <p className="text-sm text-gray-400 mb-8">คุณยังไม่มีปัญหาในสถานะนี้ หรือยังไม่เคยตั้งเควสต์</p>
              <Link href="/profile/bounty/create" className="bg-brand-black text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-brand-red transition-all active:scale-95 text-sm">
                ตั้งปัญหาใหม่ (Create Quest)
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-10">
              {bounties.map((bounty) => {
                const statusInfo = getStatusDisplay(bounty.status);
                
                return (
                  <div key={bounty.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${statusInfo.color}`}>
                        <i className={`fa-solid ${statusInfo.icon}`}></i> {statusInfo.text}
                      </span>
                      <span className="text-[10px] font-mono text-gray-300">
                        {bounty.originDotCode || bounty.id.substring(0,8).toUpperCase()}
                      </span>
                    </div>

                    {/* Content Snippet */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-relaxed mb-1">
                        "{bounty.rawDescription}"
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">
                        <i className="fa-regular fa-folder mr-1"></i> {bounty.problemCategory || "ไม่มีหมวดหมู่"}
                      </p>
                    </div>

                    {/* Target & Reward Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-50">
                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">ผู้เชี่ยวชาญเป้าหมาย</div>
                        <div className="text-xs font-bold text-brand-black truncate">
                          {bounty.occupation ? bounty.occupation.name : "ไม่ระบุ"}
                        </div>
                      </div>
                      <div className="bg-red-50/50 rounded-2xl p-3 border border-red-50">
                        <div className="text-[10px] font-bold text-red-300 uppercase mb-1">รางวัลตอบแทน</div>
                        <div className="text-xs font-bold text-brand-red truncate">
                          {bounty.bountyType === "CASH" && bounty.bountyPrizeSatang > 0 
                            ? `฿${(bounty.bountyPrizeSatang / 100).toLocaleString()}` 
                            : bounty.bountyDescription || "-"}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-full text-[12px] hover:bg-gray-50 transition-colors shadow-sm">
                        ดูรายละเอียด
                      </button>
                      <button className="flex-1 bg-brand-red text-white font-bold py-2.5 rounded-full text-[12px] hover:bg-red-700 transition-colors shadow-sm shadow-red-500/20">
                        อัปเดตสถานะ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
