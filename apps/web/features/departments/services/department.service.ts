import apiClient from '@/shared/lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type { DepartmentDto } from '@repo/shared';
import type { CreateDepartmentRequestDto } from '../dtos/create-department-request.dto';
import type { UpdateDepartmentRequestDto } from '../dtos/update-department-request.dto';

interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const departmentService = {
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<DepartmentDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<DepartmentDto>>(
      '/departments',
      { params },
    );
    return data;
  },

  getById: async (id: string): Promise<DepartmentDto> => {
    const { data } = await apiClient.get<ApiResponse<DepartmentDto>>(
      `/departments/${id}`,
    );
    return data.data;
  },

  create: async (dto: CreateDepartmentRequestDto): Promise<DepartmentDto> => {
    const { data } = await apiClient.post<ApiResponse<DepartmentDto>>(
      '/departments',
      dto,
    );
    return data.data;
  },

  update: async (id: string, dto: UpdateDepartmentRequestDto): Promise<DepartmentDto> => {
    const { data } = await apiClient.patch<ApiResponse<DepartmentDto>>(
      `/departments/${id}`,
      dto,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },
};
