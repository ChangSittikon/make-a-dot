"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProposalActionButtons({ bountyId, proposalId }: { bountyId: string, proposalId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!confirm(action === 'APPROVE' ? 'ยืนยันการอนุมัติและแปลงเป็นโครงการ?' : 'ยืนยันการปฏิเสธข้อเสนอนี้?')) {
      return;
    }
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/bounties/${bountyId}/upgrade-proposal/${proposalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (res.ok) {
        alert(action === 'APPROVE' ? 'อนุมัติสำเร็จ!' : 'ปฏิเสธสำเร็จ!');
        router.refresh(); // reload server component
      } else {
        const data = await res.json();
        alert(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleAction('REJECT')}
        disabled={isProcessing}
        className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition disabled:opacity-50"
      >
        ปฏิเสธ (Reject)
      </button>
      <button 
        onClick={() => handleAction('APPROVE')}
        disabled={isProcessing}
        className="flex-[2] py-2.5 bg-brand-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition shadow-sm disabled:opacity-50"
      >
        อนุมัติและแปลงเป็นโครงการ
      </button>
    </div>
  );
}
