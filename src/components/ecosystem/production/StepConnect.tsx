'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Plus,
  Share2,
  CheckCircle,
  Building,
  TrendingUp,
  Sparkles,
  Wallet,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  Check,
} from 'lucide-react';
import { ProductChain, FlatOpportunity, STRATEGY_META } from './types';
import { OppPicker } from './OppPicker';
import { loadRooms, saveRooms, GroupRoom } from './storage';

interface StepConnectProps {
  chain: ProductChain;
  selectedOppKey?: string;
  onSelectOppKey?: (key: string) => void;
  onAction?: (actionUrl: string) => void;
  onNavigateTab?: (tab: string) => void;
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
    desc: 'จับคู่พันธมิตรคนละหน้าที่: คนคั่ว + คนทำแบรนด์ + คนขายไลฟ์สด เพื่อสร้างระบบนิเวศร่วมกัน',
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
  // Flatten opportunities
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

  // Rooms state
  const [rooms, setRooms] = useState<GroupRoom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formMode, setFormMode] = useState(DEFAULT_MODES[0].id);
  const [formTargetCost, setFormTargetCost] = useState('50000');
  const [formTargetMembers, setFormTargetMembers] = useState('5');
  const [formNote, setFormNote] = useState('');

  // Initial load
  useEffect(() => {
    const saved = loadRooms();
    if (saved.length > 0) {
      setRooms(saved);
    } else {
      // Seed default rooms for coffee or current product
      const seedRooms: GroupRoom[] = [
        {
          id: 'room_coffee_1',
          productName: chain.product.product_name,
          modelName: 'รวมล็อตสั่งซื้อสารกาแฟดิบเกรดพรีเมียม 300 กก.',
          mode: 'moq',
          members: 3,
          lotCost: 65000,
          createdAt: Date.now() - 3600000 * 4,
        },
        {
          id: 'room_coffee_2',
          productName: chain.product.product_name,
          modelName: 'หารค่าบล็อกสกรีนซองฟอยล์วาล์วทางเดียว 5,000 ซอง',
          mode: 'shared_tooling',
          members: 4,
          lotCost: 35000,
          createdAt: Date.now() - 3600000 * 18,
        },
        {
          id: 'room_coffee_3',
          productName: chain.product.product_name,
          modelName: 'เครือข่ายไมโครโรสเตอร์ + ร้านคาเฟ่ระแวกใกล้เคียง',
          mode: 'consortium',
          members: 2,
          lotCost: 40000,
          createdAt: Date.now() - 3600000 * 48,
        },
      ];
      setRooms(seedRooms);
      saveRooms(seedRooms);
    }
  }, [chain.product.product_name]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;

    const selectedModeObj = DEFAULT_MODES.find((m) => m.id === formMode);
    const newRoom: GroupRoom = {
      id: `room_${Date.now()}`,
      productName: chain.product.product_name,
      modelName: formNote.trim() || `${selectedModeObj?.title} - ${active.opp.model_name}`,
      mode: formMode,
      members: 1,
      lotCost: Number(formTargetCost) || 50000,
      createdAt: Date.now(),
    };

    const next = [newRoom, ...rooms];
    setRooms(next);
    saveRooms(next);
    setJoinedRooms((prev) => ({ ...prev, [newRoom.id]: true }));
    setShowCreateModal(false);
    setFormNote('');
  };

  const handleJoin = (roomId: string) => {
    setJoinedRooms((prev) => {
      const isJoined = !!prev[roomId];
      const nextJoined = { ...prev, [roomId]: !isJoined };
      setRooms((prevRooms) => {
        const updated = prevRooms.map((r) => {
          if (r.id === roomId) {
            return {
              ...r,
              members: isJoined ? Math.max(1, r.members - 1) : r.members + 1,
            };
          }
          return r;
        });
        saveRooms(updated);
        return updated;
      });
      return nextJoined;
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 mb-2">
              <Users className="w-3.5 h-3.5" />
              ขั้นตอนที่ 06: เชื่อมดอท (Ecosystem Aggregation)
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span>🤝</span> รวมกลุ่มแชร์ล็อตผลิต & ทะลวงขั้นต่ำโรงงาน
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              หมดยุคตัวคนเดียว รวมพลังกับผู้ประกอบการและนักสร้างสรรค์ในระบบนิเวศ ลดต้นทุนได้สูงสุดถึง 50%
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-transform hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>เปิดห้องเชื่อมดอทใหม่</span>
          </button>
        </div>

        {/* Opportunity Picker */}
        <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 block">
            เลือกโมเดลธุรกิจที่ต้องการสร้างเครือข่ายเชื่อมดอท:
          </label>
          <OppPicker
            chain={chain}
            value={activeKey}
            onChange={handleSelectKey}
          />
        </div>
      </div>

      {/* 3 Modes Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEFAULT_MODES.map((mode) => (
          <div
            key={mode.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mb-2">
                {mode.badge}
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1.5">
                {mode.title}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {mode.desc}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" /> สัญญาโปร่งใส
              </span>
              <span className="text-red-600 dark:text-red-400 font-semibold">
                ลดสูงสุด 50%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Aggregation Rooms List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span>🔥</span> ห้องรวมล็อตที่กำลังเปิดรับ ({rooms.length} ห้อง)
          </h3>
          <span className="text-xs text-zinc-500">
            สินค้า: {chain.product.product_name}
          </span>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs">
            ยังไม่มีห้องรวมล็อตสำหรับสินค้านี้ เป็นคนแรกที่เปิดห้องได้เลย!
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => {
              const isJoined = !!joinedRooms[room.id];
              const targetMembers = 5;
              const percent = Math.min(100, Math.round((room.members / targetMembers) * 100));
              const costPerMember = Math.round(room.lotCost / Math.max(1, room.members));

              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isJoined
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                          {room.mode === 'moq'
                            ? 'MOQ Group Buy'
                            : room.mode === 'shared_tooling'
                            ? 'แชร์ค่าบล็อก/โมลด์'
                            : 'เครือข่ายพันธมิตร'}
                        </span>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> เปิดเมื่อ{' '}
                          {new Date(room.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {room.modelName}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        ยอดรวมล็อต:{' '}
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          ฿{room.lotCost.toLocaleString()}
                        </span>{' '}
                        • แชร์เฉลี่ยคนละประมาณ:{' '}
                        <span className="font-bold text-red-600 dark:text-red-400">
                          ฿{costPerMember.toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShare(room.id)}
                        className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs flex items-center gap-1"
                        title="คัดลอกลิงก์ชวนเพื่อน"
                      >
                        {copiedId === room.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px] text-emerald-600">คัดลอกแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">แชร์</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleJoin(room.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isJoined
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 shadow'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>เข้าร่วมแล้ว (แตะเพื่อออก)</span>
                          </>
                        ) : (
                          <>
                            <Users className="w-3.5 h-3.5" />
                            <span>ขอเข้าร่วมกลุ่ม</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-700/60">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-zinc-500">
                        สมาชิกปัจจุบัน: {room.members} / {targetMembers} ท่าน
                      </span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        ความคืบหน้า {percent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-emerald-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ecosystem Action Bridge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 mb-2">
              <Wallet className="w-3 h-3" /> บริการทางการเงิน
            </div>
            <h4 className="text-sm font-bold">ต้องการทุนหมุนเวียนในการร่วมสั่งล็อต?</h4>
            <p className="text-xs text-zinc-300 mt-1">
              ยื่นข้อเสนอแผนธุรกิจหรือขอสินเชื่อสำหรับกลุ่มผู้ผลิตที่แท็บ "ทำทุน"
            </p>
          </div>
          <button
            onClick={() => (onNavigateTab ? onNavigateTab('ทำทุน') : onAction?.('/ecosystem?tab=capital'))}
            className="mt-4 py-2 px-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>ไปที่แท็บ "ทำทุน"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 mb-2">
              <Building className="w-3 h-3" /> เครือข่ายกายภาพ
            </div>
            <h4 className="text-sm font-bold">หาโรงงาน คลังสินค้า หรือผู้จัดส่งในพื้นที่?</h4>
            <p className="text-xs text-zinc-300 mt-1">
              ค้นหาพาร์ตเนอร์เชิงภูมิศาสตร์ตามรัศมีระยะทางที่แท็บ "ทำใกล้"
            </p>
          </div>
          <button
            onClick={() => (onNavigateTab ? onNavigateTab('ทำใกล้') : onAction?.('/ecosystem?tab=nearby'))}
            className="mt-4 py-2 px-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>ไปที่แท็บ "ทำใกล้"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal: Create Room */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                เปิดห้องเชื่อมดอทใหม่
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  รูปแบบการรวมกลุ่ม
                </label>
                <select
                  value={formMode}
                  onChange={(e) => setFormMode(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  {DEFAULT_MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  หัวข้อ / สเปกสินค้าที่ต้องการรวมกลุ่ม
                </label>
                <input
                  type="text"
                  placeholder={`เช่น รวมยอดสั่งผลิต ${chain.product.product_name} ขั้นต่ำ 1,000 ชิ้น`}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    ยอดรวมงบประมาณ (บาท)
                  </label>
                  <input
                    type="number"
                    value={formTargetCost}
                    onChange={(e) => setFormTargetCost(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                    จำนวนสมาชิกเป้าหมาย (คน)
                  </label>
                  <input
                    type="number"
                    value={formTargetMembers}
                    onChange={(e) => setFormTargetMembers(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
                >
                  สร้างห้องทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
