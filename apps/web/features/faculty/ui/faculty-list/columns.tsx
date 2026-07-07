import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import type { UserDto } from '@repo/shared';

type Router = { push: (url: string) => void };

export function getFacultyColumns(router: Router): ColumnDef<UserDto>[] {
  return [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <UserAvatar
          name={row.name}
          photoUrl={row.profilePhoto}
          nameAsLink={`/faculty/${row.id}`}
        />
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => row.email,
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <StatusBadge status="teacher" />,
    },
    {
      key: 'details',
      header: 'Details',
      className: 'text-right',
      render: (row) => (
        <button
          onClick={() => router.push(`/faculty/${row.id}`)}
          className="text-primary text-sm font-medium cursor-pointer hover:underline"
        >
          View
        </button>
      ),
    },
  ];
}
