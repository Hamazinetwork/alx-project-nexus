import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';

type SignUpFormData = {
  email: string;
  fullname: string;
  password: string;
  confirmPassword: string;
};

// A small, reusable spinner component for the button
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('https://martafrica.onrender.com/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // The body correctly matches the requested order
        body: JSON.stringify({
          email: formData.email,
          fullname: formData.fullname,
          password: formData.password,
          password_confirm: formData.confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = Object.values(data).flat().join(' ') || 'An unexpected error occurred.';
        throw new Error(errorMsg);
      }
      
      setSuccess(true);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4">
      <div className="w-full max-w-md bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6">
        
        {success ? (
          <div className="text-center space-y-6 py-8">
            <FaCheckCircle className="mx-auto text-6xl text-green-400" />
            <h2 className="text-3xl font-bold text-white">Registration Successful!</h2>
            <p className="text-gray-300">
              Your account has been created. Please proceed to login.
            </p>
            <button
              onClick={() => router.push('/Login')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg py-3 px-4 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white">Create Your Account</h1>
              <p className="text-gray-300">Join MartAfrica today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 text-center">
                  {error}
                </div>
              )}

              {/* --- CORRECTED ORDER OF INPUT FIELDS --- */}
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition py-2 pl-10"/>
              </div>
              <div className="relative">
                <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input id="fullname" name="fullname" type="text" value={formData.fullname} onChange={handleChange} placeholder="Full Name" required className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition py-2 pl-10"/>
              </div>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition py-2 pl-10"/>
              </div>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required className="w-full bg-transparent text-white placeholder-gray-400 border-b-2 border-gray-500 focus:border-purple-400 focus:outline-none transition py-2 pl-10"/>
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg py-3 px-4 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link href="/Login" className="font-medium text-purple-400 hover:underline">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;