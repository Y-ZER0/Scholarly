'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useClasses } from '../../hooks/useClasses';
import { useSubjects } from '@/features/subjects/hooks/useSubjects';
import { useFaculty } from '@/features/faculty/hooks/useFaculty';
import { getClassListColumns } from './columns';

export function ClassList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [teacherId, setTeacherId] = useState<string>('');

  const { data, isLoading, isError } = useClasses({
    page,
    limit: pageSize,
    search,
    subjectId: subjectId || undefined,
    teacherId: teacherId || undefined,
  });

  const { data: subjectsData } = useSubjects({ page: 1, limit: 100 });
  const { data: facultyData } = useFaculty({ page: 1, limit: 100 });

  const subjects = subjectsData?.data ?? [];
  const teachers = facultyData?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const columns = getClassListColumns((id) => router.push(`/classes/${id}`));

  const filters = (
    <div className="flex items-center gap-2">
      <Select
        value={subjectId}
        onValueChange={(value) => {
          setSubjectId(!value || value === 'all' ? '' : value);
          setPage(1);
        }}
      >
        <SelectTrigger className="h-9 w-[160px]">
          <SelectValue placeholder="All Subjects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.id}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={teacherId}
        onValueChange={(value) => {
          setTeacherId(!value || value === 'all' ? '' : value);
          setPage(1);
        }}
      >
        <SelectTrigger className="h-9 w-[160px]">
          <SelectValue placeholder="All Teachers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teachers</SelectItem>
          {teachers.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Classes' }]} />
      <PageHeader
        title="Classes"
        description="Quick access to essential metrics and management tools."
        searchPlaceholder="Search by name..."
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        filters={filters}
        createHref="/classes/create"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No classes found"
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
