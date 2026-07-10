'use client';

import { LogOut } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { ThemeToggle } from '@/shared/ui/components/ThemeToggle';
import { useAuth } from '@/shared/context/AuthContext';
import { Button } from '@/components/ui/button';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-end gap-2 px-8 py-4">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Log out"
            className="size-8 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {currentUser?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
        </div>

        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
