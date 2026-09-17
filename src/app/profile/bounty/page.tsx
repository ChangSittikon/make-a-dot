import React from 'react';
import Link from 'next/link';

export default function BountyHubPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bounty Hub</h1>
        <Link href="/profile/bounty/create" className="bg([#FF1A1A] text-white px-4 py-2 rounded-md hover:bg-red-700 transition">+ ตั้งค่าหัวปัญหาใหม่</Link>
      </div>

      <div className="mb-6 flex gap-2">
        <input type="text" placeholder="ค้นหาปัญหา, อาชีพ หรือทักษฅ..." className="flex-1 border border-gray-300 rounded-md px-4 py-2" />
        <button className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50">Filter</button>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">HOT_MISSION</span>
              <h2 className="text-lg font-semibold">ต้องการทีมพัฒนา MVP ภายใน 1 เดือน</h2>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#FF1A1A]">฿50,000</div>
              <div className="text-sm text-gray-500">CASH</div>
            </div>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">กำลังมองหา Fullstack Developer แลก UI/UX Designer เพื่อสร้าง MVP สำหรับแอปพลิเคชันจองคิวออนไลน์...</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>ต้องกาส: React.js, Node.js, Figma</span>
            <Link href="/profile/bounty/placeholder-id" className="text-blue-600 hover:underline">ทูรายละเอียด</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
