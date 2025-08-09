import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaHeart, FaUser, FaUserPlus, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all"
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
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
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setIsLoggedIn(true);

    const getCategories = async () => {
      try {
        const res = await fetch('https://martafrica.onrender.com/api/categories/');
        const data = await res.json();
        const cats = Array.isArray(data) ? data : data.results || [];
        setCategories(cats);
      } catch {
        setCategories([]);
      }
    };
    getCategories();
  }, []);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('https://martafrica.onrender.com/api/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
    } catch {}
    localStorage.clear();
    setIsLoggedIn(false);
    setShowLogoutPopup(false);
    router.push('/Login');
    setIsLoggingOut(false);
  };

  return (
    <>
      <header className="bg-white shadow-md">
        {/* TOP BAR: Logo + Hamburger */}
        <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <img src="/images/martafricalogo.jpeg" alt="Logo" className="h-10 md:h-12" />
            <span className="text-lg md:text-xl font-bold text-[#4F225E]">
              MART<span className="text-yellow-500">AFRICA</span>
            </span>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">For Support?</p>
              <p className="font-bold text-lg">+980-34984089</p>
            </div>
            {isLoggedIn ? (
              <>
                <Link href="/Profile"><FaUser className="text-2xl" /></Link>
                <button onClick={() => setShowLogoutPopup(true)}><FaSignOutAlt className="text-2xl text-red-500" /></button>
              </>
            ) : (
              <>
                <Link href="/Login"><FaUser className="text-2xl" /></Link>
                <Link href="/Signup"><FaUserPlus className="text-2xl" /></Link>
              </>
            )}
            <FaHeart className="text-2xl" />
            <Link href="/Carts" className="font-bold">Cart</Link>
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* MOBILE SEARCH BAR: Always visible below header */}
        <div className="md:hidden bg-gray-50 px-4 py-2 border-t">
          <div className="flex">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-l-lg px-2 py-2 bg-gray-100 text-gray-700"
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
              placeholder="Search products"
              className="w-full px-2 py-2 border-t border-b border-gray-300"
            />
            <button className="bg-yellow-500 text-white px-3 py-2 rounded-r-lg">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden md:flex items-center flex-1 mx-6 pb-3">
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
          <button className="bg-[#4F225E] text-white px-4 py-2 rounded-r-lg">
            <FaSearch />
          </button>
        </div>

        {/* MOBILE MENU: Profile, Logout, Cart */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-4 bg-gray-50 border-t">
            <div className="text-gray-600 font-medium">For Support: +980-34984089</div>
            <div className="flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/Profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2"><FaUser /> Profile</Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setShowLogoutPopup(true); }}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/Login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2"><FaUser /> Login</Link>
                  <Link href="/Signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2"><FaUserPlus /> Sign Up</Link>
                </>
              )}
              <Link href="/Carts" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <FaHeart /> Cart
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Logout Popup */}
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
