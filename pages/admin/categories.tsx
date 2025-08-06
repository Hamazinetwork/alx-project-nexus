import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/router";

type Category = {
  id: number;
  name: string;
};

const CategoriesPage: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 1️⃣ Get token on page load
  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    if (!adminToken) {
      router.push("/admin/login"); // redirect if not logged in
    } else {
      setToken(adminToken);
    }
  }, [router]);

  // 2️⃣ Fetch categories when token is ready
  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://martafrica.onrender.com/api/categories/",
          {
            headers: {
              Authorization: `Token ${token}`, // ✅ Correct for DRF TokenAuth
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("Categories Response:", data);

        if (!response.ok) throw new Error(data?.detail || "Failed to load categories");

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.results) {
          setCategories(data.results);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load categories. Check login or token.");
      }
    };

    fetchCategories();
  }, [token]);

  // 3️⃣ Handle new category creation
  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        "https://martafrica.onrender.com/api/categories/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCategory }),
        }
      );

      const data = await response.json();
      console.log("Create Category Response:", data);

      if (!response.ok) throw new Error(data?.detail || "Failed to create category");

      setSuccess("Category created successfully!");
      setNewCategory("");
      setCategories((prev) => [...prev, data]); // add new category to list
    } catch (err) {
      console.error(err);
      setError("Failed to create category. Check token or input.");
    }
  };

  if (!token) return <p className="text-center mt-10">Loading admin dashboard...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Manage Categories</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleCreateCategory} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900"
        >
          Create Category
        </button>
      </form>

      <div className="bg-white shadow rounded p-4 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-black">Existing Categories</h2>
        <ul className="list-disc list-inside text-black">
          {categories.length === 0 && <li>No categories found.</li>}
          {categories.map((cat) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesPage;
