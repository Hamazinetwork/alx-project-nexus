import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface LogoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void; // Optional callback for additional logout actions
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ isOpen, onClose, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
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
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Call optional logout callback
      if (onLogout) {
        onLogout();
      }

      // Close popup
      onClose();

      // Redirect to login
      router.push('/Login');

      if (!response.ok) {
        console.error('Logout API failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with logout even if API fails
      onClose();
      router.push('/Login');
    } finally {
      setIsLoggingOut(false);
    }
  };

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
              onClick={handleConfirmLogout}
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

export default LogoutPopup;