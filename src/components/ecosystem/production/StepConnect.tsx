'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Plus,
  Share2,
  CheckCircle2,
  Building,
  Sparkles,
  Wallet,
  ArrowRight,
  Shield,
  Clock,
  Check,
  Lock,
  FileText,
  Zap,
  ExternalLink,
  Factory,
  AlertCircle,
  Loader2,
  ArrowUpRight,
} from 'lucide-react';
import { ProductChain, FlatOpportunity } from './types';
import { OppPicker } from './OppPicker';

interface StepConnectProps {
  chain: ProductChain;
  selectedOppKey?: string;
  onSelectOppKey?: (key: string) => void;
  onAction?: (actionUrl: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface RoomParticipant {
  id: string;
  name: string;
  role: string;
  unitsAllocated: number;
  depositLockedThb: number;
  stakedAt: string;
}

interface EscrowGroupRoom {
  id: string;
  productChainId?: string | null;
  productName: string;
  modelName: string;
  mode: string;
  members: number;
  targetMembers: number;
  moqTotalUnits: number;
  unitLabel: string;
  lotCost: number;
  depositPercent: number;
  costPerMemberThb: number;
  depositPerMemberThb: number;
  totalDepositTargetThb: number;
  unitsPerMember: number;
  escrowLockedThb: number;
  factoryName: string;
  purchaseOrderNo?: string | null;
  poIssuedAt?: string | null;
  linkedProjectId?: string | null;
  status: string;
  participants: RoomParticipant[];
  createdAt: number;
}

interface WalletState {
  id?: string;
  userName?: string;
  balanceThb: number;
  lockedBalanceThb: number;
  transactions?: {
    id: string;
    amountThb: number;
    type: string;
    status: string;
    referenceId?: string | null;
    createdAt: string;
  }[];
}

const DEFAULT_MODES = [
  {
    id: 'moq',
    title: 'รวมล็อตสั่งซื้อขั้นต่ำ (MOQ Group Buy)',
    desc: 'รวมยอดสั่งซื้อวัตถุดิบ/สินค้ากับเพื่อนๆ เพื่อให้ถึงขั้นต่ำราคาโรงงาน ลดต้นทุนต่อหน่วยได้ 30-50%',
    badge: 'ลดต้นทุนวัตถุดิบ',
  },
  {
    id: 'shared_tooling',
    title: 'แชร์ค่าโมลด์ / บล็อกสกรีน / ค่าจดแจ้ง อย.',
    desc: 'หารต้นทุนคงที่ (Fixed Costs) และค่าทดสอบมาตรฐานกับแบรนด์อื่นที่ใช้ฐานการผลิตเดียวกัน',
    badge: 'หารต้นทุนตั้งต้น',
  },
  {
    id: 'consortium',
    title: 'เครือข่ายรับเหมาช่วง (Value Chain Consortium)',
    desc: 'จับคู่พันธมิตรคนละหน้าที่: คนผลิต + คนทำแบรนด์ + คนขายไลฟ์สด เพื่อสร้างระบบนิเวศร่วมกัน',
    badge: 'จับคู่พันธมิตร',
  },
];

export function StepConnect({
  chain,
  selectedOppKey,
  onSelectOppKey,
  onAction,
  onNavigateTab,
}: StepConnectProps) {
  const opportunities = useMemo<FlatOpportunity[]>(() => {
    const list: FlatOpportunity[] = [];
    chain.supply_chain_nodes.forEach((node) => {
      node.micro_opportunities.forEach((opp, idx) => {
        list.push({
          key: `${node.stage_type}_${idx}`,
          node,
          opp,
        });
      });
    });
    return list;
  }, [chain]);

  const [activeKey, setActiveKey] = useState<string>(
    selectedOppKey && opportunities.some((o) => o.key === selectedOppKey)
      ? selectedOppKey
      : opportunities[0]?.key || ''
  );

  useEffect(() => {
    if (selectedOppKey && opportunities.some((o) => o.key === selectedOppKey)) {
      setActiveKey(selectedOppKey);
    }
  }, [selectedOppKey, opportunities]);

  const active = useMemo(() => {
    return (
      opportunities.find((o) => o.key === activeKey) || opportunities[0] || null
    );
  }, [opportunities, activeKey]);

  const handleSelectKey = (key: string) => {
    setActiveKey(key);
    onSelectOppKey?.(key);
  };

  // Real Group-Buy & Safe Escrow State
  const [rooms, setRooms] = useState<EscrowGroupRoom[]>([]);
  const [wallet, setWallet] = useState<WalletState>({
    balanceThb: 50000,
    lockedBalanceThb: 12000,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [busyRoomId, setBusyRoomId] = useState<string | null>(null);
  const [isToppingUp, setIsToppingUp] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [activePoRoom, setActivePoRoom] = useState<EscrowGroupRoom | null>(null);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create Room Form State
  const [formMode, setFormMode] = useState(DEFAULT_MODES[0].id);
  const [formNote, setFormNote] = useState('');
  const [formFactoryName, setFormFactoryName] = useState(
    `โรงงาน OEM มาตรฐาน GMP/ISO (${chain.product.product_name})`
  );
  const [formTargetCost, setFormTargetCost] = useState('35000');
  const [formTargetMembers, setFormTargetMembers] = useState('5');
  const [formMoqUnits, setFormMoqUnits] = useState('1000');
  const [formUnitLabel, setFormUnitLabel] = useState('ชิ้น');
  const [formDepositPct, setFormDepositPct] = useState('30');
  const [formPublishBoard, setFormPublishBoard] = useState(true);

  useEffect(() => {
    setFormFactoryName(`โรงงาน OEM มาตรฐาน GMP/ISO (${chain.product.product_name})`);
  }, [chain.product.product_name]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 5500);
  };

  const fetchEscrowRoomsAndWallet = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/production/escrow-group', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data?.success) {
        if (data.wallet) setWallet(data.wallet);
        if (Array.isArray(data.rooms)) setRooms(data.rooms);
      }
    } catch (err) {
      console.error('Failed to load escrow group rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrowRoomsAndWallet();
  }, [chain.product.product_name]);

  const handleTopUpWallet = async (amountThb: number = 10000) => {
    try {
      setIsToppingUp(true);
      const res = await fetch('/api/production/escrow-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOP_UP_WALLET',
          amountThb,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setWallet((prev) => ({
          ...prev,
          balanceThb: data.balanceThb,
          lockedBalanceThb: data.lockedBalanceThb,
        }));
        showToast(data.message);
      }
    } catch {
      // ignore
    } finally {
      setIsToppingUp(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;

    const selectedModeObj = DEFAULT_MODES.find((m) => m.id === formMode);
    const modelName =
      formNote.trim() || `${selectedModeObj?.title} - ${active.opp.model_name}`;

    try {
      setBusyRoomId('CREATING');
      const res = await fetch('/api/production/escrow-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_ESCROW_ROOM',
          productName: chain.product.product_name,
          modelName,
          mode: formMode,
          lotCost: Number(formTargetCost) || 35000,
          targetMembers: Number(formTargetMembers) || 5,
          moqTotalUnits: Number(formMoqUnits) || 1000,
          unitLabel: formUnitLabel || 'ชิ้น',
          depositPercent: Number(formDepositPct) || 30,
          factoryName: formFactoryName,
          publishToBoard: formPublishBoard,
          sectorOrder: Number(
            String(chain.taxonomy.sector_id || '5').replace(/\D/g, '') || 5
          ),
        }),
      });
      const data = await res.json();
      if (data?.success && data.room) {
        setRooms((prev) => [data.room, ...prev]);
        if (data.wallet) {
          setWallet((prev) => ({
            ...prev,
            balanceThb: data.wallet.balanceThb,
            lockedBalanceThb: data.wallet.lockedBalanceThb,
          }));
        }
        setShowCreateModal(false);
        setFormNote('');
        showToast(data.message);
      }
    } catch (err) {
      console.error('Failed to create escrow room:', err);
    } finally {
      setBusyRoomId(null);
    }
  };

  const handleJoinAndStake = async (
    roomId: string,
    simulateFullMoq: boolean = false
  ) => {
    try {
      setBusyRoomId(roomId);
      const res = await fetch('/api/production/escrow-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: simulateFullMoq ? 'SIMULATE_FILL_MOQ' : 'JOIN_AND_STAKE',
          roomId,
        }),
      });
      const data = await res.json();
      if (data?.success && data.room) {
        setRooms((prev) =>
          prev.map((r) => (r.id === data.room.id ? data.room : r))
        );
        if (data.wallet) {
          setWallet((prev) => ({
            ...prev,
            balanceThb: data.wallet.balanceThb,
            lockedBalanceThb: data.wallet.lockedBalanceThb,
          }));
        }
        showToast(data.message);

        // If MOQ was just reached, automatically pop open the Official OEM Purchase Order Modal!
        if (data.moqJustReached) {
          setActivePoRoom(data.room);
        }
      }
    } catch (err) {
      console.error('Failed to stake in room:', err);
    } finally {
      setBusyRoomId(null);
    }
  };

  const handleShare = (roomId: string) => {
    setCopiedId(roomId);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/ecosystem?room=${roomId}&product=${encodeURIComponent(
          chain.product.product_name
        )}`
      );
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Preview calculation for Create Modal
  const previewCostPerMember = Math.round(
    (Number(formTargetCost) || 35000) / Math.max(2, Number(formTargetMembers) || 5)
  );
  const previewDepositPerMember = Math.round(
    (previewCostPerMember * (Number(formDepositPct) || 30)) / 100
  );

  return (
    <div className="space-y-5">
      {/* =================================================================== */}
      {/* Live Toast Alert                                                    */}
      {/* =================================================================== */}
      {toastMessage && (
        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 font-black"
          >
            ✕
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. Unified Wallet & Safe Escrow Vault Status Bar                    */}
      {/* =================================================================== */}
      <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Phase 5: Real Group-Buy & Safe Escrow</span>
            </span>
            <span className="text-[11px] text-zinc-300 font-medium">
              ผูกกระเป๋าเงินจริง & บอร์ดประกาศ • ครบ MOQ ล็อกมัดจำและออกใบสั่งซื้อ PO ทันที
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/wallet"
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-bold flex items-center gap-1 transition-colors"
            >
              <Wallet className="w-3 h-3 text-emerald-400" />
              <span>กระเป๋าเงิน (/wallet)</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <Link
              href="/board?tab=PROJECT"
              className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10.5px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>บอร์ดประกาศ (/board)</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Available Wallet Balance */}
          <div className="rounded-xl bg-white/10 border border-white/15 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">
                💰 เงินสดพร้อมใช้ในกระเป๋า (Available)
              </div>
              <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                ฿{wallet.balanceThb.toLocaleString()}
              </div>
            </div>
            <button
              type="button"
              disabled={isToppingUp}
              onClick={() => handleTopUpWallet(10000)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all shrink-0"
            >
              {isToppingUp ? 'กำลังเติม...' : '+ เติม ฿10,000'}
            </button>
          </div>

          {/* Locked in Escrow Vault */}
          <div className="rounded-xl bg-white/10 border border-white/15 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">
                🔒 ล็อกมัดจำในตู้เซฟ (Escrow Vault)
              </div>
              <div className="text-lg font-black font-mono text-sky-400 mt-0.5">
                ฿{wallet.lockedBalanceThb.toLocaleString()}
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[9.5px] font-bold border border-sky-400/30">
              คุ้มครอง 100%
            </span>
          </div>

          {/* Active POs Issued */}
          <div className="rounded-xl bg-white/10 border border-white/15 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">
                📄 ใบสั่งซื้อโรงงาน OEM (Auto-PO)
              </div>
              <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
                {rooms.filter((r) => r.status === 'ESCROW_LOCKED_PO_SENT').length}{' '}
                <span className="text-xs font-normal text-zinc-300">ใบสั่งซื้อ</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#E53935] hover:bg-red-600 text-white text-[10.5px] font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เปิดห้องใหม่</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Automated Pipeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 text-[10px]">
          <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
            <b className="text-white">1. เปิดห้องหารล็อต:</b> โพสต์ขึ้นบอร์ด `/board` อัตโนมัติ
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
            <b className="text-sky-300">2. วางมัดจำปลอดภัย:</b> หักจากกระเป๋าพักใน Escrow
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
            <b className="text-amber-300">3. ครบจำนวน MOQ:</b> ล็อกเงินมัดจำทั้งกลุ่ม 100%
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
            <b className="text-emerald-300">4. ส่งใบสั่งซื้อ PO:</b> ยิง PO เข้าโรงงาน OEM ทันที
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. Opportunity Selector Header                                      */}
      {/* =================================================================== */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
        <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 mb-2 block">
          เลือกโมเดลธุรกิจในสายพาน &quot;{chain.product.product_name}&quot; ที่ต้องการเปิดห้องรวมล็อต:
        </label>
        <OppPicker
          chain={chain}
          value={activeKey}
          onChange={handleSelectKey}
        />
      </div>

      {/* =================================================================== */}
      {/* 3. Live Escrow Group-Buy Rooms List                                 */}
      {/* =================================================================== */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <span>🔥</span> ห้องรวมล็อตจริง & ตู้เซฟมัดจำปลอดภัย ({rooms.length} ห้อง)
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              เมื่อสมาชิกวางมัดจำครบตามจำนวนขั้นต่ำ (MOQ) ระบบจะล็อกเงินมัดจำและออกใบสั่งซื้อ PO ส่งโรงงาน OEM ทันที
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>เปิดห้องเชื่อมดอท + ประกาศขึ้นบอร์ด</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#E53935]" />
            <span>กำลังซิงก์ข้อมูลห้องรวมล็อตและตู้เซฟ Escrow...</span>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs">
            ยังไม่มีห้องรวมล็อตสำหรับสินค้านี้ เป็นคนแรกที่เปิดห้องได้เลย!
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => {
              const isLockedPo = room.status === 'ESCROW_LOCKED_PO_SENT';
              const memberPct = Math.min(
                100,
                Math.round((room.members / Math.max(1, room.targetMembers)) * 100)
              );
              const escrowPct = Math.min(
                100,
                Math.round(
                  (room.escrowLockedThb /
                    Math.max(1, room.totalDepositTargetThb)) *
                    100
                )
              );
              const isBusy = busyRoomId === room.id;
              const isExpanded = expandedRoomId === room.id;

              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                    isLockedPo
                      ? 'border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 hover:border-zinc-300'
                  }`}
                >
                  {/* Top Badges & PO Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          isLockedPo
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {isLockedPo ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>
                              ครบ MOQ! ล็อกมัดจำ & ส่งใบสั่งซื้อ {room.purchaseOrderNo}{' '}
                              แล้ว
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>
                              กำลังเปิดรับสมาชิก & วางมัดจำ ({room.members}/
                              {room.targetMembers} คน)
                            </span>
                          </>
                        )}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-200/80 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200">
                        สินค้า: {room.productName}
                      </span>

                      {room.linkedProjectId && (
                        <Link
                          href="/board?tab=PROJECT"
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 hover:underline"
                        >
                          <span>📢 ประกาศบนบอร์ดแล้ว</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>

                    <span className="text-[10.5px] font-mono font-bold text-zinc-500">
                      ล็อตรวม: {room.moqTotalUnits.toLocaleString()} {room.unitLabel} (฿
                      {room.lotCost.toLocaleString()})
                    </span>
                  </div>

                  {/* Title & OEM Factory Info */}
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-snug">
                      {room.modelName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-300 mt-1">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-sky-400">
                        <Factory className="w-3.5 h-3.5" />
                        โรงงานรับใบสั่งซื้อ: {room.factoryName}
                      </span>
                    </div>
                  </div>

                  {/* 3 Financial & Quota Highlight Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                      <div className="text-[10px] text-zinc-400">
                        1) โควต้าสินค้าต่อคน
                      </div>
                      <div className="font-black text-zinc-900 dark:text-white mt-0.5">
                        {room.unitsPerMember.toLocaleString()} {room.unitLabel}/คน
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        (มูลค่าเต็ม ฿{room.costPerMemberThb.toLocaleString()}/คน)
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                      <div className="text-[10px] text-zinc-400">
                        2) วางมัดจำเข้า Escrow ({room.depositPercent}%)
                      </div>
                      <div className="font-black text-[#E53935] font-mono mt-0.5">
                        ฿{room.depositPerMemberThb.toLocaleString()} / คน
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        ล็อกในตู้เซฟจนกว่าโรงงานจะส่งงาน
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                      <div className="text-[10px] text-zinc-400">
                        3) ยอดมัดจำที่ล็อกใน Escrow แล้ว
                      </div>
                      <div className="font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                        ฿{room.escrowLockedThb.toLocaleString()} / ฿
                        {room.totalDepositTargetThb.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {isLockedPo
                          ? `ออกใบสั่งซื้อ ${room.purchaseOrderNo} แล้ว`
                          : `ขาดอีก ${Math.max(
                              0,
                              room.targetMembers - room.members
                            )} คนจะยิง PO ทันที`}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">
                        ความคืบหน้าการรวมกลุ่ม MOQ: {room.members} /{' '}
                        {room.targetMembers} ท่าน ({memberPct}%)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRoomId(isExpanded ? null : room.id)
                        }
                        className="text-[10.5px] font-bold text-[#E53935] hover:underline"
                      >
                        {isExpanded
                          ? 'ซ่อนรายชื่อผู้วางมัดจำ ▲'
                          : `ดูรายชื่อผู้วางมัดจำ (${room.participants.length} ท่าน) ▼`}
                      </button>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isLockedPo
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-[#E53935] to-amber-500'
                        }`}
                        style={{ width: `${ Math.max(memberPct, escrowPct) }%` }}
                      />
                    </div>
                  </div>

                  {/* Expanded Participants & Escrow Ledger */}
                  {isExpanded && (
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 animate-fadeIn">
                      <div className="text-[10.5px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                        <span>📋 ทะเบียนสมาชิกที่วางมัดจำในตู้เซฟ Escrow แล้ว:</span>
                        <span className="text-emerald-600 font-mono">
                          รวม ฿{room.escrowLockedThb.toLocaleString()}
                        </span>
                      </div>
                      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[11px]">
                        {room.participants.map((pt, idx) => (
                          <div
                            key={pt.id || idx}
                            className="py-1.5 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                                {pt.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 font-mono text-[10.5px]">
                              <span className="text-zinc-500">
                                โควต้า {pt.unitsAllocated.toLocaleString()}{' '}
                                {room.unitLabel}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                                🔒 มัดจำ ฿{pt.depositLockedThb.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleShare(room.id)}
                      className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      {copiedId === room.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">คัดลอกลิงก์ชวนเพื่อนแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>แชร์ห้องหารล็อต</span>
                        </>
                      )}
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      {!isLockedPo ? (
                        <>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleJoinAndStake(room.id, false)}
                            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-zinc-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                          >
                            <Lock className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                            <span>
                              {isBusy
                                ? 'กำลังล็อกมัดจำ...'
                                : `เข้าร่วม & วางมัดจำ ฿${room.depositPerMemberThb.toLocaleString()}`}
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleJoinAndStake(room.id, true)}
                            className="px-3.5 py-2 rounded-xl bg-[#E53935] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                            title="จำลองสมาชิกเข้าร่วมจนครบจำนวนขั้นต่ำ MOQ เพื่อทดสอบการล็อกเงินและออกใบสั่งซื้อโรงงาน OEM ทันที"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>จำลองคนครบ MOQ & ออกใบ PO ทันที</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActivePoRoom(room)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                        >
                          <FileText className="w-4 h-4" />
                          <span>
                            ดูใบสั่งซื้อโรงงาน OEM ({room.purchaseOrderNo}) & สัญญา Escrow
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 4. Ecosystem Action Bridge                                          */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 mb-2">
              <Wallet className="w-3 h-3" /> บริการทางการเงิน
            </div>
            <h4 className="text-sm font-bold">ต้องการระดมทุนเพิ่มเพื่อเหมาล็อตใหญ่?</h4>
            <p className="text-xs text-zinc-300 mt-1">
              ส่งตัวเลขเงินทุนไปจัดตั้งตารางหุ้น (Cap Table) ร่วมกับนักลงทุนที่แท็บ &quot;ทำทุน&quot;
            </p>
          </div>
          <button
            onClick={() =>
              onNavigateTab
                ? onNavigateTab('ทำทุน')
                : onAction?.('/ecosystem?tab=capital')
            }
            className="mt-4 py-2 px-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>ไปที่แท็บ &quot;ทำทุน&quot;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 mb-2">
              <Building className="w-3 h-3" /> เครือข่ายกายภาพ
            </div>
            <h4 className="text-sm font-bold">ต้องการเลือกโรงงาน OEM ใกล้บ้านมารับใบ PO?</h4>
            <p className="text-xs text-zinc-300 mt-1">
              เปิดเรดาร์ปักหมุดโรงงานและซัพพลายเออร์ตามรัศมีใกล้บ้านที่แท็บ &quot;ทำใกล้&quot;
            </p>
          </div>
          <button
            onClick={() =>
              onNavigateTab
                ? onNavigateTab('ทำใกล้')
                : onAction?.('/ecosystem?tab=nearby')
            }
            className="mt-4 py-2 px-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>ไปที่แท็บ &quot;ทำใกล้&quot;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Modal 1: Create New Group-Buy & Safe Escrow Room                    */}
      {/* =================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#E53935]" />
                <span>เปิดห้องรวมล็อตจริง & ตั้งค่ามัดจำปลอดภัย (Escrow)</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  รูปแบบการรวมกลุ่ม
                </label>
                <select
                  value={formMode}
                  onChange={(e) => setFormMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  {DEFAULT_MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  หัวข้อ / สเปกสินค้าที่ต้องการรวมล็อต
                </label>
                <input
                  type="text"
                  placeholder={`เช่น รวมล็อตสั่งผลิต ${chain.product.product_name} เกรดพรีเมียม`}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  โรงงาน OEM เป้าหมายที่จะรับใบสั่งซื้อ (PO)
                </label>
                <input
                  type="text"
                  value={formFactoryName}
                  onChange={(e) => setFormFactoryName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    ยอดรวมทั้งล็อต (บาท)
                  </label>
                  <input
                    type="number"
                    value={formTargetCost}
                    onChange={(e) => setFormTargetCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    จำนวนขั้นต่ำ (MOQ)
                  </label>
                  <input
                    type="number"
                    value={formMoqUnits}
                    onChange={(e) => setFormMoqUnits(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    หน่วยนับ
                  </label>
                  <input
                    type="text"
                    value={formUnitLabel}
                    onChange={(e) => setFormUnitLabel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    จำนวนคนหารเป้าหมาย (คน)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={formTargetMembers}
                    onChange={(e) => setFormTargetMembers(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    สัดส่วนวางมัดจำ Escrow (%)
                  </label>
                  <select
                    value={formDepositPct}
                    onChange={(e) => setFormDepositPct(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold"
                  >
                    <option value="30">30% (มัดจำเริ่มผลิตมาตรฐาน)</option>
                    <option value="50">50% (มัดจำครึ่งราคา)</option>
                    <option value="100">100% (ล็อกเต็มจำนวน)</option>
                  </select>
                </div>
              </div>

              {/* Escrow Calculation Preview Box */}
              <div className="p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-1">
                <div className="font-bold text-[#D32F2F] flex items-center justify-between">
                  <span>🔒 สรุปยอดมัดจำเข้าตู้เซฟ Escrow ต่อคน:</span>
                  <span className="text-sm font-black font-mono">
                    ฿{previewDepositPerMember.toLocaleString()} / คน
                  </span>
                </div>
                <p className="text-[10.5px] text-zinc-600 dark:text-zinc-300">
                  จากยอดเต็มคนละ ฿{previewCostPerMember.toLocaleString()} • เมื่อครบ{' '}
                  {formTargetMembers} คน ระบบจะล็อกเงินมัดจำรวม ฿
                  {(
                    previewDepositPerMember *
                    Math.max(2, Number(formTargetMembers) || 5)
                  ).toLocaleString()}{' '}
                  และส่งใบสั่งซื้อ PO ให้โรงงานทันที
                </p>
              </div>

              {/* Board Auto-Publish Checkbox */}
              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formPublishBoard}
                  onChange={(e) => setFormPublishBoard(e.target.checked)}
                  className="mt-0.5 accent-[#E53935]"
                />
                <div>
                  <span className="font-bold text-zinc-900 dark:text-white block">
                    📢 โพสต์ประกาศขึ้นหน้า &quot;บอร์ด (/board)&quot; อัตโนมัติ
                  </span>
                  <span className="text-[10.5px] text-zinc-500">
                    สร้างการ์ดทั้งในแท็บ &quot;โปรเจกต์&quot; และ &quot;ภารกิจปัญหา&quot; เพื่อให้คนในระบบนิเวศเห็นและมาร่วมลงขันได้ทันที
                  </span>
                </div>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={busyRoomId === 'CREATING'}
                  className="px-5 py-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {busyRoomId === 'CREATING'
                      ? 'กำลังเปิดห้อง & ล็อกมัดจำ...'
                      : `เปิดห้อง & วางมัดจำ ฿${previewDepositPerMember.toLocaleString()}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* Modal 2: Official OEM Purchase Order (PO) & Safe Escrow Certificate */}
      {/* =================================================================== */}
      {activePoRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-500 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-scaleUp">
            {/* PO Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>OFFICIAL OEM PURCHASE ORDER & ESCROW LOCK CERTIFICATE</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                  ใบสั่งซื้อโรงงาน OEM อัตโนมัติ #{activePoRoom.purchaseOrderNo}
                </h3>
                <p className="text-[11px] text-zinc-500">
                  ออกเมื่อ:{' '}
                  {activePoRoom.poIssuedAt
                    ? new Date(activePoRoom.poIssuedAt).toLocaleString('th-TH')
                    : new Date().toLocaleString('th-TH')}
                </p>
              </div>
              <button
                onClick={() => setActivePoRoom(null)}
                className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Parties Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <div className="text-[10px] text-zinc-400 font-bold">
                  ผู้สั่งซื้อ (Group-Buy Consortium):
                </div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5">
                  กลุ่มผู้ประกอบการเชื่อมดอท ({activePoRoom.members} ท่าน)
                </div>
                <div className="text-[10.5px] text-emerald-600 font-semibold mt-0.5">
                  ✓ ยืนยันตัวตนและวางเงินมัดจำครบ 100%
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <div className="text-[10px] text-blue-600 dark:text-sky-400 font-bold">
                  ผู้รับใบสั่งซื้อ (Target OEM Factory):
                </div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5">
                  {activePoRoom.factoryName}
                </div>
                <div className="text-[10.5px] text-blue-600 dark:text-sky-300 font-semibold mt-0.5">
                  ✓ ส่งใบสั่งซื้ออิเล็กทรอนิกส์เข้าสู่ระบบโรงงานแล้ว
                </div>
              </div>
            </div>

            {/* Order Summary Table */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs">
              <div className="bg-zinc-900 text-white px-3.5 py-2 font-bold flex items-center justify-between">
                <span>รายการสั่งผลิต (Order Specification)</span>
                <span>จำนวน / ยอดเงิน</span>
              </div>
              <div className="p-3.5 space-y-2 bg-white dark:bg-zinc-900">
                <div className="flex justify-between">
                  <span className="text-zinc-500">สินค้าอ้างอิง:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {activePoRoom.productName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">รายละเอียดล็อตผลิต:</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-right">
                    {activePoRoom.modelName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ปริมาณสั่งผลิตรวม (MOQ):</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">
                    {activePoRoom.moqTotalUnits.toLocaleString()}{' '}
                    {activePoRoom.unitLabel} (เฉลี่ยคนละ{' '}
                    {activePoRoom.unitsPerMember.toLocaleString()}{' '}
                    {activePoRoom.unitLabel})
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">มูลค่าใบสั่งซื้อรวมทั้งล็อต:</span>
                  <span className="font-mono font-black text-zinc-900 dark:text-white">
                    ฿{activePoRoom.lotCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>
                    🔒 เงินมัดจำที่ล็อกในตู้เซฟ Escrow แล้ว ({activePoRoom.depositPercent}%):
                  </span>
                  <span className="font-mono text-sm font-black">
                    ฿{activePoRoom.escrowLockedThb.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Stage Safe Escrow Milestone Schedule */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <div className="font-black text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>เงื่อนไขการปล่อยเงินจากตู้เซฟคนกลาง (3-Stage Escrow Protection)</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>
                    • <b>งวดที่ 1 (เริ่มเดินสายพานผลิต):</b> เมื่อโรงงานยืนยันคิวผลิตและวัตถุดิบ
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                    พร้อมเบิกจ่าย
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    • <b>งวดที่ 2 (ตรวจรับ QC ล็อตผลิต):</b> เมื่อส่งผลตรวจคุณภาพสินค้าผ่านเกณฑ์
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold">
                    ล็อกใน Escrow
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    • <b>งวดที่ 3 (ส่งมอบครบทุกท่าน):</b> เมื่อจัดส่งสินค้าตามโควต้าถึงมือสมาชิกครบ
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold">
                    ล็อกใน Escrow
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <Link
                  href="/wallet"
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ดูยอดล็อกในกระเป๋าเงิน (/wallet)</span>
                </Link>
                <Link
                  href="/board?tab=PROJECT"
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>ดูสถานะบนบอร์ด (/board)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setActivePoRoom(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-zinc-900 text-xs font-bold"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
