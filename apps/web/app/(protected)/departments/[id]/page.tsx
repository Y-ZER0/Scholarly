import { DepartmentDetail } from '@/features/departments/ui/department-detail/DepartmentDetail';

interface DepartmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  const { id } = await params;
  return <DepartmentDetail id={id} />;
}
