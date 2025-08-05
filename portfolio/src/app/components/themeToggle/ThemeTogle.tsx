'use client';

import { useThemeContext } from '@/app/context/ThemeProvider'; // Corrigido caminho
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button'; // Corrigido caminho

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
