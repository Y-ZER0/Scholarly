'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Building2,
  Users,
  ClipboardList,
  GraduationCap,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useSidebar } from '@/shared/context/SidebarContext';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Subjects', href: '/subjects', icon: BookOpen },
  { label: 'Departments', href: '/departments', icon: Building2 },
  { label: 'Faculty', href: '/faculty', icon: Users },
  { label: 'Enrollments', href: '/enrollments', icon: ClipboardList },
  { label: 'Classes', href: '/classes', icon: GraduationCap },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      role="navigation"
      className={cn(
        'flex h-screen flex-col border-r border-border bg-card transition-all duration-200',
        isOpen ? 'w-[240px]' : 'w-[60px]'
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {isOpen && (
          <span className="text-sm font-semibold text-foreground">Scholarly</span>
        )}
        <button
          onClick={toggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="ml-auto inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {isOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-colors',
                active
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
