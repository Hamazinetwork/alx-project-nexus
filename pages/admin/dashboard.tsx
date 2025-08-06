// pages/admin/dashboard.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    if (!adminToken) {
      router.push("/admin/login");
    } else {
      setToken(adminToken);
    }
  }, [router]);

  if (!token) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Admin Dashboard</h1>

      <div className="space-x-4">
        <button
          onClick={() => router.push("/admin/categories")}
          className="bg-[#4F225E] text-white px-6 py-3 rounded hover:bg-purple-900"
        >
          Manage Categories
        </button>
        <button
          onClick={() => router.push("/admin/products")}
          className="[#4F225E] text-white px-6 py-3 rounded hover:bg-green-900"
        >
          Manage Products
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
