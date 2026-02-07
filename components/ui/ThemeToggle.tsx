'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import Button from './Button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
}
