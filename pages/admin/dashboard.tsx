import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FaBox,
  FaUsers,
  FaTags,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Header from "@/components/layout/Header";

// Define types for our data structures
interface AdminUser {
  fullname: string;
  email: string;
}

interface User {
  id: number;
  email: string;
  is_admin: boolean;
  date_joined: string;
}

interface StatsData {
  total_products: number;
  total_users: number;
  total_orders: number;
  low_stock_count: number;
}

// Interface for the data from the new dashboard endpoint
interface DashboardData {
  total_users: number;
  admin_users: number;
  regular_users: number;
  users_with_shipping_address: number;
  recent_users: User[];
}

interface LowStockProduct {
  id: number;
  name: string;
  qty_left: number;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // ... (validateToken, clearAuthAndRedirect, and the initial useEffect remain the same)
  // Enhanced token validation function
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

      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token has expired');
        return false;
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
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  useEffect(() => {
    console.log('Initial auth check useEffect running');

    const adminToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (!adminToken || !savedUser) {
      console.log('Missing token or user data, redirecting to login');
      clearAuthAndRedirect();
      return;
    }

    if (!validateToken(adminToken)) {
      console.log('Token validation failed, redirecting to login');
      clearAuthAndRedirect();
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
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
      console.log('Auth not checked yet or no token, skipping data fetch');
      return;
    }

    console.log('Starting data fetch with token:', token.substring(0, 20) + '...');
    setLoading(true);

    // Fetch stats, low stock, and dashboard data in parallel
    Promise.all([fetchDashboardData(), fetchStats(), fetchLowStock()])
      .then(() => {
        console.log('Data fetch completed successfully');
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, authChecked]);

  const fetchDashboardData = async () => {
    if (!token) {
      console.log('No token available for dashboard fetch');
      return;
    }

    console.log('Fetching dashboard data...');
    try {
      const res = await fetch(
        "https://martafrica.onrender.com/api/admin/dashboard/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Dashboard response status:', res.status);

      if (res.status === 401) {
        console.log('401 response from dashboard API, redirecting to login');
        clearAuthAndRedirect();
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Dashboard API error:', res.status, errorText);
        throw new Error(`Failed to fetch dashboard data: ${res.status} ${errorText}`);
      }

      const data: DashboardData = await res.json();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      throw err; // Re-throw to be caught by Promise.all
    }
  };


  const fetchStats = async () => {
    if (!token) {
      console.log('No token available for stats fetch');
      return;
    }

    console.log('Fetching stats...');
    try {
      const res = await fetch(
        "https://martafrica.onrender.com/api/admin/stats/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Stats response status:', res.status);

      if (res.status === 401) {
        console.log('401 response from stats API, redirecting to login');
        clearAuthAndRedirect();
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Stats API error:', res.status, errorText);
        throw new Error(`Failed to fetch stats: ${res.status} ${errorText}`);
      }

      const data: StatsData = await res.json();
      console.log('Stats data received:', data);
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      throw err; // Re-throw to be caught by Promise.all
    }
  };

  const fetchLowStock = async () => {
    if (!token) {
      console.log('No token available for low stock fetch');
      return;
    }

    console.log('Fetching low stock...');
    try {
      const res = await fetch(
        "https://martafrica.onrender.com/api/admin/low-stock/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      console.log('Low stock response status:', res.status);

      if (res.status === 401) {
        console.log('401 response from low stock API, redirecting to login');
        clearAuthAndRedirect();
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Low stock API error:', res.status, errorText);
        throw new Error(`Failed to fetch low stock: ${res.status} ${errorText}`);
      }

      const data: LowStockProduct[] = await res.json();
      console.log('Low stock data received:', data);
      setLowStock(data);
    } catch (err) {
      console.error("Error fetching low stock:", err);
      throw err; // Re-throw to be caught by Promise.all
    }
  };


  // Data for the charts
  const chartData = [
    { name: "Products", value: stats?.total_products || 0 },
    { name: "Users", value: dashboardData?.total_users || 0 },
    { name: "Orders", value: stats?.total_orders || 0 },
  ];

  const lowStockChartData = [
    { name: "Low Stock", value: stats?.low_stock_count || 0 },
    {
      name: "Healthy Stock",
      value:
        (stats?.total_products || 0) - (stats?.low_stock_count || 0),
    },
  ];

  const PIE_CHART_COLORS = ["#FF8042", "#0088FE"];

  if (!authChecked || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-600">
          {!authChecked ? "Checking authentication..." : "Loading Dashboard..."}
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {adminUser?.fullname || "Admin"}!
            </h1>
            <p className="text-gray-500 mt-1">
              Here is your business overview and statistics.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FaBox />}
              title="Total Products"
              value={stats?.total_products}
              color="text-blue-500"
            />
            <StatCard
              icon={<FaUsers />}
              title="Total Users"
              value={dashboardData?.total_users}
              color="text-green-500"
            />
            <StatCard
              icon={<FaTags />}
              title="Total Orders"
              value={stats?.total_orders}
              color="text-yellow-500"
            />
            <StatCard
              icon={<FaExclamationTriangle />}
              title="Low Stock Items"
              value={stats?.low_stock_count}
              color="text-red-500"
            />
          </div>

          {/* Charts and Low Stock List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats Bar Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Store Analytics
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    wrapperClassName="!bg-white !border-gray-200 !rounded-lg !shadow-lg"
                    cursor={{ fill: "#fafafa" }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Low Stock Donut Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Stock Status
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={lowStockChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                  >
                    {lowStockChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-red-500">
                    {stats?.low_stock_count}
                  </span>{" "}
                  products are running low.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Users List */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Users
            </h2>
            <div className="overflow-x-auto">
              {dashboardData?.recent_users && dashboardData.recent_users.length > 0 ? (
                <table className="min-w-full text-left">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Email
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Date Joined
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recent_users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-800">{user.email}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(user.date_joined).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.is_admin
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.is_admin ? "Admin" : "User"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No recent users found.
                </p>
              )}
            </div>
          </div>


          {/* Low Stock Product List */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Products with Low Stock
            </h2>
            <div className="overflow-x-auto">
              {lowStock.length > 0 ? (
                <table className="min-w-full text-left">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600">
                        Product Name
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-600 text-right">
                        Quantity Left
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-800">{product.name}</td>
                        <td className="px-4 py-3 text-red-600 font-semibold text-right">
                          {product.qty_left}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  All products have sufficient stock.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/admin/categories")}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition-all transform hover:scale-105"
              >
                Manage Categories
              </button>
              <button
                onClick={() => router.push("/admin/products")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-all transform hover:scale-105"
              >
                Manage Products
              </button>
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

interface StatCardProps {
  icon: JSX.Element;
  title: string;
  value?: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  color,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
    <div className={`text-4xl ${color}`}>{icon}</div>
    <div>
      <h3 className="text-gray-500 font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">
        {value !== undefined ? value : "..."}
      </p>
    </div>
  </div>
);

export default AdminDashboard;