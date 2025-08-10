import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaEnvelope, FaLock } from 'react-icons/fa';

type LoginFormData = {
  email: string;
  password: string;
};

// A small, reusable spinner component for the login button
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Login: React.FC = () => {
  const router = useRouter();
  const [dataForm, setDataForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('https://martafrica.onrender.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Use a more generic and friendly error message from the backend's response
        throw new Error(data.detail || 'Invalid email or password. Please try again.');
      }

      if (data.tokens && data.tokens.access) {
        localStorage.setItem('accessToken', data.tokens.access);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect based on user role
      if (data.user?.is_admin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/Profile');
      }

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with the attractive background gradient
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4">
      {/* The "Glassmorphism" Login Card */}
      <div className="w-full max-w-md bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-300">Sign in to continue to MartAfrica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          {/* Email Input with Icon */}
          <div className="relative">
            <label htmlFor="email" className="sr-only">Email</label>
            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition duration-300 py-2 pl-10"
            />
          </div>

          {/* Password Input with Icon */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition duration-300 py-2 pl-10"
            />
          </div>

          {/* Login Button with Loading State */}
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg py-3 px-4 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Sign In'}
          </button>
        </form>

        {/* Prompt for new users to sign up */}
        <p className="text-center text-sm text-gray-300">
          Don&apos;t have an account?{' '}
          <Link href="/Signup" className="font-medium text-purple-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;