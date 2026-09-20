'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type TabFilter = 'ALL' | 'OWNER' | 'MEMBER' | 'ACTIVE' | 'COMPLETED';

export default function MyProjectsManagementPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('ALL');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyProjects() {
      setLoading(true);
      try {
        const res = await fetch('/api/projects/manage');
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
          setFilteredProjects(data.projects);
          
          // Get current user id from the mock auth endpoint or just deduce it from the first owned project.
          // Since we need it for role-based button rendering, let's fetch profile first or get it from API response if possible.
          // Actually, let's deduce it if we have owned projects. If not, we might not need to show the button anyway.
          const resProfile = await fetch('/api/profile');
          const profileData = await resProfile.json();
          if (profileData.success) {
            setCurrentUserId(profileData.user.id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyProjects();
  }, []);

  useEffect(() => {
    if (!projects) return;
    
    // Client-side filtering
    let result = projects;
    switch (activeTab) {
      case 'OWNER':
        result = projects.filter(p => p.ownerId === currentUserId);
        break;
      case 'MEMBER':
        result = projects.filter(p => p.ownerId !== currentUserId && p.members?.some((m: any) => m.userId === currentUserId));
        break;
      case 'ACTIVE':
        result = projects.filter(p => p.status === 'ACTIVE' || p.status === 'HOT_MISSION');
        break;
      case 'COMPLETED':
        result = projects.filter(p => p.status === 'COMPLETED' || p.status === 'CANCELLED');
        break;
      default:
        result = projects;
        break;
    }
    setFilteredProjects(result);
  }, [activeTab, projects, currentUserId]);

  const tabs: { id: TabFilter; label: string }[] = [
    { id: 'ALL', label: 'ทั้งหมด' },
    { id: 'OWNER', label: 'สร้างเอง' },
    { id: 'MEMBER', label: 'เข้าร่วม' },
    { id: 'ACTIVE', label: 'กำลังทำ' },
    { id: 'COMPLETED', label: 'สำเร็จแล้ว' },
  ];

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return { text: 'แบบร่าง', color: 'text-gray-600 bg-gray-50 border-gray-200' };
      case 'SIMULATION':
        return { text: 'จำลองผลลัพธ์', color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'HOT_MISSION':
        return { text: 'ด่วนพิเศษ', color: 'text-red-600 bg-red-50 border-red-200' };
      case 'ACTIVE':
        return { text: 'กำลังดำเนินการ', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'COMPLETED':
        return { text: 'สำเร็จ', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'CANCELLED':
        return { text: 'ยกเลิก', color: 'text-gray-500 bg-gray-50 border-gray-200' };
      default:
        return { text: status, color: 'text-gray-600 bg-gray-50 border-gray-200' };
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7] font-prompt sm:py-10">
      {/* Sleek Mobile Frame */}
      <div className="w-full h-screen sm:max-w-[430px] sm:h-[900px] sm:rounded-[36px] bg-[#fdfdfd] relative flex flex-col overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="bg-white sticky top-0 z-20 shadow-sm border-b border-gray-50">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/profile" className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-arrow-left text-gray-400"></i>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">การจัดการโปรเจกต์</h1>
                <p className="text-xs text-gray-400 font-medium tracking-wide">My Projects Management</p>
              </div>
            </div>
          </div>
          
          {/* Scrollable Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar px-5 py-3 gap-6 items-center bg-white border-t border-gray-50">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap pb-1 relative transition-all ${
                    isActive 
                      ? 'text-gray-900 font-bold' 
                      : 'text-gray-400 font-medium hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-[-12px] left-0 w-full h-[3px] bg-gray-900 rounded-t-lg"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-3 text-gray-300"></i>
              <p className="text-sm font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                <i className="fa-solid fa-layer-group text-3xl text-gray-300"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ไม่มีโปรเจกต์ในหมวดนี้</h3>
              <p className="text-sm text-gray-400 mb-8">คุณสามารถสร้างโปรเจกต์ใหม่เพื่อเริ่มต้นการทำงานร่วมกัน</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-10">
              {filteredProjects.map((project) => {
                const statusInfo = getStatusDisplay(project.status);
                const isOwner = project.ownerId === currentUserId;
                const memberCount = project.members?.length || 0;
                
                return (
                  <div key={project.id} className="bg-white rounded-3xl p-5 shadow-sm relative overflow-hidden group border border-transparent hover:border-gray-100 transition-all">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                      <span className="text-[10px] font-mono text-gray-300">
                        {project.blueprintDotCode || project.id.substring(0,8).toUpperCase()}
                      </span>
                    </div>

                    {/* Content Snippet */}
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-relaxed mb-1">
                        {project.title || "ไม่มีชื่อโปรเจกต์"}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium line-clamp-1">
                        <i className="fa-regular fa-folder mr-1"></i> {project.industry?.name || "ไม่มีอุตสาหกรรม"}
                      </p>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-gray-50 rounded-2xl p-3">
                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">งบประมาณ / มูลค่า</div>
                        <div className="text-xs font-bold text-gray-900 truncate">
                          {project.budgetSatang > 0 
                            ? `฿${(project.budgetSatang / 100).toLocaleString()}` 
                            : "รอการประเมิน"}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-3 flex flex-col justify-center">
                        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">จำนวนสมาชิก</div>
                        <div className="flex items-center gap-2">
                           {/* Avatar Cluster */}
                           <div className="flex -space-x-2">
                             <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                               {project.owner?.image ? <img src={project.owner.image} alt="" className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-[10px] flex items-center justify-center h-full text-gray-400"></i>}
                             </div>
                             {memberCount > 0 && (
                               <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
                                 +{memberCount}
                               </div>
                             )}
                           </div>
                           <span className="text-xs font-bold text-gray-700">{1 + memberCount} คน</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/project/${project.id}`} className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-full text-[12px] hover:bg-gray-50 transition-colors shadow-sm text-center">
                        ดูรายละเอียด
                      </Link>
                      {isOwner && (
                        <button className="flex-1 bg-gray-900 text-white font-bold py-2.5 rounded-full text-[12px] hover:bg-black transition-colors shadow-sm text-center">
                          จัดการโปรเจกต์
                        </button>
                      )}
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
