import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await req.json();

    if (!['USER', 'PROFESSIONAL', 'GUARANTOR', 'DIRECTOR', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Failed to update role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
