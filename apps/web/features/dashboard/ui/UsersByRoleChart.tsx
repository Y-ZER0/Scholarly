'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/shared/lib/chart-colors';

const ROLE_COLORS: Record<string, string> = {
  student: CHART_COLORS.student,
  teacher: CHART_COLORS.teacher,
  admin: CHART_COLORS.admin,
};

interface RoleData {
  role: string;
  count: number;
}

interface UsersByRoleChartProps {
  data: RoleData[];
}

export function UsersByRoleChart({ data }: UsersByRoleChartProps) {
  const chartData = data.map((d) => ({ name: d.role, value: d.count }));

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-base font-semibold text-foreground mb-4">Users by Role</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={ROLE_COLORS[entry.name] ?? '#6b7280'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_COLORS.tooltipBg,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: 8,
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend
            formatter={(value, entry) =>
              `${value} \u00B7 ${(entry.payload as { value: number }).value}`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
