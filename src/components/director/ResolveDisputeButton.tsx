'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResolveDisputeButton({ vaultId, directorId }: { vaultId: string, directorId: string }) {
  const [isResolving, setIsResolving] = useState(false);
  const router = useRouter();

  const handleResolve = async (action: 'RELEASE' | 'REFUND') => {
    setIsResolving(true);
    try {
      const res = await fetch(`/api/escrow/${vaultId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolvedById: directorId, action })
      });
      if (res.ok) {
        alert('ชี้ขาดสำเร็จ');
        router.refresh();
      } else {
        alert('เกิดข้อผิดพลาดในการชี้ขาด');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="flex gap-2 w-full mt-2">
      <button 
        onClick={() => handleResolve('RELEASE')}
        disabled={isResolving}
        className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-sm font-bold rounded-lg border border-emerald-500/20 transition-colors disabled:opacity-50"
      >
        ให้ผ่าน (Release)
      </button>
      <button 
        onClick={() => handleResolve('REFUND')}
        disabled={isResolving}
        className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-lg border border-red-500/20 transition-colors disabled:opacity-50"
      >
        คืนเงิน (Refund)
      </button>
    </div>
  );
}
