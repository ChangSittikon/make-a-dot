'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BottomTabBar } from '@/components/shared/BottomTabBar';
import ClientAuthButton from '@/components/ClientAuthButton';

type TabType = 'BOUNTY' | 'PROJECT';

function BoardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'BOUNTY';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  const [bounties, setBounties] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (activeTab === 'BOUNTY' && bounties.length === 0) {
          const res = await fetch('/api/bounties');
          const data = await res.json();
          if (data.success) {
            setBounties(data.bounties);
          }
        } else if (activeTab === 'PROJECT' && projects.length === 0) {
          const res = await fetch('/api/projects');
          const data = await res.json();
          if (data.success && data.projects) {
            setProjects(data.projects);
          } else if (Array.isArray(data)) {
            setProjects(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeTab]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'HOT_MISSION':
        return { text: 'HOT_MISSION', color: 'text-brand-red', dot: 'bg-brand-red animate-pulse', bg: 'bg-red-50', border: 'border-red-100' };
      case 'DRAFT':
        return { text: 'DRAFT', color: 'text-gray-500', dot: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-100' };
      case 'SIMULATION':
        return { text: 'SIMULATION', color: 'text-purple-600', dot: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' };
      case 'ACTIVE':
        return { text: 'ACTIVE', color: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'COMPLETED':
        return { text: 'COMPLETED', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      default:
        return { text: status, color: 'text-gray-600', dot: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-[#fdfdfd] relative flex flex-col overflow-hidden shadow-2xl">
        <div className="absolute top-4 right-4 z-[60]">
          <ClientAuthButton />
        </div>
        <main className="flex-1 overflow-y-auto hide-scrollbar p-5">
          <div className="mx-auto">
            {/* Search & Filter */}
            <div className="mb-4 flex gap-3">
              <div className="flex-1 relative">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder={activeTab === 'BOUNTY' ? "ค้นหาเควสต์ อาชีพ ทักษะ..." : "ค้นหาโปรเจกต์ อุตสาหกรรม..."} 
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-200 shadow-sm text-sm"
                />
              </div>
              <button className="bg-white border border-gray-100 px-5 py-3 rounded-2xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2 text-sm font-medium">
                <i className="fa-solid fa-sliders"></i> ตัวกรอง
              </button>
            </div>

            {/* Segmented Control */}
            <div className="bg-gray-100 p-1 rounded-full flex items-center mb-6 shadow-inner">
              <button
                onClick={() => setActiveTab('BOUNTY')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
                  activeTab === 'BOUNTY'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ภารกิจปัญหา
              </button>
              <button
                onClick={() => setActiveTab('PROJECT')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${
                  activeTab === 'PROJECT'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                โปรเจกต์
              </button>
            </div>

            {/* Content List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-gray-300"></i>
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 pb-10">
                {activeTab === 'BOUNTY' && (
                  bounties.length === 0 ? (
                    <div className="bg-white rounded-[24px] p-10 text-center shadow-sm border border-transparent">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-box-open text-3xl text-gray-300"></i>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">ยังไม่มีปัญหาในระบบ</h3>
                      <p className="text-sm text-gray-500 mb-6">เป็นคนแรกที่แจ้งปัญหา เพื่อหาคนเก่งไปช่วยแก้สิ!</p>
                      <Link href="/profile/bounty/create" className="text-brand-red font-medium hover:underline">
                        สร้าง Quest ตอนนี้ <i className="fa-solid fa-arrow-right ml-1"></i>
                      </Link>
                    </div>
                  ) : (
                    bounties.map((bounty) => (
                      <div key={bounty.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-transparent hover:border-gray-50 transition group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-2">
                            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-100">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                              HOT_MISSION
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {bounty.bountyPrizeSatang > 0 
                                ? `฿${(bounty.bountyPrizeSatang / 100).toLocaleString()}` 
                                : 'รอเจรจา'}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">ค่าหัว</p>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                            {bounty.rawDescription || bounty.title || 'ไม่ได้ระบุรายละเอียดปัญหา'}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {bounty.occupation && (
                              <span className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium border border-gray-100">
                                <i className="fa-solid fa-briefcase mr-1 text-gray-400"></i> {bounty.occupation.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center overflow-hidden">
                              {bounty.requester?.image ? (
                                <img src={bounty.requester.image} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                <i className="fa-solid fa-user text-gray-400 text-xs"></i>
                              )}
                            </div>
                          </div>
                          <Link 
                            href={`/profile/bounty/${bounty.id}/negotiate`} 
                            className="bg-gray-900 text-white text-xs px-5 py-2.5 rounded-full font-bold hover:bg-black transition shadow-sm"
                          >
                            รับงาน (เจรจา)
                          </Link>
                        </div>
                      </div>
                    ))
                  )
                )}

                {activeTab === 'PROJECT' && (
                  projects.length === 0 ? (
                    <div className="bg-white rounded-[24px] p-10 text-center shadow-sm border border-transparent">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-layer-group text-3xl text-gray-300"></i>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">ยังไม่มีโปรเจกต์ในระบบ</h3>
                      <p className="text-sm text-gray-500 mb-6">เริ่มต้นสร้างโปรเจกต์แรกของคุณ เพื่อหาทีมงานมาร่วมสร้างสรรค์!</p>
                    </div>
                  ) : (
                    projects.map((project) => {
                      const statusInfo = getStatusDisplay(project.status);
                      const memberCount = project._count?.members || 0;
                      
                      return (
                        <div key={project.id} className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-md transition group flex flex-col h-full border border-transparent hover:border-gray-50">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2">
                              <span className={`inline-flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.color} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${statusInfo.border}`}>
                                <span className={`w-1.5 h-1.5 ${statusInfo.dot} rounded-full`}></span>
                                {statusInfo.text}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900">
                                {statusInfo.text === 'DRAFT' ? 'เตรียมระดมทุน' : 'หาทีมร่วมงาน'}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">สถานะโปรเจกต์</p>
                            </div>
                          </div>

                          <div className="flex-1 mb-5">
                            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                              {project.title || 'ไม่ได้ระบุชื่อโปรเจกต์'}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {project.industry && (
                                <span className="bg-gray-50 text-gray-600 text-[11px] px-2.5 py-1 rounded-md font-medium border border-gray-100 flex items-center gap-1.5">
                                  <i className={`${project.industry.icon || 'fa-solid fa-briefcase'} text-gray-400`}></i> {project.industry.name}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2 relative z-10">
                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center overflow-hidden">
                                  {project.owner?.image ? (
                                    <img src={project.owner.image} alt="Owner" className="w-full h-full object-cover" />
                                  ) : (
                                    <i className="fa-solid fa-user text-gray-400 text-xs"></i>
                                  )}
                                </div>
                                {memberCount > 1 && (
                                   <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[9px] font-bold text-gray-500 z-0">
                                     +{memberCount - 1}
                                   </div>
                                )}
                              </div>
                            </div>
                            <Link 
                              href={`/project/${project.id}`} 
                              className="bg-white border border-gray-200 text-gray-700 text-xs px-5 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              ขอร่วมทีม
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )
                )}
              </div>
            )}
          </div>
        </main>
        <BottomTabBar />
      </div>
    </div>
  );
}

export default function UnifiedBoardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BoardContent />
    </Suspense>
  );
}
