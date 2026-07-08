import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  message?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  message = 'No data to display',
  subtitle = 'This table is empty for the time being.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center w-full">
      <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-base font-semibold text-foreground">{message}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
