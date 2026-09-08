import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Secure the route
async function isAdmin() {
  const session = await auth();
  if (!session?.user?.id) return false;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === 'ADMIN';
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find or create global config
  let config = await prisma.systemConfig.findUnique({
    where: { id: "GLOBAL" }
  });

  if (!config) {
    config = await prisma.systemConfig.create({
      data: {
        id: "GLOBAL",
        primaryModel: "models/gemini-3.8-flash",
        fallbackModels: "models/gemini-3.7-flash,models/deep-research-preview-04-2026",
        aiEnabled: true,
        autoFallback: true
      }
    });
  }

  // We do not store the API Key in the database for security reasons.
  // It is pulled from process.env.GOOGLE_GENERATIVE_AI_API_KEY
  return NextResponse.json({
    ...config,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
  });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    const updated = await prisma.systemConfig.upsert({
      where: { id: "GLOBAL" },
      update: {
        primaryModel: data.primaryModel,
        fallbackModels: data.fallbackModels,
        aiEnabled: data.aiEnabled,
        autoFallback: data.autoFallback,
      },
      create: {
        id: "GLOBAL",
        primaryModel: data.primaryModel,
        fallbackModels: data.fallbackModels,
        aiEnabled: data.aiEnabled,
        autoFallback: data.autoFallback,
      }
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    console.error("Failed to update AI config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
