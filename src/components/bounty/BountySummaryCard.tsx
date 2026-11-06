"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  onConfirm?: (scoutReward?: string) => void;
  profileUrl?: string;
  scoutReward?: string | null;
  currentUserId?: string | null;
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
 * ฟังก์ชันช่วยตัดข้อความภาษาไทยลง Canvas โดยไม่ล้นขอบ (Word-break & Clamp)
 */
function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  // แยกคำตามช่องว่าง หรือเครื่องหมาย " + " เพื่อรักษาคำภาษาไทยและสัญลักษณ์ให้อ่านง่าย
  const tokens = text.split(/(\s*\+\s*|\s+)/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;
    const testLine = currentLine + token;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      // ถ้าคำเดียวยาวกว่า maxWidth ให้ตัดระดับตัวอักษร
      if (ctx.measureText(token).width > maxWidth) {
        let chunk = '';
        for (const char of Array.from(token)) {
          if (ctx.measureText(chunk + char).width > maxWidth) {
            if (chunk) lines.push(chunk);
            chunk = char;
          } else {
            chunk += char;
          }
        }
        currentLine = chunk;
      } else {
        currentLine = token;
      }
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  return lines.length > 0 ? lines : [text];
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
  scoutReward: initialScoutReward,
  currentUserId,
}: BountySummaryCardProps) {
  const router = useRouter();
  // รหัสผู้ใช้ปัจจุบันสำหรับการทำ Referral Tracking (?ref=...)
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserId) return;
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) setSessionUserId(data.user.id);
      })
      .catch(() => {});
  }, [currentUserId]);

  // สถานะการยืนยันข้อมูล
  const [confirmedState, setConfirmedState] = useState<boolean>(isConfirmed);
  // สถานะ 'ค่าชี้เป้า' (Scout Reward)
  const [hasScoutReward, setHasScoutReward] = useState<boolean>(Boolean(initialScoutReward));
  const [scoutRewardText, setScoutRewardText] = useState<string>(initialScoutReward || "");
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
  const handleConfirmAction = async () => {
    setConfirmedState(true);
    const finalScout = hasScoutReward && scoutRewardText.trim() ? scoutRewardText.trim() : "";
    if (bountyId && finalScout) {
      try {
        await fetch(`/api/bounties/${bountyId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scoutReward: finalScout }),
        });
      } catch (err) {
        console.warn("Could not save scoutReward to backend:", err);
      }
    }
    if (onConfirm) {
      onConfirm(finalScout);
    }
  };

  // ลิงก์ปลายทางโปรไฟล์
  const resolvedProfileUrl = profileUrl || (bountyId ? `/profile/bounty/${bountyId}` : "/profile");

  // จัดการแชร์การ์ด (ฝังรหัสผู้แนะนำ ?ref=[USER_ID])
  const getShareUrl = () => {
    const origin = typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'http://localhost:3000';
    const baseUrl = `${origin}/profile/bounty/${bountyId || 'preview'}`;
    const activeUserId = currentUserId || sessionUserId;
    if (activeUserId) {
      return `${baseUrl}?ref=${encodeURIComponent(activeUserId)}`;
    }
    return baseUrl;
  };

  const getShareMessage = () => {
    const targetUrl = getShareUrl();
    const prizeText = rewardText || "ตามตกลง";
    const expectationText = cleanExpectationText || "ช่วยแก้ปัญหาให้สำเร็จตามตกลง";
    const scoutLine = scoutRewardText.trim() ? `\n📢 ค่าชี้เป้า (ผู้ช่วยแชร์/แนะนำ): ${scoutRewardText.trim()}` : "";

    // โครงสร้างข้อความ Copywriting สำหรับแชร์โซเชียลตามรูปแบบที่กำหนด
    return `🚨 ภารกิจด่วนจาก MAKE A DOT [${displayBountyId}]
ใครแก้ปัญหานี้ได้ รับรางวัลไปเลย!
🎯 ปัญหาคือ: ${cleanProblemText}
✨ สิ่งที่ต้องการ: ${expectationText}
💰 ค่าตอบแทน/สิ่งแลกเปลี่ยน: ${prizeText}${scoutLine}
👉 ใครทำได้หรือมีไอเดียดีๆ กดลิงก์เข้ามารับงานหรือเสนอตัวช่วยกันเลยที่:
${targetUrl}`;
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 5000);
  };

  // =========================================================================
  // ข้อ 1 & 2 & 3: เรนเดอร์ Canvas โปสเตอร์ความละเอียดสูง (Flex Space-Between & Max-Height Control)
  // 1. Flex Column with Space-Between: จัดระยะห่าง Header <-> Body <-> Footer ให้สมมาตร ไม่มี Dead Space
  // 2. Max-Height Control: ปรับความสูงไดนามิกตามเนื้อหาจริง (min 860px, max 1350px) ไม่ยืดทิ้งพื้นที่ว่าง
  // 3. Tighten Multi-Line Reward Line-Height: บีบระยะบรรทัดรางวัลให้ชิดเป็นกลุ่มก้อนเดียวกัน
  // =========================================================================
  const exportPosterImage = () => {
    const width = 1080;
    const maxContentW = 880;

    // เตรียม canvas ชั่วคราวสำหรับคำนวณและวัดขนาดฟอนต์/บรรทัดจริงก่อนวาด
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // -------------------------------------------------------------------------
    // 1. คำนวณเนื้อหาและวัดความสูงส่วน Hook (The Hook / ปัญหาหลัก)
    // -------------------------------------------------------------------------
    const hookLen = cleanProblemText.length;
    let hookFontSize = 56;
    let hookLineH = 68;
    if (hookLen > 40) {
      hookFontSize = 40;
      hookLineH = 50;
    } else if (hookLen > 20) {
      hookFontSize = 48;
      hookLineH = 58;
    }
    ctx.font = `900 ${hookFontSize}px "Prompt", sans-serif`;
    const hookDisplay = `“${cleanProblemText}”`;
    const hookLines = wrapTextLines(ctx, hookDisplay, maxContentW);
    const hookHeight = hookLines.length * hookLineH;

    // -------------------------------------------------------------------------
    // 2. คำนวณเนื้อหาและวัดความสูงส่วน สิ่งที่ต้องการ & ข้อจำกัด (ถ้ามี)
    // -------------------------------------------------------------------------
    ctx.font = 'normal 21px "Prompt", sans-serif';
    const expLines = cleanExpectationText
      ? wrapTextLines(ctx, `🎯 สิ่งที่ต้องการ: ${cleanExpectationText}`, maxContentW)
      : [];
    const conLines = cleanConstraintText
      ? wrapTextLines(ctx, `⚠️ ข้อจำกัด: ${cleanConstraintText}`, maxContentW)
      : [];
    const detailsLineCount = expLines.length + conLines.length;
    const detailsHeight = detailsLineCount * 30;

    // -------------------------------------------------------------------------
    // 3. ป้ายผู้เชี่ยวชาญที่ต้องการ
    // -------------------------------------------------------------------------
    const occName = (targetOccupations.length > 0 && targetOccupations[0]?.name)
      ? targetOccupations[0].name
      : 'เปิดรับผู้เชี่ยวชาญทุกด้าน';
    const specText = `🛠️ ผู้เชี่ยวชาญที่ต้องการ: ${occName}`;
    const specHeight = 44;

    // -------------------------------------------------------------------------
    // 4. คำนวณเนื้อหาและวัดความสูงส่วน รางวัล (Reward)
    // ข้อ 3: บีบระยะห่างบรรทัดรางวัล (Tighten Multi-Line Reward Line-Height)
    // -------------------------------------------------------------------------
    const prizeStr = rewardText || 'ตามตกลง';
    const prizeLen = prizeStr.length;
    let prizeFontSize = 68;
    if (prizeLen > 55) {
      prizeFontSize = 32;
    } else if (prizeLen > 25) {
      prizeFontSize = 40;
    } else if (prizeLen > 10) {
      prizeFontSize = 52;
    }
    // ปรับ line-height ให้ชิดเป็นกลุ่มก้อนเดียวกัน ไม่แยกห่างจนดูเหมือนคนละประโยค
    const prizeLineH = Math.round(prizeFontSize * 1.15);
    ctx.font = `900 ${prizeFontSize}px "Prompt", sans-serif`;
    const prizeLines = wrapTextLines(ctx, prizeStr, maxContentW);
    const prizeHeight = prizeLines.length * prizeLineH;

    // ความสูงของส่วนประกอบย่อยใน Body
    const tagHeight = 36;
    const rewardTitleH = 24;
    const escrowNoteH = 22;

    const hasScout = Boolean(scoutRewardText && scoutRewardText.trim());
    const scoutBadgeH = hasScout ? 46 : 0;
    const gapRewardToScout = hasScout ? 14 : 0;

    // ระยะช่องว่าง (Gaps) ภายใน Body Content
    const gapTagToHook = 28;
    const gapHookToDetails = detailsLineCount > 0 ? 14 : 0;
    const gapDetailsToSpec = 24;
    const gapSpecToReward = 32;
    const gapRewardTitleToPrize = 18;
    const gapPrizeToEscrow = 14;

    const bodyHeight =
      tagHeight +
      gapTagToHook +
      hookHeight +
      gapHookToDetails +
      detailsHeight +
      gapDetailsToSpec +
      specHeight +
      gapSpecToReward +
      rewardTitleH +
      gapRewardTitleToPrize +
      prizeHeight +
      (hasScout ? (gapRewardToScout + scoutBadgeH) : 0) +
      gapPrizeToEscrow +
      escrowNoteH;

    // -------------------------------------------------------------------------
    // ข้อ 2: คุมความสูงการ์ดให้กระชับ สมส่วน (Max-Height Control)
    // สำหรับเนื้อหาสั้น/ปานกลาง ให้ปรับ Padding & Gap ให้กระชับ ไม่ต้องยืดถึง 1,350px
    // หากมีหลายบรรทัด ให้ขยายตามจริงได้ สูงสุดไม่เกิน Max-height 1,350px
    // -------------------------------------------------------------------------
    const headerH = 150;      // จากขอบบนถึงเส้นคั่น Header (Y = 148)
    const ctaH = 156;         // ความสูงแถบดำ CTA
    const bottomPadding = 44; // ระยะห่างจากขอบล่าง
    const footerH = ctaH + bottomPadding; // 200px

    const minHeight = 860;
    const maxHeight = 1350;
    const targetGap = 52;     // ระยะห่างมาตรฐานระหว่าง Header <-> Body และ Body <-> Footer
    const naturalHeight = headerH + targetGap + bodyHeight + targetGap + footerH;
    const height = Math.min(maxHeight, Math.max(minHeight, Math.round(naturalHeight)));

    // กำหนดขนาดจริงของ Canvas (จะรีเซ็ต State ของ Context เพื่อเริ่มวาดจริง)
    canvas.width = width;
    canvas.height = height;

    // -------------------------------------------------------------------------
    // ข้อ 1: ปรับ Layout การ์ดให้เป็น Flex Column with Space-Between
    // แบ่งพื้นที่ออกเป็น 3 ส่วน: Header, Body Content, Footer (แถบสีดำ QR Code)
    // คำนวณระยะห่างคั่นกลางให้เท่ากันแบบสมดุล ไม่มี Dead Space ลอยตรงกลาง
    // -------------------------------------------------------------------------
    const availableSpace = height - headerH - footerH;
    const remainingSpace = Math.max(0, availableSpace - bodyHeight);
    const flexSpace = Math.round(remainingSpace / 2);

    let curY = headerH + flexSpace;
    const ctaY = height - bottomPadding - ctaH;

    // 1. พื้นหลังสีขาวสะอาดตา
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. ลวดลายจุด (Dot Pattern) อ่อนๆ สไตล์ Make a Dot
    ctx.fillStyle = 'rgba(226, 232, 240, 0.65)';
    for (let dx = 32; dx < width - 24; dx += 32) {
      for (let dy = 32; dy < height - 24; dy += 32) {
        ctx.beginPath();
        ctx.arc(dx, dy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. ขอบการ์ดมนนุ่มนวล (Soft SaaS Border)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(36, 36, width - 72, height - 72, 36);
      ctx.stroke();
    } else {
      ctx.strokeRect(36, 36, width - 72, height - 72);
    }

    // 4. ส่วน Header: โลโก้น้องดอท 3D + MAKE A DOT + รหัสเควสต์
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.arc(88, 96, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(80, 88, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px "Prompt", sans-serif';
    ctx.fillText('MAKE A DOT', 128, 93);

    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 15px "Prompt", sans-serif';
    ctx.fillText('BOUNTY POSTER • ภารกิจหาคนช่วย', 128, 118);

    // ป้ายรหัสเควสต์ (Badge ขวาบน)
    ctx.fillStyle = '#F1F5F9';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(width - 330, 72, 145, 46, 12);
      ctx.fill();
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(displayBountyId, width - 310, 102);

    // ป้ายระดับปัญหา
    ctx.fillStyle = '#FFF1F2';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(width - 170, 72, 105, 46, 12);
      ctx.fill();
      ctx.strokeStyle = '#FECDD3';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = '#E11D48';
    ctx.font = 'bold 18px "Prompt", sans-serif';
    ctx.fillText(scaleConfig.label, width - 152, 102);

    // เส้นแบ่งขอบ Header
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(50, 148);
    ctx.lineTo(width - 50, 148);
    ctx.stroke();

    // -------------------------------------------------------------------------
    // วาดส่วน Body Content (จัดกึ่งกลางระหว่าง Header และ Footer แบบ Flex Space-Between)
    // -------------------------------------------------------------------------
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 4.1 แท็กแจ้งเตือนด่วน
    const tagText = '🚨 ภารกิจเร่งด่วน • ใครช่วยได้บ้าง?';
    ctx.font = 'bold 18px "Prompt", sans-serif';
    const tagW = ctx.measureText(tagText).width + 36;
    ctx.fillStyle = '#FFF1F2';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect((width - tagW) / 2, curY, tagW, tagHeight, 18);
      ctx.fill();
    }
    ctx.fillStyle = '#E11D48';
    ctx.fillText(tagText, width / 2, curY + tagHeight / 2);
    curY += tagHeight + gapTagToHook;

    // 4.2 The Hook (ปัญหาหลัก)
    ctx.font = `900 ${hookFontSize}px "Prompt", sans-serif`;
    ctx.fillStyle = '#0F172A';
    hookLines.forEach((line) => {
      ctx.fillText(line, width / 2, curY + hookLineH / 2);
      curY += hookLineH;
    });
    curY += gapHookToDetails;

    // 4.3 สิ่งที่ต้องการ & ข้อจำกัด
    if (detailsLineCount > 0) {
      ctx.font = 'normal 21px "Prompt", sans-serif';
      ctx.fillStyle = '#64748B';
      expLines.forEach((line) => {
        ctx.fillText(line, width / 2, curY + 15);
        curY += 30;
      });
      conLines.forEach((line) => {
        ctx.fillText(line, width / 2, curY + 15);
        curY += 30;
      });
    }
    curY += gapDetailsToSpec;

    // 4.4 ผู้เชี่ยวชาญที่ต้องการ (Center Pill)
    ctx.font = 'bold 20px "Prompt", sans-serif';
    const specW = ctx.measureText(specText).width + 44;
    ctx.fillStyle = '#F8FAFC';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect((width - specW) / 2, curY, specW, specHeight, 22);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.fillStyle = '#334155';
    ctx.fillText(specText, width / 2, curY + specHeight / 2);
    curY += specHeight + gapSpecToReward;

    // 4.5 รางวัลค่าตอบแทน (BOUNTY REWARD)
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 19px "Prompt", sans-serif';
    ctx.fillText('รางวัลค่าตอบแทน (BOUNTY REWARD)', width / 2, curY + rewardTitleH / 2);
    curY += rewardTitleH + gapRewardTitleToPrize;

    ctx.font = `900 ${prizeFontSize}px "Prompt", sans-serif`;
    ctx.fillStyle = '#E11D48';
    prizeLines.forEach((line) => {
      ctx.fillText(line, width / 2, curY + prizeLineH / 2);
      curY += prizeLineH;
    });

    // ป้ายตรายางค่าชี้เป้าบนโปสเตอร์ (เมื่อมีการระบุ)
    if (hasScout) {
      curY += gapRewardToScout;
      const scoutStr = `📢 ค่าชี้เป้า / แนะนำงาน: ${scoutRewardText.trim()}`;
      ctx.font = 'bold 22px "Prompt", sans-serif';
      const scoutW = Math.min(maxContentW, ctx.measureText(scoutStr).width + 56);
      const scoutH = 46;
      ctx.fillStyle = '#FEF3C7'; // Amber-100
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect((width - scoutW) / 2, curY, scoutW, scoutH, 23);
        ctx.fill();
        ctx.strokeStyle = '#F59E0B'; // Amber-500
        ctx.lineWidth = 2.5;
        ctx.stroke();
      } else {
        ctx.fillRect((width - scoutW) / 2, curY, scoutW, scoutH);
      }
      ctx.fillStyle = '#92400E'; // Amber-800
      ctx.fillText(scoutStr, width / 2, curY + scoutH / 2);
      curY += scoutH;

      // ตรายางจำลองมุมขวาบนของการ์ด
      ctx.save();
      ctx.translate(width - 150, 220);
      ctx.rotate((12 * Math.PI) / 180);
      ctx.strokeStyle = '#D97706'; // Amber-600
      ctx.lineWidth = 3;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(-85, -22, 170, 44, 10);
        ctx.stroke();
      } else {
        ctx.strokeRect(-85, -22, 170, 44);
      }
      ctx.fillStyle = '#D97706';
      ctx.font = 'bold 17px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⭐ มีค่าชี้เป้า', 0, 0);
      ctx.restore();
    }

    curY += gapPrizeToEscrow;

    // ข้อความ Escrow
    ctx.fillStyle = '#64748B';
    ctx.font = 'normal 17px "Prompt", sans-serif';
    ctx.fillText('🛡️ ปลอดภัยด้วยสัญญา Escrow • รับเงินเมื่อตรวจรับงานเสร็จ 100%', width / 2, curY + escrowNoteH / 2);

    // -------------------------------------------------------------------------
    // 5. ส่วน Footer: แถบ CTA สีดำเข้มและ QR Code (วางล่างสุดเสมอ)
    // -------------------------------------------------------------------------
    ctx.fillStyle = '#0F172A';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(48, ctaY, width - 96, ctaH, 24);
      ctx.fill();
    } else {
      ctx.fillRect(48, ctaY, width - 96, ctaH);
    }

    // ข้อความกระตุ้น CTA ด้านซ้าย
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 21px "Prompt", sans-serif';
    ctx.fillText('🔥 สแกนเพื่อรับงานนี้ หรือพิมพ์ค้นหา', 80, ctaY + 48);

    ctx.fillStyle = '#FB7185';
    ctx.font = 'bold 24px "Prompt", sans-serif';
    ctx.fillText(`รหัส [${displayBountyId}] ที่ make-a-dot.com`, 80, ctaY + 88);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'normal 16px "Prompt", sans-serif';
    ctx.fillText('👉 รับเงินจริงทันทีที่ส่งมอบงานสำเร็จ • ชุมชน MAKE A DOT', 80, ctaY + 124);

    // QR Code จำลองขนาด 116px ด้านขวา
    const targetUrl = getShareUrl();
    const qrSize = 116;
    const qrX = width - 48 - qrSize - 24;
    const qrY = ctaY + (ctaH - qrSize) / 2;
    drawSimulatedQRCode(ctx, qrX, qrY, qrSize, targetUrl);

    // ดาวน์โหลดรูปภาพ .png ลงเครื่อง
    const imageUri = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = `make-a-dot-bounty-${displayBountyId.replace('#', '')}.png`;
    downloadLink.href = imageUri;
    downloadLink.click();
  };

  // Helper คัดลอกข้อความลง Clipboard พร้อมระบบ Fallback 100%
  const copyToClipboard = async (text: string): Promise<boolean> => {
    let success = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch {
      // fallback to execCommand if navigator.clipboard fails
    }

    if (!success && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (e) {
        console.error('execCommand copy fallback error:', e);
      }
    }
    return success;
  };

  // =========================================================================
  // ข้อ 2: ระบบ Auto-Download Image + Auto-Copy Caption (Step A -> Step B -> Step C)
  // =========================================================================
  const handleAutoShareFlow = async (platform?: 'facebook' | 'line') => {
    try {
      setIsSavingImage(true);

      // Step A: คัดลอกข้อความแคปชันทั้งหมดลง Clipboard ของเครื่องทันทีโดยอัตโนมัติ (พร้อม Fallback)
      const shareMessage = getShareMessage();
      await copyToClipboard(shareMessage);

      // Step B: ทำการดาวน์โหลดไฟล์รูปภาพโปสเตอร์ .png ลงเครื่องผู้ใช้อัตโนมัติทันที
      exportPosterImage();

      // Step C: แสดงกล่องแจ้งเตือน Toast ชัดเจนกลางจอ
      if (platform === 'facebook') {
        showToast('📋 คัดลอกข้อความและบันทึกรูปแล้ว! กำลังพาไปยังบอร์ดภารกิจ...');
      } else if (platform === 'line') {
        showToast('✅ คัดลอกข้อความและบันทึกรูปแล้ว! กำลังพาไปยังบอร์ดภารกิจ...');
      } else {
        showToast('✅ คัดลอกข้อความและบันทึกรูปแล้ว! กำลังพาไปยังบอร์ดภารกิจ...');
      }

      // ถ้าผู้ใช้กดปุ่ม Facebook หรือ LINE: เปิดหน้าต่างแชร์ให้อัตโนมัติหลังเซฟ
      if (platform === 'facebook') {
        const targetUrl = getShareUrl();
        setTimeout(() => {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`,
            '_blank'
          );
        }, 200);
      } else if (platform === 'line') {
        const targetUrl = getShareUrl();
        setTimeout(() => {
          window.open(
            `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(shareMessage)}`,
            '_blank'
          );
        }, 200);
      }

      // นำทางพุ่งไปหน้า บอร์ดภารกิจ (/board) ทันทีหลังแชร์หรือบันทึกรูปเสร็จ
      setTimeout(() => {
        router.push('/board');
      }, 900);
    } catch (err) {
      console.error('Failed auto share flow:', err);
      showToast('ไม่สามารถแชร์หรือบันทึกรูปภาพได้ในขณะนี้');
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div className={`w-full text-left font-prompt space-y-3.5 ${className}`}>
      {/* Toast Notification ชัดเจนกลางจอตาม Step C */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] sm:max-w-md w-full bg-gray-900/95 text-white py-3.5 px-4 rounded-2xl shadow-2xl border border-gray-700/80 flex items-center gap-3 animate-fade-in pointer-events-none backdrop-blur-sm">
          <span className="text-xl shrink-0">✅</span>
          <span className="text-xs sm:text-sm font-bold leading-snug">{toastMessage}</span>
        </div>
      )}
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

          {/* ค่าตอบแทน / สิ่งแลกเปลี่ยน (รองรับข้อความหลายรายการแบบ Responsive ไม่ล้นขอบ) */}
          <div className="bg-white rounded-xl p-3 border border-gray-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">
                ค่าตอบแทน / สิ่งแลกเปลี่ยน
              </span>
              <span className="text-[10px] text-brand-red font-mono font-bold">
                BOUNTY REWARD
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-brand-red tracking-tight break-words leading-snug">
              {rewardText}
            </div>

            {/* ป้ายตรายางค่าชี้เป้า เมื่อมีการระบุ */}
            {scoutRewardText.trim() && (
              <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <span>📢 ค่าชี้เป้า:</span>
                  <span className="text-brand-red font-black text-xs sm:text-sm">{scoutRewardText.trim()}</span>
                </div>
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/80 uppercase">
                  Scout Reward
                </span>
              </div>
            )}
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
          /* ---------------- สถานะก่อนกดยืนยัน: แถบค่าชี้เป้า + ปุ่มแก้ไข/ยืนยัน ---------------- */
          <div className="space-y-3">
            {/* แถบสี่เหลี่ยมสีขาวขอบเทา/แดงอ่อน: เพิ่ม 'ค่าชี้เป้า' (Upsell UI) */}
            <div className={`bg-white border transition-all duration-200 rounded-2xl p-3.5 shadow-2xs ${
              hasScoutReward ? "border-brand-red/40 ring-1 ring-brand-red/20" : "border-gray-200/90 hover:border-gray-300"
            }`}>
              <label className="flex items-center justify-between cursor-pointer select-none gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none shrink-0">📢</span>
                  <span className="text-xs sm:text-[13px] font-bold text-gray-800 leading-snug">
                    เพิ่ม &apos;ค่าชี้เป้า&apos; เพื่อกระตุ้นให้คนช่วยแชร์และหาคนรับงานได้ไวขึ้น <span className="text-gray-400 font-normal">(เลือกได้)</span>
                  </span>
                </div>
                {/* Modern Toggle Switch */}
                <div className="relative inline-flex items-center shrink-0">
                  <input
                    type="checkbox"
                    checked={hasScoutReward}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setHasScoutReward(checked);
                      if (!checked) setScoutRewardText("");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-brand-red cursor-pointer"></div>
                </div>
              </label>

              {/* กางช่องกรอกข้อมูลออกมาด้านล่างทันทีเมื่อเปิดใช้งาน */}
              {hasScoutReward && (
                <div className="pt-2 animate-fade-in border-t border-gray-100 mt-2.5">
                  <input
                    type="text"
                    value={scoutRewardText}
                    onChange={(e) => setScoutRewardText(e.target.value)}
                    placeholder="ระบุจำนวนเงิน หรือ % ส่วนแบ่ง (เช่น ฿500 หรือ 10%)"
                    className="w-full bg-[#F5F5F7] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:bg-white focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all placeholder:text-gray-400 placeholder:font-normal"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* ปุ่ม [แก้ไข] และ [ยืนยันข้อมูลเข้าระบบ ->] */}
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
          </div>
        ) : (
          /* ---------------- สถานะยืนยันสำเร็จแล้ว: แถบแชร์ 4 ปุ่มกระชับ + ปุ่มไปต่อที่บอร์ด ---------------- */
          <div className="space-y-2.5 animate-fade-in">
            <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-2.5 space-y-2">
              {/* ข้อความกระตุ้น: แชร์เพื่อมีสิทธิ์รับค่าแนะนำ */}
              <div className="text-center text-xs sm:text-[13px] font-bold text-gray-800 flex items-center justify-center gap-1.5 pt-0.5">
                <span className="text-brand-red">📢</span>
                <span>แชร์เพื่อมีสิทธิ์รับค่าแนะนำ</span>
                {scoutRewardText.trim() && (
                  <span className="ml-0.5 text-[10px] font-black text-brand-red bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                    {scoutRewardText.trim()}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {/* 1. ปุ่ม Facebook */}
                <button
                  type="button"
                  onClick={() => handleAutoShareFlow('facebook')}
                  disabled={isSavingImage}
                  className="bg-white hover:bg-gray-100 active:scale-95 text-gray-800 border border-gray-200 font-bold py-2 px-1 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <i className="fa-brands fa-facebook text-blue-600 text-sm" />
                  <span>Facebook</span>
                </button>

                {/* 2. ปุ่ม LINE */}
                <button
                  type="button"
                  onClick={() => handleAutoShareFlow('line')}
                  disabled={isSavingImage}
                  className="bg-white hover:bg-gray-100 active:scale-95 text-gray-800 border border-gray-200 font-bold py-2 px-1 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <i className="fa-brands fa-line text-emerald-500 text-sm" />
                  <span>LINE</span>
                </button>

                {/* 3. ปุ่มคัดลอก */}
                <button
                  type="button"
                  onClick={() => handleAutoShareFlow()}
                  disabled={isSavingImage}
                  className="bg-white hover:bg-gray-100 active:scale-95 text-gray-800 border border-gray-200 font-bold py-2 px-1 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <i className="fa-regular fa-copy text-gray-600 text-xs" />
                  <span>คัดลอก</span>
                </button>

                {/* 4. ปุ่มบันทึกรูปโปสเตอร์ (สีแดง Make a Dot เด่นชัด) */}
                <button
                  type="button"
                  onClick={() => handleAutoShareFlow()}
                  disabled={isSavingImage}
                  className="bg-brand-red hover:bg-red-600 active:scale-95 text-white font-bold py-2 px-1 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <i className="fa-regular fa-image text-xs" />
                  <span>{isSavingImage ? "กำลังเซฟ..." : "บันทึกรูป"}</span>
                </button>
              </div>
            </div>

            {/* ปุ่มไปต่อ: พุ่งไปหน้า บอร์ดภารกิจ (/board) ทันที */}
            <button
              type="button"
              onClick={() => router.push('/board')}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <span>ไปต่อที่บอร์ดภารกิจ</span>
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BountySummaryCard;