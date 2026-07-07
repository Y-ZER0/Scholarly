'use client';

import { RankList } from '@/shared/ui/components/RankList';
import { SubjectsPerDeptChart } from './SubjectsPerDeptChart';
import { ClassesPerSubjectChart } from './ClassesPerSubjectChart';
import { useDashboardCharts } from '../hooks/useDashboardCharts';
import { useDashboardRecent } from '../hooks/useDashboardRecent';

export function DashboardInsights() {
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts();
  const { data: recent, isLoading: recentLoading } = useDashboardRecent();

  const newestClassItems = (recent?.newestClasses ?? []).map((cls, i) => ({
    rank: i + 1,
    title: cls.name,
    subtitle: `${cls.subject?.name ?? 'Unknown'} \u00B7 ${cls.teacher?.name ?? 'Unknown'}`,
    newBadge: true as const,
  }));

  const newestTeacherItems = (recent?.newestTeachers ?? []).map((teacher, i) => ({
    rank: i + 1,
    title: teacher.name,
    subtitle: teacher.email,
    newBadge: true as const,
  }));

  const deptItems = (recent?.departmentsWithMostSubjects ?? []).map((dept, i) => ({
    rank: i + 1,
    title: dept.name,
    subtitle: `${dept.subjectCount} subjects`,
    countBadge: dept.subjectCount,
  }));

  const subjectItems = (recent?.subjectsWithMostClasses ?? []).map((subject, i) => ({
    rank: i + 1,
    title: subject.name,
    subtitle: `${subject.classCount} classes`,
    countBadge: subject.classCount,
  }));

  const chartLoading = chartsLoading || recentLoading;

  return (
    <div className="space-y-6">
      <h2 className="text-base font-semibold text-foreground">Insights</h2>

      {/* Bar charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartLoading ? (
          <>
            <div className="bg-card border border-border rounded-lg p-5 h-[280px] flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-lg p-5 h-[280px] flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          </>
        ) : (
          <>
            <SubjectsPerDeptChart data={charts?.subjectsPerDepartment ?? []} />
            <ClassesPerSubjectChart data={charts?.classesPerSubject ?? []} />
          </>
        )}
      </div>

      {/* Newest Classes + Newest Teachers rank lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentLoading ? (
          <>
            <div className="bg-card border border-border rounded-lg p-5 h-[280px] flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-lg p-5 h-[280px] flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          </>
        ) : (
          <>
            <RankList title="Newest Classes" items={newestClassItems} />
            <RankList title="Newest Teachers" items={newestTeacherItems} />
          </>
        )}
      </div>

      {/* Departments with Most Subjects + Subjects with Most Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentLoading ? (
          <>
            <div className="bg-card border border-border rounded-lg p-5 h-[200px] flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-lg p-5 h-[200px] flex items-center justify-center">
              <div className="h-6 w-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          </>
        ) : (
          <>
            <RankList title="Departments with Most Subjects" items={deptItems} />
            <RankList title="Subjects with Most Classes" items={subjectItems} />
          </>
        )}
      </div>
    </div>
  );
}
