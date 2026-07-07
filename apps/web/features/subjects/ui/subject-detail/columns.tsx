import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { ViewLink } from '@/shared/ui/components/ViewLink';
import type { SubjectDto } from '@repo/shared';

type Router = { push: (url: string) => void };

type ClassItem = NonNullable<SubjectDto['classes']>[number];
type User = NonNullable<SubjectDto['teachers']>[number];

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

export function getUserColumns(router: Router, userRoute: 'faculty' | 'users' = 'faculty'): ColumnDef<User>[] {
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
