import apiClient from '@/shared/lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type { ClassDto } from '@repo/shared';
import type { CreateClassRequestDto } from '../dtos/create-class-request.dto';
import type { UpdateClassRequestDto } from '../dtos/update-class-request.dto';

interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
  subjectId?: string;
  teacherId?: string;
  status?: string;
}

export const classService = {
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<ClassDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<ClassDto>>(
      '/classes',
      { params },
    );
    return data;
  },

  getById: async (id: string): Promise<ClassDto> => {
    const { data } = await apiClient.get<ApiResponse<ClassDto>>(
      `/classes/${id}`,
    );
    return data.data;
  },

  create: async (dto: CreateClassRequestDto): Promise<ClassDto> => {
    const { data } = await apiClient.post<ApiResponse<ClassDto>>(
      '/classes',
      dto,
    );
    return data.data;
  },

  update: async (id: string, dto: UpdateClassRequestDto): Promise<ClassDto> => {
    const { data } = await apiClient.patch<ApiResponse<ClassDto>>(
      `/classes/${id}`,
      dto,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },

  getAvailableClasses: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<PaginatedResponse<ClassDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<ClassDto>>(
      '/classes/available',
      { params },
    );
    return data;
  },
};
