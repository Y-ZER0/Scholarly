'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/shared/lib/chart-colors';

interface ChartData {
  name: string;
  count: number;
}

interface ClassesPerSubjectChartProps {
  data: ChartData[];
}

export function ClassesPerSubjectChart({ data }: ClassesPerSubjectChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Classes per Subject</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: CHART_COLORS.axisText, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: CHART_COLORS.axisText, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_COLORS.tooltipBg,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: 8,
            }}
          />
          <Bar dataKey="count" fill={CHART_COLORS.barBlue} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
