import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaPlus, FaTag, FaSpinner, FaTrash, FaExclamationTriangle } from "react-icons/fa";

type Category = {
  id: number;
  name: string;
};

const CategoriesPage: React.FC = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Using 'accessToken' for consistency with other components
    const adminToken = localStorage.getItem("accessToken");
    if (!adminToken) {
      router.push("/admin/login");
    } else {
      setToken(adminToken);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://martafrica.onrender.com/api/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.detail || "Failed to fetch categories");
        setCategories(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("https://martafrica.onrender.com/api/categories/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.name?.[0] || data?.detail || "Failed to create category");
      }

      setSuccess(`Category "${data.name}" created successfully!`);
      setCategoryName("");
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // A placeholder for delete functionality you might add later
  const handleDeleteCategory = (id: number) => {
    alert(`Delete functionality for category ID ${id} is not yet implemented.`);
  }

  if (!token) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <p className="text-lg">Authenticating...</p>
        </div>
    );
  }

  return (
    // --- Main container with the same professional gradient background ---
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* --- Back Button --- */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-700 font-semibold hover:text-purple-800 transition-colors"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </div>

        {/* --- Main "glassmorphism" Card --- */}
        <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          
          {/* --- Card Header --- */}
          <div className="p-6 border-b border-white/30">
            <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
            <p className="text-gray-600 mt-1">Create and view product categories.</p>
          </div>

          {/* --- Category Creation Form --- */}
          <form onSubmit={handleCreateCategory} className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Category</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="e.g., Electronics, Fashion, Books"
                value={categoryName}
                onChange={handleInputChange}
                className="input-field flex-grow" // Use the reusable class from globals.css
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-purple-700 text-white font-bold rounded-lg px-6 py-3 hover:bg-purple-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting || !categoryName.trim()}
              >
                {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                <span>{isSubmitting ? "Creating..." : "Create"}</span>
              </button>
            </div>
          </form>

          {/* --- Dynamic Alert Messages --- */}
          <div className="px-6 pb-6">
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">{error}</div>}
            {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">{success}</div>}
          </div>

          {/* --- Categories List --- */}
          <div className="px-6 pb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Existing Categories</h2>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <FaSpinner className="animate-spin text-purple-600 text-3xl" />
              </div>
            ) : categories.length > 0 ? (
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between bg-white/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 text-gray-800 font-medium">
                      <FaTag className="text-purple-600" />
                      <span>{cat.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 bg-white/30 rounded-lg">
                <FaExclamationTriangle className="mx-auto text-yellow-500 text-3xl mb-2" />
                <p className="text-gray-600">No categories found. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;