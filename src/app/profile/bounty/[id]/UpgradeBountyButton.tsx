"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradeBountyButton({ bountyId }: { bountyId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [vision, setVision] = useState('');
  const [role, setRole] = useState('SWEAT_SHARE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const res = await fetch(`/api/bounties/${bountyId}/upgrade-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vision, proposedRole: role })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage('ยื่นข้อเสนอสำเร็จ!');
        setTimeout(() => {
          setIsOpen(false);
          router.refresh();
        }, 1500);
      } else {
        setMessage(data.error || 'เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="block w-full bg-brand-red text-white text-center px-4 py-3.5 rounded-xl font-bold hover:bg-red-700 transition shadow-sm shadow-red-200 text-sm"
      >
        ยื่นข้อเสนออัปเกรด
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">อัปเกรดเป็นโครงการ</h3>
            <p className="text-sm text-gray-500 mb-6">ปัญหานี้มีศักยภาพ เสนอโครงร่างของคุณให้เจ้าของกระทู้พิจารณา</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วิสัยทัศน์ (Vision)</label>
                <textarea 
                  required
                  rows={3}
                  value={vision}
                  onChange={e => setVision(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-200 outline-none"
                  placeholder="ทำไมงานนี้ถึงควรสเกลอัป..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บทบาทของคุณ (Proposed Role)</label>
                <select 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-gray-200 outline-none appearance-none"
                >
                  <option value="SWEAT_SHARE">ผู้ร่วมก่อตั้ง (Sweat Share / Tech Lead)</option>
                  <option value="INVESTOR">นักลงทุน / สปอนเซอร์ (Seed Sponsor)</option>
                  <option value="PROJECT_MANAGER">สถาปนิกและผู้คุมงบ (Project Manager)</option>
                </select>
              </div>

              {message && (
                <p className={`text-sm ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
              )}
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition disabled:opacity-50"
                >
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อเสนอ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
