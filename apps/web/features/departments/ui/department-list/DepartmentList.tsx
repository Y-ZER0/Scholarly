'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/shared/ui/components/PageHeader';
import { DataTable, type ColumnDef } from '@/shared/ui/components/DataTable';
import { CodeBadge } from '@/shared/ui/components/CodeBadge';
import { useDepartments } from '../../hooks/useDepartments';
import { useAuth } from '@/shared/context/AuthContext';
import type { DepartmentDto } from '@repo/shared';

export function DepartmentList() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useDepartments({
    page,
    limit: pageSize,
    search,
  });

  const totalPages = data?.meta.totalPages ?? 1;

  const handleView = useCallback(
    (id: string) => {
      router.push(`/departments/${id}`);
    },
    [router]
  );

  const columns: ColumnDef<DepartmentDto>[] = [
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
      key: 'subjects',
      header: 'Subjects',
      render: (row) => row.totalSubjects ?? 0,
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => row.description,
    },
    {
      key: 'details',
      header: 'Details',
      className: 'text-right',
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

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Quick access to essential metrics and management tools."
        searchPlaceholder="Search by name or code"
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        createHref={currentUser?.role !== 'student' ? '/departments/create' : undefined}
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No departments found"
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
