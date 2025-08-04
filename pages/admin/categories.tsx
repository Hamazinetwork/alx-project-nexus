import React, { useState, ChangeEvent, FormEvent } from 'react';

type CategoryForm = {
  name: string;
  description: string;
};

const CreateCategory: React.FC = () => {
  const [formData, setFormData] = useState<CategoryForm>({ name: '', description: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    try {
      const token = localStorage.getItem('token'); // Ensure you're logged in as admin

      const response = await fetch('https://martafrica.onrender.com/api/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create category');

      setMessage('Category created successfully!');
      setFormData({ name: '', description: '' });
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Category</h2>

        {message && <p className="mb-4 text-center text-sm text-red-600">{message}</p>}

        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Category Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
        />

        <button type="submit" className="bg-purple-700 text-white w-full py-2 rounded hover:bg-purple-800">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
