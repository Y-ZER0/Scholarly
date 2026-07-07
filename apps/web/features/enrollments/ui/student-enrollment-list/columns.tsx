import Image from 'next/image';
import type { ColumnDef } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { formatDate } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import type { EnrollmentDto } from '@repo/shared';

export function getStudentEnrollmentColumns(
  onView: (classId: string) => void,
  onUnenroll: (id: string, className: string) => void,
): ColumnDef<EnrollmentDto>[] {
  return [
    {
      key: 'class',
      header: 'Class',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          {row.class.bannerImage ? (
            <Image
              src={row.class.bannerImage}
              alt={row.class.name}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-sm object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-sm bg-muted" />
          )}
          <span className="text-sm font-medium text-foreground">{row.class.name}</span>
        </div>
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row.classId)}
            className="text-primary hover:text-primary hover:bg-primary/10"
          >
            <Eye className="h-4 w-4" />
            <span className="ml-1.5">View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUnenroll(row.id, row.class.name)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-1.5">Unenroll</span>
          </Button>
        </div>
      ),
    },
  ];
}
