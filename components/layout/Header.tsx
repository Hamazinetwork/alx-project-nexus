import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  FaHeart,
  FaUser,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';
import ThemeSwitcher from '../ThemeSwitcher';

interface Category {
  id: number;
  name: string;
}

interface User {
  fullname?: string;
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
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-600">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm bg-gray-100 border rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"
                  ></path>
                </svg>
                Logging out...
              </>
            ) : (
              'Yes, Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (token) {
      setIsLoggedIn(true);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    const getCategories = async () => {
      try {
        const res = await fetch('https://martafrica.onrender.com/api/categories/');
        const data = await res.json();
        const fetchedCategories = Array.isArray(data) ? data : data.results;
        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    getCategories();
  }, []);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('https://martafrica.onrender.com/api/logout/', { method: 'POST' });
    } catch {
      // Ignore API fail
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      setIsLoggedIn(false);
      setUser(null);
      setShowLogoutPopup(false);
      setIsLoggingOut(false);

      router.push('/Login');
    }
  };

  const wishlistHref = isLoggedIn ? '/Wishlist' : '/Login';
  const cartHref = isLoggedIn ? '/Carts' : '/Login';

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/martafricalogo.jpeg" alt="Logo" className="h-12" />
              <span className="text-xl font-bold hidden md:inline">
                MART<span className="text-yellow-500">AFRICA</span>
              </span>
            </Link>

            <div className="flex items-center flex-1 mx-4 sm:mx-6 max-w-xl">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-l-lg px-3 py-2 bg-gray-100 text-gray-700"
              >
                <option>All Categories</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>
             
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    className="flex items-center space-x-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  >
                    <span className="hidden lg:block">Hi, {user?.fullname?.split(' ')[0] || 'User'}</span>
                    <FaUserCircle className="w-8 h-8 text-gray-500" />
                  </button>
                  {dropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white z-40">
                      <div className="px-4 py-2 text-xs text-gray-400">MANAGE ACCOUNT</div>
                      <Link href="/Profile" className="block px-4 py-2 hover:bg-gray-100">
                        My Profile
                      </Link>
                      <div
                        onClick={handleLogoutClick}
                        className="px-4 py-2 hover:bg-gray-100 flex items-center gap-3 cursor-pointer"
                      >
                        <FaSignOutAlt className="text-red-500" />
                        <span>Logout</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-4">
                  <Link href="/Login">
                    <FaUser className="text-2xl hover:text-yellow-500" />
                  </Link>
                  <Link href="/Signup">
                    <FaUserPlus className="text-2xl hover:text-yellow-500" />
                  </Link>
                </div>
              )}

              <Link href={wishlistHref}>
                <FaHeart className="text-2xl hover:text-yellow-500" />
              </Link>

              <Link href={cartHref} className="flex items-center gap-2 font-bold hover:text-yellow-500">
                Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

      <LogoutPopup
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default Header;
