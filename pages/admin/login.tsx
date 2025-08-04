import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

type AdminLoginForm = {
  email: string;
  password: string;
};

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminLoginForm>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        "https://martafrica.onrender.com/api/admin/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Admin login failed");

      const data = await response.json();
      console.log("Admin login response:", data);

      // Save Token
      localStorage.setItem("token", data.token);

      // Redirect 
      router.push("/admin/dashboard");
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
        <h2 className="text-3xl font-extrabold mb-6 text-black">Admin Login</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <button
          type="submit"
          className="w-full bg-[#4F225E] text-white font-semibold text-lg rounded-xl py-3 hover:bg-[#3b1845]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
