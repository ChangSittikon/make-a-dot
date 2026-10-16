'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomTabBar } from '@/components/shared/BottomTabBar';
import ClientAuthButton from '@/components/ClientAuthButton';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ESCROW' | 'HISTORY'>('OVERVIEW');
  const [balanceThb, setBalanceThb] = useState<number>(50000);
  const [lockedBalanceThb, setLockedBalanceThb] = useState<number>(12000);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isToppingUp, setIsToppingUp] = useState<boolean>(false);

  const loadWalletAndEscrow = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/production/escrow-group', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) {
        if (data.wallet) {
          setBalanceThb(data.wallet.balanceThb);
          setLockedBalanceThb(data.wallet.lockedBalanceThb);
          setTransactions(data.wallet.transactions || []);
        }
        if (Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        }
      }
    } catch (e) {
      console.error('Failed to load wallet data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletAndEscrow();
  }, []);

  const handleQuickTopUp = async (amountThb: number = 10000) => {
    try {
      setIsToppingUp(true);
      const res = await fetch('/api/production/escrow-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOP_UP_WALLET', amountThb }),
      });
      const data = await res.json();
      if (data?.success) {
        await loadWalletAndEscrow();
      }
    } catch {
      // ignore
    } finally {
      setIsToppingUp(false);
    }
  };

  const totalAssetsThb = balanceThb + lockedBalanceThb;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-gray-50 dark:bg-[#161a1e] relative flex flex-col overflow-hidden shadow-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="absolute top-4 right-4 z-[60]">
          <ClientAuthButton />
        </div>

        {/* Header Tabs */}
        <header className="px-5 py-4 pt-5 pr-28 flex gap-4 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e2329] transition-colors duration-300">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={activeTab === 'OVERVIEW' ? 'text-brand-red font-bold' : ''}
          >
            ภาพรวม
          </button>
          <button
            onClick={() => setActiveTab('ESCROW')}
            className={activeTab === 'ESCROW' ? 'text-brand-red font-bold' : ''}
          >
            Escrow รวมล็อต ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={activeTab === 'HISTORY' ? 'text-brand-red font-bold' : ''}
          >
            ประวัติ ({transactions.length})
          </button>
        </header>

        <main className="flex-1 overflow-y-auto pb-6">
          {/* Balance Section */}
          <div className="px-5 py-5 space-y-2 bg-white dark:bg-[#1e2329] mb-2 transition-colors duration-300">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
              <span className="flex items-center gap-1">
                ยอดสินทรัพย์รวม (พร้อมใช้ + ล็อกใน Escrow)
              </span>
              <Link
                href="/ecosystem"
                className="text-[11px] font-bold text-brand-red hover:underline"
              >
                ← กลับไปหน้าทำผลิต/เชื่อมดอท
              </Link>
            </div>
            <div className="flex items-end gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
                ฿{totalAssetsThb.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
              </h1>
              <span className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
                THB
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              คุ้มครองเงินมัดจำด้วยระบบ{' '}
              <span className="text-emerald-500 font-bold">
                Safe Escrow Vault & Auto-PO
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between px-6 py-4 bg-white dark:bg-[#1e2329] mb-2 transition-colors duration-300">
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => handleQuickTopUp(10000)}
                disabled={isToppingUp}
                className="w-11 h-11 rounded-full bg-brand-red/10 flex items-center justify-center hover:bg-brand-red/20 transition-colors text-brand-red"
                title="เติมเงินด่วน +฿10,000"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold">
                {isToppingUp ? 'กำลังเติม...' : 'เติมเงิน +10k'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => setActiveTab('ESCROW')}
                className="w-11 h-11 rounded-full bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors text-blue-600"
              >
                <i className="fa-solid fa-lock"></i>
              </button>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
                ตู้เซฟ Escrow
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Link
                href="/board?tab=PROJECT"
                className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors text-emerald-600"
              >
                <i className="fa-solid fa-bullhorn"></i>
              </Link>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
                บอร์ดรวมล็อต
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => setActiveTab('HISTORY')}
                className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500/20 transition-colors text-amber-600"
              >
                <i className="fa-solid fa-file-invoice-dollar"></i>
              </button>
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
                รายการย้อนหลัง
              </span>
            </div>
          </div>

          {/* Balance Breakdown List */}
          <div className="mt-2 px-4 space-y-3">
            <div className="bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  สถานะกระเป๋าเงินจริง (Live Prisma DB)
                </h3>
              </div>

              <div className="space-y-3.5">
                {/* Available Balance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                      <i className="fa-solid fa-wallet text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                        เงินสดพร้อมใช้ (Available)
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        พร้อมวางมัดจำห้องรวมล็อตหรือถอนออก
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm font-mono text-emerald-600 dark:text-emerald-400">
                      ฿{balanceThb.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Escrow Balance */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center">
                      <i className="fa-solid fa-lock text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                        ล็อกในระบบมัดจำปลอดภัย (Escrow)
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        จะปล่อยให้โรงงาน OEM เมื่อตรวจรับ QC ผ่านเท่านั้น
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm font-mono text-blue-600 dark:text-sky-400">
                      ฿{lockedBalanceThb.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Group-Buy Escrow Rooms & OEM POs */}
          {(activeTab === 'OVERVIEW' || activeTab === 'ESCROW') && (
            <div className="mt-4 px-4 space-y-3">
              <div className="bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                    ห้องรวมล็อต & ใบสั่งซื้อโรงงาน OEM (ขั้น 06 เชื่อมดอท)
                  </h3>
                  <Link
                    href="/ecosystem"
                    className="text-xs text-brand-red font-bold hover:underline"
                  >
                    + เปิดห้องเพิ่ม
                  </Link>
                </div>

                {loading ? (
                  <p className="text-xs text-gray-400 py-4 text-center">
                    กำลังโหลดรายการ Escrow...
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {rooms.map((rm) => {
                      const isPoSent = rm.status === 'ESCROW_LOCKED_PO_SENT';
                      return (
                        <div
                          key={rm.id}
                          className="p-3 bg-gray-50 dark:bg-[#2b3139] rounded-xl border border-gray-100 dark:border-gray-800 space-y-2"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">
                                {rm.modelName}
                              </h4>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                สินค้า: {rm.productName} • {rm.factoryName}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold ${
                                isPoSent
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isPoSent
                                ? `ส่งใบ PO: ${rm.purchaseOrderNo}`
                                : `รอครบ MOQ (${rm.members}/${rm.targetMembers})`}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 p-2 bg-white dark:bg-[#1e2329] rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                            <div className="border-r border-gray-100 dark:border-gray-700">
                              <p className="text-[9px] text-gray-500">มัดจำต่อคน</p>
                              <p className="text-xs font-bold font-mono text-brand-red mt-0.5">
                                ฿{rm.depositPerMemberThb?.toLocaleString()}
                              </p>
                            </div>
                            <div className="border-r border-gray-100 dark:border-gray-700">
                              <p className="text-[9px] text-gray-500">ล็อกรวมในตู้เซฟ</p>
                              <p className="text-xs font-bold font-mono text-emerald-600 mt-0.5">
                                ฿{rm.escrowLockedThb?.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] text-gray-500">ล็อตรวม</p>
                              <p className="text-xs font-bold font-mono text-gray-900 dark:text-gray-100 mt-0.5">
                                ฿{rm.lotCost?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ledger Transaction History */}
          {(activeTab === 'OVERVIEW' || activeTab === 'HISTORY') && (
            <div className="mt-4 px-4 space-y-3">
              <div className="bg-white dark:bg-[#1e2329] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-3">
                  ประวัติธุรกรรมกระเป๋าเงิน & Escrow
                </h3>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="py-2.5 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {tx.type === 'DEPOSIT'
                            ? '💰 เติมเงินเข้ากระเป๋า'
                            : '🔒 ล็อกเงินมัดจำเข้าตู้เซฟ Escrow (เชื่อมดอท)'}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          อ้างอิง: {tx.referenceId} •{' '}
                          {new Date(tx.createdAt).toLocaleString('th-TH')}
                        </div>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          tx.amountThb >= 0 ? 'text-emerald-600' : 'text-blue-600'
                        }`}
                      >
                        {tx.amountThb >= 0
                          ? `+฿${tx.amountThb.toLocaleString()}`
                          : `🔒 ฿${Math.abs(tx.amountThb).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <BottomTabBar />
      </div>
    </div>
  );
}
