import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const workTypes = await prisma.workType.findMany({
      orderBy: { name: 'asc' }
    });

    const industries = await prisma.industry.findMany({
      orderBy: [ { order: 'asc' }, { name: 'asc' } ],
      include: {
        occupations: {
          orderBy: [ { order: 'asc' }, { name: 'asc' } ],
          include: {
            skillTags: {
              orderBy: { name: 'asc' }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      workTypes,
      industries
    });
  } catch (error) {
    console.error('Failed to fetch taxonomy:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}
