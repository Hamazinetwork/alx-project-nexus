import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FaBox,
  FaUsers,
  FaTags,
  FaExclamationTriangle,
  FaShoppingCart,
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
import AdminLayout from "@/components/layout/AdminLayout";

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
  total_categories: number;
}

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

interface Category {
  id: number;
  name: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // --- AUTHENTICATION ---
  const validateToken = (token: string): boolean => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp ? payload.exp > Math.floor(Date.now() / 1000) : false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const clearAuthAndRedirect = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  useEffect(() => {
    const adminToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (!adminToken || !savedUser || !validateToken(adminToken)) {
      clearAuthAndRedirect();
      return;
    }
    
    try {
        setToken(adminToken);
        setAdminUser(JSON.parse(savedUser));
        setAuthChecked(true);
    } catch (error) {
        clearAuthAndRedirect();
    }
  }, [router]);

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!authChecked || !token) return;

    // Fetch all admin-specific data that requires auth
    const fetchAdminData = async () => {
        try {
            await Promise.all([
                fetchDashboardData(),
                fetchStats(),
                fetchLowStock(),
            ]);
        } catch (err) {
            console.error("Error loading protected admin data:", err);
        }
    };

    // Fetch public category data separately
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

    setLoading(true);
    Promise.all([fetchAdminData(), getCategories()])
        .finally(() => setLoading(false));

  }, [token, authChecked]);

  // Helper for authenticated API calls
  const fetchAPI = async (url: string) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      clearAuthAndRedirect();
      throw new Error("Unauthorized");
    }
    if (!res.ok) {
      throw new Error(`API call failed: ${res.status}`);
    }
    return res.json();
  };

  const fetchDashboardData = () => fetchAPI("https://martafrica.onrender.com/api/admin/dashboard/").then(data => setDashboardData(data));
  const fetchStats = () => fetchAPI("https://martafrica.onrender.com/api/admin/stats/").then(data => setStats(data));
  const fetchLowStock = () => fetchAPI("https://martafrica.onrender.com/api/admin/low-stock/").then(data => setLowStock(data));

  // --- CHART DATA ---
  const chartData = [
    { name: "Products", value: stats?.total_products || 0 },
    { name: "Users", value: dashboardData?.total_users || 0 },
    { name: "Orders", value: stats?.total_orders || 0 },
    { name: "Categories", value: stats?.total_categories || 0 },
  ];

  const lowStockChartData = [
    { name: "Low Stock", value: stats?.low_stock_count || 0 },
    { name: "Healthy Stock", value: (stats?.total_products || 0) - (stats?.low_stock_count || 0) },
  ];

  const PIE_CHART_COLORS = ["#FF8042", "#0088FE"];

  if (!authChecked || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {!authChecked ? "Verifying access..." : "Loading Dashboard..."}
        </p>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome, {adminUser?.fullname || "Admin"}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here’s what’s happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard icon={<FaBox size={22} />} title="Total Products" value={stats?.total_products} color="text-teal-400" />
        <StatCard icon={<FaUsers size={22} />} title="Total Users" value={dashboardData?.total_users} color="text-sky-400" />
        <StatCard icon={<FaShoppingCart size={22} />} title="Total Orders" value={stats?.total_orders} color="text-amber-400" />
        <StatCard icon={<FaTags size={22} />} title="Categories" value={stats?.total_categories} color="text-indigo-400" />
        <StatCard icon={<FaExclamationTriangle size={22} />} title="Low Stock" value={stats?.low_stock_count} color="text-red-500" />
      </div>

      {/* Charts and Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Store Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="rgb(156 163 175)" fontSize={12} />
              <YAxis stroke="rgb(156 163 175)" fontSize={12} />
              <Tooltip wrapperClassName="!bg-white dark:!bg-gray-700 !border-gray-200 dark:!border-gray-600 !rounded-lg !shadow-lg" cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }} />
              <Legend />
              <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Stock Status</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={lowStockChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
                {lowStockChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip wrapperClassName="!bg-white dark:!bg-gray-700 !border-gray-200 dark:!border-gray-600 !rounded-lg !shadow-lg" />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-bold text-red-500">{stats?.low_stock_count}</span> products are running low.
            </p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Product Categories
        </h2>
        <div className="overflow-x-auto">
          {categories.length > 0 ? (
            <Table>
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <TableHeader>Category Name</TableHeader>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <TableData>{category.name}</TableData>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No categories found.
            </p>
          )}
        </div>
      </div>

      {/* ACTION REQUIRED: Low Stock Products Table */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Action Required: Low Stock Items (&lt;10)</h2>
        <div className="overflow-x-auto">
          {lowStock.filter(p => p.qty_left < 10).length > 0 ? (
            <Table>
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <TableHeader>Product Name</TableHeader>
                  <TableHeader className="text-right">Quantity Left</TableHeader>
                </tr>
              </thead>
              <tbody>
                {lowStock.filter(p => p.qty_left < 10).map((product) => (
                  <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableData>{product.name}</TableData>
                    <TableData className="text-red-500 font-semibold text-right">{product.qty_left}</TableData>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No products have critically low stock. Well done!</p>
          )}
        </div>
      </div>
      
      {/* Recent Users List */}
      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          {dashboardData?.recent_users?.length > 0 ? (
             <Table>
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Date Joined</TableHeader>
                  <TableHeader>Role</TableHeader>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recent_users.map((user) => (
                  <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableData>{user.email}</TableData>
                    <TableData>{new Date(user.date_joined).toLocaleDateString()}</TableData>
                    <TableData>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_admin ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"}`}>
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </TableData>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent users found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

// --- HELPER COMPONENTS FOR STYLING ---
const StatCard: React.FC<{ icon: JSX.Element; title: string; value?: number; color: string; }> = ({ icon, title, value, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-4">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {value !== undefined ? value.toLocaleString() : "..."}
      </p>
    </div>
  </div>
);

const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <table className="min-w-full text-left">{children}</table>
);

const TableHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <th className={`px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 ${className || ''}`}>{children}</th>
);

const TableData: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <td className={`px-4 py-3 text-gray-800 dark:text-gray-200 text-sm ${className || ''}`}>{children}</td>
);


export default AdminDashboard;