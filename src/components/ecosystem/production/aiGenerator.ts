import { ChainSource, ProductChain } from './types';
import { normalizeChain } from './schema';
import { buildArchetypeChain } from './archetypes';
import { saveChain, loadApiKey } from './storage';

export { SYSTEM_PROMPT } from './prompt';

export interface GenerateResult {
  chain: ProductChain;
  source: ChainSource;
}

/**
 * AI Product JSON Generator Engine
 * 1) ลองเรียก Gemini ผ่าน /api/production/generate (ใช้ Key จากผู้ใช้หรือ ENV)
 * 2) ผ่าน normalizeChain (schema เดียวกับ Seed) ถ้าไม่ผ่าน/ไม่มี Key -> Smart Archetype Fallback
 * 3) บันทึกลง LocalStorage ทุกครั้ง
 */
export async function generateProductChain(
  name: string,
  opts: { sectorId?: string; subName?: string } = {}
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
        apiKey: loadApiKey() || undefined,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const chain = normalizeChain(data?.chain);
      if (chain) result = { chain, source: 'GEMINI' };
    }
  } catch {
    /* ใช้ fallback ด้านล่าง */
  }
  if (!result) {
    result = { chain: buildArchetypeChain(name, opts), source: 'FALLBACK' };
  }
  saveChain(result.chain, result.source);
  return result;
}
