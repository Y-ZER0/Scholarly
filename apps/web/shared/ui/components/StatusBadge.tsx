import { cn } from '@/shared/lib/utils';

type StatusVariant = 'active' | 'inactive' | 'teacher' | 'student' | 'admin';

interface StatusBadgeProps {
  status: StatusVariant;
}

const variants: Record<StatusVariant, string> = {
  active:
    'text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30',
  teacher:
    'text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30',
  student:
    'text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30',
  admin:
    'text-xs font-medium px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30',
  inactive:
    'text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn(variants[status])}>{status}</span>
  );
}
