'use client';

import { Users, GraduationCap, Shield, BookOpen, Building2, Layers } from 'lucide-react';
import { StatCard } from '@/shared/ui/components/StatCard';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { UsersByRoleChart } from './UsersByRoleChart';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useDashboardCharts } from '../hooks/useDashboardCharts';
import { useDashboardRecent } from '../hooks/useDashboardRecent';

const STAT_CONFIG = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, iconColor: 'text-blue-400' },
  { key: 'teachers', label: 'Teachers', icon: GraduationCap, iconColor: 'text-primary' },
  { key: 'admins', label: 'Admins', icon: Shield, iconColor: 'text-orange-400' },
  { key: 'subjects', label: 'Subjects', icon: BookOpen, iconColor: 'text-purple-400' },
  { key: 'departments', label: 'Departments', icon: Building2, iconColor: 'text-teal-400' },
  { key: 'classes', label: 'Classes', icon: Layers, iconColor: 'text-rose-400' },
] as const;

export function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts();
  const { data: recent, isLoading: recentLoading } = useDashboardRecent();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAT_CONFIG.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={statsLoading ? '\u2014' : (stats?.[stat.key] ?? 0)}
              icon={<stat.icon className="h-5 w-5" />}
              iconColor={stat.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Two-column: Donut chart + Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut chart - takes 2 columns */}
        <div className="lg:col-span-2">
          {chartsLoading ? (
            <div className="bg-card border border-border rounded-lg p-5 h-[380px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <UsersByRoleChart data={charts?.usersByRole ?? []} />
          )}
        </div>

        {/* Summary cards - stacked vertically */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-base font-semibold text-foreground">New Classes (last 5)</h3>
            <p className="text-3xl font-bold text-foreground mt-2">
              {recentLoading ? '\u2014' : (recent?.newestClasses.length ?? 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Most recent classes added</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-base font-semibold text-foreground">New Teachers (last 5)</h3>
            <p className="text-3xl font-bold text-foreground mt-2">
              {recentLoading ? '\u2014' : (recent?.newestTeachers.length ?? 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Most recent teachers added</p>
          </div>
        </div>
      </div>
    </div>
  );
}
