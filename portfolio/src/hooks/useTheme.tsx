'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export default function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Detecta o tema do navegador ao carregar
    const userPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const localTheme = localStorage.getItem('theme') as Theme | null;

    const initialTheme = localTheme ?? (userPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return [theme, toggleTheme];
}
