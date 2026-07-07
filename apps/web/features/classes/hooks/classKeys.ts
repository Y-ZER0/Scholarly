export const classKeys = {
  all: () => ['classes'] as const,
  lists: () => [...classKeys.all(), 'list'] as const,
  list: (f: { page: number; limit: number; search?: string; subjectId?: string; teacherId?: string; status?: string }) =>
    [...classKeys.lists(), f] as const,
  details: () => [...classKeys.all(), 'detail'] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
  availableLists: () => [...classKeys.all(), 'available', 'list'] as const,
  availableList: (f: { page: number; limit: number; search?: string }) =>
    [...classKeys.availableLists(), f] as const,
};
