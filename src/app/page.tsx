import { FlowApp } from '@/components/flow/FlowApp';
import AuthButton from "@/components/AuthButton";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();

  return (
    <FlowApp session={session}>
      <AuthButton session={session} />
    </FlowApp>
  );
}
