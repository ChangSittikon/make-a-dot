"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { NongDot } from '@/components/flow/NongDot';
import { ImpactScale, IMPACT_SCALE_CONFIG } from '@/config/taxonomy';

export type { ImpactScale };

export interface BountySummaryCardProps {
  bountyId?: string | null;
  statusLabel?: string;
  rawDescription?: string | null;
  requesterName?: string | null;
  requesterProfileId?: string | null;
  requesterWorkTypeName?: string | null;
  requesterIndustryName?: string | null;
  targetOccupations?: Array<{ id?: string; name: string }>;
  targetSkills?: Array<{ id?: string; name: string }>;
  rewardText?: string | null;
  isRequester?: boolean;
  actions?: React.ReactNode;
  className?: string;
  impactScale?: ImpactScale | string | null;
  isConfirmed?: boolean;
  onEdit?: () => void;
  onConfirm?: () => void;
  profileUrl?: string;
}

export function parseProblemSections(text?: string | null) {
  if (!text || !text.trim()) return null;

  const keywordPattern = /(ปัญหา\s*:|สิ่งที่คาดหวัง\s*:|ข้อจำกัด\s*:)/i;
  if (!keywordPattern.test(text)) {
    return null;
  }

  const tokens = text.split(/(ปัญหา\s*:|สิ่งที่คาดหวัง\s*:|ข้อจำกัด\s*:)/i).filter(Boolean);
  const sections: { key: string; label: string; content: string }[] = [];
  let currentKey = "";
  let currentLabel = "";

  for (const token of tokens) {
    const trimmed = token.trim();
    if (/^ปัญหา\s*:$/i.test(trimmed)) {
      if (currentKey) {
        sections.push({ key: currentKey, label: currentLabel, content: "" });
      }
      currentKey = "problem";
      currentLabel = "ปัญหา";
    } else if (/^สิ่งที่คาดหวัง\s*:$/i.test(trimmed)) {
      if (currentKey) {
        sections.push({ key: currentKey, label: currentLabel, content: "" });
      }
      currentKey = "expectation";
      currentLabel = "สิ่งที่คาดหวัง";
    } else if (/^ข้อจำกัด\s*:$/i.test(trimmed)) {
      if (currentKey) {
        sections.push({ key: currentKey, label: currentLabel, content: "" });
      }
      currentKey = "constraint";
      currentLabel = "ข้อจำกัด";
    } else if (currentKey) {
      sections.push({ key: currentKey, label: currentLabel, content: trimmed });
      currentKey = "";
      currentLabel = "";
    } else if (trimmed) {
      sections.push({ key: "other", label: "รายละเอียด", content: trimmed });
    }
  }

  if (currentKey) {
    sections.push({ key: currentKey, label: currentLabel, content: "" });
  }

  return sections.length > 0 ? sections : null;
}

/**
 * ฟังก์ชันช่วยตัดข้อความภาษาไทยลง Canvas โดยไม่ล้นขอบ
 */
function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const characters = Array.from(text);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < characters.length; i++) {
    const testLine = currentLine + characters[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = characters[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * วาดรูป QR Code จำลองความละเอียดสูง พร้อมสัญลักษณ์ Make-a-dot
 */
function drawSimulatedQRCode(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, text: string) {
  // พื้นหลังกล่องสีขาวมน
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, size, size, 10);
  } else {
    ctx.rect(x, y, size, size);
  }
  ctx.fill();

  const padding = 7;
  const qrSize = size - padding * 2;
  const modules = 21;
  const moduleSize = qrSize / modules;
  const startX = x + padding;
  const startY = y + padding;

  // วาดสี่เหลี่ยมตรวจจับตำแหน่ง 3 มุม (Position Detection Patterns)
  const drawCorner = (cx: number, cy: number) => {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(startX + cx * moduleSize, startY + cy * moduleSize, 7 * moduleSize, 7 * moduleSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(startX + (cx + 1) * moduleSize, startY + (cy + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(startX + (cx + 2) * moduleSize, startY + (cy + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  drawCorner(0, 0);   // บนซ้าย
  drawCorner(14, 0);  // บนขวา
  drawCorner(0, 14);  // ล่างซ้าย

  // เส้น Timing Bars
  ctx.fillStyle = '#0F172A';
  for (let i = 8; i < 13; i += 2) {
    ctx.fillRect(startX + i * moduleSize, startY + 6 * moduleSize, moduleSize, moduleSize);
    ctx.fillRect(startX + 6 * moduleSize, startY + i * moduleSize, moduleSize, moduleSize);
  }

  // เติมข้อมูลพิกเซลจุดแบบสุ่มคงที่ตามข้อความ (Deterministic Hash)
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) & 0xffffffff;
  }
  const nextPseudo = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c > 12) ||
        (r > 12 && c < 8) ||
        (r === 6 || c === 6)
      ) {
        continue;
      }
      if (nextPseudo() > 0.46) {
        ctx.fillRect(startX + c * moduleSize, startY + r * moduleSize, moduleSize, moduleSize);
      }
    }
  }

  // กิมมิคน้องดอทแดงตรงกลาง QR Code
  ctx.fillStyle = '#E11D48';
  ctx.beginPath();
  ctx.arc(startX + 10.5 * moduleSize, startY + 10.5 * moduleSize, moduleSize * 1.5, 0, Math.PI * 2);
  ctx.fill();
}

export function BountySummaryCard({
  bountyId,
  statusLabel = "พร้อมส่งตัว",
  rawDescription,
  requesterName,
  requesterProfileId,
  requesterWorkTypeName,
  requesterIndustryName,
  targetOccupations = [],
  targetSkills = [],
  rewardText = "ตามตกลง",
  isRequester = false,
  actions,
  className = "",
  impactScale,
  isConfirmed = false,
  onEdit,
  onConfirm,
  profileUrl,
}: BountySummaryCardProps) {
  // สถานะการยืนยันข้อมูล
  const [confirmedState, setConfirmedState] = useState<boolean>(isConfirmed);
  // สถานะ Accordion สำหรับดูรายละเอียดเพิ่มเติม (พับเก็บไว้เป็นค่าเริ่มต้น)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  // ข้อความแจ้งเตือน Toast/Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // สถานะกำลังเซฟรูปภาพ
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);

  const displayBountyId = bountyId
    ? `#${bountyId.slice(-6).toUpperCase()}`
    : `#DOT-${Math.floor(100000 + Math.random() * 900000)}`;

  const displayProfileId = requesterProfileId
    ? requesterProfileId.slice(-6).toUpperCase()
    : bountyId
    ? bountyId.slice(-6).toUpperCase()
    : "USER-01";

  const resolvedScale = (typeof impactScale === "string" && impactScale in IMPACT_SCALE_CONFIG)
    ? impactScale as ImpactScale
    : "LOCAL";
  const scaleConfig = IMPACT_SCALE_CONFIG[resolvedScale];

  // แยกส่วนข้อมูลปัญหาและข้อจำกัด
  const allSections = parseProblemSections(rawDescription);
  const problemSec = allSections?.find((s) => s.key === "problem");
  const expectationSec = allSections?.find((s) => s.key === "expectation");
  const constraintSection = allSections?.find((s) => s.key === "constraint");

  // สกัดข้อความปัญหาแบบไม่มีคำนำหน้า "ปัญหา: " ซ้ำซ้อน
  let cleanProblemText = problemSec?.content?.trim();
  let cleanExpectationText = expectationSec?.content?.trim();
  let cleanConstraintText = constraintSection?.content?.trim();

  if (!cleanProblemText) {
    const text = rawDescription || "มีภารกิจด่วนต้องการคนช่วย";
    if (text.includes("สิ่งที่คาดหวัง:")) {
      const parts = text.split(/สิ่งที่คาดหวัง\s*:/i);
      cleanProblemText = parts[0].replace(/^ปัญหา\s*:\s*/i, "").trim();
      if (!cleanExpectationText && parts[1]) {
        const subParts = parts[1].split(/ข้อจำกัด\s*:/i);
        cleanExpectationText = subParts[0].trim();
        if (subParts[1] && !cleanConstraintText) {
          cleanConstraintText = subParts[1].trim();
        }
      }
    } else {
      cleanProblemText = text.replace(/^ปัญหา\s*:\s*/i, "").trim();
    }
  }

  // จัดการเมื่อกดยืนยันข้อมูลเข้าระบบ
  const handleConfirmAction = () => {
    setConfirmedState(true);
    if (onConfirm) {
      onConfirm();
    }
  };

  // ลิงก์ปลายทางโปรไฟล์
  const resolvedProfileUrl = profileUrl || (bountyId ? `/profile/bounty/${bountyId}` : "/profile");

  // จัดการแชร์การ์ด
  const getShareUrl = () => {
    const origin = typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost:3000';
    return `${origin}/profile/bounty/${bountyId || 'preview'}`;
  };

  const getShareMessage = () => {
    const targetUrl = getShareUrl();
    const prizeText = rewardText || "ตามตกลง";
    const expectationText = cleanExpectationText || "ช่วยแก้ปัญหาให้สำเร็จตามตกลง";

    // โครงสร้างข้อความ Copywriting สำหรับแชร์โซเชียลตามรูปแบบที่กำหนด
    return `🚨 ภารกิจด่วนจาก MAKE A DOT [${displayBountyId}]
ใครแก้ปัญหานี้ได้ รับรางวัลไปเลย!
🎯 ปัญหาคือ: ${cleanProblemText}
✨ สิ่งที่ต้องการ: ${expectationText}
💰 ค่าตอบแทน/สิ่งแลกเปลี่ยน: ${prizeText}
👉 ใครทำได้หรือมีไอเดียดีๆ กดลิงก์เข้ามารับงานหรือเสนอตัวช่วยกันเลยที่:
${targetUrl}`;
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 5000);
  };

  // 1. กดคัดลอกข้อความ
  const handleCopyShare = () => {
    const shareMessage = getShareMessage();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
    }
    showToast('✓ คัดลอกข้อความการ์ดภารกิจแล้ว! กดวาง (Ctrl+V) ในช่องโพสต์ได้เลย');
  };

  // 2. กดปุ่มแชร์ Facebook (คัดลอกลง Clipboard อัตโนมัติ + แจ้งเตือน + เปิดหน้าต่างแชร์)
  const handleShareFacebook = () => {
    const targetUrl = getShareUrl();
    const shareMessage = getShareMessage();

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
    }

    showToast('คัดลอกข้อความการ์ดภารกิจแล้ว! กดวาง (Ctrl+V) ในช่องโพสต์ได้เลย');

    setTimeout(() => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`,
        '_blank'
      );
    }, 350);
  };

  // 3. กดปุ่มแชร์ LINE (คัดลอกลง Clipboard อัตโนมัติ + แจ้งเตือน + เปิดหน้าต่างแชร์)
  const handleShareLine = () => {
    const targetUrl = getShareUrl();
    const shareMessage = getShareMessage();

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage);
    }

    showToast('คัดลอกข้อความการ์ดภารกิจแล้ว! กดวาง (Ctrl+V) ในช่องโพสต์ได้เลย');

    setTimeout(() => {
      window.open(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(shareMessage)}`,
        '_blank'
      );
    }, 350);
  };

  // =========================================================================
  // 4. บันทึกรูปการ์ดภารกิจฉบับ VIRAL POSTER (สไตล์ Bounty Wanted Poster)
  // =========================================================================
  const handleSaveCardImage = () => {
    try {
      setIsSavingImage(true);

      const width = 640;
      const scale = 2; // Retina 2x คมชัดสูง (1280x...)

      // ข้อ 3: ขยายขนาดตัวอักษรตรงกลางให้ใหญ่ขึ้นอีก 1 ระดับ (The Hook & Reward)
      const isShortHook = cleanProblemText.length <= 25;
      const hookFontSize = isShortHook ? 46 : 36;
      const hookFontWeight = '900';
      const hookLineHeight = hookFontSize + 12;

      const hookDisplay = `“${cleanProblemText}”`;

      // ใช้ Canvas ชั่วคราวคำนวณการตัดบรรทัดและสัดส่วนความสูงกระชับ (h-auto)
      const measureCanvas = document.createElement('canvas');
      const mCtx = measureCanvas.getContext('2d');

      let hookLines: string[] = [hookDisplay];
      let expLines: string[] = [];
      let conLines: string[] = [];

      if (mCtx) {
        mCtx.font = `${hookFontWeight} ${hookFontSize}px "Prompt", sans-serif`;
        hookLines = wrapTextLines(mCtx, hookDisplay, width - 90);

        mCtx.font = 'normal 14px "Prompt", sans-serif';
        if (cleanExpectationText) {
          expLines = wrapTextLines(mCtx, `🎯 สิ่งที่ต้องการ: ${cleanExpectationText}`, width - 100);
        }
        if (cleanConstraintText) {
          conLines = wrapTextLines(mCtx, `⚠️ ข้อจำกัด: ${cleanConstraintText}`, width - 100);
        }
      }

      // ---------------------------------------------------------------------
      // คำนวณความสูงแบบกระชับ (h-auto) และกำหนดระยะห่างตามข้อ 1 & 2
      // ---------------------------------------------------------------------
      let estY = 114; // ตำแหน่งแท็กบนพาดหัว
      estY += 46;     // ตำแหน่งเริ่มต้นพาดหัวปัญหา

      estY += hookLines.length * hookLineHeight;
      estY += 6;

      if (expLines.length > 0) {
        estY += expLines.length * 22;
      }
      if (conLines.length > 0) {
        estY += conLines.length * 22;
      }

      estY += 16;
      estY += 46; // ป้ายคนช่วยที่ต้องการ (Center Pill)

      estY += 44; // รางวัลค่าตอบแทน Label
      estY += 72; // ตัวเลขเงินรางวัลมหึมา (ขยายเป็น 68px 900 bold!)
      estY += 22; // Escrow note

      const escrowBottomY = estY;

      // ข้อ 1: กำหนดระยะห่างระหว่างส่วนรางวัลกับแถบสีดำด้านล่างแค่ mt-8 หรือ 32px ห้ามเว้นที่ว่างสีขาวโล่งๆ ตรงกลางเด็ดขาด
      const ctaGap = 32; // mt-8 = 32px
      const ctaY = escrowBottomY + ctaGap;
      const ctaH = 106;
      const bottomPadding = 20;

      // ข้อ 1 & 2: ความสูงการ์ดกระชับพอดีกับเนื้อหา (h-auto) สัดส่วนทรงจัตุรัส 1:1 หรือ 4:5
      const height = Math.round(ctaY + ctaH + bottomPadding);

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsSavingImage(false);
        return;
      }

      ctx.scale(scale, scale);

      // 1. พื้นหลังสีขาวสะอาดตา
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // 2. ลวดลายจุด (Dot Pattern) อ่อนๆ สไตล์ Make a Dot เต็มพื้นที่
      ctx.fillStyle = 'rgba(226, 232, 240, 0.6)';
      for (let dx = 22; dx < width - 18; dx += 22) {
        for (let dy = 22; dy < height - 18; dy += 22) {
          ctx.beginPath();
          ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. ขอบการ์ดมนนุ่มนวล (Soft SaaS Border - ไม่มีกรอบดำหนาเตอะ)
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(14, 14, width - 28, height - 28, 24);
        ctx.stroke();
      } else {
        ctx.strokeRect(14, 14, width - 28, height - 28);
      }

      // 4. หัวการ์ด: น้องดอท 3D + MAKE A DOT QUEST
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.arc(48, 50, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(44, 45, 3.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 16px "Prompt", sans-serif';
      ctx.fillText('MAKE A DOT', 74, 48);

      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 10px "Prompt", sans-serif';
      ctx.fillText('BOUNTY POSTER • ภารกิจหาคนช่วย', 74, 63);

      // ป้ายรหัสเควสต์ (Badge ขวาบน)
      ctx.fillStyle = '#F1F5F9';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(width - 200, 36, 92, 28, 8);
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.stroke();
      }
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(displayBountyId, width - 188, 55);

      // ป้ายระดับปัญหา
      ctx.fillStyle = '#FFF1F2';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(width - 98, 36, 64, 28, 8);
        ctx.fill();
        ctx.strokeStyle = '#FECDD3';
        ctx.stroke();
      }
      ctx.fillStyle = '#E11D48';
      ctx.font = 'bold 11px "Prompt", sans-serif';
      ctx.fillText(scaleConfig.label, width - 88, 55);

      // เส้นแบ่งบางเบา
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, 80);
      ctx.lineTo(width - 30, 80);
      ctx.stroke();

      // =====================================================================
      // ข้อ 1 & 3: เน้น 'ปัญหา' ให้เป็นพาดหัวข่าวขนาดใหญ่ขึ้นอีก 1 ระดับ (The Hook)
      // =====================================================================
      let curY = 114;

      // ป้ายแท็กบนพาดหัว
      ctx.textAlign = 'center';
      const tagText = '🚨 ภารกิจเร่งด่วน • ใครช่วยได้บ้าง?';
      ctx.font = 'bold 11px "Prompt", sans-serif';
      const tagW = ctx.measureText(tagText).width + 26;
      ctx.fillStyle = '#FFF1F2';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect((width - tagW) / 2, curY - 14, tagW, 24, 12);
        ctx.fill();
      }
      ctx.fillStyle = '#E11D48';
      ctx.fillText(tagText, width / 2, curY + 2);

      curY += 46;

      // พาดหัวปัญหาขนาดใหญ่และหนาขึ้นอีก (The Hook - 46px/36px 900 Bold)
      ctx.font = `${hookFontWeight} ${hookFontSize}px "Prompt", sans-serif`;
      ctx.fillStyle = '#0F172A';

      hookLines.forEach((line) => {
        ctx.fillText(line, width / 2, curY);
        curY += hookLineHeight;
      });

      curY += 6;

      // ส่วนข้อจำกัด หรือสิ่งที่ต้องการ (ตัวเล็กกว่า Text-sm สีเทา จัดกึ่งกลาง)
      ctx.font = 'normal 14px "Prompt", sans-serif';
      ctx.fillStyle = '#64748B';

      expLines.forEach((line) => {
        ctx.fillText(line, width / 2, curY);
        curY += 22;
      });

      conLines.forEach((line) => {
        ctx.fillText(line, width / 2, curY);
        curY += 22;
      });

      curY += 16;

      // ป้ายคนช่วยที่ต้องการ (Center Pill)
      const occName = (targetOccupations.length > 0 && targetOccupations[0]?.name)
        ? targetOccupations[0].name
        : 'เปิดรับผู้เชี่ยวชาญทุกด้าน';
      const specText = `🛠️ ผู้เชี่ยวชาญที่ต้องการ: ${occName}`;
      ctx.font = 'bold 12px "Prompt", sans-serif';
      const specW = ctx.measureText(specText).width + 30;
      ctx.fillStyle = '#F8FAFC';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect((width - specW) / 2, curY - 14, specW, 28, 14);
        ctx.fill();
        ctx.strokeStyle = '#E2E8F0';
        ctx.stroke();
      }
      ctx.fillStyle = '#334155';
      ctx.fillText(specText, width / 2, curY + 4);

      curY += 44;

      // =====================================================================
      // ข้อ 2 & 3: ตัวเลขค่าตอบแทน ขยายใหญ่และหนาขึ้นอีก 1 ระดับ (68px 900 Bold)
      // =====================================================================
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 12px "Prompt", sans-serif';
      ctx.fillText('รางวัลค่าตอบแทน (BOUNTY REWARD)', width / 2, curY);

      curY += 56;

      // ตัวเลขเงินรางวัลมหึมา เด่นชัด ดึงดูดสายตาทันที (ขยายเป็น 68px 900)
      const prizeStr = rewardText || 'ตามตกลง';
      ctx.font = '900 68px "Prompt", sans-serif';
      ctx.fillStyle = '#E11D48'; // สีแดงแบรนด์กระตุ้นความสนใจสูงสุด
      ctx.fillText(prizeStr, width / 2, curY);

      curY += 22;
      ctx.fillStyle = '#64748B';
      ctx.font = 'normal 11px "Prompt", sans-serif';
      ctx.fillText('🛡️ ปลอดภัยด้วยสัญญา Escrow • รับเงินเมื่อตรวจรับงานเสร็จ 100%', width / 2, curY);

      // =====================================================================
      // ข้อ 1: แถบ Call-to-Action (CTA) อยู่ห่างจากส่วนรางวัลแค่ mt-8 (32px)
      // =====================================================================
      // กล่องสีดำเข้มแบบโมเดิร์น
      ctx.fillStyle = '#0F172A';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(24, ctaY, width - 48, ctaH, 18);
        ctx.fill();
      } else {
        ctx.fillRect(24, ctaY, width - 48, ctaH);
      }

      // ข้อความกระตุ้น CTA ด้านซ้าย
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px "Prompt", sans-serif';
      ctx.fillText('🔥 สแกนเพื่อรับงานนี้ หรือพิมพ์ค้นหา', 46, ctaY + 36);

      ctx.fillStyle = '#FB7185';
      ctx.font = 'bold 14px "Prompt", sans-serif';
      ctx.fillText(`รหัส [${displayBountyId}] ที่ make-a-dot.com`, 46, ctaY + 60);

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'normal 10px "Prompt", sans-serif';
      ctx.fillText('👉 รับเงินจริงทันทีที่ส่งมอบงานสำเร็จ • ชุมชน MAKE A DOT', 46, ctaY + 84);

      // วาดกล่อง QR Code จำลองความละเอียดสูงด้านขวา
      const targetUrl = getShareUrl();
      const qrSize = 80;
      const qrX = width - 24 - qrSize - 16;
      const qrY = ctaY + 13;
      drawSimulatedQRCode(ctx, qrX, qrY, qrSize, targetUrl);

      // ดาวน์โหลดไฟล์รูปภาพ PNG คุณภาพสูง
      const imageUri = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `make-a-dot-card-${displayBountyId.replace('#', '')}.png`;
      downloadLink.href = imageUri;
      downloadLink.click();

      showToast('✓ บันทึกรูปการ์ดภารกิจฉบับโปสเตอร์เรียบร้อย! พร้อมนำไปโพสต์ได้ทันที');
    } catch (err) {
      console.error('Failed to export card image:', err);
      showToast('ไม่สามารถเซฟรูปภาพได้ในขณะนี้');
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div className={`w-full text-left font-prompt space-y-3.5 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. กรอบการ์ดสรุปปัญหาบนหน้าจอ (THEME: ขาว-แดง-ดำ + กิมมิคน้องดอท)         */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-gray-900 rounded-[24px] p-4 sm:p-5 shadow-lg relative overflow-hidden">
        {/* ลายจุดอ่อนๆ สไตล์ Make-a-dot */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* ---------------- หัวการ์ด: กิมมิคน้องดอท + การ์ดสรุปปัญหา + รหัสและป้ายระดับปัญหา ---------------- */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="shrink-0 flex items-center justify-center">
              <NongDot mood="greeting" size={28} color="red" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                  การ์ดสรุปปัญหา
                </h3>
              </div>
              <p className="text-[10px] text-brand-red font-bold tracking-wider uppercase">
                MAKE A DOT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 border border-gray-300 text-gray-900 rounded">
              {displayBountyId}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-red bg-red-50 text-brand-red">
              {scaleConfig.label}
            </span>
          </div>
        </div>

        {/* ---------------- ข้อมูลการ์ดภารกิจบนหน้าจอ ---------------- */}
        <div className="space-y-3 pt-3 relative z-10">
          {/* พาดหัวปัญหาแบบชัดเจน */}
          <div className="bg-gray-50/90 rounded-xl p-3.5 border border-gray-200/90 space-y-1.5">
            <div className="text-[11px] font-bold text-brand-red uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red inline-block" />
              <span>ปัญหาที่ต้องการคนช่วย:</span>
            </div>
            <p className="text-sm font-bold text-gray-900 leading-snug break-words">
              {cleanProblemText}
            </p>
            {cleanExpectationText && (
              <p className="text-xs text-gray-600 pt-1 leading-snug">
                <span className="font-semibold text-gray-800">สิ่งที่ต้องการ:</span> {cleanExpectationText}
              </p>
            )}
          </div>

          {/* ผู้เชี่ยวชาญที่ต้องการ */}
          <div className="bg-white rounded-xl p-3 border border-gray-200">
            <div className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i className="fa-solid fa-bullseye text-[10px] text-brand-red" />
              <span>ผู้เชี่ยวชาญที่ต้องการ</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {targetOccupations.map((occ, idx) => (
                <span
                  key={`occ-${occ.id || idx}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-brand-red border border-red-200 rounded-lg text-xs font-bold"
                >
                  <i className="fa-solid fa-briefcase text-[9px] shrink-0" />
                  <span className="leading-tight">{occ.name}</span>
                </span>
              ))}
              {targetSkills.map((sk, idx) => (
                <span
                  key={`sk-${sk.id || idx}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg text-xs font-medium"
                >
                  <i className="fa-solid fa-bolt text-[8px] text-gray-700 shrink-0" />
                  <span className="leading-tight">{sk.name}</span>
                </span>
              ))}
              {targetOccupations.length === 0 && targetSkills.length === 0 && (
                <span className="text-xs text-gray-400 italic">เปิดรับผู้เชี่ยวชาญทุกด้านในสายงาน</span>
              )}
            </div>
          </div>

          {/* ค่าตอบแทน / สิ่งแลกเปลี่ยน */}
          <div className="bg-white rounded-xl px-3.5 py-2.5 border border-gray-200 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">
              ค่าตอบแทน / สิ่งแลกเปลี่ยน
            </span>
            <span className="text-sm sm:text-base font-black text-brand-red tracking-tight">
              {rewardText}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. กล่อง ACCORDION นอกการ์ด: ดูรายละเอียดเพิ่มเติม                        */}
      {/* ========================================================================= */}
      <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => setIsDetailOpen(!isDetailOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-gray-800 bg-gray-50/70 hover:bg-gray-100 transition-colors cursor-pointer select-none"
        >
          <span className="flex items-center gap-2">
            <i className="fa-regular fa-file-lines text-brand-red text-xs" />
            <span>ดูรายละเอียดเพิ่มเติมของงานนี้</span>
          </span>
          <i
            className={`fa-solid fa-chevron-down text-gray-400 text-[11px] transition-transform duration-200 ${
              isDetailOpen ? "rotate-180 text-gray-700" : ""
            }`}
          />
        </button>

        {isDetailOpen && (
          <div className="p-3.5 space-y-3 border-t border-gray-200 text-xs bg-white animate-fade-in">
            {/* ข้อมูลผู้ส่ง (อาชีพ / สายงาน / ID) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                ข้อมูลผู้ส่งภารกิจ
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200/80 space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500 font-medium">ผู้ส่ง:</span>
                  <span className="font-bold text-gray-900">
                    {isRequester ? "คุณ" : requesterName || "คุณ"} (#{displayProfileId})
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500 font-medium">อาชีพ:</span>
                  <span className="font-bold text-gray-900">
                    {requesterWorkTypeName || "รับจ้างทั่วไป"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-gray-500 font-medium">สายงาน:</span>
                  <span className="font-bold text-gray-900">
                    {requesterIndustryName || "ก่อสร้างและอสังหาริมทรัพย์"}
                  </span>
                </div>
              </div>
            </div>

            {/* ข้อจำกัดของงาน (ถ้ามี) */}
            {cleanConstraintText && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  ข้อจำกัดของงาน
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200/80 text-gray-800">
                  {cleanConstraintText}
                </div>
              </div>
            )}

            {/* เกณฑ์การแบ่งงวดงานเบื้องต้น */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                เกณฑ์การแบ่งงวดงานเบื้องต้น (Smart Escrow)
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500">งวด 1</div>
                  <div className="text-xs font-black text-gray-900">20%</div>
                  <div className="text-[9px] text-gray-500">มัดจำ/เตรียมของ</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500">งวด 2</div>
                  <div className="text-xs font-black text-gray-900">40%</div>
                  <div className="text-[9px] text-gray-500">ตรวจรับงานหลัก</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <div className="text-[9px] font-bold text-gray-500">งวด 3</div>
                  <div className="text-xs font-black text-brand-red">40%</div>
                  <div className="text-[9px] text-gray-500">ตรวจรับสมบูรณ์</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. ส่วนปุ่มดำเนินการ: จัดการปุ่มตามสถานะการยืนยัน & แถบแชร์โซเชียล         */}
      {/* ========================================================================= */}
      <div className="pt-1">
        {!confirmedState ? (
          /* ---------------- สถานะก่อนกดยืนยัน: ซ่อนปุ่มแชร์ทั้งหมด ---------------- */
          <div className="flex items-center gap-2">
            {actions ? (
              actions
            ) : (
              <>
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 border border-gray-200"
                  >
                    <i className="fa-solid fa-pen-to-square text-xs text-gray-600" />
                    <span>แก้ไข</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="inline-flex items-center justify-center gap-1.5 bg-brand-red hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition-all flex-1 shadow-md shadow-red-500/20 active:scale-95 cursor-pointer text-center"
                >
                  <span>ยืนยันข้อมูลเข้าระบบ</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </button>
              </>
            )}
          </div>
        ) : (
          /* ---------------- สถานะยืนยันสำเร็จแล้ว: แถบแชร์ Facebook/LINE + บันทึกรูป ---------------- */
          <div className="space-y-2.5 animate-fade-in">
            {/* แถบปุ่มแชร์โซเชียล โทนสี ขาว-แดง-ดำ สะอาดตา */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2.5">
              <div className="text-[11px] font-bold text-gray-700 flex items-center justify-between">
                <span>แชร์การ์ดนี้เพื่อหาคนช่วย:</span>
                <span className="text-[10px] font-mono text-brand-red font-bold">MAKE A DOT POSTER</span>
              </div>

              {/* 4 ปุ่มหลัก: Facebook | LINE | คัดลอก | บันทึกรูป */}
              <div className="grid grid-cols-4 gap-2">
                {/* 1. ปุ่ม Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-brands fa-facebook text-blue-600 text-sm" />
                  <span>Facebook</span>
                </button>

                {/* 2. ปุ่ม LINE */}
                <button
                  type="button"
                  onClick={handleShareLine}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-brands fa-line text-emerald-500 text-sm" />
                  <span>LINE</span>
                </button>

                {/* 3. ปุ่มคัดลอกข้อความ */}
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-regular fa-copy text-gray-700 text-xs" />
                  <span>คัดลอก</span>
                </button>

                {/* 4. ปุ่มบันทึกรูปการ์ด */}
                <button
                  type="button"
                  onClick={handleSaveCardImage}
                  disabled={isSavingImage}
                  className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <i className="fa-regular fa-image text-brand-red text-xs" />
                  <span>{isSavingImage ? "กำลังเซฟ..." : "บันทึกรูป"}</span>
                </button>
              </div>

              {/* ปุ่มบันทึกรูปการ์ดโปสเตอร์แบบเต็มแถว เพื่อให้แตะง่ายบนมือถือ */}
              <button
                type="button"
                onClick={handleSaveCardImage}
                disabled={isSavingImage}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <i className="fa-regular fa-image text-sm" />
                <span>🖼️ บันทึกรูปการ์ดภารกิจ (Bounty Poster) พร้อมโพสต์ทันที</span>
              </button>

              {/* ข้อความแจ้งเตือน Toast / Alert ตามโจทย์ */}
              {toastMessage && (
                <div className="text-center text-xs font-bold text-brand-red bg-red-50 border border-red-200 py-2.5 px-3 rounded-xl animate-fade-in flex items-center justify-center gap-2 shadow-sm">
                  <i className="fa-solid fa-circle-check text-brand-red text-sm shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              )}
            </div>

            {/* ปุ่มนำทางไปดู 'การ์ดแก้ไขเบื้องต้น' ในหน้าโปรไฟล์ */}
            <Link
              href={resolvedProfileUrl}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] text-center"
            >
              <span>📋 ไปดู &apos;การ์ดแก้ไขเบื้องต้น&apos; ในหน้าโปรไฟล์ของคุณ</span>
              <i className="fa-solid fa-arrow-right text-xs text-brand-red" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default BountySummaryCard;