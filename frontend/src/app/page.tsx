// frontend/src/app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

export default function HomePage() {
  const { admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (admin) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          {/* Animated Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-2xl animate-pulse">
              <Squares2X2Icon className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>

          <h1 className="text-4xl font-bold text-gradient mb-4">Stock Pro</h1>
          <p className="text-gray-300 text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return null;
}
