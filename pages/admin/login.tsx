
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";

type LoginForm = {
  email: string;
  password: string;
};

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "https://martafrica.onrender.com/api/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Admin Login Response:", data);

      if (!response.ok) throw new Error(data?.message || "Login failed");

      //  Save only access token
      if (data.tokens?.access) {
        localStorage.setItem("token", data.tokens.access);
        router.push("/admin/dashboard"); 
      } else {
        throw new Error("Token not received");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
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
          className="w-full bg-[#4F225E] text-white py-2 rounded hover:bg-purple-900"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
