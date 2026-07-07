import type { ReactNode } from 'react';

interface FormCardProps {
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function FormCard({
  title,
  children,
  maxWidth = 'max-w-2xl',
}: FormCardProps) {
  return (
    <div className={`mx-auto ${maxWidth}`}>
      <div className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          {title ?? 'Fill out form'}
        </h2>
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}
