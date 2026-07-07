export const departmentKeys = {
  all: () => ['departments'] as const,
  lists: () => [...departmentKeys.all(), 'list'] as const,
  list: (f: { page: number; limit: number; search?: string }) =>
    [...departmentKeys.lists(), f] as const,
  details: () => [...departmentKeys.all(), 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};
