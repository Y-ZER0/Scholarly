export const facultyKeys = {
  all: () => ['faculty'] as const,
  lists: () => [...facultyKeys.all(), 'list'] as const,
  list: (f: { page: number; limit: number; search?: string }) =>
    [...facultyKeys.lists(), f] as const,
  details: () => [...facultyKeys.all(), 'detail'] as const,
  detail: (id: string) => [...facultyKeys.details(), id] as const,
};
