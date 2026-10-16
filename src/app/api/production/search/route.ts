import { NextResponse } from 'next/server';
import { ensureProductionSeeded } from '@/lib/productionDb';
import { resolveSemanticQuery, getSynonymSuggestions } from '@/lib/semanticSearch';

export const dynamic = 'force-dynamic';

/**
 * GET /api/production/search?q=น้ำหอมรถยนต์
 * ระบบค้นหาด้วยความหมาย (Semantic Search & Synonym Mapping - Phase 3)
 * คืนค่า:
 * 1) semanticMatch: ผังสินค้าหลักที่คำค้นหานี้สังกัดอยู่ (เช่น ก้านไม้หอม/น้ำหอมรถยนต์ -> เครื่องหอมและอโรมา)
 * 2) suggestions: รายการคำพ้องและคำค้นหาแนะนำ
 */
export async function GET(req: Request) {
  try {
    await ensureProductionSeeded();
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q) {
      return NextResponse.json({
        success: true,
        query: '',
        semanticMatch: null,
        suggestions: [],
      });
    }

    const [semantic, suggestions] = await Promise.all([
      resolveSemanticQuery(q),
      getSynonymSuggestions(q),
    ]);

    return NextResponse.json({
      success: true,
      query: q,
      semanticMatch: semantic.isMatch && semantic.canonicalChain
        ? {
            isMatch: true,
            canonicalProductName: semantic.canonicalChain.product.product_name,
            productChainRecordId: semantic.productChainRecordId,
            matchedKeyword: semantic.matchedKeyword,
            matchType: semantic.matchType,
            confidence: semantic.confidence,
            explanation: semantic.explanation,
            suggestedNodeOrder: semantic.suggestedNodeOrder,
            suggestedNodeTitle: semantic.suggestedNodeTitle,
            chain: semantic.canonicalChain,
          }
        : null,
      suggestions,
    });
  } catch (error) {
    console.error('[GET /api/production/search] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
