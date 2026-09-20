import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BottomTabBar } from '@/components/shared/BottomTabBar';

export default async function EcosystemDashboard() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  // Fetch macro metrics
  const userCount = await prisma.user.count();
  const projectCount = await prisma.project.count();
  const industryCount = await prisma.industry.count();
  
  const projects = await prisma.project.findMany({ select: { budgetSatang: true } });
  const totalBudgetSatang = projects.reduce((acc, p) => acc + (p.budgetSatang || 0), 0);
  const totalBudgetTHB = totalBudgetSatang / 100;

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full sm:w-[430px] min-h-screen sm:min-h-[900px] sm:max-h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-gray-50 relative flex flex-col overflow-hidden shadow-2xl">
        
        <header className="p-6 bg-white sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/profile/settings" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-brand-black transition">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ภาพรวมระบบนิเวศ</h1>
              <p className="text-xs text-gray-500">Ecosystem Architecture & Variables</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollable-content bg-slate-50 p-6 pb-32">
          
          {/* Section 1: The Big Picture */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-earth-asia text-indigo-500"></i>
              Macro Variables (สถิติภาพรวม)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Users</p>
                <p className="text-2xl font-black text-slate-800">{userCount}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Projects</p>
                <p className="text-2xl font-black text-slate-800">{projectCount}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-sm col-span-2 text-white">
                <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-wider mb-1">Total GDP (เงินทุนหมุนเวียน)</p>
                <p className="text-3xl font-black">฿{totalBudgetTHB.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Section 2: The Flow Algorithm */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-blue-500"></i>
              สถาปัตยกรรมตัวแปร & โฟลว์
            </h2>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              
              {/* Step 1: Input */}
              <div className="relative mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm z-10 relative">1</div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">User Inputs (ฝั่งผู้ใช้)</h3>
                    <p className="text-[10px] text-slate-500 mb-2">ผู้ใช้เข้ามาตอบคำถามในแอป</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-medium border border-slate-200">💰 เงินทุน</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-medium border border-slate-200">🧠 ทักษะ</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-medium border border-slate-200">💪 ลงแรง (Sweat Eq)</span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-medium border border-slate-200">📍 โลเคชัน</span>
                    </div>
                  </div>
                </div>
                {/* Connector line */}
                <div className="absolute left-[15px] top-[32px] bottom-[-24px] w-[2px] bg-blue-100"></div>
              </div>

              {/* Step 2: Processing */}
              <div className="relative mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm z-10 relative">2</div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Quantum Match Engine</h3>
                    <p className="text-[10px] text-slate-500 mb-2">สมการยุบตัวความน่าจะเป็น (Distance & Similarity)</p>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 font-mono">
                      if (User.SweatEq == Project.NeedsSweatEq) <br/>
                      &nbsp;&nbsp;MatchScore += 100 <br/>
                      if (User.Budget &lt; Project.MinBudget) <br/>
                      &nbsp;&nbsp;Probability = 0%
                    </div>
                  </div>
                </div>
                {/* Connector line */}
                <div className="absolute left-[15px] top-[32px] bottom-[-24px] w-[2px] bg-purple-100"></div>
              </div>

              {/* Step 3: Output Projects */}
              <div className="relative mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm z-10 relative">3</div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Project & Canvas (ตารางผลลัพธ์)</h3>
                    <p className="text-[10px] text-slate-500 mb-2">เมื่อการจับคู่สำเร็จ เกิด Canvas สำหรับตกลงงาน</p>
                    <table className="w-full text-left text-[10px] text-slate-600 mt-2 border border-slate-200 rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 font-bold text-slate-700">
                        <tr>
                          <th className="p-2 border-b border-slate-200">ตัวแปร Canvas</th>
                          <th className="p-2 border-b border-slate-200">ผลลัพธ์ที่ได้</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 border-b border-slate-100">Project Ownership</td>
                          <td className="p-2 border-b border-slate-100 text-emerald-600 font-bold">แบ่งส่วนแบ่งรายได้ % ตามสัดส่วนลงแรง</td>
                        </tr>
                        <tr>
                          <td className="p-2 border-b border-slate-100">Capital (ทุน)</td>
                          <td className="p-2 border-b border-slate-100 text-blue-600 font-bold">ล็อคเข้า Escrow Vault</td>
                        </tr>
                        <tr>
                          <td className="p-2">Role Assignment</td>
                          <td className="p-2">จัดสรรงานตาม Skill Vector</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Connector line */}
                <div className="absolute left-[15px] top-[32px] bottom-[-24px] w-[2px] bg-emerald-100"></div>
              </div>

              {/* Step 4: Income Loop */}
              <div className="relative">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-bold text-sm z-10 relative"><i className="fa-solid fa-baht-sign"></i></div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Income Generation (ลูปการสร้างรายได้)</h3>
                    <p className="text-[10px] text-slate-500 mb-2">เมื่อโปรเจกต์สำเร็จ รายได้ถูกกระจายให้ทุกฝ่าย</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between bg-orange-50 p-2 rounded border border-orange-100">
                        <span className="text-[10px] font-bold text-orange-800">User / Professional</span>
                        <span className="text-[10px] text-orange-600">รับเงินค่าจ้าง / ปันผล</span>
                      </div>
                      <div className="flex items-center justify-between bg-amber-50 p-2 rounded border border-amber-100">
                        <span className="text-[10px] font-bold text-amber-800">Domain Director</span>
                        <span className="text-[10px] text-amber-600">รับ % ค่าธรรมเนียมวงการ</span>
                      </div>
                      <div className="flex items-center justify-between bg-red-50 p-2 rounded border border-red-100">
                        <span className="text-[10px] font-bold text-brand-red">MAKE A DOT</span>
                        <span className="text-[10px] text-brand-red">รับ Platform Fee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="text-center pb-10">
             <Link href="/profile/settings/flow-builder" className="text-xs font-bold text-indigo-500 hover:text-indigo-600 underline">
               <i className="fa-solid fa-arrow-right mr-1"></i> ไปตั้งค่าค่าตัวแปรใน Flow Builder
             </Link>
          </div>

        </main>
        
        <BottomTabBar />
      </div>
    </div>
  );
}
