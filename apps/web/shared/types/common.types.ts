export interface PaginationState {
  page: number;
  limit: number;
}

export interface FilterState {
  search?: string;
  [key: string]: string | number | undefined;
}
