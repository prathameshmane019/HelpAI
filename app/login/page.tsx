"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/api";
import { saveToken, getToken } from "@/lib/auth"; // getToken checks localStorage
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Lock, LogIn, Mail, Shield, User } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  // redirect if already logged in
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Payload", payload);
        if (payload.role === 'ADMIN') router.replace("/admin/dashboard");
        else if (payload.role === 'AGENT') router.replace("/agent/dashboard");
        else router.replace("/chat");
      } catch {
        localStorage.removeItem("token"); // invalid token
      }
    }
  }, [router, getToken]);

  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const token = await loginUser(form); // call backend
      saveToken(token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      toast.success("Login successful");

      // use router.replace instead of push to avoid back button issues
      if (payload.role === "ADMIN") router.replace("/admin/dashboard");
      else if (payload.role === "AGENT") router.replace("/agent/dashboard");
      else router.replace("/chat");
    } catch (err: any) {
      toast.error(err.response?.data || err.message || "Login failed");
      setError(err.response?.data || err.message || "Login failed");
    }
    finally {
    
      setIsLoading(false);
    }
  }

  return (
    <>
     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-foreground  to-primary p-12 items-center justify-center relative overflow-hidden">
          {/* Animated Background Circles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-white text-center max-w-lg">
            <div className="mb-8 flex justify-center">
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 border border-white/30 shadow-2xl">
                <Shield className="w-20 h-20" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Secure Access
            </h1>
            <p className="text-blue-100 text-xl leading-relaxed">
              Your trusted platform for seamless and protected authentication
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-12">
              
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-sm font-medium">
                🛡️ Always Secure
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-10">
               
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500 text-lg">Sign in to your account</p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 p-8 border border-gray-100">
              <div className="space-y-6">
                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <Input
                      placeholder="Enter your username"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="pl-12 h-14 text-base  "
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && form.username && form.password) {
                          handleLogin(e as any);
                        }
                      }}
                      className="pl-12 h-14 text-base border-gray-200 rounded-xl  "
                    />
                  </div>
                </div>

                {/* Login Button */}
                <Button 
                  onClick={handleLogin}
                  type='submit'
                  className="w-full h-14 hover:to-cyan-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-300 mt-8"
                  disabled={isLoading || !form.username || !form.password}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Sign In</span>
                      <LogIn className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Security Badge - Mobile Only */}
            <div className="lg:hidden mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Secured Connection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}