import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Extract data
    const { 
      title, 
      description, 
      rawDescription,
      bountyPrize, 
      workTypeId,
      occupationId,
      skillTags,
      resourceType,
      resourceAmount,
      entityType,
      primaryGap,
      urgencyState
    } = body;

    // Get a fallback user for requesterId
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Visionary User',
          email: 'visionary@makeadot.com',
          role: 'ADMIN'
        }
      });
    }

    // Prepare connection objects
    
    const problemSkillTags = skillTags && skillTags.length > 0 ? {
      create: skillTags.map((tagId: string) => ({
        skillTag: { connect: { id: tagId } }
      }))
    } : undefined;

    // Combine title and description for rawDescription
    const effectiveRawDesc = rawDescription || (title && description ? `${title}\n\n${description}` : (title || description || 'Untitled Quest'));
    const effectiveTitle = title || (rawDescription ? rawDescription.substring(0, 50) : 'Untitled Quest');

    // Create ProblemNode
    const problemNode = await prisma.problemNode.create({
      data: {
        rawDescription: effectiveRawDesc,
        bountyDescription: effectiveTitle,
        entityType: entityType || 'ENTERPRISE',
        primaryGap: primaryGap || 'SKILL_GAP',
        bountyPrizeSatang: Math.floor((parseFloat(bountyPrize) || 0) * 100),
        bountyType: resourceType === 'CASH' ? 'CASH' : (resourceType === 'EQUITY' ? 'EQUITY' : 'RESOURCE_SWAP'),
        status: 'OPEN',
        urgencyState: urgencyState || 'HOT_MISSION',
        requesterId: user.id,
        workTypeId: workTypeId || undefined,
        occupationId: occupationId || undefined,
        requiredSkills: problemSkillTags
      }
    });

    // Create ProjectResource (Pledge)
    if (resourceType && resourceAmount) {
      await prisma.projectResource.create({
        data: {
          problemNodeId: problemNode.id,
          providerUserId: user.id,
          resourceType: resourceType,
          description: `Pledged resource for ${title}`,
          amountValue: parseFloat(resourceAmount) || 0,
          unit: resourceType === 'CASH' ? 'THB' : 'Unit',
          status: 'PLEDGED'
        }
      });
    }

    return NextResponse.json({ success: true, problemNodeId: problemNode.id });

  } catch (error) {
    console.error('Failed to create bounty:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bounties = await prisma.problemNode.findMany({
      where: {
        status: 'OPEN',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        occupation: true,
        resources: true,
        requiredSkills: {
          include: {
            skillTag: true
          }
        },
        requester: {
          select: { name: true, image: true }
        }
      }
    });

    return NextResponse.json({ success: true, bounties });
  } catch (error) {
    console.error('Failed to fetch bounties:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
