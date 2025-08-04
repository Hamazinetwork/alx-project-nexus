import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';

type SignUpFormData = {
  email: string;
  fullname: string;
  password: string;
  confirmPassword: string;
};

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://martafrica.onrender.com/api/admin/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullname: formData.fullname, 
          password: formData.password,
          password_confirm: formData.confirmPassword,
          is_admin: true 
        }),
      });

      const data = await response.json().catch(() => ({}));
      console.log("Response status:", response.status, "Response:", data);

      if (!response.ok) {
        throw new Error(data.message || `Signup failed with ${response.status}`);
      }

      setSuccess('Signup successful!');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-black">Signup</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <div className="flex flex-col mb-6">
          <label className="text-gray-500 font-semibold text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="hamazin@gmail.com"
            className="border-none border-b-2 border-gray-300 focus:outline-none focus:border-black text-black text-sm tracking-wide shadow-sm"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-gray-500 font-semibold text-sm mb-1">Fullname</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="hademola hamazin"
            className="border-none border-b-2 border-gray-300 focus:outline-none focus:border-black text-black text-sm tracking-wide shadow-sm"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-gray-500 font-semibold text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="*********"
            className="border-none border-b-2 border-gray-300 focus:outline-none focus:border-black text-black text-sm tracking-wide shadow-sm"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-gray-500 font-semibold text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="*********"
            className="border-none border-b-2 border-gray-300 focus:outline-none focus:border-black text-black text-sm tracking-wide shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4F225E] text-white font-semibold text-lg rounded-xl py-3 mb-4 hover:bg-[#3b1845] transition-colors"
        >
          Signup
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/Login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
