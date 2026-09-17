import React from 'react';

export default function CreateBountyPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Create Bounty Quest</h1>
      <p className="text-gray-500 mb-8">ตั้งค่าหัวปัญหาของคุณเพื่อหาผู้ก้อบกู้</p>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Step 1: Core Problem</h2?�          <textarea 
            className="w-full border border-gray-300 rounded-md p-4 min-h-[120px]"
            placeholder="อธิบายปัญหาของคุณอย่างละเอียค..."
          ></textarea>
          <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">AI Analysis Preview</p>
            <div className="flex gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">ENTERPRISE</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">SKILL_GAP</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Step 2: Bounty & Escrow</h2?�          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">เงืนรางวัลค่าหัว (THB)</label>
              <input type="number" className="w-full border border-gray-300 rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">รูปแบบรางวัล</label>
              <select className="w-full border border-gray-300 rounded-md px-4 py-2">
                <option>CASH</option>
                <option>EQUITY</option>
                <option>RESOURCE_SWAP</option>
              </select>
            </div>
          </div>
          <div className="mt-4 bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-sm text-red-800 font-medium">
              <i className="fas fa-lock mr-2"></i>
              ระบบจะล็อกเงินจํานวนนี้ไว้ใน Escrow ทันทีที่กดให้บริการ เพื่อเป็นการค้ำประกัน
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#FF1A1A] text-white px-6 py-3 rounded-md hover:bg-red-700 transition">
            Publish Bounty
          </button>
        </div>
      </div>
    </div>
  )<)
}
