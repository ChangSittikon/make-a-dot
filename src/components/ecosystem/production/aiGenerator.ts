import { ChainSource, ProductChain } from './types';
import { normalizeChain } from './schema';
import { buildArchetypeChain } from './archetypes';
import { saveChain, loadApiKey } from './storage';

export { SYSTEM_PROMPT } from './prompt';

export interface GenerateResult {
  chain: ProductChain;
  source: ChainSource;
  fromDb?: boolean;
  status?: string;
  recordId?: string;
}

/**
 * AI Product JSON Generator Engine (Prisma DB + DOT017 Integrated)
 * 1) เรียก /api/production/generate ซึ่งเช็กฐานข้อมูลกลาง Prisma ก่อน
 * 2) หากยังไม่มีใน DB จะสร้างด้วย Gemini (หรือ Smart Archetype Fallback) แล้วบันทึกลงตาราง ProductChain อัตโนมัติ
 * 3) บันทึกลง LocalStorage cache ควบคู่กันเพื่อความเร็วสูงสุดฝั่ง Client
 */
export async function generateProductChain(
  name: string,
  opts: { sectorId?: string; subName?: string; forceRegenerate?: boolean } = {}
): Promise<GenerateResult> {
  let result: GenerateResult | null = null;
  try {
    const res = await fetch('/api/production/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        sectorHint: opts.sectorId,
        subHint: opts.subName,
        forceRegenerate: opts.forceRegenerate,
        apiKey: loadApiKey() || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const chain = normalizeChain(data?.chain);
      if (chain) {
        result = {
          chain,
          source: (data?.source as ChainSource) || 'GEMINI',
          fromDb: !!data?.fromDb,
          status: data?.status,
          recordId: data?.recordId,
        };
      }
    }
  } catch {
    /* ใช้ fallback ด้านล่างหากออฟไลน์ */
  }
  if (!result) {
    result = { chain: buildArchetypeChain(name, opts), source: 'FALLBACK' };
  }
  saveChain(result.chain, result.source);
  return result;
}
