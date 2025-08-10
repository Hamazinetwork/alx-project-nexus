// /components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaBars, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import Search from '../common/Search'; // 1. Import the Search component

// Props passed from AdminLayout.tsx
interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// A reusable Logout Popup component, styled for the admin dashboard
interface LogoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirm Logout
          </h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to log out from the admin panel?
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border rounded-md hover:bg-gray-200 focus:outline-none disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm text-white bg-red-600 border rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isLoggingOut ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Yes, Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// The main Header component for the Admin Dashboard
const AdminHeader: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [adminUser, setAdminUser] = useState<{ fullname?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Get admin user's name from local storage when component mounts
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user from storage", error);
      }
    }
  }, []);

  // Function to open the logout confirmation popup
  const handleLogoutClick = () => {
    setDropdownOpen(false); // Close the dropdown first
    setShowLogoutPopup(true);
  };

  // Function to handle the actual logout process
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    // Clear all session/user data from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    
    // Redirect to the public login page
    await router.push('/Login');

    // These lines might not be reached due to the redirect, but are good practice
    setIsLoggingOut(false);
    setShowLogoutPopup(false);
  };

  return (
    <>
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 -mb-px">
            
            {/* LEFT SIDE: Hamburger button for mobile sidebar */}
            <div className="flex">
              <button
                className="text-gray-500 hover:text-gray-600 lg:hidden" // Only show on smaller screens
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                <FaBars className="w-6 h-6 fill-current" />
              </button>
            </div>

            {/* --- FIX START: Add the Search component in the middle --- */}
            <div className="flex-1 flex justify-center px-4">
              <div className="w-full max-w-md">
                <Search />
              </div>
            </div>
            {/* --- FIX END --- */}

            {/* RIGHT SIDE: User Menu */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {/* User Avatar and Name Button */}
                <button
                  className="flex items-center space-x-3"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} // Close on blur with a small delay
                >
                  <span className="hidden md:block font-medium text-gray-700 dark:text-gray-200">
                     Welcome, {adminUser?.fullname?.split(' ')[0] || 'Admin'}
                  </span>
                  <FaUserCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </button>
                
                {/* Dropdown Menu Content */}
                {dropdownOpen && (
                   <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                     <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                        MANAGE ACCOUNT
                     </div>
                      <div
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-3 cursor-pointer"
                      >
                        <FaSignOutAlt className="text-red-500" />
                        <span>Logout</span>
                      </div>
                   </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>
      
      {/* Renders your logout popup when needed */}
      <LogoutPopup 
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default AdminHeader;