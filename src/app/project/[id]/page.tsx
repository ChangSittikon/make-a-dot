'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import TrustShield from '@/components/shared/TrustShield';
import TrustTimeline from '@/components/shared/TrustTimeline';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center font-prompt text-gray-500">กำลังโหลดโปรเจกต์...</div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center font-prompt text-[#FF1A1A]">ไม่พบโปรเจกต์</div>;
  }

  const members = project.members || [];
  const canvas = project.canvas;
  const escrow = project.escrow;
  const guarantor = project.guarantor;
  
  const isEndorsed = project.isEndorsed;
  const endorsement = project.endorsements?.[0];

  // Calculate some mock dashboard data if it's not strictly in DB
  const totalBudget = project.budgetSatang / 100 || 0;
  // If no escrow record yet but we have a budget, assume it's funded via Rollover Ledger Transaction
  const fundedBudget = escrow?.totalAmountSatang ? escrow.totalAmountSatang / 100 : totalBudget;
  const fundingPercent = totalBudget > 0 ? Math.round((fundedBudget / totalBudget) * 100) : 0;

  let totalRevShareDistributed = 0;
  members.forEach((m: any) => { totalRevShareDistributed += (m.revSharePercentage / 100) });
  const availableRevShare = Math.max(0, 100 - totalRevShareDistributed);

  // Mock open roles (since we don't have a dedicated table for it yet, we just mock it for UX)
  const openRoles = [
    { title: 'Frontend Developer', type: 'Sweat Share', offer: '5%', icon: 'fa-code' },
    { title: 'UX/UI Designer', type: 'Cash', offer: '฿15,000', icon: 'fa-pen-nib' }
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white dark:bg-[#161a1e] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
        
        {/* Header Section */}
        <header className="px-5 py-4 sticky top-0 bg-white/90 dark:bg-[#1e2329]/90 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2"> 
          <Link href="/explore" className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-[#2b3139] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 shrink-0"> 
            <i className="fa-solid fa-arrow-left"></i> 
          </Link> 
          <div className="flex-1 min-w-0 pl-1"> 
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">{project.title}</h1> 
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{project.industry?.name || 'General'}</p> 
          </div> 
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-1 text-[9px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800 uppercase tracking-wider"> 
              {project.status === 'DRAFT' ? 'กำลังฟอร์มทีม' : project.status} 
            </span> 
            <Link href={`/project/${project.id}/edit`} className="w-7 h-7 flex items-center justify-center bg-brand-red/10 text-brand-red rounded-full hover:bg-brand-red hover:text-white transition-colors border border-brand-red/20 shadow-sm">
              <i className="fa-solid fa-gear text-[10px]"></i>
            </Link>
          </div>
        </header> 

        <main className="flex-1 overflow-y-auto p-5 space-y-6 scrollable-content pb-24">
          
          {/* Executive Summary / Big Picture */}
          <section>
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-brand-red"></i> ภาพรวมโปรเจกต์ (The Big Picture)
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Budget Card */}
              <div className="bg-gray-900 rounded-[20px] p-4 text-white relative overflow-hidden shadow-md">
                <i className="fa-solid fa-sack-dollar absolute -right-2 -bottom-2 text-4xl text-white/10"></i>
                <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mb-1">เงินทุน (Budget)</p>
                <div className="flex items-end gap-1 mb-2">
                  <h3 className="text-xl font-black">฿{fundedBudget.toLocaleString()}</h3>
                  <span className="text-[10px] text-gray-400 mb-1">/ {totalBudget.toLocaleString()}</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${fundingPercent}%` }}></div>
                </div>
                <p className="text-[9px] text-gray-400 mt-1.5 text-right">{fundingPercent}% Funded</p>
              </div>

              {/* RevShare Card */}
              <div className="bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 rounded-[20px] p-4 relative overflow-hidden shadow-sm">
                <i className="fa-solid fa-chart-line absolute -right-2 -bottom-2 text-4xl text-gray-50 dark:text-gray-800/30"></i>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase mb-1">ส่วนแบ่งรายได้ (RevShare)</p>
                <div className="flex items-end gap-1 mb-2">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{totalRevShareDistributed}%</h3>
                  <span className="text-[10px] text-gray-400 mb-1">แบ่งแล้ว</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${totalRevShareDistributed}%` }}></div>
                </div>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1.5 text-right">เหลือ {availableRevShare}% (Available)</p>
              </div>
            </div>

            <Link href={`/project/${id}/canvas`} className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-400 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition shadow-sm mb-2">
              <i className="fa-solid fa-diagram-project"></i> โครงสร้างการเชื่อมต่อ (Node Tree)
            </Link>
            <Link href={`/project/${id}/simulator`} className="w-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition shadow-sm">
              <i className="fa-solid fa-flask"></i> จำลองโปรเจค (Simulator)
            </Link>
          </section>

          {/* Trust & Endorsement */}
          {isEndorsed && (
             <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-[16px] shadow-sm">
               <TrustShield directorName={endorsement?.director?.displayName || 'ผู้กำกับที่ได้รับการยืนยัน'} />
             </div>
          )}

          {/* Missing Pieces (Opportunities) */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-puzzle-piece text-amber-500"></i> สิ่งที่ยังขาด (Open Roles / Needs)
              </h2>
            </div>
            
            <div className="space-y-3">
              {openRoles.map((role, idx) => (
                <div key={idx} className="bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 p-4 rounded-[16px] flex items-center justify-between shadow-sm hover:border-amber-300 dark:hover:border-amber-600 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500">
                      <i className={`fa-solid ${role.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{role.title}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">ผลตอบแทน: <span className="font-bold text-gray-700 dark:text-gray-300">{role.offer}</span></p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[9px] font-bold ${role.type === 'Cash' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'}`}>
                    {role.type}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Connected Dots (Current Team) */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-users text-blue-500"></i> ทีมงานปัจจุบัน (Connected Dots)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {members.map((member: any) => (
                <div key={member.id} className="flex items-center p-3 border border-gray-100 dark:border-gray-800 rounded-[16px] bg-white dark:bg-[#1e2329] shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#2b3139] flex items-center justify-center font-bold text-gray-600 dark:text-gray-400 mr-3 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {member.user?.avatarUrl ? (
                       <img src={member.user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                       member.user?.name?.substring(0, 2).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight mb-0.5">{member.user?.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900 dark:text-white">{member.revSharePercentage / 100}%</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">RevShare</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Escrow Details (If exists) */}
          {escrow && (
            <section className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1e2329] rounded-[16px] p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-vault text-gray-600 dark:text-gray-400"></i>
                    Escrow Vault
                  </h3>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-gray-900 dark:text-white">
                     ฿{(escrow.totalAmountSatang / 100).toLocaleString('th-TH')}
                   </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                เงินทุนส่วนนี้ถูกล็อคไว้ในระบบ Escrow จะเบิกจ่ายได้ต่อเมื่องานสำเร็จตาม Milestone ที่ตกลงไว้ใน Smart Contract เท่านั้น
              </p>
            </section>
          )}

        </main>
        
        {/* Floating Action Bar */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-[#1e2329]/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-40">
           <button className="w-full bg-brand-red text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-brand-red/30 hover:bg-red-600 transition">
             สมัครเข้าร่วมโปรเจกต์นี้
           </button>
        </div>
      </div>
    </div>
  );
}
