export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BottomTabBar } from '@/components/shared/BottomTabBar';

export default async function ExplorePage() {
  const projects = await prisma.project.findMany({
    include: {
      industry: true,
      members: { include: { user: true } },
      guarantor: true,
      endorsements: { include: { director: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const industries = await prisma.industry.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white dark:bg-[#161a1e] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
        
        {/* Search Experience */}
        <header className="px-5 py-4 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#1e2329]/90 backdrop-blur-md z-20">
          <div className="relative w-full">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="ค้นหาโปรเจกต์, อุตสาหกรรม, สายงาน..." 
              className="w-full bg-gray-100 dark:bg-[#2b3139] text-gray-900 dark:text-white rounded-full py-2.5 pl-10 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-red placeholder-gray-500" 
            />
            <i className="fa-solid fa-sliders absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-6 space-y-6 scrollable-content">
          
          {/* Hero Section */}
          <section className="px-5">
            <div className="bg-gray-900 dark:bg-[#2b3139] rounded-[24px] p-6 text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-gray-300">New Era</span>
                </div>
                <h2 className="text-2xl font-black mb-1">MAKE A DOT</h2>
                <p className="text-[11px] text-gray-300 mb-5 max-w-[200px] leading-relaxed">
                  พลังของคนตัวเล็ก เชื่อมจุดสร้างสรรค์ผลงานชิ้นใหญ่
                </p>
                <Link href="/flow" className="bg-white text-gray-900 text-xs font-bold px-5 py-2.5 rounded-full inline-flex items-center gap-2 hover:bg-gray-100 transition shadow-sm">
                  เริ่มค้นหา Flow
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>
              </div>
              <i className="fa-solid fa-circle-nodes absolute -right-6 -bottom-6 text-[100px] text-white/5 dark:text-white/2 rotate-12"></i>
            </div>
          </section>

          {/* Category Navigation */}
          <section className="px-5">
            <div className="flex items-end justify-between mb-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">ค้นหาตามอุตสาหกรรม</h3>
              <Link href="/board?tab=PROJECT" className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">
                ดูทั้งหมด <i className="fa-solid fa-chevron-right text-[8px] ml-0.5"></i>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollable-content pb-2 -mx-5 px-5">
              {industries.map(ind => (
                <Link href="/flow" key={ind.id} className="flex flex-col items-center gap-2 shrink-0 w-[64px] group">
                  <div className="w-[64px] h-[64px] bg-gray-50 dark:bg-[#2b3139] rounded-[20px] flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all shadow-sm">
                    <i className={`text-xl text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors ${ind.icon || 'fa-solid fa-briefcase'}`}></i>
                  </div>
                  <span className="text-[10px] text-center text-gray-700 dark:text-gray-300 font-medium line-clamp-1 w-full">{ind.name}</span>
                </Link>
              ))}
              {industries.length === 0 && (
                <div className="text-[10px] text-gray-500 w-full text-center py-4">ไม่พบข้อมูลอุตสาหกรรม</div>
              )}
            </div>
          </section>

          {/* Sale Banner (Urgent Projects) */}
          <section className="px-5">
            <div className="bg-[#FF1A1A]/10 dark:bg-[#FF1A1A]/5 border border-[#FF1A1A]/20 rounded-[20px] p-5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#FF1A1A]/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <i className="fa-solid fa-fire text-[#FF1A1A] text-xs animate-bounce"></i>
                  <span className="text-[9px] font-bold text-[#FF1A1A] tracking-wider uppercase">Hot Mission</span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">ด่วน! ขาดคน 5 ตำแหน่ง</h4>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">โปรเจกต์หนังสั้น ปิดรับในอีก</p>
              </div>
              <div className="text-center relative z-10">
                <button className="bg-[#FF1A1A] text-white text-[10px] font-bold px-4 py-1.5 rounded-xl shadow-md shadow-red-500/20 mb-1.5 hover:bg-red-600 transition">
                  เข้าร่วมทีม
                </button>
                <div className="text-[11px] font-mono font-bold text-[#FF1A1A] bg-white dark:bg-[#2b3139] px-2 py-0.5 rounded-md inline-block">02 : 15 : 47</div>
              </div>
            </div>
          </section>

          {/* Featured Products (Projects) */}
          <section className="px-5">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">โปรเจกต์แนะนำ</h3>
            <div className="flex gap-4 overflow-x-auto scrollable-content pb-4 -mx-5 px-5">
              {projects.map(project => {
                const isEndorsed = project.isEndorsed;
                return (
                  <Link href={`/project/${project.id}`} key={project.id} className="w-[160px] shrink-0 bg-white dark:bg-[#1e2329] rounded-[20px] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                    <button className="absolute top-2 right-2 w-7 h-7 bg-white/80 dark:bg-black/50 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-300 z-10 backdrop-blur-sm hover:text-[#FF1A1A] transition-colors">
                      <i className="fa-regular fa-heart text-[12px]"></i>
                    </button>
                    {isEndorsed && (
                       <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-br-lg z-10 flex items-center gap-1">
                         <i className="fa-solid fa-shield-halved"></i> ENDORSED
                       </div>
                    )}
                    <div className="h-[120px] bg-gray-50 dark:bg-[#2b3139] flex items-center justify-center relative">
                      <i className={`text-4xl text-gray-300 dark:text-gray-600 ${project.industry?.icon || 'fa-solid fa-folder'}`}></i>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-0.5 mb-1.5">
                        <i className="fa-solid fa-star text-yellow-400 text-[8px]"></i>
                        <i className="fa-solid fa-star text-yellow-400 text-[8px]"></i>
                        <i className="fa-solid fa-star text-yellow-400 text-[8px]"></i>
                        <i className="fa-solid fa-star text-yellow-400 text-[8px]"></i>
                        <i className="fa-solid fa-star text-yellow-400 text-[8px]"></i>
                        <span className="text-[8px] text-gray-400 ml-1 font-medium">(4.8)</span>
                      </div>
                      <h4 className="font-bold text-[11px] text-gray-900 dark:text-white line-clamp-1 mb-0.5">{project.title}</h4>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{project.industry?.name || 'ทั่วไป'}</p>
                      
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-[11px] font-bold text-gray-900 dark:text-white">
                          <i className="fa-solid fa-coins text-yellow-500 mr-1 text-[9px]"></i>
                          {(project.budgetSatang / 100).toLocaleString()}
                        </span>
                        <div className="w-6 h-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-sm">
                          <i className="fa-solid fa-plus text-[10px]"></i>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {projects.length === 0 && (
                <div className="text-[10px] text-gray-500 w-full text-center py-8 bg-gray-50 dark:bg-[#1e2329] rounded-[20px] border border-dashed border-gray-200 dark:border-gray-800">ไม่มีโปรเจกต์แนะนำ</div>
              )}
            </div>
          </section>
          
        </main>
        
        <BottomTabBar />
      </div>
    </div>
  );
}
