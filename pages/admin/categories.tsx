import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  //Get token from localStorage and redirect
  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    if (!adminToken) {
      router.push("/admin/login");
    } else {
      setToken(adminToken);
    }
  }, [router]);

  // Fetch categories after token
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://martafrica.onrender.com/api/categories/",
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        const data = await response.json();
        console.log("Categories Response:", data);

        if (!response.ok) {
          throw new Error(data?.detail || "Failed to fetch categories");
        }

        // Ensure categories is an array
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.results) {
          setCategories(data.results);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  // Handle category creation
  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "https://martafrica.onrender.com/api/categories/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: categoryName }),
        }
      );

      const data = await response.json();
      console.log("Create Category Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.name?.[0] || data?.detail || "Failed to create category"
        );
      }

      setSuccess("Category created successfully!");
      setCategoryName("");

      // Refresh categories list
      setCategories((prev) => [...prev, data]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!token) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Manage Categories</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Category Form */}
      <form onSubmit={handleCreateCategory} className="flex space-x-3 mb-6">
        <input
          type="text"
          placeholder="New category name"
          value={categoryName}
          onChange={handleInputChange}
          className="border border-gray-300 rounded px-4 py-2 w-64"
        />
        <button
          type="submit"
          className="bg-[#4F225E] text-white px-6 py-2 rounded hover:bg-purple-900"
        >
          Create
        </button>
      </form>

      {/* Categories List */}
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-3 text-black">All Categories</h2>
        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length > 0 ? (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="border-b border-gray-200 py-2 text-gray-800"
              >
                {cat.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
