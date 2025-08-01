import React, { useEffect, useState } from 'react';

type UserProfile = {
  email: string;
  fullname: string;
  created_at?: string;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Load from localStorage first
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (!token) {
      setLoading(false);
      return;
    }

    // 2️⃣ Verify token with backend
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://martafrica.onrender.com/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await response.json();
        console.log("Profile response:", data);

        if (response.ok) {
          setUser(data);
        } else {
          console.warn("Token invalid or expired");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  if (!user) return <p className="text-center mt-10 text-red-500">You are not logged in.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">👤 User Profile</h2>
        <p className="text-gray-700"><strong>Full Name:</strong> {user.fullname}</p>
        <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        {user.created_at && (
          <p className="text-gray-500 text-sm mt-2">Joined: {new Date(user.created_at).toDateString()}</p>
        )}

        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/Login';
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
