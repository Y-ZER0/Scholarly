'use client';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import { dashboardKeys } from './dashboardKeys';

export function useDashboardRecent() {
  return useQuery({
    queryKey: dashboardKeys.recent(),
    queryFn: () => dashboardService.getRecent(),
    staleTime: 60_000,
  });
}
