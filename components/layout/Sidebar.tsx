// components/layout/Sidebar.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { FaBox, FaUsers, FaTags, FaTachometerAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from 'next-themes';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/dashboard' },
    { name: 'Products', icon: <FaBox />, path: '/admin/products' },
    { name: 'Categories', icon: <FaTags />, path: '/admin/categories' },
    { name: 'Users', icon: <FaUsers />, path: '/admin/users' },
  ];

  return (
    <aside
      className={`relative bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 w-64 space-y-6 py-7 px-2 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
    >
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold">Admin</h2>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden">
          {/* Add a close icon here if you want one for mobile */}
        </button>
      </div>
      <nav>
        {menuItems.map((item) => (
          <a
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex items-center space-x-2 py-3 px-4 rounded-md cursor-pointer transition-colors ${
              router.pathname === item.path
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
