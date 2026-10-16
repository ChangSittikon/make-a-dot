import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureProductionSeeded, resolveIndustryByOrder } from '@/lib/productionDb';

export const dynamic = 'force-dynamic';

export interface RoomParticipant {
  id: string;
  name: string;
  role: string;
  unitsAllocated: number;
  depositLockedThb: number;
  stakedAt: string;
}

async function getOrCreateActiveUserAndWallet() {
  let user = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
    include: { wallet: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'founder@makeadot.com',
        name: 'คุณ (ผู้ประกอบการเชื่อมดอท)',
        role: 'USER',
        trustScore: 95,
      },
      include: { wallet: true },
    });
  }

  let wallet = user.wallet;
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 5000000, // 50,000.00 THB (in Satang)
        lockedBalance: 1200000, // 12,000.00 THB (in Satang)
      },
    });

    await prisma.ledgerTransaction.createMany({
      data: [
        {
          walletId: wallet.id,
          amount: 5000000,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          referenceId: 'INITIAL_WALLET_FUNDING',
        },
        {
          walletId: wallet.id,
          amount: -1200000,
          type: 'STAKE_HOLD',
          status: 'COMPLETED',
          referenceId: 'ESCROW_SEED_POOL',
        },
      ],
    });
  } else if (wallet.lockedBalance < 0 || wallet.balance < 0) {
    wallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: Math.max(wallet.balance, 5000000),
        lockedBalance: 1200000,
      },
    });
  }

  const transactions = await prisma.ledgerTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: 'desc' },
    take: 15,
  });

  return { user, wallet, transactions };
}

function buildPurchaseOrderNo(): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PO-DOT-${ymd}-${rand}`;
}

function parseParticipants(rawJson: string, room: {
  members: number;
  targetMembers: number;
  moqTotalUnits: number;
  lotCost: number;
  depositPercent: number;
}): RoomParticipant[] {
  try {
    const parsed = JSON.parse(rawJson || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // ignore
  }

  // Generate realistic initial participants matching room.members
  const count = Math.max(1, room.members);
  const unitsPerMember = Math.round(room.moqTotalUnits / Math.max(1, room.targetMembers));
  const costPerMember = Math.round(room.lotCost / Math.max(1, room.targetMembers));
  const depositPerMember = Math.round((costPerMember * (room.depositPercent || 30)) / 100);

  const sampleNames = [
    'คุณ (หัวหน้าห้องรวมล็อต)',
    'คุณณัฐพล (แบรนด์รายย่อย กทม.)',
    'คุณพิมพ์ชนก (สายไลฟ์สด TikTok)',
    'คุณกิตติศักดิ์ (ร้านค้าส่งเชียงใหม่)',
    'คุณอารยา (คาเฟ่ & ของชำร่วย)',
    'คุณธนกร (ตัวแทนจำหน่ายออนไลน์)',
    'คุณสิริมา (สตูดิโอแพ็กเกจจิ้ง)',
    'คุณวรเมธ (ผู้ประกอบการ SME)',
  ];

  const list: RoomParticipant[] = [];
  for (let i = 0; i < count; i++) {
    list.push({
      id: `member_${i + 1}`,
      name: sampleNames[i % sampleNames.length],
      role: i === 0 ? 'LEADER' : 'CO_BUYER',
      unitsAllocated: unitsPerMember,
      depositLockedThb: depositPerMember,
      stakedAt: new Date(Date.now() - (count - i) * 3600000 * 2).toISOString(),
    });
  }
  return list;
}

function serializeRoom(rm: any) {
  const targetMembers = Math.max(2, rm.targetMembers || 5);
  const moqTotalUnits = Math.max(10, rm.moqTotalUnits || 1000);
  const depositPercent = rm.depositPercent || 30;
  const costPerMemberThb = Math.round(rm.lotCost / targetMembers);
  const depositPerMemberThb = Math.round((costPerMemberThb * depositPercent) / 100);
  const totalDepositTargetThb = depositPerMemberThb * targetMembers;
  const unitsPerMember = Math.round(moqTotalUnits / targetMembers);

  const participants = parseParticipants(rm.participantsJson, {
    members: rm.members,
    targetMembers,
    moqTotalUnits,
    lotCost: rm.lotCost,
    depositPercent,
  });

  const calculatedEscrowLocked =
    rm.escrowLockedThb > 0
      ? rm.escrowLockedThb
      : participants.reduce((acc, p) => acc + p.depositLockedThb, 0);

  return {
    id: rm.id,
    productChainId: rm.productChainId,
    productName: rm.productName,
    modelName: rm.modelName,
    mode: rm.mode,
    members: rm.members,
    targetMembers,
    moqTotalUnits,
    unitLabel: rm.unitLabel || 'ชิ้น',
    lotCost: rm.lotCost,
    depositPercent,
    costPerMemberThb,
    depositPerMemberThb,
    totalDepositTargetThb,
    unitsPerMember,
    escrowLockedThb: calculatedEscrowLocked,
    factoryName: rm.factoryName || 'โรงงานพาร์ตเนอร์มาตรฐาน GMP/ISO (เชื่อมดอท)',
    purchaseOrderNo: rm.purchaseOrderNo,
    poIssuedAt: rm.poIssuedAt ? new Date(rm.poIssuedAt).toISOString() : null,
    linkedProjectId: rm.linkedProjectId,
    status: rm.status,
    participants,
    createdAt: rm.createdAt.getTime(),
  };
}

export async function GET() {
  try {
    await ensureProductionSeeded();
    const { user, wallet, transactions } = await getOrCreateActiveUserAndWallet();

    let rooms = await prisma.groupPoolingRoom.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    // Upgrade any legacy rooms missing factoryName or targetMembers
    for (const r of rooms) {
      if (!r.factoryName || r.escrowLockedThb === 0) {
        const target = r.targetMembers > 6 ? 5 : r.targetMembers;
        const members = Math.min(r.members, target - 1);
        const depPct = r.depositPercent || 30;
        const depPerPerson = Math.round(((r.lotCost / target) * depPct) / 100);
        const factory = r.productName.includes('กาแฟ')
          ? 'โรงคั่วกาแฟ Specialty & บรรจุซองมาตรฐาน อย. (เชียงใหม่-กทม.)'
          : r.productName.includes('สกินแคร์')
          ? 'แล็บโรงงานเวชสำอาง OEM มาตรฐาน GMP/ISO 22716'
          : r.productName.includes('เครื่องหอม')
          ? 'โรงงานเครื่องหอม & ขวดแก้วก้านไม้หวาย OEM (บางพลี-ปริมณฑล)'
          : 'โรงงานพาร์ตเนอร์มาตรฐานรับผลิต OEM (เชื่อมดอท)';

        const unitLabel = r.productName.includes('กาแฟ')
          ? 'กก.'
          : r.productName.includes('เครื่องหอม')
          ? 'เซ็ต'
          : 'ชิ้น';
        const moqUnits = r.productName.includes('กาแฟ') ? 200 : 1000;

        const parts = parseParticipants('[]', {
          members,
          targetMembers: target,
          moqTotalUnits: moqUnits,
          lotCost: r.lotCost,
          depositPercent: depPct,
        });

        await prisma.groupPoolingRoom.update({
          where: { id: r.id },
          data: {
            targetMembers: target,
            members,
            moqTotalUnits: moqUnits,
            unitLabel,
            factoryName: factory,
            escrowLockedThb: depPerPerson * members,
            participantsJson: JSON.stringify(parts),
          },
        });
      }
    }

    rooms = await prisma.groupPoolingRoom.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        userName: user.name,
        balanceThb: Math.round(wallet.balance / 100),
        lockedBalanceThb: Math.round(wallet.lockedBalance / 100),
        transactions: transactions.map((tx) => ({
          id: tx.id,
          amountThb: Math.round(tx.amount / 100),
          type: tx.type,
          status: tx.status,
          referenceId: tx.referenceId,
          createdAt: tx.createdAt.toISOString(),
        })),
      },
      rooms: rooms.map(serializeRoom),
    });
  } catch (error) {
    console.error('[GET /api/production/escrow-group] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load escrow group rooms' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureProductionSeeded();
    const { user, wallet } = await getOrCreateActiveUserAndWallet();
    const body = await req.json();
    const { action } = body;

    // -----------------------------------------------------------------
    // 1. TOP UP WALLET
    // -----------------------------------------------------------------
    if (action === 'TOP_UP_WALLET') {
      const amountThb = Math.max(1000, Number(body.amountThb) || 10000);
      const amountSatang = amountThb * 100;

      const updatedWallet = await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: amountSatang },
        },
      });

      await prisma.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          amount: amountSatang,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          referenceId: 'WALLET_TOPUP_INSTANT',
        },
      });

      return NextResponse.json({
        success: true,
        balanceThb: Math.round(updatedWallet.balance / 100),
        lockedBalanceThb: Math.round(updatedWallet.lockedBalance / 100),
        message: `เติมเงินเข้ากระเป๋าสำเร็จ +฿${amountThb.toLocaleString()}`,
      });
    }

    // -----------------------------------------------------------------
    // 2. CREATE NEW ESCROW GROUP-BUY ROOM + PUBLISH TO BOARD + STAKE DEPOSIT
    // -----------------------------------------------------------------
    if (action === 'CREATE_ESCROW_ROOM') {
      const {
        productName,
        modelName,
        mode,
        lotCost,
        targetMembers,
        moqTotalUnits,
        unitLabel,
        depositPercent,
        factoryName,
        publishToBoard = true,
        sectorOrder = 5,
      } = body;

      const cleanTargetMembers = Math.max(2, Number(targetMembers) || 5);
      const cleanLotCost = Math.max(1000, Number(lotCost) || 30000);
      const cleanMoqUnits = Math.max(10, Number(moqTotalUnits) || 1000);
      const cleanDepositPct = Math.min(100, Math.max(10, Number(depositPercent) || 30));

      const costPerMemberThb = Math.round(cleanLotCost / cleanTargetMembers);
      const depositPerMemberThb = Math.round((costPerMemberThb * cleanDepositPct) / 100);
      const depositSatang = depositPerMemberThb * 100;
      const unitsPerMember = Math.round(cleanMoqUnits / cleanTargetMembers);

      // Ensure wallet has enough balance (auto-topup if needed so demo never blocks)
      if (wallet.balance < depositSatang) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: depositSatang + 2000000 } },
        });
      }

      // Lock founder deposit in Wallet
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: depositSatang },
          lockedBalance: { increment: depositSatang },
        },
      });

      const chainRec = productName
        ? await prisma.productChain.findFirst({
            where: { productName: { contains: productName } },
          })
        : null;

      const industry = await resolveIndustryByOrder(
        chainRec?.sectorOrder || Number(sectorOrder) || 5
      );

      // Optional: Publish to Board (/board?tab=PROJECT & /board?tab=BOUNTY)
      let linkedProjectId: string | null = null;
      if (publishToBoard) {
        const createdProject = await prisma.project.create({
          data: {
            title: `[เชื่อมดอท MOQ] ${modelName} (${productName})`,
            description: `ห้องรวมกลุ่มสั่งผลิตทะลวงขั้นต่ำโรงงาน (${
              factoryName || 'โรงงาน OEM มาตรฐาน'
            }) • ยอดรวมล็อต ฿${cleanLotCost.toLocaleString()} (${cleanMoqUnits.toLocaleString()} ${
              unitLabel || 'ชิ้น'
            }) • วางมัดจำเข้า Escrow คนละ ฿${depositPerMemberThb.toLocaleString()} (${cleanDepositPct}%)`,
            industryId: industry.id,
            ownerId: user.id,
            status: 'HOT_MISSION',
            impactScale: 'LOCAL',
            budgetSatang: cleanLotCost * 100,
            fundingGoalSatang: cleanLotCost * 100,
            blueprintDotCode: 'DOT017',
            projectBlueprint: JSON.stringify({
              source: 'STEP_06_GROUP_BUY_ESCROW',
              productName,
              factoryName,
              moqTotalUnits: cleanMoqUnits,
              targetMembers: cleanTargetMembers,
              depositPercent: cleanDepositPct,
            }),
          },
        });
        linkedProjectId = createdProject.id;

        // Create ProjectMember & EscrowVault for the Project
        await prisma.projectMember.create({
          data: {
            projectId: createdProject.id,
            userId: user.id,
            role: 'OWNER',
            revSharePercentage: Math.round(10000 / cleanTargetMembers),
            status: 'ACCEPTED',
            joinedAt: new Date(),
          },
        });

        await prisma.escrowVault.create({
          data: {
            projectId: createdProject.id,
            totalAmountSatang: depositSatang,
            status: 'PENDING',
            paymentMethod: 'BANK_TRANSFER',
          },
        });

        // Also publish a Quest on /board?tab=BOUNTY so both Board tabs show it
        await prisma.problemNode.create({
          data: {
            rawDescription: `[เปิดห้องหารล็อตโรงงาน MOQ: ${productName}] ${modelName} — รับสมาชิก ${cleanTargetMembers} ท่าน (มัดจำปลอดภัยเข้า Escrow คนละ ฿${depositPerMemberThb.toLocaleString()})`,
            entityType: 'SME',
            primaryGap: 'RESOURCE_GAP',
            urgencyState: 'HOT_MISSION',
            impactScale: 'LOCAL',
            bountyType: 'HYBRID',
            bountyPrizeSatang: cleanLotCost * 100,
            bountyDescription: `รวมล็อตสั่งผลิตที่ ${factoryName || 'โรงงานพาร์ตเนอร์'}`,
            status: 'OPEN',
            originDotCode: 'DOT017',
            requesterIndustryId: industry.id,
            requesterId: user.id,
            publishedAt: new Date(),
          },
        });
      }

      const initialParticipants: RoomParticipant[] = [
        {
          id: `user_${Date.now()}`,
          name: 'คุณ (ผู้เปิดห้อง & วางมัดจำคนแรก)',
          role: 'LEADER',
          unitsAllocated: unitsPerMember,
          depositLockedThb: depositPerMemberThb,
          stakedAt: new Date().toISOString(),
        },
      ];

      const createdRoom = await prisma.groupPoolingRoom.create({
        data: {
          productChainId: chainRec?.id ?? null,
          productName: productName || 'สินค้าทั่วไป',
          modelName: modelName || 'รวมกลุ่มสั่งผลิต OEM',
          mode: mode || 'moq',
          members: 1,
          targetMembers: cleanTargetMembers,
          moqTotalUnits: cleanMoqUnits,
          unitLabel: unitLabel || 'ชิ้น',
          lotCost: cleanLotCost,
          depositPercent: cleanDepositPct,
          escrowLockedThb: depositPerMemberThb,
          factoryName: factoryName || 'โรงงานพาร์ตเนอร์มาตรฐาน GMP/ISO (เชื่อมดอท)',
          linkedProjectId,
          participantsJson: JSON.stringify(initialParticipants),
          status: 'OPEN',
        },
      });

      await prisma.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -depositSatang,
          type: 'STAKE_HOLD',
          status: 'COMPLETED',
          referenceId: createdRoom.id,
        },
      });

      const refreshedWallet = await prisma.wallet.findUnique({
        where: { id: wallet.id },
      });

      return NextResponse.json({
        success: true,
        room: serializeRoom(createdRoom),
        wallet: {
          balanceThb: Math.round((refreshedWallet?.balance || 0) / 100),
          lockedBalanceThb: Math.round((refreshedWallet?.lockedBalance || 0) / 100),
        },
        message:
          'เปิดห้องเชื่อมดอท วางเงินมัดจำเข้า Escrow และประกาศขึ้นบอร์ดสาธารณะ (/board) เรียบร้อยแล้ว!',
      });
    }

    // -----------------------------------------------------------------
    // 3. JOIN ROOM & STAKE DEPOSIT (OR SIMULATE REACHING MOQ)
    // -----------------------------------------------------------------
    if (action === 'JOIN_AND_STAKE' || action === 'SIMULATE_FILL_MOQ') {
      const { roomId, participantName } = body;
      const room = await prisma.groupPoolingRoom.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return NextResponse.json({ success: false, error: 'ไม่พบห้องรวมล็อตนี้' }, { status: 404 });
      }

      const serialized = serializeRoom(room);
      const seatsRemaining = Math.max(0, serialized.targetMembers - serialized.members);

      if (seatsRemaining === 0 && serialized.status === 'ESCROW_LOCKED_PO_SENT') {
        return NextResponse.json({
          success: true,
          room: serialized,
          alreadyCompleted: true,
          message: 'ห้องนี้รวมกลุ่มครบ MOQ และส่งใบสั่งซื้อไปยังโรงงาน OEM เรียบร้อยแล้ว',
        });
      }

      const seatsToAdd = action === 'SIMULATE_FILL_MOQ' ? Math.max(1, seatsRemaining) : 1;
      const depositPerSeatThb = serialized.depositPerMemberThb;
      const userStakeSatang = depositPerSeatThb * 100;

      // Ensure wallet has enough balance for user's stake
      if (wallet.balance < userStakeSatang) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: userStakeSatang + 2000000 } },
        });
      }

      // Deduct user's deposit share and lock in Escrow
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: userStakeSatang },
          lockedBalance: { increment: userStakeSatang },
        },
      });

      await prisma.ledgerTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -userStakeSatang,
          type: 'STAKE_HOLD',
          status: 'COMPLETED',
          referenceId: room.id,
        },
      });

      const updatedParticipants = [...serialized.participants];
      const coBuyerNames = [
        participantName || 'คุณ (ร่วมลงขัน & วางมัดจำ Escrow)',
        'คุณภัทรพล (แบรนด์อินดี้ กทม.)',
        'คุณกัญญาณัฐ (ร้านค้าออนไลน์)',
        'คุณธีรเดช (ตัวแทนจำหน่ายภาคเหนือ)',
        'คุณชลธิชา (ผู้ประกอบการรายย่อย)',
      ];

      for (let i = 0; i < seatsToAdd; i++) {
        updatedParticipants.push({
          id: `stake_${Date.now()}_${i}`,
          name: coBuyerNames[i % coBuyerNames.length],
          role: 'CO_BUYER',
          unitsAllocated: serialized.unitsPerMember,
          depositLockedThb: depositPerSeatThb,
          stakedAt: new Date().toISOString(),
        });
      }

      const newMemberCount = Math.min(
        serialized.targetMembers,
        serialized.members + seatsToAdd
      );
      const newEscrowLockedThb = updatedParticipants.reduce(
        (acc, p) => acc + p.depositLockedThb,
        0
      );

      const isMoqReached = newMemberCount >= serialized.targetMembers;
      const poNumber = isMoqReached
        ? room.purchaseOrderNo || buildPurchaseOrderNo()
        : room.purchaseOrderNo;
      const poIssuedAt = isMoqReached
        ? room.poIssuedAt || new Date()
        : room.poIssuedAt;
      const nextStatus = isMoqReached ? 'ESCROW_LOCKED_PO_SENT' : 'OPEN';

      const updatedRoom = await prisma.groupPoolingRoom.update({
        where: { id: room.id },
        data: {
          members: newMemberCount,
          escrowLockedThb: newEscrowLockedThb,
          participantsJson: JSON.stringify(updatedParticipants),
          status: nextStatus,
          purchaseOrderNo: poNumber,
          poIssuedAt,
        },
      });

      // If MOQ is reached and room is linked to a Board Project, lock its EscrowVault and activate the Project!
      if (isMoqReached && room.linkedProjectId) {
        await prisma.project
          .update({
            where: { id: room.linkedProjectId },
            data: { status: 'ACTIVE' },
          })
          .catch(() => {});

        await prisma.escrowVault
          .update({
            where: { projectId: room.linkedProjectId },
            data: {
              totalAmountSatang: Math.round(newEscrowLockedThb * 100),
              status: 'LOCKED',
            },
          })
          .catch(() => {});
      }

      const refreshedWallet = await prisma.wallet.findUnique({
        where: { id: wallet.id },
      });

      return NextResponse.json({
        success: true,
        moqJustReached: isMoqReached,
        room: serializeRoom(updatedRoom),
        wallet: {
          balanceThb: Math.round((refreshedWallet?.balance || 0) / 100),
          lockedBalanceThb: Math.round((refreshedWallet?.lockedBalance || 0) / 100),
        },
        message: isMoqReached
          ? `🎉 ครบจำนวนขั้นต่ำ (${newMemberCount}/${serialized.targetMembers} คน)! ระบบล็อกเงินมัดจำรวม ฿${newEscrowLockedThb.toLocaleString()} ในตู้เซฟ Escrow และส่งใบสั่งซื้อ ${poNumber} ไปยังโรงงาน OEM ทันที!`
          : `วางมัดจำ ฿${depositPerSeatThb.toLocaleString()} เข้าตู้เซฟ Escrow สำเร็จ (${newMemberCount}/${serialized.targetMembers} คน)`,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[POST /api/production/escrow-group] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process escrow group action' },
      { status: 500 }
    );
  }
}
