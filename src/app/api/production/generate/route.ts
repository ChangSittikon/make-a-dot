import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/components/ecosystem/production/prompt';
import { normalizeChain } from '@/components/ecosystem/production/schema';
import { buildArchetypeChain } from '@/components/ecosystem/production/archetypes';
import { findProductChainInDb, upsertProductChainToDb } from '@/lib/productionDb';

export const runtime = 'nodejs';

/**
 * POST /api/production/generate
 * body: { name: string; sectorHint?: string; subHint?: string; apiKey?: string; forceRegenerate?: boolean }
 * 1) ค้นหาในฐานข้อมูลกลาง Prisma (ProductChain) ก่อน — ถ้ามีอยู่แล้วส่งกลับทันที
 * 2) ถ้ายังไม่มี ใช้ Gemini จริงเมื่อมี API Key (จาก body หรือ ENV)
 * 3) ไม่มี Key หรือเรียก Gemini ล้มเหลว -> ตอบ Smart Archetype Chain เสมอ (100% Reliability)
 * 4) บันทึกผังที่สร้างใหม่ลงฐานข้อมูลกลาง Prisma (เชื่อม Industry 1..12 ของ DOT017 Taxonomy Center)
 */
export async function POST(req: Request) {
  let body: {
    name?: string;
    sectorHint?: string;
    subHint?: string;
    apiKey?: string;
    forceRegenerate?: boolean;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
  const name = (body.name || '').trim();
  if (!name) return NextResponse.json({ error: 'NAME_REQUIRED' }, { status: 400 });

  // 1) Check central Prisma Database first unless forceRegenerate is requested
  if (!body.forceRegenerate) {
    try {
      const existing = await findProductChainInDb(name);
      if (existing) {
        return NextResponse.json({
          chain: existing.chain,
          source: existing.source,
          recordId: existing.recordId,
          status: existing.status,
          fromDb: true,
        });
      }
    } catch (dbErr) {
      console.warn('[POST /api/production/generate] DB lookup warning:', dbErr);
    }
  }

  const key =
    (body.apiKey || '').trim() ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    '';

  let generatedChain = null;
  let source: 'GEMINI' | 'FALLBACK' = 'FALLBACK';

  if (key) {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 35000);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [
              { role: 'user', parts: [{ text: buildUserPrompt(name, body.sectorHint, body.subHint) }] },
            ],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
          }),
          signal: controller.signal,
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text: string =
          data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') || '';
        const cleaned = text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        const normalized = normalizeChain(parsed);
        if (normalized) {
          generatedChain = normalized;
          source = 'GEMINI';
        }
      }
    } catch (err) {
      console.warn('Gemini generateContent failed, falling back to Archetype Engine:', err);
    } finally {
      clearTimeout(timer);
    }
  }

  // Fallback if no key or Gemini failed
  if (!generatedChain) {
    generatedChain = buildArchetypeChain(name, {
      sectorId: body.sectorHint,
      subName: body.subHint,
    });
    source = 'FALLBACK';
  }

  // Persist into central Prisma Database (linked to DOT017 12 Industries)
  let recordId: string | undefined;
  let status = 'PENDING_REVIEW';
  try {
    const savedRecord = await upsertProductChainToDb(generatedChain, source, 'PENDING_REVIEW');
    recordId = savedRecord.id;
    status = savedRecord.status;
  } catch (saveErr) {
    console.error('[POST /api/production/generate] Failed to persist ProductChain to DB:', saveErr);
  }

  return NextResponse.json({
    chain: generatedChain,
    source,
    recordId,
    status,
    fromDb: false,
  });
}
