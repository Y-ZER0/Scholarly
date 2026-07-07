import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  iconColor?: string;
}

export function StatCard({ label, value, icon, iconColor }: StatCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          {label}
        </span>
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <span className={cn('h-5 w-5', iconColor ?? 'text-muted-foreground')}>{icon}</span>
    </div>
  );
}
