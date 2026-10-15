import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/components/ecosystem/production/prompt';
import { normalizeChain } from '@/components/ecosystem/production/schema';
import { buildArchetypeChain } from '@/components/ecosystem/production/archetypes';

export const runtime = 'nodejs';

/**
 * POST /api/production/generate
 * body: { name: string; sectorHint?: string; subHint?: string; apiKey?: string }
 * 1) ใช้ Gemini จริงเมื่อมี API Key (จาก body หรือ ENV)
 * 2) ไม่มี Key หรือเรียก Gemini ล้มเหลว -> ตอบ Smart Archetype Chain เสมอ (100% Reliability)
 */
export async function POST(req: Request) {
  let body: { name?: string; sectorHint?: string; subHint?: string; apiKey?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
  const name = (body.name || '').trim();
  if (!name) return NextResponse.json({ error: 'NAME_REQUIRED' }, { status: 400 });

  const key =
    (body.apiKey || '').trim() ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    '';

  // No key -> return Archetype fallback seamlessly
  if (!key) {
    const fallback = buildArchetypeChain(name, {
      sectorId: body.sectorHint,
      subName: body.subHint,
    });
    return NextResponse.json({ chain: fallback, source: 'FALLBACK' });
  }

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
        return NextResponse.json({ chain: normalized, source: 'GEMINI' });
      }
    }
  } catch (err) {
    console.warn('Gemini generateContent failed, falling back to Archetype Engine:', err);
  } finally {
    clearTimeout(timer);
  }

  // Fallback if Gemini failed or produced unparseable output
  const fallback = buildArchetypeChain(name, {
    sectorId: body.sectorHint,
    subName: body.subHint,
  });
  return NextResponse.json({ chain: fallback, source: 'FALLBACK' });
}
