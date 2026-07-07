import apiClient from '@/shared/lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type { FacultyDetailDto, UserDto } from '@repo/shared';

interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const facultyService = {
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<UserDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<UserDto>>(
      '/faculty',
      { params },
    );
    return data;
  },

  getById: async (id: string): Promise<FacultyDetailDto> => {
    const { data } = await apiClient.get<ApiResponse<FacultyDetailDto>>(
      `/faculty/${id}`,
    );
    return data.data;
  },
};
