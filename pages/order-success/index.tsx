

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage: React.FC = () => {
  const router = useRouter();
  // State to manage the countdown for redirection
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // If the countdown reaches 0, redirect the user
    if (countdown === 0) {
      router.push('/Profile');
      return;
    }

    // Set up a timer to decrement the countdown every second
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or countdown changes
    return () => clearInterval(intervalId);
  }, [countdown, router]);

  return (
    // Main container with the same attractive background as login/signup
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-4">
      
      {/* The "Glassmorphism" Success Card */}
      <div className="w-full max-w-lg bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center space-y-6 transform transition-all hover:scale-105 duration-300">
        
        {/* Success Icon */}
        <FaCheckCircle className="mx-auto text-6xl text-green-400 animate-pulse" />
        
        {/* Success Message */}
        <h1 className="text-4xl font-bold text-white">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-300 text-lg">
          Thank you for your purchase. A confirmation has been sent to your email.
        </p>

        {/* Manual Redirect Button */}
        <button
          onClick={() => router.push('/Profile')}
          className="w-full max-w-xs mx-auto bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg py-3 px-4 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
        >
          View My Profile
        </button>

        {/* Automatic Redirect Countdown Message */}
        <p className="text-sm text-gray-400 pt-4">
          You will be redirected automatically in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;