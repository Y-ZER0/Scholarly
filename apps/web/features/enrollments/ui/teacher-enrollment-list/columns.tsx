import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { formatDate } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { TeacherEnrollmentDto } from '../../dtos/teacher-enrollment.dto';

export function getTeacherEnrollmentColumns(
  onRemove: (id: string, studentName: string) => void,
): ColumnDef<TeacherEnrollmentDto>[] {
  return [
    {
      key: 'student',
      header: 'Student',
      render: (row) => (
        <UserAvatar
          name={row.student.name}
          email={row.student.email}
          photoUrl={row.student.profilePhoto}
          size="sm"
        />
      ),
    },
    {
      key: 'className',
      header: 'Class',
      render: (row) => row.className,
    },
    {
      key: 'enrolledAt',
      header: 'Enrolled At',
      render: (row) => (
        <span className="text-sm text-foreground">{formatDate(row.enrolledAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(row.id, row.student.name)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          <span className="ml-1.5">Remove</span>
        </Button>
      ),
    },
  ];
}
