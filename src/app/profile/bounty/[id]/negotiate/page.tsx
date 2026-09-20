'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import UpgradeBountyButton from '../UpgradeBountyButton';

export default function NegotiatePage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as string;
  
  const [bounty, setBounty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // KPI state
  const [kpis, setKpis] = useState([{ metric: '', target: '', deadline: '' }]);
  const [contractType, setContractType] = useState('SMART_CONTRACT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBounty() {
      try {
        const res = await fetch(`/api/bounties/${bountyId}`);
        const data = await res.json();
        if (data.success) {
          setBounty(data.bounty);
          if (data.bounty.kpiDefinition) {
            try {
              const parsed = JSON.parse(data.bounty.kpiDefinition);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setKpis(parsed);
              }
            } catch (e) {}
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBounty();
  }, [bountyId]);

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
        alert('ตกลงรับงานและเข้าสู่โหมดเจรจาสำเร็จ!');
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

  if (loading) {
    return <div className="p-10 text-center font-prompt">กำลังโหลดข้อมูล...</div>;
  }

  if (!bounty) {
    return <div className="p-10 text-center font-prompt text-red-500">ไม่พบข้อมูลเควสต์</div>;
  }

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
              <h1 className="text-xl font-bold text-gray-900">เจรจา</h1>
              <p className="text-xs text-gray-500">Negotiate</p>
            </div>
          </div>
        </div>
      <main className="flex-1 overflow-y-auto hide-scrollbar p-5">
        <div className="mx-auto">
        <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">The Negotiation Sandbox</h1>
          <p className="text-sm text-gray-500">
            เจรจาขอบเขตงานและเงื่อนไขการส่งมอบ - <span className="font-medium text-brand-red">{bounty.requester?.name}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {bounty.bountyPrizeSatang > 0 ? `฿${(bounty.bountyPrizeSatang / 100).toLocaleString()}` : 'รอเจรจา'}
          </p>
          <p className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full mt-1 border border-red-100 font-medium inline-block">
            {bounty.bountyType} ESCROW
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Left Column: Scope & KPIs */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bullseye text-brand-red"></i> นิยามความสำเร็จ (KPIs)
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              กำหนดตัวชี้วัดให้ชัดเจน ว่า "แค่ไหนถึงเรียกว่าแก้ปัญหาจบ" ระบบจะไม่ยอมจ่ายเงิน Escrow หาก KPI เหล่านี้ไม่สำเร็จ
            </p>

            <div className="space-y-4">
              {kpis.map((kpi, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 mb-1">ตัวชี้วัด (Metric)</label>
                      <input 
                        type="text" 
                        placeholder="เช่น ระบบรองรับผู้ใช้งานพร้อมกันได้ 1,000 คน"
                        value={kpi.metric}
                        onChange={(e) => handleKpiChange(index, 'metric', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">เป้าหมาย (Target/Deliverable)</label>
                      <input 
                        type="text" 
                        placeholder="เช่น Load Test Report ผ่าน 100%"
                        value={kpi.target}
                        onChange={(e) => handleKpiChange(index, 'target', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">กำหนดส่ง (Deadline)</label>
                      <input 
                        type="date" 
                        value={kpi.deadline}
                        onChange={(e) => handleKpiChange(index, 'deadline', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleAddKpi}
                className="text-sm font-medium text-brand-red hover:bg-red-50 px-4 py-2 rounded-lg transition"
              >
                + เพิ่มตัวชี้วัดใหม่
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-file-contract text-blue-600"></i> รูปแบบสัญญาผูกมัด (Contract Binding)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border rounded-xl p-4 cursor-pointer transition ${contractType === 'SMART_CONTRACT' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-brand-red/50'}`}>
                <input type="radio" name="contractType" value="SMART_CONTRACT" checked={contractType === 'SMART_CONTRACT'} onChange={(e) => setContractType(e.target.value)} className="hidden" />
                <div className="font-bold text-gray-900 mb-1">Smart Contract</div>
                <div className="text-xs text-gray-500">ผูกมัดด้วย Blockchain (เงินถูกล็อก 100%)</div>
              </label>
              <label className={`border rounded-xl p-4 cursor-pointer transition ${contractType === 'DIGITAL_SIGNATURE' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-brand-red/50'}`}>
                <input type="radio" name="contractType" value="DIGITAL_SIGNATURE" checked={contractType === 'DIGITAL_SIGNATURE'} onChange={(e) => setContractType(e.target.value)} className="hidden" />
                <div className="font-bold text-gray-900 mb-1">Digital Signature</div>
                <div className="text-xs text-gray-500">เซ็นสัญญาอิเล็กทรอนิกส์ มีผลทางกฎหมาย</div>
              </label>
              <label className={`border rounded-xl p-4 cursor-pointer transition ${contractType === 'HANDSHAKE' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-brand-red/50'}`}>
                <input type="radio" name="contractType" value="HANDSHAKE" checked={contractType === 'HANDSHAKE'} onChange={(e) => setContractType(e.target.value)} className="hidden" />
                <div className="font-bold text-gray-900 mb-1">Handshake (สัญญาใจ)</div>
                <div className="text-xs text-gray-500">รับความเสี่ยงเอง ไม่มีการคุ้มครองจากระบบ</div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Original Info & Action */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <h2 className="text-lg font-bold mb-4">ข้อมูลปัญหาเบื้องต้น</h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              {bounty.bountyDescription || 'ไม่ได้ระบุรายละเอียดปัญหา'}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">หมวดหมู่อาชีพ:</span>
                <span className="font-medium text-white">{bounty.occupation?.name || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">สถานะปัจจุบัน:</span>
                <span className="font-medium text-green-400">{bounty.status}</span>
              </div>
            </div>

            <button 
              onClick={handleAccept}
              disabled={isSubmitting}
              className="w-full bg-brand-red text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition disabled:opacity-50 shadow-[0_0_20px_rgba(255,26,26,0.3)]"
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันข้อตกลง (Accept)'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3 mb-4">
              เมื่อกดปุ่มนี้ ระบบจะทำการล็อกทรัพยากร (Escrow) และเริ่มนับเวลาทำงานทันที
            </p>
            
            <div className="pt-4 border-t border-white/10">
              <p className="text-center text-xs text-gray-300 font-medium mb-3">หรือมองว่าปัญหานี้ใหญ่เกินกว่าจะทำคนเดียว?</p>
              <UpgradeBountyButton bountyId={bountyId} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-64">
             <h2 className="text-sm font-bold mb-3 text-gray-900">ห้องเจรจา (Chat Mockup)</h2>
             <div className="flex-1 bg-gray-50 rounded-xl p-3 mb-3 overflow-y-auto">
               <div className="text-center text-xs text-gray-400 mt-10">
                 ฟีเจอร์แชทระหว่าง Visionary และ Solver จะเปิดให้ใช้งานเร็วๆ นี้
               </div>
             </div>
             <div className="flex gap-2">
               <input type="text" placeholder="พิมพ์ข้อความ..." disabled className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100" />
               <button disabled className="bg-gray-300 text-white px-4 py-2 rounded-lg"><i className="fa-solid fa-paper-plane"></i></button>
             </div>
          </div>
        </div>
      </div>
    </div>
      </main>
    </div>
    </div>
  );
}