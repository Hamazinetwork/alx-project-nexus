import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

type Category = {
  id: number;
  name: string;
};

const CreateProduct: React.FC = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    category_id: "",
    sizes: "",
    total_qty: "",
    image: null as File | null,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check token and fetch categories on mount
  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    if (!adminToken) {
      router.push("/admin/login"); // Redirect to login if not logged in
      return;
    }

    setToken(adminToken);
    fetchCategories(adminToken);
  }, [router]);

  //  Fetch Categories with Token
  const fetchCategories = async (adminToken: string) => {
    try {
      const response = await fetch(
        "https://martafrica.onrender.com/api/categories/",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Categories Response:", data);

      if (!response.ok) {
        throw new Error(data?.detail || "Unauthorized or failed to fetch categories");
      }

      // Handle array or paginated response
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

  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!token) throw new Error("You are not logged in as admin!");

      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("brand", formData.brand);
      productData.append("price", formData.price);

      // Convert category_id to integer
      productData.append("category_id", Number(formData.category_id).toString());

      // Convert sizes to JSON array
      const sizesArray = formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      productData.append("sizes", JSON.stringify(sizesArray));

      productData.append("total_qty", formData.total_qty);

      if (formData.image) {
        productData.append("image", formData.image); // match backend field name
      }

      const response = await fetch(
        "https://martafrica.onrender.com/api/products/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: productData,
        }
      );

      const data = await response.json();
      console.log("Create Product Response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            JSON.stringify(data) ||
            `Failed to create product (${response.status})`
        );
      }

      setSuccess(" Product created successfully!");
      setFormData({
        name: "",
        description: "",
        brand: "",
        price: "",
        category_id: "",
        sizes: "",
        total_qty: "",
        image: null,
      });
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

  if (!token) return <p>Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Create Product
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="sizes"
          placeholder='Sizes (comma separated, e.g. S,M,L)'
          value={formData.sizes}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="number"
          name="total_qty"
          placeholder="Total Quantity"
          value={formData.total_qty}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-3"
        />

        <button
          type="submit"
          className="w-full bg-[#4F225E] text-white font-semibold rounded py-2 hover:bg-purple-800"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
