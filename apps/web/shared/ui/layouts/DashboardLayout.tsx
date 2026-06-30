'use client';

import { Moon, Sun } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { useTheme } from '@/shared/context/ThemeContext';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes = ['dark', 'light', 'dark-blue', 'dark-purple'] as const;
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-end gap-2 px-8 py-4">
          <button
            onClick={cycleTheme}
            aria-label="Toggle theme"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {theme === 'light' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            U
          </div>
        </div>

        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
