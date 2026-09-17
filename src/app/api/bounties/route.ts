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
      bountyPrize, 
      workTypeId,
      occupationId,
      skillTags,
      resourceType,
      resourceAmount
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
    const connectWorkType = workTypeId ? { connect: { id: workTypeId } } : undefined;
    const connectOccupation = occupationId ? { connect: { id: occupationId } } : undefined;
    
    const problemSkillTags = skillTags && skillTags.length > 0 ? {
      create: skillTags.map((tagId: string) => ({
        skillTag: { connect: { id: tagId } }
      }))
    } : undefined;

    // Combine title and description for rawDescription
    const rawDesc = `${title}\n\n${description}`;

    // Create ProblemNode
    const problemNode = await prisma.problemNode.create({
      data: {
        rawDescription: rawDesc || 'Untitled Quest',
        entityType: 'ENTERPRISE',
        primaryGap: 'SKILL_GAP',
        bountyPrizeSatang: Math.floor((parseFloat(bountyPrize) || 0) * 100),
        bountyType: resourceType === 'CASH' ? 'CASH' : (resourceType === 'EQUITY' ? 'EQUITY' : 'RESOURCE_SWAP'),
        status: 'OPEN',
        urgencyState: 'HOT_MISSION',
        requesterId: user.id,
        workType: connectWorkType,
        occupation: connectOccupation,
        problemSkills: problemSkillTags
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
