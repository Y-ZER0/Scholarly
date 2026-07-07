'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { PageHeader } from '@/shared/ui/components/PageHeader';
import { DataTable } from '@/shared/ui/components/DataTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useMyEnrollments } from '../../hooks/student/useMyEnrollments';
import { useUnenroll } from '../../hooks/student/useUnenroll';
import { getStudentEnrollmentColumns } from './columns';

export function StudentEnrollments() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [unenrollTarget, setUnenrollTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isError } = useMyEnrollments({ page, limit: pageSize });
  const { mutate: unenroll, isPending: unenrollPending } = useUnenroll();

  const totalPages = data?.meta.totalPages ?? 1;

  const handleView = useCallback((classId: string) => {
    router.push(`/classes/${classId}`);
  }, [router]);

  const handleUnenroll = useCallback((id: string, className: string) => {
    setUnenrollTarget({ id, name: className });
  }, []);

  const confirmUnenroll = useCallback(() => {
    if (!unenrollTarget) return;
    unenroll(unenrollTarget.id, {
      onSuccess: () => {
        toast.success(`Unenrolled from ${unenrollTarget.name}`);
        setUnenrollTarget(null);
      },
      onError: (error: Error) => {
        toast.error(error?.message || 'Failed to unenroll');
        setUnenrollTarget(null);
      },
    });
  }, [unenrollTarget, unenroll]);

  const columns = getStudentEnrollmentColumns(handleView, handleUnenroll);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Enrollments' }]} />
      <PageHeader
        title="My Enrollments"
        description="Classes you're currently enrolled in."
        filters={
          <Link href="/classes/available">
            <Button variant="outline" className="h-9 border-primary text-primary hover:bg-primary/10">
              Browse Classes
            </Button>
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="You haven't joined any classes yet."
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

      <Dialog open={!!unenrollTarget} onOpenChange={(open) => !open && setUnenrollTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unenroll from Class</DialogTitle>
            <DialogDescription>
              Are you sure you want to unenroll from <strong>{unenrollTarget?.name}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setUnenrollTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmUnenroll}
              disabled={unenrollPending}
            >
              {unenrollPending ? 'Unenrolling...' : 'Unenroll'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
