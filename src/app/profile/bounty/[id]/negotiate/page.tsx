import React from 'react';
import Link from 'next/link';

export default function NegotiatePage() {
  return (
    <div className="p-6 max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">The Negotiation Sandbox</h1>
          <p className="text-sm text-gray-500">
            เจรจาขอบเขตงานและเงื่อนไขการส่งมอบ - ต้องการทีมพัฒนา MVP ระบบจองคิว
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">฿50,000</p>
          <p className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full mt-1">CASH ESCROW</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
        {/* Left Column: Scope & KPIs */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">เงื่อนไขและตัวชี้วัด (KPIs)</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">1. ระบบ Login และ Register</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">AGREED</span>
              </div>
              <p className="text-sm text-gray-600">รองรับ Email, Password และ Google OAuth</p>
            </div>

            <div className="border border-blue-200 bg-blue-50 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-blue-900">2. ระบบจองคิวแบบ Real-time</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">PROPOSED (By Solver)</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">ใช้ WebSocket เพื่ออัปเดตคิวแบบ Real-time โดยไม่ต้องรีเฟรชหน้า</p>
              <div className="flex gap-2">
                <button className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">Counter</button>
                <button className="text-xs bg-[#FF1A1A] text-white px-3 py-1.5 rounded hover:bg-red-700">Accept</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat & Smart Contract */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col min-h-0">
            <h2 className="text-sm font-semibold mb-3">ห้องเจรจา (Chat)</h2>
            <div className="flex-1 bg-gray-50 rounded-md p-3 mb-3 overflow-y-auto">
              <div className="mb-3">
                <span className="text-xs font-bold text-gray-500">Visionary (You)</span>
                <p className="text-sm bg-white p-2 rounded-md shadow-sm mt-1">
                  อยากให้ระบบรองรับคิวได้ประมาณ 1000 คิวต่อวันครับ
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600">Solver Team</span>
                <p className="text-sm bg-blue-50 p-2 rounded-md shadow-sm mt-1">
                  รับทราบครับ ขอเสนอให้ใช้ Redis สำหรับจัดการคิวเพื่อให้รองรับโหลดได้สบายๆ ครับ
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="พิมพ์ข้อความ..." className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm" />
              <button className="bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-gray-800"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">ผูกมัดสัญญา (Contract Binding)</h2>
            <p className="text-sm text-gray-600 mb-4">
              เมื่อทั้งสองฝ่ายตกลง KPI ครบทุกข้อ ระบบจะสร้าง Smart Contract และโอนเงินรางวัล ฿50,000 เข้าสู่ Escrow ทันที
            </p>
            <button className="w-full bg-gray-200 text-gray-500 px-4 py-3 rounded-md font-medium cursor-not-allowed">
              Sign Contract (รอยืนยัน KPI ทั้งหมด)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}