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

  const poCount = rooms.filter((r) => r.status === 'ESCROW_LOCKED_PO_SENT').length;

  return (
    <div className="space-y-4 pb-8">
      {/* =================================================================== */}
      {/* Live Toast Alert                                                    */}
      {/* =================================================================== */}
      {toastMessage && (
        <div className="rounded-2xl border border-brand-red/30 bg-red-50 dark:bg-red-950/60 p-3 text-xs font-bold text-brand-black dark:text-white flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-brand-black font-black px-1 shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. Make-a-dot Safe Escrow & Wallet Card (Mobile-First Column Flow)  */}
      {/* =================================================================== */}
      <div className="rounded-3xl bg-brand-black text-white p-4 shadow-md space-y-3.5">
        {/* Header with Breathing Dot */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-3.5 h-3.5 bg-brand-red rounded-full shrink-0"
              style={{
                animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite',
              }}
            />
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold tracking-tight text-white leading-tight">
                รวมพลังคนตัวเล็ก • ทะลวงขั้นต่ำโรงงาน
              </h2>
              <p className="text-[10.5px] text-gray-300 mt-0.5 leading-snug">
                พักเงินมัดจำในตู้เซฟกลาง ครบจำนวนเมื่อไหร่ ระบบส่งใบสั่งผลิตให้โรงงานทันที
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Stacked Wallet & Escrow Summary (Fits 320px Phone Frame) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Box 1: Available Cash */}
          <div className="rounded-2xl bg-white/10 border border-white/10 p-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-gray-300 font-medium">
                💰 เงินสดพร้อมใช้
              </div>
              <div className="text-base font-extrabold font-mono text-white mt-0.5">
                ฿{wallet.balanceThb.toLocaleString('th-TH')}
              </div>
            </div>
            <button
              type="button"
              disabled={isToppingUp}
              onClick={() => handleTopUpWallet(10000)}
              className="mt-2.5 w-full py-1.5 px-2 rounded-xl bg-brand-red hover:opacity-90 active:scale-95 text-white text-[10.5px] font-bold transition-all text-center shadow-xs"
            >
              {isToppingUp ? 'กำลังเติมเงิน...' : '+ เติมเงิน ฿10,000'}
            </button>
          </div>

          {/* Box 2: Safe Escrow Locked */}
          <div className="rounded-2xl bg-white/10 border border-white/10 p-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-gray-300 font-medium">
                🔒 ล็อกมัดจำปลอดภัย
              </div>
              <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
                ฿{wallet.lockedBalanceThb.toLocaleString('th-TH')}
              </div>
            </div>
            <div className="mt-2.5 w-full py-1.5 px-2 rounded-xl bg-white/10 text-gray-200 text-[10px] font-bold text-center">
              คุ้มครอง 100% • {poCount} ใบสั่งผลิต
            </div>
          </div>
        </div>

        {/* Quick Navigation Pills (Wallet & Board) */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/wallet"
            className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-brand-red" />
              <span>กระเป๋าเงินของฉัน</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <Link
            href="/board?tab=PROJECT"
            className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-red" />
              <span>บอร์ดรวมล็อต</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>

        {/* 4-Step Compact 2x2 Guide */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
          <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 leading-snug">
            <b className="text-white block">1. เปิดห้องหารล็อต</b>
            ขึ้นบอร์ดหาแนวร่วมอัตโนมัติ
          </div>
          <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 leading-snug">
            <b className="text-white block">2. วางมัดจำปลอดภัย</b>
            พักเงินในตู้เซฟคนกลาง
          </div>
          <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 leading-snug">
            <b className="text-white block">3. คนครบขั้นต่ำ</b>
            ล็อกยอดสั่งผลิตรวมทั้งกลุ่ม
          </div>
          <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 leading-snug">
            <b className="text-brand-red block">4. ส่งใบสั่งผลิตทันที</b>
            โรงงานเริ่มเดินสายพานผลิต
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. Opportunity Selector Card                                        */}
      {/* =================================================================== */}
      <div className="bg-brand-gray dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-brand-black dark:text-white">
            เลือกโมเดลธุรกิจในสายพาน &ldquo;{chain.product.product_name}&rdquo;
          </label>
        </div>
        <OppPicker
          chain={chain}
          value={activeKey}
          onChange={handleSelectKey}
        />
      </div>

      {/* =================================================================== */}
      {/* 3. Live Group-Buy & Safe Escrow Rooms                               */}
      {/* =================================================================== */}
      <div className="space-y-3">
        {/* Section Title + Primary Brand CTA */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 bg-brand-red rounded-full shrink-0"
                  style={{
                    animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite',
                  }}
                />
                <h3 className="text-sm font-extrabold text-brand-black dark:text-white">
                  ห้องรวมล็อตเปิดรับสมาชิก ({rooms.length} ห้อง)
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-snug">
                รวมกลุ่มสั่งผลิตเพื่อได้ราคาต้นทุนโรงงาน พร้อมระบบคุ้มครองเงินมัดจำทุกบาท
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-brand-red hover:opacity-95 active:scale-98 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>เปิดห้องรวมล็อตใหม่ & โพสต์ขึ้นบอร์ด</span>
          </button>
        </div>

        {/* Rooms List */}
        {loading ? (
          <div className="rounded-3xl bg-brand-gray dark:bg-zinc-900 py-10 px-4 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-red" />
            <span>กำลังโหลดห้องรวมล็อตและข้อมูลตู้เซฟมัดจำ...</span>
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-3xl bg-brand-gray dark:bg-zinc-900 py-10 px-4 text-center text-gray-500 text-xs">
            ยังไม่มีห้องรวมล็อตสำหรับสินค้านี้ กดปุ่มสีแดงด้านบนเพื่อประเดิมเปิดห้องแรกได้เลย!
          </div>
        ) : (
          <div className="space-y-3">
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
                  className={`p-4 rounded-3xl border transition-all space-y-3 ${
                    isLockedPo
                      ? 'border-emerald-500 bg-white dark:bg-zinc-900 shadow-sm'
                      : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs'
                  }`}
                >
                  {/* Status Row */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        isLockedPo
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-50 text-brand-red border border-red-200/70'
                      }`}
                    >
                      {isLockedPo ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ครบขั้นต่ำ • ส่งใบสั่งผลิตแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>
                            เปิดรับแนวร่วม ({room.members}/{room.targetMembers} คน)
                          </span>
                        </>
                      )}
                    </span>

                    {room.linkedProjectId && (
                      <Link
                        href="/board?tab=PROJECT"
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-zinc-200 inline-flex items-center gap-1 hover:underline"
                      >
                        <span>📢 ดูบนบอร์ด</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>

                  {/* Title & Factory */}
                  <div className="space-y-1">
                    <div className="text-[10.5px] font-bold text-brand-red">
                      สินค้า: {room.productName} • ล็อตรวม {room.moqTotalUnits.toLocaleString('th-TH')}{' '}
                      {room.unitLabel}
                    </div>
                    <h4 className="text-sm font-extrabold text-brand-black dark:text-white leading-snug">
                      {room.modelName}
                    </h4>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 pt-0.5">
                      <Factory className="w-3.5 h-3.5 text-brand-black dark:text-zinc-300 shrink-0" />
                      <span className="truncate">{room.factoryName}</span>
                    </div>
                  </div>

                  {/* 2-Column Quota & Deposit Highlight (Clean Mobile Fit) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800/70">
                      <div className="text-[10px] text-gray-500 dark:text-zinc-400">
                        โควตาสินค้าต่อคน
                      </div>
                      <div className="text-xs font-extrabold text-brand-black dark:text-white mt-0.5">
                        {room.unitsPerMember.toLocaleString('th-TH')} {room.unitLabel} / คน
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        มูลค่าล็อต ฿{room.costPerMemberThb.toLocaleString('th-TH')}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40">
                      <div className="text-[10px] text-gray-600 dark:text-zinc-300">
                        มัดจำปลอดภัย ({room.depositPercent}%)
                      </div>
                      <div className="text-xs font-extrabold text-brand-red font-mono mt-0.5">
                        ฿{room.depositPerMemberThb.toLocaleString('th-TH')} / คน
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        คุ้มครองในตู้เซฟกลาง
                      </div>
                    </div>
                  </div>

                  {/* Progress & Escrow Total */}
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-black dark:text-zinc-200">
                        มัดจำรวมในตู้เซฟ: ฿{room.escrowLockedThb.toLocaleString('th-TH')} / ฿
                        {room.totalDepositTargetThb.toLocaleString('th-TH')}
                      </span>
                      <span className="font-mono font-bold text-brand-red">
                        {Math.max(memberPct, escrowPct)}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isLockedPo ? 'bg-emerald-500' : 'bg-brand-red'
                        }`}
                        style={{ width: `${Math.max(memberPct, escrowPct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] pt-0.5">
                      <span className="text-gray-500">
                        {isLockedPo
                          ? `ใบสั่งผลิต: ${room.purchaseOrderNo}`
                          : `ขาดอีก ${Math.max(
                              0,
                              room.targetMembers - room.members
                            )} คนจะส่งใบสั่งผลิตทันที`}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRoomId(isExpanded ? null : room.id)
                        }
                        className="font-bold text-brand-black dark:text-zinc-300 underline"
                      >
                        {isExpanded
                          ? 'ซ่อนรายชื่อ ▲'
                          : `ดูผู้ร่วมลงขัน (${room.participants.length}) ▼`}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Participants List */}
                  {isExpanded && (
                    <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800/70 space-y-2">
                      <div className="text-[10.5px] font-bold text-brand-black dark:text-white flex items-center justify-between">
                        <span>รายชื่อผู้วางมัดจำในตู้เซฟ</span>
                        <span className="text-emerald-600 font-mono">
                          รวม ฿{room.escrowLockedThb.toLocaleString('th-TH')}
                        </span>
                      </div>
                      <div className="divide-y divide-gray-200/70 dark:divide-zinc-700 text-[11px]">
                        {room.participants.map((pt, idx) => (
                          <div
                            key={pt.id || idx}
                            className="py-1.5 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-4 h-4 rounded-full bg-brand-black text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-brand-black dark:text-zinc-200 truncate">
                                {pt.name}
                              </span>
                            </div>
                            <span className="shrink-0 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                              {pt.unitsAllocated.toLocaleString('th-TH')} {room.unitLabel} • ฿
                              {pt.depositLockedThb.toLocaleString('th-TH')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vertical Stacked Action Buttons (Zero Overlap on Mobile) */}
                  <div className="pt-1 space-y-2">
                    {!isLockedPo ? (
                      <>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleJoinAndStake(room.id, false)}
                          className="w-full py-2.5 px-4 rounded-2xl bg-brand-black hover:opacity-90 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                        >
                          <Lock className="w-3.5 h-3.5 text-brand-red" />
                          <span>
                            {isBusy
                              ? 'กำลังล็อกเงินมัดจำ...'
                              : `เข้าร่วมกลุ่ม & วางมัดจำ ฿${room.depositPerMemberThb.toLocaleString('th-TH')}`}
                          </span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleJoinAndStake(room.id, true)}
                            className="py-2 px-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-brand-red border border-red-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                          >
                            <Zap className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">จำลองคนครบ & ออก PO</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShare(room.id)}
                            className="py-2 px-2.5 rounded-2xl bg-brand-gray hover:bg-gray-200 text-brand-black text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                          >
                            {copiedId === room.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-emerald-600 truncate">คัดลอกลิงก์แล้ว</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">แชร์ชวนเพื่อน</span>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setActivePoRoom(room)}
                          className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span>
                            เปิดดูใบสั่งผลิต #{room.purchaseOrderNo}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 4. Cross-Tab Ecosystem Shortcuts (Stacked Vertically for Mobile)    */}
      {/* =================================================================== */}
      <div className="space-y-2.5">
        <div className="rounded-3xl bg-brand-gray dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-brand-red">
              💰 ต่อยอดเงินทุน
            </div>
            <h4 className="text-xs font-extrabold text-brand-black dark:text-white mt-0.5">
              ต้องการระดมทุนเพิ่มเพื่อเหมาล็อตใหญ่?
            </h4>
            <p className="text-[10.5px] text-gray-500 mt-0.5">
              ส่งงบลงทุนไปจัดตารางหุ้นอัตโนมัติในแท็บ &ldquo;ทำทุน&rdquo;
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onNavigateTab
                ? onNavigateTab('ทำทุน')
                : onAction?.('/ecosystem?tab=capital')
            }
            className="shrink-0 px-3.5 py-2 rounded-2xl bg-brand-black text-white text-[11px] font-bold flex items-center gap-1"
          >
            <span>ไปทำทุน</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="rounded-3xl bg-brand-gray dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-brand-red">
              📍 พิกัดโรงงานใกล้บ้าน
            </div>
            <h4 className="text-xs font-extrabold text-brand-black dark:text-white mt-0.5">
              ค้นหาโรงงานรับผลิตใกล้พื้นที่ของคุณ
            </h4>
            <p className="text-[10.5px] text-gray-500 mt-0.5">
              เปิดเรดาร์ปักหมุดโรงงานและซัพพลายเออร์ในแท็บ &ldquo;ทำใกล้&rdquo;
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onNavigateTab
                ? onNavigateTab('ทำใกล้')
                : onAction?.('/ecosystem?tab=nearby')
            }
            className="shrink-0 px-3.5 py-2 rounded-2xl bg-brand-black text-white text-[11px] font-bold flex items-center gap-1"
          >
            <span>ไปทำใกล้</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Modal 1: เปิดห้องรวมล็อตใหม่ & ตั้งค่ามัดจำปลอดภัย                   */}
      {/* =================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-[390px] w-full p-4 shadow-2xl space-y-3.5 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 bg-brand-red rounded-full shrink-0"
                  style={{
                    animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite',
                  }}
                />
                <h3 className="text-sm font-extrabold text-brand-black dark:text-white">
                  เปิดห้องรวมล็อตใหม่
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full bg-brand-gray text-gray-500 hover:text-brand-black text-xs font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-brand-black dark:text-zinc-200 block mb-1">
                  รูปแบบการรวมกลุ่ม
                </label>
                <select
                  value={formMode}
                  onChange={(e) => setFormMode(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white font-medium"
                >
                  {DEFAULT_MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-brand-black dark:text-zinc-200 block mb-1">
                  ชื่อห้อง / สเปกสินค้าที่ต้องการรวมล็อต
                </label>
                <input
                  type="text"
                  placeholder={`เช่น รวมล็อตสั่งผลิต ${chain.product.product_name} เกรดพรีเมียม`}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-brand-black dark:text-zinc-200 block mb-1">
                  โรงงานผู้รับใบสั่งผลิต
                </label>
                <input
                  type="text"
                  value={formFactoryName}
                  onChange={(e) => setFormFactoryName(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-brand-black dark:text-zinc-200 block mb-1">
                    มูลค่าทั้งล็อต (บาท)
                  </label>
                  <input
                    type="number"
                    value={formTargetCost}
                    onChange={(e) => setFormTargetCost(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-brand-black dark:text-zinc-200 block mb-1">
                    จำนวนขั้นต่ำ ({formUnitLabel})
                  </label>
                  <input
                    type="number"
                    value={formMoqUnits}
                    onChange={(e) => setFormMoqUnits(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-brand-black dark:text-zinc-200 block mb-1">
                    จำนวนคนหาร (คน)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={formTargetMembers}
                    onChange={(e) => setFormTargetMembers(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-brand-black dark:text-zinc-200 block mb-1">
                    มัดจำเข้าตู้เซฟ (%)
                  </label>
                  <select
                    value={formDepositPct}
                    onChange={(e) => setFormDepositPct(e.target.value)}
                    className="w-full p-2.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-brand-gray dark:bg-zinc-800 text-brand-black dark:text-white font-bold"
                  >
                    <option value="30">30% (มาตรฐาน)</option>
                    <option value="50">50% (ครึ่งราคา)</option>
                    <option value="100">100% (เต็มจำนวน)</option>
                  </select>
                </div>
              </div>

              {/* Escrow Calculation Preview */}
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-1">
                <div className="font-extrabold text-brand-red flex items-center justify-between">
                  <span>🔒 มัดจำปลอดภัยต่อคน:</span>
                  <span className="text-sm font-black font-mono">
                    ฿{previewDepositPerMember.toLocaleString('th-TH')} / คน
                  </span>
                </div>
                <p className="text-[10.5px] text-gray-600 dark:text-zinc-300 leading-snug">
                  เมื่อครบ {formTargetMembers} คน ระบบจะล็อกเงินมัดจำรวม ฿
                  {(
                    previewDepositPerMember *
                    Math.max(2, Number(formTargetMembers) || 5)
                  ).toLocaleString('th-TH')}{' '}
                  และออกใบสั่งผลิตส่งโรงงานทันที
                </p>
              </div>

              {/* Board Auto-Publish Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formPublishBoard}
                  onChange={(e) => setFormPublishBoard(e.target.checked)}
                  className="mt-0.5 accent-brand-red"
                />
                <div>
                  <span className="font-bold text-brand-black dark:text-white block">
                    📢 ประกาศหาแนวร่วมบนหน้าบอร์ดอัตโนมัติ
                  </span>
                  <span className="text-[10.5px] text-gray-500 leading-snug block mt-0.5">
                    แสดงห้องรวมล็อตนี้บนหน้าบอร์ดเพื่อให้เพื่อนผู้ประกอบการเข้ามาร่วมแจมได้ทันที
                  </span>
                </div>
              </label>

              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={busyRoomId === 'CREATING'}
                  className="w-full py-2.5 px-4 rounded-2xl bg-brand-red hover:opacity-95 text-white font-bold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {busyRoomId === 'CREATING'
                      ? 'กำลังเปิดห้อง & ล็อกมัดจำ...'
                      : `ยืนยันเปิดห้อง & วางมัดจำ ฿${previewDepositPerMember.toLocaleString('th-TH')}`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full py-2 rounded-2xl font-bold text-gray-500 hover:bg-brand-gray"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* Modal 2: ใบสั่งผลิตโรงงานอัตโนมัติ & สัญญาคุ้มครองเงินมัดจำ          */}
      {/* =================================================================== */}
      {activePoRoom && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-500 rounded-3xl max-w-[390px] w-full p-4 shadow-2xl space-y-3.5 max-h-[88vh] overflow-y-auto">
            {/* PO Header */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold mb-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ออกใบสั่งผลิตอัตโนมัติเรียบร้อย</span>
                </div>
                <h3 className="text-sm font-extrabold text-brand-black dark:text-white">
                  ใบสั่งผลิต #{activePoRoom.purchaseOrderNo}
                </h3>
                <p className="text-[10.5px] text-gray-500">
                  วันที่ออกเอกสาร:{' '}
                  {activePoRoom.poIssuedAt
                    ? new Date(activePoRoom.poIssuedAt).toLocaleString('th-TH')
                    : new Date().toLocaleString('th-TH')}
                </p>
              </div>
              <button
                onClick={() => setActivePoRoom(null)}
                className="w-7 h-7 rounded-full bg-brand-gray text-gray-500 hover:text-brand-black font-bold flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Parties Info (Stacked for clean mobile view) */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800">
                <div className="text-[10px] text-gray-500 font-bold">
                  ผู้สั่งผลิต (กลุ่มรวมล็อตเชื่อมดอท)
                </div>
                <div className="font-extrabold text-brand-black dark:text-white mt-0.5">
                  สมาชิกผู้ร่วมลงขันครบ {activePoRoom.members} ท่าน
                </div>
                <div className="text-[10.5px] text-emerald-600 font-bold mt-0.5">
                  ✓ ล็อกเงินมัดจำในตู้เซฟครบ 100%
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-brand-gray dark:bg-zinc-800">
                <div className="text-[10px] text-gray-500 font-bold">
                  โรงงานผู้รับใบสั่งผลิต
                </div>
                <div className="font-extrabold text-brand-black dark:text-white mt-0.5">
                  {activePoRoom.factoryName}
                </div>
                <div className="text-[10.5px] text-brand-red font-bold mt-0.5">
                  ✓ ส่งใบสั่งผลิตเข้าสู่ระบบโรงงานแล้ว
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden text-xs">
              <div className="bg-brand-black text-white px-3.5 py-2 font-bold flex items-center justify-between">
                <span>รายละเอียดคำสั่งผลิต</span>
                <span>จำนวน / ยอดเงิน</span>
              </div>
              <div className="p-3 space-y-2 bg-white dark:bg-zinc-900">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500 shrink-0">สินค้า:</span>
                  <span className="font-bold text-brand-black dark:text-white text-right">
                    {activePoRoom.productName}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500 shrink-0">รายการผลิต:</span>
                  <span className="font-bold text-brand-black dark:text-white text-right">
                    {activePoRoom.modelName}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500 shrink-0">ปริมาณรวมทั้งล็อต:</span>
                  <span className="font-mono font-bold text-brand-black dark:text-white text-right">
                    {activePoRoom.moqTotalUnits.toLocaleString('th-TH')}{' '}
                    {activePoRoom.unitLabel} ({activePoRoom.unitsPerMember.toLocaleString('th-TH')}{' '}
                    {activePoRoom.unitLabel}/คน)
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <span className="text-gray-500">มูลค่ารวมทั้งล็อต:</span>
                  <span className="font-mono font-extrabold text-brand-black dark:text-white">
                    ฿{activePoRoom.lotCost.toLocaleString('th-TH')}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>🔒 มัดจำล็อกในตู้เซฟ ({activePoRoom.depositPercent}%):</span>
                  <span className="font-mono text-sm font-black">
                    ฿{activePoRoom.escrowLockedThb.toLocaleString('th-TH')}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Stage Protection */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 space-y-1.5 text-[11px]">
              <div className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>การคุ้มครองเงินมัดจำ 3 งวด</span>
              </div>
              <div className="space-y-1 text-gray-700 dark:text-zinc-300">
                <div className="flex items-center justify-between gap-2">
                  <span>1. โรงงานยืนยันคิวผลิตและวัตถุดิบ</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9.5px] font-bold shrink-0">
                    พร้อมเบิกงวดแรก
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>2. ตรวจรับคุณภาพสินค้า (QC) ผ่าน</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[9.5px] font-bold shrink-0">
                    ล็อกในตู้เซฟ
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>3. จัดส่งสินค้าถึงมือสมาชิกครบทุกคน</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[9.5px] font-bold shrink-0">
                    ล็อกในตู้เซฟ
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/wallet"
                  className="py-2 px-3 rounded-2xl bg-brand-gray text-brand-black text-[11px] font-bold flex items-center justify-center gap-1"
                >
                  <Wallet className="w-3.5 h-3.5 text-brand-red" />
                  <span>ดูกระเป๋าเงิน</span>
                </Link>
                <Link
                  href="/board?tab=PROJECT"
                  className="py-2 px-3 rounded-2xl bg-brand-gray text-brand-black text-[11px] font-bold flex items-center justify-center gap-1"
                >
                  <span>ดูบนบอร์ด</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setActivePoRoom(null)}
                className="w-full py-2.5 rounded-2xl bg-brand-black text-white text-xs font-bold"
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
