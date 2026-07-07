import { cn } from '@/shared/lib/utils';

interface CodeBadgeProps {
  code: string;
  size?: 'sm' | 'md';
}

export function CodeBadge({ code, size = 'md' }: CodeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-bold bg-primary text-white rounded',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm'
      )}
    >
      {code}
    </span>
  );
}
