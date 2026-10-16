import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ensureProductionSeeded,
  verifyAndSyncChainToTaxonomy,
  createBountyFromSupplyChainNode,
  upsertProductChainToDb,
} from '@/lib/productionDb';
import { buildArchetypeChain } from '@/components/ecosystem/production/archetypes';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureProductionSeeded();

    const [chains, archetypes] = await Promise.all([
      prisma.productChain.findMany({
        orderBy: [{ status: 'asc' }, { sectorOrder: 'asc' }, { searchCount: 'desc' }],
        include: {
          industry: {
            select: { id: true, name: true, order: true, icon: true },
          },
          archetype: {
            select: { id: true, code: true, name: true },
          },
          synonyms: {
            orderBy: { hitCount: 'desc' },
          },
          nodes: {
            orderBy: { nodeOrder: 'asc' },
            include: {
              opportunities: {
                include: {
                  occupation: { select: { id: true, name: true } },
                  workType: { select: { id: true, name: true } },
                },
              },
              linkedProblems: {
                select: {
                  id: true,
                  rawDescription: true,
                  impactScale: true,
                  status: true,
                  bountyPrizeSatang: true,
                },
              },
            },
          },
          poolingRooms: true,
        },
      }),
      prisma.supplyChainArchetype.findMany({
        orderBy: { code: 'asc' },
        include: {
          industry: { select: { id: true, name: true, order: true } },
          _count: { select: { productChains: true } },
        },
      }),
    ]);

    let totalNodes = 0;
    let totalOpportunities = 0;
    let totalLinkedProblems = 0;
    let totalSynonyms = 0;
    let verifiedCount = 0;
    let pendingCount = 0;

    for (const c of chains) {
      if (c.status === 'VERIFIED') verifiedCount++;
      else pendingCount++;
      totalNodes += c.nodes.length;
      totalSynonyms += c.synonyms.length;
      for (const n of c.nodes) {
        totalOpportunities += n.opportunities.length;
        totalLinkedProblems += n.linkedProblems.length;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalChains: chains.length,
        verifiedCount,
        pendingCount,
        totalArchetypes: archetypes.length,
        totalNodes,
        totalOpportunities,
        totalLinkedProblems,
        totalSynonyms,
      },
      chains,
      archetypes,
    });
  } catch (error) {
    console.error('[GET /api/admin/taxonomy-production] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load production taxonomy data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureProductionSeeded();
    const body = await req.json();
    const { action } = body;

    if (action === 'ADD_SYNONYM') {
      const { productChainId, keyword, matchType } = body;
      if (!productChainId || !keyword) {
        return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
      }
      const { addProductSynonym } = await import('@/lib/productionDb');
      const syn = await addProductSynonym(productChainId, keyword, matchType || 'SYNONYM');
      return NextResponse.json({
        success: true,
        message: `เพิ่มคำพ้อง "${syn.keyword}" ให้ผังสินค้าเรียบร้อยแล้ว`,
        synonym: syn,
      });
    }

    if (action === 'DELETE_SYNONYM') {
      const { synonymId } = body;
      if (!synonymId) {
        return NextResponse.json({ success: false, error: 'Missing synonymId' }, { status: 400 });
      }
      const { deleteProductSynonym } = await import('@/lib/productionDb');
      await deleteProductSynonym(synonymId);
      return NextResponse.json({
        success: true,
        message: 'ลบคำพ้องเรียบร้อยแล้ว',
      });
    }

    if (action === 'SEMANTIC_TEST') {
      const { query } = body;
      if (!query || !query.trim()) {
        return NextResponse.json({ success: false, error: 'Missing query' }, { status: 400 });
      }
      const { resolveSemanticQuery } = await import('@/lib/semanticSearch');
      const result = await resolveSemanticQuery(query.trim());
      return NextResponse.json({
        success: true,
        query: query.trim(),
        result,
      });
    }

    if (action === 'VERIFY_AND_SYNC') {
      const { productChainId } = body;
      if (!productChainId) {
        return NextResponse.json({ success: false, error: 'Missing productChainId' }, { status: 400 });
      }
      const res = await verifyAndSyncChainToTaxonomy(productChainId);
      return NextResponse.json({
        success: true,
        message: `อนุมัติผัง "${res.updated.productName}" สำเร็จ! ซิงก์อาชีพใหม่ ${res.syncedOccupations} รายการ และทักษะ (SkillTag) ${res.syncedSkills} รายการเข้าสู่ Layer 3 เรียบร้อยแล้ว`,
        result: res,
      });
    }

    if (action === 'CREATE_BOUNTY') {
      const { nodeRecordId } = body;
      if (!nodeRecordId) {
        return NextResponse.json({ success: false, error: 'Missing nodeRecordId' }, { status: 400 });
      }
      const problem = await createBountyFromSupplyChainNode(nodeRecordId);
      return NextResponse.json({
        success: true,
        message: `สร้างภารกิจแก้ปัญหา (ProblemNode Bounty) จากคอขวดการผลิตเข้าสู่ระบบเรียบร้อยแล้ว`,
        problem,
      });
    }

    if (action === 'GENERATE_CHAIN') {
      const { productName, sectorOrder, subCategoryName } = body;
      if (!productName || !productName.trim()) {
        return NextResponse.json({ success: false, error: 'Missing productName' }, { status: 400 });
      }
      const sectorHint = sectorOrder ? String(sectorOrder).padStart(2, '0') : undefined;
      const generated = buildArchetypeChain(productName.trim(), {
        sectorId: sectorHint,
        subName: subCategoryName,
      });
      const saved = await upsertProductChainToDb(generated, 'FALLBACK', 'PENDING_REVIEW');
      return NextResponse.json({
        success: true,
        message: `AI สร้างผังห่วงโซ่ "${saved.productName}" (5 โหนดต้นน้ำ-ปลายน้ำ) เข้าคิวตรวจสอบเรียบร้อยแล้ว`,
        productChainId: saved.id,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[POST /api/admin/taxonomy-production] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }
    await prisma.productChain.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: 'ลบผังสินค้าออกจากฐานข้อมูลเรียบร้อยแล้ว',
    });
  } catch (error) {
    console.error('[DELETE /api/admin/taxonomy-production] Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
