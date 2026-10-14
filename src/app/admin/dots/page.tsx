'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NongDot, NONG_DOT_CATALOG, NongDotMood } from '@/components/flow/NongDot';

export default function NongDotAdminGalleryPage() {
  const [selectedSize, setSelectedSize] = useState<number>(20);
  const [activeCategory, setActiveCategory] = useState<'all' | 'interaction' | 'finance' | 'status'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playgroundMood, setPlaygroundMood] = useState<NongDotMood>('greeting');
  const [playgroundText, setPlaygroundText] = useState('ให้เรารู้จักคุณหน่อย โปรดเลือกวงการที่คุณจะทำ');

  const filteredCatalog = activeCategory === 'all'
    ? NONG_DOT_CATALOG
    : NONG_DOT_CATALOG.filter((item) => item.category === activeCategory);

  const handleCopyCode = (mood: NongDotMood) => {
    const code = `<NongDot mood="${mood}" size={${selectedSize}} />`;
    navigator.clipboard.writeText(code);
    setCopiedId(mood);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121418] font-prompt text-gray-900 dark:text-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Link href="/admin" className="hover:text-brand-red flex items-center gap-1 transition-colors">
                <i className="fa-solid fa-arrow-left"></i>
                <span>แผงควบคุมแอดมิน</span>
              </Link>
              <span>/</span>
              <span className="text-gray-800 dark:text-gray-200 font-bold">คลังน้องดอท (Nong Dot Gallery)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center text-xs shadow-xs">
                <i className="fa-solid fa-circle-dot"></i>
              </span>
              <span>คลังน้องดอท 12 อารมณ์ & บริบท</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              ศูนย์รวมโมเดลแอนิเมชันน้องดอท 12 แบบ สำหรับเรียกใช้งานตามบริบทและสถานการณ์ใน MAKE A DOT
            </p>
          </div>

          <Link
            href="/admin"
            className="self-start sm:self-auto px-4 py-2 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 hover:border-brand-red rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2"
          >
            <i className="fa-solid fa-gauge"></i>
            <span>กลับสู่ Dashboard</span>
          </Link>
        </div>

        {/* Live Playground Sandbox */}
        <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent dark:from-red-950/30 dark:via-amber-950/20 rounded-3xl border border-red-100 dark:border-red-950/60 p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
              <h2 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                Live Playground: ทดสอบการทำงานร่วมกับข้อความจริง
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-[#1a1d24] border border-red-200 dark:border-red-900 font-bold text-brand-red">
              mood=&quot;{playgroundMood}&quot;
            </span>
          </div>

          <div className="bg-white dark:bg-[#181a20] rounded-2xl p-4 border border-gray-150 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-[#121418] border border-gray-100 dark:border-gray-800/80 flex items-center justify-center shrink-0">
              <NongDot mood={playgroundMood} size={selectedSize} />
            </div>
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                value={playgroundText}
                onChange={(e) => setPlaygroundText(e.target.value)}
                placeholder="พิมพ์ข้อความทดสอบ..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-brand-red"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ตัวอย่างคำพูดที่น้องดอทสื่อสารตามอารมณ์ที่เลือก
              </p>
            </div>
          </div>
        </div>

        {/* Global Toolbar: Size Switcher & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#181a20] p-3 rounded-2xl border border-gray-150 dark:border-gray-800 shadow-2xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              ทั้งหมด (12)
            </button>
            <button
              onClick={() => setActiveCategory('interaction')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === 'interaction'
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              การปฏิสัมพันธ์ (4)
            </button>
            <button
              onClick={() => setActiveCategory('finance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === 'finance'
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              การเงิน & ทุน (2)
            </button>
            <button
              onClick={() => setActiveCategory('status')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === 'status'
                  ? 'bg-brand-red text-white shadow-2xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              สถานะ & แจ้งเตือน (6)
            </button>
          </div>

          {/* Size Selector */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-bold">
            <span className="text-[11px] text-gray-400 mr-1">ขนาดพรีวิว:</span>
            {[
              { label: 'S (14px)', val: 14 },
              { label: 'M (20px)', val: 20 },
              { label: 'L (28px)', val: 28 },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setSelectedSize(s.val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  selectedSize === s.val
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-2xs font-bold'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 12-Card Nong Dot Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCatalog.map((item, index) => {
            const isCopied = copiedId === item.id;
            const isPlaying = playgroundMood === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-[#181a20] rounded-3xl border transition-all p-4 flex flex-col justify-between space-y-4 hover:shadow-md relative overflow-hidden group ${
                  isPlaying
                    ? 'border-brand-red ring-2 ring-brand-red/20'
                    : 'border-gray-150 dark:border-gray-800'
                }`}
              >
                {/* Top Number & Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.category === 'finance'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                        : item.category === 'interaction'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                    }`}
                  >
                    {item.category === 'finance'
                      ? 'การเงิน & ทุน'
                      : item.category === 'interaction'
                      ? 'การปฏิสัมพันธ์'
                      : 'สถานะระบบ'}
                  </span>
                </div>

                {/* Animated Stage Display */}
                <div
                  onClick={() => setPlaygroundMood(item.id)}
                  className="w-full h-28 rounded-2xl bg-gray-50/80 dark:bg-[#121418] border border-gray-100 dark:border-gray-800/80 flex items-center justify-center cursor-pointer hover:bg-gray-100/60 transition-colors relative"
                >
                  <NongDot mood={item.id} size={selectedSize} />
                  <span className="absolute bottom-1.5 right-2 text-[9px] text-gray-400 group-hover:text-brand-red flex items-center gap-1 transition-colors">
                    <i className="fa-solid fa-play text-[8px]"></i>
                    <span>ลองใน Playground</span>
                  </span>
                </div>

                {/* Info & Details */}
                <div className="space-y-1.5 min-w-0">
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 space-y-1 text-[10px]">
                    <div className="flex items-start gap-1 text-gray-600 dark:text-gray-300">
                      <span className="text-brand-red font-bold shrink-0">📍 บริบท:</span>
                      <span className="leading-snug">{item.recommendedPlaces}</span>
                    </div>
                  </div>
                </div>

                {/* Action: Copy Code Snippet */}
                <button
                  onClick={() => handleCopyCode(item.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 hover:bg-brand-red text-gray-700 hover:text-white dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-brand-red dark:hover:text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <i className="fa-solid fa-check text-[10px]"></i>
                      <span>คัดลอกโค้ดแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-copy text-[10px]"></i>
                      <span className="font-mono text-[11px]">คัดลอก &lt;NongDot mood=&quot;{item.id}&quot; /&gt;</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Developer Guide Box */}
        <div className="bg-white dark:bg-[#181a20] rounded-3xl border border-gray-150 dark:border-gray-800 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-code"></i>
            </span>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              คู่มือการนำไปใช้งานสำหรับทีมพัฒนา (Usage Quickstart)
            </h4>
          </div>
          <div className="bg-gray-900 text-gray-100 p-3.5 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed">
            <code>
              {`import { NongDot } from '@/components/flow/NongDot';

// 1. เรียกใช้ในหัวข้อคำถาม (Greeting)
<NongDot mood="greeting" size={16} />

// 2. เรียกใช้ในหน้าคำนวณมูลค่า (Wealth)
<NongDot mood="wealth" size={20} />

// 3. เรียกใช้ตอนปิดดีลหรือส่งงานสำเร็จ (Celebration)
<NongDot mood="success" size={24} />`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
