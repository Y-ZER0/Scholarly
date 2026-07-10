'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { PageHeader } from '@/shared/ui/components/PageHeader';
import { DataTable, type ColumnDef } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { DepartmentChip } from '@/shared/ui/components/DepartmentChip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubjects } from '../../hooks/useSubjects';
import { useDepartments } from '@/shared/hooks/useDepartments';
import { useAuth } from '@/shared/context/AuthContext';
import type { SubjectDto } from '@repo/shared';

export function SubjectList() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState<string>('');

  const { data, isLoading, isError } = useSubjects({
    page,
    limit: pageSize,
    search,
    departmentId: departmentId || undefined,
  });

  const { data: departmentsData } = useDepartments({ page: 1, limit: 100 });

  const departments = departmentsData?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const handleView = useCallback(
    (id: string) => {
      router.push(`/subjects/${id}`);
    },
    [router]
  );

  const columns: ColumnDef<SubjectDto>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (row) => <CodeBadge code={row.code} />,
    },
    {
      key: 'name',
      header: 'Name',
      render: (row) => row.name,
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => <DepartmentChip label={row.department.name} />,
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => row.description,
    },
    {
      key: 'details',
      header: 'Details',
      render: (row) => (
        <button
          onClick={() => handleView(row.id)}
          className="text-primary text-sm font-medium cursor-pointer hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  const departmentFilter = (() => {
    const selectedDept = departments.find((d) => d.id === departmentId);
    const displayLabel = selectedDept?.name ?? 'All Departments';

    return (
      <Select
        value={departmentId || 'all'}
        onValueChange={(value) => {
          setDepartmentId(!value || value === 'all' ? '' : value);
          setPage(1);
        }}
      >
        <SelectTrigger className="h-9 w-[160px]">
          <SelectValue>{displayLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  })();

  return (
    <div>
      <Breadcrumb items={[{ label: 'Subjects' }]} />
      <PageHeader
        title="Subjects"
        description="Quick access to essential metrics and management tools."
        searchPlaceholder="Search by name..."
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={departmentFilter}
        createHref={currentUser?.role !== 'student' ? '/subjects/create' : undefined}
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No subjects found"
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
    </div>
  );
}
