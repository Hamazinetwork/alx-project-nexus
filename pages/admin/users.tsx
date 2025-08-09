import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaUser, FaEye } from "react-icons/fa";

interface User {
  id: number;
  email: string;
  is_admin: boolean;
  date_joined: string;
}

interface AdminUser {
  fullname: string;
  email: string;
  is_admin: boolean;
}

const UsersList: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Enhanced token validation function (same as dashboard)
  const validateToken = (token: string): boolean => {
    try {
      // Basic JWT structure check (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid token format - not a JWT');
        return false;
      }
      
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      console.log('Token payload:', payload);
      console.log('Current time (Unix):', currentTime);
      console.log('Token expiry (Unix):', payload.exp);
      console.log('Token issued at (Unix):', payload.iat);
      
      if (payload.exp) {
        const timeUntilExpiry = payload.exp - currentTime;
        console.log('Time until expiry (seconds):', timeUntilExpiry);
        
        // Allow for 5 minutes (300 seconds) of clock skew
        if (timeUntilExpiry < -300) {
          console.warn('Token has expired (beyond clock skew tolerance)');
          return false;
        }
        
        if (timeUntilExpiry < 0) {
          console.warn('Token appears expired but within clock skew tolerance, allowing');
        }
      }
      
      console.log('Token validation passed');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Clear auth data and redirect
  const clearAuthAndRedirect = () => {
    console.log('Clearing auth data and redirecting to login');
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  useEffect(() => {
    console.log('Initial auth check useEffect running');
    
    // Use correct localStorage keys
    const adminToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    console.log('Token exists:', !!adminToken);
    console.log('User data exists:', !!savedUser);

    if (!adminToken || !savedUser) {
      console.log('Missing token or user data, redirecting to login');
      clearAuthAndRedirect();
      return;
    }

    // Validate token structure and expiration
    if (!validateToken(adminToken)) {
      console.log('Token validation failed, redirecting to login');
      clearAuthAndRedirect();
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      console.log('Parsed user data:', userData);
      
      // Check if user is admin
      if (!userData.is_admin) {
        console.log('User is not admin, redirecting to login');
        alert('Access denied. Admin privileges required.');
        clearAuthAndRedirect();
        return;
      }
      
      setToken(adminToken);
      setAdminUser(userData);
      setAuthChecked(true);
    } catch (error) {
      console.error('Error parsing user data:', error);
      clearAuthAndRedirect();
      return;
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked || !token) {
      console.log('Auth not checked yet or no token, skipping users fetch');
      return;
    }

    console.log('Starting users fetch with token:', token.substring(0, 20) + '...');
    fetchUsers();
  }, [token, authChecked]);

  const fetchUsers = async () => {
    if (!token) {
      console.log('No token available for users fetch');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Fetching users...');
      const res = await fetch("https://martafrica.onrender.com/api/admin/users/", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Users response status:', res.status);

      if (res.status === 401) {
        console.log('401 response from users API - token invalid on server');
        alert("Session expired, please login again.");
        clearAuthAndRedirect();
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Users API error:', res.status, errorText);
        throw new Error(`Failed to fetch users: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log('Users data received:', data);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Error loading users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">
          {!authChecked ? "Checking authentication..." : "Fetching users..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaUser /> Users Management
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome, {adminUser?.fullname || "Admin"}! Manage your platform users below.
          </p>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.is_admin ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.date_joined).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/users/${user.id}`)}
                          className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <FaEye size={14} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600">There are currently no users in the system.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        {users.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUser className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUser className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admin Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => user.is_admin).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUser className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Regular Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => !user.is_admin).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Dashboard Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;