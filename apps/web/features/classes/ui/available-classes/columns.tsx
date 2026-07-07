import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { DepartmentChip } from '@/shared/ui/components/DepartmentChip';
import type { ClassDto } from '@repo/shared';

export function getAvailableClassColumns(
  onView: (id: string) => void,
): ColumnDef<ClassDto>[] {
  return [
    {
      key: 'name',
      header: 'Class',
      render: (row) => (
        <span className="text-sm font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (row) => (
        <div className="flex items-center gap-2">
          <CodeBadge code={row.subject.code} size="sm" />
          <span className="text-sm text-foreground">{row.subject.name}</span>
        </div>
      ),
    },
    {
      key: 'teacher',
      header: 'Teacher',
      render: (row) => row.teacher.name,
    },
    {
      key: 'spots',
      header: 'Spots',
      render: (row) => (
        <span className="text-sm text-foreground">
          {row.enrollmentCount} / {row.capacity}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'details',
      header: '',
      render: (row) => (
        <button
          onClick={() => onView(row.id)}
          className="text-primary text-sm font-medium cursor-pointer hover:underline"
        >
          View Details
        </button>
      ),
    },
  ];
}
