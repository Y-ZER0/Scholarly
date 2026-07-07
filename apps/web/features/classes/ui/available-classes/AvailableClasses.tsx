'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/shared/ui/components/Breadcrumb';
import { PageHeader } from '@/shared/ui/components/PageHeader';
import { DataTable } from '@/shared/ui/components/DataTable';
import { useAvailableClasses } from '../../hooks/useAvailableClasses';
import { getAvailableClassColumns } from './columns';

export function AvailableClasses() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useAvailableClasses({
    page,
    limit: pageSize,
    search: search || undefined,
  });

  const totalPages = data?.meta.totalPages ?? 1;

  const handleView = useCallback((id: string) => {
    router.push(`/classes/${id}`);
  }, [router]);

  const columns = getAvailableClassColumns(handleView);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Classes', href: '/classes' },
          { label: 'Available' },
        ]}
      />
      <PageHeader
        title="Available Classes"
        description="Browse classes with open spots remaining."
        searchPlaceholder="Search by class name..."
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
        emptyMessage="No classes with open spots at this time."
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
