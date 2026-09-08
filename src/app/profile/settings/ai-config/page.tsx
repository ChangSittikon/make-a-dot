import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AIConfigClient from '@/components/admin/AIConfigClient';

export default async function AIConfigPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/profile/settings');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        <header className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <Link href="/profile/settings" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-600"></i>
            </Link>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">ตั้งค่าระบบ AI</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50 pb-24">
          
          <AIConfigClient />
        </main>
      </div>
    </div>
  );
}
