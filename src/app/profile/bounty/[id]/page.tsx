import React from 'react';
import Link from 'next/link';

export default function BountyDetailPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
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

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
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
              href="/profile/bounty/placeholder-id/negotiate" 
              className="mt-4 block w-full bg-[#FF1A1A] text-white text-center px-4 py-3 rounded-md hover:bg-red-700 transition font-medium"
            >
              รับงาน (เจรจา)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}