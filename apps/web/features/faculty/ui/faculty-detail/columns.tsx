import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { ViewLink } from '@/shared/ui/components/ViewLink';
import type { FacultyDetailDto } from '@repo/shared';

type Router = { push: (url: string) => void };

type Department = FacultyDetailDto['departments'][number];
type Subject = FacultyDetailDto['subjects'][number];
type ClassItem = FacultyDetailDto['classes'][number];

export function getDepartmentColumns(router: Router): ColumnDef<Department>[] {
  return [
    {
      key: 'code',
      header: 'Code',
      render: (row) => <CodeBadge code={row.code} />,
    },
    {
      key: 'name',
      header: 'Department',
      render: (row) => row.name,
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => row.description,
    },
    {
      key: 'details',
      header: 'Details',
      className: 'text-right',
      render: (row) => <ViewLink onClick={() => router.push(`/departments/${row.id}`)} />,
    },
  ];
}

export function getSubjectColumns(router: Router): ColumnDef<Subject>[] {
  return [
    {
      key: 'code',
      header: 'Code',
      render: (row) => <CodeBadge code={row.code} />,
    },
    {
      key: 'name',
      header: 'Subject',
      render: (row) => row.name,
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => `${row.department.name} (${row.department.code})`,
    },
    {
      key: 'details',
      header: 'Details',
      className: 'text-right',
      render: (row) => <ViewLink onClick={() => router.push(`/subjects/${row.id}`)} />,
    },
  ];
}

export function getClassColumns(router: Router): ColumnDef<ClassItem>[] {
  return [
    {
      key: 'name',
      header: 'Class',
      render: (row) => (
        <button
          onClick={() => router.push(`/classes/${row.id}`)}
          className="text-primary text-sm font-medium cursor-pointer hover:underline"
        >
          {row.name}
        </button>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (row) => (
        <span className="text-sm text-foreground">
          {row.subject.name} (<CodeBadge code={row.subject.code} size="sm" />)
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status as 'active' | 'inactive'} />,
    },
    {
      key: 'details',
      header: 'Details',
      className: 'text-right',
      render: (row) => <ViewLink onClick={() => router.push(`/classes/${row.id}`)} />,
    },
  ];
}
