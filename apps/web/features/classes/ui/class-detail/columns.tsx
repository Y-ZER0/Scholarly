import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { ViewLink } from '@/shared/ui/components/ViewLink';

type Router = { push: (url: string) => void };

export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  enrolledAt: string;
}

export function getEnrolledStudentColumns(router?: Router): ColumnDef<EnrolledStudent>[] {
  return [
    {
      key: 'student',
      header: 'Student',
      render: (row) => (
        <UserAvatar
          name={row.name}
          email={row.email}
          photoUrl={row.profilePhoto}
          nameAsLink={router ? `/users/${row.id}` : undefined}
        />
      ),
    },
    {
      key: 'details',
      header: 'Details',
      className: 'text-right',
      render: (row) => router && <ViewLink onClick={() => router.push(`/users/${row.id}`)} />,
    },
  ];
}
