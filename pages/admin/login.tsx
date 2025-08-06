import React, { useState, FormEvent } from "react";
import { useRouter } from "next/router";

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        "https://martafrica.onrender.com/api/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Admin login response:", data);

      if (!response.ok) throw new Error(data?.message || "Login failed");

      // ✅ Correctly extract token
      const token = data?.tokens?.access;
      if (!token) throw new Error("Token not received");

      // ✅ Save to localStorage
      localStorage.setItem("token", token);

      // ✅ Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#4F225E] text-white font-semibold rounded py-2 hover:bg-purple-800"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
