import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const router = useRouter();
  const [dataForm, setDataForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('https://martafrica.onrender.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: dataForm.email,
          password: dataForm.password,
        }),
      });

      const data = await response.json().catch(() => ({}));
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store token and user info
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      //  Redirect to profile page
      router.push('/Profile');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-black">Login</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex flex-col mb-6">
          <label className="text-gray-500 font-semibold text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={dataForm.email}
            onChange={handleChange}
            placeholder="hamazin@gmail.com"
            className="border-none border-b-2 border-gray-300 focus:outline-none focus:border-black text-black text-sm tracking-wide shadow-sm"
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-gray-500 font-semibold text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={dataForm.password}
            onChange={handleChange}
            placeholder="*********"
            className="border-none border-b-2 border-gray-300 focus:outline-none focus:border-black text-black text-sm tracking-wide shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#4F225E] text-white font-semibold text-lg rounded-xl py-3 mb-4 hover:bg-[#3b1845] transition-colors"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
