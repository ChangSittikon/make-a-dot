import { redirect } from 'next/navigation';

interface QuestAliasPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ ref?: string; [key: string]: string | string[] | undefined }>;
}

export default async function QuestAliasPage({
  params,
  searchParams,
}: QuestAliasPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const ref = resolvedSearchParams?.ref;
  const query = ref ? `?ref=${encodeURIComponent(ref)}` : '';
  redirect(`/profile/bounty/${id}${query}`);
}
