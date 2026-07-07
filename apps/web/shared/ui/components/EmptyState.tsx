interface EmptyStateProps {
  message?: string;
  subtitle?: string;
}

export function EmptyState({
  message = 'No data to display',
  subtitle = 'This table is empty for the time being.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center w-full">
      <p className="text-base font-semibold text-foreground">{message}</p>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
