'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { PageHeader } from '@/shared/ui/components/PageHeader';
import { DataTable } from '@/shared/ui/components/DataTable';
import { useFaculty } from '../../hooks/useFaculty';
import { getFacultyColumns } from './columns';

export function FacultyList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useFaculty({
    page,
    limit: pageSize,
    search,
  });

  const totalPages = data?.meta.totalPages ?? 1;
  const columns = getFacultyColumns(router);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Faculty' }]} />
      <PageHeader
        title="Faculty"
        description="Browse and manage faculty members."
        searchPlaceholder="Search by name or email"
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No faculty found"
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
