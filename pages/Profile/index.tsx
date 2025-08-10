import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Import necessary components and icons
import Header from '@/components/layout/Header';
import Search from '@/components/common/Search';
import ProductList from '@/components/product/Product';
import { FaSpinner, FaExclamationTriangle, FaUserCircle } from 'react-icons/fa';
import products from '../admin/products';

type UserProfile = {
  fullname: string;
  email: string;
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token and user data in localStorage
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    // If no token exists, the user is not logged in. Redirect them.
    if (!token) {
      router.push('/Login'); // Assuming your login page is at /Login
      return; 
    }

    // If a token exists, parse the user data from localStorage
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // If data is corrupted, clear it and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        router.push('/Login');
        return;
      }
    }
    
    // Stop the loading state once checks are complete
    setLoading(false);

  }, [router]);

  // --- Enhanced Loading State ---
  // Display a full-page, centered spinner while we check for authentication
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-purple-600 text-4xl mb-4" />
        <p className="text-lg text-gray-700">Loading Your Dashboard...</p>
      </div>
    );
  }

  // --- Enhanced Not Logged-In State ---
  // This is a safeguard if loading finishes but user is still null.
  // Provides a clear message and a path forward.
  if (!user) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center p-4">
            <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">You must be logged in to view this page.</p>
            <button
                onClick={() => router.push('/Login')}
                className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
            >
                Go to Login
            </button>
        </div>
    );
  }

  // --- Main Dashboard for the Logged-In User ---
  return (
    // Add a soft background color to the entire page for a premium feel
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main>
        {/* --- Hero Welcome Section --- */}
        <div className="bg-gradient-to-r from-[#4F225E] to-indigo-700 text-white py-16 sm:py-20 text-center">
          <div className="container mx-auto px-6">
            <FaUserCircle className="text-5xl mx-auto mb-4 text-purple-200" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Welcome Back,
            </h1>
            <p className="text-4xl sm:text-5xl font-extrabold tracking-tight text-purple-200 mt-1">
              {user.fullname}!
            </p>
            <p className="mt-4 text-lg text-purple-100 max-w-2xl mx-auto">
              Ready to find something amazing? Start your search below or browse our latest products.
            </p>
          </div>
        </div>

        {/* --- Search Bar --- */}
        {/* Placed strategically to bridge the hero and the product list */}
        <div className="container mx-auto px-6 -mt-12 relative z-10">
            <div className="max-w-3xl mx-auto">
                <Search  />
            </div>
        </div>

        {/* --- Product List Section --- */}
        <div className="container mx-auto px-6 py-12">
            <div className="border-b border-gray-200 pb-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Explore Our Products</h2>
            </div>
            <ProductList />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;