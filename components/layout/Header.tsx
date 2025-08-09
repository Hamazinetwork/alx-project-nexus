import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaHeart, FaUser, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

interface Category {
  id: number;
  name: string;
}

interface LogoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Logout
            </h3>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-600">
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingOut ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </span>
              ) : (
                'Yes, Logout'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for an access token to determine if the user is logged in
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }

    const getCategories = async () => {
      try {
        const res = await fetch('https://martafrica.onrender.com/api/categories/');
        const data = await res.json();
        const cats = Array.isArray(data) ? data : data.results || [];
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    getCategories();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleCloseLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call the logout API
      const response = await fetch('https://martafrica.onrender.com/api/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Clear local storage regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Update state
      setIsLoggedIn(false);
      setShowLogoutPopup(false);

      // Redirect to login page
      router.push('/Login');

      if (!response.ok) {
        console.error('Logout API failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with logout even if API fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setShowLogoutPopup(false);
      router.push('/Login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/images/martafricalogo.jpeg" alt="Logo" className="h-12" />
            <span className="text-xl font-bold">
              MART<span className="text-yellow-500">AFRICA</span> <span className="text-sm font-normal">..</span>
            </span>
          </div>

          {/* Search */}
          <div className="flex items-center flex-1 mx-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-l-lg px-3 py-2 bg-gray-100 text-gray-700"
            >
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search for more than 20,000 products"
              className="w-full px-4 py-2 border-t border-b border-gray-300"
            />
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-r-lg">
              <FaSearch />
            </button>
          </div>

          {/* Support / Icons */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">For Support?</p>
              <p className="font-bold text-lg">+980-34984089</p>
            </div>

            {isLoggedIn ? (
              <>
                <Link href="/Profile" title="Profile">
                  <FaUser className="text-2xl cursor-pointer" />
                </Link>
                <button onClick={handleLogoutClick} title="Logout">
                  <FaSignOutAlt className="text-2xl cursor-pointer text-red-500" />
                </button>
              </>
            ) : (
              <>
                <Link href="/Login" title="Login">
                  <FaUser className="text-2xl cursor-pointer" />
                </Link>
                <Link href="/Signup" title="Sign Up">
                  <FaUserPlus className="text-2xl cursor-pointer" />
                </Link>
              </>
            )}

            <FaHeart className="text-2xl cursor-pointer" />
            <Link href="/Carts" className="font-bold text-lg text-black">
              Cart
            </Link>
          </div>
        </div>
      </header>

      {/* Logout Popup */}
      <LogoutPopup 
        isOpen={showLogoutPopup}
        onClose={handleCloseLogoutPopup}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default Header;