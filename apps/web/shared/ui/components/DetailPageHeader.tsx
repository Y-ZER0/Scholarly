'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCcw, Pencil } from 'lucide-react';

interface DetailPageHeaderProps {
  title: string;
  onBack?: () => void;
  onRefresh?: () => void;
  editHref?: string;
}

export function DetailPageHeader({
  title,
  onBack,
  onRefresh,
  editHref,
}: DetailPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        )}
        {editHref && (
          <Link
            href={editHref}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Link>
        )}
      </div>
    </div>
  );
}
