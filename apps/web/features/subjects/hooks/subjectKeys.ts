export const subjectKeys = {
  all: () => ['subjects'] as const,
  lists: () => [...subjectKeys.all(), 'list'] as const,
  list: (f: { page: number; limit: number; search?: string; departmentId?: string }) =>
    [...subjectKeys.lists(), f] as const,
  details: () => [...subjectKeys.all(), 'detail'] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
};
