import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BottomTabBar } from '@/components/shared/BottomTabBar';
import { DarkModeToggle } from '@/components/shared/DarkModeToggle';

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-gray-50 dark:bg-[#161a1e] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
        
        {/* Header Profile Section */}
        <div className="bg-white dark:bg-[#1e2329] px-6 py-8 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4 relative overflow-hidden transition-colors duration-300">
          {/* Decorative background element */}
          <div className="absolute right-0 top-0 opacity-10">
            <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M150 50C150 77.6142 127.614 100 100 100C72.3858 100 50 77.6142 50 50C50 22.3858 72.3858 0 100 0C127.614 0 150 22.3858 150 50Z" fill="#FF1A1A"/>
              <path d="M200 100C200 127.614 177.614 150 150 150C122.386 150 100 127.614 100 100C100 72.3858 122.386 50 150 50C177.614 50 200 72.3858 200 100Z" fill="#FF1A1A"/>
            </svg>
          </div>
          
          <div className="relative z-10 w-14 h-14 rounded-full bg-brand-red-50 dark:bg-brand-red/20 text-brand-red flex items-center justify-center text-xl shrink-0 border border-brand-red-100 dark:border-brand-red/30 overflow-hidden">
            {user.image ? (
              <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>
          <div className="relative z-10 flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{user.name || 'ผู้ใช้งาน'}</h2>
            <Link href="/profile" className="text-brand-red text-xs font-medium flex items-center gap-1 mt-0.5">
              ดูโปรไฟล์ <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-5 py-6 pb-24 space-y-6">
          
          {/* Admin Command Center (Tier 5) */}
          <section>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-brand-red text-xs"></i>
                แผงควบคุมแอดมิน (Tier 5)
              </h3>
              <span className="text-[10px] font-bold text-brand-red bg-red-50 dark:bg-brand-red/20 px-2 py-0.5 rounded-full border border-red-100 dark:border-brand-red/30">
                ADMIN ACCESS
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/profile/settings/flow-builder"
                className="block bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <i className="fa-solid fa-code-branch text-brand-black dark:text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Flow Builder</h4>
                    <p className="text-[10px] text-gray-500">ปรับแต่งขั้นตอน Flow ของระบบ</p>
                  </div>
                </div>
                <i className="fa-solid fa-code-branch absolute -right-2 -bottom-2 text-5xl text-gray-50 dark:text-gray-800/50 group-hover:scale-110 transition-transform"></i>
              </Link>

              <Link
                href="/admin/expert-monitoring"
                className="block bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:brightness-105 transition-all relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                      <i className="fa-solid fa-chart-line text-[9px]"></i> ศูนย์ข้อมูลผู้เชี่ยวชาญ
                    </span>
                    <i className="fa-solid fa-arrow-right text-white/80 group-hover:translate-x-1 transition-transform text-xs"></i>
                  </div>
                  <h4 className="text-base font-extrabold text-white">มอนิเตอร์ดีมานด์ผู้เชี่ยวชาญ</h4>
                  <p className="text-[11px] text-white/80 mt-0.5 leading-relaxed">
                    ดูความต้องการของ Requester (อาชีพ, ทักษะ Step 5) เพื่อปรับกลยุทธ์แพลตฟอร์ม
                  </p>
                </div>
                <i className="fa-solid fa-user-gear absolute -right-3 -bottom-3 text-6xl text-white/10 group-hover:scale-110 transition-transform"></i>
              </Link>

              <Link
                href="/admin/taxonomy"
                className="block bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow relative overflow-hidden group sm:col-span-2"
              >
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <i className="fa-solid fa-tags text-blue-600 dark:text-blue-400 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Taxonomy (หมวดหมู่อาชีพ)</h4>
                    <p className="text-[10px] text-gray-500">จัดการข้อมูล Layer 1-3 รูปแบบการทำงาน สายงาน และอาชีพ/ทักษะอัจฉริยะ (DOT017)</p>
                  </div>
                </div>
                <i className="fa-solid fa-tags absolute -right-2 -bottom-2 text-5xl text-blue-50 dark:text-blue-900/10 group-hover:scale-110 transition-transform"></i>
              </Link>
            </div>
          </section>

          {/* Settings Section */}
          <section>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm px-1">ตั้งค่า</h3>
            <div className="bg-white dark:bg-[#1e2329] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              
              <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-globe text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ภาษา</span>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                  <button className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 rounded-md">EN</button>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-[#206ea1] rounded-md shadow-sm">ไทย</button>
                </div>
              </div>

              <DarkModeToggle />

              <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-face-smile text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">สแกนใบหน้า</span>
                </div>
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>

              <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-lock text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">เปลี่ยนรหัส PIN</span>
                </div>
                <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-key text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">เปลี่ยนรหัสผ่าน</span>
                </div>
                <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i>
              </button>

            </div>
          </section>

          {/* About Section */}
          <section>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm px-1">เกี่ยวกับ Make a Dot</h3>
            <div className="bg-white dark:bg-[#1e2329] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              
              <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-headset text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ติดต่อเรา</span>
                </div>
                <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i>
              </button>

              <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-regular fa-circle-question text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">คำถามที่พบบ่อย</span>
                </div>
                <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-book-open text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">คู่มือการใช้แพลตฟอร์ม</span>
                </div>
                <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i>
              </button>

            </div>
          </section>

          {/* Terms Section */}
          <section>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm px-1">ข้อกำหนดและเงื่อนไข</h3>
            <div className="bg-white dark:bg-[#1e2329] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
              
              <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-book text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">การใช้แอปพลิเคชัน Make a Dot</span>
                </div>
                <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i>
              </button>

              <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-shield-halved text-gray-400 dark:text-gray-500 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ข้อกำหนดและเงื่อนไขของระบบ</span>
                </div>
                <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i>
              </button>

            </div>
          </section>

        </main>

        <BottomTabBar />
      </div>
    </div>
  );
}
