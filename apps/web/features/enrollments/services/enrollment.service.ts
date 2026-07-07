import apiClient from '@/shared/lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type { EnrollmentDto } from '@repo/shared';
import type { JoinClassRequestDto } from '../dtos/join-class-request.dto';
import type { AddStudentRequestDto } from '../dtos/add-student-request.dto';
import type { TeacherEnrollmentDto, TeacherClassDto } from '../dtos/teacher-enrollment.dto';

export const enrollmentService = {
  getTeacherEnrollments: async (params: {
    page?: number;
    limit?: number;
    classId?: string;
    search?: string;
  }): Promise<PaginatedResponse<TeacherEnrollmentDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<TeacherEnrollmentDto>>(
      '/enrollments/teacher',
      { params },
    );
    return data;
  },

  getTeacherClasses: async (): Promise<TeacherClassDto[]> => {
    const { data } = await apiClient.get<ApiResponse<TeacherClassDto[]>>(
      '/enrollments/teacher/classes',
    );
    return data.data;
  },

  addStudent: async (dto: AddStudentRequestDto): Promise<TeacherEnrollmentDto> => {
    const { data } = await apiClient.post<ApiResponse<TeacherEnrollmentDto>>(
      '/enrollments/teacher/add',
      dto,
    );
    return data.data;
  },

  removeEnrollment: async (id: string): Promise<void> => {
    await apiClient.delete(`/enrollments/teacher/${id}`);
  },

  getMyEnrollments: async (params: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<EnrollmentDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<EnrollmentDto>>(
      '/enrollments',
      { params },
    );
    return data;
  },

  joinClass: async (dto: JoinClassRequestDto): Promise<EnrollmentDto> => {
    const { data } = await apiClient.post<ApiResponse<EnrollmentDto>>(
      '/enrollments/join',
      dto,
    );
    return data.data;
  },

  unenroll: async (id: string): Promise<void> => {
    await apiClient.delete(`/enrollments/${id}`);
  },

  getClassEnrollments: async (
    classId: string,
  ): Promise<{ data: { id: string; name: string; email: string; profilePhoto?: string; enrolledAt: string }[]; total: number }> => {
    const { data } = await apiClient.get<{ success: boolean; data: { id: string; name: string; email: string; profilePhoto?: string; enrolledAt: string }[]; total: number }>(
      `/enrollments/class/${classId}`,
    );
    return { data: data.data, total: data.total };
  },
};
