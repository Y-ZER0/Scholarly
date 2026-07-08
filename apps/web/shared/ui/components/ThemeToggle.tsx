'use client';

import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from '@/shared/context/ThemeContext';
import { Button } from '@/components/ui/button';

const THEME_LABELS: Record<string, string> = {
  dark: 'Dark',
  light: 'Light',
  'dark-blue': 'Dark Blue',
  'dark-purple': 'Dark Purple',
};

const THEME_ICONS: Record<string, typeof Sun> = {
  dark: Moon,
  light: Sun,
  'dark-blue': Moon,
  'dark-purple': Moon,
};

export function ThemeToggle() {
  const { theme, setTheme, availableThemes } = useTheme();

  const cycleTheme = () => {
    const idx = availableThemes.indexOf(theme);
    setTheme(availableThemes[(idx + 1) % availableThemes.length]);
  };

  const Icon = THEME_ICONS[theme] ?? Palette;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Switch theme (current: ${THEME_LABELS[theme] ?? theme})`}
      title={THEME_LABELS[theme] ?? theme}
      className="size-9 text-muted-foreground hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
