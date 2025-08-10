// File: /components/ThemeSwitcher.tsx

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

// Define the possible theme values
type Theme = 'light' | 'dark';

const ThemeSwitcher: React.FC = () => {
  // State to hold the current theme. We initialize from localStorage on the client.
  const [theme, setTheme] = useState<Theme>('light');
  
  // State to ensure we only render the button on the client to avoid hydration mismatch.
  const [isMounted, setIsMounted] = useState(false);

  // This effect runs once after the component mounts on the client-side.
  useEffect(() => {
    setIsMounted(true);
    // Check localStorage for a saved theme.
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    // Check the user's OS preference as a fallback.
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  // This effect runs whenever the `theme` state changes.
  useEffect(() => {
    if (theme === 'dark') {
      // Add 'dark' class to the root <html> element
      document.documentElement.classList.add('dark');
      // Save the user's choice in localStorage
      localStorage.setItem('theme', 'dark');
    } else {
      // Remove 'dark' class from the root <html> element
      document.documentElement.classList.remove('dark');
      // Save the user's choice in localStorage
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // The button click handler that toggles the theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Don't render anything on the server to prevent a flash of the wrong theme
  if (!isMounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ThemeSwitcher;