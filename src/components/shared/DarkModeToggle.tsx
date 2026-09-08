'use client';

import { useState, useEffect } from 'react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800" onClick={toggleTheme}>
      <div className="flex items-center gap-3">
        <i className="fa-solid fa-moon text-gray-400 dark:text-gray-500 w-5 text-center"></i>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">โหมดกลางคืน (Dark Mode)</span>
      </div>
      <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${isDark ? 'bg-brand-red' : 'bg-gray-300 dark:bg-gray-700'}`}>
        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${isDark ? 'left-[22px]' : 'left-0.5'}`}></div>
      </div>
    </div>
  );
}
