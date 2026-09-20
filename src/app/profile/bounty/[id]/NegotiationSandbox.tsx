'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UpgradeBountyButton from './UpgradeBountyButton';

export default function NegotiationSandbox({ bountyId, prizeTHB, requesterName }: { bountyId: string, prizeTHB: string, requesterName: string }) {
  const router = useRouter();
  const [kpis, setKpis] = useState([{ metric: '', target: '', deadline: '' }]);
  const [contractType, setContractType] = useState('SMART_CONTRACT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddKpi = () => {
    setKpis([...kpis, { metric: '', target: '', deadline: '' }]);
  };

  const handleKpiChange = (index: number, field: string, value: string) => {
    const newKpis = [...kpis];
    newKpis[index] = { ...newKpis[index], [field]: value };
    setKpis(newKpis);
  };

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/bounties/${bountyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpiDefinition: kpis,
          contractBindingType: contractType
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('ตกลงรับงานสำเร็จ!');
        router.push('/profile');
      } else {
        alert('เกิดข้อผิดพลาด: ' + data.error);
      }
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-6 border-t border-gray-200 pt-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">The Negotiation Sandbox</h1>
          <p className="text-xs text-gray-500">
            เจรจาขอบเขตงานและเงื่อนไขการส่งมอบกับ <span className="font-medium text-brand-red">{requesterName}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            ฿{prizeTHB}
          </p>
          <p className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-1 border border-red-100 font-medium inline-block">
            CASH ESCROW
          </p>
        </div>
      </div>

      {/* Scope & KPIs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-bullseye text-brand-red"></i> นิยามความสำเร็จ (KPIs)
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          กำหนดตัวชี้วัดให้ชัดเจน ว่า "แค่ไหนถึงเรียกว่าแก้ปัญหาจบ" ระบบจะไม่ยอมจ่ายเงิน Escrow หาก KPI เหล่านี้ไม่สำเร็จ
        </p>

        <div className="space-y-4">
          {kpis.map((kpi, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 mb-1">ตัวชี้วัด (Metric)</label>
                  <input 
                    type="text" 
                    placeholder="เช่น ระบบรองรับผู้ใช้งานพร้อมกันได้ 1,000 คน"
                    value={kpi.metric}
                    onChange={(e) => handleKpiChange(index, 'metric', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">เป้าหมาย</label>
                    <input 
                      type="text" 
                      placeholder="เช่น ผ่าน 100%"
                      value={kpi.target}
                      onChange={(e) => handleKpiChange(index, 'target', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">กำหนดส่ง</label>
                    <input 
                      type="date" 
                      value={kpi.deadline}
                      onChange={(e) => handleKpiChange(index, 'deadline', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={handleAddKpi}
            className="text-[11px] font-bold text-brand-red hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
          >
            + เพิ่มตัวชี้วัดใหม่
          </button>
        </div>
      </div>
      
      {/* Contract Binding */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-file-contract text-blue-600"></i> รูปแบบสัญญาผูกมัด (Contract)
        </h2>
        <div className="grid grid-cols-1 gap-3">
          <label className={`border rounded-xl p-4 cursor-pointer transition ${contractType === 'SMART_CONTRACT' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-brand-red/50'}`}>
            <input type="radio" name="contractType" value="SMART_CONTRACT" checked={contractType === 'SMART_CONTRACT'} onChange={(e) => setContractType(e.target.value)} className="hidden" />
            <div className="font-bold text-gray-900 text-sm mb-1">Smart Contract</div>
            <div className="text-[10px] text-gray-500">ผูกมัดด้วย Blockchain (เงินถูกล็อก 100%)</div>
          </label>
          <label className={`border rounded-xl p-4 cursor-pointer transition ${contractType === 'DIGITAL_SIGNATURE' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-brand-red/50'}`}>
            <input type="radio" name="contractType" value="DIGITAL_SIGNATURE" checked={contractType === 'DIGITAL_SIGNATURE'} onChange={(e) => setContractType(e.target.value)} className="hidden" />
            <div className="font-bold text-gray-900 text-sm mb-1">Digital Signature</div>
            <div className="text-[10px] text-gray-500">เซ็นสัญญาอิเล็กทรอนิกส์ มีผลทางกฎหมาย</div>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <button 
          onClick={handleAccept}
          disabled={isSubmitting}
          className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition disabled:opacity-50 shadow-[0_0_20px_rgba(255,26,26,0.3)] text-sm mb-3"
        >
          {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันข้อตกลง (Accept)'}
        </button>
        <p className="text-center text-[10px] text-gray-400 mb-5">
          ระบบจะทำการล็อกทรัพยากร (Escrow) และเริ่มนับเวลาทำงานทันที
        </p>

        <div className="pt-4 border-t border-white/10">
          <p className="text-center text-xs text-gray-300 font-medium mb-3">หรือมองว่าปัญหานี้ใหญ่เกินกว่าจะทำคนเดียว?</p>
          <UpgradeBountyButton bountyId={bountyId} />
        </div>
      </div>
    </div>
  );
}
