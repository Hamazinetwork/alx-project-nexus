import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

type Category = {
  id: number;
  name: string;
};

const CreateProduct: React.FC = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
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

  // 1️⃣ Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const prefix = localStorage.getItem("authPrefix") || "Token";

        if (!token) throw new Error("You are not logged in as admin!");

        const response = await fetch(
          "https://martafrica.onrender.com/api/categories/",
          {
            headers: {
              Authorization: `${prefix} ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();
        console.log("Categories Response:", data);

        if (!response.ok) {
          const errMsg =
            data?.detail || data?.message || "Failed to fetch categories";
          throw new Error(errMsg);
        }

        // Handle array or paginated response
        if (Array.isArray(data)) setCategories(data);
        else if (data.results) setCategories(data.results);
        else setCategories([]);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      }
    };

    fetchCategories();
  }, []);

  // 2️⃣ Handle input fields
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3️⃣ Handle image selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  // 4️⃣ Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const prefix = localStorage.getItem("authPrefix") || "Token";

      if (!token) throw new Error("You are not logged in as admin!");

      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("brand", formData.brand);
      productData.append("price", formData.price);
      productData.append("category_id", formData.category_id);
      productData.append("sizes", formData.sizes);
      productData.append("total_qty", formData.total_qty);
      if (formData.image) {
        productData.append("images", formData.image); // match backend field
      }

      const response = await fetch(
        "https://martafrica.onrender.com/api/products/",
        {
          method: "POST",
          headers: {
            Authorization: `${prefix} ${token}`,
          },
          body: productData,
        }
      );

      const data = await response.json();
      console.log("Product creation response:", data);

      if (!response.ok) {
        const errMsg =
          data?.message || data?.detail || "Failed to create product";
        throw new Error(errMsg);
      }

      setSuccess("✅ Product created successfully!");
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

      // Optional: Redirect to public products page
      setTimeout(() => router.push("/products"), 1500);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  };

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
          required
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
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma separated)"
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
          accept="image/*"
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
