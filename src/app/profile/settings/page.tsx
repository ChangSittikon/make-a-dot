import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ResolveDisputeButton from '@/components/director/ResolveDisputeButton';
import EndorseButton from '@/components/director/EndorseButton';

export default async function ProfileSettingsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/api/auth/signin?callbackUrl=/profile');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect('/');

  // Fetch director dashboard data if applicable
  let directorData = null;
  let pendingDisputes: any[] = [];
  let unendorsedProjects: any[] = [];
  let projectCount = 0;
  let activeDeals = 0;
  let totalVolumeSatang = 0;

  if (user.role === 'DIRECTOR' || user.role === 'ADMIN') {
    const dir = await prisma.domainDirector.findFirst({
      where: user.role === 'DIRECTOR' ? { userId: user.id } : undefined,
      include: { industry: true }
    });
    
    if (dir) {
      directorData = dir;
      pendingDisputes = await prisma.escrowVault.findMany({
        where: {
          status: 'DISPUTED',
          project: { industryId: dir.industryId }
        },
        include: { project: true }
      });
      unendorsedProjects = await prisma.project.findMany({
        where: {
          industryId: dir.industryId,
          isEndorsed: false
        },
        take: 5
      });
      
      projectCount = await prisma.project.count({
        where: { industryId: dir.industryId }
      });

      activeDeals = await prisma.project.count({
        where: {
          industryId: dir.industryId,
          status: 'IN_PROGRESS'
        }
      });

      const vaults = await prisma.escrowVault.findMany({
        where: { project: { industryId: dir.industryId } }
      });
      totalVolumeSatang = vaults.reduce((acc, v) => acc + v.amountSatang, 0);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-600"></i>
            </Link>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">แผงควบคุม</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {user.role === 'ADMIN' ? (              <div className="space-y-6 animate-fade-in"> 
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-row items-center justify-between"> 
                  <div> 
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-red/10 text-brand-red text-[10px] font-bold mb-3 tracking-wide">
                      <i className="fa-solid fa-shield-halved"></i>
                      TIER 5 ACCESS
                    </div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">System Administration</h2> 
                    <p className="text-xs text-gray-500 mt-1">แผงควบคุมหลักสำหรับผู้ดูแลระบบ</p> 
                  </div> 
                  <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                     <i className="fa-solid fa-server text-xl"></i>
                  </div>
                </div> 
 
              <section className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3"> 
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"> 
                  <div className="w-6 h-6 bg-brand-red/10 text-brand-red rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i> 
                  </div>
                  เครื่องมือผู้ดูแลระบบ 
                </h3> 

                <Link  
                  href="/profile/settings/idea-board" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-lightbulb text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">กระดานจดดอท (Idea Board)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">คลังไอเดีย รหัสฟีเจอร์ กิมมิค</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-emerald-600 transition-colors text-xs"></i> 
                </Link> 

                <Link  
                  href="/profile/settings/ecosystem" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-globe text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">ภาพรวมระบบนิเวศ (Ecosystem)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">แผนผังภาพใหญ่, ตัวแปรการเงิน และผลลัพธ์</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-indigo-600 transition-colors text-xs"></i> 
                </Link> 

                <Link  
                  href="/profile/settings/flow-builder" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-sitemap text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">จัดการ Flow & Tree</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">ตั้งค่าคำถาม แผนผัง และอุตสาหกรรม</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/ai-config" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-microchip text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">ตั้งค่าระบบ AI (AI Config)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">จัดการ API, โมเดล, ขีดจำกัดการใช้งาน</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/agent-hub" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group relative overflow-hidden" 
                > 
                  <div className="flex items-center gap-4 relative z-10"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors relative"> 
                      <i className="fa-solid fa-robot text-sm"></i> 
                      {/* Breathing dot to signify AI agent activity */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-red rounded-full border-2 border-white" style={{ animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite' }}></div>
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">ตั้งค่าเอเจนต์ (Agent Hub)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">เชื่อมต่อ, Skills, ประเมินระบบ</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/feature-studio" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-lightbulb text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">แผงพัฒนาฟีเจอร์ (Feature Studio)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">เครื่องมือช่วยคิดและสั่งงาน AI เพื่อสร้าง DOT ใหม่</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/dot-synthesizer" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-diagram-project text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">ผสานดอท (Dot Synthesizer)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">โยนไอเดียมั่วๆ ให้ AI ช่วยตีความและหาทางออก</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
              </section> 
            </div> 
          ) : user.role === 'DIRECTOR' && directorData ? (
            <div className="space-y-6 animate-fade-in">
              {/* Header / Stats Summary */}
              <section className="bg-brand-red rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-brand-red-100 text-xs font-medium mb-1">ภาพรวมอุตสาหกรรม</p>
                  <h2 className="text-xl font-black mb-4">{directorData.industry?.name}</h2>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-brand-red-100">รายได้สะสม:</span>
                    <span className="text-2xl font-black tracking-tight">฿{(revenueSatang / 100).toLocaleString('th-TH')}</span>
                  </div>
                </div>
                {/* Decorative BG */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
              </section>

              {/* Data Grid */}
              <section className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-100 rounded-[14px] p-4 shadow-sm">
                  <p className="text-[10px] text-gray-500 mb-1 tracking-wide font-medium">โปรเจกต์ทั้งหมด</p>
                  <p className="text-xl font-black text-gray-900">{projectCount}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-[14px] p-4 shadow-sm">
                  <p className="text-[10px] text-gray-500 mb-1 tracking-wide font-medium">ดีลที่กำลังรัน</p>
                  <p className="text-xl font-black text-gray-900">{activeDeals}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-[14px] p-4 shadow-sm">
                  <p className="text-[10px] text-gray-500 mb-1 tracking-wide font-medium">มูลค่าโปรเจกต์ (฿)</p>
                  <p className="text-lg font-black text-gray-900">{(totalVolumeSatang / 100).toLocaleString('th-TH')}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-[14px] p-4 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#FF1A1A] blur-[20px] opacity-10 rounded-full"></div>
                  <p className="text-[10px] text-gray-500 mb-1 tracking-wide font-medium">Equity Points</p>
                  <p className="text-xl font-black text-[#FF1A1A]">{directorData.equityPoints}</p>
                </div>
              </section>
              
              {/* Unendorsed Projects */}
              <section className="bg-white border border-gray-100 rounded-[14px] p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                  รอการรับรอง (New)
                </h3>
                <div className="space-y-3">
                  {unendorsedProjects.length === 0 ? (
                    <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200 text-center">ไม่มีโปรเจกต์ใหม่</p>
                  ) : (
                    unendorsedProjects.map(project => (
                      <div key={project.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{project.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 mb-2">{project.description}</p>
                        <EndorseButton projectId={project.id} directorId={directorData.id} />
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Dispute Queue */}
              <section className="bg-white border border-gray-100 rounded-[14px] p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  รอการชี้ขาด (Disputes)
                </h3>
                <div className="space-y-3">
                  {pendingDisputes.length === 0 ? (
                    <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200 text-center">ไม่มีข้อพิพาท</p>
                  ) : (
                    pendingDisputes.map(dispute => (
                      <div key={dispute.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-xs truncate">{dispute.project?.title}</h4>
                            <p className="text-[10px] text-amber-600 mt-0.5 truncate">{dispute.disputeReason}</p>
                          </div>
                          <span className="font-bold text-white bg-amber-500 px-2 py-0.5 rounded text-[10px] shrink-0">฿{(dispute.frozenSatang / 100).toLocaleString('th-TH')}</span>
                        </div>
                        <ResolveDisputeButton vaultId={dispute.id} directorId={directorData.id} />
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-person-digging text-2xl text-gray-400"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">แผงควบคุมกำลังพัฒนา</h3>
              <p className="text-sm text-gray-500 max-w-[250px]">
                แผงควบคุมสำหรับสถานะของคุณอยู่ระหว่างการพัฒนา จะเปิดให้บริการเร็วๆ นี้
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
