'use client';

import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { DetailPageHeader } from '@/shared/ui/components/DetailPageHeader';
import { DataTable } from '@/shared/ui/components/DataTable';
import { StatusBadge } from '@/shared/ui/components/StatusBadge';
import { UserAvatar } from '@/shared/ui/components/UserAvatar';
import { ErrorBoundary } from '@/shared/ui/components/ErrorBoundary';
import { useFacultyMember } from '../../hooks/useFacultyMember';
import { getDepartmentColumns, getSubjectColumns, getClassColumns } from './columns';

interface FacultyDetailProps {
  id: string;
}

export function FacultyDetail({ id }: FacultyDetailProps) {
  const router = useRouter();
  const { data: faculty, isLoading, isError, refetch } = useFacultyMember(id);

  if (isError) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: 'Faculty', href: '/faculty' },
            { label: 'Show' },
          ]}
        />
        <DetailPageHeader title="Faculty Not Found" onBack={() => router.push('/faculty')} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-base font-semibold text-foreground">Failed to load faculty member</p>
          <p className="mt-1 text-sm text-muted-foreground">The faculty member could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Faculty Error" fallbackMessage="Failed to render faculty details.">
    <div>
      <Breadcrumb
        items={[
          { label: 'Faculty', href: '/faculty' },
          { label: 'Show' },
        ]}
      />

      <DetailPageHeader
        title={faculty?.name ?? ''}
        onRefresh={() => refetch()}
        editHref={`/faculty/${id}/edit`}
      />

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-semibold text-foreground">Profile</h2>
          <StatusBadge status="teacher" />
        </div>
        <div className="mt-4">
          <UserAvatar
            name={faculty?.name ?? ''}
            email={faculty?.email}
            photoUrl={faculty?.profilePhoto}
            size="md"
          />
        </div>
      </div>

      {/* Departments */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Departments</h2>
        </div>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Departments tied to {faculty?.name ?? 'this faculty'} based on classes and enrollments.
        </p>
        <DataTable
          columns={getDepartmentColumns(router)}
          data={faculty?.departments ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No data to display"
        />
      </div>

      {/* Subjects */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Subjects</h2>
        </div>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Subjects associated with {faculty?.name ?? 'this faculty'} in this term.
        </p>
        <DataTable
          columns={getSubjectColumns(router)}
          data={faculty?.subjects ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No data to display"
        />
      </div>

      {/* Classes */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Classes</h2>
        </div>
        <DataTable
          columns={getClassColumns(router)}
          data={faculty?.classes ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No data to display"
        />
      </div>
    </div>
    </ErrorBoundary>
  );
}
