import apiClient from '@/shared/lib/api-client';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  DashboardStatsDto,
  DashboardChartsDto,
  DashboardRecentDto,
} from '@repo/shared';

export const dashboardService = {
  getStats: async (): Promise<DashboardStatsDto> => {
    const { data } = await apiClient.get<ApiResponse<DashboardStatsDto>>('/dashboard/stats');
    return data.data;
  },

  getCharts: async (): Promise<DashboardChartsDto> => {
    const { data } = await apiClient.get<ApiResponse<DashboardChartsDto>>('/dashboard/charts');
    return data.data;
  },

  getRecent: async (): Promise<DashboardRecentDto> => {
    const { data } = await apiClient.get<ApiResponse<DashboardRecentDto>>('/dashboard/recent');
    return data.data;
  },
};
