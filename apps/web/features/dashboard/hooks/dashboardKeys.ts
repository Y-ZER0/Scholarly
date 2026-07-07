export const dashboardKeys = {
  all: () => ['dashboard'] as const,
  stats: () => [...dashboardKeys.all(), 'stats'] as const,
  charts: () => [...dashboardKeys.all(), 'charts'] as const,
  recent: () => [...dashboardKeys.all(), 'recent'] as const,
};
