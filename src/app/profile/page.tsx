import { auth } from '@/auth';
import { getCurrentUser } from '@/lib/auth-mock';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import UniversalProfileCard from '@/components/profile/UniversalProfileCard';
import { LifeCapitalProfileCard } from '@/components/profile/LifeCapitalProfileCard';
import AuthButton from '@/components/AuthButton';
import SignOutButton from '@/components/profile/SignOutButton';
import { BottomTabBar } from '@/components/shared/BottomTabBar';

import AdminTierPreview from '@/components/profile/AdminTierPreview';
import RecentActivitySection from '@/components/profile/RecentActivitySection';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let session = await auth();
  
  if (!session || !session.user) {
    const mockUser = await getCurrentUser();
    if (mockUser) {
      session = {
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
        },
        expires: new Date(Date.now() + 86400000).toISOString(),
      } as any;
    } else {
      redirect('/api/auth/signin?callbackUrl=/profile');
    }
  }

  if (!session?.user?.id) {
    redirect('/api/auth/signin?callbackUrl=/profile');
  }

  const sessionUser = session.user;

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
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

  // Fetch recent problem nodes for user with negotiations and proposals
  const recentBounties = await prisma.problemNode.findMany({
    where: { requesterId: sessionUser.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      occupation: true,
      negotiations: {
        include: { solver: true },
        orderBy: { createdAt: 'desc' },
      },
      upgradeProposals: {
        include: { proposer: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // Count total pending offers for notification indicator
  const totalPendingOffers = recentBounties.reduce((acc, b) => {
    const pendingNegs = b.negotiations?.filter((n) => n.status === 'PENDING').length || 0;
    const pendingUps = b.upgradeProposals?.filter((p) => p.status === 'PENDING').length || 0;
    return acc + pendingNegs + pendingUps;
  }, 0);

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

          {/* ⚡ v7.5 Life Capital & 6-Axis Monetization Portfolio */}
          <LifeCapitalProfileCard userName={user.name} />

          {/* Quick Access Dashboard */}
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/profile/bounty/manage" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition border border-gray-100 relative">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-xl text-gray-700 relative">
                  <i className="fa-solid fa-list-check"></i>
                  {totalPendingOffers > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[20px] h-5 bg-brand-red text-white text-[10px] font-bold rounded-full px-1 flex items-center justify-center shadow-xs animate-pulse">
                      {totalPendingOffers}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="text-sm font-bold text-gray-800 text-center">จัดการปัญหาและรางวัล</span>
                  {totalPendingOffers > 0 && (
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                  )}
                </div>
              </Link>
              
              <Link href="/profile/projects/manage" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-xl text-gray-700">
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <span className="text-sm font-bold text-gray-800 text-center">จัดการโปรเจกต์</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity & Quick Fix Cards */}
          <RecentActivitySection initialBounties={recentBounties} />

          <SignOutButton />
        </main>
        
        <BottomTabBar />
      </div>
    </div>
  );
}
