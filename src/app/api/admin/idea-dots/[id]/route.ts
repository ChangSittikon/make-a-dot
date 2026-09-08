import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { code, title, description, status, parentId } = await req.json();
    const updateData: Record<string, any> = { title, description, status };
    if (parentId !== undefined) updateData.parentId = parentId;
    if (code && code.trim() !== '') updateData.code = code.trim();

    const dot = await prisma.ideaDot.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(dot);
  } catch (error: any) {
    console.error('[PUT /api/admin/idea-dots]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.ideaDot.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/admin/idea-dots]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
