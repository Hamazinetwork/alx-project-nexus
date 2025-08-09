// /components/ThemeSwitcher.tsx
import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeSwitcher = () => {
  // State to hold the current theme. Default to 'light'.
  const [theme, setTheme] = useState('light');

  // useEffect runs when the component mounts. It checks for a saved theme in localStorage.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // useEffect runs whenever the 'theme' state changes.
  useEffect(() => {
    const root = window.document.documentElement; // This is the <html> tag

    // Remove the old theme class before adding the new one
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);

    // Save the new theme to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <FaSun size={20} /> // Show sun icon in dark mode
      ) : (
        <FaMoon size={20} /> // Show moon icon in light mode
      )}
    </button>
  );
};

export default ThemeSwitcher;