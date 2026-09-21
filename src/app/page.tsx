import { FlowApp } from '@/components/flow/FlowApp';
import AuthButton from "@/components/AuthButton";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();

  const industry = await prisma.industry.findFirst({
    where: { parentId: null },
    select: {
      id: true,
      name: true,
      domainDirector: {
        select: {
          displayName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { order: "asc" },
  });

  let nodes: any[] = [];
  if (industry) {
    nodes = await prisma.node.findMany({
      where: { industryId: industry.id },
      include: {
        options: {
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" }
    });
  }

  return (
    <FlowApp 
      session={session}
      initialIndustry={industry}
      initialNodes={nodes}
    >
      <AuthButton session={session} />
    </FlowApp>
  );
}
