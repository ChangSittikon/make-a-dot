'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EndorseButton({ projectId, directorId }: { projectId: string, directorId: string }) {
  const [isEndorsing, setIsEndorsing] = useState(false);
  const router = useRouter();

  const handleEndorse = async () => {
    setIsEndorsing(true);
    try {
      const res = await fetch(`/api/director/endorse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directorId,
          projectId,
          message: 'โปรเจกต์นี้ผ่านการคัดกรองและได้รับการรับรองจากผม',
          isFeatured: true
        })
      });
      if (res.ok) {
        alert('รับรองโปรเจกต์สำเร็จ');
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการรับรอง');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEndorsing(false);
    }
  };

  return (
    <button 
      onClick={handleEndorse}
      disabled={isEndorsing}
      className="w-full mt-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 text-sm font-bold rounded-lg border border-blue-500/20 transition-colors disabled:opacity-50"
    >
      {isEndorsing ? 'กำลังรับรอง...' : 'ประทับตรารับรอง (Endorse)'}
    </button>
  );
}
