import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mock';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const expertRoles = ['PROFESSIONAL', 'GUARANTOR', 'DIRECTOR', 'ADMIN'];
    if (!expertRoles.includes(user.role)) {
      return NextResponse.json({ error: 'เพียงผู้เชี่ยวชาญ (Tier 2-5) เท่านั้นที่สามารถเสนออัปเกรดได้' }, { status: 403 });
    }

    const body = await req.json();
    const { vision, proposedRole } = body;

    if (!vision || !proposedRole) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // TODO: สร้าง Project/BountyUpgradeProposal ในฐานข้อมูล (รอทำใน Phase ถัดไป)
    // การจำลองการทำงานสำเร็จ
    return NextResponse.json({ 
      success: true, 
      message: 'Upgrade proposal received successfully',
      data: {
        bountyId: resolvedParams.id,
        proposerId: user.id,
        vision,
        proposedRole,
      }
    });

  } catch (error) {
    console.error('Upgrade proposal error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
