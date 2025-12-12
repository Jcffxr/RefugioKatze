import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      // CAMBIO CLAVE: Quitamos "fixed top-5 right-5" para integrarlo en el Navbar
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 shadow-inner dark:shadow-none border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}