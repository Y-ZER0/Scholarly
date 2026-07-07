'use client';
import apiClient from '@/shared/lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type { SubjectDto } from '@repo/shared';
import type { CreateSubjectRequestDto } from '../dtos/create-subject-request.dto';
import type { UpdateSubjectRequestDto } from '../dtos/update-subject-request.dto';

interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
}

export const subjectService = {
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<SubjectDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<SubjectDto>>(
      '/subjects',
      { params },
    );
    return data;
  },

  getById: async (id: string): Promise<SubjectDto> => {
    const { data } = await apiClient.get<ApiResponse<SubjectDto>>(
      `/subjects/${id}`,
    );
    return data.data;
  },

  create: async (dto: CreateSubjectRequestDto): Promise<SubjectDto> => {
    const { data } = await apiClient.post<ApiResponse<SubjectDto>>(
      '/subjects',
      dto,
    );
    return data.data;
  },

  update: async (id: string, dto: UpdateSubjectRequestDto): Promise<SubjectDto> => {
    const { data } = await apiClient.patch<ApiResponse<SubjectDto>>(
      `/subjects/${id}`,
      dto,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/subjects/${id}`);
  },
};
