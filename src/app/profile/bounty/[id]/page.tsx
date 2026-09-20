import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-mock';
import UpgradeBountyButton from './UpgradeBountyButton';

export default async function BountyDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-brand-gray-light relative flex flex-col overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile/bounty" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <i className="fa-solid fa-arrow-left text-gray-600"></i>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">รายละเอียดงาน</h1>
              <p className="text-xs text-gray-500">Quest Detail</p>
            </div>
          </div>
        </div>
      <main className="flex-1 overflow-y-auto hide-scrollbar p-5">
        <div className="mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">HOT_MISSION</span>
          <h1 className="text-2xl font-bold mb-2">ต้องการทีมพัฒนา MVP ระบบจองคิว</h1>
          <div className="flex gap-4 text-sm text-gray-500">
            <span><i className="fas fa-building mr-1"></i> ENTERPRISE</span>
            <span><i className="fas fa-clock mr-1"></i> โพสต์เมื่อ 2 วันที่แล้ว</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">฿50,000</p>
          <p className="text-sm text-gray-500">ค่าตอบแทน</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">รายละเอียดงาน (Quest Description)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              เรากำลังมองหาทีมเพื่อสร้างระบบ MVP สำหรับจองคิวร้านอาหาร โดยต้องการฟีเจอร์พื้นฐานดังนี้...
            </p>
            <div className="flex gap-2">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">React</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Node.js</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">PostgreSQL</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">ระบบค้ำประกัน (Escrow)</h2>
            <div className="bg-red-50 p-4 rounded-md border border-red-100">
              <div className="flex items-center text-red-800 font-medium mb-2">
                <i className="fas fa-lock mr-2"></i> CASH ESCROW
              </div>
              <p className="text-sm text-red-700 mb-4">
                ค่าตอบแทน ฿50,000 ถูกค้ำประกันไว้ในระบบเรียบร้อยแล้ว หากส่งมอบงานผ่าน จะได้รับเงินทันที
              </p>
            </div>
            
            <Link 
              href={`/profile/bounty/${params.id}/negotiate`} 
              className="mt-4 block w-full bg-[#FF1A1A] text-white text-center px-4 py-3 rounded-md hover:bg-red-700 transition font-medium"
            >
              รับงาน (เจรจา)
            </Link>

            <UpgradeBountyButton bountyId={params.id} />
          </div>
        </div>
      </div>
    </div>
      </main>
    </div>
    </div>
  );
}