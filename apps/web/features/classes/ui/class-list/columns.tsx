import Image from 'next/image';
import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { DepartmentChip } from '@/shared/ui/components/DepartmentChip';
import type { ClassDto } from '@repo/shared';

export function getClassListColumns(onView: (id: string) => void): ColumnDef<ClassDto>[] {
  return [
    {
      key: 'bannerImage',
      header: 'Banner',
      render: (row) =>
        row.bannerImage ? (
          <Image
            src={row.bannerImage}
            alt={row.name}
            width={32}
            height={32}
            unoptimized
            className="h-8 w-8 rounded-sm object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-sm bg-muted" />
        ),
    },
    {
      key: 'name',
      header: 'Class Name',
      render: (row) => row.name,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (row) => <DepartmentChip label={row.subject.name} />,
    },
    {
      key: 'teacher',
      header: 'Teacher',
      render: (row) => row.teacher.name,
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (row) => row.capacity,
    },
    {
      key: 'details',
      header: 'Details',
      render: (row) => (
        <button
          onClick={() => onView(row.id)}
          className="text-primary text-sm font-medium cursor-pointer hover:underline"
        >
          View
        </button>
      ),
    },
  ];
}
