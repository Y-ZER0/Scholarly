'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { PageHeader } from '@/shared/ui/components/PageHeader';
import { DataTable } from '@/shared/ui/components/DataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTeacherEnrollments } from '../../hooks/teacher/useEnrollments';
import { useTeacherClasses } from '../../hooks/teacher/useClasses';
import { useRemoveEnrollment } from '../../hooks/teacher/useRemoveEnrollment';
import { getTeacherEnrollmentColumns } from './columns';
import { AddStudentDialog } from './AddStudentDialog';

export function TeacherEnrollments() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [classId, setClassId] = useState('');
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isError } = useTeacherEnrollments({
    page,
    limit: pageSize,
    classId: classId || undefined,
    search: search || undefined,
  });

  const { data: classes } = useTeacherClasses();
  const { mutate: removeEnrollment, isPending: removePending } = useRemoveEnrollment();

  const totalPages = data?.meta.totalPages ?? 1;

  const handleRemove = useCallback((id: string, studentName: string) => {
    setRemoveTarget({ id, name: studentName });
  }, []);

  const confirmRemove = useCallback(() => {
    if (!removeTarget) return;
    removeEnrollment(removeTarget.id, {
      onSuccess: () => {
        toast.success(`${removeTarget.name} removed from class`);
        setRemoveTarget(null);
      },
      onError: (error: Error) => {
        toast.error(error?.message || 'Failed to remove student');
        setRemoveTarget(null);
      },
    });
  }, [removeTarget, removeEnrollment]);

  const columns = getTeacherEnrollmentColumns(handleRemove);

  const classFilter = (
    <Select
      value={classId || 'all'}
      onValueChange={(value) => {
        setClassId(!value || value === 'all' ? '' : value);
        setPage(1);
      }}
    >
      <SelectTrigger className="h-9 w-[180px]">
        <SelectValue>
          {classes?.find((c) => c.id === classId)?.name ?? 'All Classes'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Classes</SelectItem>
        {classes?.map((cls) => (
          <SelectItem key={cls.id} value={cls.id}>
            {cls.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Enrollments' }]} />
      <PageHeader
        title="Enrollment Management"
        description="Manage students enrolled in your classes."
        searchPlaceholder="Search by student name or email..."
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={
          <div className="flex items-center gap-2">
            {classFilter}
            <AddStudentDialog />
          </div>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No students enrolled in your classes"
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        rowKey={(row) => row.id}
      />

      <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{removeTarget?.name}</strong> from this class?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemove}
              disabled={removePending}
            >
              {removePending ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
