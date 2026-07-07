'use client';

import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { DetailPageHeader } from '@/shared/ui/components/DetailPageHeader';
import { DataTable } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { useSubject } from '../../hooks/useSubject';
import { getClassColumns, getUserColumns } from './columns';

interface SubjectDetailProps {
  id: string;
}

export function SubjectDetail({ id }: SubjectDetailProps) {
  const router = useRouter();
  const { data: subject, isLoading, isError, refetch } = useSubject(id);

  if (isError) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: 'Subjects', href: '/subjects' },
            { label: 'Show' },
          ]}
        />
        <DetailPageHeader title="Subject Not Found" onBack={() => router.push('/subjects')} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-base font-semibold text-foreground">Failed to load subject</p>
          <p className="mt-1 text-sm text-muted-foreground">The subject could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Subjects', href: '/subjects' },
          { label: 'Show' },
        ]}
      />

      <DetailPageHeader
        title={subject?.name ?? ''}
        onRefresh={() => refetch()}
        editHref={`/subjects/${id}/edit`}
      />

      {/* Subject Overview Card */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">Subject Overview</h2>
            <p className="text-sm text-muted-foreground">{subject?.description}</p>
          </div>
          {subject?.code && <CodeBadge code={subject.code} />}
        </div>
      </div>

      {/* Department Card */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-2">Department</h2>
        <p className="text-sm font-semibold text-foreground mb-1">{subject?.department?.name}</p>
        <p className="text-sm text-muted-foreground">{subject?.department?.description}</p>
      </div>

      {/* Classes */}
      <DataTable
        title="Classes"
        count={subject?.classes?.length}
        columns={getClassColumns(router)}
        data={subject?.classes ?? []}
        isLoading={isLoading}
        showPagination={false}
        emptyMessage="No classes for this subject"
      />

      {/* Teachers & Students */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <DataTable
          title="Teachers"
          count={subject?.teachers?.length}
          columns={getUserColumns(router)}
          data={subject?.teachers ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No teachers for this subject"
        />
        <DataTable
          title="Students"
          count={subject?.students?.length}
          columns={getUserColumns(router, 'users')}
          data={subject?.students ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No students for this subject"
        />
      </div>
    </div>
  );
}
