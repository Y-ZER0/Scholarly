import { EditDepartmentForm } from '@/features/departments/ui/edit-department/EditDepartmentForm';

interface EditDepartmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDepartmentPage({ params }: EditDepartmentPageProps) {
  const { id } = await params;
  return <EditDepartmentForm id={id} />;
}
