import apiClient from '@/shared/lib/api-client';
import type { ApiResponse } from '@/shared/types/api.types';
import type { UserDto } from '@repo/shared';

export const userService = {
  getById: async (id: string): Promise<UserDto> => {
    const { data } = await apiClient.get<ApiResponse<UserDto>>(
      `/users/${id}`,
    );
    return data.data;
  },
};
