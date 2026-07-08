'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Layers, Users } from 'lucide-react';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { DetailPageHeader } from '@/shared/ui/components/DetailPageHeader';
import { StatCard } from '@/shared/ui/components/StatCard';
import { DataTable } from '@/shared/ui/components/DataTable';
import { ErrorBoundary } from '@/shared/ui/components/ErrorBoundary';
import { useDepartment } from '../../hooks/useDepartment';
import { getSubjectColumns, getClassColumns, getUserColumns } from './columns';

interface DepartmentDetailProps {
  id: string;
}

export function DepartmentDetail({ id }: DepartmentDetailProps) {
  const router = useRouter();
  const { data: department, isLoading, isError, refetch } = useDepartment(id);

  if (isError) {
    return (
      <div>
        <Breadcrumb
          items={[
            { label: 'Departments', href: '/departments' },
            { label: 'Show' },
          ]}
        />
        <DetailPageHeader title="Department Not Found" onBack={() => router.push('/departments')} />
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-base font-semibold text-foreground">Failed to load department</p>
          <p className="mt-1 text-sm text-muted-foreground">The department could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Department Error" fallbackMessage="Failed to render department details.">
    <div>
      <Breadcrumb
        items={[
          { label: 'Departments', href: '/departments' },
          { label: 'Show' },
        ]}
      />

      <DetailPageHeader
        title={department?.name ?? ''}
        onRefresh={() => refetch()}
        editHref={`/departments/${id}/edit`}
      />

      {/* Overview Card */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Overview</h2>
        <p className="text-sm text-muted-foreground mb-4">{department?.description}</p>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Total Subjects"
            value={department?.totalSubjects ?? 0}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <StatCard
            label="Total Classes"
            value={department?.totalClasses ?? 0}
            icon={<Layers className="h-5 w-5" />}
          />
          <StatCard
            label="Enrolled Students"
            value={department?.enrolledStudents ?? 0}
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Subjects */}
      <DataTable
        title="Subjects"
        count={department?.subjects?.length}
        columns={getSubjectColumns(router)}
        data={department?.subjects ?? []}
        isLoading={isLoading}
        showPagination={false}
        emptyMessage="No subjects in this department"
      />

      {/* Classes */}
      <div className="mt-6">
        <DataTable
          title="Classes"
          count={department?.classes?.length}
          columns={getClassColumns(router)}
          data={department?.classes ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No classes in this department"
        />
      </div>

      {/* Teachers & Students */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <DataTable
          title="Teachers"
          count={department?.teachers?.length}
          columns={getUserColumns(router)}
          data={department?.teachers ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No teachers in this department"
        />
        <DataTable
          title="Students"
          count={department?.students?.length}
          columns={getUserColumns(router, 'users')}
          data={department?.students ?? []}
          isLoading={isLoading}
          showPagination={false}
          emptyMessage="No students in this department"
        />
      </div>
    </div>
    </ErrorBoundary>
  );
}
