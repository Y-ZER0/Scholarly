import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { ViewLink } from '@/shared/ui/components/ViewLink';
import type { DepartmentDto } from '@repo/shared';

type Subject = NonNullable<DepartmentDto['subjects']>[number];
type ClassItem = NonNullable<DepartmentDto['classes']>[number];
type User = NonNullable<DepartmentDto['teachers']>[number];

export function getSubjectColumns(router: AppRouterInstance): ColumnDef<Subject>[] {
  return [
    {
      key: 'code',
      header: 'Code',
      render: (row) => <CodeBadge code={row.code} />,
    },
    {
      key: 'name',
      header: 'Subject',
      render: (row) => (
        <button
          onClick={() => router.push(`/subjects/${row.id}`)}
          className="text-primary text-sm font-medium cursor-pointer hover:underline"
        >
          {row.name}
        </button>
      ),
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
      render: (row) => <ViewLink onClick={() => router.push(`/subjects/${row.id}`)} />,
    },
  ];
}

export function getClassColumns(router: AppRouterInstance): ColumnDef<ClassItem>[] {
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
      key: 'teacher',
      header: 'Teacher',
      render: (row) => (
        <UserAvatar
          name={row.teacher.name}
          email={row.teacher.email}
          photoUrl={row.teacher.profilePhoto}
          nameAsLink={`/faculty/${row.teacher.id}`}
        />
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

export function getUserColumns(router: AppRouterInstance, userRoute: 'faculty' | 'users' = 'faculty'): ColumnDef<User>[] {
  return [
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <UserAvatar
          name={row.name}
          email={row.email}
          photoUrl={row.profilePhoto}
          nameAsLink={`/${userRoute}/${row.id}`}
        />
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <StatusBadge status={row.role as 'teacher' | 'student'} />,
    },
    {
      key: 'details',
      header: 'Details',
      className: 'text-right',
      render: (row) => <ViewLink onClick={() => router.push(`/${userRoute}/${row.id}`)} />,
    },
  ];
}
