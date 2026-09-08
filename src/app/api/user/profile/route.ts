import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = undefined;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      // Create a unique filename
      const ext = imageFile.name.split('.').pop() || 'jpg';
      const filename = `${session.user.id}-${Date.now()}.${ext}`;
      
      // Save to public/uploads/avatars
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      
      imageUrl = `/uploads/avatars/${filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(imageUrl && { image: imageUrl }),
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
