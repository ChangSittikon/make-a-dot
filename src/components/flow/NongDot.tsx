'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type NongDotMood =
  | 'classic'     // 0. ดั้งเดิมหน้าหลัก (กระโดดสูง เด้งดึ๋ง มาตรฐาน MAKE A DOT)
  | 'greeting'    // 1. ทักทาย / เริ่มต้น (โยกหัวซ้าย-ขวา แล้วโดด)
  | 'thinking'    // 2. คิดวิเคราะห์ / คำนวณ (ลอยหมุนเรืองแสง)
  | 'success'     // 3. ฉลองความสำเร็จ (กระโดด 2 จังหวะ + ประกายดาว)
  | 'alert'       // 4. แจ้งเตือนด่วน (ชีพจรกะพริบเร็ว + คลื่นเรดาร์)
  | 'searching'   // 5. ค้นหา / ชะเง้อส่อง (ชะเง้อซ้าย-ขวา กวาดสายตา)
  | 'sleeping'    // 6. พักผ่อน / ว่างงาน (หายใจช้าๆ + ฟอง Zzz)
  | 'shield'      // 7. ผู้พิทักษ์ / ล็อกปลอดภัย (วงแหวนเกราะหมุนรอบ)
  | 'wealth'      // 8. มั่งคั่ง / ระดมทุน (ดอททองคำ + ประกายเหรียญ)
  | 'synergy'     // 9. ซินเนอร์ยี่ / จับคู่ (ดอทคู่เต้นรำโคจร)
  | 'error'       // 10. ตกใจ / ผิดพลาด (สะดุ้งตัวสั่น + เครื่องหมาย !)
  | 'launch'      // 11. ปล่อยของ / จรวดสปีดรัน (ย่อตัวลึกแล้วพุ่งทะยาน)
  | 'quantum';    // 12. ควอนตัมจักรวาล (ลอยเคว้งพร้อมวงแหวนอะตอม)

export interface NongDotProps {
  mood?: NongDotMood;
  size?: number;
  color?: 'red' | 'black' | 'gray' | 'gold' | 'blue';
  className?: string;
  delay?: number;
  jumpHeight?: number;
}

export interface NongDotCatalogItem {
  id: NongDotMood;
  no: number;
  name: string;
  nameEn: string;
  category: 'interaction' | 'finance' | 'status';
  description: string;
  recommendedPlaces: string;
  isLive?: boolean;
  liveLocation?: string;
}

export const NONG_DOT_CATALOG: NongDotCatalogItem[] = [
  {
    no: 1,
    id: 'classic',
    name: 'น้องดอทออริจินัลหน้าหลัก (Classic Jump)',
    nameEn: 'Original Classic Jump',
    category: 'interaction',
    description: 'กระโดดสูงลอยตัว ค้างกลางอากาศอย่างนุ่มนวล และลงพื้นเด้งดึ๋ง เป็นเอกลักษณ์ดั้งเดิมของ MAKE A DOT',
    recommendedPlaces: 'หน้าแรก FlowApp, ตอนโหลดระบบ, ลอยเกาะหัวข้อคำถาม, และ 3 ดอทผู้ก่อตั้ง (ดำ-แดง-เทา)',
    isLive: true,
    liveLocation: 'FlowApp.tsx (หน้าแรก & หน้าผลลัพธ์)',
  },
  {
    no: 2,
    id: 'greeting',
    name: 'น้องดอททักทาย (Playful Greeting)',
    nameEn: 'Playful Greeting',
    category: 'interaction',
    description: 'จังหวะตกพื้นจะโยกยืดหัวซ้าย-ขวาดุ๊กดิ๊ก แล้วย่อตัวกระโดดเด้งดึ๋งอย่างร่าเริง มีชีวิตชีวา',
    recommendedPlaces: 'หน้าคัดกรองสายงาน 3 เลเยอร์, Onboarding, Step 1 ทำทุน, ถามคำถามแรก',
    isLive: true,
    liveLocation: 'StepScopeView.tsx (หน้าคัดกรองสายงาน)',
  },
  {
    no: 3,
    id: 'thinking',
    name: 'น้องดอทคิดวิเคราะห์ (Thinking)',
    nameEn: 'AI Calculating',
    category: 'status',
    description: 'ลอยตัวนุ่มนวล พร้อมคลื่นแสงออโรร่าหมุนวนรอบตัว บ่งบอกการคิดวิเคราะห์ข้อมูล',
    recommendedPlaces: 'ระหว่างรอประมวลผล Matching, คำนวณ Cap Table, วิเคราะห์สเปก',
  },
  {
    no: 4,
    id: 'success',
    name: 'น้องดอทฉลองชัย (Celebration)',
    nameEn: 'Victory Pop',
    category: 'status',
    description: 'กระโดดสองจังหวะสูง พร้อมประกายดาววิบวับเปล่งออกมาเมื่อภารกิจสำเร็จ',
    recommendedPlaces: 'สร้างโปรเจกต์เสร็จ, ปิดดีลสำเร็จ, ได้รับรางวัล, ปลดล็อกเควสต์',
  },
  {
    no: 5,
    id: 'alert',
    name: 'น้องดอทแจ้งเตือนด่วน (Urgent Alert)',
    nameEn: 'Pulse Alert',
    category: 'status',
    description: 'เต้นตุบๆ ถี่ๆ เหมือนชีพจร พร้อมคลื่นสัญญาณเรดาร์กระจายเตือนความสนใจ',
    recommendedPlaces: 'เควสต์ด่วนใกล้หมดเวลา, ข้อความใหม่, การแจ้งเตือนฉุกเฉิน',
  },
  {
    no: 6,
    id: 'searching',
    name: 'น้องดอทค้นหา (Curious Search)',
    nameEn: 'Explorer Sway',
    category: 'interaction',
    description: 'ยืดลำตัวชะเง้อส่องสายตามองซ้าย มองขวา เหมือนกำลังตามหาผู้เชี่ยวชาญ',
    recommendedPlaces: 'ช่องค้นหา Search Box, หน้ารายชื่อ Expert, หน้ากรองข้อมูล',
  },
  {
    no: 7,
    id: 'sleeping',
    name: 'น้องดอทพักผ่อน (Idle & Nap)',
    nameEn: 'Resting Zen',
    category: 'status',
    description: 'นอนหายใจแผ่วๆ ยุบพองอย่างผ่อนคลาย มีฟองสลบ Zzz ลอยละล่องขึ้นเบาๆ',
    recommendedPlaces: 'หน้าว่าง (Empty State), ไม่มีงานคงค้าง, ระบบออฟไลน์',
  },
  {
    no: 8,
    id: 'shield',
    name: 'น้องดอทผู้พิทักษ์ (Guardian Shield)',
    nameEn: 'Escrow Guardian',
    category: 'finance',
    description: 'สถิตนิ่งหนักแน่น มีวงแหวนเกราะสีทองหมุนควงรอบตัว คุ้มกันทรัพย์สินอย่างมั่นคง',
    recommendedPlaces: 'หน้า Escrow ล็อกเงิน, ระบบความปลอดภัย, ตรวจสอบสัญญา BOQ',
  },
  {
    no: 9,
    id: 'wealth',
    name: 'น้องดอทมั่งคั่ง (Capital & Wealth)',
    nameEn: 'Golden Investor',
    category: 'finance',
    description: 'ประกายแสงสีทองสะท้อนบนผิวดอทแดง มีละอองทองคำผุดขึ้นตามจังหวะเด้ง',
    recommendedPlaces: 'หน้าแปลงสินทรัพย์เป็นทุน, จำลองสัดส่วนหุ้น, มูลค่าระดมทุน Step 2',
  },
  {
    no: 10,
    id: 'synergy',
    name: 'น้องดอทซินเนอร์ยี่ (Synergy Partners)',
    nameEn: 'Twin Orbit',
    category: 'interaction',
    description: 'ดอทคู่แฝด (แดง + ฟ้า) เต้นรำโคจรรอบศูนย์กลาง บ่งบอกความร่วมมือร่วมใจ',
    recommendedPlaces: 'ผังระบบนิเวศ (Synergy Matrix), การจับคู่ Requester กับ Solver',
  },
  {
    no: 11,
    id: 'error',
    name: 'น้องดอทตกใจ (Shocked / Oops)',
    nameEn: 'Alert Oops',
    category: 'status',
    description: 'สะดุ้งตัวสั่นเล็กน้อย มีเครื่องหมาย ! สีเหลืองกะพริบเหนือดอทอย่างตื่นตกใจ',
    recommendedPlaces: 'ฟอร์มไม่สมบูรณ์, การเชื่อมต่อขัดข้อง, ข้อพิพาท Dispute',
  },
  {
    no: 12,
    id: 'launch',
    name: 'น้องดอทสปีดรัน (Rocket Launch)',
    nameEn: 'Blast Off',
    category: 'interaction',
    description: 'ย่อตัวลึกสุดขีดเพื่อสะสมแรง แล้วพุ่งทะยานฉลุยขึ้นฟ้าพร้อมเปลวไฟไอพ่น',
    recommendedPlaces: 'ปุ่มปล่อยงาน Step 12, Deploy โปรเจกต์, ยืนยันการเผยแพร่',
  },
  {
    no: 13,
    id: 'quantum',
    name: 'น้องดอทควอนตัม (Quantum Core)',
    nameEn: 'Atomic Gravity',
    category: 'interaction',
    description: 'ดอทแกนหลักลอยเคว้งไร้น้ำหนัก ท่ามกลางวงโคจรอะตอม 3 มิติที่เป็นเอกลักษณ์',
    recommendedPlaces: 'หน้าหลัก MAKE A DOT, โหลดสแปลชสกรีน, Algorithm Center',
  },
];

export const NongDot: React.FC<NongDotProps> = ({
  mood = 'greeting',
  size = 16,
  color = 'red',
  className = '',
  delay = 0,
  jumpHeight = 35,
}) => {
  const bgClass =
    color === 'black'
      ? 'bg-gray-900'
      : color === 'gray'
      ? 'bg-gray-400'
      : color === 'gold'
      ? 'bg-amber-500'
      : color === 'blue'
      ? 'bg-sky-500'
      : 'bg-brand-red';

  const shadowColor =
    color === 'black'
      ? 'rgba(0,0,0,0.3)'
      : color === 'gray'
      ? 'rgba(156,163,175,0.35)'
      : color === 'gold'
      ? 'rgba(245,158,11,0.35)'
      : color === 'blue'
      ? 'rgba(14,165,233,0.35)'
      : 'rgba(255,26,26,0.35)';

  /* ---------------- 0. CLASSIC (Original Jump from FlowApp) ---------------- */
  if (mood === 'classic') {
    const jump = jumpHeight || 35;
    return (
      <div
        className={`relative inline-flex flex-col items-center justify-end ${className}`}
        style={{ width: size * 1.5, height: size + jump + 5 }}
      >
        <motion.div
          className={`${bgClass} rounded-full origin-bottom relative z-10`}
          style={{
            width: size,
            height: size,
            boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.25), 0 4px 10px ${shadowColor}`,
          }}
          animate={{
            y: [0, -jump, 0, 0, 0],
            scaleX: [1, 0.95, 0.95, 1.15, 1],
            scaleY: [1, 1.05, 1.05, 0.85, 1],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: delay,
            times: [0, 0.45, 0.85, 0.95, 1],
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 rounded-full"
          style={{
            width: size * 2.2,
            height: size * 1.0,
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
            marginBottom: -size * 0.35,
          }}
          animate={{
            scaleX: [1, 0.3, 1, 1.2, 1],
            opacity: [0.5, 0.1, 0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: delay,
            times: [0, 0.45, 0.85, 0.95, 1],
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  /* ---------------- 1. GREETING (Cute Wobble & Leap) ---------------- */
  if (mood === 'greeting') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-end ${className}`} style={{ width: size * 1.6, height: size + 40 }}>
        <motion.div
          className={`${bgClass} rounded-full origin-bottom relative z-10`}
          style={{
            width: size,
            height: size,
            boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 10px ${shadowColor}`,
          }}
          animate={{
            y: [0, 0, 0, 0, -18, -35, -5, 0, 0],
            rotate: [0, -14, 14, 0, 0, 0, 0, 0, 0],
            x: [0, -2, 2, 0, 0, 0, 0, 0, 0],
            scaleX: [1.2, 1.05, 1.05, 1.28, 0.86, 0.96, 0.9, 1.25, 1.2],
            scaleY: [0.8, 0.96, 0.96, 0.74, 1.18, 1.04, 1.12, 0.78, 0.8],
          }}
          transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.12, 0.24, 0.36, 0.46, 0.68, 0.86, 0.94, 1], ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 rounded-full"
          style={{ width: size * 2.2, height: size * 0.9, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)', marginBottom: -size * 0.3 }}
          animate={{ scaleX: [1.2, 1.05, 1.05, 1.3, 0.6, 0.35, 0.7, 1.3, 1.2], opacity: [0.65, 0.6, 0.6, 0.8, 0.3, 0.15, 0.4, 0.8, 0.65] }}
          transition={{ duration: 2.6, repeat: Infinity, times: [0, 0.12, 0.24, 0.36, 0.46, 0.68, 0.86, 0.94, 1], ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 2. THINKING (AI Orbital Pulse) ---------------- */
  if (mood === 'thinking') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size * 2.2, height: size * 2.2 }}>
        <motion.div
          className="absolute rounded-full border border-dashed border-red-400/60 dark:border-red-400/40"
          style={{ width: size * 1.9, height: size * 1.9 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs"
          animate={{ rotate: 360 }}
          style={{ originX: '18px', originY: '18px' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={`${bgClass} rounded-full relative z-10`}
          style={{ width: size, height: size, boxShadow: `0 0 14px ${shadowColor}` }}
          animate={{ scale: [1, 1.12, 1], y: [0, -3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 3. SUCCESS (Double Leap & Sparkles) ---------------- */
  if (mood === 'success') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-end ${className}`} style={{ width: size * 2, height: size + 42 }}>
        <motion.span
          className="absolute text-[10px] text-amber-400 pointer-events-none"
          animate={{ y: [-10, -32, -36], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        >
          ✨
        </motion.span>
        <motion.div
          className={`${bgClass} rounded-full origin-bottom relative z-10`}
          style={{ width: size, height: size, boxShadow: `0 4px 12px ${shadowColor}` }}
          animate={{
            y: [0, -26, -4, -36, 0],
            scaleX: [1.2, 0.9, 1.15, 0.92, 1.2],
            scaleY: [0.8, 1.15, 0.85, 1.12, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 rounded-full"
          style={{ width: size * 2, height: size * 0.8, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)', marginBottom: -size * 0.25 }}
          animate={{ scaleX: [1.2, 0.4, 1.1, 0.35, 1.2], opacity: [0.7, 0.2, 0.6, 0.15, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 4. ALERT (Fast Radar Pulse) ---------------- */
  if (mood === 'alert') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size * 2.2, height: size * 2.2 }}>
        <motion.div
          className="absolute rounded-full border-2 border-brand-red"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 2.3], opacity: [0.8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className={`${bgClass} rounded-full relative z-10`}
          style={{ width: size, height: size, boxShadow: `0 0 12px ${shadowColor}` }}
          animate={{ scale: [1, 1.22, 1, 1.22, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 5. SEARCHING (Curious Look Around) ---------------- */
  if (mood === 'searching') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-end ${className}`} style={{ width: size * 2, height: size + 20 }}>
        <motion.div
          className={`${bgClass} rounded-full origin-bottom relative z-10`}
          style={{ width: size, height: size, boxShadow: `0 4px 8px ${shadowColor}` }}
          animate={{
            x: [0, -6, -6, 6, 6, 0],
            rotate: [0, -16, -16, 16, 16, 0],
            scaleX: [1, 1.08, 1.08, 1.08, 1.08, 1],
            scaleY: [1, 0.94, 0.94, 0.94, 0.94, 1],
          }}
          transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 rounded-full"
          style={{ width: size * 1.8, height: size * 0.7, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 70%)', marginBottom: -size * 0.2 }}
          animate={{ x: [0, -4, -4, 4, 4, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 6. SLEEPING (Zen Breathing & Zzz) ---------------- */
  if (mood === 'sleeping') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-end ${className}`} style={{ width: size * 1.8, height: size + 28 }}>
        <motion.span
          className="absolute text-[9px] font-bold text-gray-400 dark:text-gray-500 font-mono pointer-events-none"
          animate={{ y: [0, -18, -24], x: [2, 8, 12], opacity: [0, 0.9, 0], scale: [0.6, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        >
          zZ
        </motion.span>
        <motion.div
          className={`${bgClass} rounded-full origin-bottom relative z-10`}
          style={{ width: size, height: size, opacity: 0.85 }}
          animate={{ scaleX: [1.15, 0.95, 1.15], scaleY: [0.85, 1.05, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 7. SHIELD (Guardian Halo) ---------------- */
  if (mood === 'shield') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size * 2.2, height: size * 2.2 }}>
        <motion.div
          className="absolute rounded-full border-2 border-amber-400/80 shadow-xs"
          style={{ width: size * 1.8, height: size * 0.9 }}
          animate={{ rotateX: [65, 65], rotateZ: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <div className={`${bgClass} rounded-full relative z-10 shadow-md`} style={{ width: size, height: size }} />
      </div>
    );
  }

  /* ---------------- 8. WEALTH (Golden Coin Sparkle) ---------------- */
  if (mood === 'wealth') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-end ${className}`} style={{ width: size * 2, height: size + 36 }}>
        <motion.span
          className="absolute text-[10px] pointer-events-none"
          animate={{ y: [-4, -26], opacity: [0, 1, 0], scale: [0.5, 1.1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        >
          🪙
        </motion.span>
        <motion.div
          className="rounded-full origin-bottom relative z-10"
          style={{
            width: size,
            height: size,
            background: 'radial-gradient(circle at 35% 35%, #ff4d4d, #b30000)',
            boxShadow: '0 0 12px rgba(245,158,11,0.5), inset 0 2px 4px rgba(255,255,255,0.4)',
          }}
          animate={{ y: [0, -22, 0], scaleX: [1.15, 0.95, 1.15], scaleY: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 9. SYNERGY (Twin Orbit Dance) ---------------- */
  if (mood === 'synergy') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size * 2.4, height: size * 2.4 }}>
        <motion.div
          className="absolute w-full h-full flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-brand-red shadow-sm absolute left-1" />
          <div className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow-sm absolute right-1" />
        </motion.div>
      </div>
    );
  }

  /* ---------------- 10. ERROR (Shocked Shudder & !) ---------------- */
  if (mood === 'error') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-end ${className}`} style={{ width: size * 1.8, height: size + 26 }}>
        <motion.span
          className="absolute -top-1 w-4 h-4 rounded-full bg-amber-400 text-gray-900 font-extrabold text-[10px] flex items-center justify-center shadow-xs"
          animate={{ y: [0, -3, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          !
        </motion.span>
        <motion.div
          className={`${bgClass} rounded-full relative z-10`}
          style={{ width: size, height: size }}
          animate={{ x: [-2, 2, -2, 2, 0], scaleY: [0.9, 1.05, 0.9] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      </div>
    );
  }

  /* ---------------- 11. LAUNCH (Rocket Blast-Off) ---------------- */
  if (mood === 'launch') {
    return (
      <div className={`relative inline-flex flex-col items-center justify-end ${className}`} style={{ width: size * 2, height: size + 50 }}>
        <motion.span
          className="absolute bottom-1 text-[11px] pointer-events-none"
          animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.3, 0.4], y: [0, 10, 16] }}
          transition={{ duration: 1.8, repeat: Infinity, times: [0.35, 0.5, 0.8] }}
        >
          🔥
        </motion.span>
        <motion.div
          className={`${bgClass} rounded-full origin-bottom relative z-10`}
          style={{ width: size, height: size, boxShadow: `0 0 16px ${shadowColor}` }}
          animate={{
            y: [0, 0, -42, -50, 0],
            scaleX: [1, 1.35, 0.75, 0.8, 1.25],
            scaleY: [1, 0.65, 1.35, 1.2, 0.8],
          }}
          transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.35, 0.55, 0.75, 1], ease: 'easeInOut' }}
        />
      </div>
    );
  }

  /* ---------------- 12. QUANTUM (Atomic Gravity Core) ---------------- */
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size * 2.4, height: size * 2.4 }}>
      <motion.div
        className="absolute rounded-full border border-sky-400/50"
        style={{ width: size * 2, height: size * 0.9 }}
        animate={{ rotateZ: [0, 360] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border border-red-400/50"
        style={{ width: size * 0.9, height: size * 2 }}
        animate={{ rotateZ: [360, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={`${bgClass} rounded-full relative z-10`}
        style={{ width: size, height: size, boxShadow: `0 0 12px ${shadowColor}` }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};
