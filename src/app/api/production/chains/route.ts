import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  ensureProductionSeeded,
  findProductChainInDb,
  createBountyFromSupplyChainNode,
} from '@/lib/productionDb';
import { normalizeChain } from '@/components/ecosystem/production/schema';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await ensureProductionSeeded();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (q) {
      const match = await findProductChainInDb(q);
      return NextResponse.json({
        success: true,
        found: !!match,
        result: match,
      });
    }

    const [records, rooms] = await Promise.all([
      prisma.productChain.findMany({
        orderBy: [{ status: 'desc' }, { searchCount: 'desc' }, { updatedAt: 'desc' }],
        include: {
          industry: { select: { id: true, name: true, order: true, icon: true } },
        },
        take: 100,
      }),
      prisma.groupPoolingRoom.findMany({
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    ]);

    const chains = records
      .map((r) => {
        try {
          const parsed = normalizeChain(JSON.parse(r.fullChainJson));
          if (!parsed) return null;
          return {
            recordId: r.id,
            slug: r.slug,
            source: r.source,
            status: r.status,
            searchCount: r.searchCount,
            sectorOrder: r.sectorOrder,
            industry: r.industry,
            chain: parsed,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      chains,
      rooms: rooms.map((rm) => ({
        id: rm.id,
        productName: rm.productName,
        modelName: rm.modelName,
        mode: rm.mode,
        members: rm.members,
        targetMembers: rm.targetMembers,
        lotCost: rm.lotCost,
        status: rm.status,
        createdAt: rm.createdAt.getTime(),
      })),
    });
  } catch (error) {
    console.error('[GET /api/production/chains] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureProductionSeeded();
    const body = await req.json();
    const action = body.action;

    if (action === 'CREATE_ROOM') {
      const { productName, modelName, mode, lotCost } = body;
      const chainRec = productName
        ? await prisma.productChain.findFirst({
            where: { productName: { contains: productName } },
          })
        : null;

      const created = await prisma.groupPoolingRoom.create({
        data: {
          productChainId: chainRec?.id ?? null,
          productName: productName || 'สินค้าทั่วไป',
          modelName: modelName || 'รวมกลุ่มสั่งผลิต',
          mode: mode || 'รวมกลุ่มสั่งจ้างโรงงานผลิต (OEM)',
          members: 1,
          targetMembers: 10,
          lotCost: Number(lotCost) || 30000,
          status: 'OPEN',
        },
      });

      return NextResponse.json({
        success: true,
        room: {
          id: created.id,
          productName: created.productName,
          modelName: created.modelName,
          mode: created.mode,
          members: created.members,
          targetMembers: created.targetMembers,
          lotCost: created.lotCost,
          createdAt: created.createdAt.getTime(),
        },
      });
    }

    if (action === 'JOIN_ROOM') {
      const { roomId } = body;
      if (!roomId) {
        return NextResponse.json({ success: false, error: 'Missing roomId' }, { status: 400 });
      }
      const updated = await prisma.groupPoolingRoom.update({
        where: { id: roomId },
        data: { members: { increment: 1 } },
      });
      return NextResponse.json({
        success: true,
        room: {
          id: updated.id,
          productName: updated.productName,
          modelName: updated.modelName,
          mode: updated.mode,
          members: updated.members,
          targetMembers: updated.targetMembers,
          lotCost: updated.lotCost,
          createdAt: updated.createdAt.getTime(),
        },
      });
    }

    if (action === 'OPEN_BOUNTY') {
      const { nodeRecordId } = body;
      if (!nodeRecordId) {
        return NextResponse.json({ success: false, error: 'Missing nodeRecordId' }, { status: 400 });
      }
      const problem = await createBountyFromSupplyChainNode(nodeRecordId);
      return NextResponse.json({
        success: true,
        problem,
        message: 'เปิดภารกิจแก้คอขวดการผลิต (ProblemNode Bounty) เชื่อมเข้าสู่ระบบเรียบร้อยแล้ว',
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[POST /api/production/chains] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
