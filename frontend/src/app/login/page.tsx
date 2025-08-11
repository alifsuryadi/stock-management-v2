// frontend/src/app/login/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  EnvelopeIcon,
  LockClosedIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const demoCredentials = {
    email: "admin@example.com",
    password: "password",
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    toast.success("Demo credentials filled! Click 'Sign in' to continue", {
      duration: 4000,
      icon: "🚀",
    });
  };

  const showDemoInfo = () => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <InformationCircleIcon className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-gray-900">Demo Account</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>
              <strong>Email:</strong> admin@example.com
            </div>
            <div>
              <strong>Password:</strong> password
            </div>
          </div>
          <button
            onClick={() => {
              fillDemoCredentials();
              toast.dismiss(t.id);
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Auto Fill
          </button>
        </div>
      ),
      {
        duration: 8000,
        style: {
          background: "white",
          color: "#1f2937",
          maxWidth: "300px",
        },
      }
    );
  };

  useEffect(() => {
    // Show demo credentials info after a short delay
    const timer = setTimeout(() => {
      showDemoInfo();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mb-6">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M12 11V7"
              />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Stock Management
          </h2>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="card-dark rounded-xl p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                label="Email Address"
                placeholder="Enter your email address"
                icon={EnvelopeIcon}
                required
              />

              <PasswordInput
                value={password}
                onChange={setPassword}
                label="Password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center py-4 text-base font-semibold mt-8"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-5 w-5 mr-2" />
                  <span>Sign in to your account</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
