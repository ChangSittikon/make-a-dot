import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dots = await prisma.ideaDot.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(dots);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { code, title, description, status, parentId } = await req.json();
    
    // Auto-generate a code if not provided
    let finalCode = code;
    if (!finalCode) {
      const count = await prisma.ideaDot.count();
      finalCode = `DOT${String(count + 1).padStart(3, '0')}`;
    }

    const dot = await prisma.ideaDot.create({
      data: {
        code: finalCode,
        title,
        description,
        status: status || 'DRAFT',
        parentId: parentId || null
      }
    });
    return NextResponse.json(dot);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
