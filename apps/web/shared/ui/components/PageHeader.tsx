import type { ReactNode } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: ReactNode;
  createHref?: string;
  createLabel?: string;
}

export function PageHeader({
  title,
  description,
  searchPlaceholder,
  onSearch,
  filters,
  createHref,
  createLabel = '+ Create',
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {searchPlaceholder && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-8 h-9 w-[200px] bg-muted border-border"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}
          {filters}
          {createHref && (
            <Link href={createHref}>
              <Button className="h-9 gap-1.5">
                <Plus className="h-4 w-4" /> {createLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
