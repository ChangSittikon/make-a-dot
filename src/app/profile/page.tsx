import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import UniversalProfileCard from '@/components/profile/UniversalProfileCard';
import AuthButton from '@/components/AuthButton';
import SignOutButton from '@/components/profile/SignOutButton';
import { BottomTabBar } from '@/components/shared/BottomTabBar';

import AdminTierPreview from '@/components/profile/AdminTierPreview';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/api/auth/signin?callbackUrl=/profile');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      directorProfile: true,
      projectsOwned: true,
      projectMemberships: true,
      guaranteesGiven: true,
      endorsementsReceived: true,
    }
  });

  if (!user) {
    redirect('/');
  }

  // Calculate stats based on real data
  const stats = {
    ownedProjects: user.projectsOwned.length,
    joinedProjects: user.projectMemberships.length,
    totalGuaranteedSatang: user.guaranteesGiven.reduce((acc, curr) => acc + curr.collateralAmountSatang, 0),
    endorsementsCount: user.endorsementsReceived.length,
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        
        <header className="px-5 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 sticky top-0 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-600"></i>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">โปรไฟล์ของคุณ</h1>
          </div>
          <AuthButton session={session} />
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* If user is ADMIN, show the switcher wrapper. Otherwise just show the card. */}
          {user.role === 'ADMIN' ? (
            <AdminTierPreview user={user} stats={stats} />
          ) : (
            <UniversalProfileCard user={user} stats={stats} />
          )}

          {/* Bounty Hub Access */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ระบบค่าหัวปัญหา (Bounty Protocol)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/profile/bounty" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-xl text-gray-700">
                  <i className="fa-solid fa-list-check"></i>
                </div>
                <span className="text-sm font-bold text-gray-800">ปัญหาและค่าตอบแทน</span>
              </Link>
              <Link href="/profile/bounty/create" className="flex flex-col items-center justify-center p-4 bg-brand-red rounded-2xl hover:bg-red-700 transition shadow-md group">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 text-xl text-white group-hover:scale-110 transition">
                  <i className="fa-solid fa-plus"></i>
                </div>
                <span className="text-sm font-bold text-white">แจ้งปัญหา</span>
                <span className="text-[10px] text-red-100 mt-1">ประกาศ (Visionary)</span>
              </Link>
            </div>
          </div>

          {/* Mock Activity List */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">กิจกรรมล่าสุด</h3>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="text-center py-8 text-gray-400">
                <i className="fa-solid fa-timeline text-3xl mb-3 text-gray-300"></i>
                <p className="text-sm">ยังไม่มีกิจกรรม</p>
              </div>
            </div>
          </div>

          <SignOutButton />
        </main>
        
        <BottomTabBar />
      </div>
    </div>
  );
}
