"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function UpgradeBountyButton({ bountyId }: { bountyId: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [vision, setVision] = useState('');
  const [role, setRole] = useState('SWEAT_SHARE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const frame = document.getElementById('mobile-phone-frame');
      if (frame && !frame.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  const modalContent = isOpen ? (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-[380px] p-5 rounded-2xl shadow-xl border border-gray-100 relative z-10 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">อัปเกรดเป็นโครงการ</h3>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">ปัญหานี้มีศักยภาพ เสนอโครงร่างของคุณให้เจ้าของกระทู้พิจารณา</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">วิสัยทัศน์ (Vision)</label>
            <textarea 
              required
              rows={3}
              value={vision}
              onChange={e => setVision(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:bg-white focus:border-brand-red outline-none transition"
              placeholder="ทำไมงานนี้ถึงควรสเกลอัป..."
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">บทบาทของคุณ (Proposed Role)</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:bg-white focus:border-brand-red outline-none transition appearance-none"
            >
              <option value="SWEAT_SHARE">ผู้ร่วมก่อตั้ง (Sweat Share / Tech Lead)</option>
              <option value="INVESTOR">นักลงทุน / สปอนเซอร์ (Seed Sponsor)</option>
              <option value="PROJECT_MANAGER">สถาปนิกและผู้คุมงบ (Project Manager)</option>
            </select>
          </div>

          {message && (
            <p className={`text-xs ${message.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
          )}
          
          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-black transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อเสนอ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  const targetEl = mounted && typeof document !== 'undefined' ? document.getElementById('mobile-phone-frame') : null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="block w-full bg-brand-red text-white text-center px-4 py-3.5 rounded-xl font-bold hover:bg-red-700 transition shadow-sm shadow-red-200 text-sm cursor-pointer"
      >
        ยื่นข้อเสนออัปเกรด
      </button>

      {targetEl && modalContent ? createPortal(modalContent, targetEl) : modalContent}
    </>
  );
}
