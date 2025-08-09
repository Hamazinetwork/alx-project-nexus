import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaUpload, FaCheckCircle } from "react-icons/fa";

type Category = {
  id: number;
  name: string;
};

const CreateProduct: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Use a consistent key for the token
    const adminToken = localStorage.getItem("accessToken"); 
    if (!adminToken) {
      router.push("/admin/login");
      return;
    }

    setToken(adminToken);
    fetchCategories(adminToken);
  }, [router]);

  const fetchCategories = async (adminToken: string) => {
    setLoadingCategories(true);
    try {
      const response = await fetch(
        "https://martafrica.onrender.com/api/categories/",
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data?.detail || "Failed to fetch categories");
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError("Could not load categories. Your session might have expired.");
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be smaller than 10MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file.");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (!token) throw new Error("Authentication token is missing.");
      if (!formData.image) throw new Error("A product image is required.");

      const productData = new FormData();
      productData.append("name", formData.name);
      productData.append("description", formData.description);
      productData.append("brand", formData.brand);
      productData.append("price", formData.price);
      productData.append("category_id", formData.category_id);
      productData.append("total_qty", formData.total_qty);
      productData.append("sizes", JSON.stringify(formData.sizes.split(",").map(s => s.trim()).filter(Boolean)));
      productData.append("image", formData.image);

      const response = await fetch(
        "https://martafrica.onrender.com/api/products/",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: productData,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result?.message || result?.detail || "Failed to create product.");
      
      setSuccess("Product created successfully! Redirecting...");
      
      setTimeout(() => {
        router.push("/admin/products"); // Redirect to the products list for confirmation
      }, 2000);

    } catch (err) {
      setError((err as Error).message);
      console.error("Product creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <p className="text-lg">Loading session...</p>
        </div>
    )
  }

  return (
    // --- Main container with a professional gradient background ---
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-50 to-gray-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      
      <div className="w-full max-w-2xl">
        
        {/* --- Back Button --- */}
        <div className="mb-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-purple-800 transition-colors"
            >
              <FaArrowLeft />
              Back to Dashboard
            </button>
        </div>

        {/* --- Form with a "glassmorphism" effect --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Add a New Product
          </h2>

          {/* --- Dynamic Alert Messages --- */}
          {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">{error}</div>}
          {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">{success}</div>}

          {/* --- Styled Input Fields --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="input-field" required disabled={isSubmitting} />
            <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="input-field" disabled={isSubmitting} />
          </div>

          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input-field min-h-[100px]" disabled={isSubmitting} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="input-field" required disabled={isSubmitting} />
            <input type="number" name="total_qty" placeholder="Total Quantity" value={formData.total_qty} onChange={handleChange} className="input-field" required disabled={isSubmitting} />
            <input name="sizes" placeholder="Sizes (e.g., S, M, L)" value={formData.sizes} onChange={handleChange} className="input-field" disabled={isSubmitting} />
          </div>
          
          <select name="category_id" value={formData.category_id} onChange={handleChange} className="input-field" required disabled={loadingCategories || isSubmitting}>
            <option value="">{loadingCategories ? "Loading categories..." : "Select a Category"}</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>

          {/* --- Custom File Input Area --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-purple-500 transition-colors"
            >
              <div className="space-y-1 text-center">
                {formData.image ? (
                  <>
                    <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <p className="text-sm text-gray-600 font-semibold">{formData.image.name}</p>
                    <p className="text-xs text-gray-500">Click to change image</p>
                  </>
                ) : (
                  <>
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" // The input is hidden and triggered by the styled div
              disabled={isSubmitting}
            />
          </div>

          {/* --- Submit Button with Loading State --- */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-3 bg-[#4F225E] text-white font-bold rounded-lg py-3 px-4 hover:bg-purple-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
            disabled={isSubmitting || !formData.image}
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;