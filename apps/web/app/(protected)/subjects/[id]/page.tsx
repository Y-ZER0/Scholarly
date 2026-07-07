import { SubjectDetail } from '@/features/subjects/ui/subject-detail/SubjectDetail';

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubjectDetail id={id} />;
}
