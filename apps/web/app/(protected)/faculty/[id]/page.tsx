import { FacultyDetail } from '@/features/faculty/ui/faculty-detail/FacultyDetail';

interface FacultyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FacultyDetailPage({ params }: FacultyDetailPageProps) {
  const { id } = await params;
  return <FacultyDetail id={id} />;
}
