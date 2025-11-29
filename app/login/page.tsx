"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/api";
import { saveToken, getToken } from "@/lib/auth"; // getToken checks localStorage
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  // redirect if already logged in
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Payload",payload);
        if (payload.role === 'ADMIN') router.replace("/admin/dashboard");
        else if (payload.role === 'AGENT') router.replace("/agent/dashboard");
        else router.replace("/chat");
      } catch {
        localStorage.removeItem("token"); // invalid token
      }
    }
  }, [router,getToken]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const token = await loginUser(form); // call backend
      saveToken(token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      // use router.replace instead of push to avoid back button issues
      if (payload.role === "ADMIN") router.replace("/admin/dashboard");
      else if (payload.role === "AGENT") router.replace("/agent/dashboard");
      else router.replace("/chat");
    } catch (err: any) {
      setError(err.response?.data || err.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 p-6 border rounded-xl bg-white"
      >
        <h2 className="text-xl font-semibold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <Input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
