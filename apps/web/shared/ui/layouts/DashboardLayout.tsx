'use client';

import { SidebarNav } from './SidebarNav';
import { ThemeToggle } from '@/shared/ui/components/ThemeToggle';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-end gap-2 px-8 py-4">
          <ThemeToggle />

          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            U
          </div>
        </div>

        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
