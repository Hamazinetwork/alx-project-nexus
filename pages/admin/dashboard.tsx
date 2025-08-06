import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    if (!adminToken) {
      router.push("/admin/login"); // redirect if no token
    } else {
      setToken(adminToken);
    }
  }, [router]);

  if (!token) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-x-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => router.push("/admin/categories")}
        >
          Manage Categories
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => router.push("/admin/products")}
        >
          Manage Products
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
