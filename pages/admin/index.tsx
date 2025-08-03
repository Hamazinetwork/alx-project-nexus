import React, { useState, ChangeEvent, FormEvent } from 'react';

type ProductFormData = {
  name: string;
  price: string;
  description: string;
};

const AdminProducts: React.FC = () => {
  const [productData, setProductData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      // 1 Create Product first
      const token = localStorage.getItem('token'); // must be admin
      const response = await fetch('https://martafrica.onrender.com/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const product = await response.json();
      if (!response.ok) throw new Error(product.message || 'Product creation failed');

      // 2️ If image exists, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await fetch(
          `https://martafrica.onrender.com/api/products/${product.id}/images`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!uploadResponse.ok) throw new Error('Image upload failed');
      }

      setSuccess('Product created successfully!');
      setProductData({ name: '', price: '', description: '' });
      setImageFile(null);

    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Create Product</h2>

        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="mb-4 border-b-2 border-gray-300 focus:border-black w-full p-2 outline-none"
        />
        <input
          type="text"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price"
          className="mb-4 border-b-2 border-gray-300 focus:border-black w-full p-2 outline-none"
        />
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Description"
          className="mb-4 border-b-2 border-gray-300 focus:border-black w-full p-2 outline-none"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        <button
          type="submit"
          className="w-full bg-[#4F225E] text-white py-2 rounded-md hover:bg-[#3b1845]"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default AdminProducts;
