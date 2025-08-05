import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.push("/admin/login"); // Redirect if not logged in
    } else {
      setToken(adminToken);
    }
  }, [router]);

  if (!token) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/admin/products")}
          className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
        >
          Manage Products
        </button>
        <button
          onClick={() => router.push("/admin/products/create")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
