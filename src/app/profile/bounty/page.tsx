'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BountyHubPage() {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBounties() {
      try {
        const res = await fetch('/api/bounties');
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
    fetchBounties();
  }, []);

  return (
    <div className="min-h-screen bg-brand-gray-light font-prompt">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-600"></i>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">กระดานค่าหัว (Bounty Hub)</h1>
              <p className="text-xs text-gray-500">ศูนย์รวมปัญหาที่รอการแก้ไขแบบ Outcome-based</p>
            </div>
          </div>
          <Link href="/profile/bounty/create" className="bg-brand-red text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-700 transition flex items-center gap-2 shadow-sm text-sm">
            <i className="fa-solid fa-plus"></i> ตั้งค่าหัวปัญหา
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="mb-8 flex gap-3">
          <div className="flex-1 relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="ค้นหาเควสต์ อาชีพ หรือทักษะ..." 
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red shadow-sm text-sm"
            />
          </div>
          <button className="bg-white border border-gray-200 px-5 py-3 rounded-2xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2 text-sm font-medium">
            <i className="fa-solid fa-sliders"></i> ตัวกรอง
          </button>
        </div>

        {/* Bounty List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-brand-red"></i>
            <p>กำลังโหลดเควสต์...</p>
          </div>
        ) : bounties.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-box-open text-3xl text-gray-300"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ยังไม่มีค่าหัวในระบบ</h3>
            <p className="text-sm text-gray-500 mb-6">เป็นคนแรกที่ตั้งค่าหัวปัญหา เพื่อหาคนเก่งไปช่วยแก้สิ!</p>
            <Link href="/profile/bounty/create" className="text-brand-red font-medium hover:underline">
              สร้าง Quest ตอนนี้ <i className="fa-solid fa-arrow-right ml-1"></i>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bounties.map((bounty) => (
              <div key={bounty.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition group flex flex-col h-full">
                {/* Status & Urgency */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-100">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      HOT_MISSION
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {bounty.bountyPrizeSatang > 0 
                        ? `฿${(bounty.bountyPrizeSatang / 100).toLocaleString()}` 
                        : 'รอเจรจา'}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase">Bounty Prize</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                    {bounty.bountyDescription || 'ไม่ได้ระบุรายละเอียดปัญหา'}
                  </h3>
                  
                  {/* Taxonomy Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {bounty.occupation && (
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-md font-medium border border-blue-100">
                        <i className="fa-solid fa-briefcase mr-1"></i> {bounty.occupation.name}
                      </span>
                    )}
                    {bounty.requiredSkills?.map((ps: any) => (
                      <span key={ps.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-200">
                        {ps.skillTag?.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Resources & Action */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                        {bounty.requester?.image ? (
                          <img src={bounty.requester.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-user text-gray-400 text-xs"></i>
                        )}
                      </div>
                    </div>
                    {bounty.resources?.length > 0 && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="fa-solid fa-box-archive text-gray-400"></i>
                        <span>มีทรัพยากรหนุน</span>
                      </div>
                    )}
                  </div>
                  <Link 
                    href={`/profile/bounty/${bounty.id}/negotiate`} 
                    className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl font-medium hover:bg-black transition group-hover:bg-brand-red"
                  >
                    รับงาน (เจรจา)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
